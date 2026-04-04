# Lane: 1.1.2.2.21 Navigator test-coverage gap audit

## Summary

This artifact audits the current navigator and representative flow test coverage against the live mounted navigation contract in the active Brunch Body mobile app.

This lane is docs-only and evidence-first. It identifies which navigation contracts are already protected, which are only partially protected, and which remaining gaps are low-risk versus follow-on worthy without adding tests, changing runtime behavior, or widening into harness work.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane. Live mounted code is authoritative for startup facts, navigator ownership, route registrations, and current navigation behavior. The named navigation test files are authoritative only for the coverage claims that can be re-verified directly from their current assertions. Nearby approved lane docs may inform cadence and phrasing only.

## Classification

Ready for codex

## Scope

### In Scope

- create one docs-only audit artifact for navigator test-coverage gaps
- inspect the current navigation-related test surfaces and compare them to the live navigation contract
- classify existing coverage and remaining gaps across:
  - bootstrap resolution
  - root-shell ownership
  - tab-shell ownership
  - mounted stack route-set coverage
  - representative flow coverage
  - entry-path and back-navigation contract coverage
- classify each finding with one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- distinguish clearly between:
  - `covered by current tests`
  - `partially covered`
  - `uncovered but low risk`
  - `uncovered and follow-on worthy`
- seed follow-on test lanes without implementing them

### Out of Scope

- no production code changes
- no new tests in this lane
- no route renames
- no navigator ownership moves
- no startup-rule changes
- no tab redesign
- no test-harness redesign
- no dependency or tooling changes
- no unrelated UX cleanup

## Files / Surfaces

Primary evidence surfaces inspected for this artifact:

- `__tests__/AppBootstrap.test.js`
- `__tests__/navigationSmokeNavigators.test.js`
- `__tests__/navigationSmokeFlows.test.js`
- `src/bootstrap/AppBootstrap.js`
- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/CalendarNavigation.js`
- `src/navigation/JournalNavigation.js`
- `src/navigation/NutritionNavigation.js`
- `src/navigation/RecreationNavigation.js`
- `src/navigation/SettingsNavigation.js`
- `src/navigation/routeNames.js`

Companion architecture docs used as context only:

- `docs/architecture/navigation-smoke-tests.md`
- `docs/architecture/navigation-call-site-drift-audit.md`
- `docs/architecture/stack-entry-path-audit.md`
- `docs/architecture/route-constants-adoption-audit.md`

Live mounted code is authoritative for the current navigation contract. Current test files are authoritative only for the specific assertions they actually make.

## Current State

Active code shows the current mounted navigation contract as:

1. `resolveInitialRouteName()` in `src/bootstrap/AppBootstrap.js` reads local `user_profile` from AsyncStorage and returns `ROOT_ROUTES.HOME` when profile data exists and `ROOT_ROUTES.COMPLETE_PROFILE` otherwise.
2. `AppBootstrap` keeps `initialRouteName` in local state and returns `null` until that route resolves.
3. `RootNavigation` currently registers exactly three root routes: `CompleteProfile`, `Home`, and `Tutorials`.
4. `Home` remains the root-owned authenticated shell entry and mounts `BottomTabNavigation`.
5. `BottomTabNavigation` currently registers the six authenticated tab destinations: `Dashboard`, `Journal`, `Calendar`, `Nutrition`, `Recreation`, and `Settings`.
6. `BottomTabNavigation` still sets `initialRouteName={AUTH_TAB_ROUTES.CALENDAR}` and still displays the `Dashboard` tab with visible label `Home`.
7. The mounted nested navigators currently preserve these route sets:
   - `CalendarNavigation`: `CalendarMain`, `Writing`, `Edit Writing`, `NewDay`
   - `JournalNavigation`: `Journal`, `WeightLog`, `QuarterlyEntry`, `DailyEntry`, `WeeklyEntry`, `SupplementLog`, `Calories`, `TraitDirectory`
   - `NutritionNavigation`: `Nutrition`, `Supplement`, `Meal`, `MealsList`, `MealDirectory`, `MealDetail`
   - `RecreationNavigation`: `Recreation`, `RoutineManager`, `ProgramManager`, `EditProgram`, `EditRoutine`, `MyExercises`
   - `SettingsNavigation`: `Settings`, `MyProfile`, `MyVitals`, `MyAccount`, `MyEmail`, `MyPassword`, `DeleteAccount`, `ExportToCSV`, `TermsOfUse`, `PrivacyPolicy`, `Abbrevations`

Current test evidence protects only part of that live contract:

- `__tests__/AppBootstrap.test.js` directly asserts `Home` when saved local profile data exists and `CompleteProfile` when no local profile data exists.
- `__tests__/navigationSmokeNavigators.test.js` directly asserts that `RootNavigation` returns `null` until `initialRouteName` is present, keeps `Home` as the authenticated shell entry, preserves the root route set, preserves the six-tab shell, preserves the `Dashboard` visible label `Home` compatibility hold, and preserves the current mounted stack route sets.
- `__tests__/navigationSmokeFlows.test.js` directly asserts a bounded set of representative runtime behaviors, including tutorial exit and back-out behavior, selected forward navigation examples, selected immediate back-behavior expectations, and one representative settings entry exposure. It does not by itself prove comprehensive stack-by-stack runtime coverage.

Current evidence is therefore strongest for structural registration and ownership contracts, narrower for representative runtime flows, and limited for compatibility-context runtime behavior outside the explicitly asserted examples.

## Objective

Produce a bounded audit that answers:

- which navigation contracts are already protected by current tests
- which areas are only partially covered
- which gaps are low risk and acceptable for now
- which gaps deserve later focused test work

The goal is to reduce uncertainty before future navigation cleanup or runtime-normalization lanes rely on coverage that may not actually exist.

## Boundary Rule for This Lane

This lane may:

- inspect current navigation-related tests
- compare those tests against the live navigation contract
- classify coverage strength and remaining gaps
- recommend follow-on test lanes

This lane must not:

- add or rewrite tests
- change startup behavior
- rename routes
- move ownership between navigators
- redesign flows
- convert the audit into implementation work

Operational deferral rule:

- if closing a coverage gap would require broader harness work, simulator or device infrastructure, or behavior changes to make assertions pass, classify that gap as `defer` rather than widening this lane

## Audit Method

- inventory the live navigation contract from `src/navigation/routeNames.js`, bootstrap, root navigation, the tab shell, and the mounted stack navigators
- inventory the current navigation-related test surfaces in `__tests__/`
- compare each major navigation contract area to the current assertions
- record one row per meaningful coverage finding
- keep obvious fully covered baseline contracts out of the gap register unless they are needed as comparison context
- require every coverage claim to be backed by a directly re-verified current assertion or a directly re-verified missing assertion from the named suites
- do not infer broad runtime coverage from the presence of `__tests__/navigationSmokeFlows.test.js`

### Coverage taxonomy

- `covered by current tests`
- `partially covered`
- `uncovered but low risk`
- `uncovered and follow-on worthy`

### Disposition taxonomy

- `keep`
- `keep for compatibility`
- `candidate cleanup`
- `defer`

## Findings Register

Only include a row in this register when live code and current tests together show either a clearly protected contract area or a meaningful remaining gap worth carrying forward. Keep the register fixed at five rows for this lane.

| contract area | current live contract | current test evidence | coverage type | disposition | follow-on lane |
| --- | --- | --- | --- | --- | --- |
| Bootstrap route resolution | `resolveInitialRouteName()` returns `Home` when saved local `user_profile` data exists and `CompleteProfile` otherwise. | `__tests__/AppBootstrap.test.js` directly asserts `Home` for saved local profile data and `CompleteProfile` when no local profile data exists. | `covered by current tests` | `keep` | none |
| Root-shell, tab-shell, and mounted stack route-set coverage | `RootNavigation` owns `CompleteProfile`, `Home`, and `Tutorials`; `Home` mounts the six-tab shell; `BottomTabNavigation` owns `Dashboard`, `Journal`, `Calendar`, `Nutrition`, `Recreation`, and `Settings`; the mounted stack navigators preserve their current registered route sets. | `__tests__/navigationSmokeNavigators.test.js` directly asserts the root route set, `Home` as the authenticated shell entry, the six tab destinations, the visible `Dashboard` label `Home` compatibility hold, and the current mounted stack route sets. | `covered by current tests` | `keep` | none |
| Representative flow-level navigation and back-navigation smoke | Representative runtime flows should continue to align with the current owners, entry paths, and immediate back behavior for the specific child screens that the current app still uses as live exemplars. | `__tests__/navigationSmokeFlows.test.js` directly re-verifies only specific representative runtime assertions from the current file contents, including tutorial exit and back-out behavior, selected forward navigation examples, selected default-header back expectations, and one representative settings entry exposure. It does not cover every stack child route or every back path. | `partially covered` | `defer` | stack-by-stack runtime smoke validation lane |
| Compatibility-path runtime coverage | The remaining preserved compatibility-context runtime paths should stay stable, especially onboarding tutorial entry and complete-profile completion into `Home` with nested `Dashboard`, in addition to the already-preserved root-owned `Tutorials` exception. | `__tests__/navigationSmokeFlows.test.js` already covers tutorial exit to `Home -> Dashboard` and first-slide tutorial back-out with `goBack()`, but the current suites do not directly assert onboarding `Welcome -> Tutorials` entry or complete-profile completion into `Home -> Dashboard`. Those remaining compatibility paths stay unverified in this lane. | `uncovered and follow-on worthy` | `defer` | focused compatibility-path test lane |
| Untouched stack-local child routes outside the representative smoke set | Registered child routes outside the specifically exercised representatives should continue to respect current stack ownership and current immediate-parent expectations without changing route names or owners. | `__tests__/navigationSmokeNavigators.test.js` proves that these routes remain registered in the mounted stack route sets, but `__tests__/navigationSmokeFlows.test.js` does not directly exercise most of their forward entry or back-navigation behavior. The remaining gap is runtime breadth, not structural registration. | `uncovered but low risk` | `candidate cleanup` | cleanup decision log update |

## Related Context / Non-Findings

- `Dashboard` versus visible `Home` is primarily a label-versus-route-name issue, not a gap finding by itself. In the current repo snapshot, `__tests__/navigationSmokeNavigators.test.js` already asserts that the `Dashboard` tab still displays visible label `Home`.
- Compatibility-hold route names such as `CalendarMain`, `Edit Writing`, `NewDay`, `MealsList`, and `Abbrevations` remain naming and compatibility context, not navigator test-gap findings by themselves.
- The mere presence of `__tests__/navigationSmokeFlows.test.js` does not imply comprehensive flow coverage. This audit credits that file only for the specific representative assertions that were re-verified directly from its current contents.
- `__tests__/accountFlows.test.js` includes root reset coverage for logout and delete-account behavior, but that suite is outside this lane's named navigator coverage baseline and does not change the fixed five-row findings register.
- Structural registration coverage and runtime behavior coverage are related but different. Preserving a route in a mounted stack route set does not by itself prove forward entry, nested params, or back-navigation behavior for that route.

## Public Interfaces

None.

This artifact changes no public APIs, route destinations, labels, providers, dependencies, or runtime behavior.

Preserved invariants for this lane:

- bootstrap still resolves `Home` versus `CompleteProfile`
- `Home` remains the authenticated shell entry
- current root, tab, and nested-stack ownership remains unchanged
- current registered route names and visible labels remain unchanged in this lane

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane
- live mounted code is authoritative for startup facts, navigator ownership, route registrations, and current navigation behavior
- the named navigation test files are authoritative for current coverage claims only where their assertions directly support those claims
- nearby approved lane docs may inform cadence and phrasing only; they do not replace the governing inputs

## Acceptance Criteria

- exactly one new docs artifact is added at `docs/architecture/navigator-test-coverage-gap-audit.md`
- the artifact is in Brunch Body Project Template style
- the artifact inventories navigator test-coverage gaps using live code and current test evidence
- each finding includes one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- the artifact clearly distinguishes covered, partially covered, low-risk uncovered, and follow-on-worthy uncovered areas
- the artifact does not add tests, rename routes, move ownership, or change startup behavior
- the artifact clearly separates audit findings from later implementation work

## Validation

- static review that startup and shell statements match live mounted code
- static review that each coverage finding is backed by actual current test evidence or an actual current missing assertion from the named suites
- static review that bootstrap and mounted-navigator coverage are credited accurately to the existing test files
- static review that flow-level coverage is not overstated beyond what direct review of `__tests__/navigationSmokeFlows.test.js` actually proves
- final diff review that the only repo change is `docs/architecture/navigator-test-coverage-gap-audit.md`

## Risks / Notes

- the main risk is overstating coverage because a flow-test file exists
- another risk is confusing structural navigator coverage with runtime flow coverage
- another risk is widening the audit into test implementation or harness design
- compatibility-path coverage is easy to overstate if tutorial exit coverage is mistaken for full onboarding and completion-path coverage
- this lane should stay conservative and only record findings with evidence at least as strong as the fixed five-row register

## Follow-on Lane Seeds

- stack-by-stack runtime smoke validation lane
- focused compatibility-path test lane
- navigator integration-harness lane
- cleanup decision log update
- stale architecture-doc reconciliation update

## Assumptions

- this artifact should follow the same reviewable cadence as the approved `1.1.2.2.x` lane docs while still treating `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` as the governing inputs
- active mounted code is authoritative over older docs for startup facts, navigator ownership, route registrations, and current behavior
- current test files are authoritative for current coverage claims only where the current assertions directly support those claims
- this lane is about audit and classification only, not test implementation or navigation redesign
- under-claiming is safer than over-claiming when the current flow suite proves only representative behavior
