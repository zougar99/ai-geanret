import type { AiModuleId } from "../types/ai-modules";

export function getFormFieldsForModule(id: AiModuleId) {
  switch (id) {
    case "txt2img":
      return { showPrompt: true, showNegative: true } as const;
    case "img2img":
      return { showPrompt: true, showNegative: true, showImage: true, showStrength: true } as const;
    case "inpaint":
      return { showPrompt: true, showImage: true, showMask: true, showStrength: true } as const;
    case "outpaint":
      return { showPrompt: true, showImage: true, showStrength: true } as const;
    case "upsc0ale1":
      return { showPrompt: false, showImage: true } as const;
    case "face_enhance":
      return { showPrompt: false, showImage: true } as const;
    case "remove_bg":
      return { showPrompt: false, showImage: true } as const;
    case "style_transfer":
      return { showPrompt: true, showImage: true, showStrength: true } as const;
    case "super_res":
      return { showPrompt: false, showImage: true } as const;
    case "colorize":
      return { showPrompt: false, showImage: true } as const;
    case "depth":
      return { showPrompt: false, showImage: true } as const;
    case "image_variations":
      return { showPrompt: false, showImage: true } as const;
    case "background_replace":
      return { showPrompt: true, showImage: true } as const;
    case "text_to_audio":
      return { showPrompt: true } as const;
    case "txt2vid":
      return { showPrompt: true, showNegative: true, showDuration: true, showFps: true } as const;
    case "img2vid":
      return { showPrompt: true, showImage: true, showDuration: true, showFps: true, showStrength: true } as const;
    case "vid2vid":
      return { showPrompt: true, showVideo: true, showDuration: true, showFps: true } as const;
    default:
      return { showPrompt: true } as const;
  }
}
