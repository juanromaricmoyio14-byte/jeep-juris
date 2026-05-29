import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { getDb, firebaseConfigured } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { MessageSquare, Check } from "lucide-react";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback — JEEP JURIS" },
      {
        name: "description",
        content:
          "Partagez votre avis sur JEEP JURIS : signalez un bug, faites une suggestion ou un compliment pour nous aider à améliorer le service.",
      },
      { property: "og:title", content: "Feedback — JEEP JURIS" },
      { property: "og:description", content: "Aidez-nous à améliorer JEEP JURIS." },
      { property: "og:url", content: "https://jeep-juris.lovable.app/feedback" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://jeep-juris.lovable.app/feedback" }],
  }),
  component: FeedbackPage,
});

type FeedbackType = "bug" | "suggestion" | "compliment";

function FeedbackPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<FeedbackType>("suggestion");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const db = getDb();
    if (!db) {
      setError(t("feedback.notConfigured"));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await addDoc(collection(db, "feedbacks"), {
        name: name.trim() || null,
        email: email.trim() || null,
        type,
        message: message.trim(),
        userId: user?.uid ?? null,
        userEmail: user?.email ?? null,
        timestamp: serverTimestamp(),
      });
      setDone(true);
      setName("");
      setEmail("");
      setMessage("");
      setType("suggestion");
    } catch (e) {
      console.error(e);
      setError(t("feedback.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-12">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-primary">{t("feedback.title")}</h1>
              <p className="text-sm text-muted-foreground">{t("feedback.subtitle")}</p>
            </div>
          </div>

          {!firebaseConfigured && (
            <p className="mb-4 rounded-lg bg-secondary/15 p-3 text-xs text-secondary-foreground">
              {t("feedback.notConfigured")}
            </p>
          )}

          {done && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
              <Check className="h-4 w-4" /> {t("feedback.success")}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("feedback.name")}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("feedback.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("feedback.type")}
              </label>
              <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg border border-border bg-background p-1">
                {(["bug", "suggestion", "compliment"] as FeedbackType[]).map((tp) => (
                  <button
                    key={tp}
                    type="button"
                    onClick={() => setType(tp)}
                    className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                      type === tp
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {t(`feedback.type${tp[0].toUpperCase() + tp.slice(1)}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("feedback.message")} *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                maxLength={2000}
                className="mt-1 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={loading || !message.trim() || !firebaseConfigured}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
            >
              {t("feedback.submit")}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
