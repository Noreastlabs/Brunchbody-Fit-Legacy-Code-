# Contributing

Thank you for considering a contribution to this project. This repository is public as an active-development beta for a local-first React Native app, and additional fixes and feature updates are expected over the coming weeks.

## Project Status

- Repository visibility is public for collaboration and transparency.
- Public mobile app release readiness is tracked separately and still follows the RC release-gating docs under `docs/release/`.
- Current default behavior is local-first and device-local: fresh installs route to `CompleteProfile`, returning users route to `Home`, and account/profile actions remain local-only in the current build.

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


## Environment & Signing Values (outside git)

### Local secrets and signing values (must be outside git)

When developing or preparing releases, keep all sensitive values outside tracked project files:

- Store signing secrets and API credentials in CI protected variables, OS keychain, or approved secrets manager.
- Keep local overrides in untracked files/paths only (for example, `~/.config/...`, `%APPDATA%/...`, or shell profile exports).
- Treat `*.example` files as templates only; never replace placeholders with real values in git-tracked files.
- If a secret is committed accidentally, rotate/revoke immediately and follow the incident steps in `SECURITY.md`.


Store environment secrets and signing values outside this repository:

- Keep signing credentials in CI-protected variables or approved secret managers.
- Keep local-only values in untracked files/paths (for example OS keychain, `~/.config/...`, `%APPDATA%/...`).
- Never commit populated `.env*` files, `android/signing.properties`, keystores, certificates, or private keys.
- Use `android/signing.properties.example` only as a template and inject real values from local environment/CI.

See `docs/security/KEY_MATERIAL_STORAGE.md` and `docs/secrets-and-debug-keys.md` for storage patterns and setup details.

## Pre-merge checklist

Before requesting review or merging, verify:

- [ ] `./scripts/check-secrets.sh` passes with no high-risk findings (required before merge).
- [ ] Signing configuration is reviewed and verified (release signing values sourced from secure environment/CI variables, no plaintext secrets in git).
- [ ] Changes comply with [SECURITY.md](SECURITY.md).

## Guidelines

- Follow the existing code style and project structure.
- Features should preserve the current local-first behavior unless a change explicitly updates the runtime mode and release docs.
- Keep first-launch and account-management flows aligned with current behavior: fresh installs route to `CompleteProfile`, saved local profiles route to `Home`, and settings/account actions are device-local in the current build.
- Treat public repository visibility and public mobile release readiness as separate decisions. Do not assume that a public repo means release-tagging gates have been cleared.
- Submit pull requests with clear descriptions and reference any relevant issues.
- Confirm your PR complies with [SECURITY.md](SECURITY.md) disclosure and secret-handling requirements.
- Before pushing, run `./scripts/check-secrets.sh` to verify the repository does not include committed key artifacts (`*.keystore`, `*.jks`, `*.p12`, `*.pem`), cloud keys, bearer tokens, DB URLs with embedded credentials, or private key blocks.
- Keep `.secret-scan-exclusions` minimal and limited to known-safe noisy paths (for example lockfiles).

## Questions?

Feel free to open an issue if you have questions about contributing.
