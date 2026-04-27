# History / Archive / Delete Language Rules

## Status and Scope

This is an internal architecture language guide only. It translates the approved retention, history, archive, deletion, reset, export, backup, restore, import, and account-deletion vocabulary into reusable language rules for later lanes.

This document defines internal language rules only. It does not change app behavior, Settings copy, README/public docs, privacy policy, store language, disclosures, storage behavior, export/import behavior, restore behavior, archive behavior, or deletion behavior.

This artifact does not approve new deletion, reset, export, import, restore, archive, backend, cloud, sync, account-deletion, or external-copy behavior. It gives future lanes wording rules, not implementation permission.

Future Settings, confirmation-dialog, README, public-docs, privacy-adjacent, release-note, store/disclosure-adjacent, architecture, and help-doc lanes must still verify current behavior before making user-facing or disclosure-adjacent claims.

## Source of Truth

`1.2.3.4.1 Retention and History Semantics Decision` approved the vocabulary contract for delete, reset, archive, history, retained, exported-copy, backup, restore, import, cloud, account-deletion, and local-data language.

`1.2.3.4.2 Present-State Retention Surface Inventory` inventoried present-state retention and control surfaces across app-managed local data, sidecar/reference local data, compatibility read seams, exported copies, logout, `RESET_APP`, current internal `deleteAccount()`, import/restore absence, and archive absence.

Live code wins over older docs. If docs or copy conflict with live code, later lanes must record the mismatch and use live code for present-state claims.

Absence claims mean "no repo-observed path found," not runtime impossibility. This lane may cite current mismatch candidates, including visible "Delete Account" wording and internal `deleteAccount()` naming, but it must not fix them.

Current evidence to preserve:

- Brunch Body remains local-first and privacy-forward unless a later lane explicitly reopens that posture.
- Current Settings and delete confirmation copy use "Delete local data" for the broad local clear path.
- My Account still contains visible "Delete Account" wording, which is a mismatch candidate unless tied to real backend account deletion.
- Internal names such as `DeleteAccount`, `deleteAccount()`, and `RESET_APP` are implementation evidence only and must not define user-facing vocabulary.
- Current export writes selected journal data to user-managed `.xlsx` workbook files. No repo-observed import or restore complement exists.
- Current Delete local data behavior does not delete exported files, OS backups, cloud-folder copies, shared files, uploaded files, or other external copies.

## Approved Vocabulary Baseline

| Term | Rule |
| --- | --- |
| Delete local data | Preferred user-facing phrase for clearing app-managed local data on this device. |
| `deleteAccount()` | Internal implementation identifier only; must not override user-facing vocabulary. |
| Delete Account | Current mismatch candidate unless tied to real backend account deletion. |
| reset | Restricted; use only for a specific verified control. |
| archive | Not current behavior; forbidden in current-state user-facing copy. |
| history | Must be domain-qualified. |
| retained | Must be scoped to local/app-managed/device context. |
| exported copy | Preferred phrase for files outside app-managed lifecycle after export. |
| backup | Restricted; allowed only with explicit limitation. |
| restore | Restricted; do not imply current support unless implemented and verified. |
| import | Restricted; do not imply current support unless implemented and verified. |
| cloud backup | Forbidden current-state claim unless implemented and verified. |
| account deletion | Forbidden current-state claim unless backend accounts exist. |
| external copies / OS backups / shared files / cloud-folder copies | Outside the app-managed local-data lifecycle; do not claim Delete local data removes them. |

## Language Rule Model

| Category | Meaning | How later lanes should use it |
| --- | --- | --- |
| allowed | Safe for present-state use when the wording stays within the verified local/device/export boundary. | Use as default wording in future Settings, confirmation, README, public-doc, release-note, and architecture lanes after confirming it still matches live behavior. |
| restricted | Potentially safe only with a required qualifier or a verified specific control. | Add the qualifier every time, or avoid the term when the qualifier would make the copy awkward. |
| forbidden current-state | Not supported by current repo-observed behavior and unsafe as a current user-facing claim. | Do not use in current-state Settings, confirmations, README, public docs, release notes, privacy/store/disclosure-adjacent text, or help docs. |
| internal identifier only | A code, route, component, action, reducer, or constant name that can be cited as evidence but cannot define visible wording. | Cite in architecture evidence only; translate to approved user-facing vocabulary before writing copy. |
| future-roadmap only | A possible future feature or behavior that is not current behavior. | Label clearly as future, planned, proposed, or not implemented in internal architecture docs; keep out of current-state public docs. |
| mismatch candidate | Current wording, naming, or structure that may conflict with approved vocabulary or live behavior. | Record for follow-on lanes; do not silently treat it as approved wording and do not fix it in this docs-only artifact. |

## Allowed Language

Allowed wording should stay narrow, current-state, and device-scoped:

- "Delete local data"
- "Clear app-managed local data on this device"
- "Exported copy"
- "Journal history"
- "Nutrition entries"
- "Exercise entries"
- "Calendar entries"
- "Stored locally on this device"
- "User-managed after export"
- "Brunch Body app-managed local data"
- "Files saved outside Brunch Body app-managed storage"
- "Selected journal entries exported as an Excel workbook"
- "Starter content included with Brunch Body may appear again after deletion"

Use these phrases when they match verified behavior. Do not broaden them into cloud, account, restore, archive, full-backup, or all-copy deletion claims.

## Restricted Language

| Term | Required qualifier |
| --- | --- |
| reset | Name the specific verified control, such as password reset or internal `RESET_APP`; do not use as a broad synonym for Delete local data. |
| backup | State that the file is user-managed after export and that restore is not guaranteed unless a restore flow is implemented and verified. |
| restore | State "not currently supported" unless an implemented and tested restore flow exists. |
| import | State "not currently supported" unless an implemented and tested import flow exists. |
| retained | Scope to app-managed local data, this device, and current app behavior; do not imply indefinite retention or cloud retention. |
| history | Qualify by domain, such as journal history, nutrition history, exercise history, calendar history, recreation history, or todo history. |
| account | Use only for local profile/account UI context unless backend account behavior is implemented and verified; do not imply server-side account lifecycle. |
| delete | Name the object being deleted and the boundary, such as app-managed local data on this device; do not imply external copies are removed. |

Restricted terms are not forbidden in every context, but they are unsafe without the required qualifier.

## Forbidden Current-State Language

Do not use these as current-state user-facing, public-doc, release-note, help-doc, privacy/store/disclosure-adjacent, or Settings claims:

- "Delete account" if implying backend account deletion
- "Archive your data"
- "Restore your backup"
- "Import your previous data"
- "Cloud backup"
- "Sync across devices"
- "Delete all copies"
- "Remove exported files"
- "Delete files you shared"
- "Delete OS backups"
- "Delete cloud-folder copies"
- "Guaranteed recovery"
- "Full backup"
- "Automatic restore"
- "Account recovery backup"
- "Delete uploaded files"
- "Delete device-transfer copies"
- "Delete files saved outside Brunch Body"

These phrases may appear in internal architecture docs only when explicitly marked unsafe, future, not implemented, or not current behavior.

## Context-Specific Examples

| Context | Safe wording | Unsafe wording | Why unsafe | Follow-on lane |
| --- | --- | --- | --- | --- |
| Settings row label | Delete local data | Delete Account | Implies backend account deletion unless a real backend account lifecycle exists. | `1.2.3.4.7 Settings Control Copy Alignment Plan` |
| Delete confirmation body | This clears Brunch Body app-managed local data stored by the app on this device. Exported copies and files saved outside the app are not deleted. | This deletes your account and all copies of your data. | Overclaims backend account deletion and deletion of external copies. | `1.2.3.4.7 Settings Control Copy Alignment Plan` |
| Export screen | Journal data is exported as an Excel workbook. Once exported, the file is user-managed. | Export a full backup you can restore later. | Current export is not full-app backup and has no repo-observed restore/import complement. | `1.2.3.4.5 Journal History and Exported File Retention Truth Check` |
| README local-first note | Brunch Body stores app-managed data locally on this device unless future backend behavior is explicitly introduced. | Your data is always fully backed up and recoverable. | Claims backup and guaranteed recovery that current behavior does not provide. | `1.2.3.4.9 Public Docs / README Retention Alignment` |
| Public privacy/data doc | Delete local data clears app-managed local data on this device and does not delete exported copies or files saved outside the app. | Delete local data removes exported files, shared files, and cloud copies. | Claims control over external/user-managed storage outside the app lifecycle. | `1.2.3.4.9 Public Docs / README Retention Alignment` |
| Architecture doc | `deleteAccount()` is the current internal action name for the Delete local data flow. | `deleteAccount()` proves the app supports account deletion. | Internal identifier does not establish user-facing or backend behavior. | `1.2.3.4.4 Profile, Auth, and Onboarding Retention Truth Check` |
| Release note | Clarified local-data deletion language for app-managed data on this device. | Added archive, restore, and full backup support. | Claims new behavior not implemented or verified in this lane. | `1.2.3.4.10 Retention and History Controls Closeout` |
| Store/disclosure-adjacent note | Verify live behavior, Settings copy, public docs, and disclosure wording before making retention or deletion claims. | The app provides cloud backup and sync across devices. | Cloud backup/sync is not repo-observed current behavior and would need disclosure review. | `1.2.3.4.9 Public Docs / README Retention Alignment` |

## Settings and Confirmation Guidance

Future Settings copy lanes should prefer "Delete local data."

Internal code names like `deleteAccount()` may be cited as evidence but should not dictate visible wording. Current visible "Delete Account" wording is a mismatch candidate only unless a future verified lane implements real backend account deletion.

Delete confirmation copy must specify app-managed local data on this device. It must not imply exported files, OS backups, cloud-folder copies, shared files, uploaded files, copied files, moved files, or other external/user-managed copies are deleted.

If bundled starter content is re-seeded, future copy/docs should not describe that content as user-retained history. Use wording such as "starter content included with Brunch Body may appear again" rather than "restored user history" or "retained user data."

Do not use broad "reset" wording for the current Delete local data flow unless a future lane verifies the exact control and approves the label.

## Public Docs and README Guidance

Public docs should use current-behavior-only language.

Public docs should distinguish local app-managed storage from exported copies. Exported files are user-managed after export and are outside the app-managed local-data lifecycle.

Public docs should not describe export as full backup, import, restore, automatic recovery, account recovery, cloud backup, or sync.

README wording should not overgeneralize domain history. Use domain-qualified language such as journal history, nutrition entries, exercise entries, calendar entries, recreation entries, or todo entries when current behavior supports the claim.

Any future behavior must be labeled as not current if included in internal architecture docs, and should not be placed in current-state public docs.

## Disclosure-Adjacent Guidance

This artifact is not a privacy policy.

This artifact is not store disclosure language.

Future privacy/store/disclosure work must verify app behavior, docs, and user-facing copy before making claims.

Do not use this artifact to claim launch readiness.

Do not broaden deletion/backup/restore claims beyond repo-observed behavior.

Disclosure-adjacent copy must not turn architecture guidance into legal, store, privacy, medical, clinical, HIPAA, App Store, Google Play, or launch approval.

## Exported Copy and Backup Boundary

Exported files are exported copies, not app-managed local data after export.

Delete local data does not delete exported copies. It also does not delete copied files, moved files, shared files, uploaded files, OS backups, device-transfer copies, cloud-folder copies, or files stored outside Brunch Body app-managed storage.

"Backup" is restricted and must include the limitation that exported files are user-managed and restore is not guaranteed unless implemented and verified.

Current export should not be described as full-app backup, automatic backup, cloud backup, or restore-capable backup.

Current export should be described as selected journal data exported to an Excel workbook when referring to live behavior. Do not imply it exports every local domain unless a future lane implements and verifies that behavior.

## History and Archive Boundary

"History" must be domain-qualified.

Do not treat journal, nutrition, exercise, calendar, recreation, and todo data as one universal history surface.

Do not describe compatibility read seams as user-facing histories unless verified. Keys or seams such as traits, meals, themes, exercises, routines, workouts, and todos may be storage evidence, but they are not proof of standalone user-facing histories.

"Archive" is not current behavior.

Future-roadmap archive language must be explicit that it is future/not implemented.

Do not treat deletion, clearing, hiding, derived repeated-theme state, starter-content rehydration, repaired reads, or compatibility reads as archive behavior without a separate verified archive lane.

## Review Checklist

Use these as binary checks before approving future wording:

- [ ] Does the wording use "Delete local data" instead of "Delete account" for local clearing?
- [ ] Does the wording avoid broad "reset" unless a specific verified control exists?
- [ ] Does the wording avoid "archive" for current behavior?
- [ ] Does the wording describe exported files as "exported copies"?
- [ ] Does any "backup" wording include the required limitation?
- [ ] Does the wording avoid current import/restore claims?
- [ ] Does the wording avoid cloud/sync claims?
- [ ] Does the wording avoid claiming deletion of external copies?
- [ ] Is "history" domain-qualified?
- [ ] Are future behaviors labeled future/not implemented?
- [ ] Does account wording avoid backend account-deletion implications unless backend behavior exists?
- [ ] Does delete wording name the data boundary and avoid "all copies" claims?
- [ ] Does the wording avoid treating starter content as retained user history?
- [ ] Does architecture evidence keep internal identifiers separate from approved visible copy?

## Follow-On Lane Notes

- `1.2.3.4.4 Profile, Auth, and Onboarding Retention Truth Check`: verify profile, auth, local account UI, onboarding drafts, local password, logout, and visible "Delete Account" mismatch candidates before any copy or behavior alignment.
- `1.2.3.4.5 Journal History and Exported File Retention Truth Check`: verify journal history, selected-entry export, workbook contents, exported-copy sensitivity, and no repo-observed import/restore complement.
- `1.2.3.4.6 Domain History Retention Matrix`: inventory journal, nutrition, exercise, calendar, recreation, and todo retention separately before using broad history claims.
- `1.2.3.4.7 Settings Control Copy Alignment Plan`: plan visible Settings and confirmation copy alignment around Delete local data, logout, reset-password, export, and My Account mismatch candidates.
- `1.2.3.4.8 Retention Regression Tests for Existing Clear Paths`: add tests only in a later test lane for current logout, `RESET_APP`, Delete local data, exported-copy boundaries, and bundled starter-content re-seed behavior.
- `1.2.3.4.9 Public Docs / README Retention Alignment`: align README, help docs, public privacy/data docs, release notes, and disclosure-adjacent text to current behavior only.
- `1.2.3.4.10 Retention and History Controls Closeout`: verify copy, docs, tests, disclosures, and architecture records remain truth-aligned after follow-on lanes.

## Non-Claims

This lane does not claim:

- backend account deletion
- cloud deletion
- cloud backup
- sync
- automatic restore
- import support
- archive support
- deletion of exported files
- deletion of OS backups
- deletion of cloud-folder copies
- deletion of shared/uploaded files
- deletion of copied or moved external files
- full-app backup
- guaranteed recovery
- account recovery
- launch readiness
- privacy policy readiness
- store disclosure readiness
- legal review completion
- App Store review readiness
- Google Play Data safety readiness
- implementation approval for any future behavior

## Validation

Required validation:

```sh
git diff --check
```

Focused text check:

```sh
rg -n "Delete local data|exported copy|Delete Account|deleteAccount|archive|backup|restore|import|history_language_rules_recorded" docs/architecture/history-archive-delete-language-rules.md
```

Scope validation:

- Confirm exactly one new file is created: `docs/architecture/history-archive-delete-language-rules.md`.
- Confirm no existing files are modified.
- Confirm the required heading order is present.
- Confirm the required exact scope sentence is present.
- Confirm the artifact defines `allowed`, `restricted`, `forbidden current-state`, `internal identifier only`, `future-roadmap only`, and `mismatch candidate`.
- Confirm the context table covers Settings, confirmations, export, README, public docs, architecture docs, release notes, and disclosure-adjacent notes.
- Confirm the artifact treats visible "Delete Account" as a mismatch candidate only.
- Confirm the artifact treats exported files as user-managed exported copies after export.
- Confirm the artifact does not approve behavior, copy, README/public docs, privacy/store/disclosure language, tests, deletion, export/import, restore, or archive changes.

history_language_rules_recorded
