## 2024-06-09 - Keyboard Accessibility for Password Toggles
**Learning:** Setting `tabIndex={-1}` on password visibility toggles is an accessibility anti-pattern because it prevents keyboard-only users from revealing their password.
**Action:** Remove `tabIndex={-1}` on interactive adornments and ensure proper `focus-visible` styles are applied (e.g. `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`).
