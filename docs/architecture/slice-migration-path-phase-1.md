# Lane: 1.1.3.5 Phase 1 Slice Migration Path Policy

## Summary

This artifact classifies `1.1.3.5` as a docs-only scoping lane for Phase 1 cleanup and stabilization.

It defines what "migration path toward slices" means for the current repo without authorizing implementation work in this lane. The purpose is to record the repo-observed current contracts that later lanes must treat as frozen unless they explicitly reopen them, and to define the only acceptable Phase 1 migration path.

This lane is Ready for Codex only as read-only inspection plus creation of this one new document. No code, config, or existing-doc edits are allowed in this lane.

## Verification Basis

This document is grounded in read-only inspection of the following repo surfaces:

- `src/redux/store/store.js`
- `src/redux/index.js`
- `src/redux/reducer/index.js`
- `src/redux/actions/auth.js`
- `src/redux/actions/authStorage.js`
- `src/redux/actions/calendar.js`
- `src/redux/selectors/index.js`
- `src/redux/selectors/calendar.js`
- `src/screens/calendar/pages/calendar/Calendar.js`
- `src/screens/dashboard/readModel.js`
- `src/storage/mmkv/keys.js`
- `src/storage/mmkv/hydration.js`

This document also uses existing boundary tests as contract evidence:

- `__tests__/reduxSharedContractBoundary.test.js`
- `__tests__/accountFlows.test.js`
- `__tests__/calendarSelectorBoundary.test.js`
- `__tests__/calendarTodoOwnershipBoundary.test.js`
- `__tests__/dashboardReadModelBoundary.test.js`
- `__tests__/journalSliceBoundary.test.js`
- `__tests__/nutritionStorageBoundary.test.js`
- `__tests__/recreationSliceBoundary.test.js`
- `__tests__/exerciseMergeDirectoryBoundary.test.js`

## Repo-Observed Current Contracts

### Store and persistence contract

- The app currently uses one Redux Toolkit store created in `src/redux/store/store.js`.
- The persisted Redux boundary is one root `redux-persist` config with:
  - persist key `root`
  - AsyncStorage backend
  - whitelist entries `auth`, `recreation`, `journal`, `nutrition`, `calendar`, `exercise`, and `todo`
- `RESET_APP` is handled in the root reducer wrapper by returning `appReducer(undefined, action)`.
- The mounted reducer keys are:
  - `auth`
  - `recreation`
  - `journal`
  - `nutrition`
  - `calendar`
  - `exercise`
  - `todo`
- The `todo` reducer is still mounted under the legacy `todo` key, with an inline comment in `store.js` preserving that key until a dedicated migration lane.

### Public Redux namespace contract

- `src/redux/index.js` currently exports:
  - namespaced `actions`
  - namespaced `constants`
  - namespaced `reducers`
  - `store`
  - `persistor`
- `src/redux/reducer/index.js` currently re-exports named reducer aliases:
  - `authReducer`
  - `calendarReducer`
  - `exerciseReducer`
  - `journalReducer`
  - `nutritionReducer`
  - `recreationReducer`
  - `todoReducer`
- `__tests__/reduxSharedContractBoundary.test.js` characterizes both the root Redux entrypoint and the current reducer-mount / whitelist contract.

### Screen-read and selector contract

- `src/redux/selectors/index.js` currently exports only calendar-focused selectors from `src/redux/selectors/calendar.js`.
- `src/screens/calendar/pages/calendar/Calendar.js` imports those selectors instead of reading `state.auth`, `state.todo`, or `state.calendar` directly in its mapped props.
- The calendar selector seam preserves a legacy ownership boundary:
  - `selectCalendarTodoTasks(state)` reads `state.todo.todoTasks`
  - calendar-facing todo actions are re-exported from `src/redux/actions/calendar.js`
  - the thunk implementation and persisted reducer ownership still remain with the legacy todo domain
- Outside that calendar seam, direct root-state reads are still present across many screens. Repo inspection shows current direct reads of `state.auth`, `state.journal`, `state.nutrition`, `state.recreation`, `state.exercise`, and some `state.calendar` fields in screen containers.
- `src/screens/dashboard/readModel.js` is a verified extracted read-model seam. `__tests__/dashboardReadModelBoundary.test.js` characterizes that dashboard chart output is preserved while aggregate ownership is no longer kept in the journal reducer.

### Reset, logout, and delete-account contract

- `src/redux/actions/authStorage.js` defines:
  - `USER_PROFILE_KEY = 'user_profile'`
  - onboarding draft keys `name`, `dob`, `height`, `weight`, `gender`
- `src/redux/actions/auth.js` defines additional direct auth/account keys:
  - `local_password`
  - `local_password_reset_requested_at`
- `logout()` currently:
  - removes only the scoped auth/account and onboarding keys via `AsyncStorage.multiRemove(...)`
  - dispatches `CLEAR_USER`
  - does not call `AsyncStorage.clear()`
  - does not clear MMKV
  - does not rehydrate bundled workout plans
- `deleteAccount()` currently:
  - dispatches `RESET_APP`
  - calls `AsyncStorage.clear()`
  - calls `storage.clearAll()`
  - calls `hydrateWorkoutPlans()`
- `__tests__/accountFlows.test.js` characterizes the current distinction between logout and delete-account behavior and also characterizes the navigation reset back to `CompleteProfile`.

### AsyncStorage and MMKV ownership boundaries relevant to migration

- Verified direct AsyncStorage ownership in inspected Redux-adjacent code includes:
  - `user_profile`
  - `local_password`
  - `local_password_reset_requested_at`
  - onboarding draft keys `name`, `dob`, `height`, `weight`, `gender`
  - `themes`
- Existing boundary tests characterize additional direct AsyncStorage keys that current Redux domains still depend on:
  - journal: `traits`
  - nutrition: `meals`, `supplements`, `meal_categories`, `meals_directory`
  - recreation: `routines`, `workouts`
  - exercise: `exercises`, `exercise_directory`
  - todo: `todos`
- MMKV ownership is currently limited and specific in the inspected surfaces:
  - initialization flag `is_initialized`
  - bundled plan key `plans_brunch_body`
- `hydrateWorkoutPlans()` seeds MMKV only when `is_initialized` is not already set, and `deleteAccount()` re-runs that hydration after clearing MMKV.

## Notes On Observed Vs Assumed Shape

- The repo does not show a general selector-first migration across Redux domains. The verified selector barrel is calendar-specific, and most other screen containers still read `state.<slice>` directly.
- The repo does show a narrow extracted read-model/business-logic seam in the dashboard chart path.
- No pilot domain is selected by current repo structure. This document therefore records policy only and does not promote any domain into implementation scope.

## Phase 1 Freeze Policy

Unless a later lane explicitly reopens a contract, Phase 1 slice-related work must treat the following as frozen:

- reducer mount keys in `src/redux/store/store.js`
- persist key `root`
- current whitelist behavior for `auth`, `recreation`, `journal`, `nutrition`, `calendar`, `exercise`, and `todo`
- current Redux root entrypoint and reducer-barrel export surface
- current screen-facing read contracts, including the calendar selector seam and the legacy `state.todo.todoTasks` ownership boundary
- current logout, `RESET_APP`, and delete-account behavior
- current direct storage key names and current AsyncStorage/MMKV ownership boundaries relevant to persistence and reset

If a later lane finds that a discussion assumption differs from repo reality, that later lane must document the repo-observed contract first and reopen the change explicitly. It must not "normalize" the repo by documentation or by silent implementation drift.

## Allowed Phase 1 Path Toward Slices

Phase 1 allows only a seam-first migration path:

1. Pick one domain only in a separate future scoping lane.
2. Verify that the lane can stay within current persisted, reset, and public-contract boundaries.
3. Add or strengthen selectors, read-model helpers, or business-logic seams for that one domain.
4. Add or strengthen characterization coverage for the domain's current read, persistence, and reset behavior before any migration begins.
5. Open a separate single-domain implementation lane only after the seam and contract tests exist.

Pilot-domain selection is intentionally deferred by this policy artifact.

## Forbidden In Phase 1

The following are out of bounds for Phase 1 slice-migration work unless a later lane explicitly reopens them:

- root-store-first modernization
- opportunistic conversion when unrelated domains are touched
- multi-domain conversion in one lane
- reducer-key renames
- persist-key changes
- storage-key changes
- reset, logout, or delete-account semantic changes
- silent changes to the Redux root entrypoint or reducer-barrel export surface
- re-framing this policy lane as a direct implementation lane

## Prerequisite Checklist For Any Later Single-Domain Migration Lane

A future slice-migration lane is not ready unless it can answer all of the following without guessing:

- Which one domain is being targeted
- Which current read contract is being preserved
- Which storage keys and persistence paths that domain currently depends on
- Whether the target domain touches logout, delete-account, or `RESET_APP`
- Which selectors, read-model helpers, or business-logic seams already exist, and which minimal additions are required first
- Which characterization tests prove the current contract before migration
- Why the lane remains local-first, mobile-first, and Phase 1-sized
- Why the lane does not require reducer-key, persist-key, storage-key, or reset-semantic changes

If a future lane cannot meet that checklist, it should remain in discussion or scoping rather than move to implementation.
