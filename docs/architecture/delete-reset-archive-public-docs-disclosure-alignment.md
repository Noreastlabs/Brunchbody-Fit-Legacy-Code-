# Delete / Reset / Archive Public Docs and Disclosure Alignment

## Status and Scope

This is an internal documentation-alignment note for Brunch Body Delete local data, reset/password boundaries, exported-file responsibility, bundled starter content, and Archive status.

It is not a legal privacy policy. It is not a store submission. It does not change app behavior. It records documentation alignment only.

This lane changes no app source, tests, storage behavior, export/import behavior, navigation, privacy posture, platform files, package files, store-submission materials, legal policy, or runtime behavior.

## Evidence Inputs

This note is based on the completed Delete / Reset / Archive evidence chain:

- `docs/architecture/delete-reset-archive-semantics-decision.md`
- `docs/architecture/delete-reset-archive-current-state-audit.md`
- `docs/architecture/archive-control-discovery-and-deferral.md`
- `docs/architecture/domain-delete-archive-split-plan.md`
- Current in-app Delete local data copy in `src/screens/setting/components/My Profile/DeleteAccount.js`
- Current Delete local data execution and reset/password boundary tests in `__tests__/accountFlows.test.js`
- Current export responsibility copy tests in `__tests__/exportTransparencyCopy.test.js`

## Public Docs Checked

The public documentation surfaces checked for delete, reset, archive, exported-file, starter-content, cloud, backup, and account-deletion wording were:

- `README.md`
- `docs/public/brunch-body-privacy-and-data.md`
- `docs/public/brunch-body-user-guide.md`
- `docs/public/brunch-body-non-coder-onboarding.md`

No current public doc claim was found that presents Archive as a global Brunch Body user control.

## Alignment Changes Made

Public wording was tightened so `Delete local data` is described as clearing Brunch Body app-local data stored by the app on this device.

The public docs now preserve or add the boundaries that Delete local data does not delete exported, copied, shared, moved, backed up, uploaded, or externally saved files; is not a password reset, cloud deletion, or account deletion everywhere; and may allow bundled starter content to appear again after deletion.

No public Archive claim was added. No app behavior, tests, or in-app copy changed.

## Current Public Wording Rules

Use `Delete local data` for the current destructive local-data control.

Describe the scope as Brunch Body app-local data stored by the app on this device.

State that exported files become user-managed outside Brunch Body app-managed storage after they are saved, copied, shared, moved, backed up, uploaded, or stored elsewhere.

State that Delete local data is not a password reset, cloud deletion, or account deletion everywhere.

State that starter content included with Brunch Body may appear again after deletion.

Do not describe domain delete, remove, clear, hidden, deleted, or restore-like behavior as Archive unless a future domain-specific lane approves that language.

## Disclosure Review Notes

Future privacy, support, platform disclosure, and store review must verify final shipped app behavior before submission or publication.

Disclosure-facing language should remain local-first and device-scoped unless a future build adds and verifies backend accounts, sync, cloud deletion, password-reset reachability, import/restore, exported-file deletion, or Archive behavior.

This note is internal only and does not replace final legal, privacy, platform, or store-submission review.

## Deferred Claims

The following claims remain deferred unless future scoped lanes implement, verify, and approve them:

- Cloud deletion or account deletion everywhere.
- Password reset as part of Delete local data.
- Deletion of exported files after they leave Brunch Body app-managed storage.
- Automatic backup, cloud backup, import, restore, undo, or recovery.
- Global Archive or domain Archive behavior.
- Store data-safety, App Privacy, or other platform-disclosure answers.

## Non-Approvals

This note does not approve:

- app behavior changes
- source code changes
- test changes
- in-app copy changes
- storage behavior changes
- export/import behavior changes
- navigation changes
- reducer or action changes
- delete/reset behavior changes
- archive implementation
- restore or undo implementation
- password-reset implementation
- backend, cloud, or sync behavior
- formal legal privacy policy finalization
- App Store, Google Play, Data Safety, or App Privacy submissions

## Validation

Validation for this docs-only lane:

- `git diff --check`
- `rg -n "Delete local data|delete local data|Reset app|reset app|Reset password|password reset|Delete account|delete account|Archive|archive|exported files|starter content|cloud deletion|backups|backup|erase everything|delete all data" README.md docs/public docs/architecture/delete-reset-archive-public-docs-disclosure-alignment.md`
- `rg -n "Delete local data|exported files|starter content|password reset|cloud deletion|Archive|archive" "src/screens/setting/components/My Profile/DeleteAccount.js" "src/screens/setting/pages/MyProfile/DeleteAccount.js" __tests__/accountFlows.test.js`
- `git status --short --untracked-files=all`
