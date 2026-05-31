# 🤖 AI Geanret

**AI Geanret** is a desktop application for AI-powered **image, video, and audio** generation. It provides a unified interface to **[Replicate.com](https://replicate.com)** cloud models with optional local **LM Studio** integration for prompt enhancement.

> 🌍 Interface available in **العربية** | **Français** | **English**

---

## ✨ Features

### 🎨 Image Generation
| Module | Description |
|---|---|
| `txt2img` | Text → Image generation |
| `img2img` | Image → Image editing |
| `inpaint` | Inpainting (fill masked area) |
| `outpaint` | Outpainting (extend canvas) |
| `upsc0ale1` | Upscaling (boost resolution) |
| `face_enhance` | Face enhancement / restoration |
| `remove_bg` | Remove image background |
| `style_transfer` | Apply artistic style to image |
| `super_res` | 🔬 Super resolution (×4) |
| `colorize` | 🌈 Colorize old B&W photos |
| `depth` | 📐 3D depth map extraction |
| `image_variations` | 🔀 Generate image variations |
| `background_replace` | 🏞️ Replace background with AI |

### 🎬 Video Generation
| Module | Description |
|---|---|
| `txt2vid` | Text → Video generation |
| `img2vid` | Image → Video animation |
| `vid2vid` | Video → Video style transfer |

### 🎵 Audio Generation
| Module | Description |
|---|---|
| `text_to_audio` | Text → Music / sound effects |

### 💬 AI Chat
Chat with a language model via **LM Studio** to refine prompts, get creative ideas, or discuss AI generation.

### 🖼️ Gallery
All generated results are automatically saved to a local gallery with download support.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- A [Replicate](https://replicate.com) API token (free tier available)

### Install & Run

```bash
# Install dependencies
npm install

# Development mode (browser only)
npm run dev

# Development mode (Electron desktop)
npm run dev:app

# Production desktop build
npm run start:desktop
```

### Build for Windows

```bash
# Windows installer
npm run pack:win

# Portable .exe
npm run pack:portable
```

---

## ⚙️ Configuration

Open **Settings** (⚙️) from the navigation bar:

| Setting | Description |
|---|---|
| 🌐 **Language** | العربية / Français / English |
| 🔑 **Replicate Token** | Your API key from replicate.com |
| 🧠 **LM Studio** | Enable local LLM for prompt improvement + chat |
| 📦 **Custom Models** | Override default Replicate model per module |

---

## 🧠 LM Studio Integration

1. Download & install [LM Studio](https://lmstudio.ai/)
2. Load a model (e.g. Mistral, Llama, Phi)
3. Start the **Local Server** (usually `http://127.0.0.1:1234`)
4. Enable LM Studio in app **Settings**
5. Use **Improve prompt** button or **AI Chat** page

---

## 🏗️ Tech Stack

| Technology | Role |
|---|---|
| ⚛️ **React 19** | UI framework |
| 🏎️ **Vite 6** | Build tool |
| 🖥️ **Electron 35** | Desktop wrapper |
| 🎨 **CSS Modules** | Styling |
| ☁️ **Replicate API** | Cloud AI models |
| 🏠 **LM Studio** | Local LLM (OpenAI-compatible) |
| 🌍 **react-router-dom** | Routing |
| 🗄️ **localStorage** | Settings & gallery persistence |

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
├── config/            # Module config & model defaults
├── context/           # React context (i18n)
├── lib/               # API clients & utilities
├── locales/           # Translation tables (ar/fr/en)
├── pages/             # Page components
├── styles/            # Global CSS
└── types/             # TypeScript types & module definitions
```

---

## 📝 License

MIT
