import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadSettings, saveSettings, type AppLocale } from "../lib/settings";
import { translate } from "../locales/ui";

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (l: AppLocale) => void;
  t: (key: string) => string;
  refreshFromStorage: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(() => loadSettings().locale);

  const refreshFromStorage = () => {
    setLocaleState(loadSettings().locale);
  };

  const setLocale = (l: AppLocale) => {
    setLocaleState(l);
    const s = loadSettings();
    saveSettings({ ...s, locale: l });
  };

  useEffect(() => {
    document.documentElement.lang = locale === "ar" ? "ar" : locale === "fr" ? "fr" : "en";
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const t = useMemo(() => (key: string) => translate(locale, key), [locale]);

  const value = useMemo(
    (): LocaleContextValue => ({
      locale,
      setLocale,
      t,
      refreshFromStorage,
    }),
    [locale, t]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n(): LocaleContextValue {
  const c = useContext(LocaleContext);
  if (!c) throw new Error("useI18n must be used inside LocaleProvider");
  return c;
}
