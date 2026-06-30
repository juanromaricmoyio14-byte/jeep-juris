## 2024-06-30 - Sentinel

## 2024-06-30 - Prototype Pollution Vulnerability in Object Property Access

**Vulnerability:** Object property access using unvalidated strings (e.g. `DOMAIN_DRIVE_KEYS[data.domain]`)
**Learning:** Using unvalidated strings like `z.string()` to access properties of a JavaScript object allows for prototype pollution attacks. Attackers can supply special keys like `__proto__` or `constructor` which can cause unintended behavior and potential DoS crashes.
**Prevention:** Strictly validate string inputs used for property access. Instead of `z.string()`, use explicit validation like `z.enum([...])` to restrict inputs to known, safe keys.
