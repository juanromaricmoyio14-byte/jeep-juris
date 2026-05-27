import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Header } from "@/components/Header";
import { PasswordInput } from "@/components/PasswordInput";
import { getFirebaseAuth, firebaseConfigured } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/components/AuthProvider";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion — JEEP JURIS" },
      {
        name: "description",
        content:
          "Connectez-vous à JEEP JURIS pour sauvegarder vos consultations juridiques et accéder à votre historique.",
      },
      { property: "og:title", content: "Connexion — JEEP JURIS" },
      { property: "og:description", content: "Accédez à votre espace JEEP JURIS." },
      { property: "og:url", content: "https://jeep-juris.lovable.app/login" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://jeep-juris.lovable.app/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getFirebaseAuth();
    if (!auth) {
      setError(t("auth.notConfigured"));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="font-serif text-2xl font-bold text-primary">
            {mode === "login" ? t("auth.loginTitle") : t("auth.signupTitle")}
          </h1>

          {!firebaseConfigured && (
            <p className="mt-3 rounded-lg bg-secondary/15 p-3 text-xs text-secondary-foreground">
              {t("auth.notConfigured")}
            </p>
          )}

          {user && (
            <p className="mt-3 rounded-lg bg-primary/10 p-3 text-sm text-primary">
              {t("auth.loggedInAs", { email: user.email })}
            </p>
          )}

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("auth.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("auth.password")}
              </label>
              <div className="mt-1">
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={loading || !firebaseConfigured}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
            >
              {mode === "login" ? t("auth.submitLogin") : t("auth.submitSignup")}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-primary"
          >
            {mode === "login" ? t("auth.switchToSignup") : t("auth.switchToLogin")}
          </button>
        </div>
      </main>
    </div>
  );
}
