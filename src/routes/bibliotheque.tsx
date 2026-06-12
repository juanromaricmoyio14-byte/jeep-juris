import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Search, BookOpen, X } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useServerFn } from "@tanstack/react-start";
import { fetchLawContent } from "@/lib/consulter.functions";
import * as Dialog from "@radix-ui/react-dialog";

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
    domaine: "travail",
    section: "Titre I",
    driveId: "1lksA0cP6u5-iGXTFsxh9TynQJBRZJYeG",
  },
  {
    id: "2",
    titre: "Art. 3-5 — Constitution des syndicats",
    domaine: "travail",
    section: "Titre II",
    driveId: "1cILsBLAerIA96bDGQWy4ue6gTzFK4skK",
  },
  {
    id: "3",
    titre: "Art. 6-14 — Enregistrement",
    domaine: "travail",
    section: "Titre II",
    driveId: "1bws1O_JmGIrvslxN8im7_BQM0t3q4qJ0",
  },
  {
    id: "4",
    titre: "Art. 15 — Statuts",
    domaine: "travail",
    section: "Titre II",
    driveId: "1ZONIR51xktYEkuBQ0w35fHiUVlBjBalt",
  },
  {
    id: "5",
    titre: "Art. 16-21 — Dispositions diverses",
    domaine: "travail",
    section: "Titre II",
    driveId: "1CEwpJGpkKyAvgcYwyaIj-V7qN04l54zb",
  },
  {
    id: "6",
    titre: "Art. 22 — Unions",
    domaine: "travail",
    section: "Titre II",
    driveId: "1_a7Wnt1zgICsplEfdJDHzia7Zlp2d9xj",
  },
  {
    id: "7",
    titre: "Art. 23-27 — Contrat individuel",
    domaine: "travail",
    section: "Titre III",
    driveId: "1I3Nu31Oyrhukw-4xIAQtnPkwRzPqEtLV",
  },
  {
    id: "8",
    titre: "Art. 28-31 — Essai et discipline",
    domaine: "travail",
    section: "Titre III",
    driveId: "1LkMalkcxmW8Ikw5TUl_uI7QY5WSKNrZv",
  },
  {
    id: "9",
    titre: "Art. 32-33 — Suspension",
    domaine: "travail",
    section: "Titre III",
    driveId: "1OPkB3wjYDGDyGaruOPr314te1AWh4D3G",
  },
  {
    id: "10",
    titre: "Art. 34-43 — Rupture du contrat",
    domaine: "travail",
    section: "Titre III",
    driveId: "1Wa6BcPCLjKBl3AMhQSOd5QH-kMSpNBys",
  },
  {
    id: "11",
    titre: "Art. 44 — Certificat de travail",
    domaine: "travail",
    section: "Titre III",
    driveId: "1_eaFyb-uGVcBdtyLs1TaFhq4ZSlT23QU",
  },
  {
    id: "12",
    titre: "Art. 45-47 — Apprentissage",
    domaine: "travail",
    section: "Titre III",
    driveId: "1a9dVcYGqk1COv-8sUPDu9VgHNvg9Zp5r",
  },
  {
    id: "13",
    titre: "Art. 48-51 — Tâcheronnat",
    domaine: "travail",
    section: "Titre III",
    driveId: "1nMTLZ_OhRd2zMvNVcjLmAUZ8pWiayMxD",
  },
  {
    id: "14",
    titre: "Art. 52-60 — Conventions collectives",
    domaine: "travail",
    section: "Titre III",
    driveId: "1pO9wGAOph7FDmM1L9UAouiCweMXXDxyG",
  },
  {
    id: "15",
    titre: "Art. 61-66 — Détermination du salaire",
    domaine: "travail",
    section: "Titre IV",
    driveId: "1uXoWVPdLMWZ0JMst1UfxaK9igi9BcD-H",
  },
  {
    id: "16",
    titre: "Art. 67-76 — Paiement du salaire",
    domaine: "travail",
    section: "Titre IV",
    driveId: "192tQxLvzwVl8NnwtHAxtd9OyMvFwEKub",
  },
  {
    id: "17",
    titre: "Art. 77 — Disposition sur le salaire",
    domaine: "travail",
    section: "Titre IV",
    driveId: "1uS3QOB1CQVuIflWdCjaiatfQI-zGK-Iw",
  },
  {
    id: "18",
    titre: "Art. 78-79 — Économats",
    domaine: "travail",
    section: "Titre IV",
    driveId: "1v6_iRz-VlvVe-WZQE8_IZAeYHbhuFbMN",
  },
  {
    id: "19",
    titre: "Art. 80 — Durée du travail",
    domaine: "travail",
    section: "Titre V",
    driveId: "1i6NXTLWFi2RHUaQBxngRj4cwGH9ELesU",
  },
  {
    id: "20",
    titre: "Art. 81-82 — Travail de nuit",
    domaine: "travail",
    section: "Titre V",
    driveId: "1SuI2J2nMO7FWY5nYW6TYpVRZAVVTarqF",
  },
  {
    id: "21",
    titre: "Art. 83-87 — Femmes et enfants",
    domaine: "travail",
    section: "Titre V",
    driveId: "1yWqYK9ovoPT0QZpsjPePJOCAfLFROXUp",
  },
  {
    id: "22",
    titre: "Art. 88 — Repos hebdomadaire",
    domaine: "travail",
    section: "Titre V",
    driveId: "18vli-sjr25lh3nw_5EV2ZIifVHBtwY4R",
  },
  {
    id: "23",
    titre: "Art. 89-93 — Congés payés",
    domaine: "travail",
    section: "Titre V",
    driveId: "1wnUgum0FQO3lSZ067BTBnRrF9qst3FwZ",
  },
  {
    id: "24",
    titre: "Art. 94 — Transports",
    domaine: "travail",
    section: "Titre V",
    driveId: "1DE7jpLhpomYt30enoLrlbWvUADSevs_H",
  },
  {
    id: "25",
    titre: "Art. 95-97 — Sécurité",
    domaine: "travail",
    section: "Titre VI",
    driveId: "1DSgOHNJlqLpQdBDaYeXRpqKCE4JZGyLd",
  },
  {
    id: "26",
    titre: "Art. 98-103 — Santé",
    domaine: "travail",
    section: "Titre VI",
    driveId: "17-eBawTpL8qjxoBHEFlQYuBcov75O3wQ",
  },
  {
    id: "27",
    titre: "Art. 104-111 — Inspection du travail",
    domaine: "travail",
    section: "Titre VII",
    driveId: "1g_EkupmZPAuc-ZSWUst899vi-eTJ9ruq",
  },
  {
    id: "28",
    titre: "Art. 112-113 — Placement",
    domaine: "travail",
    section: "Titre VII",
    driveId: "1I7Z4o3dOs01oBdB4Hv4jfchNRRNZdkEP",
  },
  {
    id: "29",
    titre: "Art. 114-116 — Registres",
    domaine: "travail",
    section: "Titre VII",
    driveId: "1w6aN0cXjFikuJe30q9Z8a6K-0E4aH35e",
  },
  {
    id: "30",
    titre: "Art. 117-119 — Commission du travail",
    domaine: "travail",
    section: "Titre VIII",
    driveId: "1jsjDzyhpYlm39rCMRoQJZvgXUP8NpHjs",
  },
  {
    id: "31",
    titre: "Art. 120-121 — Commission de santé",
    domaine: "travail",
    section: "Titre VIII",
    driveId: "1DOpTCDuHuLB9aJfIZfae7fhqILAWVofy",
  },
  {
    id: "32",
    titre: "Art. 122-130 — Délégués du personnel",
    domaine: "travail",
    section: "Titre VIII",
    driveId: "1WT3ATsZHErwfAobBJ7YyKi9FQUuuN1OI",
  },
  {
    id: "33",
    titre: "Art. 131-156 — Différend individuel",
    domaine: "travail",
    section: "Titre IX",
    driveId: "1qUWJtCMHMR4K959wu844RBSDblodYN-5",
  },
  {
    id: "34",
    titre: "Art. 157-165 — Différend collectif",
    domaine: "travail",
    section: "Titre IX",
    driveId: "1Sm2O4v7a9ieNJZoOlzHAN5Abp6d_AMP1",
  },
  {
    id: "35",
    titre: "Art. 166-173 — Pénalités",
    domaine: "travail",
    section: "Titre X-XI",
    driveId: "1r6-roMC-KYoORdDDvhaWKWQ5Wy4vdwFV",
  },
  {
    id: "36",
    titre: "Art. 174-177 — Dispositions finales",
    domaine: "travail",
    section: "Titre X-XI",
    driveId: "1-gFzEgOrOrYFo7Oa-VF8zDJNdsZfeOaP",
  },
] as const;

type Law = (typeof LAWS)[number];

type GroupedLaws = Record<string, Law[]>;

function formatLawText(raw: string) {
  // Put each "Article N" on its own line, bolded via markdown-ish marker rendered by component.
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\s*\b(Article\s+\d+[A-Za-z\-]*)\s*[:.\-]?\s*/g, "\n\n§§$1§§ ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

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
              filtered.reduce((acc: GroupedLaws, law) => {
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
                        onClick={() => openLaw(l)}
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

      <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[95vw] max-w-3xl translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-background p-4 sm:p-6 shadow-lg border border-border animate-in zoom-in-95 max-h-[88vh] flex flex-col">
            <div className="flex justify-between items-start gap-3 mb-4">
              <Dialog.Title
                className="text-lg sm:text-xl font-serif font-bold"
                style={{ color: "#1a5c38" }}
              >
                {selectedLaw?.titre ?? ""}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  aria-label="Fermer"
                  className="rounded-full p-2 hover:bg-muted min-h-[40px] min-w-[40px] inline-flex items-center justify-center shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {loadingLaw && (
                <div className="space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 rounded bg-muted animate-pulse"
                      style={{ width: `${60 + ((i * 7) % 35)}%` }}
                    />
                  ))}
                </div>
              )}
              {!loadingLaw && errorLaw && <p className="text-sm text-destructive">{errorLaw}</p>}
              {!loadingLaw && !errorLaw && lawContent && (
                <div className="text-sm text-foreground leading-relaxed space-y-3">
                  {lawContent.split(/\n\n+/).map((para, i) => {
                    const m = para.match(/^§§(Article\s+\d+[A-Za-z\-]*)§§\s*(.*)$/s);
                    if (m) {
                      return (
                        <p key={i} className="whitespace-pre-wrap">
                          <strong className="font-bold" style={{ color: "#1a5c38" }}>
                            {m[1]}
                          </strong>
                          {m[2] ? " — " : ""}
                          {m[2]}
                        </p>
                      );
                    }
                    return (
                      <p key={i} className="whitespace-pre-wrap">
                        {para}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-border">
              <Dialog.Close asChild>
                <button className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted min-h-[44px]">
                  Fermer
                </button>
              </Dialog.Close>
              <button
                onClick={() => {
                  setModalOpen(false);
                  navigate({ to: "/agent", search: { domaine: "labour" } });
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 min-h-[44px]"
                style={{ backgroundColor: "#1a5c38" }}
              >
                Poser une question sur ce texte
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
