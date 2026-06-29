## 2024-06-29 - Prevent Prototype Pollution via Object Indexing
**Vulnerability:** User input used to access object properties (e.g., `DOMAIN_DRIVE_KEYS[data.domain]`) could be set to `__proto__` or `constructor`, leading to object prototype pollution and potential DoS crashes (e.g., missing properties like `.map` on the returned prototype object).
**Learning:** Generic `z.string()` validation is insufficient when the validated string is directly used as an object key to fetch configurations.
**Prevention:** Always validate user input used for object indexing strictly using `z.enum()` with the explicitly allowed keys rather than generic `z.string()`.
