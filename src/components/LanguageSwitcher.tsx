import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith("en") ? "en" : "fr";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = current;
    }
  }, [current]);

  const change = (lng: "fr" | "en") => {
    if (lng !== current) i18n.changeLanguage(lng);
  };

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-semibold">
      {(["fr", "en"] as const).map((lng) => (
        <button
          key={lng}
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
