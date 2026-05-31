import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import "@/lib/i18n";
import { AuthProvider } from "@/components/AuthProvider";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <p className="mt-4 text-muted-foreground">Page not found / Page introuvable</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Home / Accueil
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        httpEquiv: "Content-Security-Policy",
        content:
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https: ws: wss:;",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "JEEP JURIS — Vos droits, en clair." },
      {
        name: "description",
        content:
          "Assistant juridique intelligent pour le droit camerounais. Intelligent legal assistant for Cameroonian law.",
      },
      { property: "og:site_name", content: "JEEP JURIS" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "JEEP JURIS — Vos droits, en clair." },
      {
        property: "og:description",
        content:
          "Assistant juridique intelligent pour le droit camerounais. Intelligent legal assistant for Cameroonian law.",
      },
      { property: "og:url", content: "https://jeep-juris.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "JEEP JURIS — Vos droits, en clair." },
      {
        name: "twitter:description",
        content:
          "Assistant juridique intelligent pour le droit camerounais. Intelligent legal assistant for Cameroonian law.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c6cce3de-4391-4a7a-9050-53d4c954fa23/id-preview-e992b4ff--ddc66cbd-9305-4bde-a477-97c6e21352d4.lovable.app-1779301692499.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c6cce3de-4391-4a7a-9050-53d4c954fa23/id-preview-e992b4ff--ddc66cbd-9305-4bde-a477-97c6e21352d4.lovable.app-1779301692499.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "JEEP JURIS",
          url: "https://jeep-juris.lovable.app",
          description: "Assistant juridique intelligent spécialisé en droit camerounais.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "JEEP JURIS",
          url: "https://jeep-juris.lovable.app",
          inLanguage: ["fr", "en"],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { Home, MessageSquare, BookOpen, User } from "lucide-react";
import { useTranslation } from "react-i18next";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { t } = useTranslation();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="pb-16 md:pb-0">
          <Outlet />
        </div>

        {/* Mobile Header (replaces main header on mobile for minimal UI) */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur md:hidden flex justify-between items-center px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <span className="font-serif text-lg font-bold tracking-tight">JEEP JURIS</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newTheme = document.documentElement.classList.contains("dark")
                  ? "light"
                  : "dark";
                localStorage.setItem("theme", newTheme);
                if (newTheme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              }}
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              <span className="dark:hidden">🌙</span>
              <span className="hidden dark:inline">☀️</span>
            </button>
          </div>
        </header>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 bg-background border-t border-border md:hidden px-2 pb-safe">
          <Link
            to="/"
            className="flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            activeProps={{ className: "text-primary" }}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">Accueil</span>
          </Link>
          <Link
            to="/agent"
            className="flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            activeProps={{ className: "text-primary" }}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-[10px] font-medium">Agent</span>
          </Link>
          <Link
            to="/bibliotheque"
            className="flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            activeProps={{ className: "text-primary" }}
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-[10px] font-medium">Bibliothèque</span>
          </Link>
          <Link
            to="/login"
            className="flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            activeProps={{ className: "text-primary" }}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-medium">Profil</span>
          </Link>
        </nav>
      </AuthProvider>
    </QueryClientProvider>
  );
}
