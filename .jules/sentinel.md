## 2024-10-25 - Prevent Prototype Pollution in Server Functions

**Vulnerability:** Object prototype pollution via unvalidated user input leading to potential DoS crashes.
**Learning:** Using generic `z.string()` for user input that indexes objects (like `DOMAIN_DRIVE_KEYS`) allows malicious keys like `__proto__` or `constructor` to trigger unhandled exceptions when array methods (like `.map()`) are called on the resulting prototype object.
**Prevention:** Always strictly validate user input against expected keys using `z.enum()` or explicitly check `Object.prototype.hasOwnProperty.call()` before using input to access object properties.
