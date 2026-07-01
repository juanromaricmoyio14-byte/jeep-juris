## 2024-05-15 - Prototype Pollution in API Validation

**Vulnerability:** Input validation in `getLibraryDoc` used generic `z.string()` for the `domain` key. The user input was then directly used to access object properties (`DOMAIN_DRIVE_KEYS[data.domain]`).
**Learning:** Using generic strings as object keys for user input allows attackers to pass special properties like `__proto__` or `constructor`, which can lead to prototype pollution and Denial of Service (DoS) crashes if the object lacks proper safeguards (like `Object.create(null)`).
**Prevention:** Always validate user input used as object keys with a strict allowlist (e.g., `z.enum([...])`) rather than a generic string type.
