## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.
## 2026-06-11 - Asynchronous Submit Button UX

**Learning:** Relying solely on `disabled:opacity-40` for long-running asynchronous tasks (like Firebase Auth) provides insufficient visual feedback and can leave users wondering if their click registered.
**Action:** Always provide explicit visual feedback on asynchronous submit buttons by including a conditional `<LoaderCircle className="h-4 w-4 animate-spin" />` from `lucide-react` and applying `inline-flex items-center justify-center gap-2` to the button layout for a clean, centered loading state.
