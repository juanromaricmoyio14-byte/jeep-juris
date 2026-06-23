## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.

## 2026-06-23 - Async Submit Button Feedback
**Learning:** For asynchronous submit buttons, relying solely on `disabled:opacity-40` lacks clear visual feedback of ongoing processes. Users may think the button is unresponsive.
**Action:** Always include a visual loading indicator like `<LoaderCircle className="h-4 w-4 animate-spin" />` from `lucide-react` conditionally when `loading` is true, and apply `inline-flex items-center justify-center gap-2` to the button classes to ensure proper alignment.
