# Lane: 1.1.2.2.1 Navigator tree and route ownership

## Summary

This artifact records the current navigation tree and route ownership for the active Brunch Body mobile app. It exists to support later cleanup lanes by documenting the present bootstrap path, navigator hierarchy, route ownership boundaries, and retained compatibility holds without changing behavior.

This lane is docs-only and evidence-first. It is grounded in the current repo state, the active bootstrap and mounted navigation files, and the current local-first behavior described in `README.md`.

## Classification

Ready for codex

## Scope

### In Scope

- document the current bootstrap path from app entry through root navigation
- document the current navigator hierarchy for the root stack, bottom-tab shell, and all mounted nested stacks
- record current route ownership across the active mounted navigation files
- preserve duplicate route names as separate current-state entries when different navigator layers own them
- record evidence-backed ownership exceptions and naming drift for later cleanup lanes

### Out of Scope

- no production code changes
- no config changes
- no test changes
- no package or dependency changes
- no route renames
- no route moves
- no navigator refactor
- no UX, copy, privacy, disclosure, or behavior changes
- no target architecture proposal
- no implementation of cleanup work in this lane

Scope note: this artifact documents current state only. It does not normalize naming, consolidate duplicate route strings, reconcile compatibility holds, or propose a future navigation design.

## Files / Surfaces

Primary evidence surfaces inspected for this artifact:

- `index.js`
- `App.js`
- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`
- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/CalendarNavigation.js`
- `src/navigation/JournalNavigation.js`
- `src/navigation/NutritionNavigation.js`
- `src/navigation/RecreationNavigation.js`
- `src/navigation/SettingsNavigation.js`
- `src/navigation/routeNames.js`
- `README.md`

Style and companion references only:

- `docs/architecture/app-structure-inventory.md`
- `docs/architecture/dead-route-and-duplicate-route-audit.md`
- `docs/architecture/route-naming-and-constants-cleanup.md`
- `docs/architecture/navigation-smoke-tests.md`

## Dependencies

- governing inputs supplied with this lane:
  - `Brunch Body Project Template.md`
  - `Brunch Body Project Scope.md`
- active code is the primary source of truth for startup flow, route ownership, and current route names
- existing `docs/architecture/*.md` artifacts may inform tone and section shape, but they do not replace the governing template or scope

## Acceptance Criteria

- add exactly one docs artifact at `docs/architecture/navigation-tree-and-route-ownership.md`
- keep the diff docs-only
- document the startup path from `AppBootstrap` through `RootNavigation`
- include the current navigator hierarchy for bootstrap, the root stack, the bottom-tab shell, and all mounted nested stacks
- list every currently registered route in the active mounted navigation files once per owning navigator layer
- preserve duplicate route names as separate current-state entries when different navigator layers own them
- clearly separate root routes, top-level shell routes, nested routes, and preserved ownership exceptions
- record ownership exceptions and naming drift as observations only
- do not propose or implement behavior changes

## Purpose / Why this exists

This artifact exists to support Phase 1 cleanup and stabilization by freezing the current navigation tree and route ownership after the recent root, shell, extraction, naming, and audit work.

Navigation cleanup is in scope for Phase 1, but broad cleanup should remain broken into smaller, reviewable follow-on tasks before implementation. This document is descriptive only. It does not authorize route moves, renames, stack redesign, or shell refactors.

## Current bootstrap path

Active code shows the following startup path:

1. `index.js` registers `App` with `AppRegistry`.
2. `App.js` renders `AppBootstrap` as the current thin app entrypoint.
3. `src/bootstrap/AppBootstrap.js`:
   - calls `hydrateWorkoutPlans()` on mount
   - reads `AsyncStorage.getItem('user_profile')` inside `resolveInitialRouteName()`
   - resolves `ROOT_ROUTES.HOME` when a saved `user_profile` exists
   - resolves `ROOT_ROUTES.COMPLETE_PROFILE` when no saved `user_profile` exists
   - returns `null` until `initialRouteName` is resolved
   - renders `RootContainer` with `initialRouteName` once resolved
4. `src/root-container/RootContainer.js` wraps the app with Redux `Provider`, `PersistGate`, `GestureHandlerRootView`, and `PaperProvider`, then renders `RootNavigation` with the same `initialRouteName`.
5. `src/navigation/RootNavigation.js` wraps the navigation tree in `DateProvider` and `NavigationContainer`, then mounts the root stack with `initialRouteName={initialRouteName}`.

Current initial-route rule from active code:

- saved `user_profile` present -> `ROOT_ROUTES.HOME`
- no saved `user_profile` -> `ROOT_ROUTES.COMPLETE_PROFILE`

`README.md` describes the same current behavior as a consistency check:

- fresh installs route to `CompleteProfile`
- returning users with a saved local profile route to `Home`

## Navigator tree

The current active navigator hierarchy in the inspected surfaces is:

```text
AppRegistry
`-- App
    `-- AppBootstrap
        |-- hydrateWorkoutPlans()
        |-- resolveInitialRouteName()
        |   |-- saved user_profile present -> Home
        |   `-- no saved user_profile -> CompleteProfile
        `-- RootContainer(initialRouteName)
            `-- RootNavigation(initialRouteName)
                `-- DateProvider
                    `-- NavigationContainer
                        `-- Root stack
                            |-- CompleteProfile
                            |-- Home
                            |   `-- Bottom-tab shell (initialRouteName: Calendar)
                            |       |-- Dashboard (tab label: Home)
                            |       |-- Journal
                            |       |   `-- Journal nested stack (initialRouteName: Journal)
                            |       |       |-- Journal
                            |       |       |-- WeightLog
                            |       |       |-- QuarterlyEntry
                            |       |       |-- DailyEntry
                            |       |       |-- WeeklyEntry
                            |       |       |-- SupplementLog
                            |       |       |-- Calories
                            |       |       `-- TraitDirectory
                            |       |-- Calendar
                            |       |   `-- Calendar nested stack (initialRouteName: CalendarMain)
                            |       |       |-- CalendarMain
                            |       |       |-- Writing
                            |       |       |-- Edit Writing
                            |       |       `-- NewDay
                            |       |-- Nutrition
                            |       |   `-- Nutrition nested stack (initialRouteName: Nutrition)
                            |       |       |-- Nutrition
                            |       |       |-- Supplement
                            |       |       |-- Meal
                            |       |       |-- MealsList
                            |       |       |-- MealDirectory
                            |       |       `-- MealDetail
                            |       |-- Recreation
                            |       |   `-- Recreation nested stack (initialRouteName: Recreation)
                            |       |       |-- Recreation
                            |       |       |-- RoutineManager
                            |       |       |-- ProgramManager
                            |       |       |-- EditProgram
                            |       |       |-- EditRoutine
                            |       |       `-- MyExercises
                            |       `-- Settings
                            |           `-- Settings nested stack (initialRouteName: Settings)
                            |               |-- Settings
                            |               |-- MyProfile
                            |               |-- MyVitals
                            |               |-- MyAccount
                            |               |-- MyEmail
                            |               |-- MyPassword
                            |               |-- DeleteAccount
                            |               |-- ExportToCSV
                            |               |-- TermsOfUse
                            |               |-- PrivacyPolicy
                            |               `-- Abbrevations
                            `-- Tutorials
```

## Route ownership table

The active mounted tree currently registers 44 routes across seven live navigator layers: 3 root-stack routes, 6 bottom-tab routes, 4 calendar nested-stack routes, 8 journal nested-stack routes, 6 nutrition nested-stack routes, 6 recreation nested-stack routes, and 11 settings nested-stack routes.

| Route name | Component or navigator | Owning layer | Category | Notes |
| --- | --- | --- | --- | --- |
| `CompleteProfile` | `CompleteProfileWrapper` | Root stack | `entry` | Bootstrap resolves here when no saved `user_profile` exists. |
| `Home` | `BottomTabNavigation` | Root stack | `shell` | Bootstrap resolves here when saved `user_profile` exists. |
| `Tutorials` | `TutorialsWrapper` | Root stack | `root-owned exception` | Screen lives under the settings module, but current live ownership remains at root. |
| `Dashboard` | `DashboardWrapper` | Bottom-tab shell | `top-level destination` | Visible tab label is `Home`. |
| `Journal` | `JournalNavigation` | Bottom-tab shell | `top-level destination` | Mounted nested stack uses the same route string as its own initial route. |
| `Calendar` | `CalendarNavigation` | Bottom-tab shell | `top-level destination` | Mounted nested stack uses `CalendarMain` as its inner initial route. |
| `Nutrition` | `NutritionNavigation` | Bottom-tab shell | `top-level destination` | Mounted nested stack uses the same route string as its own initial route. |
| `Recreation` | `RecreationNavigation` | Bottom-tab shell | `top-level destination` | Mounted nested stack uses the same route string as its own initial route. |
| `Settings` | `SettingsNavigation` | Bottom-tab shell | `top-level destination` | Mounted nested stack uses the same route string as its own initial route. |
| `CalendarMain` | `CalendarWrapper` | Calendar nested stack | `nested feature route` | Initial route of the calendar nested stack. |
| `Writing` | `WritingWrapper` | Calendar nested stack | `nested feature route` | - |
| `Edit Writing` | `EditWritingWrapper` | Calendar nested stack | `nested feature route` | Registered route name includes a space. |
| `NewDay` | `NewDayWrapper` | Calendar nested stack | `nested feature route` | Naming style differs from nearby spaced route names. |
| `Journal` | `JournalWrapper` | Journal nested stack | `nested feature route` | Initial route of the journal nested stack. |
| `WeightLog` | `WeightLogWrapper` | Journal nested stack | `nested feature route` | - |
| `QuarterlyEntry` | `QuarterlyEntryWrapper` | Journal nested stack | `nested feature route` | - |
| `DailyEntry` | `DailyEntryWrapper` | Journal nested stack | `nested feature route` | - |
| `WeeklyEntry` | `WeeklyEntryWrapper` | Journal nested stack | `nested feature route` | - |
| `SupplementLog` | `SupplementLogWrapper` | Journal nested stack | `nested feature route` | - |
| `Calories` | `CaloriesWrapper` | Journal nested stack | `nested feature route` | - |
| `TraitDirectory` | `TraitDirectoryWrapper` | Journal nested stack | `nested feature route` | - |
| `Nutrition` | `NutritionWrapper` | Nutrition nested stack | `nested feature route` | Initial route of the nutrition nested stack. |
| `Supplement` | `SupplementWrapper` | Nutrition nested stack | `nested feature route` | - |
| `Meal` | `MealWrapper` | Nutrition nested stack | `nested feature route` | - |
| `MealsList` | `MealsListWrapper` | Nutrition nested stack | `nested feature route` | - |
| `MealDirectory` | `MealDirectoryWrapper` | Nutrition nested stack | `nested feature route` | - |
| `MealDetail` | `MealDetailWrapper` | Nutrition nested stack | `nested feature route` | - |
| `Recreation` | `RecreationWrapper` | Recreation nested stack | `nested feature route` | Initial route of the recreation nested stack. |
| `RoutineManager` | `RoutineManagerWrapper` | Recreation nested stack | `nested feature route` | - |
| `ProgramManager` | `ProgramManagerWrapper` | Recreation nested stack | `nested feature route` | - |
| `EditProgram` | `EditProgramWrapper` | Recreation nested stack | `nested feature route` | - |
| `EditRoutine` | `EditRoutineWrapper` | Recreation nested stack | `nested feature route` | - |
| `MyExercises` | `MyExercisesWrapper` | Recreation nested stack | `nested feature route` | - |
| `Settings` | `SettingWrapper` | Settings nested stack | `nested feature route` | Initial route of the settings nested stack. |
| `MyProfile` | `MyProfileWrapper` | Settings nested stack | `nested feature route` | - |
| `MyVitals` | `MyVitalsWrapper` | Settings nested stack | `nested feature route` | - |
| `MyAccount` | `MyAccountWrapper` | Settings nested stack | `nested feature route` | - |
| `MyEmail` | `MyEmailWrapper` | Settings nested stack | `nested feature route` | - |
| `MyPassword` | `MyPasswordWrapper` | Settings nested stack | `nested feature route` | - |
| `DeleteAccount` | `DeleteAccountWrapper` | Settings nested stack | `nested feature route` | - |
| `ExportToCSV` | `ExportToCSVWrapper` | Settings nested stack | `nested feature route` | - |
| `TermsOfUse` | `TermsOfUseWrapper` | Settings nested stack | `nested feature route` | Settings landing currently uses external links for legal entrypoints. |
| `PrivacyPolicy` | `PrivacyPolicyWrapper` | Settings nested stack | `nested feature route` | Settings landing currently uses external links for legal entrypoints. |
| `Abbrevations` | `AbbrevationsWrapper` | Settings nested stack | `nested feature route` | Registered spelling remains `Abbrevations`; this artifact records current code spelling only. |

## Ownership observations

- The root stack is now a narrow top-level boundary. It currently owns only `CompleteProfile`, `Home`, and the preserved `Tutorials` exception.
- The authenticated shell now fans into five mounted nested domain stacks under the tab layer: journal, calendar, nutrition, recreation, and settings.
- Duplicate route strings now exist between the tab shell and the nested stack entry routes for `Journal`, `Nutrition`, `Recreation`, and `Settings`. `Calendar` differs by using `CalendarMain` as its nested entry route.
- The visible tab label for `Dashboard` is still `Home`, while the tab shell still initializes to `Calendar`.
- `Tutorials` remains a root-owned exception even though the screen lives under the settings module and is linked from onboarding and settings flows.
- Naming style is mixed across the active tree and should be recorded for later cleanup rather than normalized here. Current evidence includes label-versus-route drift (`Dashboard` tab labeled `Home`), route-name reuse across layers (`Journal`, `Nutrition`, `Recreation`, `Settings`), a spaced route name (`Edit Writing`), a nested entry alias (`CalendarMain`), and retained spelling drift (`Abbrevations`).

## Follow-on lane seeds

Later cleanup candidates only:

- duplicate-route consolidation
- route naming/constants cleanup
- root-versus-settings ownership clarification for `Tutorials`
- dead-route and residual-navigation-surface cleanup
- navigation smoke-test expansion
