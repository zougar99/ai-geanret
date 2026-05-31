import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { Home } from "./pages/Home";
import { MediaHub } from "./pages/MediaHub";
import { Chat } from "./pages/Chat";
import { Gallery } from "./pages/Gallery";
import { SettingsModal } from "./components/SettingsModal";
import { useI18n } from "./context/LocaleContext";
import styles from "./App.module.css";

export default function App() {
  const { t } = useI18n();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <NavLink to="/" className={styles.brand} end>
          <svg className={styles.logo} viewBox="0 0 32 32" width="24" height="24" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="6" fill="#111827"/>
            <path d="M16 4L18 12L26 10L20 16L24 24L16 20L8 24L12 16L6 10L14 12Z" fill="#6c9eff"/>
          </svg>
          AI Geanret
        </NavLink>
        <nav className={styles.nav}>
          <NavLink
            to="/photo"
            className={({ isActive }) => (isActive ? styles.navActive : styles.navLink)}
          >
            {t("nav.photos")}
          </NavLink>
          <NavLink
            to="/video"
            className={({ isActive }) => (isActive ? styles.navActive : styles.navLink)}
          >
            {t("nav.videos")}
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) => (isActive ? styles.navActive : styles.navLink)}
          >
            {t("nav.chat")}
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) => (isActive ? styles.navActive : styles.navLink)}
          >
            {t("nav.gallery")}
          </NavLink>
          <button
            type="button"
            className={styles.settingsBtn}
            onClick={() => setSettingsOpen(true)}
          >
            {t("nav.settings")}
          </button>
        </nav>
      </header>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photo/:moduleId?" element={<MediaHub kind="photo" />} />
        <Route path="/video/:moduleId?" element={<MediaHub kind="video" />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </div>
  );
}
