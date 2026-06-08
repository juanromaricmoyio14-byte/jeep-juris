## 2024-06-08 - Keyboard accessibility on input action buttons

**Learning:** Adding `tabIndex={-1}` to input adornment buttons (like password visibility toggles) is an anti-pattern. While it might prevent "annoying" extra tab stops for mouse users, it completely breaks accessibility for keyboard and screen reader users who can no longer access the functionality.
**Action:** Never use `tabIndex={-1}` on interactive elements unless they are truly hidden or non-functional. Instead, rely on standard focus management and add clear visual focus indicators like `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
