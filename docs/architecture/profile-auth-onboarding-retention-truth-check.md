# Profile, Auth, and Onboarding Retention Truth Check
## Status and Scope

This is an internal architecture truth-check only.

This document verifies current profile/auth/onboarding retention behavior for local profile, persisted auth state, onboarding draft, local password, and password-reset sentinel surfaces.

This document is a profile, auth, and onboarding retention truth check only. It records current behavior without approving behavior, copy, privacy, store, export/import, restore, archive, deletion, logout, onboarding, profile, password, or backend-account changes.

This document does not change app behavior, Settings copy, README/public docs, privacy policy, store language, or disclosures.

This document does not approve new deletion/reset/export/import/restore/archive behavior.

This document does not approve backend account deletion language.

## Source of Truth

`1.2.3.4.1` approved the retention/history vocabulary in `docs/architecture/delete-reset-archive-semantics-decision.md`.

`1.2.3.4.2` inventoried present-state retention/control surfaces in `docs/architecture/retention-and-history-control-surfaces.md`.

`1.2.3.4.3` defined language rules in `docs/architecture/history-archive-delete-language-rules.md`.

Live code wins over older docs. If docs and code disagree, this truth check records the mismatch and uses live code for current behavior.

Absence claims mean "no repo-observed path found," not runtime impossibility.

Inferred rows are explicitly labeled `inferred`.

## Vocabulary Baseline

| Term | Required treatment |
| --- | --- |
| Delete local data | Preferred user-facing phrase for clearing app-managed local data on this device. |
| `deleteAccount()` | Internal implementation identifier only; may be cited as evidence. |
| Delete Account | Mismatch candidate unless backed by real backend account deletion. |
| logout | Scoped auth/session/profile/onboarding/password-related clear only if verified. |
| `RESET_APP` | In-memory Redux reset seam unless paired with storage clearing. |
| retained | Must be scoped to local/app-managed/device context. |
| exported copy | Not applicable to profile/auth/onboarding unless export behavior is verified. |
| backup | Restricted; do not imply profile/auth/onboarding backup or restore. |
| restore/import | Restricted; do not imply current support unless implemented and verified. |
| archive | Not current behavior. |
| account deletion | Forbidden current-state claim unless backend accounts exist. |

## Evidence Inputs

| Evidence input | Contribution |
| --- | --- |
| `docs/architecture/delete-reset-archive-semantics-decision.md` | Vocabulary baseline: Delete local data is preferred; Delete Account/account deletion, reset, archive, backup, restore, import, and cloud claims are restricted or forbidden unless verified. |
| `docs/architecture/retention-and-history-control-surfaces.md` | Present-state inventory for `user_profile`, onboarding draft keys, `local_password`, `local_password_reset_requested_at`, scoped logout, `RESET_APP`, current internal `deleteAccount()`, export boundaries, and import/restore/archive absence. |
| `docs/architecture/history-archive-delete-language-rules.md` | Language rules for internal identifiers, mismatch candidates, exported copies, backup/restore/import restrictions, and current-state non-claims. |
| `docs/architecture/persistence-inventory.md` | Prior persistence register for Redux Persist root, direct AsyncStorage profile/onboarding/password keys, MMKV starter-plan rehydration, exported workbook boundary, and stale `authStorage.js` evidence. |
| `docs/architecture/storage-contract-matrix.md` | Storage contract context for persisted Redux root and direct key overlap; some auth/profile/onboarding supporting references are stale because live code no longer has `authStorage.js`. |
| `docs/architecture/store-and-middleware-review.md` | Store and middleware context for the persisted root, whitelist, and `RESET_APP`; auth helper naming is stale relative to live helper files. |
| `README.md` | Public-facing local-first context and current no-backend/no-cloud-sync posture; README storage wording is contextual, not stronger than live code. |
| `src/bootstrap/AppBootstrap.js` | Bootstrap/profile-loading evidence: runs bundled-plan hydration, calls `hasStoredProfile()`, resolves `Home` when a profile exists and `CompleteProfile` otherwise. |
| `src/root-container/RootContainer.js` | Persisted store mounting evidence: wraps navigation in Redux `Provider` and `PersistGate`. |
| `src/redux/store/store.js` | Persisted store and auth reducer evidence: `auth` is whitelisted in Redux Persist; `RESET_APP` rebuilds in-memory reducer state from `undefined`. |
| `src/redux/actions/auth.js` | Auth action evidence: `loggedIn()`, `profile()`, `changeEmail()`, `changePassword()`, `resetPassword()`, `logout()`, and current internal `deleteAccount()` behavior. |
| `src/redux/reducer/auth.js` | Auth reducer evidence: `SET_USER` stores sanitized profile data in `auth.user` and derives BMI/BMR; `CLEAR_USER` returns initial auth state. |
| `src/redux/actions/profileStorage.js` | Profile storage helper evidence: owns `USER_PROFILE_KEY = 'user_profile'`, read/write/sanitization/repair, and direct key presence check. |
| `src/redux/actions/onboardingStorage.js` | Onboarding storage helper evidence: owns draft keys `name`, `dob`, `height`, `weight`, `gender`; completed-profile cleanup removes only `dob`, `height`, and `gender`. |
| `src/screens/completeProfile/*` | Onboarding read/write evidence: complete-profile flow hydrates draft values, writes draft changes, writes saved profile, and clears completed draft subset after success. |
| `src/screens/setting/pages/MyProfile/*` | Settings/My Profile evidence: profile edits call profile actions, password flows call local auth actions, Delete local data page dispatches internal `deleteAccount()`, and My Account still contains visible `Delete Account` wording. |
| `src/screens/setting/components/My Profile/*` | Settings/My Profile copy evidence: Delete local data surface uses local-data language; My Password component contains local password reset wording; My Account component route support keeps account-named implementation residue visible where reached. |

Minimum evidence classes covered: bootstrap/profile-loading evidence, auth action evidence, auth reducer evidence, profile storage helper evidence, onboarding storage helper evidence, Settings/My Profile delete wording evidence, persisted store evidence, and prior architecture docs evidence.

## Surface Classification Model

Storage category labels:

- `app-managed local data`
- `persisted Redux state`
- `direct AsyncStorage key`
- `sensitive local credential/sentinel`
- `not repo-observed`

Control category labels:

- `scoped logout clear`
- `in-memory reset`
- `full local clear`
- `not exported`
- `no repo-observed restore`
- `no repo-observed backend account deletion`

Evidence category labels:

- `repo-observed`
- `inferred`
- `unknown`

## Profile Retention Surfaces

| Surface | Storage key | Storage engine | Current owner/helper | Current read path | Current write path | Current clear path | Lifecycle trigger | App-managed local data? | Exported? | Logout interaction | `RESET_APP` interaction | Delete local data/current `deleteAccount()` interaction | Evidence status | Mismatch or follow-on notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Saved profile record | `user_profile` | Direct AsyncStorage key | `src/redux/actions/profileStorage.js`; auth actions compose it | `loadStoredProfile()`, `hasStoredProfile()`, `loggedIn()`, `resolveInitialRouteName()` | `saveStoredProfile()` via `profile()` and `changeEmail()` | `logout()` removes it through scoped key removal; profile helper removes malformed/empty/non-object values; full local clear removes it through `AsyncStorage.clear()` | Onboarding/profile completion, profile edit, email update, app bootstrap, local auth checks | yes | no repo-observed export | Removed by scoped logout key set, then `CLEAR_USER` clears Redux auth state | Direct key is not cleared by `RESET_APP` alone; in-memory/persisted `auth.user` is reset when `RESET_APP` is dispatched | Removed by broad `AsyncStorage.clear()` after `RESET_APP` dispatch | repo-observed for key and paths; `inferred` for persisted-root runtime overlap | Current profile ownership overlaps direct `user_profile` and persisted `auth.user`; keep local/device scope. |
| Persisted auth profile projection | Redux Persist root / `auth.user` | Redux Persist backed by AsyncStorage | `src/redux/store/store.js`; `src/redux/reducer/auth.js` | Rehydrated by Redux Persist under `PersistGate`; screens read `state.auth?.user` | `SET_USER` from auth/profile actions | `CLEAR_USER` returns auth slice initial state; `RESET_APP` resets in-memory root reducer; full local clear removes persisted root storage | Any profile/auth reducer mutation and app rehydration | yes | no repo-observed export | `logout()` dispatches `CLEAR_USER`, which affects persisted auth state after Redux Persist writes | In-memory auth slice resets through root reducer | Removed from persisted storage by `AsyncStorage.clear()` in current `deleteAccount()` flow | repo-observed; runtime persisted entry name is `inferred` if described as `persist:root` | Do not treat persisted auth profile projection as a backend account or cloud profile. |
| Profile read/repair/sanitization path | `user_profile` | Direct AsyncStorage key | `profileStorage.js` | `loadStoredProfile()` parses JSON, validates plain object, strips derived `bmi`/`bmr`, removes malformed/empty/non-object profile payloads | `saveStoredProfile()` strips derived fields before writing JSON | Malformed, empty, or invalid values are removed by helper repair; stale derived fields are rewritten without derived fields | App bootstrap, `loggedIn()`, profile/account actions | yes | no | Logout removes the key separately; repair is not logout behavior | No direct storage effect from `RESET_APP` alone | Full local clear removes the key regardless of repair state | repo-observed | Repair/sanitization is storage hygiene, not user-facing deletion, restore, or archive behavior. |
| Backend/cloud profile | not repo-observed | not repo-observed | not repo-observed | no repo-observed path found | no repo-observed path found | no repo-observed path found | none found | no | no | no current interaction | no current interaction | no current interaction | unknown absence claim | Do not claim backend profile deletion, cloud profile deletion, external copy deletion, profile restore, or profile import. |

Profile data is app-managed local data unless live code proves otherwise. Current evidence does not show a backend profile, cloud profile deletion, external copy deletion, profile import, or profile restore path.

## Auth and Password Retention Surfaces

| Surface | Storage key | Storage engine | Current owner/helper | Current read path | Current write path | Current clear path | Lifecycle trigger | App-managed local data? | Exported? | Logout interaction | `RESET_APP` interaction | Delete local data/current `deleteAccount()` interaction | Evidence status | Mismatch or follow-on notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Persisted auth slice | Redux Persist root / `auth` | Redux Persist backed by AsyncStorage | `store.js`; `auth.js`; `authReducer` | Redux Persist rehydration and `state.auth` selectors | `SET_USER` writes `auth.user`; Redux Persist writes whitelisted slice | `CLEAR_USER` returns initial auth state; `RESET_APP` resets all in-memory slices; full local clear removes persisted root | Profile login/restore, profile edits, logout, delete-local-data flow | yes | no repo-observed export | `logout()` dispatches `CLEAR_USER` | `RESET_APP` resets in-memory `auth` state | `deleteAccount()` dispatches `RESET_APP`, then clears AsyncStorage | repo-observed; runtime persisted key naming inferred if stated beyond `root` | Auth slice is local app state, not backend account state. |
| Local password | `local_password` | Direct AsyncStorage key; sensitive local credential | `src/redux/actions/auth.js` | `changePassword()` reads existing local password for validation | `changePassword()` writes the new password | `resetPassword()` removes it; `logout()` removes it through scoped key set; full local clear removes it | Password change, password reset, scoped logout, Delete local data | yes | no | Removed by scoped logout key set | No direct storage effect from `RESET_APP` alone | Removed by `AsyncStorage.clear()` | repo-observed | Sensitive value; do not make legal/security, encryption, password-strength, backend, or cloud deletion claims. |
| Password reset sentinel | `local_password_reset_requested_at` | Direct AsyncStorage key; sensitive local credential/sentinel | `src/redux/actions/auth.js` | No repo-observed read gate found | `resetPassword()` writes an ISO timestamp after local email verification | `changePassword()` removes it; `logout()` removes it; full local clear removes it | Local password reset request, later password change, logout, Delete local data | yes | no | Removed by scoped logout key set | No direct storage effect from `RESET_APP` alone | Removed by `AsyncStorage.clear()` | repo-observed for write/clear; read path unknown | Treat as a sentinel only; do not claim password restore or backend reset. |
| `loggedIn()` profile/session-style behavior | `user_profile` plus `auth.user` | Direct AsyncStorage read plus Redux auth state | `src/redux/actions/auth.js`; `profileStorage.js` | `loggedIn()` calls `loadStoredProfile()` | Dispatches `SET_USER` when stored profile exists | No storage clear; absence returns `goToCompleteProfile` | Startup/splash/profile refresh style checks | yes | no | Logout clears inputs this function depends on | `RESET_APP` clears in-memory auth; direct key remains unless separately cleared | Delete local data clears the direct key and persisted root | repo-observed | This is local profile restore behavior, not backend login or account auth. |
| `CLEAR_USER` action | none by itself | Redux action/reducer state only | `authReducer` | Reducer receives action | `logout()` dispatches it | Returns auth reducer initial state | Scoped logout | in-memory/persisted auth state | no | This is the Redux state part of logout | Separate from `RESET_APP` | Full local clear does not use `CLEAR_USER`; it uses `RESET_APP` | repo-observed | `CLEAR_USER` is narrower than Delete local data and not a storage wipe by itself. |
| Backend account deletion | not repo-observed | not repo-observed | not repo-observed | no repo-observed path found | no repo-observed path found | no repo-observed path found | none found | no | no | no current interaction | no current interaction | no current interaction | unknown absence claim | No backend account deletion claim is approved. |

Current password and sentinel notes are behavior evidence only. This truth check does not make legal/security claims, password-strength claims, encryption claims, backend account claims, or cloud deletion claims.

## Onboarding Draft Retention Surfaces

| Surface | Storage key | Storage engine | Current owner/helper | Current read path | Current write path | Current clear path | Lifecycle trigger | App-managed local data? | Exported? | Logout interaction | `RESET_APP` interaction | Delete local data/current `deleteAccount()` interaction | Evidence status | Mismatch or follow-on notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Name draft | `name` | Direct AsyncStorage key | `src/redux/actions/onboardingStorage.js`; complete-profile flow | `getOnboardingDraftValue('name')` during draft hydration | `setOnboardingDraftValue('name', value)` when name changes | Cleared by full `clearOnboardingDraft()` if called with all keys; scoped logout removes all draft keys; current successful onboarding does not clear `name` | Onboarding step progression | yes | no | Removed by scoped logout key set | No direct storage effect from `RESET_APP` alone | Removed by `AsyncStorage.clear()` | repo-observed | Distinguish draft name from saved profile name in `user_profile`. |
| DOB draft | `dob` | Direct AsyncStorage key | `onboardingStorage.js`; complete-profile flow | `getOnboardingDraftValue('dob')`; parsed during draft hydration | `setOnboardingDraftValue('dob', value)` after DOB confirmation | `clearCompletedOnboardingDraft()` removes `dob`; scoped logout removes all draft keys; full local clear removes it | Onboarding DOB confirmation and profile completion | yes | no | Removed by scoped logout key set | No direct storage effect from `RESET_APP` alone | Removed by `AsyncStorage.clear()` | repo-observed | Saved profile DOB is later written to `user_profile`; this draft key is incomplete-onboarding local data. |
| Height draft | `height` | Direct AsyncStorage key | `onboardingStorage.js`; complete-profile flow | `getOnboardingDraftValue('height')`; parsed during draft hydration | `setOnboardingDraftValue('height', value)` after height confirmation | `clearCompletedOnboardingDraft()` removes `height`; scoped logout removes all draft keys; full local clear removes it | Onboarding height confirmation and profile completion | yes | no | Removed by scoped logout key set | No direct storage effect from `RESET_APP` alone | Removed by `AsyncStorage.clear()` | repo-observed | Saved profile height is later written to `user_profile`; this draft key is not profile history. |
| Weight draft | `weight` | Direct AsyncStorage key | `onboardingStorage.js`; complete-profile flow | `getOnboardingDraftValue('weight')` during draft hydration | `setOnboardingDraftValue('weight', value)` when weight changes | Cleared by full `clearOnboardingDraft()` if called with all keys; scoped logout removes all draft keys; current successful onboarding does not clear `weight` | Onboarding step progression | yes | no | Removed by scoped logout key set | No direct storage effect from `RESET_APP` alone | Removed by `AsyncStorage.clear()` | repo-observed | Distinguish draft weight from saved profile weight and derived auth metrics. |
| Gender draft | `gender` | Direct AsyncStorage key | `onboardingStorage.js`; complete-profile flow | `getOnboardingDraftValue('gender')` during draft hydration | `setOnboardingDraftValue('gender', value)` when gender changes | `clearCompletedOnboardingDraft()` removes `gender`; scoped logout removes all draft keys; full local clear removes it | Onboarding gender selection and profile completion | yes | no | Removed by scoped logout key set | No direct storage effect from `RESET_APP` alone | Removed by `AsyncStorage.clear()` | repo-observed | Saved profile gender is later written to `user_profile`; this draft key is incomplete-onboarding local data. |
| Completed onboarding handoff | `user_profile`; draft keys `dob`, `height`, `gender` | Direct AsyncStorage | `auth.profile()` via `saveStoredProfile()`; `clearCompletedOnboardingDraft()` | Draft values are read before submit; profile is read later through profile/auth paths | Successful completion writes saved profile fields and default target calories | After successful profile save, only `dob`, `height`, and `gender` draft keys are cleared | Successful onboarding/profile completion | yes | no | Later logout removes saved profile and remaining draft keys | `RESET_APP` alone does not clear direct draft keys | Full local clear removes all draft and profile keys | repo-observed | `name` and `weight` draft keys remain after successful completion until overwrite, logout, or full local clear. |

Onboarding draft data is incomplete-onboarding local data. Saved profile data is the `user_profile` record and persisted `auth.user` projection. Derived auth/profile state such as BMI/BMR is reducer-derived and stripped from saved profile storage.

## Bootstrap and Initial Route Dependency

App startup depends on local profile presence.

`src/bootstrap/AppBootstrap.js` calls `hydrateWorkoutPlans()` and then `resolveInitialRouteName()`. `resolveInitialRouteName()` calls `hasStoredProfile()` from `profileStorage.js`.

When `hasStoredProfile()` returns true, the initial route is `ROOT_ROUTES.HOME`. When no stored profile is found, the initial route is `ROOT_ROUTES.COMPLETE_PROFILE`.

`RootContainer` then renders `RootNavigation` with the resolved `initialRouteName` under Redux `Provider` and `PersistGate`.

This is behavior evidence only. It does not approve copy changes, navigation changes, onboarding changes, profile changes, restore/import behavior, or backend account language.

## Clearing and Lifecycle Matrix

| Control | Required interpretation | Storage/control category | Evidence status | Notes |
| --- | --- | --- | --- | --- |
| App start/bootstrap | Reads current profile-related state to determine initial route, if verified. | app-managed local data read | repo-observed | `hasStoredProfile()` reads `user_profile`; saved profile routes to `Home`, missing profile routes to `CompleteProfile`. |
| Successful onboarding/profile completion | Writes profile and may clear some onboarding draft keys, if verified. | direct AsyncStorage write plus partial direct-key clear | repo-observed | Writes `user_profile`; clears `dob`, `height`, and `gender`; does not clear `name` or `weight` in the current successful completion path. |
| Logout | Scoped clear only; not full local data deletion. | scoped logout clear | repo-observed for action; current Settings reachability not visible in Phase 1 surface | `logout()` removes `user_profile`, `local_password`, `local_password_reset_requested_at`, `name`, `dob`, `height`, `weight`, and `gender`, then dispatches `CLEAR_USER`. |
| `CLEAR_USER` | Auth/profile state clearing action, if verified. | Redux auth state clear | repo-observed | Returns auth reducer to initial state; not a full storage wipe by itself. |
| `RESET_APP` | In-memory Redux reset seam; not storage wipe by itself. | in-memory reset | repo-observed | Root reducer returns `appReducer(undefined, action)`. It clears direct AsyncStorage/MMKV only when paired with explicit storage calls. |
| Delete local data/current `deleteAccount()` | Full local clear path for AsyncStorage plus MMKV clear/reseed if verified by prior inventory/live code. | full local clear | repo-observed | Dispatches `RESET_APP`, calls `AsyncStorage.clear()`, calls `storage.clearAll()`, then calls `hydrateWorkoutPlans()`. |
| Export | No repo-observed export of profile/auth/onboarding surfaces unless verified. | not exported | repo-observed absence for scoped surfaces | Current export evidence is selected journal workbook export, not profile/auth/onboarding export. |
| Import/restore | No repo-observed current control. | no repo-observed restore | unknown absence claim | Do not claim profile/auth/onboarding import or restore support. |
| Archive | Not current behavior. | not repo-observed | unknown absence claim | Do not claim archive support for these surfaces. |
| Backend account deletion | No repo-observed current control. | no repo-observed backend account deletion | unknown absence claim | Internal `deleteAccount()` does not establish backend account deletion. |

## Export, Backup, Restore, and Archive Boundary

Profile/auth/onboarding data is app-managed local data unless live code proves otherwise.

These surfaces should not be described as exported copies unless a repo-observed export path exists. No repo-observed profile/auth/onboarding export path was found in the scoped evidence.

No import/restore support should be claimed unless verified. No repo-observed profile import, profile restore, onboarding restore, or password restore path was found.

No archive behavior should be claimed.

No backend account deletion should be claimed.

No cloud backup, cloud sync, or cloud deletion should be claimed.

Delete local data/current internal `deleteAccount()` does not delete exported files, OS backups, cloud-folder copies, shared/uploaded files, copied files, moved files, or other external/user-managed copies. It clears app-managed local data through the observed AsyncStorage/MMKV path and then rehydrates bundled starter plans.

## Current Mismatches and Follow-On Notes

- Visible `Delete Account` wording in `src/screens/setting/pages/MyProfile/MyAccount.js` remains a mismatch candidate if that My Account surface is reached. It is not evidence of backend account deletion.
- Internal `DeleteAccount` route/component naming and internal `deleteAccount()` action naming may be cited as implementation evidence, but they are not approved user-facing vocabulary.
- Settings currently exposes `Delete local data` in the main Settings list and delete screen; that does not fix account-oriented internal names.
- Older docs that cite `src/redux/actions/authStorage.js` are stale for the current branch. Live profile helpers are in `profileStorage.js`, onboarding helpers are in `onboardingStorage.js`, and auth actions compose those helpers.
- Older docs that say `AppBootstrap` reads `AsyncStorage.getItem('user_profile')` directly are stale in implementation detail. Current live code calls `hasStoredProfile()` from `profileStorage.js`; the bootstrap dependency on local profile presence remains current.
- Any uncertainty about profile/onboarding/auth ownership should seed follow-on docs/tests rather than behavior changes.
- No current mismatch recorded here should be fixed in this lane.
- Future Settings copy alignment belongs to `1.2.3.4.7`.
- Future regression tests belong to `1.2.3.4.8`.
- Public docs alignment belongs to `1.2.3.4.9`.

## Non-Claims

This lane does not claim:

- backend account deletion
- cloud deletion
- cloud backup
- sync
- profile import
- profile restore
- onboarding restore
- password restore
- archive support
- deletion of exported files
- deletion of OS backups
- deletion of cloud-folder copies
- deletion of shared/uploaded files
- full-app backup
- legal/privacy policy readiness
- store disclosure readiness
- launch readiness
- security review completion
- password security hardening

This lane also does not approve source, test, copy, README/public doc, privacy, store, export/import, deletion, restore, archive, logout, onboarding, profile, password, backend, cloud, sync, or storage behavior changes.

## Validation

Required validation:

```bash
git diff --check
```

Focused text checks:

```bash
rg -n "user_profile|local_password|local_password_reset_requested_at|Delete local data|Delete Account|deleteAccount|logout|CLEAR_USER|RESET_APP|profile_auth_onboarding_retention_truth_checked" docs/architecture/profile-auth-onboarding-retention-truth-check.md
```

Final status check:

```bash
git status --short --untracked-files=all
```

profile_auth_onboarding_retention_truth_checked
