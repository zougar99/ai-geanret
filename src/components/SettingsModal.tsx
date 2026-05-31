import { useEffect, useState } from "react";
import type { AppLocale, AppSettings } from "../lib/settings";
import { loadSettings, saveSettings } from "../lib/settings";
import { useI18n } from "../context/LocaleContext";
import { translate } from "../locales/ui";
import styles from "./SettingsModal.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SettingsModal({ open, onClose }: Props) {
  const { setLocale } = useI18n();
  const [s, setS] = useState<AppSettings>(() => loadSettings());

  useEffect(() => {
    if (open) setS(loadSettings());
  }, [open]);

  if (!open) return null;

  const tx = (key: string) => translate(s.locale, key);

  const onSave = () => {
    saveSettings(s);
    setLocale(s.locale);
    onClose();
  };

  const setLocaleField = (locale: AppLocale) => {
    setS((prev) => ({ ...prev, locale }));
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className={styles.modal}>
        <header className={styles.head}>
          <h2 id="settings-title">{tx("settings.title")}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label={tx("settings.close")}>
            ×
          </button>
        </header>
        <div className={styles.body}>
          <label className={styles.field}>
            <span className={styles.label}>{tx("settings.language")}</span>
            <select
              className={styles.input}
              value={s.locale}
              onChange={(e) => setLocaleField(e.target.value as AppLocale)}
            >
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </label>

          <p className={styles.note}>{tx("settings.noteCloud")}</p>

          <label className={styles.field}>
            <span className={styles.label}>{tx("settings.replicateLabel")}</span>
            <input
              type="password"
              className={styles.input}
              autoComplete="off"
              placeholder="r8_..."
              value={s.replicateToken}
              onChange={(e) => setS({ ...s, replicateToken: e.target.value })}
            />
            <span className={styles.hint}>{tx("settings.replicateHint")}</span>
          </label>

          <section className={styles.lmSection} aria-labelledby="lm-studio-title">
            <h3 id="lm-studio-title" className={styles.lmHeading}>
              {tx("settings.lmTitle")}
            </h3>
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={s.lmStudioEnabled}
                onChange={(e) => setS({ ...s, lmStudioEnabled: e.target.checked })}
              />
              <span>{tx("settings.lmEnable")}</span>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>{tx("settings.lmUrl")}</span>
              <input
                className={styles.input}
                dir="ltr"
                placeholder="http://127.0.0.1:1234"
                value={s.lmStudioBaseUrl}
                onChange={(e) => setS({ ...s, lmStudioBaseUrl: e.target.value.trim() })}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>{tx("settings.lmModel")}</span>
              <input
                className={styles.input}
                dir="ltr"
                placeholder="e.g. mistral-7b-instruct"
                value={s.lmStudioModel}
                onChange={(e) => setS({ ...s, lmStudioModel: e.target.value })}
              />
            </label>
            <p className={styles.noteSmall}>{tx("settings.lmHint")}</p>
          </section>

          <p className={styles.noteSmall}>{tx("settings.googleNote")}</p>

          <section className={styles.install}>
            <h3 className={styles.installTitle}>{tx("settings.installTitle")}</h3>
            <p className={styles.installBody}>{tx("settings.installBody")}</p>
          </section>
        </div>
        <footer className={styles.footer}>
          <button type="button" className={styles.btnGhost} onClick={onClose}>
            {tx("settings.cancel")}
          </button>
          <button type="button" className={styles.btnPrimary} onClick={onSave}>
            {tx("settings.save")}
          </button>
        </footer>
      </div>
    </div>
  );
}
