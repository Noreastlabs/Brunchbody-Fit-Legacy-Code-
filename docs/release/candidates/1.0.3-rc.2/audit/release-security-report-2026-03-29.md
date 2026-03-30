# Release Security Report — 1.0.3-rc.2 — 2026-03-29 (UTC)

## Scope
1. Re-run current verification commands against the post-fix RC2 code state.
2. Verify Android production security settings and release-signing guardrails after the RC2 version bump.
3. Archive signed-build attempts from the current environment.
4. Record remaining release gates that must be closed before public release.

## Verification summary

### Commands executed
- `yarn check:local-only`
- `yarn check:secrets`
- `./scripts/verify-no-tracked-key-material.sh`
- `git ls-files | rg -n -i '(social security|\bssn\b|date of birth|\bdob\b|passport|driver.?s license|credit card|\bcvv\b|routing number)'`
- `rg -n --hidden -g '!node_modules/**' -g '!.git/**' -e '\b\d{3}-\d{2}-\d{4}\b' -e '\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b' .`
- `git ls-files | rg -n -i '(google-services\.json|GoogleService-Info\.plist|awsconfiguration\.json|amplifyconfiguration\.json|firebase.*\.json|\.env(\.|$)|terraform\.tfstate|credentials\.json|service-account.*\.json|id_rsa|id_dsa|\.pem$|\.p12$|\.jks$|\.keystore$)'`
- `yarn test --watch=false`
- `yarn lint`

### Outcomes
- Local-only guard: **PASS**
- Secret scan: **PASS**
- Tracked key artifact scan: **PASS**
- PII keyword scan: **PASS (no matches)**
- Structured PII/PAN scan: **PASS (no matches)**
- Tracked sensitive artifact filename scan: **REVIEWED** (`ios/.xcode.env` filename match only)
- Automated tests: **PASS** (`22/22`)
- Lint: **PASS with warnings only** (`0` errors, `349` warnings)

## Production Android security verification

Verified and captured in:
- `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/android-production-security-verification-2026-03-29.txt`

Checks covered:
- RC2 Android metadata (`versionName 1.0.3-rc.2`, `versionCode 7`)
- Release-signing env-var guardrails in `android/app/build.gradle`
- Production manifest cleartext deny policy in `android/app/src/main/AndroidManifest.xml`
- Base cleartext deny policy and debug-only localhost exemptions in network security config

Result: **PASS**

## Signed build attempts from this environment

### Android release build
- Command: `cd android && ./gradlew assembleRelease`
- Output: `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/android-release-build-2026-03-29.txt`
- Result: **BLOCKED** (`java` runtime not installed in this environment)

### iOS archive build
- Command: `xcodebuild -workspace ios/BrunchBody.xcworkspace -scheme BrunchBody -configuration Release -archivePath ios/build/BrunchBody-1.0.3-rc.2.xcarchive archive`
- Output: `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/ios-release-archive-2026-03-29.txt`
- Result: **BLOCKED** (`xcodebuild` requires a full Xcode install; current active developer directory is Command Line Tools only)

## Attached outputs
- `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/check-local-only-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/check-secrets-cli-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/secret-scan-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/no-tracked-key-artifacts-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/pii-keyword-scan-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/structured-pii-pan-scan-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/tracked-sensitive-artifacts-scan-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/yarn-test-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/yarn-lint-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/android-production-security-verification-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/android-release-build-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/ios-release-archive-2026-03-29.txt`

## Required explicit owner sign-off

Engineering/Security owner: `________________`  
Decision: `APPROVE` / `REJECT` (circle one)  
Date (UTC): `YYYY-MM-DD`

Release manager: `________________`  
Decision: `APPROVE` / `REJECT` (circle one)  
Date (UTC): `YYYY-MM-DD`

> Release status rule: RC2 can be marked ready for public release only after signed Android+iOS artifacts exist, required checklist evidence is attached, and explicit approvals are recorded.

## Release readiness status

- Technical verification bundle: ✅ Complete
- Android production security verification: ✅ Complete
- Signed Android artifact: ❌ Blocked in this environment
- Signed iOS artifact: ❌ Blocked in this environment
- Engineering/Security owner sign-off: ⏳ Pending
- Release manager sign-off: ⏳ Pending
- Public release readiness: **NOT READY**
