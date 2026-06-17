import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Search, BookOpen, Lock } from "lucide-react";
import { BackButton } from "@/components/BackButton";

export const Route = createFileRoute("/bibliotheque")({
  head: () => ({
    meta: [
      { title: "Bibliothèque des lois — JEEP JURIS" },
      {
        name: "description",
        content:
          "Bibliothèque des principaux textes du droit camerounais : Code du Travail, Code Pénal, Code Civil et plus.",
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

interface LegalCode {
  id: string;
  titre: string;
  domaine: string;
  description: string;
  annee: string;
  articles: string;
  pdfPath?: string;
  icon: string;
  available: boolean;
}

const LEGAL_CODES: LegalCode[] = [
  {
    id: "code_travail",
    titre: "Code du Travail Camerounais",
    domaine: "Droit du Travail",
    description:
      "177 articles régissant les rapports entre employeurs et travailleurs au Cameroun — contrats, salaires, conditions de travail, syndicats, contentieux.",
    annee: "1992",
    articles: "177 articles",
    pdfPath: "/code_travail_cameroun.pdf",
    icon: "💼",
    available: true,
  },
  {
    id: "code_penal",
    titre: "Code Pénal",
    domaine: "Droit Pénal",
    description:
      "Ensemble des infractions, des peines et des mesures de sûreté applicables au Cameroun.",
    annee: "2016",
    articles: "—",
    icon: "⚖️",
    available: false,
  },
  {
    id: "code_civil",
    titre: "Code Civil",
    domaine: "Droit Civil",
    description:
      "Personnes, famille, biens, obligations, contrats, successions et régimes matrimoniaux.",
    annee: "—",
    articles: "—",
    icon: "📜",
    available: false,
  },
  {
    id: "code_famille",
    titre: "Code de la Famille",
    domaine: "Droit de la Famille",
    description:
      "Mariage, filiation, autorité parentale, régimes matrimoniaux et succession.",
    annee: "—",
    articles: "—",
    icon: "👨‍👩‍👧‍👦",
    available: false,
  },
  {
    id: "code_foncier",
    titre: "Code Foncier",
    domaine: "Droit Foncier",
    description:
      "Gestion des terres, propriété foncière, baux ruraux et urbains au Cameroun.",
    annee: "—",
    articles: "—",
    icon: "🏡",
    available: false,
  },
];

function LibraryPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const filtered = LEGAL_CODES.filter((code) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      code.titre.toLowerCase().includes(q) ||
      code.domaine.toLowerCase().includes(q) ||
      code.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 animate-in fade-in duration-500">
        <BackButton />
        <h1 className="font-serif text-4xl font-bold text-primary">
          {t("library.title")}
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Consultez les principaux codes juridiques du Cameroun. Le Code du
          Travail est disponible en intégralité, les autres arrivent prochainement.
        </p>

        <div className="mt-6 max-w-md">
          <div className="relative">
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

        <div className="mt-10 space-y-6">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              {t("library.noResults")}
            </p>
          ) : (
            filtered.map((code, index) => (
              <article
                key={code.id}
                className={`rounded-2xl border p-6 transition-all duration-300 ${
                  code.available
                    ? "border-border bg-card hover:shadow-lg"
                    : "border-dashed border-border/60 bg-muted/30"
                }`}
                style={{
                  animationDelay: `${index * 80}ms`,
                }}
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  {/* Left: icon + info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{code.icon}</span>
                      <div>
                        <h2
                          className={`font-serif text-xl font-bold ${
                            code.available
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {code.titre}
                        </h2>
                        <p className="text-xs font-medium text-primary/70 uppercase tracking-wide mt-0.5">
                          {code.domaine}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`mt-3 text-sm leading-relaxed ${
                        code.available
                          ? "text-foreground/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {code.description}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 font-medium">
                        <BookOpen className="h-3 w-3" />
                        {code.articles}
                      </span>
                      <span className="text-muted-foreground">
                        Année : {code.annee}
                      </span>
                      {!code.available && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-1 text-amber-800 font-semibold">
                          <Lock className="h-3 w-3" />
                          Bientôt disponible
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex flex-col gap-2 md:min-w-[180px]">
                    {code.available && code.pdfPath ? (
                      <>
                        <button
                          onClick={() =>
                            window.open(code.pdfPath, "_blank")
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                        >
                          📖 Lire le texte
                        </button>
                        <Link
                          to="/agent"
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted transition-colors text-center"
                        >
                          💬 Poser une question
                        </Link>
                      </>
                    ) : (
                      <>
                        <button
                          disabled
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm font-semibold text-muted-foreground cursor-not-allowed"
                        >
                          📖 Lire le texte
                        </button>
                        <button
                          disabled
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-muted px-4 py-2.5 text-sm font-semibold text-muted-foreground cursor-not-allowed"
                        >
                          💬 Poser une question
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
