import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Menu,
  X,
  Home,
  MessageSquare,
  BookOpen,
  Info,
  Sun,
  Moon,
  LogIn,
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "./AuthProvider";

const LANG_KEY = "juricam-lang";

export function MobileNav() {
  const { t, i18n } = useTranslation();
  const { user, configured, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"fr" | "en">("fr");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    setLang(i18n.language?.startsWith("en") ? "en" : "fr");
  }, [i18n.language]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const changeLang = (l: "fr" | "en") => {
    setLang(l);
    i18n.changeLanguage(l);
    if (typeof window !== "undefined") localStorage.setItem(LANG_KEY, l);
  };

  const close = () => setOpen(false);

  const navLinks = [
    { to: "/", label: t("nav.home") || "Accueil", icon: Home },
    { to: "/agent", label: t("nav.agent"), icon: MessageSquare },
    { to: "/bibliotheque", label: t("nav.library"), icon: BookOpen },
    { to: "/apropos", label: t("nav.about"), icon: Info },
  ] as const;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] max-w-sm p-0 flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <SheetTitle className="font-serif text-lg font-bold text-primary">
            JEEP <span className="text-secondary">JURIS</span>
          </SheetTitle>
          <button
            onClick={close}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="space-y-1">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={close}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  activeProps={{ className: "bg-primary/10 text-primary" }}
                >
                  <l.icon className="h-5 w-5" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-border pt-4 px-3 space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Langue
              </div>
              <div className="inline-flex w-full rounded-full border border-border bg-card p-0.5 text-xs font-semibold">
                {(["fr", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => changeLang(l)}
                    className={`flex-1 px-3 py-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Thème
              </div>
              <button
                onClick={toggleTheme}
                className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="flex items-center gap-2">
                  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {theme === "light" ? "Mode sombre" : "Mode clair"}
                </span>
              </button>
            </div>

            {configured && (
              <div>
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      close();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <LogOut className="h-4 w-4" /> {t("nav.logout")}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={close}
                    className="flex w-full items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <LogIn className="h-4 w-4" /> {t("nav.login")}
                  </Link>
                )}
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
