## 2025-02-13 - Object Prototype Pollution in Server Functions

**Vulnerability:** A generic `z.string()` was used to validate user input that subsequently acted as a key to access properties on a static object `DOMAIN_DRIVE_KEYS` within a server function (`getLibraryDoc`). If an attacker provided a crafted string matching object prototype properties (like `__proto__` or `constructor`), it could lead to prototype pollution or denial-of-service crashes during property access.

**Learning:** Server-side functions must be highly defensive when using user-supplied strings to access object properties. Generic string validation is insufficient because it permits reserved JavaScript prototype keywords. The vulnerability existed because the Zod schema was too permissive.

**Prevention:** When user input is used to index an object map or dictionary, ALWAYS validate the input strictly against an explicit list of allowed keys using `z.enum()` rather than generic `z.string()`.
