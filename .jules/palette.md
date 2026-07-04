## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.

## 2026-06-12 - Custom Radio Group Accessibility
**Learning:** For custom UI components acting as radio groups (e.g., a div containing selectable buttons), standard screen readers do not automatically understand their structure.
**Action:** Add an `id` to the descriptive parent label, apply `role="radiogroup"` and `aria-labelledby` referencing it on the container, and use `role="radio"` and `aria-checked` on the selectable child buttons to ensure screen reader accessibility. Also, remember to include keyboard focus states (`focus-visible:ring-2`) on the interactive buttons.
