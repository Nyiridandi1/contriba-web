import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const defaultTheme = {
  theme: "light",
  accent_color: "#E50914",
  compact_mode: false,
  reduce_motion: false,
};

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("contriba_theme_settings");
      return saved ? { ...defaultTheme, ...JSON.parse(saved) } : defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  const [systemTheme, setSystemTheme] = useState(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  });

  const resolvedTheme = settings.theme === "system" ? systemTheme : settings.theme;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute("data-theme", resolvedTheme);
    root.setAttribute("data-compact", settings.compact_mode ? "true" : "false");
    root.setAttribute("data-reduce-motion", settings.reduce_motion ? "true" : "false");

    root.style.setProperty("--accent-color", settings.accent_color || "#E50914");

    localStorage.setItem("contriba_theme_settings", JSON.stringify(settings));
  }, [settings, resolvedTheme]);

  const updateTheme = (newValues) => {
    setSettings((prev) => ({
      ...prev,
      ...newValues,
    }));
  };

  const setTheme = (theme) => {
    updateTheme({ theme });
  };

  const setAccentColor = (accent_color) => {
    updateTheme({ accent_color });
  };

  const setCompactMode = (compact_mode) => {
    updateTheme({ compact_mode });
  };

  const setReduceMotion = (reduce_motion) => {
    updateTheme({ reduce_motion });
  };

  const resetTheme = () => {
    setSettings(defaultTheme);
  };

  const value = useMemo(
    () => ({
      themeSettings: settings,
      resolvedTheme,
      updateTheme,
      setTheme,
      setAccentColor,
      setCompactMode,
      setReduceMotion,
      resetTheme,
    }),
    [settings, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}