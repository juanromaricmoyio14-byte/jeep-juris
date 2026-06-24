## 2024-06-24 - Prototype Pollution via Object Indexing

**Vulnerability:** Found `DOMAIN_DRIVE_KEYS[data.domain]` where `data.domain` was validated as a generic `z.string()`. This allows attackers to potentially pass special properties like `__proto__` or `constructor` to index objects, which could lead to unexpected behavior or DoS vulnerabilities.
**Learning:** When using user input to access object properties (especially in server-side functions), string validation is not sufficient to guarantee type safety against prototype properties.
**Prevention:** Always validate user input strictly against the allowed keys of the target object using `z.enum()` rather than a generic string to prevent prototype pollution and ensure runtime safety.
