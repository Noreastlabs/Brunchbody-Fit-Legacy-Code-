# Release Sign-off — 2026-03-28

## Scope
1. Confirm privacy/legal/support links in `src/screens/setting/pages/Setting/Setting.js`.
2. Verify privacy metadata alignment in `ios/BrunchBody/PrivacyInfo.xcprivacy`.
3. Produce signed release artifacts and execute a go/no-go checklist requiring all blocker items closed.
4. Publish release notes explicitly stating current local-only data behavior.

## 1) Settings privacy/legal/support links
Links configured in-app:
- Terms of Use: `https://brunchbodyfit.com/terms-conditions/`
- Privacy Policy: `https://brunchbodyfit.com/privacy-policy/`
- Support & Contact: `https://brunchbodyfit.com/contact-us/`

Runtime verification (`curl -I`) on 2026-03-28 UTC:
- Terms: `HTTP/1.1 200 OK`
- Privacy: `HTTP/1.1 200 OK`
- Contact: `HTTP/1.1 200 OK`

Status: ✅ Confirmed.

## 2) iOS privacy metadata alignment
Reviewed `ios/BrunchBody/PrivacyInfo.xcprivacy` via plist parsing.

Declared values:
- `NSPrivacyTracking = false`
- `NSPrivacyCollectedDataTypes = []`
- `NSPrivacyAccessedAPITypes`:
  - `NSPrivacyAccessedAPICategoryUserDefaults`: `CA92.1`, `1C8F.1`, `C56D.1`
  - `NSPrivacyAccessedAPICategoryFileTimestamp`: `C617.1`
  - `NSPrivacyAccessedAPICategorySystemBootTime`: `35F9.1`

Cross-check:
- Local-only storage posture remains in effect (`node scripts/check-local-only-mode.js` passed).
- No privacy-manifest edits required for this candidate.

Status: ✅ Aligned.

## 3) Signed artifacts + blocker-closure checklist
Target release candidate: `1.0.1 (4)`.

### Build/signing attempts
- Android signed release artifact attempt: `cd android && ./gradlew assembleRelease`
  - Result: ❌ Failed (React Native Gradle plugin path missing because `node_modules` is not present in this container).
- iOS signed archive attempt: `xcodebuild ... archive`
  - Result: ❌ Failed (`xcodebuild: command not found`; macOS/Xcode not available in this container).

### Go/No-Go blocker checklist (all blockers must be closed)
| Blocker item | Required state | Actual state | Evidence | Gate |
| --- | --- | --- | --- | --- |
| Settings legal/privacy/support links valid | Closed | Closed | HTTP 200 checks | ✅ |
| iOS privacy manifest aligned with current behavior | Closed | Closed | plist review + local-only check | ✅ |
| Android signed release artifact generated | Closed | **Open** | `assembleRelease` failed in env | ❌ |
| iOS signed release artifact generated | Closed | **Open** | `xcodebuild` unavailable in env | ❌ |
| Release notes published with explicit local-only data statement | Closed | Closed | `docs/release/RELEASE_NOTES_1.0.1-rc1.md` | ✅ |

Checklist rule outcome: **NOT ALL BLOCKERS CLOSED**.

### Release decision
**NO-GO** (as of 2026-03-28 UTC).

Required to move to GO:
1. Run dependency install and Android signing in release CI with configured keystore secrets.
2. Produce iOS signed archive/IPA on macOS runner with Xcode + signing cert/profile.
3. Re-run this checklist and confirm every blocker row is closed.
