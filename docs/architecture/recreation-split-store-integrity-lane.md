# Lane: 1.1.4.3.9 Recreation Split-Store Integrity Lane

## Summary

This artifact classifies `1.1.4.3.9` as a docs-only parent scoping lane for the remaining recreation integrity work.

Its purpose is to freeze the current recreation storage truth on the reviewed public `main` branch and split the remaining work into narrower follow-on lanes that match the migration rulebook's bounded-repair expectations. This lane does not authorize storage-touching implementation, reducer/store topology changes, ownership normalization, or broader product-policy changes.

- What changed: one internal architecture scoping document.
- What users will experience: no app behavior change.
- What docs or disclosures must be updated now: none in this lane.
- Public APIs, interfaces, and types changed: none.

No code, config, tests, storage behavior, reducer behavior, runtime behavior, or existing docs are changed in this lane.

## Verification Basis

Current code and the existing architecture docs are the source of truth for this lane. This document is grounded in read-only inspection of the following existing architecture artifacts:

- `docs/architecture/migration-invariants-and-repair-policy.md`
- `docs/architecture/storage-contract-matrix.md`
- `docs/architecture/persistence-inventory.md`

This lane is also anchored to the reviewed public `main` branch surfaces relevant to the current recreation storage split:

- `src/redux/actions/recreation.js`
- `src/redux/actions/recreationStorage.js`
- `src/redux/reducer/recreation.js`
- `src/redux/store/store.js`
- `src/bootstrap/AppBootstrap.js`
- `src/redux/actions/auth.js`
- `src/storage/mmkv/hydration.js`

This document uses the existing boundary tests as contract evidence for the current recreation and delete-account behavior:

- `__tests__/recreationSliceBoundary.test.js`
- `__tests__/recreationStorageBoundary.test.js`
- `__tests__/accountFlows.test.js`

Repo-truth claims for this lane are anchored to the reviewed public `main` branch and the cited architecture docs. Any differing branch requires fresh verification rather than silent normalization.

## Frozen Current Recreation Truth

Later recreation follow-on lanes must treat the following current contracts as frozen unless they explicitly reopen them.

### Recreation Is Not One Clean Storage Seam

Current recreation behavior spans three materially different storage and integrity surfaces:

- direct AsyncStorage compatibility reads for `routines` and `workouts`
- an MMKV sidecar/reference-store branch for `plans_brunch_body`
- a separate custom-plan load branch where `getCustomPlans()` dispatches `GET_CUSTOM_PLANS` with `[]` and performs no storage read

Because those surfaces do not share one bounded repair shape, `1.1.4.3.9` is not implementation-ready as one combined Codex lane.

### Direct-Key Compatibility Reads

- `getRoutines()` calls `readStoredRoutines()`, which reads `AsyncStorage.getItem('routines')`, then dispatches `GET_ROUTINES` into the persisted `recreation` slice.
- `getWorkouts()` calls `readStoredWorkouts()`, which reads `AsyncStorage.getItem('workouts')`, then dispatches `GET_WORKOUTS` into the persisted `recreation` slice.
- Current boundary tests already prove the missing-key fallback to `[]` and the unchanged dispatch contract for both paths.

These remain compatibility-read seams rather than newly normalized ownership decisions.

### MMKV Bundled-Plan Sidecar

- `readStoredBrunchBodyPlans()` reads MMKV-backed `plans_brunch_body` through `getJSON(STORAGE_KEYS.PLANS.BRUNCH_BODY)`.
- `getBrunchBodyPlans()` dispatches those hydrated plans into the `recreation` slice.
- `AppBootstrap` calls `hydrateWorkoutPlans()` before render.
- `deleteAccount()` clears local AsyncStorage, clears MMKV, and then re-runs bundled-plan hydration.

This remains an adjacent MMKV sidecar/reference-store surface, not part of the direct-key compatibility-read repair seam.

### Custom-Plan Load Contract

- `getCustomPlans()` currently dispatches `GET_CUSTOM_PLANS` with `[]`.
- The current load path does not call `AsyncStorage.getItem(...)` or any other storage read helper.
- The reducer still preserves live in-memory branches for `customPlans` and `weekPlan`, including generated ids and later add/edit/delete mutations.
- Current boundary tests explicitly freeze the no-storage `GET_CUSTOM_PLANS` load contract.

This is a branch-contract and ownership-truthfulness seam, not a malformed-storage repair seam.

### Persisted Root Store Contract

- `recreation` remains mounted under the persisted root reducer.
- The persisted root still uses app-authored persist key `root` with `AsyncStorage`.
- The current whitelist still includes `recreation` alongside `auth`, `journal`, `nutrition`, `calendar`, `exercise`, and `todo`.

This parent lane does not reopen reducer mounts, whitelist membership, storage-key names, or broader store topology.

## Follow-On Split

The remaining recreation integrity work should be routed into the following narrower lanes rather than implemented through this parent lane.

### 1.1.4.3.9.1 Recreation Direct-Key Repair

This is the only implementation-ready follow-on lane under the current repo truth.

- Scope: touch only `readStoredRoutines()` and `readStoredWorkouts()` in `src/redux/actions/recreationStorage.js`.
- Repair rule: use the bounded compatibility-read ladder already defined in `1.1.4.3.1`.
- Expected behavior:
  - missing key -> `[]`
  - valid top-level array -> preserve unchanged
  - malformed JSON or non-array payload -> remove only the touched key, then `[]`
- Preserve the current thunk dispatch contracts in `getRoutines()` and `getWorkouts()`.
- Preserve current reducer ownership and persisted-root topology.

This follow-on stays inside one recreation compatibility-read seam and does not reopen adjacent storage surfaces.

### 1.1.4.3.9.2 Recreation Custom-Plan Load Truthfulness

This follow-on is a separate scoping, alignment, or ownership-truthfulness lane rather than a storage-repair implementation lane.

- Scope: explain and resolve the current `getCustomPlans()` empty-array/no-storage-read contract.
- Confirm that the current reducer still supports later custom-plan and week-plan mutations even though the load path does not hydrate from storage.
- Treat this as a branch-contract question, not as malformed-storage repair.
- Do not convert this branch into a compatibility-read repair task without first reopening the ownership decision explicitly.

This follow-on exists because the current code shows a truthfulness gap or deferred ownership question, not a bounded malformed-payload seam.

## Explicit Non-Goals

Unless a later lane explicitly reopens them on purpose, the following are out of scope for `1.1.4.3.9`:

- reopening MMKV `plans_brunch_body` sentinel or self-heal behavior
- combining direct-key repair with bundled-plan MMKV behavior
- redesigning `customPlans`, `weekPlan`, or `brunchBodyPlans` ownership
- reducer mount-key renames
- persist-root rename
- whitelist changes
- direct storage-key renames
- logout, delete-account, export, import, or restore semantic changes
- disclosure, release-note, or other user-facing copy updates
- cross-domain storage cleanup or normalization

This lane does not authorize "cleanup by implication." Any later lane that needs one of those moves must reopen that decision explicitly.

## Review / Completion Expectations

`1.1.4.3.9` is complete when the repo contains a clear parent-lane artifact that does all of the following:

- classifies the lane as scoping-only rather than a one-shot implementation relay
- records that recreation currently spans direct keys, an MMKV sidecar, and a custom-plan no-read branch
- identifies `1.1.4.3.9.1` as the narrow routines/workouts compatibility-read repair lane
- identifies `1.1.4.3.9.2` as the separate custom-plan truthfulness lane
- explicitly keeps `plans_brunch_body` outside the remaining recreation implementation work
- explicitly preserves the current persisted-root store contract with `recreation` still mounted under the root reducer
- explicitly states that no disclosure or release-note update is required now because this parent lane is scoping-only and introduces no user-visible behavior change

If a later recreation task cannot stay inside one of those narrower seams, it should remain a discussion or scoping lane rather than move into storage-touching implementation.
