# Settings Control Copy Alignment Plan
## Status and Scope

This is an internal Settings copy-alignment plan only.

It records current Settings wording and future copy-alignment recommendations.

It does not change app behavior.

It does not change Settings copy.

It does not change confirmation copy.

It does not change README/public docs.

It does not change privacy policy, store language, or disclosures.

It does not approve final user-facing wording.

It does not approve new deletion/reset/export/import/restore/archive behavior.

It does not approve backend/cloud/sync behavior.

This document is a Settings control copy alignment plan only. It records current wording and future alignment recommendations without approving or changing behavior, copy, privacy, store, export/import, restore, archive, deletion, backend, cloud, sync, route, navigation, reducer, action, or storage behavior.

Current copy mismatches are recorded for later owner review. This lane creates no implementation permission and no final copy approval.

## Source of Truth

1.2.3.4.1 approved the vocabulary contract in `docs/architecture/delete-reset-archive-semantics-decision.md`.

1.2.3.4.2 inventoried current retention/control surfaces in `docs/architecture/retention-and-history-control-surfaces.md`.

1.2.3.4.3 defined language rules in `docs/architecture/history-archive-delete-language-rules.md`.

1.2.3.4.4 covered profile/auth/onboarding retention in `docs/architecture/profile-auth-onboarding-retention-truth-check.md`.

1.2.3.4.5 covered journal/export retention in `docs/architecture/journal-history-export-retention-truth-check.md`.

1.2.3.4.6 covered domain-history retention in `docs/architecture/domain-history-retention-matrix.md`.

Live code wins over older docs. Current copy mismatches are recorded, not fixed. Proposed replacement copy is non-binding until owner-approved. Absence claims mean "no repo-observed wording found," not runtime impossibility.

## Vocabulary Baseline

| Term | Required treatment |
| --- | --- |
| Delete local data | Preferred phrase for app-managed local data clearing on this device. |
| Delete Account | Mismatch candidate unless backed by real backend account deletion. |
| `deleteAccount()` | Internal implementation identifier only; may be cited as evidence. |
| DeleteAccount | Internal component/path naming evidence only; not approved copy. |
| reset | Restricted; use only for a specific verified control. |
| archive | Not current behavior; forbidden for current-state Settings copy. |
| exported copy | Preferred phrase for files outside app-managed lifecycle after export. |
| CSV | Mismatch candidate if implementation writes .xlsx workbook files. |
| backup | Restricted; do not imply full backup or restore-capable backup. |
| restore/import | Restricted; do not imply current support unless implemented and verified. |
| cloud backup/sync | Forbidden current-state claim unless implemented and verified. |
| account deletion | Forbidden current-state claim unless backend accounts exist. |

## Evidence Inputs

| Evidence input | Contribution |
| --- | --- |
| `docs/architecture/delete-reset-archive-semantics-decision.md` | Source vocabulary: `Delete local data` is preferred; `Delete Account`, account deletion, broad reset, archive, backup, restore, import, cloud backup, and sync are restricted or forbidden unless verified. |
| `docs/architecture/retention-and-history-control-surfaces.md` | Present-state retention/control inventory for Settings, exported copies, `RESET_APP`, current internal `deleteAccount()`, import/restore/archive absence, and current mismatch candidates. |
| `docs/architecture/history-archive-delete-language-rules.md` | Reusable language rules for visible Settings copy, confirmation copy, internal identifiers, exported-copy boundaries, and forbidden current-state claims. |
| `docs/architecture/profile-auth-onboarding-retention-truth-check.md` | Profile/auth/onboarding retention evidence, including local profile storage, local password/reset wording, internal `deleteAccount()`, and visible `Delete Account` mismatch candidate in My Account. |
| `docs/architecture/journal-history-export-retention-truth-check.md` | Journal/export evidence: selected journal export writes `.xlsx` workbook files; `Export To CSV`/`ExportToCSV` are mismatch candidates; no repo-observed import/restore complement. |
| `docs/architecture/domain-history-retention-matrix.md` | Cross-domain retention evidence for nutrition, calendar, exercise, recreation, and todo; confirms domain data is local and not automatically export/import/restore/archive behavior. |
| `docs/architecture/persistence-inventory.md` | Persistence and lifecycle context for Redux Persist, direct AsyncStorage keys, MMKV bundled-plan re-seed, exported workbook boundary, logout, `RESET_APP`, and delete-local-data/current `deleteAccount()` behavior. |
| `docs/architecture/store-and-middleware-review.md` | Store evidence for persisted root whitelist, root reducer `RESET_APP`, local-only posture, and current logout/delete-account distinctions. |
| `README.md` | Inspected README context for local-first behavior, Settings profile/edit/export/delete-local-data language, no backend persistence, and no automatic cloud backup/sync. README is not changed in this lane. |
| `src/screens/setting/pages/Setting/Setting.js` | Settings row/route evidence: visible `Settings`, `Profile`, `View and edit profile`, `Export data`, `Export journal data`, `Delete local data`, `Privacy & Data`; route constants include `SETTINGS_ROUTES.DELETE_ACCOUNT` and `SETTINGS_ROUTES.EXPORT_TO_CSV`. |
| `src/screens/setting/components/Setting.js` | Settings main list rendering evidence for visible row labels, route navigation, links, and the `Settings` screen title. |
| `src/screens/setting/pages/MyProfile/MyProfile.js` and `src/screens/setting/components/My Profile/MyProfile.js` | My Profile evidence: visible `Profile`, `Edit nickname and vitals`, and local-device helper copy. |
| `src/screens/setting/pages/MyProfile/MyVitals.js` and `src/screens/setting/components/My Profile/MyVitals.js` | Profile details evidence: visible `Profile details`, `Nickname (optional)`, local-device helper copy, and local profile save behavior. |
| `src/screens/setting/pages/MyProfile/MyAccount.js` and `src/screens/setting/components/My Profile/MyAccount.js` | My Account evidence: file surface exists with visible `My Account` and `Delete Account` wording, but current Settings navigator does not register `MY_ACCOUNT`. |
| `src/screens/setting/pages/MyProfile/MyEmail.js`, `src/screens/setting/components/My Profile/MyEmail.js`, `src/screens/setting/pages/MyProfile/MyPassword.js`, and `src/screens/setting/components/My Profile/MyPassword.js` | Account/profile residue evidence for local email and local password surfaces, including `Reset Local Password` and local password reset copy. |
| `src/screens/setting/pages/MyProfile/DeleteAccount.js` and `src/screens/setting/components/My Profile/DeleteAccount.js` | Delete confirmation evidence: visible `Delete local data`, checkbox/body/button copy, error/success modal text, and internal `DeleteAccount` component/page naming. |
| `src/screens/setting/pages/Export To CSV/ExportToCSV.js` and `src/screens/setting/components/Export To CSV/ExportToCSV.js` | Export screen wording evidence: visible `Export Journal Data`, `.xlsx` helper copy, `Export Data` button, `XLSX` workbook generation, `RNFS`/`ScopedStorage` file writing, and `Export To CSV`/`ExportToCSV` naming residue. |
| `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js` | Settings-adjacent Privacy & Data context: local-first, no automatic cloud sync, no automatic Brunch Body cloud backup, exported-file responsibility, and Delete local data external-file boundary. |
| `src/redux/actions/auth.js` | Current delete-local-data/internal `deleteAccount()` behavior evidence: dispatches `RESET_APP`, clears AsyncStorage, clears MMKV, and rehydrates bundled plans; also contains local email/password/reset behavior. |
| `src/navigation/SettingsNavigation.js` and `src/navigation/routeNames.js` | Route/screen title evidence: current Settings stack registers `SETTINGS`, `MY_PROFILE`, `MY_VITALS`, `DELETE_ACCOUNT`, `EXPORT_TO_CSV`, legal/privacy/about screens, but not `MY_ACCOUNT`, `MY_EMAIL`, or `MY_PASSWORD`. Route constants retain `DeleteAccount` and `ExportToCSV` internal names. |

Minimum evidence classes covered: Settings row/route evidence; My Profile / My Account evidence; delete confirmation evidence; export screen wording evidence; current delete-local-data/internal `deleteAccount()` behavior evidence; prior retention/language docs evidence; README wording evidence.

## Copy Surface Classification Model

Copy status labels:

- `aligned`
- `mismatch candidate`
- `restricted wording`
- `forbidden current-state wording`
- `internal identifier only`
- `needs owner-approved replacement`
- `not repo-observed`

Surface type labels:

- `Settings row label`
- `Settings route/screen title`
- `confirmation title`
- `confirmation body`
- `button label`
- `internal component/function name`
- `export screen label`
- `README/public-doc context`

Evidence category labels:

- `repo-observed`
- `inferred`
- `unknown`

## Current Settings Copy Inventory

| Surface | Current wording or identifier | Surface type | Copy status | Evidence category | Required treatment |
| --- | --- | --- | --- | --- | --- |
| Settings main list | `Settings`; section labels include `Profile`, `Export data`, `Delete local data`, `About`; row labels include `View and edit profile`, `Export journal data`, `Delete local data`, `Privacy & Data`. | Settings row label | aligned, with route residue noted | repo-observed | Inventory current account/profile/data/export labels. Keep `Delete local data` as preferred visible wording. Treat `SETTINGS_ROUTES.DELETE_ACCOUNT` and `SETTINGS_ROUTES.EXPORT_TO_CSV` as internal route evidence only. |
| My Account / My Profile area | Current registered profile surface shows `Profile`, `Edit nickname and vitals`, `Profile details`, `Nickname (optional)`, and device-local helper text. File-only My Account surface shows `My Account`, `My Email`, `My Password`, and `Delete Account`, but `MY_ACCOUNT`, `MY_EMAIL`, and `MY_PASSWORD` are not registered in `SettingsNavigation`. | Settings route/screen title | aligned for visible profile wording; mismatch candidate for file-only `Delete Account`; restricted wording for account language | repo-observed | Record account/profile wording and mismatch candidates. Future copy should distinguish local profile/nickname/user data from backend identity. |
| Delete local data row or control | Main Settings section and row both say `Delete local data`; delete screen title/button also say `Delete local data`. | Settings row label, Settings route/screen title, button label | aligned | repo-observed | Treat as preferred wording because it scopes the current destructive control to app-managed local data on this device. |
| Delete Account visible wording | `src/screens/setting/pages/MyProfile/MyAccount.js` contains section and row text `Delete Account`; current Settings navigator does not register `MY_ACCOUNT`. | Settings row label | mismatch candidate, needs owner-approved replacement if surfaced | repo-observed | Treat as mismatch candidate only. It does not prove backend account deletion and must not be used as approved current-state copy unless real backend account deletion exists. |
| DeleteAccount component/path | `src/screens/setting/pages/MyProfile/DeleteAccount.js`, `src/screens/setting/components/My Profile/DeleteAccount.js`, route value `DeleteAccount`. | internal component/function name | internal identifier only | repo-observed | Cite as implementation evidence only. Do not treat as user-facing copy approval. |
| `deleteAccount()` function/action | `src/redux/actions/auth.js` exports `deleteAccount()`; it dispatches `RESET_APP`, clears AsyncStorage/MMKV, and rehydrates bundled plans. | internal component/function name | internal identifier only | repo-observed | Cite as implementation evidence only. Do not use to claim backend account deletion. |
| Delete confirmation title/body | Delete screen title and button say `Delete local data`; body says it clears Brunch Body app-local data stored on this device, lists saved profile details, journal entries, workouts, nutrition, themes, todos, and other app-local data as deleted, and lists exported/copied/shared/moved/backed-up/uploaded/external files as not deleted. Error/success modal copy also scopes the action to Brunch Body app-local data on this device and says exported/external files are not deleted. | confirmation title, confirmation body, button label | aligned, with owner review required before any future copy edits | repo-observed | Record whether wording scopes deletion to app-managed local data on this device. Current wording is directionally aligned; any replacement still needs owner approval. |
| Export screen title | Visible title is `Export Journal Data`; route/path/component residue includes `Export To CSV` and `ExportToCSV`. | export screen label, Settings route/screen title, internal component/function name | aligned for visible `.xlsx` screen title/body; mismatch candidate for CSV residue | repo-observed | Record `Export To CSV` / `CSV` mismatch because live implementation writes `.xlsx` workbook files. |
| Export file wording | Visible screen says selected journal entries export as an Excel workbook (`.xlsx`), exported files may contain sensitive personal/profile-related information, files are user-managed after export, and files saved outside the app are not removed by Delete local data. Success modal repeats `.xlsx` workbook and user responsibility wording. | export screen label, confirmation body | aligned | repo-observed | Record that wording does not imply CSV, full backup, restore, or import. Continue using exported copy language in future lanes. |
| Backup/restore/import/cloud/sync wording | Privacy & Data says the current app does not automatically sync to a Brunch Body cloud account and does not currently provide automatic Brunch Body cloud backup. Delete copy mentions `backed up` files only as external files not deleted. No current Settings import, restore, archive, cloud backup, cloud sync, or backend deletion control was found. | Settings route/screen title, confirmation body | restricted wording for backup/reset; forbidden current-state wording if used as current support; not repo-observed for import/restore/archive support | repo-observed for negative wording; unknown for runtime impossibility | Record as restricted/forbidden if found. Do not turn negative explanatory wording into a current support claim. |
| Reset wording | Password surface uses `Reset Local Password` and `Password Reset Saved`; delete copy says Delete local data is not a password reset; internal `RESET_APP` exists. | Settings route/screen title, confirmation body, internal component/function name | restricted wording; internal identifier only for `RESET_APP` | repo-observed | Use reset only for specific verified controls such as local password reset or internal reducer evidence. Do not use broad reset for Delete local data. |
| Archive wording | No repo-observed current Settings archive control found. Prior docs mention archive as not current behavior. | Settings route/screen title | not repo-observed; forbidden current-state wording | repo-observed absence in scoped scan | Do not use archive for current-state Settings copy. Future archive behavior requires a separate lane. |

## Delete Local Data Copy Plan

Future UI copy should prefer Delete local data.

Copy should specify app-managed local data on this device.

Copy must not imply backend account deletion.

Copy must not imply exported files are deleted.

Copy must not imply OS backups, cloud-folder copies, shared files, or uploaded files are deleted.

Copy should avoid broad `reset` unless tied to a verified control.

Bundled starter content re-seed should not be described as user-history restore.

Future delete-local-data copy should preserve these boundaries:

- The action clears Brunch Body app-managed local data stored by the app on this device.
- Exported copies are outside the app-managed lifecycle after export.
- Files the user exported, copied, shared, moved, backed up, uploaded, or saved outside Brunch Body app-managed storage are not deleted by this action.
- Any reference to starter content should say starter content included with Brunch Body may appear again after deletion, not that user history is restored.

## Account and Profile Wording Plan

`Account` language should be treated cautiously in Phase 1.

`Delete Account` is a mismatch candidate unless backend account deletion exists.

Internal identifiers may remain as implementation evidence until a separate refactor lane exists.

This lane does not approve component/function renames.

Future copy should distinguish local profile/nickname/user data from backend identity.

Current registered profile surfaces are better aligned when they use `Profile`, `Profile details`, `Edit nickname and vitals`, and device-local helper text. File-only My Account surfaces and route/component names are retained as evidence only. If a later lane surfaces My Account, the owner must approve account/profile wording before implementation.

## Export Copy Plan

Future export copy should use exported copy language.

`Export To CSV` / `CSV` wording is a mismatch candidate if live implementation writes `.xlsx`.

Export should not be called full backup, automatic backup, cloud backup, restore-capable backup, or import/restore support.

Exported files become user-managed outside app-managed lifecycle.

Delete local data does not delete exported copies.

Future export copy should preserve the current evidence that selected journal data is written as an Excel workbook (`.xlsx`). It should not imply every Brunch Body domain is exported. It should not imply the workbook can be imported or restored into the app unless that behavior is later implemented and verified.

## Reset, Archive, Backup, Restore, Import, Cloud, and Sync Wording Plan

`reset` is restricted and should not be used broadly.

`archive` is not current behavior.

`backup` is restricted and requires explicit limitation if used.

`restore` and `import` should not be claimed unless implemented and verified.

`cloud backup`, `sync`, and backend deletion claims are forbidden unless implemented and verified.

No current Settings copy should imply deletion of external copies.

Current negative statements such as no automatic cloud backup/sync are allowed only as current-behavior explanations after verification. They must not be converted into a claim that Brunch Body provides cloud backup, cloud sync, import, restore, archive, or backend deletion.

## Proposed Replacement Copy Candidates

Candidate wording in this section is not final approved copy. It is non-binding, planning-only, and owner-approval-required before any UI or documentation implementation.

| Current wording | Issue | Safer candidate wording | Rationale | Owner approval required | Implementation lane |
| --- | --- | --- | --- | --- | --- |
| `Delete Account` | Mismatch candidate because it implies backend account deletion unless a real backend account lifecycle exists. | `Delete local data` | Uses the approved destructive-control phrase for app-managed local data on this device. | yes | `1.2.3.4.7.1` |
| `My Account` | Restricted account wording can imply backend identity or account lifecycle if surfaced without local context. | `Profile` or `Local profile` | Distinguishes local profile data from backend account identity. Final choice needs owner approval and UI review. | yes | `1.2.3.4.7.3` |
| `My Email` | Email wording may imply account email if surfaced in an account area. | `Local email` | Keeps the field scoped to the email saved on this device. | yes | `1.2.3.4.7.3` |
| `My Password` | Password wording may imply backend password if surfaced in an account area. | `Local password` | Matches current local password behavior and avoids backend credential claims. | yes | `1.2.3.4.7.3` |
| Delete confirmation title/body, if future edits are needed | Current copy is broadly aligned, but any shortening must keep the local/device and external-file boundaries. | `Delete local data from this device` and body text that says Brunch Body app-managed local data is cleared while exported copies and files outside app-managed storage are not deleted. | Preserves app-managed local data scope and avoids account deletion or external-copy deletion claims. | yes | `1.2.3.4.7.1` |
| `Export To CSV` / `ExportToCSV` route, path, or component naming | CSV mismatch candidate because live export writes `.xlsx` workbook files. Internal names are not visible copy approval. | Visible copy: `Export journal data`; possible future internal route/component rename only in a separate refactor lane. | Aligns visible copy with current workbook behavior while avoiding unscoped internal renames in this lane. | yes | `1.2.3.4.7.2` or separate refactor lane |
| Export helper/body copy, if future edits are needed | Export must not imply full backup, import, restore, cloud backup, or all-domain export. | `Exports selected journal entries as an Excel workbook (.xlsx). The exported copy is user-managed after it is saved outside the app.` | States output type and exported-copy boundary without backup/restore claims. | yes | `1.2.3.4.7.2` |
| `backed up` in delete/external-file lists | Restricted term; safe only when used as an external-copy example, not as a Brunch Body feature claim. | `files you exported, copied, shared, moved, uploaded, backed up, or saved outside Brunch Body app-managed storage` | Keeps backup framed as user/platform-managed external copies, not app-provided backup support. | yes | `1.2.3.4.7-follow-on` |
| `Reset Local Password` | Restricted but control-specific and currently scoped to local password behavior. | Keep only if owner confirms local password reset remains visible and intended; otherwise use `Reset local password`. | Keeps reset tied to a verified specific control and avoids broad app reset language. | yes | `1.2.3.4.7.3` |
| Import/restore/archive wording | No repo-observed current Settings support found. | Do not add current-state import, restore, or archive copy. | Avoids unsupported current-state claims. | yes | `1.2.3.4.7-follow-on` |

## Owner Approval Required Before Implementation

This lane does not approve final UI copy.

Any Settings copy implementation must be owner-approved first.

Any copy implementation must be a separate minimal-diff lane.

Any implementation lane must list exact files to edit.

Any implementation lane must include screenshot/manual review expectations if UI text changes are made.

Any implementation lane must confirm no behavior, storage, deletion, export/import, or privacy/store disclosure changes unless explicitly scoped.

Owner approval must happen after the candidate wording is reviewed in context. Internal identifiers, route names, paths, and function names may be cited as evidence, but they must not define visible product language.

## Follow-On Implementation Lane Notes

Seeded future lanes:

- `1.2.3.4.7.1 Settings Delete Local Data Copy Alignment`: owner-approved exact wording for visible delete-local-data surfaces and confirmation copy, if any UI copy edits are needed.
- `1.2.3.4.7.2 Export Screen Copy Alignment`: owner-approved exact wording for export screen labels, helper copy, button copy, and any CSV/workbook mismatch cleanup.
- `1.2.3.4.7.3 Account/Profile Settings Wording Alignment`: owner-approved exact wording for local profile/account/email/password surfaces if those surfaces remain or become reachable.

Later parent sequence lanes:

- `1.2.3.4.8 Retention Regression Tests for Existing Clear Paths`
- `1.2.3.4.9 Public Docs / README Retention Alignment`
- `1.2.3.4.10 Retention and History Controls Closeout`

Follow-on implementation lanes must not infer approval from this planning document. They must re-verify live code, list exact files to edit, include UI review expectations, and keep behavior/storage/export/import/privacy/store/disclosure changes out of scope unless explicitly authorized.

## Non-Claims

This lane does not claim:

- final approved Settings copy
- implemented Settings copy changes
- backend account deletion
- cloud deletion
- cloud backup
- cloud sync
- automatic restore
- import support
- archive support
- full-app backup
- deletion of exported files
- deletion of OS backups
- deletion of cloud-folder copies
- deletion of shared/uploaded files
- guaranteed recovery
- privacy policy readiness
- store disclosure readiness
- launch readiness
- legal review completion

It also does not claim source, route, navigation, reducer, action, storage, deletion, export/import, restore, archive, backend, cloud, sync, README/public-doc, privacy, store, disclosure, or test changes.

## Validation

Required validation:

```bash
git diff --check
```

Focused text checks:

```bash
rg -n "Delete local data|Delete Account|deleteAccount|DeleteAccount|Export To CSV|ExportToCSV|CSV|xlsx|exported copy|backup|restore|import|archive|settings_control_copy_alignment_plan_recorded" docs/architecture/settings-control-copy-alignment-plan.md
```

Final status check:

```bash
git status --short --untracked-files=all
```

Scope validation:

- Confirm exactly one new file is created: `docs/architecture/settings-control-copy-alignment-plan.md`.
- Confirm no existing files are modified.
- Confirm the required heading order is present.
- Confirm the required exact scope sentence is present.
- Confirm the artifact inventories current Settings/account/profile/delete/export wording.
- Confirm visible user-facing copy, screen/route labels, internal component/function identifiers, mismatch candidates, and owner-approved future copy are distinguished.
- Confirm `Delete local data` is treated as preferred wording.
- Confirm visible `Delete Account` is treated as a mismatch candidate unless backend account deletion exists.
- Confirm `DeleteAccount` and `deleteAccount()` are treated as internal identifiers only.
- Confirm `Export To CSV` / `CSV` wording is treated as a mismatch candidate because live export writes `.xlsx`.
- Confirm export output is treated as an exported copy, not a full backup or restore/import support.
- Confirm proposed replacement copy candidates are non-binding and owner-approval-required.
- Confirm the artifact ends with the sentinel below.

settings_control_copy_alignment_plan_recorded
