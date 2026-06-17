## 2026-06-17 - Missing `noopener,noreferrer` in window.open

**Vulnerability:** Reverse tabnabbing vulnerability in `src/routes/bibliotheque.tsx` due to `window.open` using `_blank` without `noopener,noreferrer`.
**Learning:** The `window.open` calls opening links in new tabs without specifying `noopener,noreferrer` allow the new tab to access the original window's location via `window.opener.location`, which could lead to redirecting the user to a malicious site.
**Prevention:** Always include `'noopener,noreferrer'` in the features string when calling `window.open` with `_blank` to prevent reverse tabnabbing vulnerabilities.
