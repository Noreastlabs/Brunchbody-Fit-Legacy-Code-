# Flow Smoke Test Map

## Lane Boundary

- Lane `1.1.7.2.1` is docs-only.
- This lane approves no app behavior, route, privacy, disclosure, dependency, backend, AI, desktop, monetization, or test-framework changes.
- This lane does not add, edit, refactor, or rename tests.
- Later smoke-test work must be split into bounded child lanes.
- Coverage classifications are evidence-controlled, not predetermined findings. If inspected evidence is unclear, the map uses `Partial`, `Unknown`, or `Deferred` instead of forcing `Covered`.
- Adjacent boundary tests are used only to avoid false gaps. This map is not a full test-suite audit.

## Evidence Sources

- `__tests__/AppBootstrap.test.js` - read-only evidence for startup/bootstrap route resolution and fallback behavior.
- `__tests__/navigationSmokeNavigators.test.js` - read-only evidence for root, authenticated tab, and stack route-set smoke contracts.
- `__tests__/navigationSmokeFlows.test.js` - read-only evidence for representative Tutorials, journal/calendar, nutrition, recreation, and settings flow smoke coverage.
- `__tests__/completeProfileFlowBoundary.test.js` - read-only adjacent boundary evidence for CompleteProfile ownership and validation flow boundaries.
- `__tests__/completeProfileNicknameBoundary.test.js` - read-only adjacent boundary evidence for CompleteProfile nickname progression.
- `__tests__/calendarTodoOwnershipBoundary.test.js` - read-only adjacent boundary evidence for calendar-owned todo action ownership.
- `__tests__/calendarTodoSubmissionBoundary.test.js` - read-only adjacent boundary evidence for calendar todo payload shape.
- `__tests__/calendarSelectorBoundary.test.js` - read-only adjacent boundary evidence for calendar selector and todo ownership seams.
- `__tests__/calendarThemeStorageBoundary.test.js` - read-only adjacent boundary evidence for calendar theme storage repair behavior.
- `__tests__/calendarThemeRepeatedThemeBoundary.test.js` - read-only adjacent boundary evidence for calendar theme and repeated-theme contracts.
- `__tests__/journalSliceBoundary.test.js` - read-only adjacent boundary evidence for journal reducer and thunk contracts.
- `__tests__/journalTraitsStorageBoundary.test.js` - read-only adjacent boundary evidence for journal traits storage.
- `__tests__/journalFormUxBoundary.test.js` - read-only adjacent boundary evidence for journal form handoffs and validation boundaries.
- `__tests__/nutritionStorageBoundary.test.js` - read-only adjacent boundary evidence for nutrition storage and reader contracts.
- `__tests__/nutritionFormUxBoundary.test.js` - read-only adjacent boundary evidence for nutrition form validation and modal boundaries.
- `__tests__/nutritionSupplementContract.test.js` - read-only adjacent boundary evidence for supplement reducer contracts.
- `__tests__/recreationStorageBoundary.test.js` - read-only adjacent boundary evidence for recreation storage contracts.
- `__tests__/recreationSliceBoundary.test.js` - read-only adjacent boundary evidence for recreation reducer and thunk contracts.
- `__tests__/recreationFormUxBoundary.test.js` - read-only adjacent boundary evidence for recreation form validation boundaries.
- `__tests__/settingsFormUxBoundary.test.js` - read-only adjacent boundary evidence for MyVitals and MyProfile form boundaries.
- `__tests__/settingsTutorialsOwnership.test.js` - read-only adjacent boundary evidence for Tutorials ownership through the settings barrel.
- `__tests__/accountFlows.test.js` - read-only adjacent boundary evidence for local account/settings entries. Sensitive privacy, export, deletion, reset, and disclosure semantics remain out of scope for this lane.

## Current Coverage Map

| Flow / Domain | Existing Evidence | Coverage Level | Notes |
|---|---|---|---|
| Startup / bootstrap | `AppBootstrap.test.js` verifies Home when a saved local profile exists, CompleteProfile when no profile exists, malformed profile repair, invalid derived-only profile repair, successful startup render, and fallback to CompleteProfile when hydration throws. | Covered | Covered for startup route resolution and bootstrap fallback smoke. This does not approve storage, privacy, deletion, or broader launch-readiness behavior. |
| Root shell | `navigationSmokeNavigators.test.js` verifies RootNavigation returns null until the initial route is resolved, keeps Home as the authenticated shell entry, preserves the root route set, and maps Tutorials to the Tutorials wrapper. | Covered | Covered for root-shell route-set and entry ownership. This does not add or approve route names. |
| Authenticated tab shell | `navigationSmokeNavigators.test.js` verifies BottomTabNavigation keeps Dashboard, Journal, Calendar, Nutrition, Recreation, and Settings, keeps Calendar as the initial tab, labels Dashboard as Home, and routes nested domains to their navigators. | Covered | Covered for authenticated tab-shell structure. Individual domain flows remain separately classified below. |
| Onboarding / CompleteProfile | `AppBootstrap.test.js` verifies fallback to CompleteProfile. `navigationSmokeNavigators.test.js` includes CompleteProfile in the root route set. CompleteProfile boundary tests verify draft hydration, DOB/height confirmation boundaries, underage and weight validation, final submit locking, submit failure feedback, and optional nickname progression. | Partial | Boundary coverage exists, but the inspected smoke files do not provide a broad flow-level navigation smoke for the full CompleteProfile path. |
| Tutorials | `navigationSmokeNavigators.test.js` preserves Tutorials as a root route. `navigationSmokeFlows.test.js` verifies Tutorials exits to Home/Dashboard after the final image and backs out through navigation.goBack on the first image. `settingsTutorialsOwnership.test.js` confirms settings barrel ownership. | Covered | Covered for the representative root-owned Tutorials smoke path. This does not treat Tutorials ownership as a broader settings-flow approval. |
| Journal / calendar | `navigationSmokeNavigators.test.js` preserves CalendarNavigation and JournalNavigation route sets. `navigationSmokeFlows.test.js` verifies NewDay default header back behavior and DailyEntry save/back behavior. Adjacent calendar and journal boundary tests cover todo ownership, calendar submission payloads, selectors, theme storage/repeated themes, journal reducer/thunk contracts, traits storage, and journal form boundaries. | Partial | Representative smoke exists for selected NewDay and DailyEntry behavior, but broader calendar writing/editing, todo, weekly/quarterly, weight log, and trait-directory smoke paths are not comprehensively mapped as flow smoke. |
| Nutrition | `navigationSmokeNavigators.test.js` preserves the Nutrition route set. `navigationSmokeFlows.test.js` verifies Meal -> MealsList -> MealDirectory -> MealDetail handoff, MealsList default header behavior, and MealDetail add-to-target-meal behavior. Adjacent nutrition tests cover storage readers, form validation boundaries, and supplement reducer contracts. | Partial | Representative meal-directory smoke exists. Nutrition landing, supplement UI flow, meal create/edit/delete, and other nutrition paths are not broadly covered by flow-level smoke evidence. |
| Recreation | `navigationSmokeNavigators.test.js` preserves the Recreation route set. `navigationSmokeFlows.test.js` verifies RoutineManager -> EditRoutine through the edit action and EditRoutine default header behavior. Adjacent recreation tests cover storage, reducer/thunk contracts, routine/program/exercise form validation, and guard boundaries. | Partial | Representative routine edit smoke exists. ProgramManager/EditProgram/MyExercises and broader workout/program flows are not broadly covered by flow-level smoke evidence. |
| Settings / user control | `navigationSmokeNavigators.test.js` preserves the Settings route set. `navigationSmokeFlows.test.js` verifies MyProfile primary profile action routes to MyVitals. Adjacent settings tests cover MyVitals form boundaries, MyProfile summary fallback behavior, settings Tutorials ownership, and selected local account/settings entries. | Partial | Route and profile-action smoke exists. Privacy, export, deletion, reset, disclosure, and account-control semantics are deferred and are not approved by this map. |

## Gap Register

| Gap | Evidence | Recommended Child Lane | Priority | Notes |
|---|---|---|---|---|
| CompleteProfile lacks a clearly bounded representative flow smoke for the full onboarding route path. | Startup and root route evidence exists; CompleteProfile boundary tests cover validation and submit boundaries, but primary smoke files do not show a full representative onboarding smoke path. | `1.1.7.2.2` Onboarding / CompleteProfile smoke ownership | Medium | Child lane should stay route/flow-smoke focused and avoid changing onboarding behavior. |
| Calendar and journal have selected representative flow smoke but not broader flow-level coverage across the visible journal/calendar route families. | Navigator route sets, NewDay default back, and DailyEntry save/back are covered; adjacent boundary tests cover storage, selectors, todo, theme, trait, and form contracts. | `1.1.7.2.3` Journal / calendar representative smoke gaps | Medium | Candidate lane should choose bounded representative gaps, not all screens. |
| Nutrition flow smoke is concentrated on the meal-directory handoff path. | Nutrition route set and Meal -> MealsList -> MealDirectory -> MealDetail path are covered; nutrition storage, form UX, and supplement reducer contracts are boundary-covered. | `1.1.7.2.4` Nutrition representative smoke gaps | Medium | Candidate lane may consider supplement or landing handoff smoke, but should not introduce a new framework or broad E2E scope. |
| Recreation flow smoke is concentrated on RoutineManager -> EditRoutine. | Recreation route set, routine edit navigation, and EditRoutine default back are covered; storage, reducer, and form boundaries cover adjacent behavior. | `1.1.7.2.5` Recreation representative smoke gaps | Medium | Candidate lane may consider bounded ProgramManager/EditProgram/MyExercises route smoke only if evidence remains observable. |
| Settings user-control route smoke is narrow and sensitive semantics are out of scope. | Settings route set and MyProfile -> MyVitals are covered; adjacent tests mention account/settings entries, but privacy/export/delete/reset/disclosure behavior is not approved here. | `1.1.7.2.6` Settings user-control route smoke gaps | Low | Candidate lane should remain route-level and avoid privacy, export, deletion, reset, and disclosure semantics. |

## Deferred / Out of Scope

- Production source changes.
- Existing test edits or new smoke tests in this lane.
- Route behavior changes, new route names, or new navigation patterns.
- New dependencies, new test framework, Detox/Appium, or E2E infrastructure.
- Package, lockfile, CI, backend, cloud, AI, desktop, or monetization changes.
- Privacy, disclosure, export, deletion, reset, account-control semantics, or launch-readiness claims.
- Broad "all screens must have smoke tests" requirements.
- Treating legacy routes or currently tested behavior as approved product direction.
- Full test-suite audit beyond the listed primary smoke files and selected adjacent boundary evidence.

## Recommended Child Lane Order

1. `1.1.7.2.2` Onboarding / CompleteProfile smoke ownership.
2. `1.1.7.2.3` Journal / calendar representative smoke gaps.
3. `1.1.7.2.4` Nutrition representative smoke gaps.
4. `1.1.7.2.5` Recreation representative smoke gaps.
5. `1.1.7.2.6` Settings user-control route smoke gaps.

Child-lane numbering is provisional unless already reserved elsewhere in the WBS. Each child lane should keep a bounded file radius and implement only the representative smoke coverage approved for that child lane.

## Validation

- Run `git status --short`.
- Confirm the only changed path is `docs/architecture/flow-smoke-test-map.md`.
- No tests were run for this lane because only a docs artifact changed; no code or test files changed.
