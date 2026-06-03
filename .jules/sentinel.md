## 2024-10-31 - Comprehensive Input Validation Enhancement
**Vulnerability:**
1. Unvalidated array/object property lookups via user input in Server Functions could lead to Prototype Pollution / Property Injection (e.g., passing `"__proto__"` causing `TypeError: driveKeys.map is not a function`).
2. Missing NoSQL input validations in Firestore security rules allowed arbitrary field lengths and potentially unauthorized data modification via overly permissive `write` clauses.

**Learning:**
Always validate user input schemas to restrictive primitives like `z.enum` when used to access object properties. Additionally, NoSQL database rules require explicit field, length, and type validations; allowing generic `write` access without constraints breaks defense-in-depth and permits arbitrary data storage exhaustion.

**Prevention:**
Enforce strict enum parsing in schema validation frameworks like Zod. For Firestore rules, specifically delineate `create`, `update`, and `delete` with type checking, value existence, and size constraints.
