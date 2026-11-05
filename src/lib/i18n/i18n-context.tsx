"use client";

import * as React from "react";

import { type AppLanguage, translateNavLabel, translations } from "./translations";

interface I18nContextType {
  locale: AppLanguage;
  setLocale: (lang: AppLanguage) => void;
  t: (path: string, fallback?: string) => string;
  tNav: (label: string) => string;
}

const I18nContext = React.createContext<I18nContextType | null>(null);

function getInitialLocale(): AppLanguage {
  if (typeof window === "undefined") return "fr";
  const stored = localStorage.getItem("onixe_lang") as AppLanguage;
  if (stored === "fr" || stored === "en") return stored;

  const match = document.cookie.match(/app_lang=(fr|en)/);
  if (match) return match[1] as AppLanguage;

  return "fr";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<AppLanguage>("fr");

  React.useEffect(() => {
    const init = getInitialLocale();
    setLocaleState(init);
    document.documentElement.setAttribute("lang", init);
  }, []);

  const setLocale = React.useCallback((lang: AppLanguage) => {
    setLocaleState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("onixe_lang", lang);
      // biome-ignore lint/suspicious/noDocumentCookie: SSR cookie synchronization
      document.cookie = `app_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.setAttribute("lang", lang);
      window.dispatchEvent(new Event("languagechange"));
    }
  }, []);

  const t = React.useCallback(
    (path: string, fallback?: string): string => {
      const keys = path.split(".");
      let current: Record<string, unknown> | string = translations[locale];

      for (const key of keys) {
        if (current && typeof current === "object" && key in current) {
          current = current[key];
        } else {
          return fallback ?? path;
        }
      }

      return typeof current === "string" ? current : (fallback ?? path);
    },
    [locale],
  );

  const tNav = React.useCallback(
    (label: string): string => {
      return translateNavLabel(label, locale);
    },
    [locale],
  );

  return <I18nContext.Provider value={{ locale, setLocale, t, tNav }}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = React.useContext(I18nContext);
  if (!context) {
    return {
      locale: "fr" as AppLanguage,
      setLocale: () => {
        // Fallback no-op when outside of provider
      },
      t: (path: string, fallback?: string) => fallback ?? path,
      tNav: (label: string) => translateNavLabel(label, "fr"),
    };
  }
  return context;
}
