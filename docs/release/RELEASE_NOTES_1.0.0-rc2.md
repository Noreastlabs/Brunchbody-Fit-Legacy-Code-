# BrunchBody 1.0.0-rc2 Release Notes

Release candidate date: 2026-03-28

## Release Readiness Summary
- Feature freeze remains active for the 1.0.0 release train.
- Legal/support links in Settings were re-verified as reachable.
- Platform privacy metadata re-verified against actual app behavior.
- Release build numbers were incremented for new signed candidate generation.

## Included Changes
- Android `versionName` remains `1.0.0` and `versionCode` is now `3`.
- iOS `MARKETING_VERSION` remains `1.0.0` and `CURRENT_PROJECT_VERSION` is now `3`.
- Privacy disclosure documentation refreshed for rc2 verification date and data-flow checks.

## Privacy & Data Behavior (Local-Only)
- BrunchBody currently stores user data locally on the device (AsyncStorage/MMKV).
- No analytics/tracking SDK collection is enabled in this release candidate.
- No developer-server data collection path is active in this release candidate.
- Users can export journal data to local files via Export to CSV.

## Smoke & Release Gates
- Run linting and test suite before distribution candidate sign-off.
- Perform install smoke on release binaries:
  - Launch app and complete onboarding/profile flow.
  - Create/edit/delete journal + todo + nutrition entries.
  - Verify settings legal links open correctly.
  - Verify Export to CSV writes files locally.

## Feature Freeze Policy
- Allowed during freeze: blocker fixes, compliance fixes, release-risk fixes.
- Deferred until post-1.0.0: non-critical enhancements and new feature work.
