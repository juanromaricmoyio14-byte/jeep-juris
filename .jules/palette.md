## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.

## 2026-06-11 - Async Submit Button Feedback

**Learning:** Relying solely on `disabled:opacity-40` for asynchronous form submissions provides insufficient visual feedback and can leave users wondering if their request is processing.
**Action:** Always pair disabled opacity states with a clear visual loading indicator (e.g., `<LoaderCircle className="animate-spin" />`) inside submit buttons to provide immediate and unambiguous feedback.
