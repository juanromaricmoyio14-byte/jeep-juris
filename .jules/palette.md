## 2024-05-15 - Password Visibility Toggle Accessibility

**Learning:** Adding `tabIndex={-1}` to input adornment buttons (like password visibility toggles) acts as an accessibility anti-pattern. It blocks keyboard-only users from accessing the toggle entirely, breaking functionality for screen readers and keyboard navigation.
**Action:** Avoid `tabIndex={-1}` on any interactive elements that users need to click. Ensure focus-visible states (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none`) are present instead.
