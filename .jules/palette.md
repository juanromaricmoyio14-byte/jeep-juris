## 2024-05-31 - Keyboard Accessibility for Password Toggles
**Learning:** Avoid using `tabIndex={-1}` on essential interactive elements like password visibility toggles, as it completely breaks keyboard accessibility for users relying on tab navigation.
**Action:** Always ensure interactive elements within form controls remain in the natural tab order and provide clear `focus-visible` styles.
