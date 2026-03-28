# Secrets and Debug Keystore Handling

## Do not commit key material

This repository must never track the following file types:

- `*.keystore`
- `*.jks`
- `*.p12`
- `*.pem`

It also must never contain private key blocks (for example: `-----BEGIN ... PRIVATE KEY-----`).

CI enforces this with `.github/workflows/secret-scan.yml`, and the local script `scripts/check-secrets.sh` can be run before pushing changes.

## Android debug keystore setup (local only)

`android/app/debug.keystore` is intentionally **not** tracked by git.

For local Android debug builds, use your user-level debug keystore under `~/.android/debug.keystore`.

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
- known paths such as `android/app/debug.keystore`
