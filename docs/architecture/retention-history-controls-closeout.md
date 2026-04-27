# Retention and History Controls Closeout

## Status and Scope

This is an internal closeout artifact only.

This closeout closes the `1.2.3.4 Retention and history controls` sequence by verifying alignment across prior architecture artifacts, focused regression tests, README/public docs, and current behavior evidence.

This document is an internal retention and history controls closeout only. It records alignment evidence without approving or changing behavior, copy, privacy, store, export/import, restore, archive, deletion, backend, cloud, sync, release, legal, reducer, action, route, navigation, or storage behavior.

This artifact does not approve behavior, Settings copy, confirmation copy, README or public-doc edits, privacy language, store language, export/import behavior, restore behavior, archive behavior, deletion behavior, backend/cloud/sync behavior, release claims, disclosure claims, legal readiness, launch readiness, reducer changes, action changes, route changes, navigation changes, or storage changes.

No source code, tests, README/public docs, Settings copy, privacy policy, store/disclosure language, storage behavior, deletion behavior, export/import behavior, restore behavior, archive behavior, backend/cloud/sync behavior, or release documentation is changed by this lane.

## Source of Truth

Live code and focused tests win over older docs.

Architecture artifacts record current-state evidence and approved language rules. They do not create behavior, copy, storage, export/import, restore, archive, backend/cloud/sync, privacy, store, release, or legal approval by themselves.

README and public docs are aligned current-behavior guidance. They are not legal privacy policy readiness, store disclosure readiness, or launch-readiness approval.

Absence claims in this closeout mean "no repo-observed path found" in the inspected evidence set. They do not prove runtime impossibility, platform impossibility, forensic deletion, or future product behavior.

Remaining mismatch candidates are routed forward and preserved as follow-on work. They are not silently fixed or reclassified in this closeout.

## Closeout Evidence Set

| Evidence | Required status |
| --- | --- |
| `delete-reset-archive-semantics-decision.md` | Vocabulary approved. |
| `retention-and-history-control-surfaces.md` | Present-state inventory recorded. |
| `history-archive-delete-language-rules.md` | Language rules recorded. |
| `profile-auth-onboarding-retention-truth-check.md` | Profile/auth/onboarding truth checked. |
| `journal-history-export-retention-truth-check.md` | Journal/export truth checked. |
| `domain-history-retention-matrix.md` | Domain matrix recorded. |
| `settings-control-copy-alignment-plan.md` | Settings copy alignment planned only. |
| `__tests__/accountFlows.test.js` | Clear-path regression tests added. |
| `README.md` and `docs/public/*` | Public docs aligned to verified current behavior. |

Implementation-time closeout finding: the required evidence files were present in the scoped evidence set. This closeout adds no replacement evidence and does not widen the lane if a future worktree later moves or edits any prerequisite file.

## Vocabulary Closeout

The approved vocabulary baseline is recorded in `docs/architecture/delete-reset-archive-semantics-decision.md`, whose status is owner-approved semantic baseline. Closeout marker shorthand: `retention_history_semantics_approved`.

`Delete local data` is the preferred public and user-facing phrase for clearing Brunch Body app-managed local data on this device.

`deleteAccount()` remains internal implementation evidence only. It may be cited to identify the current action behind the local clear path, but it does not define approved user-facing product language.

Visible `Delete Account`, internal `DeleteAccount`, and current internal `deleteAccount()` naming remain mismatch candidates unless a future verified lane introduces real backend account deletion behavior and owner-approved copy.

`reset` is restricted. It may be used only for a specific verified reset control or internal reducer/action evidence, such as `RESET_APP`, and must not be used as a broad synonym for Delete local data.

`archive` is not current behavior. It must not be used as current-state Settings, public-doc, privacy, store, support, or release language.

`exported copy` is the preferred phrase for files created outside the app-managed storage lifecycle after export.

`backup` is restricted. It must not imply a full-app backup, recovery guarantee, cloud backup, or restore-capable backup unless that behavior is implemented, tested, verified, and separately disclosed.

`restore`, `import`, `cloud backup`, `sync`, and backend account deletion are not current supported claims in this closeout.

## Retention Surface Closeout

The closeout recognizes app-managed local data as the scoped local data that Brunch Body stores and manages on this device.

The closeout recognizes persisted Redux state through Redux Persist and AsyncStorage, including the app slices identified by the surface inventory.

The closeout recognizes direct AsyncStorage keys, including profile/auth/onboarding and domain compatibility keys inventoried by the prior lanes.

The closeout recognizes compatibility read seams as current evidence only. Compatibility reads are not overclaimed as canonical ownership, new storage contracts, migration approval, or user-facing history categories.

The closeout recognizes MMKV sidecar/reference data, including bundled plan storage and hydration sentinels.

The closeout recognizes bundled/reference data as app-provided starter/reference content, not retained user history.

The closeout recognizes user-managed exported copies after export. Exported workbook files are outside app-managed storage after creation.

The closeout recognizes no repo-observed current import, restore, archive, backend account deletion, cloud backup, cloud sync, or backend/cloud/sync behavior in the scoped evidence set.

## Profile, Auth, and Onboarding Closeout

`user_profile` is local app-managed data.

Onboarding draft keys were truth-checked by `docs/architecture/profile-auth-onboarding-retention-truth-check.md` and the related code evidence.

`local_password` and `local_password_reset_requested_at` were truth-checked as sensitive local keys/sentinels. They remain local behavior evidence, not backend credential or cloud account claims.

The bootstrap profile dependency was truth-checked. Current profile bootstrap evidence remains local/device-scoped.

`logout`, `CLEAR_USER`, `RESET_APP`, and Delete local data/current internal `deleteAccount()` are not collapsed into one behavior:

- `logout()` is a scoped local auth/profile/onboarding/password-related clear path plus `CLEAR_USER`.
- `CLEAR_USER` resets the auth reducer state without being a storage wipe by itself.
- `RESET_APP` resets in-memory Redux slice state without being a storage wipe by itself.
- Delete local data/current internal `deleteAccount()` dispatches `RESET_APP`, clears app-managed local stores, clears MMKV, and rehydrates bundled plans.

No backend account deletion, cloud deletion, cloud account lifecycle, or cloud storage deletion claim is introduced by this closeout.

## Journal and Export Closeout

Journal history is domain-qualified. It is not generalized into one universal app-wide history bucket.

`traits` is treated conservatively as a direct/compatibility read seam where verified. It is not promoted into a separate user-facing retention guarantee or canonical ownership claim.

Current export creates `.xlsx` workbook exported copies for selected journal data.

Exported files are user-managed after export. The user is responsible for where exported copies are saved, copied, shared, moved, uploaded, backed up, retained, restored, or deleted outside app-managed storage.

Delete local data does not imply deletion of exported files or other external copies.

No current journal import, restore, archive, cloud backup, cloud sync, backend deletion, or backend account deletion claim is introduced by this closeout.

## Domain History Closeout

Nutrition, calendar, exercise, recreation, and todo surfaces were matrixed in `docs/architecture/domain-history-retention-matrix.md`.

Domain history is not treated as one universal app-wide bucket. History language remains domain-qualified and behavior-specific.

Compatibility read seams are not overclaimed as canonical ownership, current migration approval, or new storage contracts.

Bundled/reference recreation plans are not user-retained history.

MMKV bundled plan re-seed after Delete local data is app-provided starter/reference content appearing again. It is not user-history restore, automatic restore, or guaranteed recovery.

## Settings Copy Planning Closeout

Settings copy was inventoried and planned in `docs/architecture/settings-control-copy-alignment-plan.md`. It was not changed by that lane and is not changed by this closeout.

Candidate replacement copy remains non-binding.

Owner approval is still required before any Settings copy implementation.

Future implementation lanes should remain minimal-diff and list exact files before changing copy, routes, components, confirmation text, tests, README/public docs, or related behavior.

Internal identifiers such as `DeleteAccount`, `deleteAccount()`, `ExportToCSV`, and `Export To CSV` are implementation residue or mismatch evidence only. They are not approved public/user-facing claims.

## Regression Test Closeout

Focused regression tests exist in `__tests__/accountFlows.test.js` for current clear-path behavior. Closeout marker: `retention_clear_paths_tests_added`.

The test evidence covers scoped `logout()`.

The test evidence covers `CLEAR_USER`.

The test evidence covers `RESET_APP` in-memory reset behavior.

The test evidence covers Delete local data/current internal `deleteAccount()` clear sequence.

The test evidence covers the exported-copy deletion boundary.

These tests do not prove legal, privacy, store, disclosure, launch, or production-release readiness.

These tests do not imply backend deletion, cloud deletion, cloud backup, cloud sync, import support, restore support, archive support, or full-app backup support.

These tests lock current observable behavior only.

## Public Docs and README Closeout

README and public docs use current-behavior-only wording for the retention and history surfaces verified in the prior lanes.

README and public docs use `Delete local data` where local clearing is discussed.

README and public docs distinguish app-managed local data from exported/external files.

README and public docs describe exported journal files as user-managed `.xlsx` workbook copies where applicable.

README and public docs do not claim current app-managed import, restore, archive, cloud backup, sync, backend account deletion, or full-app backup behavior.

Remaining risky terms such as reset, archive, backup, restore, import, sync, cloud, account deletion, CSV, full backup, and guaranteed recovery are safe only when used as limitations, non-claims, contextual evidence, or explicitly conditional future notes.

README and public docs alignment is not privacy policy readiness, store disclosure readiness, legal review completion, launch readiness, or production release approval.

## Alignment Truth Table

| Area | Required closeout status |
| --- | --- |
| Vocabulary | verified |
| Retention inventory | verified |
| Profile/auth/onboarding | verified |
| Journal/export | verified |
| Domain history | verified |
| Settings copy plan | verified_planning_only |
| Clear-path tests | verified |
| README/public docs | verified |
| Privacy/store readiness | not_claimed |
| Backend/cloud/sync | not_claimed |
| Import/restore/archive | not_claimed |
| Exported external file deletion | not_claimed |
| Launch readiness | not_claimed |

## Remaining Mismatch Candidates

The visible/internal `Delete Account`, `DeleteAccount`, and `deleteAccount()` naming residue remains unresolved. It is not fixed in this closeout.

The `ExportToCSV` / `Export To CSV` route, component, and path residue remains unresolved if still present. It is not fixed in this closeout.

Settings copy candidates requiring owner approval remain unresolved. They are planned only.

Direct compatibility-read storage seams needing future cleanup remain unresolved. They are evidence of current behavior, not cleanup approval.

Any future import, restore, or backup model remains outside current behavior.

Any future store/privacy disclosure alignment still requires separate release-readiness work.

## Follow-On Lane Routing

`1.2.3.4.7.1 Settings Delete Local Data Copy Alignment` owns future owner-approved Delete local data Settings copy implementation.

`1.2.3.4.7.2 Export Screen Copy Alignment` owns future export screen wording alignment, including `.xlsx` exported-copy wording and any visible CSV mismatch handling.

`1.2.3.4.7.3 Account/Profile Settings Wording Alignment` owns future account/profile wording alignment, including local profile/account terminology and any visible account-deletion mismatch handling.

Later release/store/privacy disclosure alignment belongs under the appropriate release-readiness lane, not this closeout.

Future backup/import/restore work belongs under `1.4`, not this closeout.

Future storage seam cleanup belongs under a separate cleanup/stabilization lane, not this closeout.

## Non-Claims

This closeout does not claim backend account deletion.

This closeout does not claim cloud deletion.

This closeout does not claim cloud backup.

This closeout does not claim cloud sync.

This closeout does not claim automatic restore.

This closeout does not claim import support.

This closeout does not claim archive support.

This closeout does not claim full-app backup.

This closeout does not claim guaranteed recovery.

This closeout does not claim deletion of exported files.

This closeout does not claim deletion of OS backups.

This closeout does not claim deletion of cloud-folder copies.

This closeout does not claim deletion of shared/uploaded files.

This closeout does not claim privacy policy readiness.

This closeout does not claim store disclosure readiness.

This closeout does not claim legal review completion.

This closeout does not claim launch readiness.

This closeout does not claim production release approval.

## Validation

Required whitespace validation:

```sh
git diff --check
```

Required focused evidence check:

```sh
rg -n "retention_history_semantics_approved|retention_surface_inventory_recorded|history_language_rules_recorded|profile_auth_onboarding_retention_truth_checked|journal_history_export_retention_truth_checked|domain_history_retention_matrix_recorded|settings_control_copy_alignment_plan_recorded|retention_clear_paths_tests_added|retention_history_controls_closeout_recorded" docs/architecture __tests__/accountFlows.test.js README.md docs/public
```

Required focused public-doc risk review:

```sh
rg -n "Delete Account|delete account|reset|archive|backup|restore|import|sync|cloud|full backup|guaranteed recovery|account deletion|CSV|xlsx|exported copy|Delete local data" README.md docs/public docs/architecture/retention-history-controls-closeout.md
```

Required focused test run:

```sh
npm test -- --runInBand __tests__/accountFlows.test.js --no-cache
```

Required final status:

```sh
git status --short --untracked-files=all
```

Validation expectations: `git diff --check` passes; focused evidence search finds the prerequisite and closeout markers; public-doc risk review hits are contextually safe because they appear as limitations, non-claims, current-behavior guidance, mismatch candidates, or conditional future notes; the focused `accountFlows` test passes; final worktree status shows this new closeout artifact plus any explicitly reported pre-existing changes if present.

retention_history_controls_closeout_recorded
