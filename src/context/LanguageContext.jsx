import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(null);

const DEFAULT_LANGUAGE = "English";

export const LANGUAGE_OPTIONS = ["English", "Kinyarwanda", "Français"];

export function normalizeLanguage(language) {
  if (language === "French") return "Français";
  if (LANGUAGE_OPTIONS.includes(language)) return language;
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return normalizeLanguage(localStorage.getItem("contriba_language"));
  });

  useEffect(() => {
    localStorage.setItem("contriba_language", language);
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const setLanguage = (nextLanguage) => {
    setLanguageState(normalizeLanguage(nextLanguage));
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languages: LANGUAGE_OPTIONS,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}