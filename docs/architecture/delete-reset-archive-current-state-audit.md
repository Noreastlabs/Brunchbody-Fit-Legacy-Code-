# Delete / Reset / Archive Current-State Audit

## Status and Scope

This is an internal architecture audit artifact for Brunch Body delete, reset, logout, reset-password, export-boundary, starter-content reseeding, and archive-like behavior.

This artifact is internal evidence only. It changes no app behavior, no source code, no tests, no user-facing copy, no README content, no public docs, no privacy language, no store disclosure language, no export behavior, no import behavior, no storage behavior, no archive implementation, no backend behavior, no cloud behavior, and no broad Settings design.

The vocabulary baseline is `docs/architecture/delete-reset-archive-semantics-decision.md`. That decision record defines `Delete local data`, `Reset app`, `Log out`, `Reset password`, and `Archive`, but it explicitly says a follow-on audit must verify current repo behavior before implementation, copy, tests, public docs, privacy, or disclosure lanes rely on those claims.

The expected classifications below were verified against the current checkout. They are not mandatory conclusions. If current repo evidence differed, the status in this audit was assigned from the observed behavior and marked current, internal-only, not found, ambiguous, or future-follow-on.

## Evidence Basis

Evidence was taken from current local files only:

- Decision baseline: `docs/architecture/delete-reset-archive-semantics-decision.md`
- Existing architecture context: `docs/architecture/settings-ia-control-surfaces.md`, `docs/architecture/local-only-contract-closeout.md`, `docs/architecture/data-export-and-portability-controls.md`, `docs/architecture/persistence-inventory.md`, `docs/architecture/in-app-transparency-surfaces.md`
- Current app surfaces: `src/screens/setting/**`, `src/screens/journal/**`, `src/screens/calendar/**`, `src/screens/nutrition/**`, `src/screens/recreation/**`
- Current Redux and storage behavior: `src/redux/actions/**`, `src/redux/reducer/**`, `src/redux/store/store.js`, `src/storage/**`, `src/bootstrap/AppBootstrap.js`, `src/root-container/RootContainer.js`
- Current tests: `__tests__/accountFlows.test.js`, `__tests__/exportTransparencyCopy.test.js`, `__tests__/mmkvHydration.test.js`, `__tests__/AppBootstrap.test.js`, `__tests__/navigationSmokeNavigators.test.js`, storage-boundary tests, and domain reducer/form tests
- Public docs and README were inspected only as evidence of existing claims; they were not edited.

Every current, internal-only, or verified classification below includes at least one specific code, test, or documentation path.

## Audit Method

The audit searched for delete, reset, logout, reset-password, archive-like, export, remove, clear, restore, hide, and soft-delete terms across the requested architecture, public-doc, settings, Redux, storage, bootstrap, root-container, and test surfaces. The current checkout does not have a top-level `screens/` directory; live app screen evidence was inspected under `src/screens/**`.

Representative commands:

- `git status --short --untracked-files=all`
- `rg -n "Delete local data|RESET_APP|deleteAccount|logout|log out|reset password|resetPassword|archive|archived|soft delete|restore|remove|clear|export" README.md docs/architecture docs/public src/screens src/redux src/storage src/bootstrap src/root-container __tests__`
- `rg -n "AsyncStorage|clearAll|hydrateWorkoutPlans|user_profile|export" src/screens src/redux src/storage src/bootstrap src/root-container __tests__ docs README.md`

This audit treats code presence separately from visible user-facing reachability. If a surface exists in source files but is not registered in the current navigation stack or exposed by current Settings list data, it is classified separately from visible UI behavior.

## Control Surface Inventory

| Control / term | Status | User-facing label | Code surface | Storage touched | Behavior observed | Evidence type | Trust risk | Follow-on needed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Delete local data | current | `Delete local data`; button `Delete Local Data` | `src/screens/setting/pages/Setting/Setting.js`; `src/screens/setting/components/My Profile/DeleteAccount.js`; `src/screens/setting/pages/MyProfile/DeleteAccount.js`; `src/redux/actions/auth.js`; `__tests__/accountFlows.test.js` | AsyncStorage, MMKV, Redux | Settings exposes the destructive local-data control. The UI requires confirmation, dispatches internal `deleteAccount()`, resets Redux through `RESET_APP`, clears AsyncStorage, clears MMKV, then rehydrates bundled plans. | code, test, doc | high | yes - `1.2.3.3.2` copy clarity and `1.2.3.3.3` execution boundary tests |
| Internal `deleteAccount` action / `DeleteAccount` route | internal-only | none observed as current user-facing copy; internal route name is `DeleteAccount` | `src/navigation/SettingsNavigation.js`; `src/navigation/routeNames.js`; `src/redux/actions/auth.js`; `src/screens/setting/pages/MyProfile/DeleteAccount.js` | AsyncStorage, MMKV, Redux | Internal implementation naming remains account-oriented, while visible copy says Delete local data. | code, doc | medium | yes - internal naming cleanup only if separately approved |
| `RESET_APP` | internal-only | none observed | `src/redux/constants/constants.js`; `src/redux/store/store.js`; `src/redux/actions/auth.js`; `__tests__/accountFlows.test.js` | Redux by itself; AsyncStorage/MMKV only when paired with `deleteAccount()` | Root reducer resets in-memory Redux state for `RESET_APP`. It is not a standalone user-facing reset control and does not clear device storage by itself. | code, test | medium | yes - include in `1.2.3.3.3` boundary tests |
| Log out | internal-only | none observed in current Settings list | `src/redux/actions/auth.js`; `src/screens/setting/pages/Setting/Setting.js`; `__tests__/accountFlows.test.js` | AsyncStorage, Redux | `logout()` removes scoped auth/profile/onboarding draft keys and dispatches `CLEAR_USER`. Current Settings tests assert no visible Logout entry. It does not call `AsyncStorage.clear()`, `storage.clearAll()`, or starter-plan hydration. | code, test | medium | yes - keep separated in future copy/disclosure lanes |
| Reset password | ambiguous | Source component has `Forgot Password`, `Reset Local Password`, `Password Reset Saved`; no current reachable Settings route observed | `src/redux/actions/auth.js`; `src/screens/setting/pages/MyProfile/MyPassword.js`; `src/screens/setting/components/My Profile/MyPassword.js`; `src/navigation/SettingsNavigation.js`; `__tests__/accountFlows.test.js` | AsyncStorage | `resetPassword()` verifies the saved local email, removes `local_password`, and writes `local_password_reset_requested_at`. The MyPassword UI files exist, but `SettingsNavigation` does not register `MyPassword`, and current MyProfile list data routes only to MyVitals. | code, test, inferred | high | yes - `1.2.3.3.4` reset-password vs reset-app language separation |
| Export Journal Data | current | `Export data`; `Export journal data`; `Export Journal Data`; button `Export Data` | `src/screens/setting/pages/Setting/Setting.js`; `src/screens/setting/pages/Export To CSV/ExportToCSV.js`; `src/screens/setting/components/Export To CSV/ExportToCSV.js`; `__tests__/exportTransparencyCopy.test.js` | exported file, filesystem | Current export is selected journal-entry export to an Excel workbook (`.xlsx`) written through user-selected storage flows. It is not a full backup, import, restore, or delete path. | code, test, doc | high | yes - `1.2.3.3.7` public docs/disclosure alignment |
| Exported-file deletion boundary | current | Copy says exported files are user-managed and not removed by Delete local data | `src/screens/setting/components/Export To CSV/ExportToCSV.js`; `src/screens/setting/pages/Export To CSV/ExportToCSV.js`; `src/screens/setting/components/My Profile/DeleteAccount.js`; `__tests__/exportTransparencyCopy.test.js`; `__tests__/accountFlows.test.js` | exported file, filesystem | Verified. Export copy and delete-local-data copy state that files exported, copied, shared, uploaded, or saved outside the app are not deleted by Delete local data. No in-app exported-file deletion control was found. | code, test, doc | high | yes - `1.2.3.3.7` disclosure alignment |
| Bundled starter plan reseeding | current | Delete-local-data copy says starter plans may appear again after setup | `src/storage/mmkv/hydration.js`; `src/storage/mmkv/keys.js`; `src/bootstrap/AppBootstrap.js`; `src/redux/actions/auth.js`; `__tests__/mmkvHydration.test.js`; `__tests__/accountFlows.test.js` | MMKV | Verified. `hydrateWorkoutPlans()` seeds `plans_brunch_body` and `is_initialized` when missing/unusable. Bootstrap runs hydration, and delete-local-data clears MMKV then runs hydration again. | code, test | medium | yes - keep in delete-copy and boundary-test lanes |
| Archive | not found | none observed | `docs/architecture/delete-reset-archive-semantics-decision.md`; repo search across `src/screens`, `src/redux`, `src/storage`, `__tests__`, docs | unknown | No global user-facing Archive control, route, action, reducer case, or storage contract was found in current app code. Archive remains a future/domain-specific discovery topic. | code, doc, inferred | medium | yes - `1.2.3.3.5` archive discovery/deferral |
| Journal entry soft-delete flag | current | Modal delete affordance; no `Archive` label observed | `src/screens/journal/pages/Journal/Journal.js`; `src/screens/journal/components/Journal.js`; `src/redux/reducer/journal.js`; `src/screens/setting/pages/Export To CSV/ExportToCSV.js` | Redux | Journal delete edits the entry subtype to `isDeleted: true`; the Journal list hides entries where that subtype is deleted. Export code deletes the `isDeleted` field from exported row data. This is delete-like or soft-delete-like behavior, not an approved Archive feature. | code | medium | yes - domain-specific archive/delete discovery |
| Journal form `Clear Entry` | current | `Clear Entry` | `src/screens/journal/pages/DailyEntry/DailyEntry.js`; `src/screens/journal/pages/WeightLog/WeightLog.js`; `src/screens/journal/pages/Calories/Calories.js`; `src/screens/journal/pages/SupplementLog/SupplementLog.js`; `src/screens/journal/pages/WeeklyEntry/WeeklyEntry.js`; `src/screens/journal/pages/QuarterlyEntry/QuarterlyEntry.js` | Redux only if user later saves changed form state; otherwise local component state | Clear Entry resets form fields and local modal state. It is not the same as Delete local data and is not evidence of exported-file deletion. | code, test | medium | yes - copy/test follow-on if needed |
| Calendar theme delete/clear/remove | current | `Add / Remove`, `Clear`, remove-success messages; no `Archive` label observed | `src/screens/calendar/pages/calendar/Calendar.js`; `src/redux/actions/calendar.js`; `src/redux/reducer/calendar.js`; `__tests__/calendarThemeRepeatedThemeBoundary.test.js`; `__tests__/calendarTodoFormUxBoundary.test.js` | Redux | Calendar supports deleting a theme, clearing current theme state, recording cleared theme days, and adding dates to repeated-theme `deletedThemes`. This can hide or remove theme occurrences but is domain-specific calendar behavior, not a global archive contract. | code, test | medium | yes - `1.2.3.3.5` domain-specific archive deferral |
| Calendar todo delete | current | Delete/clear task affordance; success copy says todo removed | `src/screens/calendar/pages/calendar/Calendar.js`; `src/screens/calendar/components/EditTodo.js`; `src/redux/actions/todo.js`; `src/redux/reducer/todo.js`; `__tests__/calendarTodoFormUxBoundary.test.js` | Redux | Todo deletion removes a task by id from the persisted todo slice. It does not imply full local data deletion. | code, test | low | no, unless included in archive/delete-domain cleanup |
| Nutrition meal/supplement delete | current | Delete affordances in meal/supplement UI | `src/redux/actions/nutrition.js`; `src/redux/reducer/nutrition.js`; `src/screens/nutrition/components/Meal.js`; `src/screens/nutrition/components/Supplement.js`; `__tests__/nutritionFormUxBoundary.test.js`; `__tests__/nutritionSupplementContract.test.js` | Redux | Nutrition reducers remove meals, meal items, supplements, and supplement items from persisted Redux state. | code, test | low | no, unless copy/domain tests are expanded |
| Recreation routine/workout/custom-plan delete | current | Delete affordances in routine, workout, program, and exercise UI | `src/redux/actions/recreation.js`; `src/redux/reducer/recreation.js`; `src/screens/recreation/pages/EditRoutine/EditRoutine.js`; `src/screens/recreation/pages/MyExercises/MyExercises.js`; `__tests__/recreationFormUxBoundary.test.js`; `__tests__/recreationSliceBoundary.test.js` | Redux | Recreation reducers remove routines, routine tasks, custom plans, and workouts from persisted Redux state. | code, test | low | no, unless copy/domain tests are expanded |
| Exercise delete | current | Delete affordance in My Exercises UI | `src/redux/actions/exercise.js`; `src/redux/reducer/exercise.js`; `src/screens/recreation/pages/MyExercises/MyExercises.js`; `__tests__/exerciseMergeDirectoryBoundary.test.js` | Redux | Exercise delete removes a custom exercise and then dispatches merge behavior so the exercise list reflects directory plus custom data. | code, test | low | no, unless domain deletion tests are expanded |
| Malformed direct-storage cleanup | internal-only | none observed | `src/redux/actions/profileStorage.js`; `src/redux/actions/nutritionStorage.js`; `src/redux/actions/exerciseStorage.js`; `src/redux/actions/calendarThemeStorage.js`; `src/redux/actions/todoStorage.js`; storage-boundary tests | AsyncStorage | Storage readers remove malformed or invalid direct-key payloads for specific keys. This is repair behavior, not a user-facing delete/reset control. | code, test | medium | no, unless migration/repair policy changes |

## Delete Local Data Surface

Status: current.

The current live Settings list exposes a `Delete local data` section and row in `src/screens/setting/pages/Setting/Setting.js`, routing to `SETTINGS_ROUTES.DELETE_ACCOUNT`. The destination screen renders visible copy headed `Delete local data`, a confirmation statement, and a `Delete Local Data` button in `src/screens/setting/components/My Profile/DeleteAccount.js`.

Execution is implemented through internal account-named code:

- `src/screens/setting/pages/MyProfile/DeleteAccount.js` calls the `deleteUserAccount` prop after confirmation and resets navigation to `ROOT_ROUTES.COMPLETE_PROFILE` after the success modal is acknowledged.
- `src/redux/actions/auth.js` exports `deleteAccount()`, dispatches `{ type: RESET_APP }`, calls `AsyncStorage.clear()`, calls `storage.clearAll()`, and then calls `hydrateWorkoutPlans()`.
- `__tests__/accountFlows.test.js` covers confirmation-gating, the success path, `RESET_APP`, `AsyncStorage.clear()`, `storage.clearAll()`, starter-plan hydration, and the expected post-success navigation reset.

Trust risk: high. The visible user-facing label is local-data scoped, but route/action/component names still contain `DeleteAccount`. Current copy and tests reduce risk, but later lanes should avoid treating internal names as product claims.

## Internal Reset Surface

Status: internal-only.

`RESET_APP` is defined in `src/redux/constants/constants.js` and intercepted in `src/redux/store/store.js`. By itself, it resets Redux reducer state through `appReducer(undefined, action)`. It does not directly call AsyncStorage or MMKV APIs.

The only current inspected path that pairs `RESET_APP` with broad storage clearing is `deleteAccount()` in `src/redux/actions/auth.js`. Future tests and copy should not describe `RESET_APP` alone as a complete local data deletion path.

Trust risk: medium. Internal reset vocabulary can be overread as a user-facing Reset app feature if copied into docs or UI without this boundary.

## Logout Surface

Status: internal-only.

`logout()` exists in `src/redux/actions/auth.js`. It calls scoped local auth cleanup with `AsyncStorage.multiRemove(getScopedLogoutKeys())`, then dispatches `CLEAR_USER`. The scoped keys are profile, local password, local password-reset request, and onboarding draft keys.

Current Settings UI evidence does not show a visible logout entry. `__tests__/accountFlows.test.js` explicitly asserts that Settings no longer exposes a `Logout` entry in the Phase 1 surface, and also asserts that `logout()` does not call `AsyncStorage.clear()`, `storage.clearAll()`, or `hydrateWorkoutPlans()`.

Trust risk: medium. Logout is materially narrower than Delete local data and must stay separate in future copy, docs, and tests.

## Reset Password Surface

Status: ambiguous.

The auth action exists and is covered by tests:

- `src/redux/actions/auth.js` exports `resetPassword({ email })`.
- The action loads the stored profile, verifies the saved local email, removes `local_password`, and writes `local_password_reset_requested_at`.
- `__tests__/accountFlows.test.js` verifies that resetPassword removes `local_password` and writes the reset request timestamp.

The UI files also exist:

- `src/screens/setting/pages/MyProfile/MyPassword.js`
- `src/screens/setting/components/My Profile/MyPassword.js`

Those files render labels such as `Forgot Password`, `Reset Local Password`, and `Password Reset Saved`. However, current navigation evidence keeps this ambiguous as a live user-facing surface: `src/navigation/SettingsNavigation.js` does not register `SETTINGS_ROUTES.MY_PASSWORD`, and `src/screens/setting/pages/MyProfile/MyProfile.js` currently routes the primary profile action to `SETTINGS_ROUTES.MY_VITALS`, not MyAccount or MyPassword.

Trust risk: high. Credential-like behavior exists in code and tests, but current reachability is not established from the live Settings stack. Future lanes should separate Reset password from Reset app and Delete local data before any public or user-facing claim is made.

## Exported-File Boundary Evidence

Verification result: verified.

Current export behavior is selected journal export to an Excel workbook:

- `src/screens/setting/pages/Setting/Setting.js` exposes Settings `Export data` and row `Export journal data`.
- `src/screens/setting/components/Export To CSV/ExportToCSV.js` renders `Export Journal Data` and says selected journal entries export as an Excel workbook (`.xlsx`).
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js` creates an XLSX workbook and writes it through `react-native-fs` or `react-native-scoped-storage`.
- `__tests__/exportTransparencyCopy.test.js` verifies the `.xlsx` copy, sensitivity copy, output filename pattern, and exported-file responsibility copy.

Delete-local-data boundary copy is aligned in the inspected current app:

- Export screen copy says exported files may contain personal information and that files saved outside the app are not removed by Delete local data.
- Delete local data screen and success copy say exported, copied, shared, uploaded, or externally saved files are not deleted.

No in-app control was found that deletes already exported files from user-selected filesystem or document-tree locations. Exported-file deletion outside app-managed storage remains user-managed and outside the current Delete local data guarantee.

## Bundled Starter Content / Reseeding Evidence

Verification result: verified.

Bundled starter plan reseeding is current behavior:

- `src/storage/mmkv/keys.js` defines `is_initialized` and `plans_brunch_body`.
- `src/storage/mmkv/hydration.js` reads the MMKV sentinel and payload, writes bundled `brunchBodyPlans` through `setJSON(...)` when missing or unusable, and sets `is_initialized`.
- `src/bootstrap/AppBootstrap.js` calls `hydrateWorkoutPlans()` during startup.
- `src/redux/actions/auth.js` calls `hydrateWorkoutPlans()` after broad local data clearing in the delete-local-data path.
- `__tests__/mmkvHydration.test.js` verifies reseeding for false/missing/malformed/unusable MMKV state and preservation for usable stored bundled plans.
- `__tests__/accountFlows.test.js` verifies delete-local-data invokes starter-plan hydration after clearing storage.

Current user-facing delete-local-data copy says starter plans included with Brunch Body may appear again after setup. Based on code and tests, this is app-provided starter content reseeding, not restored user data.

## Archive-Like Behavior Search

Global Archive status: not found.

No current global user-facing `Archive` control, route, action, reducer case, or storage key was found in the inspected app code. The term appears in architecture documents as future/deferral language and in unrelated release/document-history contexts, not as a live app feature.

Archive-like or soft-delete-like current behavior does exist in specific domains:

- Journal entries use an `isDeleted` flag at the entry-subtype level. The Journal list hides subtype entries marked deleted.
- Calendar repeated themes use `deletedThemes` date arrays and `clearedThemeDays` state to suppress theme occurrences or record cleared ranges.
- Domain reducers remove records from arrays for todo, nutrition, recreation, and exercise.

These behaviors should not be collapsed into one Archive product claim. A future archive lane must define the domain, data class, visibility, recoverability, export behavior, deletion relationship, and reset interaction before copy, docs, tests, or implementation proceed.

## Domain-Level Delete / Remove / Clear Surface Inventory

Journal:

- `src/screens/journal/pages/Journal/Journal.js` marks a selected entry subtype as `isDeleted: true` through `editJournalEntry`.
- `src/screens/journal/components/Journal.js` renders saved entries only when the subtype exists and is not deleted.
- Entry forms under `src/screens/journal/pages/**` expose `Clear Entry`, which resets form-local fields and modal state. This is not a broad storage deletion control.
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js` removes `isDeleted` from exported row data before pushing selected journal rows into the workbook payload.

Calendar:

- `src/redux/actions/calendar.js` exposes `deleteTheme`, `clearCurrentTheme`, and `clearThemeDays`.
- `src/redux/reducer/calendar.js` removes themes by id, clears current theme state, stores `clearedThemeDays`, and skips repeated theme dates found in `deletedThemes`.
- `src/screens/calendar/pages/calendar/Calendar.js` wires remove/clear interactions for themes and todo deletion.
- Calendar todo deletion re-exports the todo action from `src/redux/actions/todo.js`, and `src/redux/reducer/todo.js` removes tasks by id.

Nutrition:

- `src/redux/actions/nutrition.js` exposes `deleteMeal`, `deleteMealItem`, `deleteSupplement`, and `deleteSupplementItem`.
- `src/redux/reducer/nutrition.js` removes matching meals, supplements, and nested items from persisted Redux slice state.

Recreation and exercise:

- `src/redux/actions/recreation.js` exposes deletion actions for routines, routine tasks, custom plans, and workouts.
- `src/redux/reducer/recreation.js` removes items from the matching arrays by index/id.
- `src/redux/actions/exercise.js` exposes `deleteExercise`, then dispatches `MERGE_EXERCISES`.
- `src/redux/reducer/exercise.js` removes custom exercises from exercise arrays.

Storage repair:

- Direct storage readers in profile, nutrition, exercise, calendar-theme, journal-traits, and todo storage helpers remove malformed or invalid specific keys through `AsyncStorage.removeItem(...)`.
- These are internal repair paths, not user-facing deletion controls.

## Current Trust and Disclosure Risks

- Delete local data is current and broad, but internal implementation names still say `DeleteAccount` / `deleteAccount`. Future user-facing copy and public docs should use the local-data vocabulary from the decision record unless behavior changes.
- `RESET_APP` is internal Redux reset behavior. It should not be described as deleting all local data unless paired with the verified storage-clearing path.
- Logout is narrower than Delete local data. It clears scoped auth/profile/onboarding draft keys and Redux auth state, not all app data, MMKV, or exported files.
- Reset password code and tests exist, but live Settings reachability is ambiguous in the current checkout. It must not be described as a visible current app feature without a reachability lane or implementation update.
- Exported files are outside app-managed storage after export. Delete local data currently does not delete exported files saved, copied, shared, uploaded, or otherwise managed outside the app.
- Starter plans can reappear after local data clearing because MMKV bundled-plan hydration runs after delete-local-data storage clearing. This is app-provided starter content, not restored user data.
- Archive is not a current global control. Journal `isDeleted`, calendar `deletedThemes`, and other domain remove/clear behavior should be audited domain-by-domain before any Archive vocabulary is introduced.

## Follow-On Lane Recommendations

- `1.2.3.3.2 Delete Local Data Copy and Confirmation Clarity`: refine user-facing delete-local-data copy only after preserving exported-file and starter-content boundaries.
- `1.2.3.3.3 Delete Local Data Execution Boundary Tests`: add focused tests that prove AsyncStorage/MMKV/Redux/exported-file/starter-content boundaries without changing behavior.
- `1.2.3.3.4 Reset Password vs. Reset App Language Separation`: separate credential reset, internal reset, logout, and delete-local-data semantics; resolve whether MyPassword is intentionally unreachable or future residue.
- `1.2.3.3.5 Archive Control Discovery and Deferral Rule`: classify journal soft delete, calendar cleared/repeated-theme behavior, and domain removals without introducing a global Archive feature.
- `1.2.3.3.7 Public Docs and Disclosure Alignment`: align README, public docs, privacy/support/store language only after current app behavior and tests are verified.
- Optional cleanup lane: internal naming residue for `DeleteAccount`, `deleteAccount`, and `ExportToCSV`, if route/action renames are desired later with compatibility tests.

## Non-Approvals

This audit does not approve:

- app behavior changes
- source-code refactors
- user-facing copy changes
- test changes
- README changes
- public-doc changes
- privacy-policy changes
- store or platform disclosure changes
- export, import, restore, backup, sync, account, or cloud behavior changes
- exported-file deletion behavior
- storage behavior changes
- archive implementation
- new delete/reset/archive controls
- backend deletion behavior
- operating-system backup or device-transfer claims
- broad Settings redesign
- legal, medical, clinical, HIPAA, launch-readiness, or store-readiness claims
