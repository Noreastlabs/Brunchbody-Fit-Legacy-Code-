# BrunchBody 1.0.3-rc.2 Release Notes

Release candidate date: 2026-03-29

## Highlights
- Completed local-only account flows for logout, local email updates, local password change/reset, and delete-account reset behavior.
- Fixed post-account-action navigation so logout/delete-account return users to `CompleteProfile` instead of a removed legacy route.
- Made the secret scan portable on stock macOS Bash and aligned the secret-scan workflow/docs on one override-label and required-check policy.
- Re-ran RC2 technical verification against the current `main` state after the latest release-readiness fixes.

## Privacy & Data Behavior (Explicit Statement)
BrunchBody `1.0.3-rc.2` continues to operate in a **local-only data mode**:
- User data is stored on-device only (AsyncStorage/MMKV-backed paths).
- No active developer-server user data collection path is enabled in this release candidate.
- No analytics/tracking SDK pipeline is enabled in this release candidate.
- Local account changes remain device-scoped; they do not sync to any cloud backend.
- Exported journal data is written to local files when users choose Export to CSV.

## Compliance/Verification Notes
- Settings links remain HTTPS-only:
  - `https://brunchbodyfit.com/terms-conditions/`
  - `https://brunchbodyfit.com/privacy-policy/`
  - `https://brunchbodyfit.com/contact-us/`
- iOS privacy manifest remains aligned with current behavior:
  - `NSPrivacyTracking=false`
  - `NSPrivacyCollectedDataTypes=[]`
  - Required-reason APIs for UserDefaults, FileTimestamp, and SystemBootTime
- RC2 app/build metadata:
  - Package version: `1.0.3-rc.2`
  - Android: `versionName 1.0.3-rc.2`, `versionCode 7`
  - iOS: `MARKETING_VERSION 1.0.3-rc.2`, `CURRENT_PROJECT_VERSION 7`

## Release Gate Status
- Local-only guard: PASS
- Secret scan: PASS
- Tracked key artifact scan: PASS
- Automated test suite: PASS (`22/22`)
- Lint: PASS with warnings only (`0` errors, `349` warnings)
- Android signed artifact generation: BLOCKED in this environment (no Java runtime / Android signing toolchain available)
- iOS signed artifact generation: BLOCKED in this environment (`xcodebuild` requires full Xcode, not Command Line Tools only)
- Explicit Engineering/Security owner sign-off: PENDING
- Explicit release-manager sign-off: PENDING

Overall decision: **NO-GO** until signed Android and iOS release artifacts are produced on signing-capable environments and required approvals are recorded.
