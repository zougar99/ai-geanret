import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import type { AiModuleId } from "../types/ai-modules";
import type { MediaKind } from "../types/ai-modules";
import { getFormFieldsForModule } from "../config/module-forms";
import { DEFAULT_REPLICATE_MODEL, STYLE_PRESETS } from "../config/default-models";
import { loadSettings, saveSettings, type AppSettings } from "../lib/settings";
import {
  buildReplicateInput,
  type FieldValues,
  type FileValues,
} from "../lib/build-replicate-input";
import { createPrediction, waitForPrediction, cancelPrediction } from "../lib/replicate-api";
import { improvePromptWithLmStudio } from "../lib/lm-studio";
import { saveToGallery } from "../pages/Gallery";
import { useI18n } from "../context/LocaleContext";
import styles from "./PlaceholderForm.module.css";

type Props = {
  moduleId: AiModuleId;
  kind: MediaKind;
};

function fileToDataUrl(f: File, readErr: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error(readErr));
    r.readAsDataURL(f);
  });
}

function firstMediaUrl(out: unknown): { url: string; isVideo: boolean } | null {
  const pick = (u: string) => ({
    url: u,
    isVideo: /\.(mp4|webm|mov)(\?|$)/i.test(u) || u.includes("video"),
  });
  if (typeof out === "string" && out.startsWith("http")) return pick(out);
  if (Array.isArray(out)) {
    for (const item of out) {
      if (typeof item === "string" && item.startsWith("http")) return pick(item);
      if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        if (typeof obj.url === "string" && obj.url.startsWith("http")) return pick(obj.url);
        if (typeof obj.image === "string" && obj.image.startsWith("http")) return pick(obj.image);
        if (typeof obj.video === "string" && obj.video.startsWith("http")) return pick(obj.video);
      }
    }
  }
  if (out && typeof out === "object") {
    const obj = out as Record<string, unknown>;
    if (typeof obj.url === "string" && obj.url.startsWith("http")) return pick(obj.url);
    if (typeof obj.output === "string" && obj.output.startsWith("http")) return pick(obj.output);
    if (Array.isArray(obj.output)) {
      for (const item of obj.output) {
        if (typeof item === "string" && item.startsWith("http")) return pick(item);
      }
    }
  }
  return null;
}

export function GenerationForm({ moduleId, kind }: Props) {
  const { t } = useI18n();
  const form = getFormFieldsForModule(moduleId);
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [prompt, setPrompt] = useState("");
  const [negative, setNegative] = useState("");
  const [strength, setStrength] = useState(0.65);
  const [durationSec, setDurationSec] = useState(4);
  const [fps, setFps] = useState(24);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [maskFile, setMaskFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [customModel, setCustomModel] = useState(() => loadSettings().modelOverrides[moduleId] ?? "");
  const presetList = useMemo(() => STYLE_PRESETS.map((p, i) => ({ ...p, i })), []);
  const [presetIndex, setPresetIndex] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomModel(loadSettings().modelOverrides[moduleId] ?? "");
  }, [moduleId]);

  const effectiveModel = useMemo(() => {
    const trimmed = customModel.trim();
    if (trimmed) return trimmed;
    const p = STYLE_PRESETS[presetIndex];
    if (p) return kind === "photo" ? p.modelByKind.photo : p.modelByKind.video;
    return DEFAULT_REPLICATE_MODEL[moduleId];
  }, [customModel, presetIndex, kind, moduleId]);

  const [loading, setLoading] = useState(false);
  const [lmBusy, setLmBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; isVideo: boolean } | null>(null);
  const [progressText, setProgressText] = useState("");
  const cancelRef = useRef(false);
  const predictionIdRef = useRef<string | null>(null);

  useEffect(() => {
    const sync = () => setSettings(loadSettings());
    window.addEventListener("ai-geanret-settings", sync);
    return () => window.removeEventListener("ai-geanret-settings", sync);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        const active = document.activeElement;
        if (active && formRef.current?.contains(active)) {
          e.preventDefault();
          run();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const persistOverride = useCallback(() => {
    const s = loadSettings();
    const next = { ...s, modelOverrides: { ...s.modelOverrides } };
    if (customModel.trim()) next.modelOverrides[moduleId] = customModel.trim();
    else delete next.modelOverrides[moduleId];
    saveSettings(next);
    setSettings(next);
  }, [customModel, moduleId]);

  const run = async () => {
    setError(null);
    setResult(null);
    setProgressText(t("gen.running"));
    cancelRef.current = false;
    predictionIdRef.current = null;

    const token = loadSettings().replicateToken.trim();
    if (!token) {
      setError(t("gen.errNoToken"));
      setProgressText("");
      return;
    }

    const v: FieldValues = {
      prompt,
      negative,
      strength,
      durationSec,
      fps,
    };

    const files: FileValues = {};
    try {
      if (imageFile) files.imageDataUrl = await fileToDataUrl(imageFile, t("gen.fileReadErr"));
      if (maskFile) files.maskDataUrl = await fileToDataUrl(maskFile, t("gen.fileReadErr"));
      if (videoFile) files.videoDataUrl = await fileToDataUrl(videoFile, t("gen.fileReadErr"));

      const input = buildReplicateInput(moduleId, v, files);
      persistOverride();

      setLoading(true);
      const modelPath = effectiveModel;
      const { id } = await createPrediction(token, modelPath, input);
      predictionIdRef.current = id;
      if (cancelRef.current) return;

      const out = await waitForPrediction(token, id, {
        onProgress: (status) => setProgressText(`${t("gen.running")} (${status})`),
      });

      predictionIdRef.current = null;
      if (cancelRef.current) return;

      const media = firstMediaUrl(out);
      if (!media) {
        setError(`${t("gen.resultUnexpected")} ${JSON.stringify(out).slice(0, 400)}`);
        setProgressText("");
        return;
      }
      setResult(media);
      setProgressText("");

      saveToGallery({
        moduleId,
        prompt,
        url: media.url,
        isVideo: media.isVideo,
      });
    } catch (e) {
      if (cancelRef.current) return;
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
      setProgressText("");
      predictionIdRef.current = null;
    }
  };

  const cancel = async () => {
    cancelRef.current = true;
    if (predictionIdRef.current) {
      const token = loadSettings().replicateToken.trim();
      try {
        await cancelPrediction(token, predictionIdRef.current);
      } catch {
      }
    }
    setLoading(false);
    setProgressText("");
  };

  const improveWithLmStudio = async () => {
    const cfg = loadSettings();
    if (!cfg.lmStudioEnabled) return;
    setError(null);
    setLmBusy(true);
    try {
      const model = cfg.lmStudioModel.trim() || undefined;
      const next = await improvePromptWithLmStudio(
        cfg.lmStudioBaseUrl,
        model,
        prompt,
        kind
      );
      setPrompt(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLmBusy(false);
    }
  };

  const handleFileSelect = (
    setter: (f: File | null) => void,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setter(e.target.files?.[0] ?? null);
    e.target.value = "";
  };

  const download = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-geanret-${moduleId}-${Date.now()}`;
    a.click();
  };

  return (
    <div className={styles.form} ref={formRef}>
      <label className={styles.field}>
        <span className={styles.label}>{t("gen.styleLabel")}</span>
        <select
          className={styles.input}
          value={presetIndex}
          onChange={(e) => setPresetIndex(Number(e.target.value))}
        >
          {presetList.map((p) => (
            <option key={p.key} value={p.i}>
              {t(`gen.preset.${p.key}`)}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>{t("gen.customModel")}</span>
        <input
          className={styles.input}
          dir="ltr"
          placeholder={DEFAULT_REPLICATE_MODEL[moduleId]}
          value={customModel}
          onChange={(e) => setCustomModel(e.target.value)}
        />
      </label>

      <p className={styles.modelHint} dir="ltr">
        {t("gen.activeModel")} <strong>{effectiveModel}</strong>
      </p>

      {form.showPrompt && (
        <div className={styles.promptBlock}>
          <label className={styles.field}>
            <span className={styles.label}>{t("gen.promptLabel")}</span>
            <textarea
              className={styles.textarea}
              rows={3}
              placeholder={t("gen.promptPh")}
              dir="auto"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </label>
          {settings.lmStudioEnabled && (
            <div className={styles.lmRow}>
              <button
                type="button"
                className={styles.btnLm}
                disabled={lmBusy || loading}
                onClick={() => void improveWithLmStudio()}
              >
                {lmBusy ? t("gen.lmBusy") : t("gen.lmImprove")}
              </button>
            </div>
          )}
        </div>
      )}
      {form.showNegative && (
        <label className={styles.field}>
          <span className={styles.label}>{t("gen.negativeLabel")}</span>
          <textarea
            className={styles.textarea}
            rows={2}
            placeholder={t("gen.negativePh")}
            dir="auto"
            value={negative}
            onChange={(e) => setNegative(e.target.value)}
          />
        </label>
      )}
      {form.showImage && (
        <label className={styles.field}>
          <span className={styles.label}>{t("gen.srcImage")}</span>
          <input
            type="file"
            accept="image/*"
            className={styles.file}
            onChange={(e) => handleFileSelect(setImageFile, e)}
          />
        </label>
      )}
      {form.showVideo && (
        <label className={styles.field}>
          <span className={styles.label}>{t("gen.srcVideo")}</span>
          <input
            type="file"
            accept="video/*"
            className={styles.file}
            onChange={(e) => handleFileSelect(setVideoFile, e)}
          />
        </label>
      )}
      {form.showMask && (
        <label className={styles.field}>
          <span className={styles.label}>{t("gen.mask")}</span>
          <input
            type="file"
            accept="image/*"
            className={styles.file}
            onChange={(e) => handleFileSelect(setMaskFile, e)}
          />
        </label>
      )}
      {form.showStrength && (
        <label className={styles.field}>
          <span className={styles.label}>{t("gen.strength")}: {strength.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
            className={styles.range}
          />
        </label>
      )}
      {form.showDuration && (
        <label className={styles.field}>
          <span className={styles.label}>{t("gen.duration")}</span>
          <input
            type="number"
            min={1}
            max={60}
            value={durationSec}
            onChange={(e) => setDurationSec(Number(e.target.value))}
            className={styles.input}
          />
        </label>
      )}
      {form.showFps && (
        <label className={styles.field}>
          <span className={styles.label}>{t("gen.fps")}</span>
          <input
            type="number"
            min={8}
            max={60}
            value={fps}
            onChange={(e) => setFps(Number(e.target.value))}
            className={styles.input}
          />
        </label>
      )}

      <div className={styles.actions}>
        {loading ? (
          <button
            type="button"
            className={styles.btnCancel}
            onClick={cancel}
          >
            {t("gen.cancel")}
          </button>
        ) : (
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => void run()}
            disabled={loading}
          >
            {t("gen.run")}
          </button>
        )}
        <span className={styles.shortcutHint}>
          Ctrl+Enter
        </span>
        <span className={styles.hint}>
          {t("gen.keyOk")} {settings.replicateToken ? "✓" : "✗"}
        </span>
      </div>

      {progressText && (
        <div className={styles.progress}>
          <div className={styles.spinner} />
          <span>{progressText}</span>
        </div>
      )}

      {error && (
        <p className={styles.err} role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className={styles.result}>
          {result.isVideo ? (
            <video className={styles.media} src={result.url} controls playsInline />
          ) : (
            <img className={styles.media} src={result.url} alt={t("gen.altResult")} />
          )}
          <div className={styles.resultActions}>
            <a className={styles.linkDl} href={result.url} target="_blank" rel="noreferrer">
              {t("gen.openDownload")}
            </a>
            <button className={styles.linkDl} onClick={() => download(result.url)}>
              {t("gen.download")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
