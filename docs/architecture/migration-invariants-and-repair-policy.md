# Lane: 1.1.4.3.1 Migration Invariants And Repair Policy

## Summary

This artifact classifies `1.1.4.3.1` as a docs-only policy lane for Brunch Body migration and repair work.

Its purpose is to convert the repo's current storage findings into a shared rulebook that later `1.1.4.3` implementation lanes must follow. This lane does not authorize migration implementation, storage-key cleanup, ownership normalization, or broader product-policy changes.

- What changed: one internal architecture policy document.
- What users will experience: no app behavior change.
- What docs or disclosures must be updated now: none in this lane.

No code, config, tests, storage behavior, reducer behavior, runtime behavior, or existing docs are changed in this lane.

## Verification Basis

Current code and the existing architecture docs are the source of truth for this lane. This document is grounded in read-only inspection of the following existing architecture artifacts:

- `docs/architecture/persistence-inventory.md`
- `docs/architecture/storage-contract-matrix.md`
- `docs/architecture/slice-migration-path-phase-1.md`

This lane is also anchored to the reviewed public `main` branch surfaces relevant to the current persistence and migration seams:

- `src/redux/store/store.js`
- `src/redux/actions/auth.js`
- `src/redux/actions/authStorage.js`
- `src/redux/actions/profileStorage.js`
- `src/redux/actions/onboardingStorage.js`
- `src/bootstrap/AppBootstrap.js`
- `src/redux/actions/journal.js`
- `src/redux/actions/calendar.js`
- `src/redux/actions/exercise.js`
- `src/redux/actions/nutrition.js`
- `src/redux/actions/recreation.js`
- `src/redux/actions/todo.js`
- `src/storage/mmkv/index.js`
- `src/storage/mmkv/keys.js`
- `src/storage/mmkv/hydration.js`

This document also uses the existing Phase 1 boundary tests as contract evidence:

- `__tests__/reduxSharedContractBoundary.test.js`
- `__tests__/accountFlows.test.js`
- `__tests__/calendarSelectorBoundary.test.js`
- `__tests__/calendarTodoOwnershipBoundary.test.js`
- `__tests__/dashboardReadModelBoundary.test.js`
- `__tests__/journalSliceBoundary.test.js`
- `__tests__/nutritionStorageBoundary.test.js`
- `__tests__/recreationSliceBoundary.test.js`
- `__tests__/exerciseMergeDirectoryBoundary.test.js`

Important auth-seam handling for this lane:

- Current architecture docs still cite `src/redux/actions/authStorage.js`.
- `src/redux/actions/authStorage.js` remains a reviewed public-branch surface at this seam.
- Live import paths now route through `src/redux/actions/profileStorage.js`, and in `src/redux/actions/auth.js`, also `src/redux/actions/onboardingStorage.js`.
- `src/bootstrap/AppBootstrap.js` imports only `profileStorage.js` for the pre-`PersistGate` stored-profile check.
- Where cited docs and live call sites conflict, live call sites win.
- This note does not treat the auth/profile seam as newly canonical or fully settled.

Repo-truth claims for this lane are anchored to the reviewed public `main` branch and the cited architecture docs. Any differing branch requires fresh verification rather than silent normalization.

## Frozen Current Contracts

Later `1.1.4.3` lanes must treat the following current contracts as frozen unless they explicitly reopen them.

### Persisted Redux Root Contract

- The app currently uses one root `redux-persist` boundary with app-authored persist key `root`.
- The backend is `AsyncStorage`.
- The mounted and whitelisted persisted slices are `auth`, `recreation`, `journal`, `nutrition`, `calendar`, `exercise`, and `todo`.
- The `todo` reducer remains mounted under the legacy `todo` key, with the inline store comment preserving that key until a dedicated migration lane.
- A library-conventional runtime entry name such as `persist:root` remains inferred rather than newly settled by this lane.

### Bootstrap And Auth/Profile Timing Contract

- `AppBootstrap` checks stored `user_profile` presence before the app renders under `PersistGate`.
- That pre-render dependency is frozen as a timing and startup contract only.
- This lane does not use that dependency to redefine canonical ownership of the broader auth/profile domain.
- The overlap between the direct `user_profile` key and the persisted `auth` slice remains a live deferred seam.

### Frozen Compatibility-Read Seams

The following direct-key surfaces remain frozen as current compatibility-read seams rather than newly normalized ownership decisions:

- `journal`: `traits`
- `calendar`: `themes`
- `exercise`: `exercises`, `exercise_directory`
- `nutrition`: `meals`, `supplements`, `meal_categories`, `meals_directory`
- `recreation`: `routines`, `workouts`
- `todo`: `todos`

These seams may be inspected, characterized, or repaired only within later single-domain lanes that preserve the current contract unless that lane explicitly reopens the broader decision.

### Frozen MMKV Sidecar Surfaces

- `is_initialized`
- `plans_brunch_body`

These remain adjacent MMKV sidecar/reference-store surfaces rather than part of the main persisted Redux root contract.

### Delete-Account Fact Note

- Current repo behavior clears MMKV and then immediately rehydrates bundled Brunch Body plan metadata.
- This lane records that as an observed fact only.
- This lane does not reinterpret, rename, or redesign delete-account semantics.

## Shared Vocabulary

- `current-contract`: a repo-observed boundary that later lanes must preserve unless they explicitly reopen it.
- `compatibility read`: a direct storage key that current code still reads even though it overlaps with a persisted Redux slice and later normalization is deferred.
- `repair`: bounded integrity handling inside one touched lane that preserves the frozen current contracts while addressing a verified storage problem.
- `self-heal`: deterministic recreation or correction of a missing or inconsistent adjacent sidecar surface within the touched lane only.
- `bounded discard`: resetting only the touched malformed or obsolete payload to the current safe fallback without widening into broader cleanup.
- `malformed payload`: a stored value that the current touched path cannot parse, hydrate, or safely accept as matching the current contract.
- `stale duplicate`: an overlapping or derived payload that is no longer the bounded owner and may be recomputed only when the later lane proves that recomputation is safe.
- `safe fallback`: the current touched-path empty payload contract proven by current readers and tests, typically `[]` for the current compatibility-read loaders, and not a broader state rebuild.

## Repair Decision Rules

Later implementation lanes may use only the following bounded repair ladder:

1. `Valid payload -> preserve untouched`
   Preserve any payload that the touched path can still parse and hydrate as a valid current-contract value. Do not rewrite it merely because the lane would prefer a different normalized shape.

2. `Missing optional payload -> current touched-path empty payload contract`
   If the touched surface is optional and absent, use the current safe fallback for that surface only. Do not backfill from unrelated domains or broaden the lane into cross-surface reconstruction.

3. `Stale duplicate or derived payload -> recompute only from the bounded owner when proven safe`
   A later lane may recompute a stale duplicate or derived surface only when that lane proves the current bounded owner, proves the recomputation is deterministic, and keeps the work inside the touched lane.

4. `Malformed compatibility-read payload -> bounded discard to current safe fallback`
   If a compatibility-read payload is malformed, discard only that touched payload and replace it with the current touched-path empty payload contract. Do not widen the discard into multi-domain cleanup.

5. `Sidecar sentinel mismatch -> self-heal only within the touched sidecar lane`
   A later lane may self-heal a sidecar sentinel or adjacent MMKV reference surface only inside that sidecar lane. It may not use a sidecar mismatch as an excuse to reopen unrelated domain storage contracts.

6. `Unresolved ambiguity -> stop and defer`
   If the lane cannot prove the bounded owner, cannot prove the safe fallback, or encounters conflicting behavior it cannot resolve without widening scope, it must stop and defer rather than guessing.

This ladder is intentionally conservative. It authorizes bounded integrity handling, not opportunistic normalization.

## Forbidden Changes

Unless a later lane explicitly reopens them on purpose, the following changes are forbidden in follow-on migration lanes:

- reducer mount-key renames
- persist-root rename
- whitelist changes
- direct storage-key renames
- multi-domain migrations
- import, export, or restore semantic changes
- logout semantic changes
- delete-account semantic changes
- cloud or off-device behavior additions
- silent canonical-ownership rewrites for surfaces still labeled `compatibility read`, `deferred`, `inferred`, or `unknown / needs follow-on`

This lane does not authorize "cleanup by implication." Any lane that needs one of the forbidden moves must reopen that decision explicitly.

## Lane Routing / Sequencing

Later `1.1.4.3` implementation work must stay narrow and reviewable:

- One domain or one adjacent sidecar surface at a time.
- Minimal diff.
- Explicit reopened scope if a lane needs to go beyond bounded repair.
- No hidden spillover into reset, delete-account, export, import, restore, or disclosure-policy work.

Examples of distinct future lane shapes include auth/profile duplication repair, one compatibility-read seam at a time, or one MMKV sidecar self-heal lane. This document does not combine those lanes or settle their outcomes in advance.

## Review / Test Expectations

Later migration lanes are not ready for implementation unless they can show all of the following:

- The lane stays within one domain or one adjacent sidecar surface.
- The lane explains which frozen current contracts it preserves.
- The lane uses touched-logic tests only, relying on existing boundary tests and adding only the minimal characterization needed for the touched logic.
- The lane states its repair path in terms of the bounded ladder above.
- The lane explicitly calls out when it changes internal integrity handling without changing user-facing behavior.
- The lane stops and defers if it cannot prove the bounded owner, the safe fallback, or the repair scope.

If a later lane cannot satisfy those review expectations, it should remain a discussion or scoping lane rather than move into storage-touching implementation.
