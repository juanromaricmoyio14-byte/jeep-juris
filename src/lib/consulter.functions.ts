import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  question: z.string().min(1).max(2000),
  domaine: z.string().min(1).max(50),
  langue: z.enum(["fr", "en"]),
  niveau: z.enum(["simple", "standard", "technical"]).optional().default("standard"),
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
  try {
    const res = await fetch(`https://drive.google.com/uc?export=download&id=${id}`, {
      headers: { "User-Agent": "JEEP-JURIS/1.0" },
    });
    if (!res.ok) return "";
    const text = await res.text();
    return text.slice(0, 40000);
  } catch {
    return "";
  }
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
  `Tu es JEEP JURIS, un assistant juridique intelligent spécialisé dans le droit camerounais. La langue de réponse est : ${langue}. Si langue=fr, réponds entièrement en français. Si langue=en, réponds entièrement en English. ${LEVEL_INSTRUCTIONS[niveau] ?? LEVEL_INSTRUCTIONS.standard} Tu réponds UNIQUEMENT en JSON valide selon ce format exact : { "reformulation": string, "textes_applicables": [{"loi": string, "article": string, "contenu": string}], "analyse": string, "actions_recommandees": [string], "institutions": [string], "disclaimer": string }. Tu bases tes réponses UNIQUEMENT sur les documents fournis quand ils sont disponibles. Si aucun document n'est fourni, indique-le clairement dans l'analyse mais réponds quand même avec ta meilleure connaissance générale du droit camerounais. Tu cites toujours les articles précis. Tu termines TOUJOURS par le disclaimer.`;

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

export const consulterAgent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AgentResult> => {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("GEMINI_API_KEY exists:", !!apiKey);
    if (!apiKey) {
      return { ok: false, error: "MISSING_KEY" };
    }

    const driveKeys = DOMAIN_DRIVE_KEYS[data.domaine] ?? [];
    const driveIds = driveKeys
      .map((k) => process.env[k])
      .filter((v): v is string => Boolean(v));

    const docs = await Promise.all(driveIds.map(fetchDriveText));
    const corpus = docs.filter(Boolean).join("\n\n---\n\n");

    const userContent = corpus
      ? `Documents juridiques disponibles :\n\n${corpus}\n\n---\n\nQuestion de l'utilisateur (domaine : ${data.domaine}) :\n${data.question}`
      : `Aucun document spécifique fourni. Domaine : ${data.domaine}.\n\nQuestion de l'utilisateur :\n${data.question}`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT(data.langue, data.niveau) }],
          },
          contents: [
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
      const raw: string =
        json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
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
