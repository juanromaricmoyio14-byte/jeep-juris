
## 2024-05-24 - Interactive Component Focus States
**Learning:** Many interactive components that are not built using Radix UI/standard library primitives (e.g. custom buttons like the Language Switcher, Header icons, and Back button) are missing keyboard focus states, negatively affecting keyboard accessibility.
**Action:** When adding or auditing custom interactive elements (`button`, `a`, etc.) in the future, actively check for and apply the standard `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` utility classes to ensure robust keyboard navigation support across the application.
