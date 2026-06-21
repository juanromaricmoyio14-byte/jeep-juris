import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { fetchLawContent } from "@/lib/consulter.functions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

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
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<(typeof LEGAL_CODES)[number] | null>(null);
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const getLawContent = useServerFn(fetchLawContent);

  const openCode = async (code: (typeof LEGAL_CODES)[number]) => {
    if (!code.driveId) return;
    setSelectedCode(code);
    setModalContent("");
    setIsLoading(true);
    setIsModalOpen(true);
    try {
      const result = await getLawContent({ data: { driveId: code.driveId } });
      if (result.ok && result.content) {
        setModalContent(result.content);
      } else {
        setModalContent(
          result.error || "Une erreur s'est produite lors du chargement du document.",
        );
      }
    } catch (e) {
      setModalContent("Impossible de charger le document.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 animate-in fade-in duration-500">
        <BackButton />
        <h1 className="font-serif text-4xl font-bold text-primary mb-6">Bibliothèque des lois</h1>

        <div className="mt-6 space-y-5">
          {LEGAL_CODES.map((code) => (
            <div
              key={code.id}
              className="bg-white rounded-xl shadow-md p-6 w-full animate-in slide-in-from-bottom-4 duration-500"
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
                          className="px-4 py-3 rounded-lg font-medium text-base min-h-[48px] hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: "#1a5c38", color: "white" }}
                          onClick={() => openCode(code)}
                        >
                          📖 Lire le texte complet
                        </button>
                        <button
                          className="px-4 py-3 rounded-lg font-medium text-base min-h-[48px] hover:bg-secondary/10 transition-colors"
                          style={{ border: "2px solid #c9a84c", color: "#c9a84c" }}
                          onClick={() =>
                            navigate({
                              to: "/agent",
                              search: {
                                domaine: code.id === "travail" ? "labour" : undefined,
                              },
                            })
                          }
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

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0">
            <DialogHeader className="p-6 pb-2 border-b">
              <DialogTitle className="text-2xl font-serif text-primary flex items-center gap-2">
                {selectedCode?.icon} {selectedCode?.titre}
              </DialogTitle>
              <DialogDescription>{selectedCode?.loi}</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[95%]" />
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[85%]" />
                  <Skeleton className="h-4 w-[90%]" />
                </div>
              ) : (
                <div className="whitespace-pre-wrap font-sans text-sm text-foreground/90">
                  {modalContent}
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-background flex justify-end">
              <button
                className="px-4 py-2 rounded-lg font-medium text-sm hover:bg-secondary/10 transition-colors"
                style={{ border: "2px solid #c9a84c", color: "#c9a84c" }}
                onClick={() => {
                  setIsModalOpen(false);
                  navigate({
                    to: "/agent",
                    search: {
                      domaine: selectedCode?.id === "travail" ? "labour" : undefined,
                    },
                  });
                }}
              >
                💬 Poser une question sur ce texte
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
