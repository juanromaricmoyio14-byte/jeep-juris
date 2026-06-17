## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.
## 2026-06-17 - Async Submit Buttons Feedback

**Learning:** Adding a loading spinner to async submit buttons improves user feedback.
**Action:** Use `<LoaderCircle className="h-4 w-4 animate-spin" />` with `inline-flex items-center justify-center gap-2` on submit buttons.
