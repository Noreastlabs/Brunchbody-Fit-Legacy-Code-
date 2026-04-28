# Backup Responsibility UX

## Status and Scope

This document is internal UX guidance only. It is not a privacy policy, store disclosure, user agreement, or behavior change. It must not be used to claim backup, sync, restore, or deletion behavior that has not been verified in the app.

This lane creates one internal architecture artifact only. It does not change app behavior, app source, tests, public docs, privacy policy language, store disclosures, package/config/build files, storage behavior, export behavior, import behavior, restore behavior, delete/reset behavior, cloud sync, backend behavior, or off-device transfer behavior.

What changed: one internal UX guidance document.

What users experience: no user-facing change.

Docs/disclosures required: none in this lane. Future public docs, Settings copy, export copy, onboarding copy, help copy, privacy language, release notes, and store/disclosure copy must be reviewed against verified app behavior before publication.

## Evidence Basis

This document is evidence-bound. Any statement about current export behavior must be backed by current repo evidence named here; otherwise the behavior must be labeled `unverified`, `unknown`, `future`, or `out of current Phase 1 behavior`.

Evidence inputs for current Phase 1 behavior:

- `src/screens/setting/pages/Setting/Setting.js` shows the Settings section `Export data`, row `Export journal data`, and row `Delete local data`.
- `src/screens/setting/components/Export To CSV/ExportToCSV.js` says `Export Journal Data` and describes selected journal entries exported as an Excel workbook (`.xlsx`).
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js` creates an Excel workbook with `bookType: 'xlsx'`, writes `.xlsx` output names when a document-tree path is available, and shows success copy that exported journal data was exported as an Excel workbook.
- `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js` says Brunch Body is local-first in the current app, stores Brunch Body data on this device in local app storage, does not automatically sync data to a Brunch Body cloud account, does not currently provide automatic Brunch Body cloud backup, and treats exported files as user-managed after export.
- Existing architecture guidance in `docs/architecture/documentation-governance.md`, `docs/architecture/data-export-and-portability-controls.md`, `docs/architecture/privacy-messaging-and-trust-language.md`, and `docs/architecture/history-archive-delete-language-rules.md` requires backup, export, import, restore, sync, device-transfer, and deletion claims to stay grounded in verified behavior.

Evidence boundaries:

- Current repo evidence supports a narrow selected journal `.xlsx` export surface, not full backup, all-data export, import, restore, cloud backup, account recovery, server restore, background sync, OS-level backup behavior, or guaranteed device migration.
- OS-level backup behavior, including iCloud or Android device backup behavior, is not defined by this artifact unless separately verified in app configuration and platform behavior.
- Public docs, privacy policy pages, store listings, platform disclosure answers, and release claims are not changed or approved by this document.

## Current Phase 1 Responsibility Model

For Phase 1, Brunch Body is local-first. Current evidence describes Brunch Body working data as stored in app-managed local storage on the device, with no verified Brunch Body cloud account sync or automatic Brunch Body cloud backup.

Users should be able to understand the practical consequence of that model: locally stored Brunch Body data can be lost if app data is cleared, the app is removed, the device is lost, or device data is otherwise removed and no separate export or backup exists.

The current verified export surface is narrow: selected journal entries can be exported as an Excel workbook (`.xlsx`). That export surface must not be described as full backup, all-data export, import, restore, device migration, account recovery, server restore, or cloud sync.

Exported, copied, shared, moved, uploaded, backed-up, or externally saved files are outside Brunch Body app-managed storage. Once a file is outside the app, the user is responsible for where it is saved, copied, shared, uploaded, backed up, moved, protected, restored, or deleted.

Unverified or outside-current-Phase-1 behavior includes broader backup, automatic cloud backup, automatic server backup, cloud sync, background sync, account-based recovery, server restore, import, restore, OS backup behavior, and guaranteed device migration.

## User-Facing Language Principles

Backup responsibility language should be calm, practical, and specific. It should help users make informed choices without sounding alarmist or implying that local-first storage is risk-free.

Use current-behavior wording only when it is backed by repo evidence. Use `not currently verified`, `not currently provided`, `future work`, or `needs review` for behavior that is absent or unclear.

Keep local-first wording bounded to the current app. Do not turn local-first into a permanent guarantee that data can never leave the device, cannot be copied, cannot be included in OS-level backups, or cannot exist in exported files.

Use separate words for separate behaviors:

- `local storage` for app-managed data on this device
- `export` for a user-created file outside normal app-managed storage
- `backup` only when the copy and recovery expectations are clearly described
- `import` or `restore` only when implemented, tested, and disclosure-reviewed
- `Delete local data` only for clearing Brunch Body app-local data on this device

This artifact may guide future public copy, but it does not itself update public docs, privacy policy, store disclosures, release notes, or in-app text.

## Backup Responsibility Copy Rules

Must say:

- Brunch Body is local-first in the current Phase 1 app.
- Current app-managed Brunch Body data is device-local unless a verified feature says otherwise.
- The app must not imply cloud sync, account recovery, automatic server backup, or multi-device restoration.
- If local app data is removed and no separate export or backup exists, Brunch Body data may not be recoverable through the app.
- Backup responsibility wording must stay aligned across app behavior, in-app copy, docs, privacy language, and store/disclosure language before public use.

May say:

- "Brunch Body stores working app data locally on this device in the current app."
- "If you want a copy outside the app, use verified export features where available and keep the exported file somewhere you trust."
- "The current app does not provide a verified Brunch Body cloud backup or restore system."
- "Operating-system backup and device-transfer tools may behave differently by platform and must be verified before Brunch Body makes claims about them."

Must not say:

- "Your data is automatically backed up."
- "Your Brunch Body account can recover your data."
- "Restore your data from the server."
- "Your data syncs in the background."
- "Your data will move to your new device."
- "Brunch Body provides automatic cloud backup."
- "Export is a full backup."
- "Delete local data removes exported files or backups."

Safe copy examples:

- "Brunch Body is local-first in the current app. Your working app data is stored on this device."
- "Exported files are separate copies outside normal app-managed storage. Keep them somewhere you trust."
- "The current app does not provide app-managed import or restore for exported files."
- "If app data is removed and no separate copy exists, the app may not be able to recover it."

Unsafe copy examples:

- "Never worry, your Brunch Body data is always backed up."
- "Sign in later to restore everything from your account."
- "Your data is safely stored on our servers."
- "Brunch Body syncs your data in the background."
- "Delete local data deletes every copy everywhere."

## Export File Handling Rules

Current verified export language must stay narrow. Based on current repo evidence, the app may describe selected journal entry export as an Excel workbook (`.xlsx`). It must not describe that surface as full backup, all-data export, import, restore, or device migration.

Must say:

- Exported files are user-managed copies after export.
- Exported files may contain sensitive personal fitness, journal, nutrition, supplement, reflection, or profile-related information depending on what is exported.
- Files outside app-managed storage are outside `Delete local data` control.
- Users are responsible for where exported files are saved, copied, shared, uploaded, backed up, moved, protected, restored, or deleted.

May say:

- "After export, the file is outside Brunch Body's normal app-managed storage."
- "Anyone with access to the exported file or its storage location may be able to view its contents."
- "Check the destination you choose for its own backup, sync, sharing, and deletion behavior."

Must not say:

- "Export creates a complete backup."
- "Exported files can be restored into Brunch Body."
- "Export protects all Brunch Body data."
- "Brunch Body controls exported files after they are saved elsewhere."
- "Deleting local data removes files you already exported."

## Device Loss, App Removal, and Device Change Language

Device-loss and device-change language must stay practical and bounded to verified behavior.

Must say:

- Locally stored app data can be lost if app storage is cleared, the app is removed, the device is lost, or device data is otherwise removed.
- Brunch Body does not currently verify automatic cloud backup, account recovery, server restore, background sync, or guaranteed device migration.
- OS-level backup behavior is not defined by this artifact and must be separately verified before public claims mention iCloud, Android backup, device-transfer tools, or platform restore behavior.

May say:

- "If you are changing devices, do not assume Brunch Body data will move automatically."
- "Keep any exported files somewhere you can access later if you need those copies."
- "Platform backup tools may have their own behavior; Brunch Body should not claim their results without release-specific verification."

Must not say:

- "Your data will follow you to a new device."
- "Device transfer is guaranteed."
- "iCloud backs this up."
- "Android backup restores this automatically."
- "Reinstall the app to recover your Brunch Body data."

## Delete Local Data Alignment

Backup responsibility wording must not weaken delete-local-data semantics.

For Phase 1, `Delete local data` must mean clearing Brunch Body app-local data on this device. It must not mean deleting files already exported, copied, shared, moved, uploaded, backed up, stored in cloud folders, included in OS backups, saved through platform tools, or stored elsewhere outside Brunch Body app-managed storage.

Must say:

- "`Delete local data` clears Brunch Body app-local data on this device."
- "`Delete local data` does not remove files already exported or saved outside the app."
- "Exported files and external backups must be managed wherever they were saved."

May say:

- "If you exported a file and want it removed, delete that file from the place where you saved it."
- "Starter content included with Brunch Body may appear again after local data is cleared when that matches verified app behavior."

Must not say:

- "Delete local data deletes all backups."
- "Delete local data removes files from cloud drives or other apps."
- "Delete local data erases every copy of your information."
- "Delete local data is account deletion everywhere."
- "Delete local data is server deletion."

## Store and Disclosure Alignment Notes

Store, privacy, support, onboarding, release, and public-doc language must match the shipped app behavior. This artifact is internal guidance and does not approve final public wording.

Future public docs, Settings copy, export copy, onboarding copy, help copy, privacy language, and store/disclosure copy must not overclaim behavior. They must not imply automatic cloud backup, account-based recovery, server restore, background sync, guaranteed device migration, import, restore, or deletion of exported files unless a future lane implements, tests, verifies, and disclosure-reviews that behavior.

Before public or disclosure-facing use, reviewers must confirm:

- the exact app behavior in the release build
- the current export surface, if any
- whether backup, import, restore, sync, account, server, OS backup, or device-transfer behavior exists
- whether Delete local data copy still matches actual app-managed deletion behavior
- whether public docs, privacy policy language, store disclosures, in-app copy, and release notes describe the same behavior boundaries

## Future UX Surface Checklist

Use this checklist before future Settings, export, onboarding, help, public docs, privacy, release, or store/disclosure copy uses this guidance:

- Current behavior is verified against app code, app behavior, tests, or release evidence.
- The current export surface is named narrowly, or marked unverified if evidence is missing.
- Backup, import, restore, cloud sync, account recovery, server restore, background sync, OS backup, and device migration are not claimed unless implemented and reviewed.
- Exported-file responsibility is stated calmly and practically.
- Sensitive exported-file handling is acknowledged without fear-based language.
- Delete-local-data wording remains device-local and app-managed.
- Public and disclosure-facing copy does not rely on this internal artifact as proof of behavior.
- Any uncertainty is labeled `needs verification`, `unverified`, `unknown`, `future`, or `out of current Phase 1 behavior`.

## Non-Goals

This document does not:

- implement backup, import, restore, cloud sync, background sync, account recovery, server restore, device migration, or off-device transfer behavior
- implement or change export behavior
- implement or change delete/reset behavior
- change app source, tests, storage code, export/import code, package files, config files, build files, README files, public docs, privacy policy files, or store/disclosure files
- create user-facing copy, public docs, privacy policy language, store disclosure language, release notes, or legal terms
- claim that Brunch Body automatically preserves data outside the device
- claim that selected journal export is full backup, all-data export, import, restore, or migration support
- define iCloud, Android backup, platform backup, cloud drive, sharing sheet, document picker, or device-transfer behavior

## Validation

Validation for this docs-only lane:

- `git diff --check`
- `git status --short --untracked-files=all`

Expected result:

- Exactly one new file is added: `docs/architecture/backup-responsibility-ux.md`.
- No app source, tests, public docs, README, privacy policy, store/disclosure, package/config/build, storage, export, import, or delete/reset files are changed.
- The required disclaimer appears directly under `## Status and Scope`.
- The required heading order is preserved.
- Current export behavior is tied to named repo evidence.
- Unverified backup, sync, restore, import, OS backup, and device-migration behavior is not described as available.
