# BrunchBody 1.0.1-rc1 Release Notes

Release candidate date: 2026-03-28

## Highlights
- Re-validated legal/support links surfaced in Settings.
- Re-verified iOS privacy manifest declarations for current app behavior.
- Re-ran local-only architecture guard checks.
- Completed release gate review with blocker-closure checklist.

## Privacy & Data Behavior (Explicit Statement)
BrunchBody `1.0.1-rc1` continues to operate in a **local-only data mode**:
- User data is stored on-device only (AsyncStorage/MMKV-backed paths).
- No active developer-server user data collection path is enabled in this release candidate.
- No analytics/tracking SDK pipeline is enabled for this release candidate.
- Exported journal data is written to local files when users choose Export to CSV.

## Compliance/Verification Notes
- Settings links verified reachable over HTTPS:
  - `https://brunchbodyfit.com/terms-conditions/`
  - `https://brunchbodyfit.com/privacy-policy/`
  - `https://brunchbodyfit.com/contact-us/`
- iOS privacy manifest currently declares:
  - `NSPrivacyTracking=false`
  - `NSPrivacyCollectedDataTypes=[]`
  - Required-reason APIs for UserDefaults, FileTimestamp, and SystemBootTime.

## Release gate status
- Link validation: PASS
- Privacy metadata alignment: PASS
- Android signed artifact generation: BLOCKED in this container environment
- iOS signed artifact generation: BLOCKED in this container environment

Overall decision: **NO-GO** until signed Android and iOS artifacts are produced in the release CI/macOS signing pipeline.
