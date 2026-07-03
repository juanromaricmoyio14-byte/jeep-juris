## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.

## 2025-06-12 - Form Accessibility and Async Button States

**Learning:** Relying solely on `disabled:opacity-40` for asynchronous form submission buttons provides insufficient visual feedback, and failing to link `<label>` elements with their corresponding inputs using `htmlFor` completely breaks screen reader functionality and testability.
**Action:** Always include explicitly visual loading states (e.g., `LoaderCircle`) for async actions, and strictly enforce `htmlFor`/`id` bindings between labels and inputs for accessibility.
