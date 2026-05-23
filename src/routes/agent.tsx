import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Header } from "@/components/Header";
import { consulterAgent, type AgentResponse } from "@/lib/consulter.functions";
import { Send, RefreshCcw, ShieldAlert, Sparkles, Mic, MicOff, Volume2, Square, History } from "lucide-react";
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
  type Timestamp,
} from "firebase/firestore";
import { getSpeechRecognition, speak, stopSpeaking } from "@/lib/speech";

const searchSchema = z.object({
  domaine: z.string().optional(),
});

export const Route = createFileRoute("/agent")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Agent juridique — JEEP JURIS" },
      { name: "description", content: "Consultez l'assistant juridique IA spécialisé en droit camerounais. Posez votre question et recevez une analyse structurée." },
      { property: "og:title", content: "Agent juridique — JEEP JURIS" },
      { property: "og:description", content: "Posez votre question juridique et recevez une analyse structurée en droit camerounais." },
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
  createdAt?: Timestamp;
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
    if (!db) return;
    const q = query(
      collection(db, "users", user.uid, "consultations"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const unsub = onSnapshot(q, (snap) => {
      setHistory(
        snap.docs.map((d) => ({
          id: d.id,
          question: (d.data().question as string) ?? "",
          createdAt: d.data().createdAt as Timestamp | undefined,
        }))
      );
    });
    return () => unsub();
  }, [user]);

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
        const result = await consult({ data: { question, domaine, langue, niveau, idToken } });
        if (result.ok && result.data) {
          setMessages((m) => [...m, { role: "agent", response: result.data }]);
          // Save to Firestore
          if (user) {
            const db = getDb();
            if (db) {
              try {
                await addDoc(collection(db, "users", user.uid, "consultations"), {
                  question,
                  domaine,
                  niveau,
                  langue,
                  response: result.data,
                  createdAt: serverTimestamp(),
                });
              } catch (e) {
                console.error("Save consult failed", e);
              }
            }
          }
        } else {
          setError(result.error === "MISSING_KEY" ? t("agent.errorMissingKey") : t("agent.errorGeneric"));
        }
      } catch (e) {
        console.error(e);
        setError(t("agent.errorGeneric"));
      } finally {
        setLoading(false);
      }
    },
    [input, loading, i18n.language, consult, domaine, niveau, user, t]
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("agent.domainLabel")}
              </label>
              <select
                value={domaine}
                onChange={(e) => setDomaine(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>{t(`domains.${d}`)}</option>
                ))}
              </select>

              <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("agent.levelLabel")}
              </label>
              <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg border border-border bg-background p-1">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setNiveau(lvl)}
                    className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                      niveau === lvl
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {t(`agent.level${lvl[0].toUpperCase() + lvl.slice(1)}`)}
                  </button>
                ))}
              </div>

              <button
                onClick={reset}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                <RefreshCcw className="h-3.5 w-3.5" /> {t("agent.newConsult")}
              </button>
            </div>

            {/* History */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <History className="h-3.5 w-3.5" /> {t("agent.historyTitle")}
              </div>
              {!user && (
                <p className="text-xs text-muted-foreground">{t("agent.historyLoginRequired")}</p>
              )}
              {user && history.length === 0 && (
                <p className="text-xs text-muted-foreground">{t("agent.historyEmpty")}</p>
              )}
              <ul className="max-h-72 space-y-1 overflow-y-auto">
                {history.map((h) => {
                  const preview = h.question.split(/\s+/).slice(0, 5).join(" ");
                  const date = h.createdAt?.toDate?.();
                  return (
                    <li key={h.id}>
                      <button
                        onClick={() => submit(h.question)}
                        className="w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
                      >
                        <div className="font-medium text-foreground">{preview}{h.question.split(/\s+/).length > 5 ? "…" : ""}</div>
                        {date && (
                          <div className="text-[10px] text-muted-foreground">
                            {date.toLocaleDateString(lang, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex gap-3 rounded-2xl border border-secondary/40 bg-secondary/10 p-4 text-xs text-secondary-foreground">
              <ShieldAlert className="h-5 w-5 flex-shrink-0 text-secondary" />
              <p>{t("agent.disclaimer")}</p>
            </div>
          </aside>

          {/* Chat */}
          <section className="flex min-h-[70vh] flex-col rounded-2xl border border-border bg-card">
            <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-6">
              {messages.length === 0 && !loading && (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center text-muted-foreground">
                  <Sparkles className="h-10 w-10 text-secondary" />
                  <p className="mt-3 font-serif text-lg">{t("agent.emptyState")}</p>
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
                )
              )}

              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
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
              onSubmit={(e) => { e.preventDefault(); submit(); }}
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

      <Block title={t("agent.reformulation")}>
        <p className="italic text-muted-foreground">{response.reformulation}</p>
      </Block>

      {response.textes_applicables?.length > 0 && (
        <Block title={t("agent.applicableTexts")}>
          <ul className="space-y-2">
            {response.textes_applicables.map((tx, i) => (
              <li key={i} className="rounded-lg border-l-4 border-secondary bg-secondary/5 px-3 py-2">
                <p className="font-semibold">{tx.loi} — {tx.article}</p>
                <p className="mt-1 text-muted-foreground">{tx.contenu}</p>
              </li>
            ))}
          </ul>
        </Block>
      )}

      <Block title={t("agent.analysis")}>
        <p className="whitespace-pre-wrap leading-relaxed">{response.analyse}</p>
      </Block>

      {response.actions_recommandees?.length > 0 && (
        <Block title={t("agent.recommendedActions")}>
          <ul className="list-disc space-y-1 pl-5">
            {response.actions_recommandees.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </Block>
      )}

      {response.institutions?.length > 0 && (
        <Block title={t("agent.institutions")}>
          <div className="flex flex-wrap gap-2">
            {response.institutions.map((inst, i) => (
              <span key={i} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
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
