## 2024-06-14 - Fix Firestore Path Mismatch in Consultations

**Vulnerability:** The application was writing user consultations to the root `/consultations` collection, but `firestore.rules` authorized access only to a nested subcollection (`/users/{uid}/consultations/{doc}`). Due to the default-deny rule, this resulted in unauthorized errors when accessing or saving data.
**Learning:** Firestore rule paths must mirror the application schema. Discrepancies lead to either silent authorization failures (if default-deny exists) or insecure data exposure (if no default-deny exists).
**Prevention:** Ensure database models in the frontend code align identically with the paths defined in `firestore.rules`.
