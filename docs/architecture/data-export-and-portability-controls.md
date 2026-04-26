# Data Export and Portability Controls

## Status and Scope

This document is internal control-surface guidance only. It is not a legal privacy policy, store disclosure, user agreement, public help guide, or behavior change. It must not be used to claim export, import, restore, backup, sync, or portability behavior that has not been verified in the app.

This lane changes no app behavior, no public docs, no privacy policy, no store disclosure, no permissions, no storage behavior, and no export, import, restore, backup, cloud sync, file sharing, account sync, or device-transfer behavior.

What changed: one internal documentation artifact only.

What users experience: no user-facing change.

Docs/disclosures required: no public docs or disclosures are changed in this lane. Future implementation lanes must trigger disclosure review before Brunch Body makes public claims about export, import, restore, backup, sync, portability, device transfer, or recovery.

Brunch Body's current posture remains local-first and mobile-first. This document preserves that posture by separating repo-observed controls from planned, gated, unknown, and out-of-scope portability behavior.

## Evidence Basis

This artifact is evidence-first. A control must not be labeled `current` unless this document records a repo-observed evidence note. Source code, current app behavior, and current architecture docs outrank roadmap intent or older wording.

Evidence inputs for this lane:

- `src/screens/setting/pages/Setting/Setting.js` shows the Settings section `Export data` and row `Export journal data`.
- `src/screens/setting/components/Export To CSV/ExportToCSV.js` renders the heading `Export Journal Data`, says selected journal entries export as an Excel workbook (`.xlsx`), and warns that exported files may contain personal information and are not removed by Delete local data.
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js` builds an Excel workbook with `bookType: 'xlsx'`, writes `.xlsx` file names, uses `react-native-scoped-storage` / `react-native-fs`, and shows success copy assigning responsibility for saved, copied, shared, uploaded, or deleted exported files to the user.
- `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js` says the current app is local-first, stores Brunch Body data on this device in local app storage, does not automatically sync data to a Brunch Body cloud account, and does not currently provide automatic Brunch Body cloud backup.
- `docs/architecture/settings-ia-control-surfaces.md`, `docs/architecture/privacy-edge-case-communication.md`, `docs/architecture/privacy-messaging-and-trust-language.md`, and `docs/architecture/local-only-contract-closeout.md` describe the current selected journal `.xlsx` export as narrower than full backup, import, restore, cloud sync, or device-transfer behavior.

Public docs, legal/privacy policy pages, store listings, platform disclosure answers, and release claims are not changed or approved by this document.

## Control Classification Model

Use these labels for export and portability control surfaces:

- `current`: verified in current app behavior or source.
- `planned`: intended future control, not currently implemented.
- `gated`: future control that requires a separate implementation, testing, and disclosure review lane.
- `unknown`: insufficient evidence; must not be described as available.
- `out_of_scope`: excluded from this project phase unless reopened.

Rules:

- Every `current` entry must include an evidence note.
- File presence, route names, dependency names, or older docs are not enough to mark a control `current`.
- Ambiguous behavior must be labeled `unknown`, `planned`, or `gated`, not `current`.
- A future control may be discussed internally only as future work; it must not become user-facing copy until implementation, testing, and disclosure review are complete.
- Claims about full backup, all-data export, import, restore, cloud sync, account sync, device transfer, or recovery are `gated` unless a future lane verifies them.

## Current Export and Portability Surface

| Control surface | Classification | Evidence note | Boundary |
| --- | --- | --- | --- |
| Settings entry for selected journal export | `current` | `src/screens/setting/pages/Setting/Setting.js` shows Settings section `Export data` with row `Export journal data` that navigates to `SETTINGS_ROUTES.EXPORT_TO_CSV`. | This is an entry point for selected journal export only, not a full data export or backup claim. |
| Export detail screen for selected journal entries | `current` | `src/screens/setting/components/Export To CSV/ExportToCSV.js` renders `Export Journal Data`, entry-type toggles, and copy saying selected journal entries export as an Excel workbook (`.xlsx`). | The surface is journal-scoped and selected-entry-type scoped. |
| Export file creation behavior | `current` | `src/screens/setting/pages/Export To CSV/ExportToCSV.js` creates an `xlsx` workbook, writes `.xlsx` file names, and uses `react-native-scoped-storage` / `react-native-fs` for local file output. | This does not prove import, restore, full backup, cloud backup, or cross-device portability. |
| Exported-file responsibility notice | `current` | Export success copy in `src/screens/setting/pages/Export To CSV/ExportToCSV.js` says that once exported, the user is responsible for where the file is saved, copied, shared, uploaded, or deleted. | Files outside app-managed storage must be treated as user-managed and outside Delete local data control. |
| Exported-file sensitivity notice | `current` | `src/screens/setting/components/Export To CSV/ExportToCSV.js` says exported files may contain personal fitness, journal, nutrition, supplement, reflection, or profile-related information depending on what is exported. | Export copy should continue to treat exported files as potentially sensitive. |
| Local-first Privacy & Data explanation | `current` | `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js` says Brunch Body is local-first in the current app and stores Brunch Body data on this device in local app storage. | This is bounded current-app wording, not a permanent guarantee that data can never leave a device. |
| No automatic Brunch Body cloud sync notice | `current` | `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js` says the current app does not automatically sync user data to a Brunch Body cloud account. | This does not authorize a broader no-network or no-third-party claim. |
| No automatic Brunch Body cloud backup notice | `current` | `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js` says Brunch Body does not currently provide automatic Brunch Body cloud backup for device-local app data. | This does not prove anything about operating-system backup or device-transfer tools. |
| Full backup or all-data export | `gated` | No current full backup or all-data export behavior was verified in the inspected Settings, export, and transparency surfaces. | Requires separate product, implementation, testing, copy, and disclosure review lanes. |
| Import or restore from exported files | `gated` | No current import or restore flow was verified in the inspected Settings, export, and transparency surfaces. | Do not imply exported files can be restored into the app. |
| Device-to-device transfer | `unknown` | Current repo evidence does not verify whether operating-system backup or device-transfer tools include, exclude, restore, or delete Brunch Body app data. | Must not be described as supported by Brunch Body. |
| Brunch Body cloud sync, backend sync, or account sync | `gated` | Current Privacy & Data copy says no automatic Brunch Body cloud account sync; no implementation lane is included here. | Must not be introduced by this artifact. |
| Public export, backup, restore, or portability claims | `gated` | This artifact is internal guidance only and does not edit public docs, store disclosures, privacy policy, or user-facing help. | Requires future behavior verification and disclosure alignment before public use. |

## Future Control Surface Rules

Future Settings or related user-control surfaces may group export and portability controls near Privacy & Data, Backup/Export/Import, or Delete/Reset controls, but only if their labels match verified behavior.

Future surfaces must:

- distinguish selected journal export from full backup or all-data export
- keep local-first wording bounded to current verified behavior
- explain when exported files become user-managed outside app-managed storage
- identify what data class is exported, read, imported, overwritten, merged, skipped, or left untouched
- show user responsibility for saving, storing, sharing, uploading, deleting, and protecting exported files
- mark import, restore, backup, sync, and device-transfer controls as unavailable or future-only until implemented and reviewed
- avoid implying that OS backups, device-transfer tools, cloud drives, file managers, sharing sheets, or other apps are controlled by Brunch Body

Future surfaces must not:

- rename selected journal export into a broad all-data export claim
- put backup, import, restore, or device-transfer controls in UI without implementation and tests
- imply account-backed recovery, cloud recovery, or automatic cross-device continuity
- imply Delete local data removes exported files or platform-managed copies
- use internal route names such as `ExportToCSV` to define user-facing export meaning

## User-Facing Language Rules

User-facing copy must be plain, specific, and evidence-bound. It should describe what the current app does, what the user controls, and what remains outside Brunch Body's control.

Allowed patterns when verified:

- "Selected journal entries can be exported as an Excel workbook (`.xlsx`)."
- "After export, the file is outside Brunch Body's normal app-managed storage."
- "Exported files may contain personal fitness, nutrition, journal, supplement, reflection, or profile-related information."
- "The current app does not automatically sync Brunch Body data to a Brunch Body cloud account."
- "Brunch Body does not currently provide automatic Brunch Body cloud backup for device-local app data."

Forbidden user-facing claims unless a future implementation lane verifies behavior and disclosure review approves the wording:

- "export your data"
- "export all your data"
- "backup supported"
- "restore your data"
- "move to a new device"
- "sync across devices"
- "cloud backup"
- "account recovery"
- "your data is always backed up"
- "Delete local data removes exported files"
- "exported files can be restored into the app"

Local-first language must not become an absolute guarantee. Do not say that data never leaves the device unless the exact feature, platform, build, export path, permission path, external links, dependencies, and disclosure context have all been verified.

## Backup File Sensitivity Rules

Any future backup or broader export file must be treated as sensitive by default because it may include fitness, nutrition, journal, supplement, reflection, profile, body, routine, calendar, todo, planning, or locally stored app information.

Future backup/export implementation lanes must define:

- included and excluded data classes
- file format and versioning
- whether the file is human-readable, machine-readable, compressed, encrypted, or otherwise protected
- where the file is created and how the user chooses or confirms the destination
- whether other apps, operating-system tools, cloud drives, or sharing targets can access the file after creation
- what Delete local data does and does not remove after a file leaves app-managed storage
- what happens when export fails, is canceled, produces an empty dataset, or writes a partial file

Until those details are implemented and reviewed, broader backup-file language must stay `gated` or `unknown`.

## Device Change and Portability Guidance

Brunch Body should explain device-change expectations conservatively.

Current guidance:

- Brunch Body remains local-first in the current app.
- Local app data may not follow the user automatically if the app is deleted, app storage is cleared, the device is lost, or the user changes devices.
- Current repo evidence supports selected journal `.xlsx` export only, not a verified full backup, import, restore, or device-transfer system.
- Operating-system backups, cloud device backups, and device-transfer tools have platform-specific behavior that this artifact does not verify.

Future user-facing device-change guidance must not promise that a user can move Brunch Body data to a new device unless a future lane proves the exact transfer path, included data, excluded data, failure modes, restore behavior, and disclosure impact.

## Implementation Preconditions

Before adding user-facing export, backup, import, restore, sync, or portability claims, a future implementation lane must prove:

- the exact control surface, route, copy, and user flow
- the data classes included and excluded
- whether the behavior is selected-entry export, all-data export, backup, import, restore, sync, or device transfer
- the file format, versioning, compatibility, and migration expectations
- platform-specific filesystem, document picker, sharing-sheet, scoped-storage, and permission behavior
- cancellation, empty-state, error, partial-write, duplicate, overwrite, merge, and corrupted-file behavior
- delete/reset interactions, including what app-managed and exported data remain after Delete local data
- tests or release validation covering the implemented behavior
- disclosure review for privacy policy, public docs, store listings, App Store privacy details, Google Play Data safety answers, support copy, and release notes when public claims are in scope

No implementation lane may rely on this artifact alone as evidence that export, import, restore, backup, sync, or portability exists.

## Disclosure Alignment Notes

This artifact does not change privacy posture, legal policy, public documentation, store disclosures, platform disclosures, support copy, release notes, or app behavior.

Disclosure alignment rules:

- No public docs or disclosures are changed in this lane.
- Future implementation lanes must trigger disclosure review before public claims.
- Public claims must match the shipped build, not roadmap intent.
- Store, privacy, support, onboarding, in-app copy, and public docs must use the same behavior boundaries.
- If future behavior touches permissions, storage, export/import, backup, delete/reset, sync, backend, analytics, telemetry, AI, or platform integrations, disclosure review must happen before release-facing wording is finalized.

Release and trust safeguard:

- What changed: one internal documentation artifact only.
- What users experience: no user-facing change.
- Docs/disclosures required: none in this lane; future implementation lanes must trigger disclosure review before public claims.

## Non-Goals

This document does not:

- implement export, import, restore, backup, file sharing, cloud sync, account sync, or device transfer
- implement Settings UI changes
- change source code, tests, package files, lockfiles, CI, native manifests, privacy policy files, store/disclosure files, public docs, or README files
- change filesystem, document picker, sharing-sheet, scoped-storage, permission, or storage behavior
- change delete, reset, archive, logout, onboarding, or account semantics
- introduce backend behavior, cloud behavior, AI behavior, desktop behavior, monetization behavior, broad redesign, or multi-device infrastructure
- claim selected journal export is full backup, all-data export, import, restore, device-transfer, or cloud-sync behavior
- approve legal privacy policy language, store listing language, Data Safety answers, App Privacy answers, or public support language

## Follow-On Lane Seeds

- Export architecture and data-class coverage
- Export file format, versioning, and sensitivity model
- Export UX and copy alignment
- Import and restore semantics
- Backup responsibility UX
- Device-change and OS-backup verification
- Disclosure alignment review for export, backup, import, restore, and portability claims
- Delete/reset interaction review for exported files and platform-managed copies
