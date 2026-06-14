import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  question: z.string().min(1).max(2000),
  domaine: z.enum(["labour", "criminal", "civil", "family", "land", "procedures"]),
  langue: z.enum(["fr", "en"]),
  niveau: z.enum(["simple", "standard", "technical"]).optional().default("standard"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        text: z.string().max(4000),
      }),
    )
    .max(10)
    .optional()
    .default([]),
});

const DOMAIN_DRIVE_KEYS: Record<string, string[]> = {
  labour: ["DRIVE_ID_TITRE_III", "DRIVE_ID_TITRE_IV"],
  criminal: ["DRIVE_ID_TITRE_V", "DRIVE_ID_TITRE_VI"],
  civil: ["DRIVE_ID_TITRE_I", "DRIVE_ID_TITRE_II"],
  family: ["DRIVE_ID_TITRE_II", "DRIVE_ID_TITRE_VII"],
  land: ["DRIVE_ID_TITRE_VIII"],
  procedures: ["DRIVE_ID_TITRE_IX", "DRIVE_ID_TITRE_X_XI"],
};

async function fetchDriveText(id: string): Promise<string> {
  const endpoints = [
    `https://docs.google.com/document/d/${id}/export?format=txt`,
    `https://drive.google.com/uc?export=download&id=${id}`,
  ];
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 JEEP-JURIS/1.0" },
        redirect: "follow",
      });
      if (!res.ok) continue;
      const ct = res.headers.get("content-type") || "";
      const text = await res.text();
      // Skip Google login / virus-scan HTML pages
      if (ct.includes("text/html") && /<html|accounts\.google\.com|virus scan/i.test(text)) {
        continue;
      }
      if (text.trim().length < 20) continue;
      return text.slice(0, 80000);
    } catch {
      // try next
    }
  }
  return "";
}

const LEVEL_INSTRUCTIONS: Record<string, string> = {
  simple:
    "Niveau de langage : TRÈS SIMPLE. Utilise des phrases courtes (max 12 mots), des mots du quotidien, aucun jargon juridique. Explique chaque terme technique. Adresse-toi à une personne peu alphabétisée. Donne des exemples concrets.",
  standard:
    "Niveau de langage : STANDARD (niveau lycée). Phrases claires, vocabulaire accessible. Tu peux utiliser quelques termes juridiques mais en les expliquant brièvement.",
  technical:
    "Niveau de langage : TECHNIQUE (professionnel du droit). Utilise la terminologie juridique précise, cite les articles, références doctrinales, et raisonnement juridique structuré.",
};

const SYSTEM_PROMPT = (langue: string, niveau: string) =>
  `Tu es JEEP JURIS, assistant juridique spécialisé en
droit camerounais. Langue: ${langue}. Niveau: ${niveau}.

RÈGLE ABSOLUE : Tu dois TOUJOURS citer les articles
de loi avec leur contenu exact entre guillemets.

Format de citation obligatoire :
"Selon l'Article X de [Nom de la Loi] : '[contenu
exact de l'article]'"

Même si aucun document n'est fourni, utilise ta
connaissance du droit camerounais pour citer les
articles pertinents du Code du Travail, Code Pénal,
Code Civil et autres textes camerounais.

Réponds UNIQUEMENT en JSON :
{
  "reformulation": "string",
  "textes_applicables": [
    {
      "loi": "Nom complet de la loi",
      "article": "Article XX",
      "contenu": "Contenu exact entre guillemets"
    }
  ],
  "analyse": "Explication simple avec références",
  "actions_recommandees": ["action 1", "action 2"],
  "institutions": ["institution compétente"],
  "disclaimer": "Cette réponse est informative uniquement
                 et ne remplace pas un avocat inscrit
                 au Barreau du Cameroun."
}

IMPORTANT: Ne jamais inventer un article inexistant.
Si tu n'es pas sûr du contenu exact, indique-le.`;

export interface AgentResponse {
  reformulation: string;
  textes_applicables: { loi: string; article: string; contenu: string }[];
  analyse: string;
  actions_recommandees: string[];
  institutions: string[];
  disclaimer: string;
}

export interface AgentResult {
  ok: boolean;
  data?: AgentResponse;
  error?: string;
}

async function verifyFirebaseIdToken(idToken: string): Promise<boolean> {
  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!apiKey || !idToken) return false;
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      },
    );
    if (!res.ok) return false;
    const json = (await res.json()) as { users?: Array<{ localId?: string }> };
    return Boolean(json?.users?.[0]?.localId);
  } catch {
    return false;
  }
}

export const getLibraryDoc = createServerFn({ method: "GET" })
  .inputValidator(z.object({ domain: z.string() }))
  .handler(async ({ data }): Promise<{ ok: boolean; text?: string; error?: string }> => {
    const driveKeys = DOMAIN_DRIVE_KEYS[data.domain] ?? [];
    if (driveKeys.length === 0) {
      return { ok: false, error: "NOT_FOUND" };
    }
    const driveIds = driveKeys.map((k) => process.env[k]).filter((v): v is string => Boolean(v));

    if (driveIds.length === 0) {
      return { ok: false, error: "NO_DRIVE_ID" };
    }

    try {
      const docs = await Promise.all(driveIds.map(fetchDriveText));
      const text = docs.filter(Boolean).join("\n\n---\n\n");
      return { ok: true, text };
    } catch (e) {
      console.error("getLibraryDoc error", e);
      return { ok: false, error: "FETCH_ERROR" };
    }
  });

const ALLOWED_LAW_DRIVE_IDS = new Set<string>([
  "1lksA0cP6u5-iGXTFsxh9TynQJBRZJYeG1",
  "1cILsBLAerIA96bDGQWy4ue6gTzFK4skK2",
  "1bws1O_JmGIrvslxN8im7_BQM0t3q4qJ0",
  "1ZONIR51xktYEkuBQ0w35fHiUVlBjBalt3",
  "1CEwpJGpkKyAvgcYwyaIj-V7qN04l54zb4",
  "1_a7Wnt1zgICsplEfdJDHzia7Zlp2d9xj5",
  "1I3Nu31Oyrhukw-4xIAQtnPkwRzPqEtLV",
  "1LkMalkcxmW8Ikw5TUl_uI7QY5WSKNrZv",
  "1OPkB3wjYDGDyGaruOPr314te1AWh4D3G",
  "1Wa6BcPCLjKBl3AMhQSOd5QH-kMSpNBys",
  "1_eaFyb-uGVcBdtyLs1TaFhq4ZSlT23QU",
  "1a9dVcYGqk1COv-8sUPDu9VgHNvg9Zp5r",
  "1nMTLZ_OhRd2zMvNVcjLmAUZ8pWiayMxD",
  "1pO9wGAOph7FDmM1L9UAouiCweMXXDxyG",
  "1uXoVPdLMWZ0JMst1UfxaK9igi9BcD-H",
  "192tQxLvzwVl8NnwtHAxtd9OyMvFwEKub",
  "1uS3QOB1CQVuIflWdCjaiatfQI-zGK-Iw",
  "1v6_iRz-VlvVe-WZQE8_IZAeYHbhuFbMN",
  "1i6NXTLWFi2RHUaQBxngRj4cwGH9ELesU",
  "1SuI2J2nMO7FWY5nYW6TYpVRZAVVTarqF",
  "1yWqYK9ovoPT0QZpsjPePJOCAfLFROXUp",
  "18vli-sjr25lh3nw_5EV2ZIifVHBtwY4R",
  "1wnUgum0FQO3lSZ067BTBnRrF9qst3FwZ",
  "1DE7jpLhpomYt30enoLrlbWvUADSevs_H",
  "1DSgOHNJlqLpQdBDaYeXRpqKCE4JZGyLd",
  "17-eBawTpL8qjxoBHEFlQYuBcov75O3wQ",
  "1g_EkupmZPAuc-ZSWUst899vi-eTJ9ruq",
  "1I7Z4o3dOs01oBdB4Hv4jfchNRRNZdkEP",
  "1w6aN0cXjFikuJe30q9Z8a6K-0E4aH35e",
  "1jsjDzyhpYlm39rCMRoQJZvgXUP8NpHjs",
  "1DOpTCDuHuLB9aJfIZfae7fhqILAWVofy",
  "1WT3ATsZHErwfAobBJ7YyKi9FQUuuN1OI",
  "1qUWJtCMHMR4K959wu844RBSDblodYN-5",
  "1Sm2O4v7a9ieNJZoOlzHAN5Abp6d_AMP1",
  "1r6-roMC-KYoORdDDvhaWKWQ5Wy4vdwFV",
  "1-gFzEgOrOrYFo7Oa-VF8zDJNdsZfeOaP",
]);

const LAW_CONTENT_CACHE = new Map<string, { content: string; expiresAt: number }>();
const LAW_CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24h

async function fetchFromDrive(fileId: string): Promise<string> {
  const endpoints = [
    `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t&authuser=0`,
    `https://drive.google.com/uc?id=${fileId}&export=download&confirm=t`,
    `https://docs.google.com/uc?id=${fileId}&export=download`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; bot)",
          Accept: "text/plain,*/*",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(20000),
      });

      if (!res.ok) continue;

      const text = await res.text();

      // Reject HTML pages (Google confirmation pages)
      if (
        text.trim().startsWith("<!") ||
        text.trim().startsWith("<html") ||
        text.includes("accounts.google.com") ||
        text.length < 30
      ) {
        continue;
      }

      // Valid text content
      return text;
    } catch {
      continue;
    }
  }

  throw new Error("DRIVE_UNREACHABLE");
}

export const fetchLawContent = createServerFn({ method: "GET" })
  .inputValidator(z.object({ driveId: z.string().min(10).max(80) }))
  .handler(
    async ({
      data,
    }): Promise<{ ok: boolean; content?: string; error?: string; cached?: boolean }> => {
      if (!ALLOWED_LAW_DRIVE_IDS.has(data.driveId)) {
        return { ok: false, error: "Document non autorisé" };
      }
      const now = Date.now();
      const hit = LAW_CONTENT_CACHE.get(data.driveId);
      if (hit && hit.expiresAt > now) {
        console.log("Law cache HIT:", data.driveId);
        return { ok: true, content: hit.content, cached: true };
      }
      console.log("Law cache MISS, fetching Drive ID:", data.driveId);

      try {
        const text = await fetchFromDrive(data.driveId);
        const content = text.slice(0, 200000);
        LAW_CONTENT_CACHE.set(data.driveId, {
          content,
          expiresAt: now + LAW_CACHE_TTL_MS,
        });
        return { ok: true, content, cached: false };
      } catch (e) {
        if (e instanceof Error && e.message === "DRIVE_UNREACHABLE") {
          return {
            ok: false,
            error: `Le document ne peut pas être chargé automatiquement.\nCliquez ici pour l'ouvrir directement dans Google Drive.\nhttps://drive.google.com/file/d/${data.driveId}/view`,
          };
        }
        return {
          ok: false,
          error:
            "Contenu indisponible. Vérifiez que le fichier Drive est partagé en accès public (Tous les utilisateurs avec le lien).",
        };
      }
    },
  );

export const consulterAgent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    InputSchema.extend({ idToken: z.string().min(10).max(4096) }).parse(input),
  )
  .handler(async ({ data }): Promise<AgentResult> => {
    const authorized = await verifyFirebaseIdToken(data.idToken);
    if (!authorized) {
      return { ok: false, error: "UNAUTHORIZED" };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "MISSING_KEY" };
    }

    const driveKeys = DOMAIN_DRIVE_KEYS[data.domaine] ?? [];
    const driveIds = driveKeys.map((k) => process.env[k]).filter((v): v is string => Boolean(v));

    const docs = await Promise.all(driveIds.map(fetchDriveText));
    const corpus = docs.filter(Boolean).join("\n\n---\n\n");

    const userContent = corpus
      ? `Documents juridiques disponibles :\n\n${corpus}\n\n---\n\nQuestion de l'utilisateur (domaine : ${data.domaine}) :\n${data.question}`
      : `Aucun document spécifique fourni. Domaine : ${data.domaine}.\n\nQuestion de l'utilisateur :\n${data.question}`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT(data.langue, data.niveau) }],
          },
          contents: [
            ...data.history.map((msg) => ({
              role: msg.role,
              parts: [{ text: msg.text }],
            })),
            {
              role: "user",
              parts: [{ text: userContent }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json",
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Gemini error", res.status, errText);
        return { ok: false, error: `GEMINI_${res.status}` };
      }

      const json = await res.json();
      const raw: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (!raw) return { ok: false, error: "EMPTY_RESPONSE" };

      let parsed: AgentResponse;
      try {
        parsed = JSON.parse(raw);
      } catch {
        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) return { ok: false, error: "PARSE_ERROR" };
        parsed = JSON.parse(match[0]);
      }

      parsed.textes_applicables = parsed.textes_applicables ?? [];
      parsed.actions_recommandees = parsed.actions_recommandees ?? [];
      parsed.institutions = parsed.institutions ?? [];

      return { ok: true, data: parsed };
    } catch (e) {
      console.error("consulterAgent failed", e);
      return { ok: false, error: "GENERIC" };
    }
  });
