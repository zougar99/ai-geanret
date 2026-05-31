export type MediaKind = "photo" | "video";

export type AiModuleId =
  | "txt2img"
  | "img2img"
  | "inpaint"
  | "outpaint"
  | "upsc0ale1"
  | "face_enhance"
  | "remove_bg"
  | "style_transfer"
  | "super_res"
  | "colorize"
  | "depth"
  | "image_variations"
  | "background_replace"
  | "text_to_audio"
  | "txt2vid"
  | "img2vid"
  | "vid2vid";

export interface AiModuleMeta {
  id: AiModuleId;
  kind: MediaKind;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  description: string;
  descriptionFr: string;
  descriptionEn: string;
}

export const AI_MODULES: AiModuleMeta[] = [
  {
    id: "txt2img",
    kind: "photo",
    titleAr: "نص → صورة",
    titleFr: "Texte → image",
    titleEn: "Text → image",
    description: "وصف بالكلمات، توليد صورة جديدة.",
    descriptionFr: "Décrivez en mots, générez une nouvelle image.",
    descriptionEn: "Describe in words, generate a new image.",
  },
  {
    id: "img2img",
    kind: "photo",
    titleAr: "صورة → صورة",
    titleFr: "Image → image",
    titleEn: "Image → image",
    description: "تعديل صورة موجودة حسب الوصف أو القوة.",
    descriptionFr: "Modifier une image existante selon la description ou la force.",
    descriptionEn: "Edit an existing image from a prompt or strength.",
  },
  {
    id: "inpaint",
    kind: "photo",
    titleAr: "إعادة ملء منطقة",
    titleFr: "Inpainting",
    titleEn: "Inpainting",
    description: "تغيير جزء من الصورة مع الحفاظ على الباقي.",
    descriptionFr: "Modifier une zone tout en gardant le reste.",
    descriptionEn: "Change part of the image while keeping the rest.",
  },
  {
    id: "outpaint",
    kind: "photo",
    titleAr: "توسيع الإطار",
    titleFr: "Outpainting",
    titleEn: "Outpainting",
    description: "إكمال ما خارج حدود الصورة.",
    descriptionFr: "Étendre au-delà des bords de l’image.",
    descriptionEn: "Extend content beyond the image borders.",
  },
  {
    id: "upsc0ale1",
    kind: "photo",
    titleAr: "رفع الدقة",
    titleFr: "Upscale",
    titleEn: "Upscale",
    description: "زيادة الحجم والوضوح.",
    descriptionFr: "Augmenter taille et netteté.",
    descriptionEn: "Increase size and sharpness.",
  },
  {
    id: "face_enhance",
    kind: "photo",
    titleAr: "تحسين الوجوه",
    titleFr: "Restauration visage",
    titleEn: "Face enhancement",
    description: "تفاصيل أوضح للوجوه.",
    descriptionFr: "Visages plus nets et détaillés.",
    descriptionEn: "Clearer facial detail.",
  },
  {
    id: "remove_bg",
    kind: "photo",
    titleAr: "إزالة الخلفية",
    titleFr: "Suppression fond",
    titleEn: "Remove background",
    description: "قص الموضوع من الخلفية.",
    descriptionFr: "Découper le sujet du fond.",
    descriptionEn: "Cut out the subject from the background.",
  },
  {
    id: "style_transfer",
    kind: "photo",
    titleAr: "نقل الأسلوب",
    titleFr: "Transfert de style",
    titleEn: "Style transfer",
    description: "تطبيق أسلوب صورة على أخرى.",
    descriptionFr: "Appliquer le style d’une image à une autre.",
    descriptionEn: "Apply one image’s style to another.",
  },
  {
    id: "super_res",
    kind: "photo",
    titleAr: "دقة خارقة",
    titleFr: "Super résolution",
    titleEn: "Super resolution",
    description: "رفع الدقة بشكل مذهل باستخدام نموذج متطور.",
    descriptionFr: "Augmentation de résolution spectaculaire avec un modèle avancé.",
    descriptionEn: "Dramatic resolution boost using an advanced model.",
  },
  {
    id: "colorize",
    kind: "photo",
    titleAr: "تلوين الصور",
    titleFr: "Colorisation",
    titleEn: "Colorize",
    description: "إضافة ألوان طبيعية للصور القديمة بالأبيض والأسود.",
    descriptionFr: "Ajoutez des couleurs naturelles aux vieilles photos en noir et blanc.",
    descriptionEn: "Add natural colors to old black & white photos.",
  },
  {
    id: "depth",
    kind: "photo",
    titleAr: "خريطة العمق",
    titleFr: "Carte de profondeur",
    titleEn: "Depth map",
    description: "استخراج خريطة عمق ثلاثية الأبعاد من صورة.",
    descriptionFr: "Extraire une carte de profondeur 3D d'une image.",
    descriptionEn: "Extract a 3D depth map from an image.",
  },
  {
    id: "image_variations",
    kind: "photo",
    titleAr: "تنويعات صورة",
    titleFr: "Variations d'image",
    titleEn: "Image variations",
    description: "توليد نسخ مختلفة من صورة مصدر.",
    descriptionFr: "Générez différentes versions d'une image source.",
    descriptionEn: "Generate different versions of a source image.",
  },
  {
    id: "background_replace",
    kind: "photo",
    titleAr: "تبديل الخلفية",
    titleFr: "Changer le fond",
    titleEn: "Replace background",
    description: "تبديل خلفية الصورة بخلفية جديدة حسب الوصف.",
    descriptionFr: "Remplacez l'arrière-plan par une scène selon la description.",
    descriptionEn: "Replace the background with a new scene from a prompt.",
  },
  {
    id: "text_to_audio",
    kind: "photo",
    titleAr: "نص → صوت",
    titleFr: "Texte → audio",
    titleEn: "Text → audio",
    description: "توليد موسيقى أو مؤثرات صوتية من وصف نصي.",
    descriptionFr: "Générez de la musique ou des effets sonores à partir d'un texte.",
    descriptionEn: "Generate music or sound effects from a text description.",
  },
  {
    id: "txt2vid",
    kind: "video",
    titleAr: "نص → فيديو",
    titleFr: "Texte → vidéo",
    titleEn: "Text → video",
    description: "وصف مشهد، توليد مقطع قصير.",
    descriptionFr: "Décrivez une scène, générez un court clip.",
    descriptionEn: "Describe a scene, generate a short clip.",
  },
  {
    id: "img2vid",
    kind: "video",
    titleAr: "صورة → فيديو",
    titleFr: "Image → vidéo",
    titleEn: "Image → video",
    description: "تحريك صورة ثابتة أو إضافة حركة.",
    descriptionFr: "Animer une image fixe ou ajouter du mouvement.",
    descriptionEn: "Animate a still or add motion.",
  },
  {
    id: "vid2vid",
    kind: "video",
    titleAr: "فيديو → فيديو",
    titleFr: "Vidéo → vidéo",
    titleEn: "Video → video",
    description: "تغيير أسلوب أو مظهر فيديو موجود.",
    descriptionFr: "Changer le style ou l’apparence d’une vidéo.",
    descriptionEn: "Change the style or look of an existing video.",
  },
];
