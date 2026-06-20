## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.

## 2024-06-20 - Standardize Async Submit Button Feedback

**Learning:** Users lack immediate, localized feedback when initiating asynchronous actions like login, feedback submission, and chatting with the agent. The standard `disabled:opacity-40` state alone is insufficient and can appear broken or unresponsive if the request takes time.
**Action:** Establish a reusable UX pattern for all async submit buttons: conditionally render `<LoaderCircle className="h-4 w-4 animate-spin" />` (from `lucide-react`) within the button, combined with `inline-flex items-center justify-center gap-2` on the container, to provide clear, immediate, and accessible visual feedback directly where the user clicked.
