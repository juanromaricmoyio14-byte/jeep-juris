## 2024-05-15 - Prototype Pollution / DoS via unvalidated Object Keys

**Vulnerability:** A server function `getLibraryDoc` accepted an unvalidated string (`z.string()`) from the user, which was then used to index a JavaScript object (`DOMAIN_DRIVE_KEYS[data.domain]`). By providing a string like `"__proto__"` or `"constructor"`, the code would retrieve a prototype function instead of an array. The subsequent `.map()` call on this function resulted in a runtime exception, leading to a Denial of Service.
**Learning:** Using untrusted user input directly as a key to look up object properties in JavaScript can lead to Prototype Pollution or unexpected type crashes.
**Prevention:** Always strictly validate user input against an allowed set of keys using `z.enum()` rather than generic strings when mapping strings to object properties.
