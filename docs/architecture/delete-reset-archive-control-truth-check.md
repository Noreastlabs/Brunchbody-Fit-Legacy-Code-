# Delete / Reset / Archive Control Truth Check

## Status and Scope

This is an internal verification and closeout guidance artifact for the Brunch Body Delete / Reset / Archive control sequence.

This artifact records a final truth check only. It does not create user-facing delete, reset, archive, backup, privacy, legal, support, store, cloud, sync, account, password-reset, restore, export, import, or platform-disclosure claims.

No behavior, source code, tests, in-app copy, README content, public docs, privacy language, store disclosures, storage behavior, export/import behavior, delete/reset behavior, archive behavior, restore behavior, password-reset behavior, cloud/sync behavior, or navigation changed in this lane.

The closeout question is whether the completed `1.2.3.3` evidence chain is aligned enough to treat the Delete / Reset / Archive control cluster as complete for Phase 1 release-truth purposes.

## Evidence Inputs

Completed `1.2.3.3` lane inputs:

- `1.2.3.3.0 Delete / Reset / Archive Semantics Decision Gate`: `docs/architecture/delete-reset-archive-semantics-decision.md`
- `1.2.3.3.1 Current-State Audit of Delete, Reset, and Archive Surfaces`: `docs/architecture/delete-reset-archive-current-state-audit.md`
- `1.2.3.3.2 Delete Local Data Copy and Confirmation Clarity`: `src/screens/setting/components/My Profile/DeleteAccount.js`; `src/screens/setting/pages/MyProfile/DeleteAccount.js`; `__tests__/accountFlows.test.js`
- `1.2.3.3.3 Delete Local Data Execution Boundary Tests`: `__tests__/accountFlows.test.js`; `src/redux/actions/auth.js`; `src/redux/store/store.js`; `src/storage/mmkv/hydration.js`
- `1.2.3.3.4 Reset Password vs. Reset App Language Separation`: `__tests__/accountFlows.test.js`; `__tests__/navigationSmokeNavigators.test.js`; `src/navigation/SettingsNavigation.js`; `src/redux/actions/auth.js`
- `1.2.3.3.5 Archive Control Discovery and Deferral Rule`: `docs/architecture/archive-control-discovery-and-deferral.md`
- `1.2.3.3.6 Domain-Level Delete / Archive Split Plan`: `docs/architecture/domain-delete-archive-split-plan.md`
- `1.2.3.3.7 Public Docs and Disclosure Alignment for Delete / Reset / Archive`: `docs/architecture/delete-reset-archive-public-docs-disclosure-alignment.md`; `README.md`; `docs/public/brunch-body-privacy-and-data.md`; `docs/public/brunch-body-user-guide.md`; `docs/public/brunch-body-non-coder-onboarding.md`

Additional release-truth guardrail context:

- `docs/architecture/Brunch Body Project Scope.md`
- `docs/architecture/Brunch Body Project Template.md`
- `__tests__/mmkvHydration.test.js`
- `__tests__/exportTransparencyCopy.test.js`

## Truth Check Method

The check compared current behavior, visible in-app labels, test expectations, README/public docs, internal architecture notes, and disclosure-adjacent language against the canonical delete/reset/archive boundaries from the decision record and current-state audit.

The required truth table follows.

| Truth / claim | Required status | Evidence |
| --- | --- | --- |
| Delete local data clears app-local Brunch Body data on this device | verified | `src/screens/setting/components/My Profile/DeleteAccount.js`; `src/screens/setting/pages/MyProfile/DeleteAccount.js`; `src/redux/actions/auth.js`; `__tests__/accountFlows.test.js`; `README.md`; `docs/public/brunch-body-privacy-and-data.md`; `docs/public/brunch-body-user-guide.md` |
| Delete local data does not delete exported external files | verified | `src/screens/setting/components/My Profile/DeleteAccount.js`; `src/screens/setting/pages/MyProfile/DeleteAccount.js`; `__tests__/accountFlows.test.js`; `__tests__/exportTransparencyCopy.test.js`; `README.md`; `docs/public/brunch-body-privacy-and-data.md`; `docs/public/brunch-body-user-guide.md`; `docs/public/brunch-body-non-coder-onboarding.md` |
| Delete local data is not password reset | verified | `src/screens/setting/components/My Profile/DeleteAccount.js`; `src/screens/setting/pages/MyProfile/DeleteAccount.js`; `src/redux/actions/auth.js`; `__tests__/accountFlows.test.js`; `docs/architecture/delete-reset-archive-current-state-audit.md`; `README.md`; `docs/public/brunch-body-user-guide.md` |
| Delete local data is not cloud deletion | verified | `src/screens/setting/components/My Profile/DeleteAccount.js`; `src/screens/setting/pages/MyProfile/DeleteAccount.js`; `__tests__/accountFlows.test.js`; `README.md`; `docs/public/brunch-body-privacy-and-data.md`; `docs/public/brunch-body-user-guide.md` |
| Delete local data is not account deletion everywhere | verified | `README.md`; `docs/public/brunch-body-privacy-and-data.md`; `docs/public/brunch-body-user-guide.md`; `docs/public/brunch-body-non-coder-onboarding.md`; `docs/architecture/delete-reset-archive-semantics-decision.md`; `docs/architecture/delete-reset-archive-public-docs-disclosure-alignment.md` |
| Bundled starter content may appear again after deletion | verified | `src/screens/setting/components/My Profile/DeleteAccount.js`; `src/screens/setting/pages/MyProfile/DeleteAccount.js`; `src/redux/actions/auth.js`; `src/storage/mmkv/hydration.js`; `__tests__/accountFlows.test.js`; `__tests__/mmkvHydration.test.js`; `README.md`; `docs/public/brunch-body-privacy-and-data.md`; `docs/public/brunch-body-user-guide.md`; `docs/public/brunch-body-non-coder-onboarding.md` |
| Reset app is not user-facing Delete local data copy | verified | `src/screens/setting/components/My Profile/DeleteAccount.js`; `src/screens/setting/pages/Setting/Setting.js`; `__tests__/accountFlows.test.js`; `docs/architecture/delete-reset-archive-semantics-decision.md`; `docs/architecture/delete-reset-archive-current-state-audit.md` |
| RESET_APP remains internal-only | verified | `src/redux/actions/auth.js`; `src/redux/store/store.js`; `__tests__/accountFlows.test.js`; `docs/architecture/delete-reset-archive-current-state-audit.md`; `docs/architecture/domain-delete-archive-split-plan.md` |
| Global Archive is not a current user-facing control | verified | `docs/architecture/archive-control-discovery-and-deferral.md`; `docs/architecture/domain-delete-archive-split-plan.md`; `docs/architecture/delete-reset-archive-current-state-audit.md`; `__tests__/accountFlows.test.js` |
| Domain delete/remove/clear behavior is not public Archive | verified | `docs/architecture/archive-control-discovery-and-deferral.md`; `docs/architecture/domain-delete-archive-split-plan.md`; `docs/architecture/delete-reset-archive-current-state-audit.md`; `docs/architecture/delete-reset-archive-public-docs-disclosure-alignment.md` |
| Public docs and internal disclosure note are not legal/store finalization | verified | `docs/architecture/delete-reset-archive-public-docs-disclosure-alignment.md`; `docs/public/brunch-body-privacy-and-data.md`; `docs/public/brunch-body-user-guide.md`; `docs/public/brunch-body-non-coder-onboarding.md`; `docs/architecture/Brunch Body Project Template.md` |

## Behavior and Implementation Check

Verified. The current Settings surface exposes `Delete local data` through `src/screens/setting/pages/Setting/Setting.js`, routing internally to the legacy `DeleteAccount` route. The delete page calls the internal `deleteAccount()` action only after confirmation.

The implementation boundary remains aligned: `src/redux/actions/auth.js` dispatches `RESET_APP`, clears AsyncStorage, clears MMKV, and then calls `hydrateWorkoutPlans()`. `src/redux/store/store.js` treats `RESET_APP` as a Redux state reset, while `src/storage/mmkv/hydration.js` handles bundled starter-plan rehydration.

No evidence showed that Delete local data deletes external exported files, performs cloud deletion, deletes an account everywhere, resets a password, or changes backend/sync behavior.

## In-App Copy Check

Verified. The visible delete screen copy in `src/screens/setting/components/My Profile/DeleteAccount.js` uses `Delete local data`, describes Brunch Body app-local data stored by the app on this device, identifies exported/copied/shared/moved/backed-up/uploaded/externally saved files as not deleted, says the action is not a password reset or cloud deletion, and notes starter content may appear again.

The success and confirmation messages in `src/screens/setting/pages/MyProfile/DeleteAccount.js` preserve the same device-local, exported-file, password-reset, cloud-deletion, and starter-content boundaries.

`Reset app` is not present as user-facing delete-local-data copy, and the current Settings visible surface does not expose reset-password/account routes as Phase 1 Settings controls.

## Test Coverage Check

Verified. Focused tests cover the trust-sensitive boundaries:

- `__tests__/accountFlows.test.js` covers delete confirmation gating, delete success copy, `RESET_APP` dispatch, AsyncStorage clearing, MMKV clearing, bundled starter-plan hydration, reset-password separation, Settings visible copy, and absence of `Reset app`, `Reset password`, `Delete account`, broad erase/delete-all wording, and archive language from the delete-local-data copy.
- `__tests__/navigationSmokeNavigators.test.js` verifies the current Settings stack route set and confirms MyPassword, MyAccount, and MyEmail are not registered in the current Settings navigator.
- `__tests__/mmkvHydration.test.js` verifies bundled starter content reseeding and preservation behavior.
- `__tests__/exportTransparencyCopy.test.js` verifies selected journal `.xlsx` export wording and states that files saved outside the app are not removed by Delete local data.

## Public Docs Check

Verified. `README.md`, `docs/public/brunch-body-privacy-and-data.md`, `docs/public/brunch-body-user-guide.md`, and `docs/public/brunch-body-non-coder-onboarding.md` align with the current Delete local data boundary.

The public docs describe Delete local data as app-local/device-scoped, exclude exported or externally saved files, avoid password-reset/cloud-deletion/account-deletion-everywhere claims, and note that bundled starter content may appear again after deletion.

The public docs keep export/import/backup language cautious and do not describe Delete local data as full backup management, import/restore, external-file deletion, cloud deletion, or legal/store finalization.

## Disclosure-Adjacent Check

Verified. The disclosure-adjacent note in `docs/architecture/delete-reset-archive-public-docs-disclosure-alignment.md` is internal only. It does not approve formal legal privacy policy language, App Store submission language, Google Play Data Safety language, App Privacy labels, store review answers, or future cloud/account/sync claims.

The current public docs similarly state they are not legal privacy policies, legal advice, app store disclosures, or final release/store materials. The project template release-truth guardrail requires app behavior, docs, privacy language, backup/deletion language, and store/disclosure language to remain consistent before launch-ready claims.

## Archive and Domain-Control Check

Verified. `docs/architecture/archive-control-discovery-and-deferral.md` records that global Archive is not a current approved Phase 1 user control. It also records journal and calendar archive-like signals as future domain-specific questions, not product-wide Archive semantics.

`docs/architecture/domain-delete-archive-split-plan.md` keeps Settings Delete local data separate from Archive and preserves future lane seeds for journal soft-delete/export visibility and calendar theme hide/clear/recovery semantics.

Domain delete/remove/clear behavior remains domain-specific behavior and is not presented in public docs or disclosure-adjacent notes as a global Archive control.

## Remaining Gaps

No blocking mismatch or unknown was found in this final truth check.

The existing future lane seeds remain deferred, non-blocking follow-ons:

- `1.2.3.3.6.1 Journal Soft-Delete and Export Visibility Definition`
- `1.2.3.3.6.2 Calendar Theme Hide / Clear / Recovery Semantics`
- `1.2.3.3.6.3 Domain Delete/Remove Inventory Closeout`
- `1.2.3.3.6.4 Settings Delete/Reset Boundary Closeout`

These future lanes do not block closing `1.2.3.3` because current evidence does not promote journal/calendar archive-like behavior into a public global Archive claim.

## Final Classification

The closeout result is recorded as the final line of this artifact.

## Non-Approvals

This artifact does not approve:

- app behavior changes
- source code changes
- test changes
- in-app copy changes
- README changes
- public docs changes
- privacy language changes
- store disclosure changes
- legal privacy policy finalization
- App Store, Google Play, Data Safety, or App Privacy submissions
- storage behavior changes
- export/import behavior changes
- delete/reset behavior changes
- archive behavior changes
- restore or undo implementation
- password-reset implementation
- backend, cloud, or sync behavior
- navigation changes
- new user-facing delete/reset/archive claims

## Validation

Validation was run after creating this artifact.

- `git diff --check`: passed with no output.
- `yarn test __tests__/accountFlows.test.js __tests__/navigationSmokeNavigators.test.js __tests__/mmkvHydration.test.js __tests__/exportTransparencyCopy.test.js`: passed. Jest reported 4 passed suites, 31 passed tests, 0 snapshots.
- `rg -n "Delete local data|delete local data|Reset app|reset app|RESET_APP|Reset password|password reset|Delete account|delete account|Archive|archive|exported files|starter content|cloud deletion|account deletion everywhere|erase everything|delete all data" README.md docs/public docs/architecture src/screens/setting __tests__/accountFlows.test.js __tests__/navigationSmokeNavigators.test.js __tests__/mmkvHydration.test.js __tests__/exportTransparencyCopy.test.js`: passed. The search returned expected evidence across README, public docs, architecture notes, Settings code, and focused tests, including Delete local data copy, exported-file limits, `RESET_APP`, reset/password separation, starter-content language, and Archive deferral evidence.
- `rg -n "delete_reset_archive_truth_check_passed|delete_reset_archive_truth_check_passed_with_follow_on|delete_reset_archive_truth_check_blocked|verified|mismatch|unknown" docs/architecture/delete-reset-archive-control-truth-check.md`: passed. The search found the verified truth-table rows, the no-blocking-gap statement, the validation command text, and the final closeout classification.
- `git status --short --untracked-files=all`: reported only `?? docs/architecture/delete-reset-archive-control-truth-check.md`.

delete_reset_archive_truth_check_passed
