import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getLibraryDoc } from "@/lib/consulter.functions";

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
  const navigate = useNavigate();
  const fetchDoc = useServerFn(getLibraryDoc);
  const [selectedDoc, setSelectedDoc] = useState<{ id: string; titre: string } | null>(null);
  const [docContent, setDocContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenDoc = async (code: (typeof LEGAL_CODES)[0]) => {
    // For now we map "travail" to "labour" to match the server function DOMAIN_DRIVE_KEYS
    const domainMap: Record<string, string> = {
      travail: "labour",
      penal: "criminal",
      civil: "civil",
      famille: "family",
      foncier: "land",
    };
    const domain = domainMap[code.id] || code.id;

    setSelectedDoc({ id: code.id, titre: code.titre });
    setDocContent(null);
    setError(null);
    setLoading(true);

    try {
      const res = await fetchDoc({ data: { domain } });
      if (res.ok && res.text) {
        setDocContent(res.text);
      } else {
        setError("Document indisponible pour le moment.");
      }
    } catch (e) {
      setError("Erreur lors de la récupération du document.");
    } finally {
      setLoading(false);
    }
  };

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
              className="bg-white rounded-xl shadow-md p-6 mb-5 w-full animate-in slide-in-from-bottom-4 duration-500 fill-mode-both"
              style={{
                borderLeft: "4px solid #1a5c38",
                animationDelay: `${code.id === "travail" ? 100 : code.id === "penal" ? 200 : code.id === "civil" ? 300 : code.id === "famille" ? 400 : 500}ms`,
              }}
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
                          className="px-4 py-3 rounded-lg font-medium text-base min-h-[48px] inline-flex items-center justify-center min-w-[44px]"
                          style={{ backgroundColor: "#1a5c38", color: "white" }}
                          onClick={() => handleOpenDoc(code)}
                        >
                          📖 Lire le texte complet
                        </button>
                        <button
                          className="px-4 py-3 rounded-lg font-medium text-base min-h-[48px] inline-flex items-center justify-center min-w-[44px]"
                          style={{ border: "2px solid #c9a84c", color: "#c9a84c" }}
                          onClick={() => navigate({ to: "/agent" })}
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
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col overflow-hidden p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
            <DialogTitle className="text-xl font-serif text-primary">
              {selectedDoc?.titre}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Contenu complet du {selectedDoc?.titre}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 text-sm text-foreground/90 whitespace-pre-wrap">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ) : error ? (
              <div className="text-destructive p-4 bg-destructive/10 rounded-lg text-center">
                {error}
              </div>
            ) : (
              <div>{docContent}</div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-border flex-shrink-0 flex justify-end gap-3 bg-muted/20">
            <button
              onClick={() => setSelectedDoc(null)}
              className="px-4 py-2 rounded-lg font-medium text-sm border border-border hover:bg-muted min-h-[44px] inline-flex items-center justify-center"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                setSelectedDoc(null);
                navigate({ to: "/agent" });
              }}
              className="px-4 py-2 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:opacity-90 min-h-[44px] inline-flex items-center justify-center gap-2"
            >
              💬 Poser une question sur ce texte
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
