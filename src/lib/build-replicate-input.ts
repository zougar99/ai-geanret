import type { AiModuleId } from "../types/ai-modules";

export type FieldValues = {
  prompt: string;
  negative: string;
  strength: number;
  durationSec: number;
  fps: number;
};

export type FileValues = {
  imageDataUrl?: string | null;
  maskDataUrl?: string | null;
  videoDataUrl?: string | null;
};

function requireImage(f: FileValues): string {
  if (!f.imageDataUrl) throw new Error("Upload a source image for this module.");
  return f.imageDataUrl;
}

export function buildReplicateInput(
  moduleId: AiModuleId,
  v: FieldValues,
  files: FileValues
): Record<string, unknown> {
  switch (moduleId) {
    case "txt2img": {
      const base = v.prompt || "landscape";
      const prompt = v.negative ? `${base} (avoid: ${v.negative})` : base;
      return { prompt, aspect_ratio: "1:1", num_outputs: 1, output_format: "webp" };
    }
    case "img2img":
      return { input_image: requireImage(files), instruction: v.prompt || "enhance and refine the image" };
    case "inpaint": {
      if (!files.maskDataUrl) throw new Error("Upload a mask (white = edit area).");
      return { image: requireImage(files), mask: files.maskDataUrl, prompt: v.prompt || "fill the masked region" };
    }
    case "outpaint":
      return { image: requireImage(files), mask: files.maskDataUrl ?? undefined, prompt: v.prompt || "extend the scene naturally" };
    case "upsc0ale1":
      return { image: requireImage(files), scale: 2 };
    case "face_enhance":
      return { img: requireImage(files), version: "v1.4", scale: 2 };
    case "remove_bg":
      return { image: requireImage(files) };
    case "style_transfer":
      return { input_image: requireImage(files), instruction: v.prompt || "apply artistic style" };
    case "super_res":
      return { image: requireImage(files), scale: 4 };
    case "colorize":
      return { img: requireImage(files) };
    case "depth":
      return { image: requireImage(files) };
    case "image_variations":
      return { image: requireImage(files) };
    case "background_replace":
      return { image: requireImage(files), prompt: v.prompt || "natural landscape background" };
    case "text_to_audio":
      return { text: v.prompt || "gentle piano melody" };
    case "txt2vid": {
      const frames = Math.min(100, Math.max(16, Math.round(v.fps * Math.min(v.durationSec, 5))));
      return { prompt: v.prompt || "cinematic shot", num_frames: frames, fps: Math.min(30, Math.max(8, Math.round(v.fps))) };
    }
    case "img2vid":
      return { input_image: requireImage(files), sizing_strategy: "maintain_aspect_ratio" };
    case "vid2vid":
      if (!files.videoDataUrl) throw new Error("Upload a source video.");
      return { prompt: v.prompt || "same motion, new look", video: files.videoDataUrl };
    default:
      return { prompt: v.prompt };
  }
}
