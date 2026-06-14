## 2026-06-11 - Input Adornment Accessibility

**Learning:** Using `tabIndex={-1}` on interactive input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern by blocking keyboard navigation for these elements.
**Action:** Avoid `tabIndex={-1}` on interactive elements and ensure proper keyboard focus states (e.g., `focus-visible:ring-2 focus-visible:ring-ring`) are applied instead to maintain accessibility.

## 2024-06-14 - Add loading spinner to async submit buttons

**Learning:** Found multiple forms relying exclusively on `disabled:opacity-40` for loading state feedback, which isn't clear enough.
**Action:** Used `lucide-react`'s `LoaderCircle` with `animate-spin` in submit buttons along with `inline-flex items-center justify-center gap-2` to show clearer loading feedback.
