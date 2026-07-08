## 2025-02-18 - Prevent DoS and High API Costs from Unbounded Inputs
**Vulnerability:** Missing input length limits on the AI agent prompt (`<textarea>`).
**Learning:** Without explicit `maxLength` constraints, a malicious user could submit extremely large text payloads, potentially crashing the client, exhausting server memory, or causing unexpectedly high API costs from the backend LLM service (Gemini).
**Prevention:** Always add a `maxLength` attribute (e.g., `maxLength={2000}`) to textareas and inputs that are sent to backend services to enforce reasonable bounds and implement Defense in Depth.
