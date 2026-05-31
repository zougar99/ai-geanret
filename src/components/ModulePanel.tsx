import type { AiModuleMeta } from "../types/ai-modules";
import { useI18n } from "../context/LocaleContext";
import { moduleDescription, moduleTitle } from "../lib/module-display";
import styles from "./ModulePanel.module.css";

type Props = {
  module: AiModuleMeta;
  children?: React.ReactNode;
};

export function ModulePanel({ module, children }: Props) {
  const { locale } = useI18n();
  const sub =
    locale === "ar" ? module.titleFr : locale === "fr" ? module.titleEn : module.titleFr;

  return (
    <section className={styles.panel} aria-labelledby={`mod-${module.id}`}>
      <header className={styles.header}>
        <h2 id={`mod-${module.id}`} className={styles.title}>
          {moduleTitle(module, locale)}
          <span className={styles.sub}>{sub}</span>
        </h2>
        <p className={styles.desc}>{moduleDescription(module, locale)}</p>
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
