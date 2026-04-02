# Lane: 1.1.2.2.1 Navigator tree and route ownership

## Summary

This artifact records the current navigation tree and route ownership for the active Brunch Body mobile app. It exists to support later cleanup lanes by documenting the present bootstrap path, navigator hierarchy, and route ownership boundaries without changing behavior.

This lane is docs-only and evidence-first. It is grounded in the current repo state, the active navigation files, and the current local-first behavior described in `README.md`.

## Classification

Ready for codex

## Scope

### In Scope

- Document the current bootstrap path from app entry through root navigation.
- Document the current navigator hierarchy for the root stack, bottom-tab shell, and nested calendar stack.
- Record current route ownership across the touched navigation files.
- Record evidence-backed ownership ambiguity and naming drift for later cleanup lanes.

### Out of Scope

- No production code changes.
- No config changes.
- No test changes.
- No package or dependency changes.
- No route renames.
- No route moves.
- No navigator refactor.
- No UX, copy, privacy, disclosure, or behavior changes.
- No target architecture proposal.
- No implementation of cleanup work in this lane.

Scope note: this artifact documents current state only. It does not normalize naming, reconcile duplicate ownership, or propose a future navigation design.

## Files / Surfaces

Primary evidence surfaces inspected for this artifact:

- `index.js`
- `App.js`
- `README.md`
- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`
- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/CalendarNavigation.js`

Style and companion references only:

- `docs/architecture/legacy-residue-audit.md`
- `docs/architecture/risk-and-coupling-audit.md`
- `docs/architecture/app-structure-inventory.md`

## Dependencies

- Governing inputs supplied with this lane:
  - `Brunch Body Project Template.md`
  - `Brunch Body Project Scope.md`
- Active code is the primary source of truth for startup flow and route ownership.
- Existing `docs/architecture/*.md` artifacts may inform tone and section shape, but they do not replace the governing template or scope.

## Acceptance Criteria

- Add exactly one new docs artifact at `docs/architecture/navigation-tree-and-route-ownership.md`.
- Keep the diff docs-only.
- Document the startup path from `AppBootstrap` through `RootNavigation`.
- Include the current navigator hierarchy for bootstrap, the root stack, the bottom-tab shell, and the calendar nested stack.
- List every currently registered route in the touched navigation files once per owning navigator layer.
- Preserve duplicate route names as separate rows when different navigator layers own them.
- Clearly separate shell routes from domain/detail routes.
- Record ownership ambiguity and naming drift as observations only.
- Do not propose or implement behavior changes.

## Purpose / Why this exists

This artifact exists to support Phase 1 cleanup and stabilization by freezing the current navigation tree and route ownership before any follow-on cleanup lane attempts boundary changes.

Navigation cleanup is in scope for Phase 1, but broad cleanup should be broken into smaller, reviewable follow-on tasks before implementation. This document is descriptive only. It does not authorize route moves, renames, stack extraction, or shell refactors.

## Current bootstrap path

Active code shows the following startup path:

1. `index.js` registers `App` with `AppRegistry`.
2. `App.js` renders `AppBootstrap`.
3. `src/bootstrap/AppBootstrap.js`:
   - calls `hydrateWorkoutPlans()` on mount
   - reads `AsyncStorage.getItem('user_profile')` inside `resolveInitialRouteName()`
   - resolves `Home` when a saved `user_profile` exists
   - resolves `CompleteProfile` when no saved `user_profile` exists
   - returns `null` until `initialRouteName` is resolved
   - renders `RootContainer` with `initialRouteName` once resolved
4. `src/root-container/RootContainer.js` wraps the app with Redux `Provider`, `PersistGate`, `GestureHandlerRootView`, and `PaperProvider`, then renders `RootNavigation` with the same `initialRouteName`.
5. `src/navigation/RootNavigation.js` wraps the navigation tree in `DateProvider` and `NavigationContainer`, then mounts the root stack with `initialRouteName={initialRouteName}`.

Current initial-route rule from active code:

- saved `user_profile` present -> `Home`
- no saved `user_profile` -> `CompleteProfile`

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
                            |       |-- Calendar
                            |       |   `-- Calendar nested stack (initialRouteName: CalendarMain)
                            |       |       |-- CalendarMain
                            |       |       |-- Writing
                            |       |       |-- Edit Writing
                            |       |       `-- NewDay
                            |       |-- Nutrition
                            |       |-- Recreation
                            |       `-- Settings
                            |-- WeightLog
                            |-- QuarterlyEntry
                            |-- DailyEntry
                            |-- WeeklyEntry
                            |-- SupplementLog
                            |-- Calories
                            |-- Nutrition
                            |-- Supplement
                            |-- Meal
                            |-- MealsList
                            |-- RoutineManager
                            |-- ProgramManager
                            |-- EditProgram
                            |-- EditRoutine
                            |-- MyProfile
                            |-- MyVitals
                            |-- MyAccount
                            |-- MyEmail
                            |-- MyPassword
                            |-- DeleteAccount
                            |-- ExportToCSV
                            |-- TermsOfUse
                            |-- PrivacyPolicy
                            |-- Abbrevations
                            |-- Tutorials
                            |-- Dashboard
                            |-- TraitDirectory
                            |-- MealDirectory
                            |-- MealDetail
                            `-- MyExercises
```

## Route ownership table

The touched navigation files currently register 42 routes in the active inspected tree: 32 root-stack routes, 6 bottom-tab routes, and 4 calendar nested-stack routes. Duplicate route names are preserved below as separate rows when different navigator layers own them.

| Route name | Component or wrapper | Owning layer | Category | Notes |
| --- | --- | --- | --- | --- |
| `CompleteProfile` | `CompleteProfileWrapper` | Root stack | `entry` | Bootstrap resolves here when no saved `user_profile` exists. |
| `Home` | `BottomTabNavigation` | Root stack | `shell` | Bootstrap resolves here when saved `user_profile` exists. This shell route then initializes its inner tab navigator to `Calendar`. |
| `WeightLog` | `WeightLogWrapper` | Root stack | `root-level detail route` | - |
| `QuarterlyEntry` | `QuarterlyEntryWrapper` | Root stack | `root-level detail route` | - |
| `DailyEntry` | `DailyEntryWrapper` | Root stack | `root-level detail route` | - |
| `WeeklyEntry` | `WeeklyEntryWrapper` | Root stack | `root-level detail route` | - |
| `SupplementLog` | `SupplementLogWrapper` | Root stack | `root-level detail route` | - |
| `Calories` | `CaloriesWrapper` | Root stack | `root-level detail route` | - |
| `Nutrition` | `NutritionWrapper` | Root stack | `root-level detail route` | Also registered as a bottom-tab destination with the same route name and wrapper. |
| `Supplement` | `SupplementWrapper` | Root stack | `root-level detail route` | - |
| `Meal` | `MealWrapper` | Root stack | `root-level detail route` | - |
| `MealsList` | `MealsListWrapper` | Root stack | `root-level detail route` | - |
| `RoutineManager` | `RoutineManagerWrapper` | Root stack | `root-level detail route` | - |
| `ProgramManager` | `ProgramManagerWrapper` | Root stack | `root-level detail route` | - |
| `EditProgram` | `EditProgramWrapper` | Root stack | `root-level detail route` | - |
| `EditRoutine` | `EditRoutineWrapper` | Root stack | `root-level detail route` | - |
| `MyProfile` | `MyProfileWrapper` | Root stack | `root-level detail route` | - |
| `MyVitals` | `MyVitalsWrapper` | Root stack | `root-level detail route` | - |
| `MyAccount` | `MyAccountWrapper` | Root stack | `root-level detail route` | - |
| `MyEmail` | `MyEmailWrapper` | Root stack | `root-level detail route` | - |
| `MyPassword` | `MyPasswordWrapper` | Root stack | `root-level detail route` | - |
| `DeleteAccount` | `DeleteAccountWrapper` | Root stack | `root-level detail route` | - |
| `ExportToCSV` | `ExportToCSVWrapper` | Root stack | `root-level detail route` | - |
| `TermsOfUse` | `TermsOfUseWrapper` | Root stack | `root-level detail route` | - |
| `PrivacyPolicy` | `PrivacyPolicyWrapper` | Root stack | `root-level detail route` | - |
| `Abbrevations` | `AbbrevationsWrapper` | Root stack | `root-level detail route` | Registered spelling is `Abbrevations`; this artifact records current code spelling only. |
| `Tutorials` | `TutorialsWrapper` | Root stack | `root-level detail route` | - |
| `Dashboard` | `DashboardWrapper` | Root stack | `root-level detail route` | Also registered as a bottom-tab destination. The tab route is labeled `Home`. |
| `TraitDirectory` | `TraitDirectoryWrapper` | Root stack | `root-level detail route` | - |
| `MealDirectory` | `MealDirectoryWrapper` | Root stack | `root-level detail route` | - |
| `MealDetail` | `MealDetailWrapper` | Root stack | `root-level detail route` | - |
| `MyExercises` | `MyExercisesWrapper` | Root stack | `root-level detail route` | - |
| `Dashboard` | `DashboardWrapper` | Bottom-tab shell | `top-level destination` | Visible tab label is `Home`. The same route name and wrapper also appear in the root stack. |
| `Journal` | `JournalWrapper` | Bottom-tab shell | `top-level destination` | - |
| `Calendar` | `CalendarNavigation` | Bottom-tab shell | `top-level destination` | Owns the only clearly nested domain stack in the active inspected tree. |
| `Nutrition` | `NutritionWrapper` | Bottom-tab shell | `top-level destination` | The same route name and wrapper also appear in the root stack. |
| `Recreation` | `RecreationWrapper` | Bottom-tab shell | `top-level destination` | - |
| `Settings` | `SettingWrapper` | Bottom-tab shell | `top-level destination` | Route name is plural `Settings`, wrapper is `SettingWrapper`, and the screen folder is `setting`. |
| `CalendarMain` | `CalendarWrapper` | Calendar nested stack | `nested feature route` | Initial route of the calendar nested stack. |
| `Writing` | `WritingWrapper` | Calendar nested stack | `nested feature route` | - |
| `Edit Writing` | `EditWritingWrapper` | Calendar nested stack | `nested feature route` | Registered route name includes a space. |
| `NewDay` | `NewDayWrapper` | Calendar nested stack | `nested feature route` | Naming style differs from nearby spaced and PascalCase-like route names. |

## Ownership observations

- The root stack currently owns both shell routing and many detail screens. It is not limited to app-entry responsibilities.
- `Home` is the root-level shell route, but the inner bottom-tab navigator currently initializes to `Calendar`, not to the tab route labeled `Home`.
- Calendar is the only clearly nested domain stack in the active inspected tree.
- Naming style is mixed across the active tree and should be recorded for later cleanup rather than normalized here. Current evidence includes duplicate route names across layers (`Dashboard`, `Nutrition`), label-versus-route drift (`Dashboard` tab labeled `Home`), plural-versus-singular drift (`Settings` route versus `SettingWrapper` and `setting` folder), a spaced route name (`Edit Writing`), and retained spelling drift (`Abbrevations`).

## Follow-on lane seeds

Later cleanup candidates only:

- root stack boundary cleanup
- bottom-tab shell cleanup
- domain stack extraction
- route naming/constants cleanup
- dead-route audit
