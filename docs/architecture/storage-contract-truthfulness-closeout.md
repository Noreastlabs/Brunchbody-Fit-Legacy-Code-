# Storage Contract Truthfulness Closeout

## Purpose / Scope

This artifact is a docs-only closeout audit of whether the current branch's storage docs still match the current branch's storage code after the `1.1.4.2.x` normalization sequence.

- This is a closeout audit, not a behavior lane.
- This audit treats the working branch, not public `main`, as the branch of record.
- Current branch code is the source of truth for every row in this audit.
- The audit fails closed when branch evidence is missing.
- This artifact does not normalize drift, patch stale docs, prescribe code changes, or reopen reset, migration, or import/export design.

Expected normalization outcomes were treated as verification targets, not assumed facts. The audit directly checked the working branch for the persisted Redux root contract, the current auth/profile/onboarding ownership surface, helper-module presence, helper-module imports, legacy module residue such as `authStorage.js`, helper-versus-inline read seams in the scoped domains, and recreation's AsyncStorage/MMKV/bootstrap/delete-account adjacency.

Scoped storage surfaces covered here:

- persisted Redux root and whitelist
- auth / profile / onboarding ownership
- calendar themes
- todo todos
- exercise exercises
- journal traits
- nutrition direct keys: `meals`, `supplements`, `meal_categories`, `meals_directory`
- recreation seams: `routines`, `workouts`, `plans_brunch_body`, plus hydration and delete-account adjacency

## Evidence Sources Reviewed

Required code surfaces reviewed on the working branch:

- `src/redux/store/store.js`
- `src/redux/actions/auth.js`
- `src/redux/actions/profileStorage.js`
- `src/redux/actions/onboardingStorage.js`
- `src/redux/actions/calendar.js`
- `src/redux/actions/calendarThemeStorage.js`
- `src/redux/actions/todo.js`
- `src/redux/actions/todoStorage.js`
- `src/redux/actions/exercise.js`
- `src/redux/actions/exerciseStorage.js`
- `src/redux/actions/journal.js`
- `src/redux/actions/journalTraitsStorage.js`
- `src/redux/actions/nutrition.js`
- `src/redux/actions/nutritionStorage.js`
- `src/redux/actions/recreation.js`
- `src/redux/actions/recreationStorage.js`
- `src/storage/mmkv/keys.js`
- `src/storage/mmkv/hydration.js`
- `src/bootstrap/AppBootstrap.js`
- `src/redux/actions/index.js`

Required doc surfaces reviewed:

- `docs/architecture/storage-contract-matrix.md`
- `docs/architecture/persistence-inventory.md`
- `docs/architecture/store-and-middleware-review.md`

Additional `docs/architecture` candidate surfaces reviewed because the working-branch versions still made scoped storage-owner, storage-key, bootstrap-read, hydration, or clear-path claims:

- `docs/architecture/action-reducer-cleanup-closeout-audit.md`
- `docs/architecture/app-structure-inventory.md`
- `docs/architecture/risk-and-coupling-audit.md`
- `docs/architecture/slice-migration-path-phase-1.md`
- `docs/architecture/stale-architecture-doc-reconciliation.md`

Audit rules applied during review:

- Named extra docs were treated as candidate review surfaces, not guaranteed evidence.
- Extra docs were included only when the working-branch version still made a scoped storage claim.
- If a required evidence surface had been missing on the branch, this audit would have recorded that fact instead of substituting public-main evidence.
- Helper-module presence and imports were verified directly on the working branch rather than assumed from earlier lane intent.

Branch verification targets confirmed during this closeout:

- `src/redux/store/store.js` still defines one persisted Redux root with key `root` and whitelist entries `auth`, `recreation`, `journal`, `nutrition`, `calendar`, `exercise`, and `todo`.
- `src/bootstrap/AppBootstrap.js` currently resolves initial route through `hasStoredProfile()` imported from `src/redux/actions/profileStorage.js`.
- Working-branch helper modules were found for `profileStorage`, `onboardingStorage`, `calendarThemeStorage`, `todoStorage`, `exerciseStorage`, `journalTraitsStorage`, `nutritionStorage`, and `recreationStorage`.
- A working-branch file search did not find `src/redux/actions/authStorage.js`.
- Calendar, todo, journal, nutrition, and recreation now delegate their scoped reads through helper modules; exercise is mixed on branch because `getExercises()` uses `exerciseStorage.js` while `exercise_directory` still uses an inline `AsyncStorage` helper inside `exercise.js`.
- Recreation still spans AsyncStorage helper reads, MMKV bundled-plan reads, bootstrap hydration, and delete-account rehydration adjacency.

## Truthfulness Register

| Doc Surface | Claim Summary | Code Evidence Surface | Status | Short Note / Follow-On |
| --- | --- | --- | --- | --- |
| `docs/architecture/storage-contract-matrix.md` | The persisted Redux root uses one `root` key with whitelist entries `auth`, `recreation`, `journal`, `nutrition`, `calendar`, `exercise`, and `todo`. | `src/redux/store/store.js`; `src/root-container/RootContainer.js` | `aligned` | Root key and whitelist still match the current branch. No follow-on needed for this claim cluster. |
| `docs/architecture/persistence-inventory.md` | The app still uses one AsyncStorage-backed Redux root with the same persisted slice set. | `src/redux/store/store.js`; `src/root-container/RootContainer.js` | `aligned` | The higher-level persisted-root inventory remains truthful on the working branch. |
| `docs/architecture/store-and-middleware-review.md` | Bootstrap resolves initial route through `hasStoredProfile()` from `src/redux/actions/authStorage.js`, and auth storage helper ownership is centered in `authStorage.js`. | `src/bootstrap/AppBootstrap.js`; `src/redux/actions/profileStorage.js`; `src/redux/actions/onboardingStorage.js`; `src/redux/actions/auth.js` | `stale` | Current branch imports `hasStoredProfile()` from `profileStorage.js`, splits onboarding helpers into `onboardingStorage.js`, and no working-branch `authStorage.js` file was found. Narrow docs-only refresh needed if this doc is kept current. |
| `docs/architecture/storage-contract-matrix.md` | `user_profile` and onboarding draft ownership are evidenced through `src/redux/actions/authStorage.js`. | `src/redux/actions/profileStorage.js`; `src/redux/actions/onboardingStorage.js`; `src/redux/actions/auth.js`; `src/bootstrap/AppBootstrap.js` | `stale` | The storage overlap is still real, but the cited module is stale on the branch. Current branch splits profile ownership into `profileStorage.js` and onboarding draft ownership into `onboardingStorage.js`. |
| `docs/architecture/slice-migration-path-phase-1.md` | `src/redux/actions/authStorage.js` defines `USER_PROFILE_KEY` plus onboarding draft keys and remains part of the frozen auth/reset contract. | `src/redux/actions/profileStorage.js`; `src/redux/actions/onboardingStorage.js`; `src/redux/actions/auth.js` | `stale` | The contract still exists, but the doc ties it to a removed module. Refresh should preserve the contract while updating helper ownership names. |
| `docs/architecture/app-structure-inventory.md` | `AppBootstrap` reads `AsyncStorage.getItem('user_profile')` directly, and onboarding screens write and read onboarding/profile storage directly from UI code. | `src/bootstrap/AppBootstrap.js`; `src/redux/actions/profileStorage.js`; `src/redux/actions/onboardingStorage.js`; `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`; `src/screens/completeProfile/pages/completeProfile/DateOfBirth.js`; `src/screens/completeProfile/pages/completeProfile/Height.js`; `src/screens/completeProfile/components/RadioButtons.js` | `stale` | The branch still uses local storage for these surfaces, but the direct inline ownership description is outdated because the screens now call storage helpers rather than calling `AsyncStorage` directly for the scoped audit surfaces. |
| `docs/architecture/risk-and-coupling-audit.md` | Boot-path and mixed-persistence notes still describe `AppBootstrap`, onboarding screens, and `auth.js` as directly reading and writing `user_profile` or onboarding keys inline. | `src/bootstrap/AppBootstrap.js`; `src/redux/actions/profileStorage.js`; `src/redux/actions/onboardingStorage.js`; `src/redux/actions/auth.js`; `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js` | `stale` | The coupling risk remains real, but the implementation detail has shifted from inline calls to helper-module delegation for the scoped branch contract. |
| `docs/architecture/stale-architecture-doc-reconciliation.md` | `resolveInitialRouteName()` still reads `AsyncStorage.getItem('user_profile')` directly during bootstrap. | `src/bootstrap/AppBootstrap.js`; `src/redux/actions/profileStorage.js` | `stale` | Bootstrap still gates on local profile presence, but the branch now does that through `profileStorage.js`, not a direct inline `AsyncStorage.getItem(...)` call. |
| `docs/architecture/persistence-inventory.md` | The calendar themes seam is a direct-key compatibility read backed by Redux-persisted calendar state and no repo-observed direct write path. | `src/redux/actions/calendar.js`; `src/redux/actions/calendarThemeStorage.js`; `src/redux/store/store.js` | `aligned` | The working branch still treats `themes` as a compatibility read seam, now delegated through `calendarThemeStorage.js`. |
| `docs/architecture/storage-contract-matrix.md` | `getThemes()` calls `loadStoredThemes()` and documents the calendar seam through older inline/helper naming. | `src/redux/actions/calendar.js`; `src/redux/actions/calendarThemeStorage.js` | `stale` | The seam still exists, but the named helper is outdated on the branch. Current code uses `readStoredThemes()` from `calendarThemeStorage.js`. |
| `docs/architecture/persistence-inventory.md` | Todo remains a legacy `todo` storage/persist seam that calendar re-exports without changing the persisted slice key. | `src/redux/actions/calendar.js`; `src/redux/actions/todo.js`; `src/redux/actions/todoStorage.js`; `src/redux/store/store.js` | `aligned` | The branch still keeps the calendar-owned UI on top of the legacy `todo` thunk and persisted slice seam. |
| `docs/architecture/storage-contract-matrix.md` | `getTodo()` is documented as reading `AsyncStorage.getItem('todos')` directly inside `todo.js`. | `src/redux/actions/todo.js`; `src/redux/actions/todoStorage.js` | `stale` | The storage key and legacy seam are still current, but the direct inline-read description is outdated because `todo.js` now delegates to `todoStorage.js`. |
| `docs/architecture/persistence-inventory.md` | Exercise still reads `exercises` and `exercise_directory` outside the persisted root, while reducer-driven mutations persist through the Redux root. | `src/redux/actions/exercise.js`; `src/redux/actions/exerciseStorage.js`; `src/redux/store/store.js` | `aligned` | The high-level exercise seam remains truthful on the working branch. |
| `docs/architecture/storage-contract-matrix.md` | `getExercises()` is documented as using an inline `readStoredArray('exercises')` helper in `exercise.js`. | `src/redux/actions/exercise.js`; `src/redux/actions/exerciseStorage.js` | `stale` | Current branch moved `exercises` reads into `exerciseStorage.js`. The branch is mixed because `exercise_directory` still uses an inline helper in `exercise.js`, so a docs refresh should keep that nuance. |
| `docs/architecture/storage-contract-matrix.md` | Journal traits remain a compatibility-read seam that hydrates the persisted `journal` slice from `readStoredTraits()`. | `src/redux/actions/journal.js`; `src/redux/actions/journalTraitsStorage.js`; `src/redux/store/store.js` | `aligned` | The current branch still matches the documented journal traits seam. |
| `docs/architecture/persistence-inventory.md` | Nutrition still owns compatibility reads for `meals`, `supplements`, `meal_categories`, and `meals_directory`, with reducer-driven writes flowing through the persisted Redux root. | `src/redux/actions/nutrition.js`; `src/redux/actions/nutritionStorage.js`; `src/redux/store/store.js` | `aligned` | The four-key nutrition ownership summary remains truthful on the branch. |
| `docs/architecture/storage-contract-matrix.md` | Nutrition helper naming still references older read wrappers such as `readMealsFromStorage()` and `readSupplementsFromStorage()`. | `src/redux/actions/nutrition.js`; `src/redux/actions/nutritionStorage.js` | `stale` | The seam is still compatibility-read plus persisted-root overlap, but the helper names no longer match the branch. Current code uses `readStoredMeals()`, `readStoredSupplements()`, `readStoredMealCategories()`, and `readStoredMealsDirectory()`. |
| `docs/architecture/persistence-inventory.md` | Recreation still spans direct-key compatibility reads for `routines` and `workouts`, plus MMKV ownership for bundled plans and rehydration after delete-account. | `src/redux/actions/recreation.js`; `src/redux/actions/recreationStorage.js`; `src/storage/mmkv/keys.js`; `src/storage/mmkv/hydration.js`; `src/bootstrap/AppBootstrap.js`; `src/redux/actions/auth.js` | `aligned` | The branch still shows the same cross-backend recreation contract and delete-account adjacency. |
| `docs/architecture/storage-contract-matrix.md` | Recreation still uses helper-backed `routines` and `workouts` reads plus MMKV `plans_brunch_body` hydration/read seams outside Redux Persist. | `src/redux/actions/recreation.js`; `src/redux/actions/recreationStorage.js`; `src/storage/mmkv/keys.js`; `src/storage/mmkv/hydration.js`; `src/bootstrap/AppBootstrap.js`; `src/redux/actions/auth.js` | `aligned` | The recreation rows remain truthful on the working branch, including bundled-plan rehydration after full local clear. |

## Short Findings / Risk Notes

- The persisted Redux root contract remains truthful in the branch docs that describe only the `root` key and the seven-slice whitelist. This closeout did not find branch drift in `src/redux/store/store.js`.
- The main stale-doc risk is older architecture wording that still points at removed `authStorage.js` ownership or still describes `AppBootstrap`, auth, onboarding, calendar, todo, exercise, or nutrition reads as inline in files that now delegate through helper modules.
- `storage-contract-matrix.md` is mixed on the current branch: the root row, journal traits row, and recreation rows still match current code, while auth/profile/onboarding, calendar themes, todo, exercise, and nutrition helper naming lag the branch.
- The branch-only truth-source rule mattered here. Public `main` still exposes older mixed-owner storage patterns, so substituting public-main evidence would have hidden branch-local helper splits and created false confirmation risk.
- Recreation remains the most adjacency-sensitive scoped surface because it still crosses AsyncStorage helper reads, MMKV bundled-plan reads, bootstrap hydration, and delete-account rehydration. This audit records that adjacency only; it does not reopen recreation semantics.

## Follow-On Fixes, If Any

- Docs-only auth/bootstrap ownership refresh for `store-and-middleware-review.md`, `storage-contract-matrix.md`, `slice-migration-path-phase-1.md`, `app-structure-inventory.md`, `risk-and-coupling-audit.md`, and `stale-architecture-doc-reconciliation.md` so helper ownership references match the current branch split between `profileStorage.js` and `onboardingStorage.js`.
- Docs-only helper-reference refresh for `storage-contract-matrix.md` so calendar, todo, exercise, and nutrition rows name the current helper modules and preserve the remaining mixed ownership where it still exists.
