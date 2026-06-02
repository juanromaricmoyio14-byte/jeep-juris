## 2024-06-02 - Hardcoded Secrets in .env
**Vulnerability:** A critical vulnerability where the `.env` file containing sensitive environment variables such as `VITE_FIREBASE_API_KEY` was committed directly into the repository.
**Learning:** This exposes the secret keys to anyone who has access to the repository, leading to potential abuse. Files containing secrets must always be excluded from source control.
**Prevention:** Always add `.env` and any other files containing sensitive credentials to `.gitignore` from the onset of a project.
