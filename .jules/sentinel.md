## 2024-05-18 - Prevent Reverse Tabnabbing
**Vulnerability:** Opening external links with `target="_blank"` without `rel="noopener noreferrer"` can allow the newly opened page to access the original page's `window` object via `window.opener`, potentially enabling phishing attacks or redirecting the original page.
**Learning:** Even for seemingly benign resources like PDFs, it's crucial to follow defense-in-depth principles and restrict cross-window access unless explicitly required.
**Prevention:** Always append `'noopener,noreferrer'` to the features string when using `window.open(url, '_blank')`, or add `rel="noopener noreferrer"` to `<a>` tags with `target="_blank"`.
