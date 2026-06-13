# Backup And Portability Source Of Truth

Status date: 2026-06-13

WBS lanes:

- 1.4.7.2.1.1 Internal/source-of-truth docs
- Supports 1.4.7.1.1.1 User-facing docs
- Supports 1.4.7.3.1.1 Release/readiness integration

## Current Product Posture

Brunch Body is local-first in the current build. The runtime mode flag is `LOCAL_ONLY_MODE_ENABLED = true` in `src/config/runtimeMode.js`.

Current documented storage surfaces include Redux Persist on AsyncStorage, direct AsyncStorage domain keys, and MMKV-backed bundled plan state. Current public docs say there is no verified Brunch Body cloud backup, automatic restore, full import, or automatic device-to-device sync feature.

## Supported Claims

- Current app working data is device-local.
- Current export behavior, where available, creates user-managed copies.
- Current delete behavior is app-managed local-data deletion on the current device only.
- Public release copy must be rechecked against the shipped build.

## Unsupported Claims

- Brunch Body cloud backup exists.
- Brunch Body account restore exists.
- Cross-device sync exists.
- Import/restore of all app data exists.
- `Delete local data` deletes exported files, OS backups, cloud-folder copies, screenshots, support messages, or other external records.

## Future Implementation Gates

Any future backup, import, restore, sync, or device migration lane must define:

- File/schema versioning.
- Validation and rejection states.
- Tamper/integrity handling.
- UX copy and privacy disclosure updates.
- Platform-specific verification for Android and iOS.
- Focused regression tests.

## Acceptance

This source-of-truth document completes the internal docs lane and should be linked by future portability implementation rows before behavior changes.
