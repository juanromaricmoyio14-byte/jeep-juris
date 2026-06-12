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
    id: "travail_1",
    titre: "Code du Travail — Titre I : Dispositions Générales",
    domaine: "travail",
    driveId: "1wIjlKSB2A9mmpBlVsd4v9w0aiozevp4N",
  },
  {
    id: "travail_2",
    titre: "Code du Travail — Titre II : Syndicats",
    domaine: "travail",
    driveId: "1xCSo-SeTBvYDVu_-oUbIviKmJHkq6gNw",
  },
  {
    id: "travail_3",
    titre: "Code du Travail — Titre III : Contrat de Travail",
    domaine: "travail",
    driveId: "1Y7kj1HZlGqZlcL1ROXQEF8VjyaZakoZD",
  },
  {
    id: "travail_4",
    titre: "Code du Travail — Titre IV : Salaire",
    domaine: "travail",
    driveId: "1woQkWM36vu4bxayUHveBBUI-d4P7GfJE",
  },
  {
    id: "travail_5",
    titre: "Code du Travail — Titre V : Conditions de Travail",
    domaine: "travail",
    driveId: "1rpdHHOMB1Fq6GSQGtdcD5BINK1Uk5ZKR",
  },
  {
    id: "travail_6",
    titre: "Code du Travail — Titre VI : Sécurité et Santé",
    domaine: "travail",
    driveId: "1U4VWTk0QUZjmIjary8tMS3o1RxLt95tO",
  },
  {
    id: "travail_7",
    titre: "Code du Travail — Titre VII : Organismes de Contrôle",
    domaine: "travail",
    driveId: "190nAFspoU6dYVWd3EMefTW2zPfXEIeN2",
  },
  {
    id: "travail_8",
    titre: "Code du Travail — Titre VIII : Institutions",
    domaine: "travail",
    driveId: "1XOCeoQFFYzwsXAMBOjR3jIL2n7uOUoFy",
  },
  {
    id: "travail_9",
    titre: "Code du Travail — Titre IX : Différends",
    domaine: "travail",
    driveId: "1CqCqRDlKKodbnxIXspAiIFkWDiOr5hlg",
  },
  {
    id: "travail_10",
    titre: "Code du Travail — Titre X & XI : Pénalités",
    domaine: "travail",
    driveId: "13egld3dHJO21aMKM-EyFmuNGi7N4yGtM",
  },
] as const;

type Law = (typeof LAWS)[number];

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

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l, index) => (
            <article
              key={l.id}
              className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md animate-in slide-in-from-bottom-4 duration-500 flex flex-col"
              style={{ animationDelay: `${index * 40}ms`, animationFillMode: "both" }}
            >
              <BookOpen className="h-6 w-6 text-secondary" />
              <h2 className="mt-3 font-serif text-base font-semibold leading-snug">{l.titre}</h2>
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
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-sm text-muted-foreground">
              {t("library.noResults")}
            </p>
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
