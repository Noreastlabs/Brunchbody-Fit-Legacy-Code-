# Lane: 1.1.2.2.4 Calendar stack boundary cleanup

## Summary

This lane defines a bounded cleanup of `CalendarNavigation` so it serves only as the calendar-domain boundary under the authenticated tab shell.

Startup behavior, `Home` shell behavior, and current calendar/writing navigation behavior must be preserved exactly. The intent is to narrow calendar nested-stack ownership without changing bootstrap semantics, authenticated shell entry, route names, or screen behavior.

## Classification

Ready for codex

## Scope

### In Scope

- calendar nested-stack boundary cleanup in `CalendarNavigation`
- preserve the relationship where `BottomTabNavigation` mounts `CalendarNavigation` behind the `Calendar` tab
- preserve the current four-route calendar stack unless a narrowly scoped boundary cleanup requires a smaller ownership adjustment
- clarify what belongs inside the calendar nested stack versus what belongs in the tab shell or root stack
- keep the change set minimal, bounded, and reviewable
- make later calendar or writing follow-on lanes safer and smaller

### Out of Scope

- no startup-rule changes
- no onboarding rewrite
- no tab redesign
- no route renames
- no screen-internal behavior changes
- no broad journal/calendar feature redesign
- no root-stack redesign
- no privacy, disclosure, or settings-policy changes
- no dependency or tooling changes
- no unrelated UX cleanup

## Files / Surfaces

Primary implementation evidence for this lane:

- `src/navigation/CalendarNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/RootNavigation.js`
- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`
- `README.md`

Current-state baseline and companion references:

- `docs/architecture/navigation-tree-and-route-ownership.md`
- `docs/architecture/root-stack-boundary-cleanup.md`
- `docs/architecture/bottom-tab-shell-cleanup.md`

## Current State

Active code shows the current startup path as:

1. `AppBootstrap` resolves `Home` when local `user_profile` exists and `CompleteProfile` when it does not.
2. `RootContainer` receives `initialRouteName` and passes it into `RootNavigation`.
3. `RootNavigation` mounts `BottomTabNavigation` under `Home`.
4. `BottomTabNavigation` mounts `CalendarNavigation` behind the `Calendar` tab.

Active code also shows that `CalendarNavigation` currently owns four registered nested routes:

- `CalendarMain`
- `Writing`
- `Edit Writing`
- `NewDay`

The current nested calendar boundary therefore mixes a calendar entry screen with writing-related detail routes.

This is current-state evidence only, not an automatic redesign target beyond what is required for bounded boundary cleanup.

For this lane, active code is the source of truth for registered route names. The bottom-tab route is `Calendar`, while the current nested stack entry route is `CalendarMain`. Likewise, the current nested route name is `NewDay`, not `New Day`. This lane must not imply or propose route renames.

`README.md` is a consistency check only for local-first posture and startup truthfulness. It does not override live code.

## Objective

Make `CalendarNavigation` a clearer, thinner domain boundary under the `Calendar` tab.

Ensure it owns calendar-domain routing intentionally rather than acting as an informal spillover container. This cleanup should make later calendar and writing follow-on lanes safer and smaller.

## Boundary Rule for This Lane

After this cleanup, the calendar nested stack should own only:

- the calendar-domain entry route mounted by the `Calendar` tab
- the minimum nested routes that clearly belong to the same calendar-domain flow
- the minimal stack configuration needed to support that flow

The calendar nested stack should not:

- become a catch-all host for unrelated detail routes
- duplicate root-stack responsibilities
- duplicate tab-shell responsibilities
- reopen broader writing-domain or journal-domain architecture decisions beyond what is required for calendar-stack clarity
- alter the startup contract that routes returning users into `Home` and fresh installs into `CompleteProfile`

If clarifying the calendar-stack boundary would require deciding whether writing belongs to a separate domain navigator, stop and defer that decision to a later writing-domain lane.

## Proposed Implementation Shape

This lane is bounded cleanup guidance, not a navigator redesign.

- preserve `Home` in `RootNavigation` as the authenticated shell entry
- preserve `Calendar` in `BottomTabNavigation` as the tab that mounts `CalendarNavigation`
- preserve the current nested calendar-stack routing behavior unless a smaller boundary cleanup requires a narrowly scoped ownership adjustment
- narrow `CalendarNavigation` to calendar-stack concerns only: calendar-domain entry, nested flow ownership, and stack-level defaults
- avoid moving unrelated detail routes into `CalendarNavigation`
- avoid renaming routes in this lane unless strictly required to keep the nested stack functioning
- if a cleanup idea requires broader writing-domain ownership decisions rather than calendar-stack clarification, defer that work to a later extraction or naming lane instead of widening this one

## Public Interfaces

This artifact changes no public APIs, route names, types, providers, dependencies, or runtime behavior.

The current contracts in `src/bootstrap/AppBootstrap.js`, `src/root-container/RootContainer.js`, `src/navigation/RootNavigation.js`, `src/navigation/BottomTabNavigation.js`, and `src/navigation/CalendarNavigation.js` are preserved invariants for this lane:

- local `user_profile` decides `Home` versus `CompleteProfile`
- `initialRouteName` passes through unchanged from bootstrap to root navigation
- `Home` remains the authenticated shell entry
- `BottomTabNavigation` continues to mount `CalendarNavigation` through the `Calendar` tab
- the current nested calendar flow remains available through `CalendarMain`, `Writing`, `Edit Writing`, and `NewDay`

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane even when supplied outside the current repo snapshot or current chat file state
- nearby approved lane docs may inform style and section rhythm, but they do not replace the governing Brunch Body project template and scope for this lane
- bootstrap semantics must remain unchanged
- `RootNavigation` must continue to mount the authenticated shell through `Home`
- `BottomTabNavigation` must continue to mount `CalendarNavigation` through the `Calendar` tab
- `docs/architecture/navigation-tree-and-route-ownership.md` should be treated as the baseline evidence map for current route ownership
- `docs/architecture/root-stack-boundary-cleanup.md` and `docs/architecture/bottom-tab-shell-cleanup.md` should remain separate companion boundaries so this lane does not absorb their responsibilities
- active code is the source of truth if repo docs differ

## Acceptance Criteria

- `AppBootstrap` still resolves `Home` for saved `user_profile` data and `CompleteProfile` otherwise
- `RootNavigation` still mounts `BottomTabNavigation` under `Home`
- `BottomTabNavigation` still mounts `CalendarNavigation` under the `Calendar` tab
- `CalendarNavigation` remains limited to the existing calendar-stack route registrations needed for the current nested flow, stack-level options, and existing nested-flow entry points, with no new non-calendar detail-route registrations introduced in this lane
- the current nested calendar flow still works for representative navigation into `CalendarMain`, `Writing`, `Edit Writing`, and `NewDay`
- navigation into and back out of representative nested calendar routes still works
- no startup behavior changes occur
- no route renames, copy changes, privacy changes, or dependency changes are introduced unless strictly required for safe stack wiring

## Validation

- static review of unchanged bootstrap flow
- static review that `RootNavigation` still mounts `BottomTabNavigation` under `Home`
- static review that `BottomTabNavigation` still mounts `CalendarNavigation` under `Calendar`
- static review that `CalendarNavigation` remains the owner of the nested calendar stack routes
- manual smoke coverage for returning-user path to `Home`
- manual smoke coverage for tab-shell render
- manual smoke coverage for entering `Calendar`
- manual smoke coverage for nested navigation from the calendar entry into representative writing screens
- manual smoke coverage for representative back navigation from nested calendar-stack screens

## Risks / Notes

- main risk is accidental stack-boundary drift, where calendar cleanup starts reopening writing-domain, tab-shell, or root-stack decisions that belong to later lanes
- another risk is conflating route naming cleanup with boundary cleanup
- this should remain a minimal-diff nested-stack cleanup, not a broader navigation redesign
- preserve local-first truthfulness and the current `Home` startup contract
- mixed naming such as `Edit Writing`, `CalendarMain`, and `NewDay` should be recorded and tolerated here unless a minimal wiring fix is strictly required

## Follow-on Lane Seeds

- writing stack extraction or writing-domain boundary clarification
- calendar route naming/constants cleanup
- dead-route audit
- journal/calendar relationship cleanup
- nested-stack smoke tests

## Assumptions

- the requested artifact should follow the same section cadence and reviewability standard as the approved `1.1.2.2.1` through `1.1.2.2.3` lane docs, while still treating `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` as the governing inputs
- active code is authoritative over repo prose for startup facts, navigator ownership, and route names
- this lane should clarify calendar-stack ownership without reopening root-stack cleanup, bottom-tab shell cleanup, route naming cleanup, or broader writing/journal redesign

## Constraints

- docs-only
- create exactly one new file: `docs/architecture/calendar-stack-boundary-cleanup.md`
- no production code changes
- no config changes
- no tests changed
- no dependency or package changes
- no route renames
- no behavior changes
- keep the lane present-state aware and cleanup-bounded
- use active code as the source of truth if repo docs differ

## Acceptance

- exactly one new docs file is added at `docs/architecture/calendar-stack-boundary-cleanup.md`
- the artifact is in Brunch Body Project Template style
- the artifact defines a bounded, Codex-ready calendar-stack cleanup lane
- the artifact preserves current bootstrap semantics in its contract
- the artifact clearly distinguishes in-scope calendar-stack cleanup from out-of-scope root-stack work, tab-shell work, naming cleanup, and broader writing/journal redesign
- the artifact provides binary, reviewable acceptance criteria
- the artifact does not implement cleanup or propose unrelated product changes

## Do not

- implement the refactor
- change `CalendarNavigation.js`
- change `BottomTabNavigation.js`
- change `RootNavigation.js`
- change `AppBootstrap.js`
- change `RootContainer.js`
- rename routes
- redesign tabs
- widen into writing-domain redesign or full journal/calendar extraction
- mix this lane with root cleanup, tab-shell cleanup, naming cleanup, privacy work, or UX redesign

## Review standard

- keep scope narrow
- do not expand beyond stated files/surfaces
- do not introduce backend/cloud behavior unless explicitly requested
- do not change disclosures, privacy claims, or deletion semantics unless this lane explicitly includes them
- prefer minimal diffs
- add tests only for touched logic or required acceptance
- if the task is broader than stated, stop and leave a note rather than widening scope
