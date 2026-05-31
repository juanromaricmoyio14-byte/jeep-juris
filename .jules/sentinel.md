## 2024-05-28 - Stop leaking stack traces and error details in root ErrorComponent
**Vulnerability:** The root `ErrorComponent` directly rendered `error.message` to the user interface (`<p>{error.message}</p>`). This can expose sensitive internal details or stack traces to users.
**Learning:** React Error Boundaries or routing error handlers should use generic, user-friendly messages rather than passing raw Error object messages to the DOM.
**Prevention:** Always catch raw errors and display a static, generic error string on the frontend. Log the actual `error.message` to the console or an error tracking service instead.
