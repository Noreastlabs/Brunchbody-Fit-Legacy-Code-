# Backup Privacy And Disclosure Alignment

Status date: 2026-06-13

WBS lane: 1.4.5.3.1.1 Privacy and disclosure alignment

## Decision

Brunch Body should describe backup and portability conservatively:

- App working data is device-local in the current local-only build.
- User-initiated export may create user-managed copies where export exists.
- Brunch Body does not currently provide an automatic cloud backup, Brunch Body account restore, cross-device sync, or guaranteed device migration feature.
- `Delete local data` does not remove exported files, copied files, OS/device backups, cloud-folder copies, shared files, screenshots, or other records outside app-managed local storage.

## Source Truth

- `README.md` says the app is local-first, uses local data paths in current mode, and has no automatic cloud backup/sync for device-local records.
- `docs/public/brunch-body-privacy-and-data.md` says export is user-controlled and current export behavior is not a full access, backup, import, or restore system.
- `docs/public/brunch-body-user-guide.md` says release behavior for export, delete, backup, restore, and device-change scenarios needs verification before public support or store-review reliance.

## Required Disclosure Rules

- Use "local-first" and "device-local" for current working data.
- Use "user-managed exported copy" for files created through export.
- Do not call export a backup unless the export lane explicitly implements backup semantics and policy copy is updated.
- Do not imply app-managed cloud recovery or cross-device continuity.
- Do not imply Brunch Body can delete external copies or platform backups.

## Acceptance

This lane is complete when future backup/export/import/restore docs and UI copy preserve the rules above or explicitly supersede them with owner-approved implementation evidence.
