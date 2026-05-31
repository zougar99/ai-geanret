const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

/** @type {BrowserWindow | null} */
let mainWindow = null;

/**
 * التطوير مع Vite: فقط عندما ELECTRON_DEV=1 (انظر npm run dev:app).
 * بدون هاد المتغير، نحمّل دائماً dist — حتى لو ما كانش التطبيق packaged
 * (مثلاً بعد npm run build ثم electron .).
 */
function useViteDevServer() {
  return process.env.ELECTRON_DEV === "1";
}

function getDistIndexPath() {
  return path.join(__dirname, "..", "dist", "index.html");
}

function getPreloadPath() {
  return path.join(__dirname, "preload.cjs");
}

/**
 * @param {string} pathname يجب أن يبدأ بـ /v1/
 * @param {{ method?: string, headers?: Record<string, string>, body?: string | null }} init
 */
ipcMain.handle("replicate-fetch", async (_event, pathname, init) => {
  if (typeof pathname !== "string" || !pathname.startsWith("/v1/")) {
    return { ok: false, status: 400, data: { detail: "مسار API غير مسموح" } };
  }
  const url = `https://api.replicate.com${pathname}`;
  try {
    const res = await fetch(url, {
      method: init?.method || "GET",
      headers: init?.headers || {},
      body: init?.body ?? undefined,
    });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, data: { detail: msg } };
  }
});

/** LM Studio / OpenAI-compatible محلي فقط (localhost) */
function isLocalhostUrl(urlString) {
  try {
    const u = new URL(urlString);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    const h = u.hostname;
    return h === "127.0.0.1" || h === "localhost" || h === "[::1]" || h === "::1";
  } catch {
    return false;
  }
}

ipcMain.handle("local-llm-fetch", async (_event, requestUrl, init) => {
  if (typeof requestUrl !== "string" || !isLocalhostUrl(requestUrl)) {
    return { ok: false, status: 403, data: { detail: "مسموح فقط بعناوين localhost (LM Studio)" } };
  }
  try {
    const res = await fetch(requestUrl, {
      method: init?.method || "GET",
      headers: init?.headers || {},
      body: init?.body ?? undefined,
    });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, data: { detail: msg } };
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    backgroundColor: "#0a0c10",
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  mainWindow.webContents.on("did-fail-load", (_e, code, desc, url) => {
    if (useViteDevServer()) {
      console.error("[electron] فشل التحميل:", code, desc, url);
    }
  });

  if (useViteDevServer()) {
    const devUrl = process.env.VITE_DEV_SERVER_URL || "http://127.0.0.1:5173";
    mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    const indexHtml = getDistIndexPath();
    if (!fs.existsSync(indexHtml)) {
      dialog.showErrorBox(
        "AI Geanret",
        "مجلد dist غير موجود.\n\nنفّذ أولاً في المشروع:\n  npm run build\n\nأو للتطوير مع نافذة سطح المكتب:\n  npm run dev:app"
      );
      app.quit();
      return;
    }
    mainWindow.loadFile(indexHtml);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
