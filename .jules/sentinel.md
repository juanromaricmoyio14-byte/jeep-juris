## 2026-06-19 - Object Prototype Pollution via Object Key Access

**Vulnerability:** In `src/lib/consulter.functions.ts`, user input (`domain`) was validated only as `z.string()` and used directly as a key to look up arrays in the `DOMAIN_DRIVE_KEYS` object.
**Learning:** If an attacker passes `__proto__` or `constructor` as the domain string, the lookup can inadvertently access properties on the object prototype rather than an intended array value, potentially causing TypeErrors and Denial of Service (DoS) when subsequent `.map()` or `.length` operations are attempted on the unexpected non-array property.
**Prevention:** Always validate user input used for object key lookups strictly using `z.enum()` with the exact list of expected, safe keys, rather than generic strings.
