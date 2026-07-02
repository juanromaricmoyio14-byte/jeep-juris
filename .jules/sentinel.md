## 2024-07-02 - Object Prototype Pollution Risk

**Vulnerability:** The `getLibraryDoc` server function used generic `z.string()` validation for the `domain` input, which was then directly used as an index/key to access `DOMAIN_DRIVE_KEYS`. This could allow object prototype pollution attacks if malicious keys like `__proto__` or `constructor` were passed, potentially causing a Denial of Service (DoS) crash.
**Learning:** When using user input to access object properties (especially in server functions/endpoints), the input must be strictly validated.
**Prevention:** Always validate input intended for property access using `z.enum()` with a defined set of allowed keys rather than generic `z.string()`.
