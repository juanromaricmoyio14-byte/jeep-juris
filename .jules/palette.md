## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.

## 2026-06-12 - Explicit Form Input Linking
**Learning:** Always ensure form `<label>` elements use the `htmlFor` attribute correctly paired with the corresponding input's `id` to guarantee screen reader compatibility and improve user accessibility.
**Action:** When creating forms, add `id` to inputs and `htmlFor` to labels.

## 2026-06-12 - Radiogroup Accessibility
**Learning:** For custom UI components acting as radio groups (e.g., a div containing selectable buttons), add an `id` to the descriptive parent label, apply `role="radiogroup"` and `aria-labelledby` referencing it on the container, and use `role="radio"` and `aria-checked` on the selectable child buttons to ensure screen reader accessibility.
**Action:** Use ARIA roles `radiogroup` and `radio` appropriately for custom radio selection UI.

## 2026-06-12 - Async Action Feedback
**Learning:** For asynchronous submit buttons, the established UX pattern is to provide clear visual feedback by including `<LoaderCircle className="h-4 w-4 animate-spin" />` from `lucide-react` conditionally, and applying `inline-flex items-center justify-center gap-2` to the button classes, rather than relying solely on `disabled:opacity-40`.
**Action:** Add inline loading spinners to primary action buttons that trigger async operations.
