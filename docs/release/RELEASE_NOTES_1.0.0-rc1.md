# BrunchBody 1.0.0-rc1 Release Notes

Release candidate date: 2026-03-27

## Highlights
- Release metadata updated for Android and iOS (`1.0.0`, build `2`).
- Privacy/legal readiness pass completed.
- Support + legal links verified live.
- Release candidate branch + tag created to support feature freeze.

## Included Changes
- Android `versionName` set to `1.0.0` and `versionCode` set to `2`.
- iOS `MARKETING_VERSION` set to `1.0.0` and `CURRENT_PROJECT_VERSION` set to `2`.
- Settings labels normalized for legal pages and support entry.
- iOS `NSLocationWhenInUseUsageDescription` removed because location permissions are not currently used.
- Platform privacy disclosure checklist added in `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md`.

## Known Limitations
- App data is currently local-only (device storage via AsyncStorage/MMKV).
- No user account cloud backup/sync is available in this release candidate.
- Uninstalling the app removes local data unless user manually exported files.
- Some reminder/alarm behavior may remain disabled depending on build configuration.

## Blockers / Triage Policy (Feature Freeze)
- Branch `rc/1.0.0-rc1` is in feature-freeze mode.
- Only blocker fixes, release-risk fixes, and app-store compliance fixes are allowed.
- Non-blocker feature work should target post-1.0.0 branches.

