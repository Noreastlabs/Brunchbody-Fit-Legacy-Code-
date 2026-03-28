# Security Review Follow-up — 2026-03-28

## Scope
1. Re-run repo-wide regex secret/PII scans after cleanup.
2. Confirm no keystore/key files are tracked and no sensitive literals are present in source/config.
3. Re-verify Android release signing and network hardening configuration.

## Scan results
### Secrets scan script
- Command: `./scripts/check-secrets.sh`
- Result: ✅ PASS (`Secret scan passed`)

### Tracked key/keystore artifact scan
- Command: `git ls-files | grep -Ei '\\.(keystore|jks|p12|pem)$'`
- Result: ✅ PASS (no tracked matches)

### PII / sensitive-literal regex scans (source + platform config)
- Command: `rg --pcre2 '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}'` scoped to `src/`, `android/`, `ios/`
  - Result: ✅ PASS (no email literals in source/config scope)
- Command: `rg --pcre2 '\\b\\d{3}-\\d{2}-\\d{4}\\b'` scoped to `src/`, `android/`, `ios/`
  - Result: ✅ PASS (no SSN-like literals)
- Command: Python regex scan for hardcoded `password|passwd|secret|token|api_key` assignments in source/config
  - Result: ✅ PASS (no matches)

## Android release-signing verification
From `android/app/build.gradle`:
- Release signing values are only read from Gradle properties / CI env vars (`BRUNCHBODY_*` / `BB_*`).
- Release builds are blocked when signing inputs are missing.
- Release builds are blocked if keystore path or alias indicates debug keystore (`debug.keystore` / `androiddebugkey`).
- `buildTypes.release` is pinned to `signingConfigs.release`.

Status: ✅ PASS (release-signing hardening still in place).

## Android network-hardening verification
From manifests and network security config:
- Main manifest enforces `android:usesCleartextTraffic="false"`.
- Main manifest sets `android:networkSecurityConfig="@xml/network_security_config"`.
- Main network policy `<base-config cleartextTrafficPermitted="false" />`.
- Debug override permits cleartext only for local dev endpoints (`localhost`, `10.0.2.2`, `10.0.3.2`).

Status: ✅ PASS (production cleartext disabled; debug exceptions are local-only).

## Remaining non-blocking risks
1. Regex-only scans can miss obfuscated/encoded secrets or non-regex-sensitive data classes.
2. This follow-up is static config validation and does not replace signed release artifact verification in CI/macOS signing lanes.
3. OAuth client identifiers remain visible in app metadata by design (public identifier class, not credential secret).

## Overall status
**PASS** — no tracked key material and no high-risk secret/PII literals detected in source/config; Android release-signing and network-hardening controls remain configured correctly.
