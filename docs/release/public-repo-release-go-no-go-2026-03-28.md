# Public Repo Release Security Gate — 2026-03-28

## Scope
1. Re-run static scans for secrets, PII, and cloud-config artifacts after remediations.
2. Re-confirm Android release hardening controls.
3. Produce final risk register and release recommendation.

## Verification evidence

### 1) Full static scan rerun (post-remediation)
- `./scripts/check-secrets.sh` → **PASS**
  - Exclusion validation passed.
  - Secret pattern scan passed.
- `git ls-files | grep -Ei '\\.(keystore|jks|p12|pem)$'` → **PASS** (no tracked key material)
- `rg --pcre2 -n "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}" src android ios` → **PASS** (no email literals in app/platform source scope)
- `rg --pcre2 -n "\\b\\d{3}-\\d{2}-\\d{4}\\b" src android ios` → **PASS** (no SSN-like literals)
- Python regex scan for hardcoded `password|passwd|secret|token|api_key` assignments in `src/`, `android/`, `ios/` → **PASS** (no findings)

### 2) Android release-hardening re-confirmation
- **Release signing path remains hardened**:
  - Release signing values are loaded only from Gradle user properties / CI env variables (`BRUNCHBODY_*` or `BB_*`).
  - Release build task validates required signing values and throws when missing.
  - Release build task throws if debug keystore/alias is detected (`debug.keystore` / `androiddebugkey`).
  - `buildTypes.release` is pinned to `signingConfigs.release`.
- **Production cleartext remains disabled**:
  - Main manifest sets `android:usesCleartextTraffic="false"`.
  - Main manifest sets `android:networkSecurityConfig="@xml/network_security_config"`.
  - Main network security config sets `<base-config cleartextTrafficPermitted="false" />`.
  - Debug-only override allows cleartext only for emulator/local domains (acceptable dev-only exception).

## Final risk register

| ID | Area | Status | Risk before remediation | Current residual risk | Disposition |
|---|---|---|---|---|---|
| R-01 | Tracked secrets / key artifacts | **Resolved** | Exposure of keystore/cert/key material in public repo. | Regex/file-extension scans can miss unconventional filenames or encoded blobs. | Accept residual; enforce periodic scanning in CI. |
| R-02 | Hardcoded sensitive literals / PII | **Resolved** | Potential leakage of passwords/tokens/PII in source/config. | Static regex coverage is heuristic and cannot guarantee detection of all obfuscated or split literals. | Accept residual; keep pre-commit + CI scans and review gates. |
| R-03 | Android release signing misuse | **Resolved** | Accidental release signing with debug keystore or missing secure signing inputs. | Runtime depends on CI secret hygiene and secure signing pipeline configuration. | Accept residual with CI secret controls and release lane checks. |
| R-04 | Android production cleartext transport | **Resolved** | Potential plaintext traffic exposure in production builds. | Misconfiguration could be reintroduced by future manifest/network policy edits. | Accept residual with release checklist control and config diff review. |
| R-05 | Debug cleartext exceptions | **Accepted** | Debug local cleartext allowances might be misunderstood as prod posture. | Limited to debug network config and local emulator domains only. | Accepted operationally (low risk, dev-only necessity). |

## Formal recommendation

**GO** for public repository release.

Rationale: Post-remediation static scanning shows no current secret/PII/cloud-config artifact findings in scope, and Android release-signing plus production cleartext hardening controls remain intact. Residual risks are low and operationally acceptable with existing CI/release controls.
