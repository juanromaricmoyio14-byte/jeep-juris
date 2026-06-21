## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.

## 2026-06-21 - Visual Feedback for Async Operations

**Learning:** When users submit forms, relying solely on `disabled:opacity-40` for asynchronous operations fails to provide adequate feedback that the system is processing their request.
**Action:** Consistently use the established pattern: add `<LoaderCircle className="h-4 w-4 animate-spin" />` conditionally when `loading` is true, and apply `inline-flex items-center justify-center gap-2` to the submit buttons.
