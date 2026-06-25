## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.

## 2026-06-25 - Label and Button Async Feedback Accessibility

**Learning:** Missing `htmlFor` on labels reduces screen reader usability, and async form submission without visual loading indicators (e.g., `<LoaderCircle animate-spin>`) results in a confusing UX where users might spam click `disabled` buttons.
**Action:** Always provide `htmlFor` mapped to input `id` attributes, and use visual feedback elements for async submit buttons by applying `inline-flex items-center justify-center gap-2` alongside conditional loading icons.
