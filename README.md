# 🤖 ai-geanret — AI Geanret — Desktop app for AI-powered photo, video, and audio generation via Replicate + LM Studio APIs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/zougar99/ai-geanret/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/zougar99/ai-geanret?style=social)](https://github.com/zougar99/ai-geanret)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-blue)](https://github.com/zougar99/ai-geanret)

> AI Geanret — Desktop app for AI-powered photo, video, and audio generation via Replicate + LM Studio APIs.

---

## 📖 Table of Contents
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [FAQ](#-faq)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features
- ✔ **AI Image Generation** — Text-to-image via Stable Diffusion, DALL-E, Midjourney
- ✔ **Video Generation** — AI video creation with motion synthesis
- ✔ **Audio Generation** — Text-to-speech, music generation, voice cloning
- ✔ **Multi-Engine** — Supports Replicate, LM Studio, OpenAI APIs
- ✔ **Batch Processing** — Generate multiple assets in parallel
- ✔ **Gallery** — Built-in library to browse, organize, export generations
- ✔ **Prompt Library** — Save, tag, and reuse prompts
- ✔ **Export** — PNG, JPG, MP4, WAV with configurable quality

---

## 🔮 How It Works

```
  Input ──► Processing Pipeline ──► Output
  ┌────────┐   ┌────────┐   ┌────────┐
  │ Data   │──►│ Engine │──►│ Result │
  │ Source │   │ Logic  │   │        │
  └────────┘   └────────┘   └────────┘
```

1. **Input** — Load data from file, API, or user input
2. **Process** — Core engine applies logic/analysis/transformation
3. **Output** — Results displayed in UI, saved to file, or sent via API

---

## 💻 Tech Stack

| Component | Technology |
|-----------|-----------|
| Language | Python 3.10+ |
| UI | CustomTkinter |
| AI | Replicate API + LM Studio |
| Media | Pillow + FFmpeg |
| Platform | Windows / Linux |

---

## 🚀 Installation

```bash
git clone https://github.com/zougar99/ai-geanret.git
cd ai-geanret
pip install -r requirements.txt
```

---

## 📄 Configuration

Create a `config.yaml` or `.env` file in the project root:

```yaml
# Application settings
debug: false
port: 8080
theme: dark
language: en
```

---

## 🧰 Usage Guide

1. Launch the app: `python main.py`
2. Select an engine (Replicate / LM Studio)
3. Enter your prompt and click **Generate**
4. Browse results in the Gallery tab

---

## 🖼 Screenshots

> *(Screenshots coming soon. PRs welcome!)*

---

## 🔄 Roadmap

- 🟢 Web dashboard
- 🟡 Mobile companion app
- ⚫ API access
- ⚫ Plugin system
- ⚫ Multi-language support

---

## ❓ FAQ

### Which API keys do I need?
At minimum, a Replicate API token. For LM Studio, no key needed (local).

### Can I run locally?
Yes — use LM Studio with local models for offline generation.

---

## 🚧 Troubleshooting

| Problem | Solution |
|---------|----------|
| **App won't start** | Check Python version (3.10+); run `pip install -r requirements.txt` |
| **No output** | Check logs in `logs/` folder; enable debug mode in config |
| **Performance issues** | Close other applications; reduce batch size in config |
| **Dependency errors** | Create fresh venv: `python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt` |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📐 License
Distributed under the **MIT License**. See [`LICENSE`](https://github.com/zougar99/ai-geanret/blob/main/LICENSE) for more information.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/zougar99">zougar99</a>
</p>
