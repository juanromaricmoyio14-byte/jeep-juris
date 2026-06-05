## 2026-06-05 - Keyboard Navigation for Inline Actions
**Learning:** Inline input actions (like a show/hide password toggle) that skip focus (using `tabIndex={-1}`) prevent keyboard-only and screen-reader users from fully interacting with the form.
**Action:** Always ensure interactive elements within inputs are focusable by keyboard, have clear focus visible styles (`focus-visible:ring-2`), and convey their state accurately to assistive technologies.
