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
  `Tu es JEEP JURIS, un assistant juridique intelligent spécialisé dans le droit camerounais.
La langue de réponse est : ${langue}. Si langue=fr, réponds entièrement en français. Si langue=en, réponds entièrement en English.
Niveau de langage : ${niveau}. ${LEVEL_INSTRUCTIONS[niveau] ?? LEVEL_INSTRUCTIONS.standard}

RÈGLE ABSOLUE DE CITATION : Pour chaque affirmation juridique, tu DOIS citer l'article exact en incluant :
- Le nom complet de la loi
- Le numéro de l'article
- Le contenu EXACT de l'article tel qu'il apparaît dans le document fourni (entre guillemets)

Exemple de citation correcte :
Selon l'Article 34 du Code du Travail camerounais : "Tout licenciement d'un travailleur doit être précédé d'un entretien préalable..."

Tu réponds UNIQUEMENT en JSON valide selon ce format exact :
{
  "reformulation": string,
  "textes_applicables": [
    { "loi": string, "article": string, "contenu": string (CONTENU EXACT entre guillemets) }
  ],
  "analyse": string (explication avec références aux articles cités),
  "actions_recommandees": [string],
  "institutions": [string],
  "disclaimer": string
}

Tu bases tes réponses UNIQUEMENT sur les documents fournis. Si un article n'est pas dans les documents, dis-le clairement. Tu termines TOUJOURS par : "Cette réponse est informative uniquement et ne remplace pas un avocat inscrit au Barreau du Cameroun."`;

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
