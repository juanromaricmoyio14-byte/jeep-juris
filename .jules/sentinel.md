## 2024-05-18 - Prevent Object Prototype Pollution in Server Functions

**Vulnerability:** A Denial of Service (DoS) vulnerability existed in the `getLibraryDoc` server function where user input (`data.domain`) was validated simply as a string (`z.string()`) and then directly used to index an object (`DOMAIN_DRIVE_KEYS[data.domain]`).
**Learning:** If an attacker passes properties from the object prototype (like `__proto__` or `constructor`), it accesses unexpected built-in methods instead of an array. Since the code expected an array and chained a `.map()` call, it caused a server crash (`driveKeys.map is not a function`). This kind of generic string validation is insufficient when the string is used as an object key.
**Prevention:** Strictly validate any user input intended to be used as an object key. Ensure it explicitly matches the allowed keys of the object. In Zod, use `z.enum([...])` instead of generic `z.string()`.
