export {};

type ReplicateFetchResult = {
  ok: boolean;
  status: number;
  data: unknown;
};

declare global {
  interface Window {
    aiGeanret?: {
      replicateFetch: (
        pathname: string,
        init?: { method?: string; headers?: Record<string, string>; body?: string | null }
      ) => Promise<ReplicateFetchResult>;
      localLlmFetch?: (
        url: string,
        init?: { method?: string; headers?: Record<string, string>; body?: string | null }
      ) => Promise<ReplicateFetchResult>;
    };
  }
}
