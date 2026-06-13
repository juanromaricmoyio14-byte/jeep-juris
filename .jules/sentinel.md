
## 2025-06-13 - Broken Firestore Rules
**Vulnerability:** Firestore rules incorrectly defined consultation rules under a non-existent path `/users/{uid}/consultations/{doc}` instead of the root `/consultations/{doc}`, locking users out due to default-deny fallback.
**Learning:** Mismatching database query paths and Firestore rules creates silent authorization failures. Also, attempting to migrate from `VITE_` frontend variables to Custom Claims without backend infrastructure in place leads to immediate regressions.
**Prevention:** Ensure database models and security rules use identical collection paths. Ensure prerequisite backend infrastructure exists before applying new frontend authentication paradigms.
