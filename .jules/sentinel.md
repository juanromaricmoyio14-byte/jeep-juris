## 2024-06-22 - Prevent Reverse Tabnabbing

**Vulnerability:** Found `window.open(url, '_blank')` being called without `noopener,noreferrer` options in `src/routes/bibliotheque.tsx`.
**Learning:** When a page links to another page using `target="_blank"` or `window.open` without `noopener`, the new page can access the original page's `window` object via `window.opener`. This can be exploited by a malicious page to redirect the original page to a phishing site.
**Prevention:** Always include `'noopener,noreferrer'` as the features argument when calling `window.open` with `'_blank'`. If using an `<a>` tag, add `rel="noopener noreferrer"`.
