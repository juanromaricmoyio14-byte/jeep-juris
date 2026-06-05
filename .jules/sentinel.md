## 2025-02-24 - VITE_ Environment Variables Exposure
**Vulnerability:** Admin email list was exposed in the client bundle via `import.meta.env.VITE_ADMIN_EMAILS`.
**Learning:** Prefixing environment variables with `VITE_` forces them to be injected into the client-side JavaScript, exposing potentially sensitive data.
**Prevention:** Avoid `VITE_` prefixes for data that should remain server-side only. Instead of hardcoded admin checks, use secure backend mechanisms like Firebase Custom Claims (`token.claims.admin`) which are already supported by the Firestore security rules.
