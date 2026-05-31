import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Search, BookOpen, X } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useServerFn } from "@tanstack/react-start";
import { getLibraryDoc } from "@/lib/consulter.functions";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";

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
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Bibliothèque des lois — JEEP JURIS",
          description: "Bibliothèque des principaux textes du droit camerounais.",
          url: "https://jeep-juris.lovable.app/bibliotheque",
          inLanguage: ["fr", "en"],
        }),
      },
    ],
  }),
  component: LibraryPage,
});

const LAWS = [
  {
    id: "code-travail",
    domain: "labour",
    titleFr: "Code du Travail",
    titleEn: "Labour Code",
    descFr: "Loi n° 92/007 régissant les relations de travail au Cameroun.",
    descEn: "Law no. 92/007 governing labour relations in Cameroon.",
  },
  {
    id: "code-penal",
    domain: "criminal",
    titleFr: "Code Pénal",
    titleEn: "Penal Code",
    descFr: "Loi n° 2016/007 portant Code pénal camerounais.",
    descEn: "Law no. 2016/007 — Cameroonian Penal Code.",
  },
  {
    id: "code-procedure-penale",
    domain: "criminal",
    titleFr: "Code de Procédure Pénale",
    titleEn: "Criminal Procedure Code",
    descFr: "Loi n° 2005/007 régissant la procédure pénale.",
    descEn: "Law no. 2005/007 governing criminal procedure.",
  },
  {
    id: "code-civil",
    domain: "civil",
    titleFr: "Code Civil",
    titleEn: "Civil Code",
    descFr: "Dispositions générales sur les contrats et obligations.",
    descEn: "General provisions on contracts and obligations.",
  },
  {
    id: "code-famille",
    domain: "family",
    titleFr: "Ordonnance sur l'état civil",
    titleEn: "Civil Status Ordinance",
    descFr: "Mariage, divorce, filiation et succession.",
    descEn: "Marriage, divorce, parentage and inheritance.",
  },
  {
    id: "code-foncier",
    domain: "land",
    titleFr: "Ordonnance foncière n° 74-1",
    titleEn: "Land Ordinance no. 74-1",
    descFr: "Régime de la propriété foncière au Cameroun.",
    descEn: "Land property regime in Cameroon.",
  },
  {
    id: "procedures-admin",
    domain: "procedures",
    titleFr: "Procédures administratives",
    titleEn: "Administrative procedures",
    descFr: "Démarches courantes auprès des administrations.",
    descEn: "Common procedures with administrations.",
  },
] as const;

const FILTERS = ["all", "labour", "criminal", "civil", "family", "land", "procedures"] as const;

function LibraryPage() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith("en");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLaw, setSelectedLaw] = useState<(typeof LAWS)[number] | null>(null);
  const [lawContent, setLawContent] = useState<string | null>(null);
  const [loadingLaw, setLoadingLaw] = useState(false);
  const getDoc = useServerFn(getLibraryDoc);
  const navigate = useNavigate();

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
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 animate-in fade-in duration-500">
        <BackButton />
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

        <h2 className="sr-only">{t("library.subtitle")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l, index) => (
            <article
              key={l.id}
              className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md animate-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
            >
              <BookOpen className="h-6 w-6 text-secondary" />
              <h2 className="mt-3 font-serif text-lg font-semibold">
                {isEn ? l.titleEn : l.titleFr}
              </h2>
              <p className="mt-1 text-xs uppercase tracking-wide text-primary/70">
                {t(`domains.${l.domain}`)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{isEn ? l.descEn : l.descFr}</p>
              <button
                onClick={async () => {
                  setSelectedLaw(l);
                  setModalOpen(true);
                  setLoadingLaw(true);
                  setLawContent(null);
                  try {
                    const res = await getDoc({ data: { domain: l.domain } });
                    if (res.ok && res.text) {
                      setLawContent(res.text);
                    } else {
                      setLawContent("Le document n'a pas pu être chargé.");
                    }
                  } catch (e) {
                    setLawContent("Erreur de chargement.");
                  } finally {
                    setLoadingLaw(false);
                  }
                }}
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline min-h-[44px]"
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
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-background p-6 shadow-lg border border-border animate-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-serif font-bold text-primary">
                {selectedLaw ? (isEn ? selectedLaw.titleEn : selectedLaw.titleFr) : ""}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="rounded-full p-2 hover:bg-muted min-h-[44px] min-w-[44px] inline-flex items-center justify-center">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {loadingLaw ? (
                <div className="space-y-4">
                  <div className="h-4 w-3/4 rounded bg-muted animate-pulse"></div>
                  <div className="h-4 w-full rounded bg-muted animate-pulse"></div>
                  <div className="h-4 w-5/6 rounded bg-muted animate-pulse"></div>
                  <div className="h-4 w-full rounded bg-muted animate-pulse"></div>
                  <div className="h-4 w-2/3 rounded bg-muted animate-pulse"></div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                  {lawContent}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
              <Dialog.Close asChild>
                <button className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted min-h-[44px]">
                  Fermer
                </button>
              </Dialog.Close>
              <button
                onClick={() => {
                  setModalOpen(false);
                  if (selectedLaw) {
                    navigate({ to: "/agent", search: { domaine: selectedLaw.domain } });
                  }
                }}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 min-h-[44px]"
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
