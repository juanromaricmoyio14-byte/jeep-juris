## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.

## 2026-06-27 - Missing form label associations and loading indicators

**Learning:** Form labels missing htmlFor fail to focus their respective inputs when clicked, degrading accessibility for screen readers and usability for mouse users. Asynchronous submit buttons lack clear visual feedback (spinners) during loading states.
**Action:** Always pair <label htmlFor="id"> with <input id="id"> in forms. For async submit buttons, include a loading spinner (e.g., <LoaderCircle className="h-4 w-4 animate-spin" />) and use inline-flex items-center justify-center gap-2 on the button to ensure the spinner and text are properly aligned.
