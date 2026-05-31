import type { AiModuleId } from "../types/ai-modules";

export const DEFAULT_REPLICATE_MODEL: Record<AiModuleId, string> = {
  txt2img: "black-forest-labs/flux-schnell",
  img2img: "timothybrooks/instruct-pix2pix",
  inpaint: "andreasjansson/stable-diffusion-inpainting",
  outpaint: "andreasjansson/stable-diffusion-inpainting",
  upsc0ale1: "nightmareai/real-esrgan",
  face_enhance: "tencentarc/gfpgan",
  remove_bg: "cjwbw/rembg",
  style_transfer: "timothybrooks/instruct-pix2pix",
  super_res: "nightmareai/real-esrgan",
  colorize: "ioclab/siggraph2016-colorization",
  depth: "cjwbw/midas",
  image_variations: "lucataco/moondream2",
  background_replace: "timothybrooks/instruct-pix2pix",
  text_to_audio: "microsoft/speecht5_tts",
  txt2vid: "anotherjesse/zeroscope-v2-xl",
  img2vid: "stability-ai/stable-video-diffusion-img2vid",
  vid2vid: "anotherjesse/zeroscope-v2-xl",
};

export const STYLE_PRESETS: {
  key: "fast" | "quality" | "openVideo";
  modelByKind: { photo: string; video: string };
}[] = [
  {
    key: "fast",
    modelByKind: {
      photo: "black-forest-labs/flux-schnell",
      video: "anotherjesse/zeroscope-v2-xl",
    },
  },
  {
    key: "quality",
    modelByKind: {
      photo: "black-forest-labs/flux-dev",
      video: "anotherjesse/zeroscope-v2-xl",
    },
  },
  {
    key: "openVideo",
    modelByKind: {
      photo: "black-forest-labs/flux-schnell",
      video: "anotherjesse/zeroscope-v2-xl",
    },
  },
];
