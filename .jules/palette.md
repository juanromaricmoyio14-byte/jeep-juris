## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.
## 2024-07-07 - Accessible Custom Radio Group Patterns
**Learning:** Converting standard `<div>` structures with child `<button>`s into accessible custom radio groups requires a specific combination of ARIA attributes. Providing `role="radiogroup"` on the container is not enough; the container must be labeled via `aria-labelledby` pointing to a visible label, and the child buttons must use `role="radio"` with dynamically updated `aria-checked` states to be properly understood by screen readers.
**Action:** When implementing custom toggle button groups instead of native `<input type="radio">`, always apply the `radiogroup` role to the container, explicitly link it to its section label with an `id`, and ensure child buttons have the `radio` role and `aria-checked` properties.
