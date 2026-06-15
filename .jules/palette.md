## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.

## 2026-06-15 - Loading States on Async Buttons

**Learning:** Users often click submit buttons multiple times if they don't see immediate feedback. Relying solely on opacity changes (`disabled:opacity-40`) is insufficient visual feedback for asynchronous operations.
**Action:** Always include a visual loading indicator (like an animated spinner) alongside text, and use flexbox (`inline-flex items-center justify-center gap-2`) to keep it aligned, rather than just dimming the button.
