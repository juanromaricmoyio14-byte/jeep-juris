import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Briefcase, Gavel, ScrollText, Users, MapPinned, FileCheck2, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JuriCam AI — Vos droits, en clair." },
      { name: "description", content: "Assistant juridique intelligent spécialisé en droit camerounais." },
    ],
  }),
  component: HomePage,
});

const DOMAINS = [
  { key: "labour", icon: Briefcase },
  { key: "criminal", icon: Gavel },
  { key: "civil", icon: ScrollText },
  { key: "family", icon: Users },
  { key: "land", icon: MapPinned },
  { key: "procedures", icon: FileCheck2 },
] as const;

function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-primary">
            {t("home.heroTitle")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/agent"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
            >
              {t("home.ctaConsult")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/bibliotheque"
              className="inline-flex items-center gap-2 rounded-full border-2 border-secondary bg-card px-6 py-3 text-sm font-semibold text-secondary-foreground hover:bg-secondary/10"
            >
              {t("home.ctaLibrary")}
            </Link>
          </div>
        </div>
      </section>

      {/* Domains */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">{t("home.domainsTitle")}</h2>
          <p className="mt-2 text-muted-foreground">{t("home.domainsSubtitle")}</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map(({ key, icon: Icon }) => (
            <Link
              key={key}
              to="/agent"
              search={{ domaine: key }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-semibold">{t(`domains.${key}`)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(`domains.${key}Desc`)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-primary/5 border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center font-serif text-3xl md:text-4xl font-bold">{t("home.howTitle")}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl bg-card p-6 border border-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-serif text-lg font-bold">
                  {n}
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold">{t(`home.step${n}Title`)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(`home.step${n}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
