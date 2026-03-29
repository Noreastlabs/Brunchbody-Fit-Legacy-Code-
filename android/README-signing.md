# Android signing files

This project keeps signing and key material out of source control.

## Debug keystore (local only)

For local Android debug builds, use the standard user-level debug keystore at `~/.android/debug.keystore` (outside this repository). Gradle in this project is configured to read from that path.

If you do not have a debug keystore yet, generate it locally:

```bash
mkdir -p ~/.android
keytool -genkeypair -v \
  -keystore ~/.android/debug.keystore \
  -alias androiddebugkey \
  -storepass android \
  -keypass android \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=Android Debug,O=Android,C=US"
```

Do not commit keystores or certificates (`*.keystore`, `*.jks`, `*.p12`, `*.pem`, `*.key`, `*.mobileprovision`).
