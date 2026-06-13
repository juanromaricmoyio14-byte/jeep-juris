## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.
## 2026-06-13 - Focus Visible on Nav Links

**Learning:** When using custom `<Link>` elements or un-styled `<button>` wrappers for layout purposes in React, they often lose default focus outlines, making keyboard navigation difficult. Using standard Tailwind `focus-visible` classes reliably restores accessibility without affecting mouse users.
**Action:** Always add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` to interactive custom elements like header links, theme togglers, and mobile menu buttons to ensure keyboard accessibility.
