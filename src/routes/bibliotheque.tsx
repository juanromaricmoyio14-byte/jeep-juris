import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Search, BookOpen } from "lucide-react";

export const Route = createFileRoute("/bibliotheque")({
  head: () => ({
    meta: [
      { title: "Bibliothèque des lois — JEEP JURIS" },
      { name: "description", content: "Bibliothèque des principaux textes du droit camerounais." },
    ],
  }),
  component: LibraryPage,
});

const LAWS = [
  { id: "code-travail", domain: "labour", titleFr: "Code du Travail", titleEn: "Labour Code", descFr: "Loi n° 92/007 régissant les relations de travail au Cameroun.", descEn: "Law no. 92/007 governing labour relations in Cameroon." },
  { id: "code-penal", domain: "criminal", titleFr: "Code Pénal", titleEn: "Penal Code", descFr: "Loi n° 2016/007 portant Code pénal camerounais.", descEn: "Law no. 2016/007 — Cameroonian Penal Code." },
  { id: "code-procedure-penale", domain: "criminal", titleFr: "Code de Procédure Pénale", titleEn: "Criminal Procedure Code", descFr: "Loi n° 2005/007 régissant la procédure pénale.", descEn: "Law no. 2005/007 governing criminal procedure." },
  { id: "code-civil", domain: "civil", titleFr: "Code Civil", titleEn: "Civil Code", descFr: "Dispositions générales sur les contrats et obligations.", descEn: "General provisions on contracts and obligations." },
  { id: "code-famille", domain: "family", titleFr: "Ordonnance sur l'état civil", titleEn: "Civil Status Ordinance", descFr: "Mariage, divorce, filiation et succession.", descEn: "Marriage, divorce, parentage and inheritance." },
  { id: "code-foncier", domain: "land", titleFr: "Ordonnance foncière n° 74-1", titleEn: "Land Ordinance no. 74-1", descFr: "Régime de la propriété foncière au Cameroun.", descEn: "Land property regime in Cameroon." },
  { id: "procedures-admin", domain: "procedures", titleFr: "Procédures administratives", titleEn: "Administrative procedures", descFr: "Démarches courantes auprès des administrations.", descEn: "Common procedures with administrations." },
] as const;

const FILTERS = ["all", "labour", "criminal", "civil", "family", "land", "procedures"] as const;

function LibraryPage() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith("en");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return LAWS.filter((l) => {
      if (filter !== "all" && l.domain !== filter) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      const blob = `${l.titleFr} ${l.titleEn} ${l.descFr} ${l.descEn}`.toLowerCase();
      return blob.includes(q);
    });
  }, [query, filter]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="font-serif text-4xl font-bold text-primary">{t("library.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("library.subtitle")}</p>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("library.search")}
              className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? t("library.all") : t(`domains.${f}`)}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => (
            <article key={l.id} className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
              <BookOpen className="h-6 w-6 text-secondary" />
              <h3 className="mt-3 font-serif text-lg font-semibold">
                {isEn ? l.titleEn : l.titleFr}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-wide text-primary/70">
                {t(`domains.${l.domain}`)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {isEn ? l.descEn : l.descFr}
              </p>
              <button className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                {t("library.read")} →
              </button>
            </article>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-sm text-muted-foreground">{t("library.noResults")}</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
