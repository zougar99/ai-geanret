import { Link, useParams, Navigate } from "react-router-dom";
import { AI_MODULES } from "../types/ai-modules";
import type { MediaKind } from "../types/ai-modules";
import { ModulePanel } from "../components/ModulePanel";
import { GenerationForm } from "../components/GenerationForm";
import { useI18n } from "../context/LocaleContext";
import { moduleTitle } from "../lib/module-display";
import styles from "./MediaHub.module.css";

type Props = { kind: MediaKind };

const MODULE_ICONS: Record<string, string> = {
  txt2img: "🎨", img2img: "🖼️", inpaint: "🖌️", outpaint: "🌄",
  upsc0ale1: "🔍", face_enhance: "👤", remove_bg: "✂️", style_transfer: "✨",
  super_res: "🔬", colorize: "🌈", depth: "📐", image_variations: "🔀",
  background_replace: "🏞️", text_to_audio: "🎵",
  txt2vid: "🎬", img2vid: "🎞️", vid2vid: "📹",
};

export function MediaHub({ kind }: Props) {
  const { locale, t } = useI18n();
  const { moduleId } = useParams<{ moduleId?: string }>();
  const list = AI_MODULES.filter((m) => m.kind === kind);

  if (!moduleId) {
    const first = list[0];
    if (!first) return <Navigate to="/" replace />;
    return <Navigate to={`/${kind}/${first.id}`} replace />;
  }

  const current = list.find((m) => m.id === moduleId);
  if (!current) {
    const first = list[0];
    return first ? <Navigate to={`/${kind}/${first.id}`} replace /> : <Navigate to="/" replace />;
  }

  return (
    <div className={styles.layout}>
      <nav className={styles.side} aria-label={t("media.navAria")}>
        <p className={styles.sideTitle}>
          {kind === "photo" ? t("media.sidePhoto") : t("media.sideVideo")}
        </p>
        <ul className={styles.list}>
          {list.map((m) => (
            <li key={m.id}>
              <Link
                className={m.id === current.id ? styles.activeLink : styles.link}
                to={`/${kind}/${m.id}`}
              >
                <span className={styles.linkIcon}>{MODULE_ICONS[m.id] || "📷"}</span>
                {moduleTitle(m, locale)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className={styles.main}>
        <ModulePanel module={current}>
          <GenerationForm moduleId={current.id} kind={kind} />
        </ModulePanel>
      </main>
    </div>
  );
}
