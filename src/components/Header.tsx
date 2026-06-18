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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const darkMode =
      saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setTheme(darkMode ? "dark" : "light");
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setIsDark(newTheme === "dark");
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm hover:bg-muted hover:text-primary transition-colors text-base"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
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
        <div className="md:hidden" style={{ position: "fixed", inset: 0, zIndex: 40 }}>
          {/* Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
          />

          {/* Drawer panel */}
          <div
            style={{
              backgroundColor: isDark ? "#1A2634" : "#ffffff",
              position: "fixed",
              top: 0,
              right: 0,
              width: "100%",
              maxWidth: "320px",
              height: "100vh",
              zIndex: 50,
              boxShadow: "-4px 0 20px rgba(0,0,0,0.3)",
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: isDark ? "#2a3a4a" : "#e5e7eb" }}
            >
              <span
                className="font-serif text-lg font-bold tracking-tight"
                style={{ color: isDark ? "#E8EDF2" : "#1a1a1a" }}
              >
                JEEP <span style={{ color: "#1a5c38" }}>JURIS</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted"
                style={{ color: isDark ? "#E8EDF2" : "#1a1a1a" }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav
              className="flex flex-col gap-4 p-4 text-sm font-medium"
              style={{ color: isDark ? "#E8EDF2" : "#1a1a1a" }}
            >
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary"
                style={{ color: isDark ? "#E8EDF2" : "#1a1a1a" }}
                activeProps={{ className: "text-primary" }}
              >
                Accueil
              </Link>
              <Link
                to="/agent"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary"
                style={{ color: isDark ? "#E8EDF2" : "#1a1a1a" }}
                activeProps={{ className: "text-primary" }}
              >
                {t("nav.agent")}
              </Link>
              <Link
                to="/bibliotheque"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary"
                style={{ color: isDark ? "#E8EDF2" : "#1a1a1a" }}
                activeProps={{ className: "text-primary" }}
              >
                {t("nav.library")}
              </Link>
              <Link
                to="/apropos"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary"
                style={{ color: isDark ? "#E8EDF2" : "#1a1a1a" }}
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
                <span
                  className="text-sm font-medium"
                  style={{ color: isDark ? "#E8EDF2" : "#1a1a1a" }}
                >
                  Langue
                </span>
                <LanguageSwitcher />
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium"
                  style={{ color: isDark ? "#E8EDF2" : "#1a1a1a" }}
                >
                  Thème
                </span>
                <button
                  onClick={toggleTheme}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm hover:bg-muted hover:text-primary transition-colors text-base"
                  aria-label="Toggle theme"
                  title="Toggle theme"
                >
                  {theme === "light" ? "🌙" : "☀️"}
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
                    style={{ color: isDark ? "#E8EDF2" : "#1a1a1a" }}
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
