import { Link } from "react-router-dom";
import { AI_MODULES } from "../types/ai-modules";
import { useI18n } from "../context/LocaleContext";
import { moduleDescription, moduleTitle } from "../lib/module-display";
import styles from "./Home.module.css";

const MODULE_ICONS: Record<string, string> = {
  txt2img: "🎨",
  img2img: "🖼️",
  inpaint: "🖌️",
  outpaint: "🌄",
  upsc0ale1: "🔍",
  face_enhance: "👤",
  remove_bg: "✂️",
  style_transfer: "✨",
  super_res: "🔬",
  colorize: "🌈",
  depth: "📐",
  image_variations: "🔀",
  background_replace: "🏞️",
  text_to_audio: "🎵",
  txt2vid: "🎬",
  img2vid: "🎞️",
  vid2vid: "📹",
};

export function Home() {
  const { locale, t } = useI18n();
  const photos = AI_MODULES.filter((m) => m.kind === "photo");
  const videos = AI_MODULES.filter((m) => m.kind === "video");

  return (
    <div className={styles.wrap}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.h1}>AI Geanret</h1>
          <p className={styles.lead}>{t("home.lead")}</p>
          <div className={styles.cta}>
            <Link className={styles.btnPrimary} to="/photo/txt2img">
              {t("home.ctaPhoto")}
            </Link>
            <Link className={styles.btnGhost} to="/video/txt2vid">
              {t("home.ctaVideo")}
            </Link>
            <Link className={styles.btnGhost} to="/chat">
              {t("nav.chat")}
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>{t("home.modulesPhoto")}</h2>
        <div className={styles.grid}>
          {photos.map((m) => (
            <Link key={m.id} className={styles.card} to={`/photo/${m.id}`}>
              <span className={styles.cardIcon}>{MODULE_ICONS[m.id] || "📷"}</span>
              <div className={styles.cardBody}>
                <strong className={styles.cardTitle}>{moduleTitle(m, locale)}</strong>
                <span className={styles.cardDesc}>{moduleDescription(m, locale)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>{t("home.modulesVideo")}</h2>
        <div className={styles.grid}>
          {videos.map((m) => (
            <Link key={m.id} className={styles.card} to={`/video/${m.id}`}>
              <span className={styles.cardIcon}>{MODULE_ICONS[m.id] || "🎥"}</span>
              <div className={styles.cardBody}>
                <strong className={styles.cardTitle}>{moduleTitle(m, locale)}</strong>
                <span className={styles.cardDesc}>{moduleDescription(m, locale)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
