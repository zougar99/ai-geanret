import type { AiModuleId } from "../types/ai-modules";

const KEY = "ai-geanret-settings-v1";

export type AppLocale = "ar" | "fr" | "en";

export type AppSettings = {
  locale: AppLocale;
  replicateToken: string;
  /** owner/name لكل وحدة — إن وُجد يُستخدم بدل الافتراضي */
  modelOverrides: Partial<Record<AiModuleId, string>>;
  /** ربط LM Studio (واجهة OpenAI محلية) */
  lmStudioEnabled: boolean;
  /** مثال: http://127.0.0.1:1234 */
  lmStudioBaseUrl: string;
  /** اختياري — اسم النموذج كما يظهر في LM Studio */
  lmStudioModel: string;
};

const defaultSettings: AppSettings = {
  locale: "ar",
  replicateToken: "",
  modelOverrides: {},
  lmStudioEnabled: false,
  lmStudioBaseUrl: "http://127.0.0.1:1234",
  lmStudioModel: "",
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaultSettings };
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    const loc = parsed.locale;
    const locale: AppLocale =
      loc === "ar" || loc === "fr" || loc === "en" ? loc : "ar";
    const baseUrl =
      typeof parsed.lmStudioBaseUrl === "string" && parsed.lmStudioBaseUrl.startsWith("http")
        ? parsed.lmStudioBaseUrl.replace(/\/$/, "")
        : defaultSettings.lmStudioBaseUrl;
    return {
      locale,
      replicateToken: typeof parsed.replicateToken === "string" ? parsed.replicateToken : "",
      modelOverrides:
        parsed.modelOverrides && typeof parsed.modelOverrides === "object"
          ? (parsed.modelOverrides as AppSettings["modelOverrides"])
          : {},
      lmStudioEnabled: parsed.lmStudioEnabled === true,
      lmStudioBaseUrl: baseUrl,
      lmStudioModel: typeof parsed.lmStudioModel === "string" ? parsed.lmStudioModel : "",
    };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(s: AppSettings): void {
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("ai-geanret-settings"));
}
