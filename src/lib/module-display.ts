import type { AiModuleMeta } from "../types/ai-modules";
import type { AppLocale } from "./settings";

export function moduleTitle(m: AiModuleMeta, locale: AppLocale): string {
  if (locale === "fr") return m.titleFr;
  if (locale === "en") return m.titleEn;
  return m.titleAr;
}

export function moduleDescription(m: AiModuleMeta, locale: AppLocale): string {
  if (locale === "fr") return m.descriptionFr;
  if (locale === "en") return m.descriptionEn;
  return m.description;
}
