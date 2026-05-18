import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const STORAGE_KEY = "juricam-lang";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // After mount, sync to saved language without breaking SSR hydration
  useEffect(() => {
    setMounted(true);
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved === "en" || saved === "fr") {
      if (i18n.language !== saved) i18n.changeLanguage(saved);
    }
  }, [i18n]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = i18n.language?.startsWith("en") ? "en" : "fr";
    }
  }, [i18n.language]);

  const current = mounted ? (i18n.language?.startsWith("en") ? "en" : "fr") : "fr";

  const change = (lng: "fr" | "en") => {
    if (lng !== current) {
      i18n.changeLanguage(lng);
      if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, lng);
    }
  };

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-semibold">
      {(["fr", "en"] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => change(lng)}
          className={`px-3 py-1 rounded-full transition-colors ${
            current === lng
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-pressed={current === lng}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
