# Lane: 1.1.2.2.2 Root stack boundary cleanup

## Summary

This lane defines a bounded cleanup of `RootNavigation` so it stops acting as a catch-all detail host for large single-domain route clusters.

Startup behavior and user-visible navigation behavior must be preserved exactly. The intent is to narrow root-stack ownership without changing bootstrap semantics, route names, provider order, tab-shell behavior, or screen behavior.

## Classification

Ready for codex

## Scope

### In Scope

- root-stack ownership cleanup in `RootNavigation`
- preserve bootstrap route resolution
- preserve `initialRouteName` flow from `AppBootstrap` through `RootContainer` into `RootNavigation`
- preserve `Home` as the authenticated shell entry
- preserve `CompleteProfile` as the no-profile entry
- reduce direct root ownership of obvious domain detail routes
- define a bounded rule for what remains in root versus what should move lower

### Out of Scope

- no startup-rule changes
- no onboarding rewrite
- no tab redesign
- no route renames
- no broad architecture redesign
- no screen-internal behavior changes
- no privacy/disclosure/settings policy changes
- no dependency/tooling changes
- no unrelated UX cleanup

## Files / Surfaces

Primary implementation evidence for this lane:

- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/CalendarNavigation.js`
- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`

Current-state baseline and companion references:

- `docs/architecture/navigation-tree-and-route-ownership.md`
- `docs/architecture/app-structure-inventory.md`
- `docs/architecture/risk-and-coupling-audit.md`

## Current State

Active code shows the current startup path as:

1. `AppBootstrap` calls `resolveInitialRouteName()`.
2. `AppBootstrap` resolves `Home` when local `user_profile` exists and `CompleteProfile` when it does not.
3. `RootContainer` receives `initialRouteName` and passes it into `RootNavigation`.
4. `RootNavigation` mounts the root stack with that same `initialRouteName`.

The live root stack currently owns both true app-entry routes and many obvious domain/detail routes directly. In current code, root ownership spans:

- bootstrap and shell entry: `CompleteProfile`, `Home`
- journal-related detail routes
- nutrition-related detail routes
- recreation-related detail routes
- settings/account/legal/help detail routes
- a standalone `Dashboard` route

`BottomTabNavigation` owns the top-level tab destinations and still initializes to `Calendar`. The authenticated shell route `Home` mounts that bottom-tab shell.

`CalendarNavigation` already exists as a nested-stack example under the tab shell. It shows the current local pattern for moving a domain flow below the root stack without changing startup behavior.

## Objective

Reduce `RootNavigation` to a clearer top-level boundary so it primarily owns app entry, the authenticated shell, and only the cross-domain routes that truly need to remain at root.

This cleanup should make later domain-stack extraction lanes safer, smaller, and easier to review by reducing direct root-stack ownership before broader navigation work happens.

## Boundary Rule for This Lane

After this cleanup, `RootNavigation` should own only:

- bootstrap entry routes
- the main authenticated shell route
- truly cross-domain routes that cannot yet be cleanly owned by one domain stack

For this lane, "cross-domain" means a route that cannot reasonably be assigned to one existing domain navigator without reopening behavior or architecture decisions.

`RootNavigation` should not continue hosting large clusters of single-domain detail routes when those routes logically belong to journal, nutrition, recreation, or settings/account.

## Proposed Implementation Shape

This lane is bounded cleanup guidance, not a full navigator redesign.

- keep `CompleteProfile` and `Home` in the root stack
- preserve `Home` mounting `BottomTabNavigation`
- move only the minimum necessary routing ownership downward
- prefer bounded nested stacks over continued root-detail sprawl
- use the existing nested `CalendarNavigation` pattern as the safest local example
- where route ownership is borderline or mixed, prefer leaving the route in root for this lane and record the ambiguity for a later extraction lane rather than widening scope here
- do not rename routes in this lane
- do not alter bootstrap semantics, provider order, or tab-shell behavior

## Public Interfaces

This artifact changes no public APIs, route names, types, providers, or runtime behavior.

The current contracts in `src/bootstrap/AppBootstrap.js`, `src/root-container/RootContainer.js`, and `src/navigation/RootNavigation.js` are preserved invariants for this lane:

- local `user_profile` decides `Home` versus `CompleteProfile`
- `initialRouteName` passes through unchanged from bootstrap to root navigation
- `Home` remains the authenticated shell entry

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain the governing inputs for this lane even when they are supplied outside the current repo snapshot
- bootstrap semantics must remain unchanged
- `docs/architecture/navigation-tree-and-route-ownership.md` should be treated as the baseline evidence map for current route ownership
- repo-local architecture docs may inform phrasing and companion context, but they do not replace the governing Brunch Body project template and scope for this lane
- active code is the source of truth if repo docs differ
- later domain extraction lanes may still be needed after this cleanup

## Acceptance Criteria

- `AppBootstrap` still resolves `Home` for saved `user_profile` and `CompleteProfile` otherwise
- `RootContainer` still passes `initialRouteName` into `RootNavigation`
- `RootNavigation` owns fewer direct single-domain detail-route registrations than before, while preserving bootstrap semantics, `Home` shell ownership, and working navigation for any moved screens
- `Home` still mounts the bottom-tab shell
- top-level tab destinations still render from `BottomTabNavigation`
- navigation into and back out of any moved screens still works
- no user-facing startup flow changes occur
- no route renames, copy changes, privacy changes, or dependency changes are introduced unless strictly required for safe wiring

## Validation

- static review of unchanged bootstrap path from `AppBootstrap` through `RootContainer` into `RootNavigation`
- static review that root owns fewer direct detail routes than before
- manual smoke coverage for fresh-install path to `CompleteProfile`
- manual smoke coverage for returning-user path to `Home`
- manual smoke coverage for tab-shell render
- manual smoke coverage for representative moved detail-screen navigation
- manual smoke coverage for representative back navigation

## Test Plan

- review this lane against live code to confirm every startup-path statement matches current implementation
- review this lane against `docs/architecture/navigation-tree-and-route-ownership.md` to confirm it narrows boundary ownership without re-inventorying or redesigning the whole tree
- confirm the resulting implementation diff for this lane stays bounded to navigation ownership cleanup and does not imply unrelated behavior work

## Risks / Notes

- main risk is accidental behavior drift during route ownership moves
- this should be a minimal-diff cleanup, not an all-at-once redesign
- the existing nested calendar stack is the safest local pattern to imitate
- conceptual ownership overlap currently exists and should be narrowed carefully rather than collapsed broadly

## Follow-on Lane Seeds

- bottom-tab shell cleanup
- journal stack extraction
- nutrition stack extraction
- recreation stack extraction
- settings/account stack extraction
- route naming/constants cleanup
- dead-route audit

## Assumptions

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` are authoritative for this lane even when they are provided outside the current repo snapshot
- active code is the source of truth when repo docs differ
- this lane should summarize current ownership by domain cluster, not invent a target architecture or full extraction sequence

## Constraints

- docs-only
- create exactly one new file: `docs/architecture/root-stack-boundary-cleanup.md`
- no production code changes
- no config changes
- no tests changed
- no dependency/package changes
- no route renames
- no behavior changes
- keep the lane present-state aware and cleanup-bounded
- use active code as the source of truth if repo docs differ

## Acceptance

- exactly one new docs file is added at `docs/architecture/root-stack-boundary-cleanup.md`
- the artifact is in Brunch Body Project Template style
- the artifact defines a bounded, Codex-ready root-stack cleanup lane
- the artifact preserves current bootstrap semantics in its contract
- the artifact clearly distinguishes in-scope boundary cleanup from out-of-scope architecture redesign
- the artifact provides binary, reviewable acceptance criteria
- the artifact does not implement cleanup or propose unrelated product changes

## Do not

- implement the refactor
- change `RootNavigation.js`
- change `AppBootstrap.js`
- change `RootContainer.js`
- rename routes
- redesign tabs
- widen into full domain-stack extraction
- mix this lane with naming cleanup, privacy work, or UX redesign

## Review standard

- keep scope narrow
- do not expand beyond stated files/surfaces
- do not introduce backend/cloud behavior unless explicitly requested
- do not change disclosures, privacy claims, or deletion semantics unless this lane explicitly includes them
- prefer minimal diffs
- add tests only for touched logic or required acceptance
- if the task is broader than stated, stop and leave a note rather than widening scope
