import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "./AuthProvider";
import { LogIn, LogOut } from "lucide-react";

export function Header() {
  const { t } = useTranslation();
  const { user, configured, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Logo className="h-8 w-8" />
          <span className="font-serif text-xl font-bold tracking-tight">
            JuriCam <span className="text-secondary">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/agent" className="text-foreground/80 hover:text-primary" activeProps={{ className: "text-primary" }}>
            {t("nav.agent")}
          </Link>
          <Link to="/bibliotheque" className="text-foreground/80 hover:text-primary" activeProps={{ className: "text-primary" }}>
            {t("nav.library")}
          </Link>
          <Link to="/apropos" className="text-foreground/80 hover:text-primary" activeProps={{ className: "text-primary" }}>
            {t("nav.about")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {configured && (
            user ? (
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
            )
          )}
        </div>
      </div>
    </header>
  );
}
