# Lane: 1.1.2.2.9 Route naming and constants cleanup

## Summary

This lane defines a bounded cleanup of navigation route naming and route-definition ownership so current route registrations are easier to understand and safer to maintain.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane. Live code is authoritative for current-state facts. Nearby approved lane docs and the supplied lane brief may inform cadence and phrasing only.

Startup behavior, authenticated-shell entry, current route destinations, and current navigator ownership boundaries must be preserved exactly. The intent is to reduce brittle string duplication and clarify safe constant-backed cleanup without changing bootstrap semantics, shell behavior, route destinations, or screen behavior.

## Classification

Ready for codex

## Scope

### In Scope

- define a bounded cleanup lane for route naming and route constants across the current navigation layer
- preserve the current startup contract where `resolveInitialRouteName()` returns `Home` when local `user_profile` exists and `CompleteProfile` otherwise
- preserve `Home` in `RootNavigation` as the authenticated shell entry that mounts `BottomTabNavigation`
- preserve the current six top-level tab routes in `BottomTabNavigation`:
  - `Dashboard`
  - `Journal`
  - `Calendar`
  - `Nutrition`
  - `Recreation`
  - `Settings`
- preserve the current tab-label mismatch where the `Dashboard` route is displayed with visible tab label `Home` unless a compatibility-preserving constant strategy can clarify that relationship without renaming the registered route
- preserve the current calendar stack route set in `CalendarNavigation`:
  - `CalendarMain`
  - `Writing`
  - `Edit Writing`
  - `NewDay`
- preserve the current journal stack route set in `JournalNavigation`:
  - `Journal`
  - `WeightLog`
  - `QuarterlyEntry`
  - `DailyEntry`
  - `WeeklyEntry`
  - `SupplementLog`
  - `Calories`
  - `TraitDirectory`
- preserve the current nutrition stack route set in `NutritionNavigation`:
  - `Nutrition`
  - `Supplement`
  - `Meal`
  - `MealsList`
  - `MealDirectory`
  - `MealDetail`
- preserve the current recreation stack route set in `RecreationNavigation`:
  - `Recreation`
  - `RoutineManager`
  - `ProgramManager`
  - `EditProgram`
  - `EditRoutine`
  - `MyExercises`
- preserve the current settings/account/legal stack route set in `SettingsNavigation`:
  - `Settings`
  - `MyProfile`
  - `MyVitals`
  - `MyAccount`
  - `MyEmail`
  - `MyPassword`
  - `DeleteAccount`
  - `ExportToCSV`
  - `TermsOfUse`
  - `PrivacyPolicy`
  - `Abbrevations`
- document which current code-backed route names are intentional compatibility holds for this lane versus which are safe candidates for constant-backed cleanup only
- prefer navigator-local route constants and local screen registries for touched navigators
- allow only minimal navigation-local sharing when duplication truly requires it
- make later navigation maintenance safer by reducing repeated literal route strings

### Out of Scope

- no startup-rule changes
- no onboarding rewrite
- no tab redesign
- no route ownership moves between navigators
- no screen-internal behavior changes
- no broad navigation redesign
- no repo-wide shared route abstraction
- no true route rename migration
- no root, shell, or nested-stack boundary redesign already covered by earlier lanes
- no privacy, disclosure, or settings-policy changes
- no dependency or tooling changes
- no unrelated UX cleanup
- no residual-route cleanup beyond documenting residue as context for a later dead-route-audit lane

## Files / Surfaces

Primary implementation evidence for this lane:

- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/CalendarNavigation.js`
- `src/navigation/JournalNavigation.js`
- `src/navigation/NutritionNavigation.js`
- `src/navigation/RecreationNavigation.js`
- `src/navigation/SettingsNavigation.js`
- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`

Current-state baseline and companion references only:

- `docs/architecture/navigation-tree-and-route-ownership.md`
- `docs/architecture/root-stack-boundary-cleanup.md`
- `docs/architecture/bottom-tab-shell-cleanup.md`
- `docs/architecture/calendar-stack-boundary-cleanup.md`
- `docs/architecture/journal-stack-extraction.md`
- `docs/architecture/nutrition-stack-extraction.md`
- `docs/architecture/recreation-stack-extraction.md`
- `docs/architecture/settings-account-stack-extraction.md`

Residual context only:

- `src/navigation/DashboardNavigation.js`

These repo docs may inform context and section rhythm, but active code is authoritative if older prose still reflects earlier ownership or incomplete route inventories. Residual navigation surfaces such as `DashboardNavigation.js` are context only for this lane and should be treated as dead-route-audit follow-on material rather than cleanup targets here.

## Current State

Active code shows the current startup path as:

1. `AppBootstrap` calls `resolveInitialRouteName()`.
2. `resolveInitialRouteName()` reads local `user_profile` from AsyncStorage.
3. `resolveInitialRouteName()` returns `Home` when profile data exists and `CompleteProfile` when it does not.
4. `RootContainer` receives `initialRouteName` and passes it into `RootNavigation`.
5. `RootNavigation` mounts `BottomTabNavigation` under `Home`.

The current root stack therefore preserves three registered root routes:

- `CompleteProfile`
- `Home`
- `Tutorials`

Active code also shows that `BottomTabNavigation` currently owns six top-level authenticated destinations:

- `Dashboard`
- `Journal`
- `Calendar`
- `Nutrition`
- `Recreation`
- `Settings`

Current tab-shell evidence also shows:

- the visible tab label for the `Dashboard` route is `Home`
- the authenticated tab shell currently uses `initialRouteName="Calendar"`

Those are present-state facts only. They are not automatic redesign targets in this lane.

Active code shows that `CalendarNavigation` already uses a local constant-backed initial route plus a local screen registry array:

- `CalendarMain`
- `Writing`
- `Edit Writing`
- `NewDay`

That local pattern is the safest current precedent for this lane. It supports later constant-backed cleanup guidance without implying a repo-wide route abstraction.

Active code shows that `JournalNavigation` currently owns a nested stack with `initialRouteName="Journal"` and the following eight registered routes:

- `Journal`
- `WeightLog`
- `QuarterlyEntry`
- `DailyEntry`
- `WeeklyEntry`
- `SupplementLog`
- `Calories`
- `TraitDirectory`

Active code shows that `NutritionNavigation` currently owns a nested stack with `initialRouteName="Nutrition"` and the following six registered routes:

- `Nutrition`
- `Supplement`
- `Meal`
- `MealsList`
- `MealDirectory`
- `MealDetail`

Active code shows that `RecreationNavigation` currently owns a nested stack with `initialRouteName="Recreation"` and the following six registered routes:

- `Recreation`
- `RoutineManager`
- `ProgramManager`
- `EditProgram`
- `EditRoutine`
- `MyExercises`

Active code shows that `SettingsNavigation` currently owns a nested stack with `initialRouteName="Settings"` and the following eleven registered routes:

- `Settings`
- `MyProfile`
- `MyVitals`
- `MyAccount`
- `MyEmail`
- `MyPassword`
- `DeleteAccount`
- `ExportToCSV`
- `TermsOfUse`
- `PrivacyPolicy`
- `Abbrevations`

Current naming drift is real and code-backed. Live examples include:

- visible label `Home` backed by tab route name `Dashboard`
- nested entry route `CalendarMain` under the `Calendar` tab
- spaced route name `Edit Writing`
- compressed route name `NewDay`
- plural route name `MealsList`
- misspelled route name `Abbrevations`

These are present-state facts only. They do not by themselves authorize a route rename, UX-label rethink, cross-stack ownership move, or broad navigation refactor in this lane.

`src/navigation/DashboardNavigation.js` currently defines a `DashboardTabs` route in an otherwise separate navigator file, but active code does not show that navigator mounted by the current root or tab shell. For this lane, that residual surface is context only and belongs to a later dead-route audit rather than naming/constants cleanup scope.

## Objective

Make current route naming and route-definition ownership easier to read, reason about, and maintain without changing what users can do in the app.

This cleanup should reduce brittle string duplication, give touched navigators a clearer constant-backed structure where safe, and document which registered names must remain compatibility-preserving holds for now. The goal is maintainability and reviewability, not user-facing navigation redesign.

## Boundary Rule for This Lane

After this cleanup, route naming and route constants should be clearer and more centralized, but the same navigators should still own the same domains they own today.

For this lane, route naming/constants cleanup may:

- centralize string route names for touched navigators
- reduce repeated literal strings in navigation definitions and common navigation calls
- adopt navigator-local initial-route constants and screen registries where that improves clarity without widening ownership
- use minimal navigation-local shared constants only when duplicate string drift truly requires it
- document retained compatibility holds explicitly when the registered route name should not change in this lane

For this lane, route naming/constants cleanup must not:

- move routes across navigator boundaries
- change startup semantics
- change which tab or nested stack owns a route
- redesign user-visible destination structure
- treat naming cleanup as justification for shell cleanup, extraction work, or broader UX changes
- introduce a repo-wide shared route namespace or abstraction layer

Operational deferral rule:

- if improving a route name would require changing a registered route string, widening call-site migration, deciding a cross-stack ownership question, or rethinking a user-visible label, preserve the current code-backed name and record it as an intentional compatibility hold for a later rename-migration or label-clarification lane

## Proposed Implementation Shape

This lane is bounded cleanup guidance, not a navigator redesign.

- preserve the startup contract in `AppBootstrap`: `Home` for saved `user_profile`, `CompleteProfile` otherwise
- preserve `Home` in `RootNavigation` as the authenticated shell entry
- preserve the three current root route registrations: `CompleteProfile`, `Home`, and `Tutorials`
- preserve the current six tab routes in `BottomTabNavigation`, including current `Dashboard` route name, current visible `Home` tab label, and current `Calendar` default tab unless a minimal constant-only cleanup can clarify those facts without renaming the registered route
- use `CalendarNavigation` as the current local precedent for constant-backed `initialRouteName` and local screen-registry cleanup
- prefer navigator-local route constants and local screen registries for touched navigators over ad hoc string reuse
- allow minimal navigation-local sharing only where repeated literal strings would otherwise create brittle duplication across directly related navigation code
- preserve current code-backed names such as `CalendarMain`, `Edit Writing`, `NewDay`, `MealsList`, and `Abbrevations` unless a narrowly scoped constant strategy improves maintainability without renaming the actual registered route
- document label-versus-route-name mismatch and other naming drift honestly instead of silently normalizing it in this lane
- treat residual surfaces such as `DashboardNavigation` as dead-route-audit follow-on material rather than as an excuse to widen this lane

## Public Interfaces

This artifact changes no public APIs, route destinations, providers, dependencies, or runtime behavior.

The current contracts in `src/bootstrap/AppBootstrap.js`, `src/root-container/RootContainer.js`, `src/navigation/RootNavigation.js`, and the current navigator files are preserved invariants for this lane:

- local `user_profile` still decides `Home` versus `CompleteProfile`
- `initialRouteName` still passes through unchanged from bootstrap to root navigation
- `Home` still remains the authenticated shell entry
- `BottomTabNavigation` still owns the six current top-level authenticated destinations
- `CalendarNavigation`, `JournalNavigation`, `NutritionNavigation`, `RecreationNavigation`, and `SettingsNavigation` still own their current nested route sets unless a minimal constant-only cleanup is strictly internal and behavior-preserving
- current registered route names remain unchanged unless a minimal wiring fix is strictly required

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane even when supplied outside the current repo snapshot or current chat file state
- nearby approved lane docs and the supplied lane brief may inform cadence and phrasing only, but they do not replace the governing Brunch Body project template and scope for this lane
- active code is authoritative over older repo prose for startup facts, navigator ownership, and current route inventories
- bootstrap semantics must remain unchanged
- `RootNavigation` must continue to mount the authenticated shell through `Home`
- `BottomTabNavigation` must continue to own the current six top-level authenticated destinations
- `CalendarNavigation` should be treated as the current safe precedent for navigator-local constant/registry cleanup because it already uses a local initial-route constant and local screen registry
- `docs/architecture/root-stack-boundary-cleanup.md`, `docs/architecture/bottom-tab-shell-cleanup.md`, `docs/architecture/calendar-stack-boundary-cleanup.md`, `docs/architecture/journal-stack-extraction.md`, `docs/architecture/nutrition-stack-extraction.md`, `docs/architecture/recreation-stack-extraction.md`, and `docs/architecture/settings-account-stack-extraction.md` should remain separate companion boundaries so this lane does not absorb their responsibilities
- `docs/architecture/navigation-tree-and-route-ownership.md` should be treated as a baseline evidence map only, with active code taking precedence if that artifact still reflects earlier route ownership or older route inventories

## Acceptance Criteria

- `AppBootstrap` still resolves `Home` for saved `user_profile` data and `CompleteProfile` otherwise
- `RootNavigation` still mounts the authenticated shell under `Home`
- `RootNavigation` still preserves the current root route set:
  - `CompleteProfile`
  - `Home`
  - `Tutorials`
- `BottomTabNavigation` still preserves the same six top-level authenticated destinations:
  - `Dashboard`
  - `Journal`
  - `Calendar`
  - `Nutrition`
  - `Recreation`
  - `Settings`
- `BottomTabNavigation` still preserves current visible `Home` tab label for the `Dashboard` route and current `Calendar` default tab unless a strictly internal constant-only cleanup is required
- `CalendarNavigation` still preserves the current route set:
  - `CalendarMain`
  - `Writing`
  - `Edit Writing`
  - `NewDay`
- `JournalNavigation` still preserves the current route set:
  - `Journal`
  - `WeightLog`
  - `QuarterlyEntry`
  - `DailyEntry`
  - `WeeklyEntry`
  - `SupplementLog`
  - `Calories`
  - `TraitDirectory`
- `NutritionNavigation` still preserves the current route set:
  - `Nutrition`
  - `Supplement`
  - `Meal`
  - `MealsList`
  - `MealDirectory`
  - `MealDetail`
- `RecreationNavigation` still preserves the current route set:
  - `Recreation`
  - `RoutineManager`
  - `ProgramManager`
  - `EditProgram`
  - `EditRoutine`
  - `MyExercises`
- `SettingsNavigation` still preserves the current route set:
  - `Settings`
  - `MyProfile`
  - `MyVitals`
  - `MyAccount`
  - `MyEmail`
  - `MyPassword`
  - `DeleteAccount`
  - `ExportToCSV`
  - `TermsOfUse`
  - `PrivacyPolicy`
  - `Abbrevations`
- touched navigators use clearer route-definition ownership such as localized constants or registries, with no new cross-domain route ownership introduced
- retained code-backed naming drift is documented explicitly rather than silently fixed
- no route rename, startup change, privacy change, copy change, dependency change, or behavior change is introduced unless a minimal wiring fix is strictly required
- any added route-constants surface remains limited to touched navigation code and does not force a broad repo-wide migration
- representative navigation paths into and back out of touched routes still work after the cleanup

## Validation

- static review that the startup-path statements in this artifact match live code in `AppBootstrap`, `RootContainer`, and `RootNavigation`
- static review that `RootNavigation` still mounts `BottomTabNavigation` under `Home`
- static review that `BottomTabNavigation` still owns the six current top-level authenticated destinations, including the current `Dashboard` route name, visible `Home` tab label, and `Calendar` default tab
- static review that each nested navigator still registers the same live route set documented in this artifact
- static review that any new constants or registries do not widen ownership, rename registered routes unexpectedly, or imply a repo-wide routing abstraction
- static review that retained naming drift such as `Dashboard` versus visible `Home`, `CalendarMain`, `Edit Writing`, `NewDay`, `MealsList`, and `Abbrevations` is documented as current-state compatibility hold rather than silently normalized
- static review that any mention of residual navigation surfaces remains contextual only and does not widen scope beyond naming/constants cleanup
- static review that the final diff adds only `docs/architecture/route-naming-and-constants-cleanup.md`
- manual smoke coverage for returning-user path to `Home`
- manual smoke coverage for tab-shell render
- manual smoke coverage for representative entry into each touched stack
- manual smoke coverage for representative back navigation from touched routes
- manual smoke coverage for any constantized call sites touched during implementation, if any

## Risks / Notes

- main risk is accidental behavior change caused by a cleanup that actually renames a registered route string or misses a literal-string call site
- another risk is conflating code-backed route names with user-visible labels and then trying to normalize both in one lane
- another risk is widening this lane into root cleanup, shell cleanup, extraction work, or a broad shared-route abstraction
- current code-backed names such as `CalendarMain`, `Edit Writing`, `NewDay`, `MealsList`, and `Abbrevations` should be recorded and tolerated here unless a minimal wiring fix is strictly required
- the `Dashboard` route versus visible `Home` tab label mismatch should be treated carefully and may need documentation-first treatment here rather than an immediate rename
- residual surfaces such as `DashboardNavigation` should be recorded honestly as context only and deferred to a dead-route audit rather than absorbed here
- the safest model for this lane is minimal-diff route-constants cleanup, not broad navigation redesign

## Follow-on Lane Seeds

- route rename migration lane for explicitly approved registered-route or label changes
- dead-route audit
- navigator-wide smoke tests
- typed navigation params/constants cleanup
- label-versus-route-name clarification lane

## Assumptions

- the requested artifact should follow the same reviewable cadence as the approved `1.1.2.2.1` through `1.1.2.2.8` lane docs while still treating `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` as the governing inputs
- active code is authoritative over older repo prose and over omissions in the lane brief for startup facts, navigator ownership, and current registered route names
- current live route inventories therefore include `WeightLog`, `Supplement`, and `Meal` and should be documented as present-state facts in this lane
- this lane is about naming and constant clarity, not ownership redesign, UX redesign, or rename migration
- if a cleaner route name would require changing a registered route string or widening call-site migration radius, that work should be deferred rather than absorbed here

## Constraints

- docs-only
- create exactly one new file: `docs/architecture/route-naming-and-constants-cleanup.md`
- no production code changes
- no config changes
- no tests changed
- no dependency or package changes
- no route renames unless a minimal wiring fix is strictly required
- no behavior changes
- keep the lane present-state aware and cleanup-bounded
- use active code as the source of truth if repo docs differ

## Acceptance

- exactly one new docs file is added at `docs/architecture/route-naming-and-constants-cleanup.md`
- the artifact is in Brunch Body Project Template style
- the artifact defines a bounded, Codex-ready route naming/constants cleanup lane
- the artifact preserves current bootstrap and shell semantics in its contract
- the artifact clearly distinguishes in-scope naming/constant cleanup from out-of-scope ownership moves, UX redesign, residual-route cleanup, and broad rename migration
- the artifact provides binary, reviewable acceptance criteria
- the artifact does not implement cleanup or propose unrelated product changes

## Do not

- implement the refactor
- change startup behavior
- move routes across navigator layers
- redesign tabs or screen flows
- widen into ownership cleanup already covered by earlier lanes
- mix this lane with privacy work, UX redesign, dead-route cleanup, or broad rename migration

## Review standard

- keep scope narrow
- do not expand beyond stated files and surfaces
- do not introduce backend or cloud behavior unless explicitly requested
- do not change disclosures, privacy claims, or deletion semantics unless this lane explicitly includes them
- prefer minimal diffs
- add tests only for touched logic or required acceptance in the later implementation lane
- if the task is broader than stated, stop and leave a note rather than widening scope
