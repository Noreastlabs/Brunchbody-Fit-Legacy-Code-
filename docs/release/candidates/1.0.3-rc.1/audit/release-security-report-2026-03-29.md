# Release Security Report — 1.0.3-rc.1 — 2026-03-29 (UTC)

## Scope
1. Re-run full repository security scans after remediation.
2. Verify production Android security settings.
3. Record required Engineering/Security owner sign-off gate.
4. Mark release readiness **only** after checklist pass + explicit sign-off.

## Full repository scan rerun (post-remediation)

### Commands executed
- `./scripts/check-secrets.sh --report=docs/release/candidates/1.0.3-rc.1/audit/scan-outputs/secret-scan-2026-03-29.txt`
- `./scripts/verify-no-tracked-key-material.sh`
- `git ls-files | rg -n -i '(social security|\bssn\b|date of birth|\bdob\b|passport|driver.?s license|credit card|\bcvv\b|routing number)'`
- `rg -n --hidden -g '!node_modules/**' -g '!.git/**' -e '\\b\\d{3}-\\d{2}-\\d{4}\\b' -e '\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\\b' .`
- `git ls-files | rg -n -i '(google-services\\.json|GoogleService-Info\\.plist|awsconfiguration\\.json|amplifyconfiguration\\.json|firebase.*\\.json|\\.env(\\.|$)|terraform\\.tfstate|credentials\\.json|service-account.*\\.json|id_rsa|id_dsa|\\.pem$|\\.p12$|\\.jks$|\\.keystore$)'`

### Outcomes
- Secret scan: **PASS**
- Tracked key artifact scan: **PASS**
- PII keyword scan: **PASS (no matches)**
- Structured PII/PAN regex scan: **PASS (no matches)**
- Tracked sensitive filename scan: **REVIEWED** (`ios/.xcode.env` filename match only)

### Attached outputs (release candidate docs)
- `docs/release/candidates/1.0.3-rc.1/audit/scan-outputs/check-secrets-cli-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.1/audit/scan-outputs/secret-scan-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.1/audit/scan-outputs/no-tracked-key-artifacts-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.1/audit/scan-outputs/pii-keyword-scan-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.1/audit/scan-outputs/structured-pii-pan-scan-2026-03-29.txt`
- `docs/release/candidates/1.0.3-rc.1/audit/scan-outputs/tracked-sensitive-artifacts-scan-2026-03-29.txt`

## Production Android security settings verification

Verified and captured in:
- `docs/release/candidates/1.0.3-rc.1/audit/scan-outputs/android-production-security-verification-2026-03-29.txt`

Checks covered:
- Release signing configuration and debug-signing guardrails in `android/app/build.gradle`.
- Production manifest cleartext policy in `android/app/src/main/AndroidManifest.xml`.
- Base cleartext deny policy in `android/app/src/main/res/xml/network_security_config.xml`.

Result: **PASS** (settings verified for production release posture).

## Required explicit owner sign-off

Engineering/Security owner: `________________`  
Decision: `APPROVE` / `REJECT` (circle one)  
Date (UTC): `YYYY-MM-DD`

> Release status rule: repository/app can be marked ready for public release **only after** completed checklist evidence **and** explicit Engineering/Security owner sign-off.

## Release readiness status

- Checklist completion: ✅ Completed with evidence attached.
- Explicit Engineering/Security owner sign-off: ⏳ Pending.
- Public release readiness: **NOT READY** until sign-off is completed.
