# Phase 1 Profile-Only Account Model

## Status and Scope

This is the implementation record for `1.2.5.1 Account Model Clarification`.

Status: owner-approved Phase 1 profile-only model.

This lane records the product decision, updates reachable in-app copy that conflicted with the strict account-language rule, and classifies current account/auth residue. It does not introduce authentication, backend sync, password recovery, account deletion, cross-device continuity, storage behavior changes, delete/reset/export/backup behavior changes, privacy policy changes, store disclosure changes, or public-doc changes.

What changed for users: the in-app Privacy & Data explanation now says the app does not automatically sync data to a Brunch Body cloud service instead of a Brunch Body cloud account.

What users do not experience: no new account, login, logout, password, sync, backup, restore, import, or deletion behavior.

## Decision

Brunch Body Phase 1 has no user-facing account model.

The canonical user-facing model is a device-local `Profile` used for nickname, vitals, personalization, calculations, and display.

`Delete local data` is the canonical destructive action for the current app-managed local-data clear path. `Delete account` is not approved for current Phase 1 reachable UX.

Authenticated accounts, cloud sync, account recovery, server-side deletion, and cross-device continuity are out of scope for Phase 1. Any future authenticated account or sync model requires a separate decision lane before implementation or public disclosure work.

## Vocabulary Contract

| Term or pattern | Phase 1 treatment |
| --- | --- |
| `Profile` | Approved for reachable UX. Use for local nickname, vitals, personalization, calculations, and display. |
| `Nickname` | Approved for reachable UX. |
| `Saved on this device` / `Saved on this device only` | Approved for reachable UX when describing local profile data. |
| `Delete local data` | Approved and preferred for the current destructive local-data control. |
| `app-managed local data` | Approved for scoped deletion explanations. |
| `Account`, `Login`, `Logout`, `Password`, `Delete account`, `Reset password` | Forbidden in reachable Phase 1 UX unless a later approved lane adds real matching behavior. |
| `auth`, `deleteAccount`, `DeleteAccount`, account/password route names | Internal implementation residue only. These names do not define product behavior or approved copy. |

Negative public-doc statements may explain that Brunch Body does not currently provide backend accounts, cloud sync, or account deletion, but those statements must not imply current account functionality. Reachable in-app Phase 1 surfaces should avoid account/auth vocabulary entirely.

## Current Evidence

Read-only grounding before this lane found:

- `node scripts/check-local-only-mode.js` passed with no Firebase/AWS imports or `api/user/` calls found in `src/`.
- `src/navigation/SettingsNavigation.js` registers Settings, Profile, MyVitals, Delete local data, export, legal/privacy, and abbreviations routes. It does not register `MY_ACCOUNT`, `MY_EMAIL`, or `MY_PASSWORD`.
- `src/screens/setting/pages/Setting/Setting.js` exposes reachable Settings rows for `Profile`, `Export journal data`, `Delete local data`, and `Privacy & Data`, not account/password controls.
- `src/screens/setting/components/My Profile/MyProfile.js` and `src/screens/setting/components/My Profile/MyVitals.js` use `Profile`, `Profile details`, nickname/vitals wording, and device-local helper copy.
- `src/screens/setting/components/My Profile/DeleteAccount.js` is internally named `DeleteAccount`, but its visible title, body, checkbox, and button use `Delete local data` and app-managed local-data limits.
- `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js` now avoids `account` in reachable copy while preserving the no-current-cloud-sync claim.

## Residue Classification

| Residue class | Current examples | Required treatment |
| --- | --- | --- |
| Reachable UX | Settings `Profile`, `Privacy & Data`, `Export journal data`, `Delete local data`; Profile/Profile details; onboarding local profile notice | Must follow the strict profile-only vocabulary contract. |
| Dormant route/source residue | `src/screens/setting/pages/MyProfile/MyAccount.js`, `src/screens/setting/components/My Profile/MyAccount.js`, `MyEmail`, `MyPassword`, and route constants `MY_ACCOUNT`, `MY_EMAIL`, `MY_PASSWORD` | Classify only. Do not surface or clean up without a separate narrow lane. |
| Internal implementation residue | `src/redux/actions/auth.js`, `logout`, `changePassword`, `resetPassword`, `deleteAccount`, `src/redux/reducer/auth.js`, `auth` state | Treat as local implementation evidence only. Internal names do not approve user-facing account/auth copy. |
| Test-only guardrail language | `__tests__/accountFlows.test.js`, `__tests__/privacyAndDataScreen.test.js`, `__tests__/profileVitalsTransparencyCopy.test.js`, `__tests__/completeProfileOnboardingTransparencyCopy.test.js`, `__tests__/exportTransparencyCopy.test.js` | Allowed when asserting absence of forbidden terms or documenting current local behavior. |
| Public-doc absence language | README and public docs that say Brunch Body does not provide backend accounts/cloud sync/account deletion | Allowed only as negative, current-state explanatory language. Must not imply account functionality. |
| Future/gated references | Architecture docs discussing future backend/sync/account possibilities | Must remain internal, explicitly future/gated/out of scope, and non-committal. |

## Follow-On Rules

Any future cleanup must be scoped after classification:

- Audit-only lanes may map reachable versus dormant account/auth references.
- Copy-only lanes may change reachable wording without changing behavior.
- Source-cleanup lanes may remove or rename dormant residue only after owner approval and tests.
- Public-doc or store-disclosure lanes must verify shipped behavior before changing claims.
- Future account/sync work must reopen product, privacy, support, deletion, migration, security, and disclosure decisions before implementation.

## Acceptance Notes

This lane is complete when:

- Reachable Settings, onboarding, Profile, Privacy & Data, export, and delete-local-data surfaces avoid forbidden account/auth vocabulary.
- Internal account/auth names are documented as residue rather than treated as product truth.
- Public docs remain allowed to describe missing backend/account/cloud behavior only as negative current-state context.
- The local-first guardrail remains passing.
- No account/auth/backend/sync behavior is added.

## Non-Claims

This record does not approve:

- accounts or authentication
- backend profile storage
- cloud sync
- password recovery
- server-side account deletion
- account recovery
- cross-device continuity
- import, restore, or full backup
- privacy policy or store disclosure answers
- legal review, launch readiness, or release approval

## Validation

Required validation for this lane:

```bash
node scripts/check-local-only-mode.js
yarn test __tests__/privacyAndDataScreen.test.js __tests__/accountFlows.test.js __tests__/exportTransparencyCopy.test.js __tests__/profileVitalsTransparencyCopy.test.js __tests__/completeProfileOnboardingTransparencyCopy.test.js --runInBand
git diff --check
```

phase_1_profile_only_account_model_recorded
