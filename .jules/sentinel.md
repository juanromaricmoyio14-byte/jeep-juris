## 2025-01-22 - Prevent Reverse Tabnabbing

**Vulnerability:** Found `window.open` called with `_blank` without the `noopener,noreferrer` feature string in `src/routes/bibliotheque.tsx`. This could allow the newly opened tab to potentially control the original page via the `window.opener` object, leading to a reverse tabnabbing attack where the origin site is swapped with a malicious one.

**Learning:** When using `window.open` with the `_blank` target, it's crucial to specify `'noopener,noreferrer'` to ensure the newly opened window cannot access the original window's object, thus preventing potential phishing or malicious redirects.

**Prevention:** Always include `'noopener,noreferrer'` in the features string when calling `window.open` with `_blank` (e.g., `window.open(url, '_blank', 'noopener,noreferrer')`).
