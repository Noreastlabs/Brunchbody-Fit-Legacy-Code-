# Android signing files

This project keeps signing and key material out of source control.

## Debug keystore (local only)

For local Android debug builds, let Gradle/Android tooling create `android/app/debug.keystore` automatically, or generate one locally with `keytool` if needed.

Example (from repo root):

```bash
keytool -genkeypair -v \
  -keystore android/app/debug.keystore \
  -alias androiddebugkey \
  -storepass android \
  -keypass android \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=Android Debug,O=Android,C=US"
```

Do not commit keystores or certificates (`*.keystore`, `*.jks`, `*.p12`, `*.pem`, `*.key`, `*.mobileprovision`).
