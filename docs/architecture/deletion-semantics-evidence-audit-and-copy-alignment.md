# Deletion Semantics Evidence Audit and Copy Alignment

## Status and Scope

Lane: `1.2.5.2.x Deletion Semantics Evidence Audit and Copy Alignment`

Status: audit/classification artifact only.

This lane uses the owner-approved Phase 1 deletion semantic contract as the
audit baseline: `Delete local data` means Brunch Body clears app-managed local
data on this device only.

Current repo behavior remains the evidence source for what the app actually
does today. This artifact changes no app behavior, user-facing copy, tests,
storage behavior, navigation, route names, internal identifiers, public docs,
privacy language, or disclosure-prep language.

## Audit Baseline

Approved baseline:

- Use `Delete local data` for the current destructive local-data action.
- Treat `Delete local data` as app-managed local data on this device only.
- Do not imply account deletion, backend deletion, cloud deletion, archive,
  broad reset, exported-file deletion, backup deletion, OS-backup deletion, or
  deletion from anything outside Brunch Body app-managed storage.
- Treat exported files as user-managed copies once saved outside the app.
- Treat internal names such as `DeleteAccount`, `deleteAccount`, `RESET_APP`,
  route names, reducer names, and test labels as implementation residue unless
  they are reachable user-facing copy.

Reference baseline sources:

- `docs/architecture/delete-reset-archive-semantics-decision.md:21-33`
- `docs/architecture/delete-reset-archive-semantics-decision.md:65-93`
- `docs/architecture/transparency-copy-contract.md:48-63`
- `docs/architecture/transparency-copy-contract.md:122-158`

## Verified Behavior

Current source and tests show the delete-local-data path as:

- The reachable page action is internally named `deleteAccount`, but it is the
  action behind the user-facing `Delete local data` flow
  (`src/screens/setting/pages/MyProfile/DeleteAccount.js:41-48`,
  `src/redux/actions/auth.js:132-139`).
- The action dispatches `RESET_APP`, then clears AsyncStorage through
  `AsyncStorage.clear()`, clears the MMKV sidecar through `storage.clearAll()`,
  and calls `hydrateWorkoutPlans()`
  (`src/redux/actions/auth.js:40-43`, `src/redux/actions/auth.js:132-139`).
- `RESET_APP` resets reducer state by rebuilding the combined reducer from
  `undefined`; it is not a storage clear by itself
  (`src/redux/store/store.js:25-31`).
- Bundled starter workout-plan data is rehydrated when MMKV has not been
  initialized or lacks usable bundled plans
  (`src/storage/mmkv/hydration.js:34-48`).
- After successful confirmation, the page resets root navigation to
  `CompleteProfile`
  (`src/screens/setting/pages/MyProfile/DeleteAccount.js:55-61`).
- Focused tests verify the reducer reset boundary, AsyncStorage/MMKV clear
  sequence, bundled-plan rehydration call, no `RNFS.unlink` or
  `ScopedStorage.deleteFile` calls for exported copies, confirmation
  requirement, success copy, and post-delete `CompleteProfile` reset
  (`__tests__/accountFlows.test.js:279-369`,
  `__tests__/accountFlows.test.js:540-628`).

Classification: aligned with the approved local-device, app-managed-data
semantic contract based on current source and focused tests. No behavior fix is
recommended by this audit.

## Reachable UX Copy Findings

Settings entry:

- Settings exposes `Delete local data` as both the section and row label, while
  routing internally to `SETTINGS_ROUTES.DELETE_ACCOUNT`
  (`src/screens/setting/pages/Setting/Setting.js:117-126`).
- Settings also exposes `Export journal data` and `Privacy & Data` as separate
  surfaces (`src/screens/setting/pages/Setting/Setting.js:104-145`).

Delete confirmation and success:

- The delete screen title, explanatory copy, confirmation text, and button all
  use `Delete local data` and app-managed local-data wording
  (`src/screens/setting/components/My Profile/DeleteAccount.js:31-55`,
  `src/screens/setting/components/My Profile/DeleteAccount.js:89-101`).
- The delete screen explicitly says exported, copied, shared, moved, backed-up,
  uploaded, OS-backup/cloud-folder, or otherwise external copies are not
  deleted (`src/screens/setting/components/My Profile/DeleteAccount.js:44-51`).
- The success modal repeats the same boundary and says starter content may
  appear again after deletion
  (`src/screens/setting/pages/MyProfile/DeleteAccount.js:45-48`).

Privacy & Data and export:

- `Privacy & Data` describes local-first storage, no Brunch Body cloud sync, no
  automatic Brunch Body cloud backup, exported-file responsibility, and Delete
  local data limits
  (`src/screens/setting/components/PrivacyAndData/PrivacyAndData.js:6-13`).
- Export copy describes selected journal export to `.xlsx`, user-managed
  exported copies, no app-managed import/restore, and files saved outside the
  app not being removed by Delete local data
  (`src/screens/setting/components/Export To CSV/ExportToCSV.js:39-52`).
- Export behavior writes selected journal data as an Excel workbook and uses
  `.xlsx` output naming when a direct path is available
  (`src/screens/setting/pages/Export To CSV/ExportToCSV.js:104-145`).

Classification: reachable UX copy is aligned with the approved terminology and
does not expose account deletion, cloud deletion, broad reset, archive, full
backup, import/restore, or externally saved file deletion claims. The current
copy uses broad outside-app-storage wording that covers screenshots in
principle, but it does not consistently name screenshots/screenshotted copies
as an explicit boundary.

## Public Docs and Disclosure-Prep Findings

README:

- The README says Settings exposes `Delete local data`, that it clears
  app-local data on this device, does not delete exported/copied/shared/moved/
  backed-up/uploaded/externally saved files, is not password reset/cloud
  deletion/backend account deletion, and starter content may appear again
  (`README.md:9-14`).

Public docs:

- The user guide distinguishes exported journal files from in-app data, says
  the delete action does not appear to delete exported/copied/shared/moved/
  backed-up/uploaded/external files, and says Delete local data is not password
  reset, cloud deletion, or backend account deletion
  (`docs/public/brunch-body-user-guide.md:42-52`,
  `docs/public/brunch-body-user-guide.md:78-94`).
- The privacy/data guide describes local app/device storage, selected journal
  `.xlsx` export outside normal app-managed storage, no backend account or
  automatic cloud sync, and no deletion from exported/copied/shared/moved/
  backed-up/uploaded/external files, OS backups, device-transfer tools, or
  outside app-managed storage
  (`docs/public/brunch-body-privacy-and-data.md:32-40`,
  `docs/public/brunch-body-privacy-and-data.md:58-76`).
- The non-coder onboarding guide says exported files live outside app-managed
  storage after export, OS backups/device-transfer tools are outside the guide's
  promises, and Delete local data is not account deletion, password reset, or
  exported-file/cloud deletion
  (`docs/public/brunch-body-non-coder-onboarding.md:79-87`,
  `docs/public/brunch-body-non-coder-onboarding.md:117-157`).

Disclosure prep:

- `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md` records local device storage,
  selected `.xlsx` export, no developer-server collection, and Delete local data
  not removing user-exported copies outside app-controlled storage
  (`docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md:16-31`,
  `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md:37-41`).

Classification: public docs and disclosure-prep language are broadly aligned
with the semantic contract. The strongest public docs already distinguish OS
backup/device-transfer uncertainty. The disclosure-prep note is intentionally
shorter than the full boundary list and does not explicitly name screenshots or
every copied/shared/moved/cloud-folder scenario.

## Tests and Verification

Focused verification command:

```sh
npm test -- --runInBand __tests__/accountFlows.test.js __tests__/privacyAndDataScreen.test.js __tests__/exportTransparencyCopy.test.js __tests__/navigationSmokeFlows.test.js
```

Result: passed, 4 test suites and 39 tests.

Notes:

- `__tests__/accountFlows.test.js` covers delete-local-data behavior, copy,
  confirmation, external-file non-deletion, and post-delete route reset.
- `__tests__/privacyAndDataScreen.test.js` covers Privacy & Data copy and
  absence of forbidden account/cloud/backup/restore wording.
- `__tests__/exportTransparencyCopy.test.js` covers exported-copy boundary copy
  and `.xlsx` export success messaging.
- `__tests__/navigationSmokeFlows.test.js` covers current Settings route
  handoffs for Profile, export, Delete local data, and Privacy & Data.
- The focused run emitted an existing React key warning inside a navigation
  smoke path unrelated to deletion semantics; it did not fail the test run.

## Internal and Source-Only Residue

Classify these as internal/source-only residue, not current user-facing claims:

- `DeleteAccount`, `DeleteAccountWrapper`, `SETTINGS_ROUTES.DELETE_ACCOUNT`,
  and route value `DeleteAccount`.
- Redux action name `deleteAccount`.
- Redux action constant `RESET_APP`.
- File paths containing `DeleteAccount` or `Export To CSV` / `ExportToCSV`.
- Test labels and mocks that reference internal route/component/action names.
- Dormant or non-visible account/password route constants and files, where not
  currently exposed through reachable Settings copy.

Classification: no in-lane rename is recommended. Renaming these identifiers
would be a separate refactor/compatibility lane and is not required for the
current deletion semantic contract as long as reachable copy remains aligned.

## Mismatches and Gaps

No behavior mismatch was found between the current source/tests and the
approved Phase 1 deletion contract.

No reachable UX copy mismatch was found for account deletion, cloud deletion,
broad reset, archive, import/restore, full backup, or exported-file deletion
claims.

Minor copy/disclosure specificity gap:

- The approved discussion boundary includes screenshots/screenshotted copies as
  outside app deletion control.
- Current delete copy and docs generally cover screenshots through broad
  outside-app-storage language such as "otherwise kept outside Brunch Body
  app-managed storage" or "externally saved files," but screenshot-specific
  deletion wording is not consistently explicit.
- `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md` also uses concise exported-copy
  boundary language rather than the full list of exported, copied, shared,
  moved, screenshotted, uploaded, OS-backed-up, cloud-folder, and third-party
  backup examples.

This is a wording precision gap, not a behavior gap.

## Recommended Next Lane

Recommended next lane type: copy-only alignment.

Scope the follow-up narrowly:

- Decide whether screenshot-specific wording must be explicit in reachable
  delete/Privacy & Data copy and public/disclosure-prep docs, or whether the
  current broad outside-app-storage phrasing is sufficient.
- If explicit wording is required, update only the smallest necessary copy/docs
  surfaces and keep behavior, routes, storage, tests, and internal identifiers
  unchanged unless a separate lane scopes them.
- Do not finalize store/privacy disclosure claims from intent alone; keep any
  disclosure wording tied to verified release behavior.

No behavior-fix lane, test-only lane, or internal-rename lane is recommended by
this audit.
