# Lane: 1.1.2.2.6 Nutrition stack extraction

## Summary

This lane defines a bounded cleanup of `NutritionNavigation` so nutrition detail routes are intentionally owned by the nutrition-domain nested stack under the authenticated tab shell.

Startup behavior, authenticated-shell entry, current nutrition route names, and screen-internal behavior must be preserved exactly. The intent is to clarify nutrition nested-stack ownership without changing bootstrap semantics, tab purpose, route names, or nutrition screen behavior.

## Classification

Ready for codex

## Scope

### In Scope

- nutrition stack extraction and boundary cleanup in `NutritionNavigation`
- preserve the relationship where `BottomTabNavigation` mounts `NutritionNavigation` behind the `Nutrition` tab
- preserve the current nutrition stack route set unless a narrowly scoped extraction cleanup requires a smaller ownership adjustment:
  - `Nutrition`
  - `Supplement`
  - `Meal`
  - `MealsList`
  - `MealDirectory`
  - `MealDetail`
- clarify what belongs inside the nutrition nested stack versus what belongs in the tab shell or root stack
- keep the change set minimal, bounded, and reviewable
- make later nutrition-domain cleanup lanes smaller and safer

### Out of Scope

- no startup-rule changes
- no onboarding rewrite
- no tab redesign
- no route renames
- no screen-internal behavior changes
- no broad nutrition feature redesign
- no journal, recreation, or settings extraction
- no root-stack redesign
- no privacy, disclosure, or settings-policy changes
- no dependency or tooling changes
- no unrelated UX cleanup

## Files / Surfaces

Primary implementation evidence for this lane:

- `src/navigation/NutritionNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/RootNavigation.js`
- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`
- `src/screens/nutrition/index.js`
- `README.md`

Supporting live-flow evidence for current nutrition nested routing:

- `src/screens/nutrition/pages/Nutrition/Nutrition.js`
- `src/screens/nutrition/components/Nutrition.js`
- `src/screens/nutrition/pages/Meal/Meal.js`
- `src/screens/nutrition/components/MealsList.js`
- `src/screens/nutrition/components/MealDirectory.js`
- `src/screens/nutrition/pages/MealDetail/MealDetail.js`

Current-state baseline and companion references only:

- `docs/architecture/navigation-tree-and-route-ownership.md`
- `docs/architecture/root-stack-boundary-cleanup.md`
- `docs/architecture/bottom-tab-shell-cleanup.md`
- `docs/architecture/calendar-stack-boundary-cleanup.md`
- `docs/architecture/journal-stack-extraction.md`

These repo docs may inform context and section rhythm, but active code is authoritative if older prose still reflects pre-extraction root ownership. In particular, `docs/architecture/navigation-tree-and-route-ownership.md` still reflects older root-level nutrition ownership and should be treated as baseline context only for this lane.

## Current State

Active code shows the current startup path as:

1. `AppBootstrap` resolves `Home` when local `user_profile` exists and `CompleteProfile` when it does not.
2. `RootContainer` receives `initialRouteName` and passes it into `RootNavigation`.
3. `RootNavigation` mounts `BottomTabNavigation` under `Home`.
4. `BottomTabNavigation` mounts `NutritionNavigation` behind the `Nutrition` tab.

`BottomTabNavigation` still initializes the authenticated tab shell to `Calendar`. That is current-state evidence only and is not a redesign target in this lane.

Active code also shows that `NutritionNavigation` currently owns a nested stack with `initialRouteName="Nutrition"` and the following six registered routes:

- `Nutrition`
- `Supplement`
- `Meal`
- `MealsList`
- `MealDirectory`
- `MealDetail`

The current nutrition export surface in `src/screens/nutrition/index.js` matches those six wrappers.

Live nutrition flow evidence also supports keeping those routes together for this lane:

- the nutrition landing flow opens `Supplement` from `Nutrition`
- the nutrition landing flow opens `Meal` from `Nutrition`
- `Meal` opens `MealsList`
- `MealsList` opens `MealDirectory`
- `MealDirectory` opens `MealDetail`

This is current-state evidence only, not an automatic prompt to rename routes, redesign the nutrition flow, or reopen broader cross-domain extraction decisions.

`README.md` is a consistency check only for the local-first/offline posture and current startup truthfulness. It does not override live code.

`docs/architecture/navigation-tree-and-route-ownership.md` still documents older root-level nutrition ownership. For this lane, active code in `NutritionNavigation`, `BottomTabNavigation`, and the nutrition screens is authoritative if that baseline map differs.

## Objective

Make `NutritionNavigation` a clearer, thinner nutrition-domain boundary under the `Nutrition` tab.

Ensure nutrition routes are intentionally owned by the nutrition stack rather than remaining ambiguous across broader navigation layers. This cleanup should make later nutrition cleanup, naming cleanup, and smoke-test lanes safer and smaller without redesigning nutrition behavior.

## Boundary Rule for This Lane

After this cleanup, the nutrition nested stack should own only:

- the nutrition-domain entry route mounted by the `Nutrition` tab
- the minimum nested routes that clearly belong to the same nutrition-domain flow
- the minimal stack configuration needed to support that flow

The nutrition nested stack should not:

- become a catch-all host for unrelated detail routes
- duplicate root-stack responsibilities
- duplicate tab-shell responsibilities
- reopen broader domain-boundary decisions for journal, recreation, settings, dashboard, or nutrition feature redesign
- alter the startup contract that routes returning users into `Home` and no-profile users into `CompleteProfile`

Operational deferral rule:

- if clarifying the nutrition-stack boundary would require deciding that a route belongs to a different domain navigator rather than the nutrition flow, stop and defer that decision to a later lane instead of widening this one

## Proposed Implementation Shape

This lane is bounded cleanup guidance, not a navigator redesign.

- preserve `Home` in `RootNavigation` as the authenticated shell entry
- preserve `Nutrition` in `BottomTabNavigation` as the tab that mounts `NutritionNavigation`
- preserve the current nutrition-stack routing behavior unless a smaller extraction cleanup requires a narrowly scoped ownership adjustment
- narrow `NutritionNavigation` to nutrition-stack concerns only: nutrition-domain entry, nested flow ownership, and stack-level defaults
- preserve the current six nutrition route names and current nutrition nested-flow behavior unless a minimal wiring fix is strictly required
- avoid moving unrelated detail routes into `NutritionNavigation`
- avoid renaming routes in this lane unless strictly required to keep the nested stack functioning
- if a cleanup idea requires broader nutrition redesign, a cross-domain ownership decision, or naming cleanup rather than nutrition-stack extraction, defer that work to a later lane instead of widening scope here

## Public Interfaces

This artifact changes no public APIs, route names, types, providers, dependencies, or runtime behavior.

The current contracts in `src/bootstrap/AppBootstrap.js`, `src/root-container/RootContainer.js`, `src/navigation/RootNavigation.js`, `src/navigation/BottomTabNavigation.js`, and `src/navigation/NutritionNavigation.js` are preserved invariants for this lane:

- local `user_profile` decides `Home` versus `CompleteProfile`
- `initialRouteName` passes through unchanged from bootstrap to root navigation
- `Home` remains the authenticated shell entry
- `Nutrition` remains the tab route that enters the nutrition stack
- `NutritionNavigation` remains the owner of the current six nutrition nested-stack routes unless a minimal wiring fix is strictly required

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane even when supplied outside the current repo snapshot or current chat file state
- nearby approved lane docs may inform style and section rhythm, but they do not replace the governing Brunch Body project template and scope for this lane
- bootstrap semantics must remain unchanged
- `RootNavigation` must continue to mount the authenticated shell through `Home`
- `BottomTabNavigation` must continue to mount `NutritionNavigation` through the `Nutrition` tab
- `src/screens/nutrition/index.js` should be treated as the current nutrition export surface for the mounted wrappers
- `docs/architecture/navigation-tree-and-route-ownership.md` should be treated as a baseline evidence map only, with active code taking precedence because that artifact still reflects older root-level nutrition ownership
- `docs/architecture/root-stack-boundary-cleanup.md`, `docs/architecture/bottom-tab-shell-cleanup.md`, `docs/architecture/calendar-stack-boundary-cleanup.md`, and `docs/architecture/journal-stack-extraction.md` should remain separate companion boundaries so this lane does not absorb their responsibilities
- active code is the source of truth if repo docs differ

## Acceptance Criteria

- `AppBootstrap` still resolves `Home` for saved `user_profile` data and `CompleteProfile` otherwise
- `RootNavigation` still mounts `BottomTabNavigation` under `Home`
- `BottomTabNavigation` still mounts `NutritionNavigation` under the `Nutrition` tab
- `NutritionNavigation` still uses `initialRouteName="Nutrition"`
- `NutritionNavigation` remains limited to the existing nutrition-stack route registrations needed for the current nested flow, stack-level options, and existing nested-flow entry points, with no new non-nutrition detail-route registrations introduced in this lane
- the current nutrition stack route set remains:
  - `Nutrition`
  - `Supplement`
  - `Meal`
  - `MealsList`
  - `MealDirectory`
  - `MealDetail`
- the current nutrition nested flow still works for representative navigation into:
  - `Nutrition`
  - `Supplement`
  - `Meal`
  - `MealsList`
  - `MealDirectory`
  - `MealDetail`
- navigation into and back out of representative nutrition-stack routes still works
- no startup behavior changes occur
- no route renames, copy changes, privacy changes, or dependency changes are introduced unless strictly required for safe stack wiring

## Validation

- static review that the startup-path statements in this artifact match live code in `AppBootstrap`, `RootContainer`, and `RootNavigation`
- static review that `RootNavigation` still mounts `BottomTabNavigation` under `Home`
- static review that `BottomTabNavigation` still mounts `NutritionNavigation` under `Nutrition`
- static review that `NutritionNavigation` remains the owner of the current nutrition stack routes
- static review that the route list in this artifact matches the nutrition exports and current nutrition-stack registrations
- static review that this artifact reflects live nutrition ownership rather than the older root-level nutrition map in `docs/architecture/navigation-tree-and-route-ownership.md`
- static review that the final diff adds only `docs/architecture/nutrition-stack-extraction.md`
- manual smoke coverage for returning-user path to `Home`
- manual smoke coverage for tab-shell render
- manual smoke coverage for entering `Nutrition`
- manual smoke coverage for representative navigation from `Nutrition` into `Supplement` and `Meal`
- manual smoke coverage for representative navigation from `Meal` into `MealsList`, `MealDirectory`, and `MealDetail`
- manual smoke coverage for representative back navigation from nested nutrition-stack screens

## Risks / Notes

- main risk is accidental boundary drift, where nutrition extraction starts reopening root-stack, tab-shell, or cross-domain decisions that belong to other lanes
- another risk is conflating route naming cleanup with extraction work
- current code-backed names such as `MealsList`, `MealDirectory`, and `MealDetail` should be recorded and tolerated here unless a minimal wiring fix is strictly required
- this should remain a minimal-diff nutrition-stack extraction, not a broader nutrition redesign
- preserve local-first truthfulness and the current `Home` startup contract

## Follow-on Lane Seeds

- nutrition route naming/constants cleanup
- dead-route audit
- nutrition flow smoke tests
- nutrition/journal relationship cleanup
- nutrition-domain UX clarification lane

## Assumptions

- the requested artifact should follow the same reviewable cadence as the approved `1.1.2.2.1` through `1.1.2.2.5` lane docs while still treating `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` as the governing inputs
- active code is authoritative over repo prose for startup facts, navigator ownership, nested-flow evidence, and route names
- this lane is about extraction and boundary clarity, not feature redesign
- if a cleaner nutrition boundary would require deciding that a route belongs to another domain navigator, that decision should be deferred rather than absorbed here

## Constraints

- docs-only
- create exactly one new file: `docs/architecture/nutrition-stack-extraction.md`
- no production code changes
- no config changes
- no tests changed
- no dependency or package changes
- no route renames
- no behavior changes
- keep the lane present-state aware and cleanup-bounded
- use active code as the source of truth if repo docs differ

## Acceptance

- exactly one new docs file is added at `docs/architecture/nutrition-stack-extraction.md`
- the artifact is in Brunch Body Project Template style
- the artifact defines a bounded, Codex-ready nutrition-stack extraction lane
- the artifact preserves current bootstrap and shell semantics in its contract
- the artifact clearly distinguishes in-scope nutrition-stack extraction from out-of-scope root-stack work, tab-shell work, naming cleanup, and broader nutrition redesign
- the artifact provides binary, reviewable acceptance criteria
- the artifact does not implement cleanup or propose unrelated product changes

## Do not

- implement the refactor
- change `NutritionNavigation.js`
- change `BottomTabNavigation.js`
- change `RootNavigation.js`
- change `AppBootstrap.js`
- change `RootContainer.js`
- rename routes
- redesign tabs
- widen into nutrition feature redesign or cross-domain extraction
- mix this lane with root cleanup, tab-shell cleanup, naming cleanup, privacy work, or UX redesign

## Review standard

- keep scope narrow
- do not expand beyond stated files or surfaces
- do not introduce backend or cloud behavior unless explicitly requested
- do not change disclosures, privacy claims, or deletion semantics unless this lane explicitly includes them
- prefer minimal diffs
- add tests only for touched logic or required acceptance
- if the task is broader than stated, stop and leave a note rather than widening scope
