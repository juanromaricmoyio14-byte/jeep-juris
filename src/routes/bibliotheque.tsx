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
  // TITRE I
  {
    id: "1",
    titre: "Art. 1-2 — Dispositions Générales",
    domaine: "travail",
    section: "Titre I",
  },

  // TITRE II — Syndicats
  {
    id: "2",
    titre: "Art. 3-5 — Constitution des syndicats",
    domaine: "travail",
    section: "Titre II",
  },
  {
    id: "3",
    titre: "Art. 6-14 — Enregistrement",
    domaine: "travail",
    section: "Titre II",
  },
  {
    id: "4",
    titre: "Art. 15 — Statuts",
    domaine: "travail",
    section: "Titre II",
  },
  {
    id: "5",
    titre: "Art. 16-21 — Dispositions diverses",
    domaine: "travail",
    section: "Titre II",
  },
  {
    id: "6",
    titre: "Art. 22 — Unions",
    domaine: "travail",
    section: "Titre II",
  },

  // TITRE III — Contrat de travail
  {
    id: "7",
    titre: "Art. 23-27 — Contrat individuel",
    domaine: "travail",
    section: "Titre III",
  },
  {
    id: "8",
    titre: "Art. 28-31 — Essai et discipline",
    domaine: "travail",
    section: "Titre III",
  },
  {
    id: "9",
    titre: "Art. 32-33 — Suspension",
    domaine: "travail",
    section: "Titre III",
  },
  {
    id: "10",
    titre: "Art. 34-43 — Rupture du contrat",
    domaine: "travail",
    section: "Titre III",
  },
  {
    id: "11",
    titre: "Art. 44 — Certificat de travail",
    domaine: "travail",
    section: "Titre III",
  },
  {
    id: "12",
    titre: "Art. 45-47 — Apprentissage",
    domaine: "travail",
    section: "Titre III",
  },
  {
    id: "13",
    titre: "Art. 48-51 — Tâcheronnat",
    domaine: "travail",
    section: "Titre III",
  },
  {
    id: "14",
    titre: "Art. 52-60 — Conventions collectives",
    domaine: "travail",
    section: "Titre III",
  },

  // TITRE IV — Salaire
  {
    id: "15",
    titre: "Art. 61-66 — Détermination du salaire",
    domaine: "travail",
    section: "Titre IV",
  },
  {
    id: "16",
    titre: "Art. 67-76 — Paiement du salaire",
    domaine: "travail",
    section: "Titre IV",
  },
  {
    id: "17",
    titre: "Art. 77 — Disposition sur le salaire",
    domaine: "travail",
    section: "Titre IV",
  },
  {
    id: "18",
    titre: "Art. 78-79 — Économats",
    domaine: "travail",
    section: "Titre IV",
  },

  // TITRE V — Conditions de travail
  {
    id: "19",
    titre: "Art. 80 — Durée du travail",
    domaine: "travail",
    section: "Titre V",
  },
  {
    id: "20",
    titre: "Art. 81-82 — Travail de nuit",
    domaine: "travail",
    section: "Titre V",
  },
  {
    id: "21",
    titre: "Art. 83-87 — Femmes et enfants",
    domaine: "travail",
    section: "Titre V",
  },
  {
    id: "22",
    titre: "Art. 88 — Repos hebdomadaire",
    domaine: "travail",
    section: "Titre V",
  },
  {
    id: "23",
    titre: "Art. 89-93 — Congés payés",
    domaine: "travail",
    section: "Titre V",
  },
  {
    id: "24",
    titre: "Art. 94 — Transports",
    domaine: "travail",
    section: "Titre V",
  },

  // TITRE VI — Sécurité et santé
  {
    id: "25",
    titre: "Art. 95-97 — Sécurité",
    domaine: "travail",
    section: "Titre VI",
  },
  {
    id: "26",
    titre: "Art. 98-103 — Santé",
    domaine: "travail",
    section: "Titre VI",
  },

  // TITRE VII — Organismes de contrôle
  {
    id: "27",
    titre: "Art. 104-111 — Inspection du travail",
    domaine: "travail",
    section: "Titre VII",
  },
  {
    id: "28",
    titre: "Art. 112-113 — Placement",
    domaine: "travail",
    section: "Titre VII",
  },
  {
    id: "29",
    titre: "Art. 114-116 — Registres",
    domaine: "travail",
    section: "Titre VII",
  },

  // TITRE VIII — Institutions
  {
    id: "30",
    titre: "Art. 117-119 — Commission du travail",
    domaine: "travail",
    section: "Titre VIII",
  },
  {
    id: "31",
    titre: "Art. 120-121 — Commission de santé",
    domaine: "travail",
    section: "Titre VIII",
  },
  {
    id: "32",
    titre: "Art. 122-130 — Délégués du personnel",
    domaine: "travail",
    section: "Titre VIII",
  },

  // TITRE IX — Différends
  {
    id: "33",
    titre: "Art. 131-156 — Différend individuel",
    domaine: "travail",
    section: "Titre IX",
  },
  {
    id: "34",
    titre: "Art. 157-165 — Différend collectif",
    domaine: "travail",
    section: "Titre IX",
  },

  // TITRE X & XI — Pénalités et dispositions finales
  {
    id: "35",
    titre: "Art. 166-173 — Pénalités",
    domaine: "travail",
    section: "Titre X-XI",
  },
  {
    id: "36",
    titre: "Art. 174-177 — Dispositions finales",
    domaine: "travail",
    section: "Titre X-XI",
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
          Code du Travail camerounais — texte intégral, titre par titre.
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
                        Droit du Travail
                      </p>
                      <button
                        onClick={() => window.open('/code_travail_cameroun.pdf', '_blank')}
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
