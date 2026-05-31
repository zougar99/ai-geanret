export async function replicateRequest(
  pathname: string,
  token: string,
  init?: { method?: string; body?: unknown }
): Promise<{ ok: boolean; status: number; data: unknown }> {
  const headers: Record<string, string> = {
    Authorization: `Token ${token}`,
    "Content-Type": "application/json",
  };
  const body =
    init?.body !== undefined && init.body !== null ? JSON.stringify(init.body) : undefined;

  if (typeof window !== "undefined" && window.aiGeanret?.replicateFetch) {
    return window.aiGeanret.replicateFetch(pathname, {
      method: init?.method || (body ? "POST" : "GET"),
      headers,
      body: body ?? null,
    });
  }

  const prefix = import.meta.env.DEV ? "/api/replicate" : "https://api.replicate.com";
  const url = `${prefix}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  const res = await fetch(url, {
    method: init?.method || (body ? "POST" : "GET"),
    headers,
    body,
  });
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { ok: res.ok, status: res.status, data };
}

export async function getLatestModelVersionId(
  token: string,
  owner: string,
  name: string
): Promise<string> {
  const cacheKey = `${owner}/${name}`;
  const cached = versionCache.get(cacheKey);
  if (cached) return cached;
  const path = `/v1/models/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
  const { ok, data } = await replicateRequest(path, token);
  if (!ok || !data || typeof data !== "object") {
    throw new Error(
      typeof data === "object" && data && "detail" in data
        ? String((data as { detail?: string }).detail)
        : "Failed to fetch model — check owner/name or token."
    );
  }
  const latest = (data as { latest_version?: { id?: string } }).latest_version?.id;
  if (!latest) throw new Error("Model has no latest_version.");
  versionCache.set(cacheKey, latest);
  return latest;
}

const versionCache = new Map<string, string>();

function parseOwnerName(modelPath: string): { owner: string; name: string } {
  const parts = modelPath.split("/").filter(Boolean);
  if (parts.length < 2) throw new Error('Model must be in "owner/name" format.');
  const name = parts.pop()!;
  const owner = parts.join("/");
  return { owner, name };
}

export async function createPrediction(
  token: string,
  modelPath: string,
  input: Record<string, unknown>
): Promise<{ id: string }> {
  const { owner, name } = parseOwnerName(modelPath);
  const version = await getLatestModelVersionId(token, owner, name);
  const { ok, data } = await replicateRequest("/v1/predictions", token, {
    method: "POST",
    body: { version, input },
  });
  if (!ok || !data || typeof data !== "object" || !("id" in data)) {
    const detail =
      typeof data === "object" && data && "detail" in data
        ? JSON.stringify((data as { detail: unknown }).detail)
        : JSON.stringify(data);
    throw new Error(detail || "Failed to create prediction.");
  }
  return { id: String((data as { id: string }).id) };
}

export async function getPrediction(token: string, id: string): Promise<{
  status: string;
  output: unknown;
  error: unknown;
}> {
  const { ok, data } = await replicateRequest(`/v1/predictions/${encodeURIComponent(id)}`, token);
  if (!ok || !data || typeof data !== "object") {
    throw new Error("Failed to read prediction status.");
  }
  const d = data as { status: string; output?: unknown; error?: unknown };
  return { status: d.status, output: d.output, error: d.error };
}

export async function cancelPrediction(token: string, id: string): Promise<void> {
  await replicateRequest(`/v1/predictions/${encodeURIComponent(id)}/cancel`, token, {
    method: "POST",
  });
}

export async function waitForPrediction(
  token: string,
  id: string,
  opts?: { maxWaitMs?: number; intervalMs?: number; onProgress?: (status: string) => void }
): Promise<unknown> {
  const maxWait = opts?.maxWaitMs ?? 15 * 60_000;
  const interval = opts?.intervalMs ?? 1500;
  const start = Date.now();
  for (;;) {
    const p = await getPrediction(token, id);
    opts?.onProgress?.(p.status);
    if (p.status === "succeeded") return p.output;
    if (p.status === "failed" || p.status === "canceled") {
      throw new Error(p.error ? JSON.stringify(p.error) : "Generation failed.");
    }
    if (Date.now() - start > maxWait) throw new Error("Wait timeout exceeded.");
    await new Promise((r) => setTimeout(r, interval));
  }
}
