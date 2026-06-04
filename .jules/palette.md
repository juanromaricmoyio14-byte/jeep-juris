## 2024-06-04 - Keyboard Accessibility in Icon Buttons Within Inputs

**Learning:** Icon-only interactive elements nested within input fields (like password visibility toggles) are prone to being skipped via `tabIndex={-1}` to keep focus inside the input. This severely degrades accessibility for keyboard-only users who can no longer toggle the state. Also, without visible focus (`focus-visible`), users won't know they've reached the toggle.
**Action:** Always ensure nested interactive buttons are tabbable (remove `tabIndex={-1}`) and include standard `focus-visible` styling (`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`) so keyboard users can navigate and operate them successfully.
