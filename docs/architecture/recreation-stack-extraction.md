# Lane: 1.1.2.2.7 Recreation stack extraction

## Summary

This lane defines a bounded cleanup of `RecreationNavigation` so recreation detail routes are intentionally owned by the recreation-domain nested stack under the authenticated tab shell.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane. Live code is authoritative for current-state facts. Nearby approved lane docs may inform cadence and style only.

Startup behavior, authenticated-shell entry, current recreation route names, and screen-internal behavior must be preserved exactly. The intent is to clarify recreation nested-stack ownership without changing bootstrap semantics, tab purpose, route names, or recreation screen behavior.

## Classification

Ready for codex

## Scope

### In Scope

- recreation stack extraction and boundary cleanup in `RecreationNavigation`
- preserve the relationship where `BottomTabNavigation` mounts `RecreationNavigation` behind the `Recreation` tab
- preserve the current recreation stack route set unless a narrowly scoped extraction cleanup requires a smaller ownership adjustment:
  - `Recreation`
  - `RoutineManager`
  - `ProgramManager`
  - `EditProgram`
  - `EditRoutine`
  - `MyExercises`
- clarify what belongs inside the recreation nested stack versus what belongs in the tab shell or root stack
- keep the change set minimal, bounded, and reviewable
- make later recreation-domain cleanup lanes smaller and safer

### Out of Scope

- no startup-rule changes
- no onboarding rewrite
- no tab redesign
- no route renames
- no screen-internal behavior changes
- no broad recreation feature redesign
- no journal, nutrition, settings, or dashboard extraction
- no root-stack redesign
- no privacy, disclosure, or settings-policy changes
- no dependency or tooling changes
- no unrelated UX cleanup

## Files / Surfaces

Primary implementation evidence for this lane:

- `src/navigation/RecreationNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/RootNavigation.js`
- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`
- `src/screens/recreation/index.js`
- `README.md`

Supporting live-flow evidence for current recreation nested routing:

- `src/screens/recreation/pages/Recreation/Recreation.js`
- `src/screens/recreation/components/RoutineManager.js`
- `src/screens/recreation/pages/ProgramManager/ProgramManager.js`

Current-state baseline and companion references only:

- `docs/architecture/navigation-tree-and-route-ownership.md`
- `docs/architecture/root-stack-boundary-cleanup.md`
- `docs/architecture/bottom-tab-shell-cleanup.md`
- `docs/architecture/calendar-stack-boundary-cleanup.md`
- `docs/architecture/journal-stack-extraction.md`
- `docs/architecture/nutrition-stack-extraction.md`

These repo docs may inform context and section rhythm, but active code is authoritative if older prose still reflects pre-extraction root ownership. In particular, `docs/architecture/navigation-tree-and-route-ownership.md` still reflects older root-level recreation ownership and should be treated as baseline context only for this lane.

## Current State

Active code shows the current startup path as:

1. `AppBootstrap` resolves `Home` when local `user_profile` exists and `CompleteProfile` when it does not.
2. `RootContainer` receives `initialRouteName` and passes it into `RootNavigation`.
3. `RootNavigation` mounts `BottomTabNavigation` under `Home`.
4. `BottomTabNavigation` mounts `RecreationNavigation` behind the `Recreation` tab.

`BottomTabNavigation` still initializes the authenticated tab shell to `Calendar`. That is current-state evidence only and is not a redesign target in this lane.

Active code also shows that `RecreationNavigation` currently owns a nested stack with `initialRouteName="Recreation"` and the following six registered routes:

- `Recreation`
- `RoutineManager`
- `ProgramManager`
- `EditProgram`
- `EditRoutine`
- `MyExercises`

The current recreation export surface in `src/screens/recreation/index.js` matches those six wrappers.

Live recreation flow evidence also supports keeping those routes together for this lane:

- the recreation landing flow navigates into `RoutineManager`, `ProgramManager`, and `MyExercises`
- `RoutineManager` navigates into `EditRoutine`
- `ProgramManager` navigates into `EditProgram`

This is current-state evidence only. It supports retaining these routes in the recreation stack for this lane, but does not by itself settle their permanent long-term domain architecture. It is not an automatic prompt to rename routes, redesign the recreation flow, or reopen broader cross-domain extraction decisions.

`README.md` is a consistency check only for the local-first and device-local posture plus the current startup truthfulness. It does not override live code.

`docs/architecture/navigation-tree-and-route-ownership.md` still documents older root-level recreation ownership. For this lane, active code in `RecreationNavigation`, `BottomTabNavigation`, and the recreation screens is authoritative if that baseline map differs.

## Objective

Make `RecreationNavigation` a clearer, thinner recreation-domain boundary under the `Recreation` tab.

Ensure recreation routes are intentionally owned by the recreation stack rather than remaining ambiguous across broader navigation layers. This cleanup should make later recreation cleanup, naming cleanup, and smoke-test lanes safer and smaller without redesigning recreation behavior.

## Boundary Rule for This Lane

After this cleanup, the recreation nested stack should own only:

- the recreation-domain entry route mounted by the `Recreation` tab
- the minimum nested routes that clearly belong to the same recreation-domain flow
- the minimal stack configuration needed to support that flow

The recreation nested stack should not:

- become a catch-all host for unrelated detail routes
- duplicate root-stack responsibilities
- duplicate tab-shell responsibilities
- reopen broader domain-boundary decisions for journal, nutrition, settings, dashboard, or recreation feature redesign
- alter the startup contract that routes returning users into `Home` and no-profile users into `CompleteProfile`

Operational deferral rule:

- if clarifying the recreation-stack boundary would require deciding that a route belongs to a different domain navigator rather than the recreation flow, stop and defer that decision to a later lane instead of widening this one

## Proposed Implementation Shape

This lane is bounded cleanup guidance, not a navigator redesign.

- preserve `Home` in `RootNavigation` as the authenticated shell entry
- preserve `Recreation` in `BottomTabNavigation` as the tab that mounts `RecreationNavigation`
- preserve the current recreation-stack routing behavior unless a smaller extraction cleanup requires a narrowly scoped ownership adjustment
- narrow `RecreationNavigation` to recreation-stack concerns only: recreation-domain entry, nested flow ownership, and stack-level defaults
- preserve the current six recreation route names and current recreation nested-flow behavior unless a minimal wiring fix is strictly required
- avoid moving unrelated detail routes into `RecreationNavigation`
- avoid renaming routes in this lane unless strictly required to keep the nested stack functioning
- if a cleanup idea requires broader recreation redesign, a cross-domain ownership decision, or naming cleanup rather than recreation-stack extraction, defer that work to a later lane instead of widening scope here

## Public Interfaces

This artifact changes no public APIs, route names, types, providers, dependencies, or runtime behavior.

The current contracts in `src/bootstrap/AppBootstrap.js`, `src/root-container/RootContainer.js`, `src/navigation/RootNavigation.js`, `src/navigation/BottomTabNavigation.js`, and `src/navigation/RecreationNavigation.js` are preserved invariants for this lane:

- local `user_profile` decides `Home` versus `CompleteProfile`
- `initialRouteName` passes through unchanged from bootstrap to root navigation
- `Home` remains the authenticated shell entry
- `Recreation` remains the tab route that enters the recreation stack
- `RecreationNavigation` remains the owner of the current six recreation nested-stack routes unless a minimal wiring fix is strictly required

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane even when supplied outside the current repo snapshot or current chat file state
- nearby approved lane docs may inform style and section rhythm, but they do not replace the governing Brunch Body project template and scope for this lane
- bootstrap semantics must remain unchanged
- `RootNavigation` must continue to mount the authenticated shell through `Home`
- `BottomTabNavigation` must continue to mount `RecreationNavigation` through the `Recreation` tab
- `src/screens/recreation/index.js` should be treated as the current recreation export surface for the mounted wrappers
- `docs/architecture/navigation-tree-and-route-ownership.md` should be treated as a baseline evidence map only, with active code taking precedence because that artifact still reflects older root-level recreation ownership
- `docs/architecture/root-stack-boundary-cleanup.md`, `docs/architecture/bottom-tab-shell-cleanup.md`, `docs/architecture/calendar-stack-boundary-cleanup.md`, `docs/architecture/journal-stack-extraction.md`, and `docs/architecture/nutrition-stack-extraction.md` should remain separate companion boundaries so this lane does not absorb their responsibilities
- active code is the source of truth if repo docs differ

## Acceptance Criteria

- `AppBootstrap` still resolves `Home` for saved `user_profile` data and `CompleteProfile` otherwise
- `RootNavigation` still mounts `BottomTabNavigation` under `Home`
- `BottomTabNavigation` still mounts `RecreationNavigation` under the `Recreation` tab
- `RecreationNavigation` still uses `initialRouteName="Recreation"`
- `RecreationNavigation` remains limited to the existing six recreation-stack route registrations needed for the current nested flow, stack-level options, and existing nested-flow entry points, with no new non-recreation detail-route registrations introduced in this lane
- the current recreation stack route set remains:
  - `Recreation`
  - `RoutineManager`
  - `ProgramManager`
  - `EditProgram`
  - `EditRoutine`
  - `MyExercises`
- the current recreation nested flow still works for representative navigation into:
  - `Recreation`
  - `RoutineManager`
  - `ProgramManager`
  - `EditProgram`
  - `EditRoutine`
  - `MyExercises`
- navigation into and back out of representative recreation-stack routes still works
- no startup behavior changes occur
- no route renames, copy changes, privacy changes, or dependency changes are introduced unless strictly required for safe stack wiring

## Validation

- static review that the startup-path statements in this artifact match live code in `AppBootstrap`, `RootContainer`, and `RootNavigation`
- static review that `RootNavigation` still mounts `BottomTabNavigation` under `Home`
- static review that `BottomTabNavigation` still mounts `RecreationNavigation` under `Recreation`
- static review that `RecreationNavigation` remains the owner of the current recreation stack routes
- static review that the route list in this artifact matches the recreation exports and current recreation-stack registrations
- static review that this artifact reflects live recreation ownership rather than the older root-level recreation map in `docs/architecture/navigation-tree-and-route-ownership.md`
- static review that the final diff adds only `docs/architecture/recreation-stack-extraction.md`
- manual smoke coverage for returning-user path to `Home`
- manual smoke coverage for tab-shell render
- manual smoke coverage for entering `Recreation`
- manual smoke coverage for representative navigation from `Recreation` into `RoutineManager`, `ProgramManager`, and `MyExercises`
- manual smoke coverage for representative navigation from `RoutineManager` into `EditRoutine`
- manual smoke coverage for representative navigation from `ProgramManager` into `EditProgram`
- manual smoke coverage for representative back navigation from nested recreation-stack screens

## Risks / Notes

- main risk is accidental boundary drift, where recreation extraction starts reopening root-stack, tab-shell, or cross-domain decisions that belong to other lanes
- another risk is conflating route naming cleanup with extraction work
- current code-backed names such as `RoutineManager`, `ProgramManager`, `EditProgram`, `EditRoutine`, and `MyExercises` should be recorded and tolerated here unless a minimal wiring fix is strictly required
- this should remain a minimal-diff recreation-stack extraction, not a broader recreation redesign
- preserve local-first truthfulness and the current `Home` startup contract

## Follow-on Lane Seeds

- recreation route naming/constants cleanup
- dead-route audit
- recreation flow smoke tests
- recreation/nutrition relationship cleanup
- recreation-domain UX clarification lane

## Assumptions

- the requested artifact should follow the same reviewable cadence as the approved `1.1.2.2.1` through `1.1.2.2.6` lane docs while still treating `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` as the governing inputs
- the current chat restatement is sufficient as a working reference because it aligns with current repo state, but it does not replace the authoritative Brunch Body template and scope
- active code is authoritative over repo prose for startup facts, navigator ownership, nested-flow evidence, route registrations, and route names
- this lane is about extraction and boundary clarity, not feature redesign
- if a cleaner recreation boundary would require deciding that a route belongs to another domain navigator, that decision should be deferred rather than absorbed here

## Constraints

- docs-only
- create exactly one new file: `docs/architecture/recreation-stack-extraction.md`
- no production code changes
- no config changes
- no tests changed
- no dependency or package changes
- no route renames
- no behavior changes
- keep the lane present-state aware and cleanup-bounded
- use active code as the source of truth if repo docs differ

## Acceptance

- exactly one new docs file is added at `docs/architecture/recreation-stack-extraction.md`
- the artifact is in Brunch Body Project Template style
- the artifact defines a bounded, Codex-ready recreation-stack extraction lane
- the artifact preserves current bootstrap and shell semantics in its contract
- the artifact clearly distinguishes in-scope recreation-stack extraction from out-of-scope root-stack work, tab-shell work, naming cleanup, and broader recreation redesign
- the artifact provides binary, reviewable acceptance criteria
- the artifact does not implement cleanup or propose unrelated product changes

## Do not

- implement the refactor
- change `RecreationNavigation.js`
- change `BottomTabNavigation.js`
- change `RootNavigation.js`
- change `AppBootstrap.js`
- change `RootContainer.js`
- rename routes
- redesign tabs
- widen into recreation feature redesign or cross-domain extraction
- mix this lane with root cleanup, tab-shell cleanup, naming cleanup, privacy work, or UX redesign

## Review standard

- keep scope narrow
- do not expand beyond stated files/surfaces
- do not introduce backend/cloud behavior unless explicitly requested
- do not change disclosures, privacy claims, or deletion semantics unless this lane explicitly includes them
- prefer minimal diffs
- add tests only for touched logic or required acceptance
- if the task is broader than stated, stop and leave a note rather than widening scope
