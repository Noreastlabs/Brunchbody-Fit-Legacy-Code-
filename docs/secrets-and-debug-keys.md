# Secrets and Debug Keystore Handling

Follow [SECURITY.md](../SECURITY.md) first for vulnerability disclosure and repository-wide secret handling policy.

## Do not commit key material

This repository must never track the following file types:

- `*.keystore`
- `*.jks`
- `*.p12`
- `*.pem`
- `*.key`
- `*.mobileprovision`

It also must never contain:

- private key blocks (for example: `-----BEGIN ... PRIVATE KEY-----`)
- cloud credentials (for example AWS-style key IDs and secret-access-key patterns)
- API key or token assignments (including bearer tokens)
- database URLs with embedded credentials

CI enforces this with `.github/workflows/secret-scan.yml`, and the local script `scripts/check-secrets.sh` can be run before pushing changes. A pre-commit hook is provided at `.githooks/pre-commit`.

False-positive path exclusions are maintained in `.secret-scan-exclusions` and should stay narrow (lockfiles/noisy generated assets only) with rationale documented inline.

CI fails by default on detections. An override is only allowed on pull requests after explicit security review by adding **both** labels: `security-review-approved` and `secret-scan-override-approved`.

For protected branches (such as `main`), require the status check **`Secret scan (required)`** in branch protection rules before merge.

## Android debug keystore setup (local only)

`android/app/debug.keystore` is intentionally **not** tracked by git.

For local Android debug builds, use your user-level debug keystore under `~/.android/debug.keystore`.

Developer setup note: generate/use the debug key locally on your machine and keep it outside the repository.

Generate one if needed:

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

Android Gradle debug builds will automatically use this default debug keystore location.

## If this repo becomes public: clean history

If any key files were previously committed, remove them from history before or immediately after going public:

1. Rotate/revoke exposed credentials.
2. Rewrite history with `git filter-repo` or BFG to remove key artifacts.
3. Force-push rewritten branches/tags and notify collaborators to re-clone.

Example (`git filter-repo`) patterns to remove:

- `*.keystore`
- `*.jks`
- `*.p12`
- `*.pem`
- `*.key`
- `*.mobileprovision`
- known paths such as `android/app/debug.keystore`
