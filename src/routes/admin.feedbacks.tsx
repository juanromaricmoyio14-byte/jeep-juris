import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import { getDb, isAdminEmail } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, type Timestamp } from "firebase/firestore";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin/feedbacks")({
  head: () => ({ meta: [{ title: "Admin — Feedback" }] }),
  component: AdminFeedbacks,
});

type FeedbackType = "bug" | "suggestion" | "compliment";
interface FeedbackDoc {
  id: string;
  name?: string | null;
  email?: string | null;
  type: FeedbackType;
  message: string;
  timestamp?: Timestamp;
  userEmail?: string | null;
}

const TYPE_STYLES: Record<FeedbackType, string> = {
  bug: "bg-destructive/10 text-destructive border-destructive/30",
  suggestion: "bg-primary/10 text-primary border-primary/30",
  compliment: "bg-secondary/20 text-secondary-foreground border-secondary/40",
};

function AdminFeedbacks() {
  const { t, i18n } = useTranslation();
  const { user, loading } = useAuth();
  const [items, setItems] = useState<FeedbackDoc[]>([]);
  const [filter, setFilter] = useState<"all" | FeedbackType>("all");
  const isAdmin = isAdminEmail(user?.email);

  useEffect(() => {
    if (!isAdmin) return;
    const db = getDb();
    if (!db) return;
    const q = query(collection(db, "feedbacks"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name ?? null,
            email: data.email ?? null,
            type: (data.type as FeedbackType) ?? "suggestion",
            message: data.message ?? "",
            timestamp: data.timestamp as Timestamp | undefined,
            userEmail: data.userEmail ?? null,
          };
        })
      );
    });
    return () => unsub();
  }, [isAdmin]);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.type === filter)),
    [items, filter]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-12">…</main>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="mx-auto max-w-md px-4 py-16">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
            <p className="mt-3 text-sm text-destructive">{t("admin.noAccess")}</p>
            <Link to="/" className="mt-4 inline-block text-xs text-primary hover:underline">← Home</Link>
          </div>
        </main>
      </div>
    );
  }

  const lang = i18n.language?.startsWith("en") ? "en" : "fr";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="font-serif text-3xl font-bold text-primary">{t("admin.feedbacksTitle")}</h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["all", "bug", "suggestion", "compliment"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {f === "all" ? t("admin.filterAll") : t(`feedback.type${f[0].toUpperCase() + f.slice(1)}`)}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">{t("admin.noFeedbacks")}</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">{t("admin.date")}</th>
                  <th className="px-4 py-3">{t("admin.type")}</th>
                  <th className="px-4 py-3">{t("admin.name")}</th>
                  <th className="px-4 py-3">{t("admin.email")}</th>
                  <th className="px-4 py-3">{t("admin.message")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => {
                  const date = f.timestamp?.toDate?.();
                  return (
                    <tr key={f.id} className="border-b border-border last:border-0 align-top">
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                        {date ? date.toLocaleString(lang, { dateStyle: "short", timeStyle: "short" }) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TYPE_STYLES[f.type]}`}>
                          {t(`feedback.type${f.type[0].toUpperCase() + f.type.slice(1)}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{f.name || "—"}</td>
                      <td className="px-4 py-3 text-xs">{f.email || f.userEmail || "—"}</td>
                      <td className="px-4 py-3 max-w-md whitespace-pre-wrap">{f.message}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
