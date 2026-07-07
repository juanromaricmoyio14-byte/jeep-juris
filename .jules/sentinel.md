## 2024-06-11 - Prevent prototype pollution in object lookups
**Vulnerability:** Object prototype pollution leading to DoS crashes. Unvalidated input (`z.string()`) was used to lookup values in an object dictionary (`DOMAIN_DRIVE_KEYS[data.domain]`).
**Learning:** An attacker can provide values like `__proto__` or `constructor` for `data.domain` via the API, which might lead to unexpected object properties being accessed, crashing the process or allowing unexpected access if poorly handled.
**Prevention:** Always strictly validate user inputs used as dictionary keys, utilizing `z.enum()` with predefined allowed values when referencing object property mapping.
