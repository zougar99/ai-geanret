import { useState, useEffect } from "react";
import { useI18n } from "../context/LocaleContext";
import { moduleTitle } from "../lib/module-display";
import { AI_MODULES } from "../types/ai-modules";
import type { AiModuleId } from "../types/ai-modules";
import styles from "./Gallery.module.css";

export type GalleryItem = {
  id: number;
  moduleId: AiModuleId;
  prompt: string;
  url: string;
  isVideo: boolean;
  date: string;
};

const STORAGE_KEY = "ai-geanret-gallery";

export function loadGallery(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToGallery(item: Omit<GalleryItem, "id" | "date">) {
  const items = loadGallery();
  const newItem: GalleryItem = {
    ...item,
    id: Date.now(),
    date: new Date().toISOString(),
  };
  items.unshift(newItem);
  if (items.length > 100) items.length = 100;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("ai-geanret-gallery"));
  return newItem;
}

export function Gallery() {
  const { t, locale } = useI18n();
  const [items, setItems] = useState<GalleryItem[]>(() => loadGallery());

  useEffect(() => {
    const handler = () => setItems(loadGallery());
    window.addEventListener("ai-geanret-gallery", handler);
    return () => window.removeEventListener("ai-geanret-gallery", handler);
  }, []);

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setItems([]);
    window.dispatchEvent(new Event("ai-geanret-gallery"));
  };

  const download = (url: string, moduleId: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${moduleId}-${Date.now()}`;
    a.click();
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t("gallery.title")}</h2>
          {items.length > 0 && (
            <button className={styles.clearBtn} onClick={clear}>
              {t("gallery.clear")}
            </button>
          )}
        </div>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🖼️</div>
            <p>{t("gallery.empty")}</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((item) => {
              const mod = AI_MODULES.find((m) => m.id === item.moduleId);
              return (
                <div key={item.id} className={styles.card}>
                  {item.isVideo ? (
                    <video
                      className={styles.media}
                      src={item.url}
                      controls
                      playsInline
                    />
                  ) : (
                    <img
                      className={styles.media}
                      src={item.url}
                      alt={item.prompt}
                      loading="lazy"
                    />
                  )}
                  <div className={styles.info}>
                    <span className={styles.module}>
                      {mod ? moduleTitle(mod, locale) : item.moduleId}
                    </span>
                    <span className={styles.date}>
                      {new Date(item.date).toLocaleDateString(locale === "ar" ? "ar-SA" : locale === "fr" ? "fr-FR" : "en-US")}
                    </span>
                  </div>
                  <p className={styles.prompt}>{item.prompt || "\u00A0"}</p>
                  <div className={styles.actions}>
                    <a
                      className={styles.actionBtn}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("gen.openDownload")}
                    </a>
                    <button
                      className={styles.actionBtn}
                      onClick={() => download(item.url, item.moduleId)}
                    >
                      {t("gen.download")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
