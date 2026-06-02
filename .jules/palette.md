## 2024-05-18 - Missing label htmlFor associations
**Learning:** Found that some forms (like the login form) lacked `htmlFor` on labels and corresponding `id`s on inputs. This prevented screen readers from correctly associating labels with inputs and meant clicking a label wouldn't focus the input.
**Action:** Next time I modify or review forms, I will explicitly check that all `<label>` elements have a valid `htmlFor` pointing to the `id` of their respective input fields.
