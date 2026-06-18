import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

export const firebaseConfigured = Boolean(config.apiKey && config.authDomain && config.projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function getApp(): FirebaseApp | null {
  if (!firebaseConfigured) return null;
  if (typeof window === "undefined") return null;
  if (!app) app = getApps()[0] ?? initializeApp(config);
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const a = getApp();
  if (!a) return null;
  if (!auth) auth = getAuth(a);
  return auth;
}

export function getDb(): Firestore | null {
  const a = getApp();
  if (!a) return null;
  if (!db) db = getFirestore(a);
  return db;
}
