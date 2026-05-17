import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Header } from "@/components/Header";
import { consulterAgent, type AgentResponse } from "@/lib/consulter.functions";
import { Send, RefreshCcw, ShieldAlert, Sparkles } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  domaine: z.string().optional(),
});

export const Route = createFileRoute("/agent")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Agent juridique — JuriCam AI" },
      { name: "description", content: "Consultez l'assistant juridique IA spécialisé en droit camerounais." },
    ],
  }),
  component: AgentPage,
});

const DOMAINS = ["labour", "criminal", "civil", "family", "land", "procedures"] as const;

interface ChatMessage {
  role: "user" | "agent";
  text?: string;
  response?: AgentResponse;
}

function AgentPage() {
  const { t, i18n } = useTranslation();
  const search = Route.useSearch();
  const [domaine, setDomaine] = useState<string>(search.domaine ?? "labour");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const consult = useServerFn(consulterAgent);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const submit = async () => {
    const question = input.trim();
    if (!question || loading) return;
    setInput("");
    setError(null);
    setMessages((m) => [...m, { role: "user", text: question }]);
    setLoading(true);
    try {
      const langue = (i18n.language?.startsWith("en") ? "en" : "fr") as "fr" | "en";
      const result = await consult({ data: { question, domaine, langue } });
      if (result.ok && result.data) {
        setMessages((m) => [...m, { role: "agent", response: result.data }]);
      } else {
        setError(result.error === "MISSING_KEY" ? t("agent.errorMissingKey") : t("agent.errorGeneric"));
      }
    } catch (e) {
      console.error(e);
      setError(t("agent.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([]);
    setError(null);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
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

              <button
                onClick={reset}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                <RefreshCcw className="h-3.5 w-3.5" /> {t("agent.newConsult")}
              </button>
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
                    <AgentBubble response={m.response!} />
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

function AgentBubble({ response }: { response: AgentResponse }) {
  const { t } = useTranslation();
  return (
    <div className="max-w-[90%] space-y-4 rounded-2xl rounded-tl-sm border border-border bg-background p-5 text-sm shadow-sm">
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
