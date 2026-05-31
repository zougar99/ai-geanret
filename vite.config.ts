import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  /** مسارات نسبية لـ Electron (تحميل من ملف index.html) */
  base: "./",
  server: {
    proxy: {
      "/api/replicate": {
        target: "https://api.replicate.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/replicate/, ""),
      },
    },
  },
});
