# Brunch Body Backup And Portability

Status date: 2026-06-13

Brunch Body is currently documented as a local-first app. In the current build, app working data is stored on the device instead of in a Brunch Body cloud account.

## What This Means

- Your app data may not automatically follow you to another device.
- Clearing app storage, uninstalling the app, losing the device, or changing devices can remove access to local app-managed data.
- Where export is available, exported files are user-managed copies after they are created.
- Exported, copied, shared, moved, backed-up, uploaded, or externally saved files are outside Brunch Body app-managed storage.

## What Is Not Currently Promised

Brunch Body does not currently promise:

- Automatic Brunch Body cloud backup.
- Automatic restore from a Brunch Body account.
- Cross-device sync.
- Full-device migration.
- Import of all app data.
- Deletion of exported files or other external copies through `Delete local data`.

## User Responsibility

If you export information, choose where to store it carefully. The destination may have its own backup, sharing, sync, privacy, and deletion behavior.

## Release Note

Before using this as public release copy, verify the shipped Android and iOS builds still match the local-first behavior documented in `README.md` and the privacy/data guide.
