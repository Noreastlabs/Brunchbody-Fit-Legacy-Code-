# Lane: 1.1.2.2.3 Bottom-tab shell cleanup

## Summary

This lane defines a bounded cleanup of `BottomTabNavigation` so it serves only as the stable top-level destination layer for the authenticated app.

Startup behavior, top-level tab purpose, and screen-internal behavior must be preserved exactly. The intent is to narrow bottom-tab shell ownership without changing bootstrap semantics, root-shell entry, route names, tab purpose, or nested calendar behavior.

## Classification

Ready for codex

## Scope

### In Scope

- bottom-tab shell cleanup in `BottomTabNavigation`
- preserve the current six top-level destinations:
  - `Dashboard`
  - `Journal`
  - `Calendar`
  - `Nutrition`
  - `Recreation`
  - `Settings`
- preserve the relationship where `Home` in `RootNavigation` mounts `BottomTabNavigation`
- preserve `CalendarNavigation` as the current nested stack behind the `Calendar` tab
- clarify and narrow what the tab shell owns versus what root or nested stacks own
- keep the change set minimal, bounded, and reviewable
- keep cleanup limited to shell concerns only

### Out of Scope

- no startup-rule changes
- no onboarding rewrite
- no route renames
- no icon redesign
- no screen-internal behavior changes
- no broad domain-stack extraction
- no privacy, disclosure, or settings-policy changes
- no dependency or tooling changes
- no unrelated UX cleanup

## Files / Surfaces

Primary implementation evidence for this lane:

- `src/navigation/BottomTabNavigation.js`
- `src/navigation/RootNavigation.js`
- `src/navigation/CalendarNavigation.js`
- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`

Current-state baseline and companion references:

- `docs/architecture/navigation-tree-and-route-ownership.md`
- `docs/architecture/root-stack-boundary-cleanup.md`

## Current State

Active code shows the current startup path as:

1. `AppBootstrap` calls `resolveInitialRouteName()`.
2. `AppBootstrap` resolves `Home` when local `user_profile` exists and `CompleteProfile` when it does not.
3. `RootContainer` receives `initialRouteName` and passes it into `RootNavigation`.
4. `RootNavigation` mounts `BottomTabNavigation` under `Home`.

The live bottom-tab shell currently owns six top-level authenticated destinations:

- `Dashboard`
- `Journal`
- `Calendar`
- `Nutrition`
- `Recreation`
- `Settings`

`BottomTabNavigation` currently initializes to `Calendar`. That default-tab behavior is current-state evidence only and is not a change target in this lane unless a later lane explicitly reopens it.

`Calendar` currently mounts `CalendarNavigation` as a nested stack entry point. The other tab destinations currently mount wrapper components directly.

Current shell-boundary drift exists as evidence only. For example, `RootNavigation` still directly registers routes that conceptually overlap with top-level tab-owned destinations, including `Dashboard` and `Nutrition`, even while `BottomTabNavigation` also owns those top-level entries.

## Objective

Make `BottomTabNavigation` a clearer, thinner authenticated shell.

Ensure it owns top-level destination registration and shell-level configuration only. This cleanup should make later navigation cleanup lanes safer, smaller, and easier to review.

## Boundary Rule for This Lane

After this cleanup, the bottom-tab shell should own only:

- top-level authenticated destination registration
- minimal tab configuration needed to enter those destinations
- existing nested-stack entry points such as `CalendarNavigation` where that ownership already exists

The bottom-tab shell should not:

- become a catch-all host for detail routes
- duplicate root-stack responsibilities
- reopen domain-stack extraction decisions beyond what is required for shell clarity
- alter the startup contract that routes returning users into `Home`

If a cleanup idea requires moving or redefining detail-route ownership rather than clarifying the tab shell, leave it for the relevant extraction lane instead of widening this lane.

## Proposed Implementation Shape

This lane is bounded cleanup guidance, not a navigator redesign.

- preserve `Home` in `RootNavigation` as the route that mounts `BottomTabNavigation`
- preserve the current six top-level tabs
- preserve `CalendarNavigation` as the current nested stack under `Calendar` unless a smaller shell-only cleanup requires otherwise
- narrow `BottomTabNavigation` to top-level destination registration, tab options, and shell defaults only
- avoid moving detail routes into the tab shell
- avoid renaming tabs or routes in this lane unless strictly required to keep the shell functioning
- keep shell cleanup separate from later naming, domain-stack, and dead-route lanes

## Public Interfaces

This artifact changes no public APIs, route names, types, providers, dependencies, or runtime behavior.

The current contracts in `src/bootstrap/AppBootstrap.js`, `src/root-container/RootContainer.js`, `src/navigation/RootNavigation.js`, and `src/navigation/BottomTabNavigation.js` are preserved invariants for this lane:

- local `user_profile` decides `Home` versus `CompleteProfile`
- `initialRouteName` passes through unchanged from bootstrap to root navigation
- `Home` remains the authenticated shell entry
- the six current top-level tab destinations remain unchanged

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain the governing inputs for this lane even when they are supplied outside the current repo snapshot
- bootstrap semantics must remain unchanged
- `RootNavigation` must continue to mount the authenticated shell through `Home`
- `docs/architecture/navigation-tree-and-route-ownership.md` should be treated as the baseline evidence map for current route ownership
- `docs/architecture/root-stack-boundary-cleanup.md` should remain a companion boundary reference so this lane does not absorb root-stack responsibility decisions
- nearby approved lane docs may inform style, section rhythm, and level of detail, but they do not replace the governing Brunch Body project template and scope for this lane
- active code is the source of truth if repo docs differ

## Acceptance Criteria

- `AppBootstrap` still resolves `Home` for saved `user_profile` data and `CompleteProfile` otherwise
- `RootNavigation` still mounts `BottomTabNavigation` under `Home`
- `BottomTabNavigation` still exposes exactly six top-level authenticated destinations:
  - `Dashboard`
  - `Journal`
  - `Calendar`
  - `Nutrition`
  - `Recreation`
  - `Settings`
- `Calendar` still enters the nested calendar stack through `CalendarNavigation` rather than becoming a flattened detail route
- `BottomTabNavigation` remains limited to the six top-level destination registrations, tab-level options, and existing nested-shell entry points, with no new detail-route registrations introduced in this lane
- no startup behavior changes occur
- no tab or route renames, copy changes, privacy changes, or dependency changes are introduced unless strictly required for safe shell wiring
- navigation into each top-level destination still works
- representative back-navigation still works for nested calendar screens

## Validation

- static review of the unchanged bootstrap path from `AppBootstrap` through `RootContainer` into `RootNavigation`
- static review that `BottomTabNavigation` still owns only the six top-level destinations
- static review that `Calendar` still points to `CalendarNavigation`
- manual smoke coverage for returning-user path to `Home`
- manual smoke coverage for tab-shell render
- manual smoke coverage for each of the six tabs opening
- manual smoke coverage for calendar nested navigation
- manual smoke coverage for representative back navigation from nested calendar screens

## Risks / Notes

- main risk is accidental shell drift, where tab cleanup starts moving or redefining detail ownership that belongs to root or later domain lanes
- another risk is conflating route naming cleanup with shell cleanup
- this should remain a minimal-diff shell cleanup, not an authenticated-navigation redesign
- preserve local-first truthfulness and the current `Home` startup contract

## Follow-on Lane Seeds

- calendar stack boundary cleanup
- journal stack extraction
- nutrition stack extraction
- recreation stack extraction
- settings/account stack extraction
- route naming/constants cleanup
- dead-route audit

## Assumptions

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` are authoritative for this lane even when supplied outside the current repo snapshot
- active code is the source of truth when repo docs differ
- this lane should clarify authenticated shell ownership without reopening root-stack cleanup, domain-stack extraction, naming cleanup, or default-tab behavior

## Constraints

- docs-only
- create exactly one new file: `docs/architecture/bottom-tab-shell-cleanup.md`
- no production code changes
- no config changes
- no tests changed
- no dependency or package changes
- no route renames
- no behavior changes
- keep the lane present-state aware and cleanup-bounded
- use active code as the source of truth if repo docs differ

## Acceptance

- exactly one new docs file is added at `docs/architecture/bottom-tab-shell-cleanup.md`
- the artifact is in Brunch Body Project Template style
- the artifact defines a bounded, Codex-ready bottom-tab shell cleanup lane
- the artifact preserves current bootstrap semantics in its contract
- the artifact clearly distinguishes in-scope shell cleanup from out-of-scope root-stack work, naming cleanup, and domain extraction
- the artifact provides binary, reviewable acceptance criteria
- the artifact does not implement cleanup or propose unrelated product changes

## Do not

- implement the refactor
- change `BottomTabNavigation.js`
- change `RootNavigation.js`
- change `AppBootstrap.js`
- change `RootContainer.js`
- rename routes or tabs
- redesign the tab bar
- widen into full domain-stack extraction
- mix this lane with root cleanup, naming cleanup, privacy work, or UX redesign

## Review standard

- keep scope narrow
- do not expand beyond stated files or surfaces
- do not introduce backend or cloud behavior unless explicitly requested
- do not change disclosures, privacy claims, or deletion semantics unless this lane explicitly includes them
- prefer minimal diffs
- add tests only for touched logic or required acceptance
- if the task is broader than stated, stop and leave a note rather than widening scope
