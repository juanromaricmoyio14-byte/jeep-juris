
# JuriCam AI — Plan d'implémentation

Adaptation complète de l'app sur la stack **TanStack Start + Vite + React + Tailwind** (équivalent fonctionnel de la spec Next.js 14).

## Stack finale
- **Framework** : TanStack Start (file-based routing dans `src/routes/`)
- **Styling** : Tailwind CSS v4 + tokens design (vert forêt, or, off-white)
- **i18n** : `react-i18next` (équivalent FR/EN de next-intl, avec switcher live)
- **Auth** : Firebase Auth (email/password) — **optionnelle**, accessible via header
- **IA** : Google Gemini 1.5 Pro via server function `/api/consulter`
- **Secrets** : tous les `GEMINI_API_KEY`, `FIREBASE_*`, `DRIVE_ID_TITRE_*` ajoutés via le secrets manager Lovable

## Structure des fichiers

```
src/
├── routes/
│   ├── __root.tsx              # Shell + Header (logo, nav, switcher FR/EN, login)
│   ├── index.tsx               # Accueil : hero, 6 cards domaines, 3 étapes, footer
│   ├── agent.tsx               # Chat 2 panneaux (selector + messages)
│   ├── bibliotheque.tsx        # Recherche + filtres + cards lois
│   ├── apropos.tsx             # Mission + disclaimer + contact
│   ├── login.tsx               # Firebase Auth (optionnel)
│   └── api/
│       └── consulter.ts        # POST → Gemini 1.5 Pro
├── components/
│   ├── Header.tsx              # Nav + LanguageSwitcher + AuthButton
│   ├── LanguageSwitcher.tsx    # Bouton FR/EN
│   ├── Footer.tsx
│   ├── DomainCard.tsx
│   ├── ChatMessage.tsx
│   ├── Logo.tsx                # Balance de la justice (SVG)
│   └── AuthProvider.tsx        # Contexte Firebase (onAuthStateChanged)
├── lib/
│   ├── i18n.ts                 # Config react-i18next + namespaces
│   ├── firebase.ts             # Init Firebase client
│   └── consulter.functions.ts  # Wrapper createServerFn pour le chat
├── locales/
│   ├── fr.json                 # Toutes les traductions FR
│   └── en.json                 # Toutes les traductions EN
└── styles.css                  # Tokens : --primary (vert), --secondary (or), --background (off-white), fonts serif + sans
```

## Détails par page

### `/` Accueil
- Header sticky : logo balance + "JuriCam AI" + nav (Agent, Bibliothèque, À propos) + switcher FR/EN + bouton Login
- Hero : titre serif "Vos droits, en clair." / "Your rights, clearly." + CTA "Consulter l'agent" → `/agent`
- Grille 6 cards : Droit du Travail, Pénal, Civil, Famille, Foncier, Procédures (icônes Lucide)
- Section "Comment ça marche" : 3 étapes traduites
- Footer avec disclaimer légal bilingue

### `/agent`
- Layout 2 colonnes (sidebar gauche + chat droite)
- Gauche : select domaine juridique (6 options traduites), badge disclaimer, bouton "Nouvelle consultation"
- Droite : zone messages + input + bouton "Envoyer"
- Bulles : user à droite (vert #1a5c38), agent à gauche (carte structurée affichant `reformulation`, `textes_applicables[]`, `analyse`, `actions_recommandees[]`, `institutions[]`, `disclaimer`)
- Loading dots animation pendant la génération
- Appel : `useServerFn(consulterAgent)` avec `{ question, domaine, langue: i18n.language }`

### `/bibliotheque`
- Search bar + filtres (mêmes 6 domaines)
- Grille de cards : nom loi + description (traduits) + bouton "Lire"

### `/apropos`
- Sections mission + disclaimer complet + contact (les deux langues toujours visibles ou selon switcher)

### `/login` (optionnel)
- Formulaire email/password Firebase
- `signInWithEmailAndPassword` / `createUserWithEmailAndPassword`
- Bouton retour, redirection vers `/` après login

## Server function `/api/consulter`

`src/lib/consulter.functions.ts` :
```ts
export const consulterAgent = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    question: z.string().min(1).max(2000),
    domaine: z.string(),
    langue: z.enum(["fr", "en"]),
  }))
  .handler(async ({ data }) => {
    // 1. Fetch des textes Google Drive (DRIVE_ID_TITRE_I..X_XI)
    //    selon le domaine, via https://drive.google.com/uc?export=download&id=...
    // 2. Build du system prompt avec {langue} interpolée
    // 3. POST vers https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent
    //    avec GEMINI_API_KEY
    // 4. Parse JSON strict → renvoie { reformulation, textes_applicables, analyse, actions_recommandees, institutions, disclaimer }
    // 5. Gestion erreur : retourne { error: string } typé
  });
```

System prompt utilisé exactement comme spécifié dans la demande, avec `{langue}` remplacé.

## i18n — react-i18next

- `src/lib/i18n.ts` initialise i18next avec `fr` (défaut) et `en`
- `LanguageDetector` lit `localStorage` puis `navigator.language`
- `LanguageSwitcher` : `i18n.changeLanguage('en'|'fr')` + persist
- Tous les textes via `useTranslation()` + clés organisées par page (`home.hero.title`, `agent.send`, `domains.labour`, etc.)
- L'attribut `<html lang>` se met à jour dynamiquement

## Design tokens (`src/styles.css`)

```css
:root {
  --background: oklch(0.96 0.015 85);    /* #f8f4ed off-white */
  --primary: oklch(0.40 0.08 145);       /* #1a5c38 vert forêt */
  --primary-foreground: oklch(0.98 0 0);
  --secondary: oklch(0.74 0.12 85);      /* #c9a84c or */
  --secondary-foreground: oklch(0.20 0 0);
  --font-serif: "Playfair Display", Georgia, serif;
  --font-sans: "Inter", system-ui, sans-serif;
}
```
- Fonts chargées via `<link>` Google Fonts dans `__root.tsx`
- `font-serif` pour titres, sans-serif par défaut pour le corps

## Secrets requis (à ajouter via le secret manager)

Runtime (server) :
- `GEMINI_API_KEY`
- `DRIVE_ID_TITRE_I` à `DRIVE_ID_TITRE_IX`, `DRIVE_ID_TITRE_X_XI`

Build-time (exposés côté client via `VITE_`) :
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`

> Note : `NEXT_PUBLIC_*` n'existe pas en Vite — équivalent est `VITE_*`. Je te demanderai d'ajouter ces secrets une fois la structure créée.

## Ordre d'exécution

1. Installer dépendances : `react-i18next i18next i18next-browser-languagedetector firebase zod`
2. Créer tokens design + Google Fonts dans `styles.css`
3. Créer i18n + fichiers `locales/fr.json` & `en.json` complets
4. Créer `Logo`, `Header` (avec switcher), `Footer`, `AuthProvider`
5. Créer les 4 routes pages + `/login`
6. Créer la server function `consulter.functions.ts` + intégration Gemini
7. Demander les secrets via le secret manager
8. Vérifier le build et tester `/agent` end-to-end

## Limitations honnêtes
- **Firebase Auth** marche côté client uniquement ; pas de protection SSR sur les routes (auth optionnelle, donc OK).
- **Gemini 1.5 Pro** : si Google le déprécie, fallback facile vers `gemini-1.5-pro-latest` ou `gemini-2.5-pro`.
- **Google Drive public** : les fichiers doivent être en partage "Anyone with the link". Si grosse taille, prévoir un cache. Tant que tu n'as pas fourni les IDs, l'agent fonctionnera avec un corpus vide (Gemini répondra qu'il manque de sources, conformément au prompt système).
