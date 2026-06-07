
## 2024-06-07 - Client-Side Admin Check Bypass
**Vulnerability:** Admin checks in `admin.feedbacks.tsx` were previously based on a hardcoded list of client-side emails in `src/lib/firebase.ts` matching the current user's email, which an attacker could potentially bypass.
**Learning:** Checking `user.email` against an environment variable on the frontend is insecure and merely security theater. It exposes the admin email list in the client bundle and can be spoofed by modifying local state if Firestore rules aren't strict, or leads to a misleading UX where non-admins appear to have access.
**Prevention:** Always verify authorization state by decoding custom claims from the ID token (`token.claims.admin`) directly from Firebase Auth state changes using `onIdTokenChanged`, ensuring frontend state explicitly mirrors backend Firestore rules.
