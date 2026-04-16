# Lane: 1.1.3.1 Store and middleware review

## Summary

This document is a present-state, docs-only audit of the current Redux store, middleware, and local persistence boundaries in the Brunch Body legacy app.

It exists to support Phase 1 cleanup and stabilization by recording the current store contracts before any later cleanup lane touches Redux, storage, or reset behavior. The goal is to describe what is currently wired, where ownership is mixed or ambiguous, and which seams later lanes must preserve unless they explicitly reopen those decisions.

This audit is grounded in inspected live repo code. Companion architecture docs are used only as supporting context where they still match the current implementation. This artifact does not change behavior and does not authorize refactors.

## Classification

Ready for Codex.

## Scope

### In Scope

- Create exactly one new docs-only artifact at `docs/architecture/store-and-middleware-review.md`.
- Record the current store bootstrap path, export path, reducer composition, persist whitelist, and `RESET_APP` reset behavior.
- Record the current middleware reality in `configureStore(...)`, including disabled `serializableCheck` and `immutableCheck`.
- Map thunk-shaped async action creators, direct AsyncStorage reads, MMKV-backed reads, and local-only guard coverage by Redux domain.
- Call out legacy or ambiguous ownership seams that later cleanup lanes must preserve unless they explicitly reopen them.
- End with a bounded, advisory-only issue register and follow-on lane seeds.

### Out of Scope

- No production code changes.
- No test changes.
- No config or dependency changes.
- No RTK slice migration, listener middleware adoption, saga/observable adoption, or state-library replacement.
- No backend, remote-sync, or non-local data-flow reopening.
- No privacy, disclosure, export/import, or deletion-semantics changes.
- No attempt to turn this review into cleanup authorization.

Scope note: this lane is descriptive-first. It documents current contracts and cleanup risk only.

## Files / Surfaces

Primary audited surfaces for this review:

- `package.json`
- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`
- `src/redux/store/store.js`
- `src/redux/store/index.js`
- `src/redux/index.js`
- `src/config/appMode.js`
- `src/config/runtimeMode.js`
- `src/storage/asyncStorageJson.js`
- `src/storage/mmkv/index.js`
- `src/storage/mmkv/hydration.js`
- `src/storage/mmkv/keys.js`
- `src/utils/storageUtils.ts`

Audited Redux action surfaces:

- `src/redux/actions/auth.js`
- `src/redux/actions/authStorage.js`
- `src/redux/actions/calendar.js`
- `src/redux/actions/journal.js`
- `src/redux/actions/nutrition.js`
- `src/redux/actions/recreation.js`
- `src/redux/actions/todo.js`
- `src/redux/actions/exercise.js`

Audited Redux reducer surfaces:

- `src/redux/reducer/auth.js`
- `src/redux/reducer/calendar.js`
- `src/redux/reducer/journal.js`
- `src/redux/reducer/nutrition.js`
- `src/redux/reducer/recreation.js`
- `src/redux/reducer/todo.js`
- `src/redux/reducer/exercise.js`

Single cited UI consumer surface for `state.todo.todoTasks`:

- `src/screens/calendar/pages/calendar/Calendar.js`

Supporting architecture context only where still aligned with current code:

- `docs/architecture/app-structure-inventory.md`
- `docs/architecture/risk-and-coupling-audit.md`

## Current State

The current app uses one Redux Toolkit store, one root `redux-persist` config, and one persisted reducer boundary backed by AsyncStorage.

Redux state ownership is centralized under `src/redux/`, but the actual persistence story is split across:

- persisted Redux slices under the root persist key
- direct AsyncStorage reads and writes inside action helpers
- MMKV-backed bundled-plan hydration and reads for recreation flows

The action layer is mostly thunk-shaped dispatch wrappers rather than plain synchronous action creators, and several reducers still own derived or normalized state instead of limiting themselves to direct assignment.

The current posture remains local-first. `runtimeMode.js` forces `LOCAL_ONLY_MODE_ENABLED = true`, and several action files enforce that with `assertLocalOnlyMode(...)`. That guard coverage is meaningful but uneven across domains.

## Store Topology

### Bootstrap and ownership path

The current store bootstrap path is:

1. `src/bootstrap/AppBootstrap.js` runs `hydrateWorkoutPlans()` before rendering the root container.
2. `src/bootstrap/AppBootstrap.js` resolves the initial route by calling `hasStoredProfile()` from `src/redux/actions/authStorage.js`.
3. `src/root-container/RootContainer.js` imports `store` and `persistor` from `src/redux`.
4. `RootContainer` renders `<Provider store={store}>` outside `<PersistGate persistor={persistor}>`.
5. `RootNavigation` renders only after that provider and persist gate wiring is in place.

This means store ownership is split across bootstrap, root container, and the Redux export surface rather than being held in one single entry file.

### Store exports

- `src/redux/store/store.js` creates and exports `store` and `persistor`.
- `src/redux/store/index.js` re-exports from `./store`.
- `src/redux/index.js` re-exports actions, constants, reducers, and the store exports.
- `RootContainer` consumes `persistor` and `store` through `src/redux/index.js`, not by importing `store.js` directly.

### Reducer composition

`src/redux/store/store.js` combines these slices into one app reducer:

- `auth`
- `recreation`
- `journal`
- `nutrition`
- `calendar`
- `exercise`
- `todo`

The `todo` slice is backed by `../reducer/todo` and is explicitly preserved under the legacy slice key with the inline comment: keep the legacy persisted slice key until a dedicated migration lane.

### Persist config

The current root persist config is:

- persist key: `root`
- storage backend: `@react-native-async-storage/async-storage`
- whitelist:
  - `auth`
  - `recreation`
  - `journal`
  - `nutrition`
  - `calendar`
  - `exercise`
  - `todo`

There is no per-slice persist configuration in the audited store file. The current persistence contract is one root boundary with seven whitelisted slices.

### Reset and account-state behavior

`RESET_APP` is handled in the root reducer wrapper in `src/redux/store/store.js`. When that action is dispatched, the wrapper returns `appReducer(undefined, action)`, which rebuilds Redux slice state from initial state.

That Redux reset is not the whole account/reset story:

- `logout()` in `src/redux/actions/auth.js` removes only `user_profile`, local password keys, and onboarding draft keys, then dispatches `CLEAR_USER`.
- `deleteAccount()` dispatches `RESET_APP`, clears AsyncStorage with `AsyncStorage.clear()`, clears MMKV with `storage.clearAll()`, and then re-runs `hydrateWorkoutPlans()`.

The current delete-account path is therefore best described as a full local app-data wipe across the current AsyncStorage and MMKV backends, followed by MMKV bundled-plan rehydration. It is not the same path as `logout()`.

## Middleware Reality

`src/redux/store/store.js` uses Redux Toolkit `configureStore(...)` with:

- `reducer: persistedReducer`
- `middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false })`
- `devTools: process.env.NODE_ENV !== 'production'`

Confirmed current middleware facts:

- The store uses RTK default middleware rather than a custom middleware array.
- `serializableCheck` is explicitly disabled.
- `immutableCheck` is explicitly disabled.
- No extra middleware is concatenated or prepended in the audited store file.
- No custom store enhancers are configured in the audited store file.
- Thunk-shaped action creators across the Redux domains depend on RTK default middleware behavior.

Package-level note:

- `package.json` still lists `redux-promise`.
- No audited store/action surface imports or wires `redux-promise` into the store.

This means the current middleware picture is narrow: RTK default middleware is present, two safety checks are disabled, and at least one installed Redux middleware package appears legacy or unwired in the inspected store path.

## Async / Storage Ownership By Domain

| domain | action pattern | direct storage | Redux slice / persisted state | local-only guard | notes |
| --- | --- | --- | --- | --- | --- |
| `auth` | Thunk-shaped async action creators plus storage helper functions in `authStorage.js` | AsyncStorage reads/writes `user_profile`, `local_password`, `local_password_reset_requested_at`, and onboarding draft keys; `deleteAccount()` also clears MMKV and rehydrates bundled plans | `auth` slice is root-persisted | No `assertLocalOnlyMode(...)` in the audited auth files | Reducer derives BMI and BMR from stored profile payload; logout and delete-account behavior are intentionally different |
| `journal` | Mostly thunk-shaped dispatch wrappers; one direct traits bootstrap read | AsyncStorage reads `traits` | `journal` slice is root-persisted | No `assertLocalOnlyMode(...)` in `journal.js` | `GET_ALL_JOURNAL_ENTRIES` currently dispatches only an action type; reducer owns date matching and selected-entry projection |
| `nutrition` | Thunk-shaped action creators using `getJsonItem(...)` helper reads before dispatch | AsyncStorage JSON reads for `meals`, `supplements`, `meal_categories`, and `meals_directory` through `src/storage/asyncStorageJson.js` | `nutrition` slice is root-persisted | `assertLocalOnlyMode('nutrition actions')` at module load | Reducer owns meal-item and supplement-item list mutation and selected-sublist state |
| `recreation` | Thunk-shaped action creators with mixed AsyncStorage and MMKV reads | AsyncStorage reads `routines` and `workouts`; MMKV reads bundled Brunch Body plans through `getJSON(STORAGE_KEYS.PLANS.BRUNCH_BODY)` | `recreation` slice is root-persisted | `assertLocalOnlyMode('recreation actions')` at module load | `GET_CUSTOM_PLANS` currently dispatches an empty array; bundled-plan hydration and reads sit outside Redux Persist |
| `calendar` | Thunk-shaped action creators, including aliased todo exports | AsyncStorage reads `themes`; repeated-theme frequency state is derived in reducer logic | `calendar` slice is root-persisted | `assertLocalOnlyMode('calendar actions')` at module load | `calendar.js` re-exports `todo` actions as `addCalendarTodoTask`, `editCalendarTodoTask`, `deleteCalendarTodoTask`, and `getCalendarTodoTasks` to preserve calendar-owned UI behavior |
| `exercise` | Thunk-shaped action creators with direct storage bootstrap reads | AsyncStorage reads `exercises` and `exercise_directory` | `exercise` slice is root-persisted | `assertLocalOnlyMode('exercise actions')` at module load | Reducer merges user exercises with bundled directory data and builds derived picker-friendly arrays |
| `todo` | Thunk-shaped action creators wrapping direct todo storage reads and dispatch | AsyncStorage reads `todos` | `todo` slice is root-persisted | `assertLocalOnlyMode('todo actions')` at module load | Slice state shape is `state.todo.todoTasks`; `src/screens/calendar/pages/calendar/Calendar.js` reads that shape through `calendarTodoTasks: state.todo?.todoTasks` |

Cross-domain storage observations:

- Redux Persist itself uses AsyncStorage under the `root` key.
- Several domains also read domain-specific keys directly from AsyncStorage outside the persisted Redux blob.
- MMKV is not used as the Redux Persist backend in the current store. In the audited Redux-adjacent path, MMKV is used for bundled recreation plan hydration and reads only.
- `AppBootstrap` and `deleteAccount()` both intersect MMKV-backed bundled-plan behavior outside the store file itself.

## Legacy / Preserved Contracts

The following seams are important current contracts. Later cleanup lanes should preserve them unless they explicitly reopen those decisions.

### Calendar-owned todo contract

- The live todo UI sits under the calendar screen domain.
- The persisted Redux slice key is still `todo`, not `calendar`.
- `src/redux/actions/calendar.js` re-exports todo actions under calendar-specific names.
- `Calendar.js` consumes `state.todo?.todoTasks` through that contract.

This is a legacy ownership seam, but it is a real present-state contract.

### Mixed persistence ownership

- Redux Persist uses AsyncStorage for the root persisted store.
- Action creators also read and write domain keys directly in AsyncStorage.
- MMKV stores bundled Brunch Body plans outside the Redux Persist boundary.
- Delete/reset behavior crosses both storage backends.

This means persistence ownership is not fully centralized in one store layer.

### Reducer-owned derived and normalized state

Examples confirmed in the audited reducers:

- `authReducer` derives BMI and BMR from user profile data.
- `calendarReducer` computes repeated-theme frequency projections and current-theme state.
- `exerciseReducer` merges user-created and bundled exercise data into derived arrays.
- `nutritionReducer` and `recreationReducer` both keep selected nested-list state in parallel with parent collections.

These reducers do more than assign incoming payloads. Later cleanup work should treat those calculations as current contracts, not incidental implementation detail.

### Centralized Redux export surface

`src/redux/index.js` re-exports:

- actions
- constants
- reducers
- store
- persistor

That central export surface increases cross-domain fan-in and is part of the current Redux usage contract.

### Uneven local-only guard coverage

- `calendar`, `nutrition`, `recreation`, `exercise`, and `todo` assert local-only mode at module load.
- `auth` and `journal` do not use `assertLocalOnlyMode(...)` in the audited files, even though they still operate on local device storage only.

That difference is worth documenting as a current seam rather than normalizing away.

## Issue Register

This register is advisory only. It records bounded cleanup candidates and ambiguity seams; it does not authorize implementation.

| issue | current evidence | why it matters later | follow-on lane seed |
| --- | --- | --- | --- |
| Mixed persistence ownership | Root Redux persistence uses AsyncStorage, action creators read direct AsyncStorage keys, and recreation plan hydration uses MMKV outside the persisted store | Cleanup work can accidentally change storage truth in one layer while preserving another | Local persistence boundary review |
| Disabled middleware safety checks | `configureStore(...)` disables both `serializableCheck` and `immutableCheck` | Later cleanup or testing lanes may need clearer rationale or narrower exceptions before changing store behavior safely | Middleware safety-check review |
| Installed but unwired Redux middleware dependency | `redux-promise` is installed in `package.json` but not wired into the audited store path | Dependency cleanup and middleware documentation can drift when installed packages no longer match runtime wiring | Redux dependency residue audit |
| Calendar / todo ownership aliasing | Todo state persists under `todo`, but calendar actions alias the todo surface and the cited UI consumer lives in `Calendar.js` | Ownership cleanup can easily break selector, persistence-key, or screen-domain assumptions | Calendar/todo boundary clarification |
| Reducer-owned derived state contracts | `auth`, `calendar`, `exercise`, `nutrition`, and `recreation` reducers all own derived or normalized state behavior | Refactors that treat reducers as passive assignment layers can change behavior unintentionally | Reducer contract audit |
| Partial local-only guard coverage | Several domains assert local-only mode, while `auth` and `journal` do not in the audited files | Guardrail cleanup needs an evidence-backed decision about whether to standardize, preserve, or defer this split | Local-only guard coverage review |

## Follow-on Lane Seeds

These are sequencing suggestions only. They do not authorize implementation by themselves.

- Local persistence boundary review
- Middleware safety-check review
- Redux dependency residue audit
- Calendar/todo boundary clarification
- Reducer contract audit
- Local-only guard coverage review

## Public Interfaces

None.

This artifact changes no public APIs, no Redux interfaces, no storage backends, no privacy posture, no deletion semantics, no tests, and no runtime behavior.
