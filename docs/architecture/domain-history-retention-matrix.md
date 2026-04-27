# Domain History Retention Matrix
## Status and Scope

This is an internal architecture matrix only.

It verifies current domain-history retention behavior for non-profile and non-journal domains: nutrition, calendar, exercise, recreation, and todo.

This document does not change app behavior.

This document does not change Settings copy.

This document does not change README/public docs.

This document does not change privacy policy, store language, or disclosures.

This document does not approve new deletion/reset/export/import/restore/archive behavior.

This document does not approve backend/cloud/sync behavior.

This document does not change any domain reducer, action, storage helper, key, or UI.

This document is a domain history retention matrix only. It records current behavior without approving behavior, copy, privacy, store, export/import, restore, archive, deletion, domain, backend, cloud, sync, reducer, action, or storage changes.

## Source of Truth

This matrix follows the prior retention lanes:

- `1.2.3.4.1` approved retention/history vocabulary in `docs/architecture/delete-reset-archive-semantics-decision.md`.
- `1.2.3.4.2` inventoried present-state retention/control surfaces in `docs/architecture/retention-and-history-control-surfaces.md`.
- `1.2.3.4.3` defined language rules in `docs/architecture/history-archive-delete-language-rules.md`.
- `1.2.3.4.4` covered profile/auth/onboarding surfaces in `docs/architecture/profile-auth-onboarding-retention-truth-check.md`.
- `1.2.3.4.5` covered journal/export surfaces in `docs/architecture/journal-history-export-retention-truth-check.md`.

Live code wins over older docs. If docs and code disagree, record the mismatch and use live code for current-state claims.

Absence claims mean "no repo-observed path found," not runtime impossibility.

Inferred or unknown rows are explicitly labeled.

## Vocabulary Baseline

| Term | Required treatment |
| --- | --- |
| Domain history | Must be domain-qualified; do not use as universal app-wide history. |
| Nutrition history | Allowed only when tied to verified nutrition surfaces. |
| Calendar history | Allowed only when tied to verified calendar surfaces. |
| Exercise history | Allowed only when tied to verified exercise surfaces. |
| Recreation history | Allowed only when tied to verified recreation/user-created surfaces. |
| Todo history | Allowed only when tied to verified todo surfaces. |
| Compatibility read seam | Evidence of legacy/direct read behavior, not automatically a canonical user-facing history. |
| Bundled/reference data | Must not be described as user-retained history. |
| Delete local data | Preferred phrase for clearing app-managed local data on this device. |
| `deleteAccount()` | Internal implementation identifier only; may be cited as evidence. |
| `RESET_APP` | In-memory Redux reset seam unless paired with storage clearing. |
| exported copy | Only applicable where export is repo-observed. |
| backup | Restricted; do not imply full backup or restore-capable backup. |
| restore/import | Restricted; do not imply support unless implemented and verified. |
| archive | Not current behavior. |
| cloud backup/sync | Forbidden current-state claim unless implemented and verified. |

## Evidence Inputs

| Evidence input | Contribution |
| --- | --- |
| `docs/architecture/delete-reset-archive-semantics-decision.md` | Approved vocabulary for Delete local data, domain-qualified history, exported copy, restricted backup/restore/import terms, and archive/cloud/sync non-claims. |
| `docs/architecture/retention-and-history-control-surfaces.md` | Present-state inventory for persisted Redux root, domain direct keys, compatibility read seams, logout, `RESET_APP`, current internal `deleteAccount()`, MMKV re-seed, and import/restore/archive absence. |
| `docs/architecture/history-archive-delete-language-rules.md` | Language rules for internal identifiers, mismatch candidates, domain-qualified history, exported-copy boundaries, and follow-on lane routing. |
| `docs/architecture/profile-auth-onboarding-retention-truth-check.md` | Scope pattern and lifecycle evidence for scoped logout, `RESET_APP`, and Delete local data/current `deleteAccount()` behavior. |
| `docs/architecture/journal-history-export-retention-truth-check.md` | Journal/export boundary evidence; useful to prevent applying journal export findings automatically to nutrition/calendar/exercise/recreation/todo. |
| `docs/architecture/persistence-inventory.md` | Persistence topology: Redux Persist root, direct AsyncStorage domain keys, MMKV bundled-plan sidecar, one-way journal export, and no repo-observed import/restore complement. |
| `docs/architecture/storage-contract-matrix.md` | Storage owner labels for persisted root, compatibility read seams, and MMKV sidecar/reference store; some older helper names are context only where live code moved helpers. |
| `docs/architecture/store-and-middleware-review.md` | Persisted store whitelist, thunk-shaped action pattern, domain local-only guards, reducer-owned derived state, logout/delete-account distinctions, and calendar/todo ownership seam. |
| `README.md` | Public/contextual local-first and storage wording; useful for mismatch awareness but not stronger than live code. |
| `src/redux/store/store.js` | Persisted store whitelist evidence for `nutrition`, `calendar`, `exercise`, `recreation`, and `todo`; `RESET_APP` root reducer behavior. |
| `src/redux/actions/nutrition.js` and `src/redux/reducer/nutrition.js` | Nutrition read/write/delete evidence for meals, supplements, meal categories, meal directory, nested meal items, and nested supplement items. |
| `src/redux/actions/nutritionStorage.js` | Direct AsyncStorage compatibility read and malformed/non-array repair evidence for `meals`, `supplements`, `meal_categories`, and `meals_directory`. |
| `src/redux/actions/calendar.js`, `src/redux/reducer/calendar.js`, and `src/redux/selectors/calendar.js` | Calendar theme action/reducer evidence, repeated-theme projection, cleared-day state, and calendar-facing todo re-export seam. |
| `src/redux/actions/calendarThemeStorage.js` | Direct AsyncStorage compatibility read and repair evidence for `themes`. |
| `src/redux/actions/exercise.js` and `src/redux/reducer/exercise.js` | Exercise user exercise, exercise directory, merge/projection, add/edit/delete, and directory/reference distinction evidence. |
| `src/redux/actions/exerciseStorage.js` | Direct AsyncStorage compatibility read and repair evidence for `exercises` and `exercise_directory`. |
| `src/redux/actions/recreation.js` and `src/redux/reducer/recreation.js` | Recreation routines, workouts, custom plans, week plans, completed workouts, bundled-plan reads, and reducer delete/remove behavior. |
| `src/redux/actions/recreationStorage.js` | Direct AsyncStorage compatibility reads for `routines` and `workouts`, plus MMKV `plans_brunch_body` read path. |
| `src/redux/actions/todo.js` and `src/redux/reducer/todo.js` | Todo read/write/delete evidence for `todos` and persisted `todo.todoTasks`. |
| `src/redux/actions/todoStorage.js` | Direct AsyncStorage compatibility read and repair evidence for `todos`. |
| `src/storage/asyncStorageJson.js` | Shared direct AsyncStorage JSON helper context; not a current domain import/export path. |
| `src/storage/mmkv/index.js`, `src/storage/mmkv/hydration.js`, `src/storage/mmkv/keys.js`, and `src/utils/storageUtils.ts` | MMKV bundled plan sidecar evidence for `is_initialized`, `plans_brunch_body`, hydration, and re-seed behavior. |
| `src/redux/actions/auth.js` | Logout, `RESET_APP`, current internal `deleteAccount()`, `AsyncStorage.clear()`, `storage.clearAll()`, and `hydrateWorkoutPlans()` evidence. |

Minimum evidence classes covered: persisted store whitelist evidence; nutrition action/reducer/storage evidence; calendar action/reducer/storage evidence; exercise action/reducer/storage evidence; recreation action/reducer/storage evidence; todo action/reducer/storage evidence; MMKV bundled plan evidence; delete-local-data/current `deleteAccount()` clearing evidence; prior architecture docs evidence; README/public wording evidence.

## Surface Classification Model

Storage category labels:

- `app-managed local data`
- `persisted Redux state`
- `direct AsyncStorage key`
- `compatibility read seam`
- `sidecar/reference local data`
- `bundled/reference data`
- `not repo-observed`

Domain data category labels:

- `user-created history`
- `user-managed list`
- `reference/catalog data`
- `derived/projection data`
- `compatibility residue`
- `unknown`

Control category labels:

- `domain write/read`
- `compatibility read`
- `scoped logout clear`
- `in-memory reset`
- `full local clear`
- `full local clear plus bundled re-seed`
- `not exported`
- `no repo-observed import`
- `no repo-observed restore`
- `no repo-observed archive`

Evidence category labels:

- `repo-observed`
- `inferred`
- `unknown`

## Nutrition History Surfaces

Nutrition history means nutrition-domain surfaces only. Not every nutrition key is history.

| Domain | Surface/key | Storage engine | Owner / compatibility status | Current read path | Current write path, if repo-observed | Current clear/delete path, if repo-observed | Persisted Redux interaction | Direct AsyncStorage interaction | MMKV interaction | App-managed local data? | Domain data category | Logout interaction | `RESET_APP` interaction | Delete local data/current `deleteAccount()` interaction | Export/import/restore/archive status | Evidence status | Mismatch or follow-on notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| nutrition | persisted Redux nutrition slice | Redux Persist backed by AsyncStorage under repo-authored key `root`; runtime key naming is library-conventional if stated beyond `root` | canonical persisted slice owner for current reducer state | Redux Persist rehydrates `state.nutrition`; screens and journal calories read nutrition state | Nutrition reducer writes through actions such as `GET_MEALS`, `ADD_MEAL`, `DELETE_MEAL`, `GET_SUPPLEMENTS`, `ADD_SUPPLEMENT`, `DELETE_SUPPLEMENT`, `GET_MEAL_CATEGORIES`, and `GET_MEALS_DIRECTORY` | Domain reducer removes meals/supplements and nested meal/supplement items; no nutrition-specific persisted-root purge repo-observed | `nutrition` is whitelisted in `store.js`; reducer state persists through Redux Persist | Overlaps with direct read seams listed below | none repo-observed | yes | mixed: user-managed lists, user-created nutrition entries, reference/catalog projections, compatibility residue | Not touched by logout; logout is scoped auth/profile/onboarding/password clear | In-memory nutrition slice resets through root reducer when `RESET_APP` is dispatched | Removed from AsyncStorage by broad `AsyncStorage.clear()` in current `deleteAccount()` | No repo-observed nutrition export/import/restore/archive; not a full backup | repo-observed for slice/actions/reducer; runtime persisted key naming inferred | Do not collapse all nutrition state into one universal history bucket. |
| nutrition | `meals` | Direct AsyncStorage key plus persisted nutrition slice overlap | compatibility read seam; current reducer state is persisted through Redux root | `readStoredMeals()` in `nutritionStorage.js`; `getMeals()` dispatches `GET_MEALS` | No direct `AsyncStorage.setItem('meals', ...)` repo-observed; `addMeal()`, `deleteMeal()`, and meal item actions mutate reducer state | `deleteMeal()` removes a meal from reducer state; malformed/non-array direct key is removed by helper repair; full local clear removes the direct key | `GET_MEALS`, `ADD_MEAL`, `DELETE_MEAL`, and nested meal-item mutations update persisted slice state | `AsyncStorage.getItem('meals')`; repair can call `AsyncStorage.removeItem('meals')` | none repo-observed | yes | user-created history/user-managed list plus compatibility residue | Not touched by logout | In-memory nutrition state resets only; direct key remains unless storage is cleared separately | Direct key and persisted root removed by broad AsyncStorage clear | Not exported; no repo-observed import/restore/archive | repo-observed for read/repair/reducer paths; compatibility label inferred | Nutrition history wording may reference meals only when tied to verified meals behavior. |
| nutrition | `supplements` | Direct AsyncStorage key plus persisted nutrition slice overlap | compatibility read seam; current reducer state is persisted through Redux root | `readStoredSupplements()` in `nutritionStorage.js`; `getSupplements()` dispatches `GET_SUPPLEMENTS` | No direct `AsyncStorage.setItem('supplements', ...)` repo-observed; `addSupplement()`, `deleteSupplement()`, and supplement item actions mutate reducer state | `deleteSupplement()` removes a supplement from reducer state; malformed/non-array direct key is removed by helper repair; full local clear removes the direct key | `GET_SUPPLEMENTS`, `ADD_SUPPLEMENT`, `DELETE_SUPPLEMENT`, and nested supplement-item mutations update persisted slice state | `AsyncStorage.getItem('supplements')`; repair can call `AsyncStorage.removeItem('supplements')` | none repo-observed | yes | user-created history/user-managed list plus compatibility residue | Not touched by logout | In-memory nutrition state resets only; direct key remains unless storage is cleared separately | Direct key and persisted root removed by broad AsyncStorage clear | Not exported; no repo-observed import/restore/archive | repo-observed for read/repair/reducer paths; compatibility label inferred | Supplement history wording must stay nutrition-qualified and not imply export/restore. |
| nutrition | `meal_categories` | Direct AsyncStorage key plus persisted nutrition slice overlap | compatibility read seam; category data also has bundled resource fallback in reducer initial state | `readStoredMealCategories()` in `nutritionStorage.js`; `getMealCategories()` dispatches `GET_MEAL_CATEGORIES` | No direct write repo-observed; `GET_MEAL_CATEGORIES` updates persisted nutrition state when called | Malformed/non-array direct key is removed by helper repair; full local clear removes the direct key | `mealCategories` is part of persisted nutrition state; initial fallback comes from `resources.mealsDirectory.categories` | `AsyncStorage.getItem('meal_categories')`; repair can call `AsyncStorage.removeItem('meal_categories')` | none repo-observed | yes, if stored locally; fallback is bundled/reference | reference/catalog data or compatibility residue, not automatically user history | Not touched by logout | In-memory nutrition state resets to reducer initial fallback | Direct key and persisted root removed by broad AsyncStorage clear; bundled resource fallback may still be present through app code | Not exported; no repo-observed import/restore/archive | repo-observed for read/repair/reducer fallback | Do not call categories user-retained history without separate evidence. |
| nutrition | `meals_directory` | Direct AsyncStorage key plus persisted nutrition slice overlap | compatibility read seam; directory data also has bundled resource fallback in reducer initial state | `readStoredMealsDirectory()` in `nutritionStorage.js`; `getMealsDirectory()` dispatches `GET_MEALS_DIRECTORY` | No direct write repo-observed; `GET_MEALS_DIRECTORY` updates persisted nutrition state when called | Malformed/non-array direct key is removed by helper repair; full local clear removes the direct key | `mealsDirectory` is part of persisted nutrition state; initial fallback comes from `resources.mealsDirectory.meals` | `AsyncStorage.getItem('meals_directory')`; repair can call `AsyncStorage.removeItem('meals_directory')` | none repo-observed | yes, if stored locally; fallback is bundled/reference | reference/catalog data or compatibility residue, not automatically user history | Not touched by logout | In-memory nutrition state resets to reducer initial fallback | Direct key and persisted root removed by broad AsyncStorage clear; bundled resource fallback may still be present through app code | Not exported; no repo-observed import/restore/archive | repo-observed for read/repair/reducer fallback | Do not treat meal directory/reference content as retained user history. |

## Calendar History Surfaces

Calendar history means calendar-domain surfaces only. Visual/theme configuration and derived repeated-theme projections are not automatically user history.

| Domain | Surface/key | Storage engine | Owner / compatibility status | Current read path | Current write path, if repo-observed | Current clear/delete path, if repo-observed | Persisted Redux interaction | Direct AsyncStorage interaction | MMKV interaction | App-managed local data? | Domain data category | Logout interaction | `RESET_APP` interaction | Delete local data/current `deleteAccount()` interaction | Export/import/restore/archive status | Evidence status | Mismatch or follow-on notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| calendar | persisted Redux calendar slice | Redux Persist backed by AsyncStorage under repo-authored key `root`; runtime key naming is library-conventional if stated beyond `root` | canonical persisted slice owner for current calendar state | Redux Persist rehydrates `state.calendar`; selectors read `themes`, `currentTheme`, `repeatedTheme`, `themesWithFrequency`, and `clearedThemeDays` | Reducer writes via `GET_THEMES`, `ADD_THEME`, `EDIT_THEME`, `DELETE_THEME`, `SET_THEME`, `ADD_REPEATED_THEME`, `EDIT_REPEATED_THEME`, `SET_THEME_WITH_FREQUENCY`, `CLEAR_CURRENT_THEME`, and `CLEAR_THEME_DAYS` | `DELETE_THEME` removes a theme from reducer state; `CLEAR_CURRENT_THEME` clears current/repeated theme state; `CLEAR_THEME_DAYS` records cleared-day state | `calendar` is whitelisted in `store.js`; reducer-derived state persists through Redux Persist | Overlaps with direct `themes` read seam | none repo-observed | yes | user-managed configuration/list plus derived/projection data | Not touched by logout | In-memory calendar state resets through root reducer | Removed from AsyncStorage by broad `AsyncStorage.clear()` in current `deleteAccount()` | No repo-observed calendar export/import/restore/archive | repo-observed | `deletedThemes` and `clearedThemeDays` style behavior must not be promoted to archive. |
| calendar | `themes` | Direct AsyncStorage key plus persisted calendar slice overlap | compatibility read seam; current reducer state is persisted through Redux root | `readStoredThemes()` in `calendarThemeStorage.js`; `getThemes()` dispatches `GET_THEMES`, then recomputes repeated themes | No direct `AsyncStorage.setItem('themes', ...)` repo-observed; `addTheme()`, `editTheme()`, and `deleteTheme()` mutate reducer state | Malformed/non-array direct key is removed by helper repair; `deleteTheme()` removes from reducer state; full local clear removes direct key | `themes` is part of persisted calendar state | `AsyncStorage.getItem('themes')`; repair can call `AsyncStorage.removeItem('themes')` | none repo-observed | yes | user-managed configuration/list plus compatibility residue; not automatically chronological history | Not touched by logout | In-memory calendar state resets only; direct key remains unless storage is cleared separately | Direct key and persisted root removed by broad AsyncStorage clear | Not exported; no repo-observed import/restore/archive | repo-observed for read/repair/reducer paths; compatibility label inferred | Calendar history wording must be domain-qualified and avoid treating themes as user history without context. |
| calendar | repeated theme/theme-derived state | Persisted Redux calendar slice | derived/projection state owned by calendar reducer, not a direct key | `selectCalendarRepeatedTheme()`, `selectCalendarThemesWithFrequency()`, `selectCalendarClearedThemeDays()`, and calendar screen reads | `addRepeatedTheme()`, `editRepeatedTheme()`, `updateThemesWithFrequency()`, `clearThemeDays()`, and reducer `SET_THEME_WITH_FREQUENCY` update derived/projection state | `CLEAR_CURRENT_THEME` clears current/repeated theme; `CLEAR_THEME_DAYS` stores cleared days; no storage purge repo-observed except full local clear | `repeatedTheme`, `userRepeatedThemes`, `themesWithFrequency`, `currentTheme`, and `clearedThemeDays` live inside persisted calendar slice | No direct AsyncStorage key repo-observed for repeated projections separate from `themes` | none repo-observed | yes | derived/projection data and user-managed configuration state | Not touched by logout | In-memory calendar state resets through root reducer | Removed from persisted root by broad AsyncStorage clear | Not exported; no repo-observed import/restore/archive | repo-observed | Derived repeated-theme state is not restore/import/archive behavior. |

## Exercise History Surfaces

Exercise history means exercise-domain surfaces only. Exercise directory/reference data must not be described as user-retained history unless verified separately.

| Domain | Surface/key | Storage engine | Owner / compatibility status | Current read path | Current write path, if repo-observed | Current clear/delete path, if repo-observed | Persisted Redux interaction | Direct AsyncStorage interaction | MMKV interaction | App-managed local data? | Domain data category | Logout interaction | `RESET_APP` interaction | Delete local data/current `deleteAccount()` interaction | Export/import/restore/archive status | Evidence status | Mismatch or follow-on notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| exercise | persisted Redux exercise slice | Redux Persist backed by AsyncStorage under repo-authored key `root`; runtime key naming is library-conventional if stated beyond `root` | canonical persisted slice owner for current exercise state | Redux Persist rehydrates `state.exercise`; screens read user exercises and derived exercise lists | Reducer writes via `GET_EXERCISES`, `GET_EXERCISE_DIRECTORY`, `ADD_EXERCISE`, `EDIT_EXERCISE`, `DELETE_EXERCISE`, and `MERGE_EXERCISES` | `DELETE_EXERCISE` removes custom/user exercise from reducer state and `MERGE_EXERCISES` rebuilds derived lists | `exercise` is whitelisted in `store.js`; reducer state persists through Redux Persist | Overlaps with direct `exercises` and `exercise_directory` read seams | none repo-observed | yes | user-created history/user-managed list plus reference/catalog and derived/projection data | Not touched by logout | In-memory exercise state resets through root reducer | Removed from AsyncStorage by broad `AsyncStorage.clear()` in current `deleteAccount()` | No repo-observed exercise export/import/restore/archive | repo-observed | Do not treat directory/reference data as user-retained history. |
| exercise | `exercises` | Direct AsyncStorage key plus persisted exercise slice overlap | compatibility read seam; current reducer state is persisted through Redux root | `readStoredExercises()` in `exerciseStorage.js`; `getExercises()` dispatches `GET_EXERCISES` | No direct `AsyncStorage.setItem('exercises', ...)` repo-observed; `addExercise()`, `editExercise()`, and `deleteExercise()` mutate reducer state | `deleteExercise()` removes from reducer state; malformed/non-array direct key is removed by helper repair; full local clear removes direct key | `exercises` is part of persisted exercise state; `allExercises` and `wholeExercises` are derived from it | `AsyncStorage.getItem('exercises')`; repair can call `AsyncStorage.removeItem('exercises')` | none repo-observed | yes | user-created history/user-managed list plus compatibility residue | Not touched by logout | In-memory exercise state resets only; direct key remains unless storage is cleared separately | Direct key and persisted root removed by broad AsyncStorage clear | Not exported; no repo-observed import/restore/archive | repo-observed for read/repair/reducer paths; compatibility label inferred | Exercise history wording may apply only to verified user-created exercise data. |
| exercise | `exercise_directory` | Direct AsyncStorage key plus persisted exercise slice overlap and bundled resource fallback | compatibility read seam/reference catalog | `readStoredExerciseDirectory()` in `exerciseStorage.js`; `getExerciseDirectory()` dispatches `GET_EXERCISE_DIRECTORY` | No direct write repo-observed; `GET_EXERCISE_DIRECTORY` updates persisted `exerciseDirectory` when called | Malformed/non-array direct key is removed by helper repair; full local clear removes direct key | `exerciseDirectory` is persisted in exercise slice; reducer filters Brunch Body exercises and derives merged arrays | `AsyncStorage.getItem('exercise_directory')`; repair can call `AsyncStorage.removeItem('exercise_directory')` | none repo-observed | yes, if stored locally; fallback is bundled/reference | reference/catalog data plus compatibility residue | Not touched by logout | In-memory exercise state resets to reducer initial directory fallback from `resources.exercisesDirectory` | Direct key and persisted root removed by broad AsyncStorage clear; bundled resource fallback may still be present through app code | Not exported; no repo-observed import/restore/archive | repo-observed for read/repair/reducer fallback | Exercise directory/reference content is not user-retained history. |

## Recreation History Surfaces

Recreation history means recreation-domain user-created or user-managed surfaces only. Bundled Brunch Body plans and MMKV sidecar data are reference data, not retained user history.

| Domain | Surface/key | Storage engine | Owner / compatibility status | Current read path | Current write path, if repo-observed | Current clear/delete path, if repo-observed | Persisted Redux interaction | Direct AsyncStorage interaction | MMKV interaction | App-managed local data? | Domain data category | Logout interaction | `RESET_APP` interaction | Delete local data/current `deleteAccount()` interaction | Export/import/restore/archive status | Evidence status | Mismatch or follow-on notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| recreation | persisted Redux recreation slice | Redux Persist backed by AsyncStorage under repo-authored key `root`; runtime key naming is library-conventional if stated beyond `root` | canonical persisted slice owner for current recreation state | Redux Persist rehydrates `state.recreation`; screens read routines, workouts, custom plans, week plan, completed workouts, and bundled-plan projections | Reducer writes via `GET_ROUTINES`, `ADD_ROUTINE`, `DELETE_ROUTINE`, routine item actions, `GET_WORKOUTS`, `ADD_WORKOUT`, `EDIT_WORKOUT`, `DELETE_WORKOUT`, custom plan/week plan actions, `ADD_COMPLETED_WORKOUT`, and bundled-plan actions | Reducer removes routines, routine tasks, workouts, and custom plans; no recreation-specific persisted-root purge repo-observed | `recreation` is whitelisted in `store.js`; reducer state persists through Redux Persist | Overlaps with direct `routines` and `workouts` read seams | Receives bundled plan projections read from MMKV | yes | user-created history/user-managed lists, derived/projection data, bundled/reference projections | Not touched by logout | In-memory recreation state resets through root reducer | Persisted root and direct keys removed by broad AsyncStorage clear; MMKV is cleared and bundled plans are re-seeded | No repo-observed recreation export/import/restore/archive | repo-observed | Do not treat all recreation state as user-created history. |
| recreation | `routines` | Direct AsyncStorage key plus persisted recreation slice overlap | compatibility read seam; current reducer state is persisted through Redux root | `readStoredRoutines()` in `recreationStorage.js`; `getRoutines()` dispatches `GET_ROUTINES` | No direct `AsyncStorage.setItem('routines', ...)` repo-observed; `addRoutine()`, `deleteRoutine()`, and routine task actions mutate reducer state | `deleteRoutine()` removes from reducer state; `deleteRoutineTask()` removes nested task from reducer state; no direct-key repair/remove path repo-observed; full local clear removes direct key | `routines` and selected `routineTasks` are part of persisted recreation state | `AsyncStorage.getItem('routines')`; `JSON.parse(...)` without repo-observed malformed-value repair | none repo-observed | yes | user-created history/user-managed list plus compatibility residue | Not touched by logout | In-memory recreation state resets only; direct key remains unless storage is cleared separately | Direct key and persisted root removed by broad AsyncStorage clear | Not exported; no repo-observed import/restore/archive | repo-observed for direct read/reducer paths; compatibility label inferred | Recreation history wording may reference routines only as verified recreation-domain user-created/user-managed data. |
| recreation | `workouts` | Direct AsyncStorage key plus persisted recreation slice overlap | compatibility read seam; current reducer state is persisted through Redux root | `readStoredWorkouts()` in `recreationStorage.js`; `getWorkouts()` dispatches `GET_WORKOUTS` | No direct `AsyncStorage.setItem('workouts', ...)` repo-observed; `addMyWorkout()`, `editMyWorkout()`, and `deleteMyWorkout()` mutate reducer state | `deleteMyWorkout()` removes from reducer state; no direct-key repair/remove path repo-observed; full local clear removes direct key | `workouts` is part of persisted recreation state | `AsyncStorage.getItem('workouts')`; `JSON.parse(...)` without repo-observed malformed-value repair | none repo-observed | yes | user-created history/user-managed list plus compatibility residue | Not touched by logout | In-memory recreation state resets only; direct key remains unless storage is cleared separately | Direct key and persisted root removed by broad AsyncStorage clear | Not exported; no repo-observed import/restore/archive | repo-observed for direct read/reducer paths; compatibility label inferred | Do not imply workout import/restore/archive/cloud behavior. |
| recreation | custom plans, week plans, completed workouts | Persisted Redux recreation slice | reducer-owned persisted state; no separate direct key repo-observed | Redux Persist rehydrates `state.recreation.customPlans`, `weekPlan`, and `completedWorkouts`; screens read those fields | `addCustomPlan()`, `deleteCustomPlan()`, `addWeekPlan()`, `editWeekPlan()`, and `addCompletedWorkout()` dispatch reducer writes | `deleteCustomPlan()` removes custom plan; no direct storage key clear path repo-observed except full local clear | Persisted inside `recreation` slice | No direct AsyncStorage key repo-observed for these specific branches | Bundled-plan reads may also populate `weekPlan` for Brunch Body plans | yes | user-created history/user-managed list or derived/projection data, depending on branch | Not touched by logout | In-memory recreation state resets through root reducer | Removed from persisted root by broad AsyncStorage clear | Not exported; no repo-observed import/restore/archive | repo-observed | No independent direct-key ownership should be invented for these branches. |
| recreation | `is_initialized` | MMKV `workout-storage` | sidecar/reference local data; bundled-plan hydration sentinel | `hydrateWorkoutPlans()` reads `storage.getBoolean(STORAGE_KEYS.IS_INITIALIZED)` | `hydrateWorkoutPlans()` sets sentinel true after seeding bundled plans | `storage.clearAll()` clears it during current `deleteAccount()`; `hydrateWorkoutPlans()` immediately recreates it if needed | Not part of Redux Persist; affects bundled plan availability before recreation reads | none repo-observed | MMKV key `is_initialized` | sidecar/reference local data | bundled/reference data, not user history | Not touched by logout | Not affected by `RESET_APP` alone | Cleared by MMKV clear and then re-created by bundled-plan hydration in current `deleteAccount()` | Not exported; no import/restore/archive; re-seed is not user-history restore | repo-observed | Treat as starter-content metadata only. |
| recreation | `plans_brunch_body` | MMKV `workout-storage` | sidecar/reference store for bundled Brunch Body plan catalog | `readStoredBrunchBodyPlans()` calls `getJSON(STORAGE_KEYS.PLANS.BRUNCH_BODY)`; bundled plan actions dispatch data into recreation slice | `hydrateWorkoutPlans()` writes bundled `brunchBodyPlans` through `setJSON(...)` | `storage.clearAll()` clears it during current `deleteAccount()`; `hydrateWorkoutPlans()` immediately re-seeds bundled plans | Bundled plan data can be projected into `recreation.brunchBodyPlans` and `weekPlan`, but source is MMKV sidecar/reference | none repo-observed | MMKV key `plans_brunch_body` | sidecar/reference local data | bundled/reference data, not user-retained history | Not touched by logout | Not affected by `RESET_APP` alone except projected Redux state resets | Cleared by MMKV clear and re-seeded by current `deleteAccount()` flow | Not exported; no repo-observed import/restore/archive; re-seed is not user-history restore | repo-observed | Bundled starter plans must not be described as retained or restored user data. |

## Todo History Surfaces

Todo history means todo-domain surfaces only. Current evidence supports user-managed todo list items, not chronological history unless a later lane verifies that product meaning.

| Domain | Surface/key | Storage engine | Owner / compatibility status | Current read path | Current write path, if repo-observed | Current clear/delete path, if repo-observed | Persisted Redux interaction | Direct AsyncStorage interaction | MMKV interaction | App-managed local data? | Domain data category | Logout interaction | `RESET_APP` interaction | Delete local data/current `deleteAccount()` interaction | Export/import/restore/archive status | Evidence status | Mismatch or follow-on notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| todo | persisted Redux todo slice | Redux Persist backed by AsyncStorage under repo-authored key `root`; runtime key naming is library-conventional if stated beyond `root` | canonical persisted slice owner for current todo state; legacy slice key preserved | Redux Persist rehydrates `state.todo.todoTasks`; calendar selector reads todo tasks | Reducer writes via `GET_TODO_TASKS`, `ADD_TODO_TASK`, `EDIT_TODO_TASK`, and `DELETE_TODO_TASK` | `DELETE_TODO_TASK` removes task from reducer state; no todo-specific persisted-root purge repo-observed | `todo` is whitelisted in `store.js`; reducer state persists through Redux Persist | Overlaps with direct `todos` read seam | none repo-observed | yes | user-managed list; not automatically chronological history | Not touched by logout | In-memory todo state resets through root reducer | Removed from AsyncStorage by broad `AsyncStorage.clear()` in current `deleteAccount()` | No repo-observed todo export/import/restore/archive | repo-observed | Todo UI is calendar-facing, but persisted slice and storage key remain `todo`/`todos`. |
| todo | `todos` | Direct AsyncStorage key plus persisted todo slice overlap | compatibility read seam owned by legacy todo action/storage path; calendar re-exports todo actions | `readStoredTodos()` in `todoStorage.js`; `getTodo()` dispatches `GET_TODO_TASKS`; calendar actions re-export `getCalendarTodoTasks` | No direct `AsyncStorage.setItem('todos', ...)` repo-observed; `addTodo()`, `editTodo()`, and `deleteTodo()` mutate reducer state | `deleteTodo()` removes from reducer state; malformed/non-array direct key is removed by helper repair; full local clear removes direct key | `todoTasks` is part of persisted `todo` slice | `AsyncStorage.getItem('todos')`; repair can call `AsyncStorage.removeItem('todos')` | none repo-observed | yes | user-managed list plus compatibility residue | Not touched by logout | In-memory todo state resets only; direct key remains unless storage is cleared separately | Direct key and persisted root removed by broad AsyncStorage clear | Not exported; no repo-observed import/restore/archive | repo-observed for read/repair/reducer paths; compatibility label inferred | Do not treat todos as chronological history or backup/import/restore evidence. |

## Cross-Domain Clearing and Lifecycle Matrix

| Control | Required interpretation |
| --- | --- |
| Domain write/read | Current domain-specific lifecycle, if verified. Nutrition, calendar, exercise, recreation, and todo actions dispatch reducer writes/reads, and persisted slices write through Redux Persist. |
| Compatibility read | Direct key read behavior; not necessarily canonical ownership. Keys such as `meals`, `supplements`, `meal_categories`, `meals_directory`, `themes`, `exercises`, `exercise_directory`, `routines`, `workouts`, and `todos` are direct read seams that overlap persisted slices. |
| Logout | Scoped auth/profile/onboarding/password clear only unless domain clearing is repo-observed. Current logout does not clear nutrition, calendar, exercise, recreation, todo, or MMKV bundled plan keys. |
| `RESET_APP` | In-memory Redux reset seam; not storage wipe by itself. Current root reducer rebuilds slice state from `undefined` when paired with the action. |
| Delete local data/current `deleteAccount()` | Full local clear path for AsyncStorage plus MMKV clear/reseed if verified by prior inventory/live code. Current internal `deleteAccount()` dispatches `RESET_APP`, calls `AsyncStorage.clear()`, calls `storage.clearAll()`, then calls `hydrateWorkoutPlans()`. |
| MMKV bundled re-seed | Reference/bundled data restoration only; not user-history restore. It re-seeds `is_initialized` and `plans_brunch_body` for bundled Brunch Body starter plans. |
| Export | No repo-observed domain export unless verified. Prior journal export findings do not automatically apply to nutrition, calendar, exercise, recreation, or todo. |
| Import/restore | No repo-observed current domain import/restore control unless verified. |
| Archive | Not current behavior. Delete/remove/clear/derived projection/repair/re-seed behavior is not archive. |
| Backend/cloud/sync | No repo-observed current control. Do not claim cloud backup, cloud sync, backend deletion, or cloud deletion. |

## Export, Backup, Restore, and Archive Boundary

Domain data is app-managed local data unless exported by a repo-observed flow.

Prior journal export findings do not automatically apply to nutrition, calendar, exercise, recreation, or todo.

No domain import/restore support should be claimed unless verified.

No archive behavior should be claimed.

No cloud backup/sync/deletion should be claimed.

No backend domain deletion should be claimed.

`backup` remains restricted and must not be used unless paired with explicit limitation and approved in a later public-doc/copy lane.

The current repo-observed export flow is selected journal workbook export, not a full-app or cross-domain export. This matrix does not approve any nutrition, calendar, exercise, recreation, or todo export/import/restore behavior.

Bundled recreation plan re-seed after Delete local data is app-provided starter/reference content appearing again. It is not a backup, restore, import, archive, cloud sync, or retained user history path.

## Current Mismatches and Follow-On Notes

- Compatibility-read seams should be investigated before public docs generalize "history."
- Direct keys must not be presented as independent current user-facing histories unless verified.
- Bundled/reference recreation data must not be described as user-retained history.
- MMKV bundled plan re-seed must not be described as restore of user history.
- Nutrition `meal_categories` and `meals_directory` can involve reference/catalog data and compatibility residue; do not call all nutrition keys history.
- Calendar themes and repeated-theme projections can look like planning history, but current evidence is theme/configuration and derived/projection state unless later work defines otherwise.
- Exercise `exercise_directory` can involve reference/catalog data; do not treat it as user-created exercise history.
- Todo `todos` is a user-managed list seam, not proven chronological history.
- Any uncertainty about domain export/import/restore should be labeled and routed to follow-on tests/docs.
- Future Settings/export copy alignment belongs to `1.2.3.4.7`.
- Future regression tests belong to `1.2.3.4.8`.
- Public docs/README alignment belongs to `1.2.3.4.9`.
- Final closeout belongs to `1.2.3.4.10`.

## Non-Claims

This lane does not claim:

- full-app backup
- automatic backup
- cloud backup
- cloud sync
- cloud deletion
- backend domain deletion
- domain import support
- domain restore support
- archive support
- deletion of exported files
- deletion of OS backups
- deletion of cloud-folder copies
- deletion of shared/uploaded files
- guaranteed recovery
- bundled plan re-seed as user-history restore
- domain storage migration
- domain data model approval
- privacy policy readiness
- store disclosure readiness
- launch readiness
- legal review completion

## Validation

Required validation:

```sh
git diff --check
```

Focused text check:

```sh
rg -n "nutrition|meals|supplements|meal_categories|meals_directory|calendar|themes|exercise|exercises|exercise_directory|recreation|routines|workouts|todos|plans_brunch_body|is_initialized|backup|restore|import|archive|domain_history_retention_matrix_recorded" docs/architecture/domain-history-retention-matrix.md
```

Final status check:

```sh
git status --short --untracked-files=all
```

Scope validation:

- Confirm exactly one new file is created for this lane: `docs/architecture/domain-history-retention-matrix.md`.
- Confirm no existing files are modified.
- Confirm the required heading order is present.
- Confirm the required exact scope sentence is present.
- Confirm persisted Redux nutrition, calendar, exercise, recreation, and todo slices are covered.
- Confirm direct keys `meals`, `supplements`, `meal_categories`, `meals_directory`, `themes`, `exercises`, `exercise_directory`, `routines`, `workouts`, and `todos` are covered.
- Confirm MMKV bundled/reference plan keys `is_initialized` and `plans_brunch_body` are covered.
- Confirm logout, `RESET_APP`, and Delete local data/current `deleteAccount()` behavior are distinguished.
- Confirm no repo-observed import/restore/archive/backend/cloud/sync behavior is claimed unless verified.
- Confirm inferred or unknown claims are labeled.
- Confirm the artifact ends with the sentinel below.

domain_history_retention_matrix_recorded
