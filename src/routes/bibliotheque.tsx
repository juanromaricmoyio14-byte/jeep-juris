import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { fetchLawContent } from "@/lib/consulter.functions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";

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

const LEGAL_CODES = [
  {
    id: "travail",
    titre: "Code du Travail Camerounais",
    loi: "Loi n°92/007 du 14 août 1992",
    description:
      "Régit les rapports entre employeurs et travailleurs au Cameroun. Contient 177 articles organisés en 10 titres couvrant les contrats, salaires, conditions de travail et procédures.",
    articles: "177 articles — 10 titres",
    icon: "💼",
    available: true,
    pdfPath: "/code_travail_cameroun.pdf",
    driveId: "1lksA0cP6u5-iGXTFsxh9TynQJBRZJYeG1",
  },
  {
    id: "penal",
    titre: "Code Pénal Camerounais",
    loi: "Loi n°2016/007 du 12 juillet 2016",
    description:
      "Définit les infractions pénales et les peines applicables sur le territoire camerounais.",
    articles: "En cours d'intégration",
    icon: "⚖️",
    available: false,
  },
  {
    id: "civil",
    titre: "Code Civil Camerounais",
    loi: "Héritage du droit français",
    description:
      "Régit les rapports entre personnes : contrats, obligations, responsabilité et propriété.",
    articles: "En cours d'intégration",
    icon: "📜",
    available: false,
  },
  {
    id: "famille",
    titre: "Code de la Famille",
    loi: "Ordonnance n°81/02 du 29 juin 1981",
    description:
      "Encadre le mariage, le divorce, la filiation, la succession et l'autorité parentale.",
    articles: "En cours d'intégration",
    icon: "👨‍👩‍👧",
    available: false,
  },
  {
    id: "foncier",
    titre: "Droit Foncier Camerounais",
    loi: "Ordonnance n°74/1 du 6 juillet 1974",
    description:
      "Régit la propriété foncière, les titres fonciers et la résolution des conflits de terrain.",
    articles: "En cours d'intégration",
    icon: "🏡",
    available: false,
  },
];

function LibraryPage() {
  const [selectedDoc, setSelectedDoc] = useState<(typeof LEGAL_CODES)[0] | null>(null);
  const [docContent, setDocContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const getLawContent = useServerFn(fetchLawContent);

  useEffect(() => {
    if (selectedDoc?.driveId) {
      setLoading(true);
      setDocContent(null);
      getLawContent({ data: { driveId: selectedDoc.driveId } })
        .then((res) => {
          if (res.ok && res.content) {
            setDocContent(res.content);
          } else {
            setDocContent("Impossible de charger le document.");
          }
        })
        .catch(() => setDocContent("Erreur lors du chargement."))
        .finally(() => setLoading(false));
    }
  }, [selectedDoc, getLawContent]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 animate-in fade-in duration-500">
        <BackButton />
        <h1 className="font-serif text-4xl font-bold text-primary mb-6">Bibliothèque des lois</h1>

        <div className="mt-6">
          {LEGAL_CODES.map((code) => (
            <div
              key={code.id}
              className="bg-white rounded-xl shadow-md p-6 mb-5 w-full animate-in slide-in-from-bottom-4 duration-500"
              style={{ borderLeft: "4px solid #1a5c38" }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl leading-none">{code.icon}</span>
                <div className="flex-1">
                  <h2 className="text-xl font-bold" style={{ color: "#1a5c38" }}>
                    {code.titre}
                  </h2>
                  <p className="text-sm italic text-gray-500 mt-1">{code.loi}</p>
                  <p className="text-base text-gray-700 mt-3 leading-relaxed">{code.description}</p>
                  <div
                    className="inline-block mt-2 px-3 py-1 text-sm rounded-full font-medium"
                    style={{ backgroundColor: "#f0f7f4", color: "#1a5c38" }}
                  >
                    {code.articles}
                  </div>

                  <div className="mt-4 flex gap-3 flex-wrap">
                    {code.available ? (
                      <>
                        <button
                          className="px-4 py-3 rounded-lg font-medium text-base min-h-[48px]"
                          style={{ backgroundColor: "#1a5c38", color: "white" }}
                          onClick={() => setSelectedDoc(code)}
                        >
                          📖 Lire le texte complet
                        </button>
                        <button
                          className="px-4 py-3 rounded-lg font-medium text-base min-h-[48px]"
                          style={{ border: "2px solid #c9a84c", color: "#c9a84c" }}
                          onClick={() => (window.location.href = "/agent")}
                        >
                          💬 Poser une question
                        </button>
                      </>
                    ) : (
                      <span
                        className="px-4 py-2 rounded-full text-sm font-medium"
                        style={{ backgroundColor: "#c9a84c", color: "white" }}
                      >
                        ⏳ Bientôt disponible
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />

      <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30">
            <DialogTitle className="text-xl font-serif text-primary">
              {selectedDoc?.titre}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{selectedDoc?.loi}</p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 bg-card text-sm leading-relaxed text-card-foreground">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{docContent}</div>
            )}
          </div>

          <div className="p-4 border-t border-border flex justify-end gap-3 bg-muted/30">
            <button
              onClick={() => setSelectedDoc(null)}
              className="px-4 py-2 rounded-lg border border-border hover:bg-muted font-medium text-sm transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                const domainMapping: Record<string, string> = {
                  travail: "labour",
                  penal: "criminal",
                  civil: "civil",
                  famille: "family",
                  foncier: "land",
                };
                const domainParam = domainMapping[selectedDoc?.id || ""] || "labour";
                window.location.href = `/agent?domaine=${domainParam}`;
              }}
              className="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              style={{ backgroundColor: "#1a5c38", color: "white" }}
            >
              💬 Poser une question sur ce texte
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
