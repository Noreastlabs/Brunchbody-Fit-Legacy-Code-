# Contributing

Thank you for considering a contribution to this project! The goal of this clone is to provide a simplified codebase that does not rely on authentication or local onboarding.

## Security First

Before opening a pull request, read and follow [SECURITY.md](SECURITY.md). Vulnerabilities must be disclosed privately, and secret/signing material handling rules apply to every contribution.

## Getting Started

1. Fork the repository and create your branch from `main`.
2. Install dependencies with `yarn install`.
3. Run `yarn lint` and `yarn test` to ensure your changes pass our checks.
4. Install repository git hooks so secrets are scanned before each commit:

   ```bash
   git config core.hooksPath .githooks
   ```

5. If you plan to run Android debug builds, generate a local debug keystore (outside this repo) at `~/.android/debug.keystore`:

   ```bash
   mkdir -p ~/.android
   keytool -genkeypair -v \
     -storetype PKCS12 \
     -keystore ~/.android/debug.keystore \
     -alias androiddebugkey \
     -storepass android \
     -keypass android \
     -keyalg RSA \
     -keysize 2048 \
     -validity 10000 \
     -dname "CN=Android Debug,O=Android,C=US"
   ```

   `android/app/debug.keystore` must never be committed.

## Guidelines

- Follow the existing code style and project structure.
- Features should respect the current scope: authentication and local onboarding were removed to keep the codebase light.
- Submit pull requests with clear descriptions and reference any relevant issues.
- Confirm your PR complies with [SECURITY.md](SECURITY.md) disclosure and secret-handling requirements.
- Before pushing, run `./scripts/check-secrets.sh` to verify the repository does not include committed key artifacts (`*.keystore`, `*.jks`, `*.p12`, `*.pem`), cloud keys, bearer tokens, DB URLs with embedded credentials, or private key blocks.
- Keep `.secret-scan-exclusions` minimal and limited to known-safe noisy paths (for example lockfiles).

## Questions?

Feel free to open an issue if you have questions about contributing.
