import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
    titre: "Art. 1-2 — Dispositions Générales",
    section: "Titre I",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1lksA0cP6u5-iGXTFsxh9TynQJBRZJYeG1/view",
  },
  {
    id: "2",
    titre: "Art. 3-5 — Constitution syndicats",
    section: "Titre II",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1cILsBLAerIA96bDGQWy4ue6gTzFK4skK2/view",
  },
  {
    id: "3",
    titre: "Art. 6-14 — Enregistrement",
    section: "Titre II",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1bws1O_JmGIrvslxN8im7_BQM0t3q4qJ0/view",
  },
  {
    id: "4",
    titre: "Art. 15 — Statuts",
    section: "Titre II",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1ZONIR51xktYEkuBQ0w35fHiUVlBjBalt3/view",
  },
  {
    id: "5",
    titre: "Art. 16-21 — Dispositions diverses",
    section: "Titre II",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1CEwpJGpkKyAvgcYwyaIj-V7qN04l54zb4/view",
  },
  {
    id: "6",
    titre: "Art. 22 — Unions",
    section: "Titre II",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1_a7Wnt1zgICsplEfdJDHzia7Zlp2d9xj5/view",
  },
  {
    id: "7",
    titre: "Art. 23-27 — Contrat individuel",
    section: "Titre III",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1I3Nu31Oyrhukw-4xIAQtnPkwRzPqEtLV/view",
  },
  {
    id: "8",
    titre: "Art. 28-31 — Essai et discipline",
    section: "Titre III",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1LkMalkcxmW8Ikw5TUl_uI7QY5WSKNrZv/view",
  },
  {
    id: "9",
    titre: "Art. 32-33 — Suspension",
    section: "Titre III",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1OPkB3wjYDGDyGaruOPr314te1AWh4D3G/view",
  },
  {
    id: "10",
    titre: "Art. 34-43 — Rupture du contrat",
    section: "Titre III",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1Wa6BcPCLjKBl3AMhQSOd5QH-kMSpNBys/view",
  },
  {
    id: "11",
    titre: "Art. 44 — Certificat de travail",
    section: "Titre III",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1_eaFyb-uGVcBdtyLs1TaFhq4ZSlT23QU/view",
  },
  {
    id: "12",
    titre: "Art. 45-47 — Apprentissage",
    section: "Titre III",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1a9dVcYGqk1COv-8sUPDu9VgHNvg9Zp5r/view",
  },
  {
    id: "13",
    titre: "Art. 48-51 — Tâcheronnat",
    section: "Titre III",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1nMTLZ_OhRd2zMvNVcjLmAUZ8pWiayMxD/view",
  },
  {
    id: "14",
    titre: "Art. 52-60 — Conventions collectives",
    section: "Titre III",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1pO9wGAOph7FDmM1L9UAouiCweMXXDxyG/view",
  },
  {
    id: "15",
    titre: "Art. 61-66 — Détermination salaire",
    section: "Titre IV",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1uXoVPdLMWZ0JMst1UfxaK9igi9BcD-H/view",
  },
  {
    id: "16",
    titre: "Art. 67-76 — Paiement salaire",
    section: "Titre IV",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/192tQxLvzwVl8NnwtHAxtd9OyMvFwEKub/view",
  },
  {
    id: "17",
    titre: "Art. 77 — Disposition salaire",
    section: "Titre IV",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1uS3QOB1CQVuIflWdCjaiatfQI-zGK-Iw/view",
  },
  {
    id: "18",
    titre: "Art. 78-79 — Économats",
    section: "Titre IV",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1v6_iRz-VlvVe-WZQE8_IZAeYHbhuFbMN/view",
  },
  {
    id: "19",
    titre: "Art. 80 — Durée du travail",
    section: "Titre V",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1i6NXTLWFi2RHUaQBxngRj4cwGH9ELesU/view",
  },
  {
    id: "20",
    titre: "Art. 81-82 — Travail de nuit",
    section: "Titre V",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1SuI2J2nMO7FWY5nYW6TYpVRZAVVTarqF/view",
  },
  {
    id: "21",
    titre: "Art. 83-87 — Femmes et enfants",
    section: "Titre V",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1yWqYK9ovoPT0QZpsjPePJOCAfLFROXUp/view",
  },
  {
    id: "22",
    titre: "Art. 88 — Repos hebdomadaire",
    section: "Titre V",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/18vli-sjr25lh3nw_5EV2ZIifVHBtwY4R/view",
  },
  {
    id: "23",
    titre: "Art. 89-93 — Congés payés",
    section: "Titre V",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1wnUgum0FQO3lSZ067BTBnRrF9qst3FwZ/view",
  },
  {
    id: "24",
    titre: "Art. 94 — Transports",
    section: "Titre V",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1DE7jpLhpomYt30enoLrlbWvUADSevs_H/view",
  },
  {
    id: "25",
    titre: "Art. 95-97 — Sécurité",
    section: "Titre VI",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1DSgOHNJlqLpQdBDaYeXRpqKCE4JZGyLd/view",
  },
  {
    id: "26",
    titre: "Art. 98-103 — Santé",
    section: "Titre VI",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/17-eBawTpL8qjxoBHEFlQYuBcov75O3wQ/view",
  },
  {
    id: "27",
    titre: "Art. 104-111 — Inspection travail",
    section: "Titre VII",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1g_EkupmZPAuc-ZSWUst899vi-eTJ9ruq/view",
  },
  {
    id: "28",
    titre: "Art. 112-113 — Placement",
    section: "Titre VII",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1I7Z4o3dOs01oBdB4Hv4jfchNRRNZdkEP/view",
  },
  {
    id: "29",
    titre: "Art. 114-116 — Registres",
    section: "Titre VII",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1w6aN0cXjFikuJe30q9Z8a6K-0E4aH35e/view",
  },
  {
    id: "30",
    titre: "Art. 117-119 — Commission travail",
    section: "Titre VIII",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1jsjDzyhpYlm39rCMRoQJZvgXUP8NpHjs/view",
  },
  {
    id: "31",
    titre: "Art. 120-121 — Commission santé",
    section: "Titre VIII",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1DOpTCDuHuLB9aJfIZfae7fhqILAWVofy/view",
  },
  {
    id: "32",
    titre: "Art. 122-130 — Délégués personnel",
    section: "Titre VIII",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1WT3ATsZHErwfAobBJ7YyKi9FQUuuN1OI/view",
  },
  {
    id: "33",
    titre: "Art. 131-156 — Différend individuel",
    section: "Titre IX",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1qUWJtCMHMR4K959wu844RBSDblodYN-5/view",
  },
  {
    id: "34",
    titre: "Art. 157-165 — Différend collectif",
    section: "Titre IX",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1Sm2O4v7a9ieNJZoOlzHAN5Abp6d_AMP1/view",
  },
  {
    id: "35",
    titre: "Art. 166-173 — Pénalités",
    section: "Titre X-XI",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1r6-roMC-KYoORdDDvhaWKWQ5Wy4vdwFV/view",
  },
  {
    id: "36",
    titre: "Art. 174-177 — Dispositions finales",
    section: "Titre X-XI",
    domaine: "travail",
    driveUrl: "https://drive.google.com/file/d/1-gFzEgOrOrYFo7Oa-VF8zDJNdsZfeOaP/view",
  },
] as const;

type Law = (typeof LAWS)[number];

type GroupedLaws = Record<string, Law[]>;

function LibraryPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLaw, setSelectedLaw] = useState<Law | null>(null);
  const [lawContent, setLawContent] = useState<string | null>(null);
  const [loadingLaw, setLoadingLaw] = useState(false);
  const [errorLaw, setErrorLaw] = useState<string | null>(null);
  const getContent = useServerFn(fetchLawContent);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LAWS;
    return LAWS.filter((l) => l.titre.toLowerCase().includes(q));
  }, [query]);

  const openLaw = async (l: Law) => {
    setSelectedLaw(l);
    setModalOpen(true);
    setLoadingLaw(true);
    setLawContent(null);
    setErrorLaw(null);
    try {
      const res = await getContent({ data: { driveId: l.driveId } });
      if (res.ok && res.content) {
        setLawContent(formatLawText(res.content));
      } else {
        setErrorLaw(
          res.error ||
            "Impossible de charger ce texte pour le moment. Veuillez réessayer dans quelques instants.",
        );
      }
    } catch (e) {
      console.error(e);
      setErrorLaw("Erreur réseau lors du chargement du texte. Veuillez réessayer.");
    } finally {
      setLoadingLaw(false);
    }
  };

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
                      <div className="mt-auto pt-4 flex items-center justify-between gap-2 w-full">
                        <button
                          onClick={() => window.open(l.driveUrl, "_blank")}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline min-h-[44px]"
                        >
                          {t("library.read")} →
                        </button>
                        <button
                          onClick={() => navigate({ to: "/agent", search: { domaine: l.domaine } })}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline min-h-[44px]"
                        >
                          Poser une question
                        </button>
                      </div>
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
