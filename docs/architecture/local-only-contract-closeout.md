# Phase 1 Local-Only Contract Closeout

## Purpose / Scope

This artifact is a docs-only closeout addendum for the Phase 1 local-only profile, export, and deletion contract.

- This is a closeout note, not a new behavior lane.
- It does not reopen app-lock, backend identity, or broader settings architecture questions.
- It records the current working-branch evidence for user-facing terminology, delete-local-data truthfulness, export wording, and dormant legacy auth residue.
- It treats the current working branch as the branch of record.

## Closeout Clarifications

### Export terminology split

The current live export wording is intentionally split:

- Settings section label: `Export data`
- Settings row label: `Export journal data`
- Export detail heading: `Export Journal Data`

That split is intentional because the current verified live export surface is journal-only and writes Excel workbook files (`.xlsx`), not a broader all-data export.

### Destructive-action wording

- `Delete local data` is the only user-facing destructive action exposed in the live Phase 1 settings surface.
- `reset` remains an internal/post-delete outcome only: after local deletion succeeds, the app returns the user to `CompleteProfile`.
- The current delete contract is device-local only. It does not imply server-side deletion, cloud revocation, or account closure.

## Evidence Surfaces Reviewed

Scoped live surfaces reviewed for this closeout:

- current top-level product/trust docs:
  - `README.md`
  - `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md`
  - `docs/release/RELEASE_NOTES_1.0.3-rc.2.md`
  - `docs/release/public-repository-visibility-2026-03-29.md`
- current live settings/profile/export/delete surfaces:
  - `src/navigation/SettingsNavigation.js`
  - `src/screens/setting/pages/Setting/Setting.js`
  - `src/screens/setting/components/Setting.js`
  - `src/screens/setting/pages/MyProfile/MyProfile.js`
  - `src/screens/setting/components/My Profile/MyProfile.js`
  - `src/screens/setting/pages/MyProfile/MyVitals.js`
  - `src/screens/setting/components/My Profile/MyVitals.js`
  - `src/screens/setting/pages/MyProfile/DeleteAccount.js`
  - `src/screens/setting/components/My Profile/DeleteAccount.js`
  - `src/screens/setting/pages/Export To CSV/ExportToCSV.js`
  - `src/screens/setting/components/Export To CSV/ExportToCSV.js`
- current onboarding/profile presentation surfaces:
  - `src/resources/strings.js`
  - `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
  - `src/screens/dashboard/components/Details.js`

Additional non-live residue surfaces reviewed only to confirm dormancy:

- `src/screens/setting/pages/MyProfile/MyAccount.js`
- `src/screens/setting/pages/MyProfile/MyEmail.js`
- `src/screens/setting/pages/MyProfile/MyPassword.js`
- `src/screens/setting/components/My Profile/MyAccount.js`
- `src/screens/setting/components/My Profile/MyEmail.js`
- `src/screens/setting/components/My Profile/MyPassword.js`
- `src/screens/setting/components/index.js`
- `src/screens/setting/pages/MyProfile/index.js`

## Verification Proof

### User-facing copy sweep

A scoped user-facing copy review across the live surfaces above found:

- no remaining user-facing `login` or `logout` wording
- no remaining user-facing `delete account` wording
- no remaining user-facing `password reset` or `forgot password` wording
- no remaining user-facing email/password/reset/logout entry points in the live settings surface

Important review note:

- Raw text search across the scoped files still finds internal implementation identifiers such as `DeleteAccount` and `DeleteAccountWrapper`. Those are internal symbol names, not user-facing product language, and are allowed by the Phase 1 contract.
- The remaining non-product `account` wording in scoped docs is contributor security guidance in `README.md` (`service account private keys`), which is not app UI or product copy.

### Live settings/navigation proof

The registered live settings stack now includes only:

- profile surfaces
- export surface
- delete-local-data surface
- legal/help surfaces

It does not register `MyAccount`, `MyEmail`, or `MyPassword`, and the current settings/profile list data does not navigate to those routes.

### Export behavior proof

Current verified export behavior:

- the settings parent label is `Export data`
- the user-selectable settings action is `Export journal data`
- the destination heading is `Export Journal Data`
- the implementation exports selected journal entry types only
- the export output is an Excel workbook (`.xlsx`)

### Targeted verification

Focused verification command used for this closeout:

`yarn test --runInBand __tests__/accountFlows.test.js __tests__/navigationSmokeFlows.test.js __tests__/navigationSmokeNavigators.test.js __tests__/completeProfileNicknameBoundary.test.js`

Verification result on the working branch:

- `4` suites passed
- `32` tests passed

Those tests directly confirm:

- nickname-optional onboarding progression
- removal of logout exposure from the live settings surface
- exposure of the export and delete-local-data settings entries
- narrowed settings navigator registration
- post-delete return to `CompleteProfile`

## Residual Residue Status

Legacy `MyAccount`, `MyEmail`, and `MyPassword` files remain on disk only as unreachable implementation residue.

Current status:

- they are not exported from the live settings page/component barrels
- they are not registered in `SettingsNavigation`
- they are not reachable from the current settings/profile list data
- they are preserved only for minimal-diff implementation continuity

Disposition for this residue:

- treat them as deprecated and unreachable in Phase 1
- do not treat their presence on disk as evidence of a live account/auth product surface
- open only a tiny follow-on cleanup lane if physical file removal is desired

## Assumptions / Boundaries

- Internal symbol names such as `DeleteAccount` and legacy route constants may remain temporarily where they are not user-facing.
- Historical archived docs, prior release artifacts, audit records, and tests may still mention legacy account/auth terminology. They are outside the live-surface Phase 1 closeout contract.
- This closeout confirms wording truthfulness and live-surface reachability only. It does not authorize additional cleanup work beyond what the current branch already implements.
