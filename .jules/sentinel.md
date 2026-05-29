## 2024-05-29 - Hardcoded Admin List in Client Bundle

**Vulnerability:** The application used an environment variable `VITE_ADMIN_EMAILS` to hardcode a list of admin email addresses, which was then compiled into the frontend client bundle (`import.meta.env.VITE_ADMIN_EMAILS`). This is an Information Disclosure vulnerability, as anyone inspecting the frontend bundle could see the list of administrative users.
**Learning:** `VITE_` prefixed environment variables are embedded into the client bundle at build time. Sensitive authorization lists should never be stored in these variables. Authorization should be enforced server-side.
**Prevention:** Remove `VITE_ADMIN_EMAILS`. Rely on Firebase Custom Claims (e.g., `admin: true`) which are securely attached to the user's ID token by a trusted backend environment, and verify these claims on the client using `User.getIdTokenResult()`.
