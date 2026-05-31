## 2024-05-18 - Missing Content Security Policy
**Vulnerability:** The application does not have a Content Security Policy (CSP) defined.
**Learning:** CSP is crucial for mitigating Cross-Site Scripting (XSS) and other code injection attacks by restricting the sources of executable scripts.
**Prevention:** Add a strict Content Security Policy to the application, preferably via a `<meta>` tag in the root layout or via HTTP headers.
