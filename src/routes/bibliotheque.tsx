import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Search, BookOpen } from "lucide-react";
import { BackButton } from "@/components/BackButton";


export const Route = createFileRoute("/bibliotheque")({
  head: () => ({
    meta: [
      { title: "Bibliothèque des lois — JEEP JURIS" },
      {
        name: "description",
        content:
          "Bibliothèque des principaux textes du droit camerounais : Code du Travail intégral, titre par titre.",
      },
      { property: "og:title", content: "Bibliothèque des lois — JEEP JURIS" },
      { property: "og:description", content: "Principaux textes du droit camerounais." },
      { property: "og:url", content: "https://jeep-juris.lovable.app/bibliotheque" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://jeep-juris.lovable.app/bibliotheque" }],
  }),
  component: LibraryPage,
});

const LAWS = [
  {
    id: "1",
    titre: "Code du Travail",
    domaine: "travail",
    section: "Codes Principaux",
    pdfUrl: "/code_travail_cameroun.pdf",
  },
  {
    id: "2",
    titre: "Code Civil",
    domaine: "civil",
    section: "Codes Principaux",
    pdfUrl: "/code_civil_cameroun.pdf",
  },
  {
    id: "3",
    titre: "Code Pénal",
    domaine: "penal",
    section: "Codes Principaux",
    pdfUrl: "/code_penal_cameroun.pdf",
  },
] as const;

type Law = (typeof LAWS)[number];

type GroupedLaws = Record<string, Law[]>;


function LibraryPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LAWS;
    return LAWS.filter((l) => l.titre.toLowerCase().includes(q));
  }, [query]);


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 animate-in fade-in duration-500">
        <BackButton />
        <h1 className="font-serif text-4xl font-bold text-primary">{t("library.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          Principaux textes du droit camerounais en version intégrale.
        </p>

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

        <div className="mt-8 space-y-12">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">{t("library.noResults")}</p>
          ) : (
            Object.entries(
              (filtered as Law[]).reduce<GroupedLaws>((acc, law) => {
                const section = law.section || "Autres";
                if (!acc[section]) acc[section] = [];
                acc[section].push(law);
                return acc;
              }, {}),
            ).map(([section, sectionLaws], sectionIndex) => (
              <section key={section} className="space-y-4">
                <h2 className="font-serif text-2xl font-semibold text-primary border-b border-border pb-2">
                  {section}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sectionLaws.map((l, index) => (
                    <article
                      key={l.id}
                      className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md animate-in slide-in-from-bottom-4 duration-500 flex flex-col"
                      style={{
                        animationDelay: `${(sectionIndex * 4 + index) * 40}ms`,
                        animationFillMode: "both",
                      }}
                    >
                      <BookOpen className="h-6 w-6 text-secondary" />
                      <h3 className="mt-3 font-serif text-base font-semibold leading-snug">
                        {l.titre}
                      </h3>
                      <p className="mt-1 text-xs uppercase tracking-wide text-primary/70">
                        {l.domaine}
                      </p>
                      <button
                        onClick={() => window.open((l as any).pdfUrl || '/code_travail_cameroun.pdf', '_blank')}
                        className="mt-auto pt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline self-start min-h-[44px]"
                      >
                        {t("library.read")} →
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>
      <Footer />

          </div>
  );
}
