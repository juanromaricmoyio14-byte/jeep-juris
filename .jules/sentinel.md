## 2024-06-25 - Insecure Client-Side Admin Authorization

**Vulnerability:** Admin authorization was being handled purely on the client side by comparing the user's email against a hardcoded list of admin emails (`VITE_ADMIN_EMAILS`) loaded into `ADMIN_EMAILS`. This client-side logic could be bypassed, and it did not sync securely with backend verification.

**Learning:** It's critical to rely on server-side authority for verifying privileges. Firebase custom claims (`admin: true`) set by a trusted environment (like a Cloud Function) are evaluated securely inside Firebase security rules. The client should merely read these claims from the user token to toggle the UI, not compute authorization status by itself.

**Prevention:** Ensure that any administrative capability relies on reading custom claims from `user.getIdTokenResult()` on the client and strictly enforcing those custom claims via Firebase Security Rules on the backend. Do not rely on arrays of emails sent to the client.
