## 2025-02-23 - Reverse Tabnabbing Vulnerability
**Vulnerability:** A `window.open` call used `target="_blank"` without `noopener,noreferrer` properties.
**Learning:** This exposes the application to reverse tabnabbing, where the newly opened window can manipulate the `window.opener` object, potentially redirecting the original page to a malicious site.
**Prevention:** Always add `'noopener,noreferrer'` properties when using `window.open` with `target="_blank"` or setting `target="_blank"` on links to ensure external pages cannot access the `window.opener` object.
