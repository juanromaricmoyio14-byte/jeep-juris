import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Header } from "@/components/Header";
import { consulterAgent, type AgentResponse } from "@/lib/consulter.functions";
import {
  Send,
  RefreshCcw,
  ShieldAlert,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  Square,
  History,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { z } from "zod";
import { useAuth } from "@/components/AuthProvider";
import { getDb } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { getSpeechRecognition, speak, stopSpeaking } from "@/lib/speech";
import { BackButton } from "@/components/BackButton";
import { Briefcase, Scale, Users, Heart, MapPin, FileText, Trash2 } from "lucide-react";

const searchSchema = z.object({
  domaine: z.string().optional(),
});

export const Route = createFileRoute("/agent")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Agent juridique — JEEP JURIS" },
      {
        name: "description",
        content:
          "Consultez l'assistant juridique IA spécialisé en droit camerounais. Posez votre question et recevez une analyse structurée.",
      },
      { property: "og:title", content: "Agent juridique — JEEP JURIS" },
      {
        property: "og:description",
        content:
          "Posez votre question juridique et recevez une analyse structurée en droit camerounais.",
      },
      { property: "og:url", content: "https://jeep-juris.lovable.app/agent" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://jeep-juris.lovable.app/agent" }],
  }),
  component: AgentPage,
});

const DOMAINS = ["labour", "criminal", "civil", "family", "land", "procedures"] as const;
const LEVELS = ["simple", "standard", "technical"] as const;
type Level = (typeof LEVELS)[number];

interface ChatMessage {
  role: "user" | "agent";
  text?: string;
  response?: AgentResponse;
}

interface HistoryItem {
  id: string;
  question: string;
  domaine?: string;
  response?: AgentResponse;
  createdAt?: Timestamp;
}

const DOMAIN_ICONS: Record<string, typeof Briefcase> = {
  labour: Briefcase,
  criminal: Scale,
  civil: FileText,
  family: Heart,
  land: MapPin,
  procedures: Users,
};

function relativeTime(date: Date, lang: "fr" | "en"): string {
  const diff = (Date.now() - date.getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  if (diff < 60) return rtf.format(-Math.round(diff), "second");
  if (diff < 3600) return rtf.format(-Math.round(diff / 60), "minute");
  if (diff < 86400) return rtf.format(-Math.round(diff / 3600), "hour");
  if (diff < 604800) return rtf.format(-Math.round(diff / 86400), "day");
  return date.toLocaleDateString(lang, { day: "2-digit", month: "short" });
}

function AgentPage() {
  const { t, i18n } = useTranslation();
  const search = Route.useSearch();
  const { user } = useAuth();
  const [domaine, setDomaine] = useState<string>(search.domaine ?? "labour");
  const [niveau, setNiveau] = useState<Level>("standard");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const consult = useServerFn(consulterAgent);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // History subscription
  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }
    const db = getDb();
    if (!db) {
      console.warn("[agent] Firestore not initialized — history disabled");
      return;
    }
    const q = query(
      collection(db, "consultations"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(10),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setHistory(
          snap.docs.map((d) => {
            const data = d.data() as any;
            return {
              id: d.id,
              question: (data.question as string) ?? "",
              domaine: data.domaine as string | undefined,
              response: data.response as AgentResponse | undefined,
              createdAt: data.createdAt as Timestamp | undefined,
            };
          }),
        );
      },
      (err) => console.error("[agent] history snapshot error", err),
    );
    return () => unsub();
  }, [user]);

  const clearHistory = useCallback(async () => {
    if (!user) return;
    if (!confirm(lang === "en" ? "Clear all history?" : "Effacer tout l'historique ?")) return;
    const db = getDb();
    if (!db) return;
    try {
      const q = query(collection(db, "consultations"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, "consultations", d.id))));
    } catch (e) {
      console.error("Clear history failed", e);
    }
  }, [user]);

  const loadHistoryItem = useCallback((h: HistoryItem) => {
    setError(null);
    setMessages([
      { role: "user", text: h.question },
      ...(h.response ? [{ role: "agent" as const, response: h.response }] : []),
    ]);
    if (h.domaine) setDomaine(h.domaine);
    setSidebarOpen(false);
  }, []);

  const submit = useCallback(
    async (questionArg?: string) => {
      const question = (questionArg ?? input).trim();
      if (!question || loading) return;
      setInput("");
      setError(null);
      setMessages((m) => [...m, { role: "user", text: question }]);
      setLoading(true);
      try {
        const langue = (i18n.language?.startsWith("en") ? "en" : "fr") as "fr" | "en";
        if (!user) {
          setError(t("agent.errorGeneric"));
          setLoading(false);
          return;
        }
        const idToken = await user.getIdToken();
        // Get last 3 exchanges from local messages (ignoring loading states or non-text responses)
        const recentHistory = messages
          .slice(-6) // Last 3 exchanges = 6 messages max
          .map((m) => ({
            role: m.role === "agent" ? ("model" as const) : ("user" as const),
            text: m.role === "user" ? m.text! : JSON.stringify(m.response),
          }));

        const result = await consult({
          data: { question, domaine, langue, niveau, idToken, history: recentHistory },
        });
        if (result.ok && result.data) {
          setMessages((m) => [...m, { role: "agent", response: result.data }]);
          // Save to Firestore
          if (user) {
            const db = getDb();
            if (db) {
              try {
                await addDoc(collection(db, "consultations"), {
                  userId: user.uid,
                  question: question,
                  domaine: domaine,
                  langue: langue,
                  reponse: result.data,
                  response: result.data,
                  createdAt: serverTimestamp(),
                });
              } catch (e) {
                console.error("Save consult failed", e);
              }
            }
          }
        } else {
          setError(
            result.error === "MISSING_KEY" ? t("agent.errorMissingKey") : t("agent.errorGeneric"),
          );
        }
      } catch (e) {
        console.error(e);
        setError(t("agent.errorGeneric"));
      } finally {
        setLoading(false);
      }
    },
    [input, loading, i18n.language, consult, domaine, niveau, user, t],
  );

  const reset = () => {
    setMessages([]);
    setError(null);
    setInput("");
    stopSpeaking();
  };

  // Voice input
  const toggleListening = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) {
      setVoiceError(t("agent.voiceUnsupported"));
      return;
    }
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }
    const rec = new SR();
    rec.lang = i18n.language?.startsWith("en") ? "en-US" : "fr-FR";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(" ");
      setInput((prev) => (prev ? prev + " " : "") + transcript);
    };
    rec.onerror = (e: any) => {
      console.error("Speech error", e);
      setVoiceError(t("agent.voiceUnsupported"));
    };
    rec.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = rec;
    setVoiceError(null);
    setListening(true);
    try {
      rec.start();
    } catch (e) {
      console.error(e);
      setListening(false);
    }
  }, [listening, i18n.language, t]);

  // Ctrl+D shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        toggleListening();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleListening]);

  useEffect(() => () => stopSpeaking(), []);

  const lang = (i18n.language?.startsWith("en") ? "en" : "fr") as "fr" | "en";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <div className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-6 sm:py-6 animate-in fade-in duration-500">
        <BackButton />
        <div className="grid gap-4 lg:gap-8 lg:grid-cols-[300px_1fr] relative">
          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`space-y-4 fixed lg:sticky lg:top-20 inset-y-0 left-0 z-50 w-[300px] max-w-[85vw] bg-background lg:bg-transparent p-4 lg:p-0 shadow-2xl lg:shadow-none transition-transform duration-300 lg:transform-none lg:self-start lg:max-h-[calc(100vh-6rem)] overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
          >
            <div className="flex justify-between items-center lg:hidden mb-2">
              <h2 className="font-serif font-bold text-primary text-lg">Options</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <h1 className="sr-only">{t("agent.title")}</h1>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <label
                htmlFor="agent-domain-select"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {t("agent.domainLabel")}
              </label>
              <select
                id="agent-domain-select"
                value={domaine}
                onChange={(e) => setDomaine(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {t(`domains.${d}`)}
                  </option>
                ))}
              </select>

              <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("agent.levelLabel")}
              </label>
              <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg border border-border bg-background p-1">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setNiveau(lvl)}
                    className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                      niveau === lvl
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {t(`agent.level${lvl[0].toUpperCase() + lvl.slice(1)}`)}
                  </button>
                ))}
              </div>

              <button
                onClick={reset}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium hover:bg-muted hover:border-primary/40 transition"
              >
                <RefreshCcw className="h-3.5 w-3.5" /> {t("agent.newConsult")}
              </button>
            </div>

            {/* History */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <History className="h-3.5 w-3.5" /> {t("agent.historyTitle")}
              </div>
              {!user && (
                <p className="text-xs text-muted-foreground p-2">
                  Connectez-vous pour voir votre historique
                </p>
              )}
              {user && history.length === 0 && (
                <p className="text-xs text-muted-foreground p-2">Aucune consultation</p>
              )}
              <ul className="space-y-1 max-h-80 overflow-y-auto -mx-1 px-1">
                {history.map((h) => {
                  const words = h.question.split(/\s+/);
                  const preview = words.slice(0, 8).join(" ") + (words.length > 8 ? "..." : "");
                  const date = h.createdAt?.toDate?.();
                  const Icon = DOMAIN_ICONS[h.domaine ?? ""] ?? FileText;
                  return (
                    <li key={h.id}>
                      <button
                        onClick={() => loadHistoryItem(h)}
                        className="w-full rounded-md px-2 py-2 text-left hover:bg-muted transition group"
                      >
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1 flex-wrap">
                          <Icon className="h-3 w-3 text-primary" />
                          <span>{date ? relativeTime(date, lang) : ""}</span>
                          <span>•</span>
                          <span>{h.domaine ? t(`agent.domains.${h.domaine}`) : ""}</span>
                        </div>
                        <div className="italic text-xs text-foreground/90 line-clamp-2 group-hover:text-primary">
                          {preview}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {user && history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />{" "}
                  {lang === "en" ? "Clear history" : "Effacer l'historique"}
                </button>
              )}
            </div>

            <div className="flex gap-3 rounded-2xl border border-secondary/40 bg-secondary/10 p-4 text-xs text-secondary-foreground">
              <ShieldAlert className="h-5 w-5 flex-shrink-0 text-secondary" />
              <p className="leading-relaxed">{t("agent.disclaimer")}</p>
            </div>
          </aside>

          {/* Chat */}
          <section className="flex min-h-[calc(100vh-12rem)] lg:min-h-[calc(100vh-9rem)] flex-col rounded-2xl border border-border bg-card shadow-md overflow-hidden">
            <div className="lg:hidden flex items-center gap-3 p-3 border-b border-border bg-muted/40">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-background min-h-[44px] min-w-[44px] flex items-center justify-center border border-border bg-background"
                aria-label="Ouvrir les options"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="font-serif font-semibold text-sm truncate">
                  {t(`domains.${domaine}`)}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {t(`agent.level${niveau[0].toUpperCase() + niveau.slice(1)}`)}
                </div>
              </div>
            </div>
            <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
              {messages.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-10">
                  <Sparkles className="h-10 w-10 text-secondary mb-4" />
                  <p className="font-serif text-lg mb-8">{t("agent.emptyState")}</p>

                  <div className="grid gap-3 w-full max-w-2xl sm:grid-cols-2 text-left">
                    {[
                      "Mon employeur refuse de me payer depuis 2 mois. Que faire ?",
                      "J'ai été licencié sans préavis après 5 ans. Est-ce légal ?",
                      "Je veux divorcer mais mon conjoint refuse. Quels sont mes droits ?",
                      "Mon propriétaire veut m'expulser sans raison. Comment me défendre ?",
                      "J'ai été arrêté par la police. Quels sont mes droits ?",
                      "Mon voisin a construit sur mon terrain. Que faire ?",
                    ].map((q, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInput(q);
                          submit(q);
                        }}
                        className="p-3 text-sm rounded-xl border border-border bg-card hover:bg-muted transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm text-primary-foreground">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-start">
                    <AgentBubble response={m.response!} lang={lang} />
                  </div>
                ),
              )}

              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex gap-1">
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-primary"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-primary"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-primary"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  {t("agent.loading")}
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="border-t border-border p-4"
            >
              {listening && (
                <div className="mb-2 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
                  </span>
                  {t("agent.voiceListening")}
                </div>
              )}
              {voiceError && (
                <div className="mb-2 rounded-lg bg-secondary/10 px-3 py-1.5 text-xs text-secondary-foreground">
                  {voiceError}
                </div>
              )}
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  placeholder={t("agent.placeholder")}
                  rows={2}
                  className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={toggleListening}
                  title={t("agent.mic")}
                  aria-label={t("agent.mic")}
                  className={`inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                    listening
                      ? "border-destructive bg-destructive text-destructive-foreground"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" /> {t("agent.send")}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

function buildSpokenText(r: AgentResponse): string {
  const parts: string[] = [];
  if (r.reformulation) parts.push(r.reformulation);
  if (r.analyse) parts.push(r.analyse);
  if (r.actions_recommandees?.length) parts.push(r.actions_recommandees.join(". "));
  return parts.join(". ");
}

function AgentBubble({ response, lang }: { response: AgentResponse; lang: "fr" | "en" }) {
  const { t } = useTranslation();
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    setSpeaking(true);
    speak(buildSpokenText(response), lang);
    // poll for end
    const id = setInterval(() => {
      if (typeof window !== "undefined" && !window.speechSynthesis.speaking) {
        setSpeaking(false);
        clearInterval(id);
      }
    }, 400);
  };
  const handleStop = () => {
    stopSpeaking();
    setSpeaking(false);
  };

  return (
    <div className="max-w-[90%] space-y-4 rounded-2xl rounded-tl-sm border border-border bg-background p-5 text-sm shadow-sm">
      <div className="flex justify-end gap-2">
        {speaking ? (
          <button
            onClick={handleStop}
            title={t("agent.stopSpeak")}
            className="inline-flex items-center gap-1 rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/20"
          >
            <Square className="h-3 w-3" /> {t("agent.stopSpeak")}
          </button>
        ) : (
          <button
            onClick={handleSpeak}
            title={t("agent.speak")}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-primary"
          >
            <Volume2 className="h-3 w-3" /> {t("agent.speak")}
          </button>
        )}
      </div>

      <Block title={t("agent.reformulation") || "Résumé"}>
        <p className="italic text-muted-foreground">{response.reformulation}</p>
      </Block>

      {response.actions_recommandees?.length > 0 && (
        <Block title={t("agent.recommendedActions") || "Que faire ?"}>
          <ul className="list-disc space-y-1 pl-5">
            {response.actions_recommandees.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Block>
      )}

      <Block title={t("agent.analysis")}>
        <p className="whitespace-pre-wrap leading-relaxed">{response.analyse}</p>
      </Block>

      {response.textes_applicables?.length > 0 && (
        <Accordion.Root type="single" collapsible className="w-full mt-4">
          <Accordion.Item
            value="sources"
            className="border border-border rounded-lg overflow-hidden"
          >
            <Accordion.Header className="flex">
              <Accordion.Trigger className="flex flex-1 items-center justify-between bg-muted/30 px-4 py-3 text-sm font-semibold hover:bg-muted/50 transition-all [&[data-state=open]>svg]:rotate-180">
                Voir les sources
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="p-4 bg-card/50">
                <ul className="space-y-3">
                  {response.textes_applicables.map((tx, i) => (
                    <li
                      key={i}
                      className="rounded-lg border-l-4 border-secondary bg-secondary/5 px-3 py-2"
                    >
                      <p className="font-semibold text-foreground">
                        {tx.loi} — {tx.article}
                      </p>
                      <p className="mt-1.5 text-muted-foreground text-xs leading-relaxed">
                        {tx.contenu}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      )}

      {response.institutions?.length > 0 && (
        <Block title={t("agent.institutions")}>
          <div className="flex flex-wrap gap-2">
            {response.institutions.map((inst, i) => (
              <span
                key={i}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {inst}
              </span>
            ))}
          </div>
        </Block>
      )}

      <p className="mt-2 border-t border-border pt-3 text-xs italic text-muted-foreground">
        {response.disclaimer}
      </p>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-1.5 font-serif text-base font-semibold text-primary">{title}</h4>
      {children}
    </div>
  );
}
