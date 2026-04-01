# App Structure Inventory

This document inventories the current Brunch Body app structure as inspected on March 31, 2026. It is a present-state, evidence-based map of the mobile-first, local-first codebase for later cleanup and refactor lanes. It does not propose or apply behavior changes.

Scope note: this inventory is based on `App.js`, `src/root-container/`, `src/navigation/`, `src/screens/`, `src/redux/`, `src/config/`, `src/context/`, `src/storage/`, `src/resources/`, and `README.md`. When structure is unclear, this document records the ambiguity instead of normalizing it.

## App entrypoint and root wiring

Current bootstrap chain:

1. `App.js` runs `hydrateWorkoutPlans()` inside `useEffect(...)` on app mount.
2. `App.js` then renders `RootContainer`.
3. `src/storage/mmkv/hydration.js` seeds MMKV with bundled Brunch Body plans if the `is_initialized` flag is not yet set.
4. `src/root-container/RootContainer.js` wraps the app with:
   - Redux `Provider`
   - `PersistGate`
   - `GestureHandlerRootView`
   - `PaperProvider`
   - `RootNavigation`
5. `src/navigation/RootNavigation.js` wraps the navigation tree in `DateProvider` and then renders `NavigationContainer` plus the root stack navigator.

The current root wiring is therefore split across bootstrap, root container, navigation, and storage helpers rather than being centralized in one file.

## Navigation structure

### Initial route decision

`RootNavigation` determines the initial stack route by reading `AsyncStorage.getItem('user_profile')`.

- If a local profile exists, the stack starts at `Home`.
- If no local profile exists, the stack starts at `CompleteProfile`.
- Until that read completes, `RootNavigation` returns `null`.

### Root stack route surface

The root stack in `src/navigation/RootNavigation.js` currently groups together onboarding, the tab root, and many feature-detail routes:

| Route grouping | Current routes |
| --- | --- |
| Onboarding / app shell | `CompleteProfile`, `Home` |
| Journal-related | `WeightLog`, `QuarterlyEntry`, `DailyEntry`, `WeeklyEntry`, `SupplementLog`, `Calories`, `TraitDirectory` |
| Nutrition-related | `Nutrition`, `Supplement`, `Meal`, `MealsList`, `MealDirectory`, `MealDetail` |
| Recreation-related | `RoutineManager`, `ProgramManager`, `EditProgram`, `EditRoutine`, `MyExercises` |
| Settings / account-related | `MyProfile`, `MyVitals`, `MyAccount`, `MyEmail`, `MyPassword`, `DeleteAccount`, `ExportToCSV`, `TermsOfUse`, `PrivacyPolicy`, `Abbrevations`, `Tutorials` |
| Other standalone route | `Dashboard` |

This means the root stack is not only a shell navigator. It also serves as the main surface for many deep feature screens.

### Bottom-tab structure

`Home` renders `BottomTabNavigation`, which defines six tabs:

| Tab route name | Label shown in tab bar | Mounted component |
| --- | --- | --- |
| `Dashboard` | `Home` | `DashboardWrapper` |
| `Journal` | `Journal` | `JournalWrapper` |
| `Calendar` | `Calendar` | `CalendarNavigation` |
| `Nutrition` | `Nutrition` | `NutritionWrapper` |
| `Recreation` | `Recreation` | `RecreationWrapper` |
| `Settings` | `Settings` | `SettingWrapper` |

Important current behavior:

- `BottomTabNavigation` uses `initialRouteName="Calendar"`.
- The first tab route is named `Dashboard`, but its visible label is `Home`.
- The settings domain folder is `src/screens/setting/`, while the tab route is `Settings` and the wrapper is `SettingWrapper`.

### Nested calendar stack

The calendar tab mounts its own stack navigator:

| Calendar stack route | Mounted component |
| --- | --- |
| `CalendarMain` | `CalendarWrapper` |
| `Writing` | `WritingWrapper` |
| `Edit Writing` | `EditWritingWrapper` |
| `NewDay` | `NewDayWrapper` |

This makes `writing` a separate screen domain in the filesystem, but a child flow of the calendar tab in the live navigation tree.

### Evidence-backed inconsistencies in navigation

- `BottomTabNavigation` starts on `Calendar` even though the `Dashboard` tab is labeled `Home`.
- `src/navigation/DashboardNavigation.js` exists, but it is not referenced by the inspected root or tab wiring.
- `src/screens/splashScreen/` and `src/screens/welcome/` both contain screen trees, but neither tree is referenced by the inspected root or tab wiring.
- Naming is inconsistent across routes and files. Examples include `Edit Writing` with a space, `Settings` route vs `setting` folder, and `Abbrevations` as the route and folder name.

## Top-level `src/` layout

The current first-level `src/` folders are:

| Folder | Current purpose |
| --- | --- |
| `assets` | Image and tutorial asset storage. This was not inventoried file-by-file, but inspected `resources` imports show it supplies logos, arrows, tutorial PNGs, and tutorial SVGs. |
| `components` | Shared UI building blocks and modal/header/layout helpers used across screen domains. This was not inventoried file-by-file, but inspected screens import shared components such as `SafeAreaWrapper`, `CustomHeader`, `PermissionModal`, `CustomModal`, and picker/modal helpers. |
| `config` | Runtime mode configuration. `runtimeMode.js` is the source of truth for the local-only flag, and `appMode.js` exposes `APP_MODE`, mode helpers, and fail-fast assertions for unsupported non-local paths. |
| `context` | App-level React context. The inspected surface currently contains `DateProvider`, which provides shared date state and reset behavior used by journal and recreation flows. |
| `data` | Appears to hold bundled static datasets. Based on inspected imports, MMKV hydration pulls `brunchBodyPlans` from this folder. This folder was not otherwise inventoried in depth. |
| `navigation` | Root and nested navigator wiring. The inspected files define the main stack, bottom tabs, the calendar stack, and an extra `DashboardNavigation.js` surface that is not referenced by the inspected wiring. |
| `redux` | Central Redux structure, including actions, constants, reducers, store setup, and the persisted store export used by the root container. |
| `resources` | Shared UI constants and bundled directories. The inspected files export colors, strings, images, wheel-picker data, time-block data, trait data, meal data, and exercise data used by screens and reducers. |
| `root-container` | App shell wiring around Redux, persistence, gesture handling, React Native Paper, and the root navigation entrypoint. |
| `screens` | Feature-domain screen organization. Most domains follow a `pages/` plus `components/` pattern, although the split is not fully consistent. |
| `storage` | Local persistence helpers. The inspected surface currently contains MMKV setup, storage keys, and one-time bundled plan hydration. |
| `utils` | Helper utilities. Based on inspected imports, this includes JSON storage helpers used by MMKV-related persistence code. This folder was not inventoried in depth. |

## Screen-domain organization

Most screen domains use a repeated structure:

- `pages/` contains route-level pages and wrapper exports.
- `components/` contains presentational components and domain-specific UI pieces.
- `index.js` files usually re-export route wrappers from the `pages/` subtree.

That pattern is common, but not perfectly consistent. In several domains, `components/` and `pages/` contain overlapping concepts with similar names.

### Current domain map

| Screen domain | Current exported page surface | Current organization notes |
| --- | --- | --- |
| `calendar` | `CalendarWrapper` via `pages/calendar` | One main route-level page plus many feature-specific components for themes, todo items, color picking, and calendar UI. |
| `completeProfile` | `CompleteProfileWrapper` via `pages/completeProfile` | The wrapper manages an internal multi-step flow (`Name`, `DateOfBirth`, `Height`, `Weight`, `Gender`, `Welcome`) inside one route surface. This flow also writes temporary AsyncStorage values directly. |
| `dashboard` | `DashboardWrapper` via `pages/Dashboard` | One main dashboard page plus presentational components for day/week/month/year views and dashboard cards. |
| `journal` | `JournalWrapper`, `WeightLogWrapper`, `QuarterlyEntryWrapper`, `DailyEntryWrapper`, `WeeklyEntryWrapper`, `SupplementLogWrapper`, `CaloriesWrapper`, `TraitDirectoryWrapper` | A larger domain with one landing page and multiple log/review detail pages. The journal landing page uses `DateProvider` state and navigates to the detail routes defined in the root stack. |
| `nutrition` | `NutritionWrapper`, `SupplementWrapper`, `MealWrapper`, `MealsListWrapper`, `MealDirectoryWrapper`, `MealDetailWrapper` | Multiple route pages for the nutrition landing surface, supplements, meals, item lists, and item detail. Nutrition also uses direct AsyncStorage reads/writes for part of its cross-screen flow. |
| `recreation` | `RecreationWrapper`, `RoutineManagerWrapper`, `ProgramManagerWrapper`, `EditProgramWrapper`, `EditRoutineWrapper`, `MyExercisesWrapper` | A broad domain that mixes Brunch Body plans, custom programs, routines, workouts, and exercise browsing. |
| `setting` | `SettingWrapper`, `MyProfileWrapper`, `MyVitalsWrapper`, `MyAccountWrapper`, `MyEmailWrapper`, `MyPasswordWrapper`, `DeleteAccountWrapper`, `ExportToCSVWrapper`, `TermsOfUseWrapper`, `PrivacyPolicyWrapper`, `AbbrevationsWrapper`, `TutorialsWrapper` | A broad settings domain with a heavier nested grouping under `pages/MyProfile` and mirrored component subfolders such as `My Profile`, `Export To CSV`, `Privacy Policy`, `TermsOfUse`, and `Tutorials`. |
| `writing` | `NewDayWrapper`, `WritingWrapper`, `EditWritingWrapper` | Separate filesystem domain, but mounted under the calendar tab's nested stack rather than under its own top-level navigator. |
| `splashScreen` | `SplashScreenWrapper` | Screen tree exists with `pages/` and `components/`, but it is not referenced by the inspected root/tab wiring. |
| `welcome` | `WelcomeWrapper` | Screen tree exists with `pages/` and `components/`, but it is not referenced by the inspected root/tab wiring. |

Additional structure notes:

- Route-level exports are commonly named `SomethingWrapper`.
- Many wrappers are `connect(...)`-based React Redux containers, even when they pass little or no mapped state.
- `writing` is structurally separate from `calendar`, but functionally nested inside calendar navigation.

## Redux structure

### Store wiring

`src/redux/index.js` re-exports:

- all action modules
- all constants
- all reducer exports
- the store and persistor from `src/redux/store/`

`src/redux/store/store.js` sets up a single Redux Toolkit store with:

- `combineReducers(...)`
- `redux-persist`
- `AsyncStorage` as the persisted storage backend
- disabled serializable and immutable middleware checks
- Redux DevTools enabled outside production

Persisted slices are:

- `auth`
- `recreation`
- `journal`
- `nutrition`
- `calendar`
- `exercise`
- `todo`

`RESET_APP` is handled in the root reducer wrapper. When dispatched, it rebuilds the combined reducer state from `undefined`, which resets the persisted Redux slices to their initial state.

### Actions and reducers by domain

| Domain | Actions / reducer role in current structure |
| --- | --- |
| `auth` | Manages local profile/account state. Actions read and write `user_profile` plus local password keys. The reducer also derives BMI and BMR values from the stored profile payload. |
| `journal` | Manages journal entry CRUD plus trait loading. The reducer also derives dashboard-oriented aggregate lists for daily, weekly, monthly, and yearly charts. |
| `nutrition` | Manages meals, supplements, meal items, supplement items, meal categories, and meal directory state. |
| `recreation` | Manages routines, routine items, custom plans, week plans, Brunch Body plan reads, workouts, and completed workouts. |
| `calendar` | Manages single themes, repeated themes, theme-frequency expansion, current theme state, and cleared theme days. |
| `exercise` | Manages user-created exercises plus a merged exercise directory assembled from bundled resources and local data. |
| `todo` | Manages todo tasks as its own Redux slice, even though the main todo UI is inside the calendar screen domain. |

### Structural observations inside Redux

- Action modules often read local storage directly before dispatching Redux updates.
- Reducers contain meaningful derived-data logic, not only simple state assignment.
- The folder is named `src/redux/reducer/` (singular), even though it exports multiple slice reducers.

## Local persistence surfaces

The current posture is local-first. In the inspected surfaces, persistence is split across Redux Persist, direct AsyncStorage access, and MMKV.

### Redux Persist

The main persisted Redux store uses:

- storage backend: AsyncStorage
- persist key: `root`
- persisted slices: `auth`, `recreation`, `journal`, `nutrition`, `calendar`, `exercise`, `todo`

This is the primary app-wide persistence layer exposed through `PersistGate` in `RootContainer`.

### Direct AsyncStorage touchpoints in Redux actions

Action creators also read or write direct domain keys outside the `root` persisted blob:

| Domain / surface | Current direct keys seen in inspected code |
| --- | --- |
| Initial route and profile | `user_profile` |
| Auth / account | `user_profile`, `local_password`, `local_password_reset_requested_at`, transient onboarding keys (`name`, `dob`, `height`, `weight`, `gender`) |
| Calendar | `themes` |
| Exercise | `exercises`, `exercise_directory` |
| Journal | `traits` |
| Nutrition | `meals`, `supplements`, `meal_categories`, `meals_directory` |
| Recreation | `routines`, `workouts` |
| Todo | `todos` |

The current code therefore keeps some domain bootstrap and account state outside the persisted Redux `root` key, even though the same domains are also persisted through Redux Persist.

### UI-level storage touchpoints that bypass Redux actions

Several screens or navigation surfaces access storage directly:

- `CompleteProfilePage` writes temporary onboarding values directly to AsyncStorage and assembles `user_profile` directly before dispatching `SET_USER`.
- `DateOfBirthPage` and `HeightPage` each initialize their local step state by reading and writing AsyncStorage directly.
- `RootNavigation` reads `user_profile` directly to decide whether the app opens at `CompleteProfile` or `Home`.
- `NutritionPage` stores `meal_id` directly in AsyncStorage when opening a meal flow.
- `MealDetailPage` reads `meal_id` directly from AsyncStorage to add an item back to the selected meal.

### MMKV surfaces

The inspected MMKV structure is small but important:

- storage instance id: `workout-storage`
- initialization flag: `is_initialized`
- bundled plan key: `plans_brunch_body`

`App.js` triggers `hydrateWorkoutPlans()` on startup. That helper writes bundled Brunch Body plan data into MMKV only if initialization has not already happened.

Recreation actions then read `plans_brunch_body` through MMKV helper functions to populate Brunch Body plan state.

### Local reset behavior

The current local account lifecycle includes storage-clearing behavior:

- `logout` removes `user_profile`, the local password keys, and the transient onboarding keys.
- `deleteAccount` dispatches `RESET_APP`, clears AsyncStorage, clears MMKV with `storage.clearAll()`, and then re-runs `hydrateWorkoutPlans()` so bundled plans remain available locally after the reset.

## Recorded ambiguities

- `DashboardNavigation.js` exists as a navigation surface, but the inspected root and tab wiring do not reference it.
- `splashScreen` and `welcome` both exist as screen domains, but the inspected root and tab wiring do not reference them.
- This inventory does not classify those surfaces as dead code. Based on the allowed inspection scope, they are only documented as not referenced by the inspected wiring.
- The summaries for `assets`, `components`, `data`, and `utils` are intentionally high level. They are based on folder names and import usage visible from the allowed inspection surfaces, not on a deep file-by-file inventory.

## Observed structural risks / cleanup candidates

- Most screen domains repeat a `pages/` plus `components/` tree, but the division of responsibility is inconsistent and sometimes overlapping.
- Naming conventions drift across the codebase: camelCase, PascalCase, lowercase folders, route names with spaces, and singular/plural mismatches are all present.
- `Abbrevations` appears as the persisted spelling in routes, folders, and exports.
- The settings area has especially heavy mirror structure between `pages/` and `components/`, including nested folders with spaces such as `My Profile` and `Export To CSV`.
- The root stack mixes shell-level navigation with many feature-detail routes rather than separating app shell and feature stacks cleanly.
- Some surfaces appear to overlap. For example, `Dashboard` exists as both a bottom-tab screen and a standalone stack route, and nutrition surfaces exist both as a tab and as direct stack routes.
- Direct storage usage appears in UI pages, navigation, Redux actions, and MMKV/bootstrap helpers rather than in one persistence layer.
- Persistence logic is spread across `App.js`, `RootContainer`, `RootNavigation`, screen pages, Redux actions, Redux reducers, and storage helpers.
- Some navigation or screen surfaces are not referenced by the inspected root wiring. They should be reviewed later, but this inventory does not classify them as unused.
