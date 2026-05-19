import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/apropos")({
  head: () => ({
    meta: [
      { title: "À propos — JEEP JURIS" },
      { name: "description", content: "Notre mission : démocratiser l'accès au droit camerounais." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="font-serif text-4xl font-bold text-primary">{t("about.title")}</h1>

        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold">{t("about.mission")}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{t("about.missionText")}</p>
        </section>

        <section className="mt-10 rounded-2xl border-l-4 border-secondary bg-secondary/10 p-6">
          <h2 className="font-serif text-2xl font-semibold">{t("about.disclaimerTitle")}</h2>
          <p className="mt-3 leading-relaxed text-foreground/80">{t("about.disclaimerText")}</p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold">{t("about.contactTitle")}</h2>
          <p className="mt-3 inline-flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 text-primary" />
            {t("about.contactText")}
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
