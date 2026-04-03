# Lane: 1.1.2.2.11 Navigation smoke tests

## Summary

This artifact defines a bounded smoke-test lane for the current navigation contract in the active Brunch Body mobile app.

This lane is docs-only and evidence-first. It exists to make later navigation cleanup and regression lanes safer without changing runtime behavior, navigator ownership, route names, startup semantics, or test infrastructure in this lane.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane, but they are not present in the current repo snapshot. For this artifact, the approved lane brief supplied in chat is the governing input where those files are not locally visible. Live code is authoritative for startup facts, current navigator ownership, route registrations, and current test-harness constraints. Nearby approved lane docs may inform cadence and phrasing only.

## Classification

Ready for codex

## Scope

### In Scope

- create one docs-only lane artifact for navigation smoke-test guidance
- preserve the current bootstrap contract where `resolveInitialRouteName()` returns `Home` when local `user_profile` exists and `CompleteProfile` otherwise
- preserve the current bootstrap path from `resolveInitialRouteName()` into root navigation
- preserve `Home` as the root-owned authenticated shell entry
- preserve the current six top-level authenticated tab destinations:
  - `Dashboard`
  - `Journal`
  - `Calendar`
  - `Nutrition`
  - `Recreation`
  - `Settings`
- preserve the current compatibility hold where the `Dashboard` route is shown with visible tab label `Home`
- define bounded future smoke coverage for:
  - bootstrap route resolution
  - root-shell entry under `Home`
  - tab-shell render
  - representative entry into each cleaned-up nested stack family
  - representative back-navigation expectations from the touched nested routes
- preserve the existing `__tests__/AppBootstrap.test.js` precedent and describe only the smallest future test expansion needed
- keep future smoke guidance on the current Jest plus `react-test-renderer` path unless a later lane explicitly reopens testing infrastructure

### Out of Scope

- no production code changes
- no test implementation in this lane
- no startup-rule changes
- no route renames
- no route ownership moves between navigators
- no tab redesign
- no screen-internal behavior redesign
- no new broad E2E harness
- no simulator or device test program in this lane
- no repo-wide navigation test abstraction
- no privacy, disclosure, or settings-policy work
- no dependency or tooling changes unless a later lane explicitly reopens the existing infrastructure
- no unrelated UX cleanup

## Files / Surfaces

Primary implementation evidence inspected for this artifact:

- `src/bootstrap/AppBootstrap.js`
- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/CalendarNavigation.js`
- `src/navigation/JournalNavigation.js`
- `src/navigation/NutritionNavigation.js`
- `src/navigation/RecreationNavigation.js`
- `src/navigation/SettingsNavigation.js`
- `src/navigation/routeNames.js`
- `__tests__/AppBootstrap.test.js`
- `__tests__/accountFlows.test.js`
- `jest.setup.js`

Companion architecture docs as baseline and context only:

- `docs/architecture/navigation-tree-and-route-ownership.md`
- `docs/architecture/root-stack-boundary-cleanup.md`
- `docs/architecture/bottom-tab-shell-cleanup.md`
- `docs/architecture/calendar-stack-boundary-cleanup.md`
- `docs/architecture/journal-stack-extraction.md`
- `docs/architecture/nutrition-stack-extraction.md`
- `docs/architecture/recreation-stack-extraction.md`
- `docs/architecture/settings-account-stack-extraction.md`
- `docs/architecture/route-naming-and-constants-cleanup.md`
- `docs/architecture/dead-route-and-duplicate-route-audit.md`

Live code is authoritative if older docs lag current ownership or route naming.

## Current State

Active code shows the current startup path as:

1. `AppBootstrap` calls `resolveInitialRouteName()`.
2. `resolveInitialRouteName()` reads local `user_profile` from AsyncStorage.
3. `resolveInitialRouteName()` returns `ROOT_ROUTES.HOME` when profile data exists and `ROOT_ROUTES.COMPLETE_PROFILE` otherwise.
4. `AppBootstrap` returns `null` until `initialRouteName` resolves.
5. Once resolved, the same `initialRouteName` is passed into root navigation.

Existing bootstrap test coverage already locks that contract at a narrow unit level. `__tests__/AppBootstrap.test.js` currently asserts:

- `Home` when a saved local profile exists
- `CompleteProfile` when no saved local profile exists

Active root-navigation code also shows that the current root stack now owns only three registered routes:

- `CompleteProfile`
- `Home`
- `Tutorials`

`Home` remains the authenticated shell entry and still mounts `BottomTabNavigation`. `Tutorials` remains a preserved root-owned exception and context surface only for this lane. It is not a signal to reopen ownership cleanup here.

Active tab-shell code shows that `BottomTabNavigation` still owns the same six top-level authenticated destinations:

- `Dashboard`
- `Journal`
- `Calendar`
- `Nutrition`
- `Recreation`
- `Settings`

Current tab-shell evidence also shows:

- the visible tab label for the `Dashboard` route is still `Home`
- the authenticated tab shell still initializes to `Calendar`

Those are present-state facts only. They are not redesign targets in this lane.

The current nested stack owners remain:

- `CalendarNavigation` with initial route `CalendarMain`
- `JournalNavigation` with initial route `Journal`
- `NutritionNavigation` with initial route `Nutrition`
- `RecreationNavigation` with initial route `Recreation`
- `SettingsNavigation` with initial route `Settings`

Representative live entry evidence for those stacks includes:

- `Calendar` flow entering `NewDay`
- `Journal` flow entering `DailyEntry`
- `Nutrition` flow entering `Meal` and then `MealsList`
- `Recreation` flow entering `RoutineManager` and then `EditRoutine`
- `Settings` flow entering `MyProfile` and then `MyAccount`

Current test-harness evidence also matters for this lane. `jest.setup.js` provides lightweight shared navigator mocks for `@react-navigation/native`, `@react-navigation/stack`, and `@react-navigation/bottom-tabs`, but those mocks return children directly and drop `Screen` props. Future route-registration assertions therefore need file-local, behavior-preserving navigator mocks instead of widening repo-wide test infrastructure in order to inspect route names or options safely.

## Objective

Lock the current navigation behavior with a small, reviewable smoke-test lane so later cleanup lanes can move faster without rebreaking startup, authenticated-shell entry, tab-shell registration, or representative nested-stack flows.

This lane is about verification guidance and regression protection only. It is not a navigation redesign, test-harness overhaul, or ownership-cleanup lane.

## Boundary Rule for This Lane

This lane may:

- define bounded smoke-test guidance for the current bootstrap contract
- define bounded smoke-test guidance for root-shell entry under `Home`
- define bounded smoke-test guidance for the six-tab authenticated shell
- define one representative entry and one representative immediate-parent back expectation for each touched nested stack family
- preserve current compatibility holds such as `Dashboard` route name with visible `Home` label
- record current harness constraints that should shape later implementation

This lane must not:

- implement the tests
- change startup behavior
- rename routes
- move route ownership between navigators
- redesign visible labels or flows
- treat missing coverage as permission to rewrite navigation architecture
- widen into a broad integration harness, device harness, or E2E program

Operational deferral rule:

- if a smoke-test idea would require broad harness invention, unstable multi-domain mocking, gesture or hardware-back simulation, or behavior changes to make the test pass, stop and defer that idea to a later testing-infrastructure or runtime-smoke lane instead of widening this one

## Proposed Implementation Shape

This lane is bounded smoke-test guidance, not test implementation.

- preserve `__tests__/AppBootstrap.test.js` as the existing bootstrap contract precedent and extend it only if a later implementation lane needs a small clarification
- add only one focused navigation smoke-test surface in `__tests__/` for navigation contracts
- prefer contract-level assertions over broad device simulation
- prefer file-local navigator mocks that preserve route registration data when the test needs to inspect `Screen` names or options
- do not replace shared repo-wide test infrastructure just to support this smoke lane
- treat `Tutorials` as a preserved root-owned exception and context surface only, not as permission to reopen navigator-boundary work

The future smoke matrix for this lane should stay bounded to the following contracts:

| Contract area | Current live contract | Minimum future smoke assertion |
| --- | --- | --- |
| Bootstrap resolution | `resolveInitialRouteName()` reads `user_profile` and resolves `Home` or `CompleteProfile` | Preserve the existing `__tests__/AppBootstrap.test.js` assertions and do not replace them with broader harness work |
| Root-shell entry | `RootNavigation` keeps `Home` as the root-owned authenticated shell route | Assert that `Home` still mounts `BottomTabNavigation`, not a flattened dashboard screen or domain detail screen |
| Tab-shell render | `BottomTabNavigation` still owns `Dashboard`, `Journal`, `Calendar`, `Nutrition`, `Recreation`, and `Settings` | Assert the six current top-level routes and preserve the compatibility hold where `Dashboard` shows visible label `Home` |
| Calendar representative flow | `Calendar` enters `CalendarMain`, and current flow enters `NewDay` from the calendar domain | Assert one representative forward entry into `NewDay` and one immediate-parent back expectation to the calendar parent route |
| Journal representative flow | `Journal` enters `Journal`, and current flow enters `DailyEntry` | Assert one representative forward entry into `DailyEntry` and one immediate-parent back expectation to `Journal` |
| Nutrition representative flow | `Nutrition` enters `Nutrition`, then `Meal`, then `MealsList` | Assert one representative forward path into `Meal` then `MealsList` and one immediate-parent back expectation from the touched child route |
| Recreation representative flow | `Recreation` enters `Recreation`, then `RoutineManager`, then `EditRoutine` | Assert one representative forward path into `RoutineManager` then `EditRoutine` and one immediate-parent back expectation from the touched child route |
| Settings representative flow | `Settings` enters `Settings`, then `MyProfile`, then `MyAccount` | Assert one representative forward path into `MyProfile` then `MyAccount` and one immediate-parent back expectation from the touched child route |

Implementation guidance for the later test lane should also preserve these rules:

- stay on the current Jest plus `react-test-renderer` path unless a later lane explicitly reopens testing infrastructure
- keep mocks navigator-local and behavior-preserving
- favor binary registration and ownership assertions over full UI choreography
- defer simulator or device smoke, full navigation-state integration, and gesture-level back handling to follow-on lanes

## Public Interfaces

This artifact changes no public APIs, route destinations, providers, dependencies, runtime behavior, navigator ownership boundaries, startup rules, tab design, or screen behavior.

Preserved invariants for this lane:

- `resolveInitialRouteName()` still returns `Home` for saved local `user_profile` data and `CompleteProfile` otherwise
- `AppBootstrap` still returns `null` until the initial route resolves
- `Home` remains the authenticated shell entry at root
- `BottomTabNavigation` still owns the same six top-level authenticated destinations
- current compatibility holds such as `Dashboard` route name with visible `Home` label remain preserved
- `Tutorials` remains a root-owned exception and context surface only

The only repo change for this lane is the addition of `docs/architecture/navigation-smoke-tests.md`.

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative, but the approved chat-supplied lane brief governs where those files are not locally visible in this repo snapshot
- live code is authoritative for startup facts, navigator ownership, registered route names, and current tab-shell behavior
- `src/navigation/routeNames.js` is supporting evidence in this working tree because current bootstrap and navigators import route constants from it, but live registrations remain the source of truth
- existing bootstrap semantics in `__tests__/AppBootstrap.test.js` should be preserved or extended rather than replaced
- current shared navigator mocks in `jest.setup.js` constrain later implementation and should be treated as current infrastructure, not as permission for a repo-wide harness rewrite
- nearby approved architecture docs may inform cadence and phrasing only; they do not replace the governing project inputs or live code

## Acceptance Criteria

- exactly one new lane doc is added at `docs/architecture/navigation-smoke-tests.md`
- the artifact is in Brunch Body Project Template style and remains Ready for codex
- the artifact preserves the current bootstrap contract: `Home` for saved `user_profile`, `CompleteProfile` otherwise
- the artifact preserves the fact that `AppBootstrap` returns `null` until the initial route resolves
- the artifact preserves `Home` as the authenticated shell entry and preserves the same six top-level authenticated tab destinations
- the artifact preserves the compatibility hold where the `Dashboard` route shows visible tab label `Home`
- the artifact treats `Tutorials` as a preserved root-owned exception and context surface only
- the artifact defines binary, reviewable future smoke coverage for:
  - bootstrap route resolution
  - root-shell entry
  - tab-shell render
  - representative entry into the calendar, journal, nutrition, recreation, and settings stack families
  - one immediate-parent back expectation for each touched nested-flow family
- the artifact directs future implementation to preserve `__tests__/AppBootstrap.test.js` and add only one focused navigation smoke-test surface in `__tests__/`
- the artifact explicitly records the `jest.setup.js` navigator-mock constraint and directs later route-registration assertions to use file-local, behavior-preserving mocks
- the artifact does not propose route renames, ownership moves, startup changes, broad E2E work, or a new shared test harness

## Validation

- static review that every startup-path and shell statement in this artifact matches live code in `AppBootstrap`, `RootNavigation`, `BottomTabNavigation`, and the current nested-stack navigators
- static review that `src/navigation/routeNames.js` is treated as supporting evidence rather than a replacement for live navigator registrations
- static review that the existing `__tests__/AppBootstrap.test.js` contract is represented accurately and described as preserved or extended rather than replaced
- static review that the listed smoke scenarios map to current navigator ownership rather than stale architecture docs
- static review that the `jest.setup.js` limitation is represented accurately and bounded to later implementation guidance
- final diff review that the only new file added for this lane is `docs/architecture/navigation-smoke-tests.md`
- manual runtime smoke may be captured in a later lane, but this docs lane is complete with static evidence and bounded guidance only

## Risks / Notes

- the main risk is widening a smoke-test lane into a full navigation test program
- another risk is confusing visible labels with route names, especially `Dashboard` versus visible `Home`
- another risk is implicitly reopening earlier cleanup decisions by asserting stale ownership from older docs instead of current navigator boundaries
- another risk is assuming the shared navigator mocks in `jest.setup.js` are sufficient for route-registration assertions when they currently drop `Screen` props
- if a smoke-test idea requires broad harness invention or behavior changes, it should be deferred rather than absorbed here
- if local route-constant surfaces or private working-tree evidence diverge from older docs, this lane should record the evidence-state split explicitly rather than guess

## Follow-on Lane Seeds

- focused runtime simulator or device smoke lane
- navigator-wide integration harness lane
- typed navigation params and assertion cleanup lane
- stack-by-stack regression expansion lane
- stale architecture-doc reconciliation after smoke coverage lands

## Assumptions

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative even though they are absent from the current repo snapshot
- the approved lane brief supplied in chat governs where those files are not locally visible
- active code is authoritative over older repo prose for startup facts, route ownership, current route names, and current tab ownership
- `src/navigation/routeNames.js` exists in this working tree and is a relevant supporting surface because current bootstrap imports `ROOT_ROUTES` from it
- future implementation should stay on the existing Jest plus `react-test-renderer` path unless a later lane explicitly reopens testing infrastructure
- this lane is about smoke-test scope and verification guidance only, not navigation redesign or test-harness overhaul

## Constraints

- docs-only
- create exactly one new file: `docs/architecture/navigation-smoke-tests.md`
- no production code changes
- no config changes
- no tests changed
- no dependency or package changes
- no route renames
- no behavior changes
- keep the lane present-state aware and cleanup-bounded
- the only repo change from this lane is the new docs file

## Acceptance

- exactly one new docs file is added at `docs/architecture/navigation-smoke-tests.md`
- the artifact preserves current bootstrap and authenticated-shell semantics in its contract
- the artifact clearly distinguishes in-scope smoke-test guidance from out-of-scope navigation redesign and broad testing-infrastructure work
- the artifact provides binary, reviewable acceptance criteria
- the artifact does not implement tests or propose unrelated product changes

## Do not

- implement the tests in this lane
- change startup behavior
- move routes across navigators
- rename routes
- redesign tabs or screen flows
- widen into ownership cleanup already covered by earlier lanes
- widen into a broad integration or E2E navigation program
- add a new shared navigation test harness in this lane
- mix this lane with privacy work, UX redesign, or unrelated cleanup

## Review standard

- keep scope narrow
- do not expand beyond the stated files or surfaces
- do not introduce backend or cloud behavior unless explicitly requested
- do not change disclosures, privacy claims, or deletion semantics unless this lane explicitly includes them
- prefer minimal diffs
- add tests only in later implementation lanes and only for touched logic or required acceptance
- if the task is broader than stated, stop and leave a note rather than widening scope
