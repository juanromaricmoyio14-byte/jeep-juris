## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.
## 2024-06-24 - Async Loading States Pattern
**Learning:** Adding visual `LoaderCircle` feedback during async operations improves perceived performance and prevents duplicate submissions.
**Action:** Always apply `LoaderCircle` and `inline-flex items-center justify-center gap-2` to asynchronous submit buttons rather than relying solely on `disabled:opacity-40`.
