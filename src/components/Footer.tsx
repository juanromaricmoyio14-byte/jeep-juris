import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-20 border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-8 text-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-primary">
            <Logo className="h-6 w-6" />
            <span className="font-serif text-lg font-bold">JEEP JURIS</span>
          </div>
          <Link to="/feedback" className="text-xs font-medium text-primary hover:underline">
            {t("footer.feedback")}
          </Link>
        </div>
        <p className="text-muted-foreground max-w-3xl">{t("footer.disclaimer")}</p>
        <p className="text-xs text-muted-foreground">{t("footer.rights")}</p>
      </div>
    </footer>
  );
}
