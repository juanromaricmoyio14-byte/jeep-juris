## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.

## 2026-06-12 - Async Submit Button UX

**Learning:** For asynchronous submit buttons, the established UX pattern is to provide clear visual feedback by including `<LoaderCircle className="h-4 w-4 animate-spin" />` from `lucide-react` conditionally, and applying `inline-flex items-center justify-center gap-2` to the button classes, rather than relying solely on `disabled:opacity-40`.
**Action:** Apply this pattern to the submit buttons in login, feedback, and agent pages.
