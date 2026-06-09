import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <button
      onClick={() => router.history.back()}
      className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors min-h-[44px] min-w-[44px] justify-center"
    >
      <ArrowLeft className="h-4 w-4" />
      {t("nav.back") || "Retour"}
    </button>
  );
}
