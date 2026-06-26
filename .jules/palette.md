## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.
## 2026-06-26 - Form Accessibility and Async Loading State

**Learning:** Missing `htmlFor` properties and generic `disabled:opacity-40` behaviors on buttons are common subtle UI/a11y gaps. Explicitly binding labels to inputs using `htmlFor` and `id` vastly improves screen reader experiences, while adding inline loading spinners enhances perceived performance during async operations. Ensure all development dependencies are installed (`bun install`) before running the linter if module errors occur.

**Action:** Consistently apply `htmlFor`/`id` pairings to all future form elements. For async buttons, adopt the `lucide-react` spinner pattern alongside tailwind's `inline-flex` to maintain alignment.
