
## 2025-02-14 - Agent Input DoS Risk
**Vulnerability:** The AI agent query input `textarea` had no `maxLength` restriction, allowing malicious actors to potentially paste massive payloads, risking Denial of Service (DoS) attacks on the backend inference system or incurring excessive token costs.
**Learning:** Even client-side AI prompt fields need strict length constraints to prevent abuse.
**Prevention:** Always add a `maxLength` property to `input` and `textarea` fields, especially those sending data to external APIs or LLMs.
