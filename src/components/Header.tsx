import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "./AuthProvider";
import { LogIn, LogOut, Sun, Moon, Menu, X } from "lucide-react";
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur block">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 h-14 md:py-3 md:h-auto">
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

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary transition-colors shadow-lg border border-primary-foreground/20"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden md:flex items-center gap-2">
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/75 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div
            className="relative w-4/5 max-w-sm h-full shadow-xl flex flex-col animate-in slide-in-from-right bg-white dark:bg-[#1A2634] opacity-100 z-50"
            style={{ backgroundColor: theme === "dark" ? "#1A2634" : "white" }}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-serif text-lg font-bold tracking-tight text-primary">
                JEEP <span className="text-secondary">JURIS</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-4 p-4 text-sm font-medium">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground/80 hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                Accueil
              </Link>
              <Link
                to="/agent"
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground/80 hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {t("nav.agent")}
              </Link>
              <Link
                to="/bibliotheque"
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground/80 hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {t("nav.library")}
              </Link>
              <Link
                to="/apropos"
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground/80 hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {t("nav.about")}
              </Link>
            </nav>

            <div className="px-4">
              <hr className="border-border my-2" />
            </div>

            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Langue</span>
                <LanguageSwitcher />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Thème</span>
                <button
                  onClick={toggleTheme}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm hover:bg-muted hover:text-primary transition-colors"
                  aria-label="Toggle theme"
                  title="Toggle theme"
                >
                  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="mt-auto p-4 border-t border-border">
              {configured &&
                (user ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("nav.logout")}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    <LogIn className="h-4 w-4" />
                    {t("nav.login")}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
