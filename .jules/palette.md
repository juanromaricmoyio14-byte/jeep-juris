## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.

## 2024-07-05 - Semantic Radio Groups for Custom Button Layouts
**Learning:** When using a grid of custom buttons acting as a radio group for selection (like the Bug/Suggestion/Compliment type selector in the feedback form), screen readers cannot understand the relationship or state without explicit ARIA roles.
**Action:** Always wrap the buttons in a container with `role="radiogroup"` and `aria-labelledby` pointing to the section label's ID. Add `role="radio"` and `aria-checked={isSelected}` to each child button, and ensure `focus-visible` styles are present for keyboard navigation.

## 2024-07-05 - Async Button Feedback Pattern
**Learning:** Relying solely on `disabled:opacity-40` for form submissions can leave users wondering if the action registered, especially on slower networks.
**Action:** For asynchronous submit buttons, provide clear visual feedback by conditionally including a spinner like `<LoaderCircle className="h-4 w-4 animate-spin" />` from `lucide-react`, and use `inline-flex items-center justify-center gap-2` on the button to properly align the spinner alongside the text.
