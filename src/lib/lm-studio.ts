import type { MediaKind } from "../types/ai-modules";

type FetchResult = { ok: boolean; status: number; data: unknown };

async function postLocalOpenAI(url: string, body: Record<string, unknown>): Promise<FetchResult> {
  const init = {
    method: "POST" as const,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  if (typeof window !== "undefined" && window.aiGeanret?.localLlmFetch) {
    return window.aiGeanret.localLlmFetch(url, {
      method: init.method,
      headers: init.headers,
      body: init.body,
    });
  }

  const res = await fetch(url, init);
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { ok: res.ok, status: res.status, data };
}

function extractChatText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const d = data as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
  };
  if (d.error?.message) throw new Error(d.error.message);
  const c = d.choices?.[0]?.message?.content;
  return typeof c === "string" ? c.trim() : "";
}

/**
 * تحسين الوصف عبر LM Studio (نفس مسار OpenAI: /v1/chat/completions).
 * شغّل النموذج في LM Studio ثم فعّل الربط من إعدادات التطبيق.
 */
export async function improvePromptWithLmStudio(
  baseUrl: string,
  model: string | undefined,
  currentPrompt: string,
  kind: MediaKind
): Promise<string> {
  const base = baseUrl.replace(/\/$/, "");
  const url = `${base}/v1/chat/completions`;
  const media = kind === "photo" ? "image" : "video";
  const system = `You improve prompts for AI ${media} generation. Keep the same language as the user (Arabic, French, English, Darija, etc.). Reply with ONLY the improved prompt text — no quotes, no explanation, under 200 words.`;

  const userText = currentPrompt.trim() || (kind === "photo" ? "creative scene" : "short cinematic clip");

  const payload: Record<string, unknown> = {
    messages: [
      { role: "system", content: system },
      { role: "user", content: userText },
    ],
    temperature: 0.5,
    stream: false,
  };
  const m = model?.trim();
  if (m) payload.model = m;

  const res = await postLocalOpenAI(url, payload);
  if (!res.ok) {
    const detail =
      typeof res.data === "object" && res.data && "detail" in res.data
        ? String((res.data as { detail: unknown }).detail)
        : JSON.stringify(res.data);
    throw new Error(detail || `HTTP ${res.status}`);
  }

  const text = extractChatText(res.data);
  if (!text) throw new Error("LM Studio: empty reply — check model is loaded.");
  return text.replace(/^["']|["']$/g, "").trim();
}
