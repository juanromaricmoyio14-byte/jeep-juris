import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "./AuthProvider";
import { LogIn, LogOut, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const { t } = useTranslation();
  const { user, configured, logout } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur hidden md:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Logo className="h-8 w-8" />
          <span className="font-serif text-xl font-bold tracking-tight">
            JEEP <span className="text-secondary">JURIS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            to="/agent"
            className="text-foreground/80 hover:text-primary"
            activeProps={{ className: "text-primary" }}
          >
            {t("nav.agent")}
          </Link>
          <Link
            to="/bibliotheque"
            className="text-foreground/80 hover:text-primary"
            activeProps={{ className: "text-primary" }}
          >
            {t("nav.library")}
          </Link>
          <Link
            to="/apropos"
            className="text-foreground/80 hover:text-primary"
            activeProps={{ className: "text-primary" }}
          >
            {t("nav.about")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm hover:bg-muted hover:text-primary transition-colors"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <LanguageSwitcher />
          {configured &&
            (user ? (
              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted"
              >
                <LogOut className="h-3.5 w-3.5" />
                {t("nav.logout")}
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                <LogIn className="h-3.5 w-3.5" />
                {t("nav.login")}
              </Link>
            ))}
        </div>
      </div>
    </header>
  );
}
