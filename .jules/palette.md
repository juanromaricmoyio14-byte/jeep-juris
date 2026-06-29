## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.

## 2026-06-29 - Login Form Accessibility and Loading States
**Learning:** Proper association of `<label>` with `<input>` using `htmlFor` and `id` is crucial for accessibility and allows users to click the label to focus the input. Additionally, providing visual feedback during async operations (like form submissions) using a spinner significantly improves the user experience.
**Action:** Always ensure form labels are correctly associated with their respective inputs. Consistently use loading states for interactive elements that trigger async actions, leveraging existing UI components like `LoaderCircle` and flex layout classes for alignment.
