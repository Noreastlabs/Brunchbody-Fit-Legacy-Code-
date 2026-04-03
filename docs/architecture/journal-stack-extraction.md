# Lane: 1.1.2.2.5 Journal stack extraction

## Summary

This lane defines a bounded cleanup of `JournalNavigation` so journal detail routes are intentionally owned by the journal-domain nested stack under the authenticated tab shell.

Startup behavior, authenticated-shell entry, current journal route names, and screen-internal behavior must be preserved exactly. The intent is to clarify journal nested-stack ownership without changing bootstrap semantics, tab purpose, route names, or journal screen behavior.

## Classification

Ready for codex

## Scope

### In Scope

- journal stack extraction and boundary cleanup in `JournalNavigation`
- preserve the relationship where `BottomTabNavigation` mounts `JournalNavigation` behind the `Journal` tab
- preserve the current journal stack route set unless a narrowly scoped extraction cleanup requires a smaller ownership adjustment:
  - `Journal`
  - `WeightLog`
  - `QuarterlyEntry`
  - `DailyEntry`
  - `WeeklyEntry`
  - `SupplementLog`
  - `Calories`
  - `TraitDirectory`
- clarify what belongs inside the journal nested stack versus what belongs in the tab shell or root stack
- keep the change set minimal, bounded, and reviewable
- make later journal-domain cleanup lanes smaller and safer

### Out of Scope

- no startup-rule changes
- no onboarding rewrite
- no tab redesign
- no route renames
- no screen-internal behavior changes
- no broad journal feature redesign
- no nutrition, recreation, or settings extraction
- no root-stack redesign
- no privacy, disclosure, or settings-policy changes
- no dependency or tooling changes
- no unrelated UX cleanup

## Files / Surfaces

Primary implementation evidence for this lane:

- `src/navigation/JournalNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/RootNavigation.js`
- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`
- `src/screens/journal/index.js`

Supporting live-flow evidence for current journal nested routing:

- `src/screens/journal/pages/Journal/Journal.js`
- `src/screens/journal/components/Journal.js`
- `src/screens/journal/components/DailyEntry.js`
- `src/screens/journal/components/TraitDirectory.js`
- `README.md`

Current-state baseline and companion references only:

- `docs/architecture/navigation-tree-and-route-ownership.md`
- `docs/architecture/root-stack-boundary-cleanup.md`
- `docs/architecture/bottom-tab-shell-cleanup.md`
- `docs/architecture/calendar-stack-boundary-cleanup.md`

These repo docs may inform context and section rhythm, but active code is authoritative if older prose still reflects pre-extraction root ownership.

## Current State

Active code shows the current startup path as:

1. `AppBootstrap` resolves `Home` when local `user_profile` exists and `CompleteProfile` when it does not.
2. `RootContainer` receives `initialRouteName` and passes it into `RootNavigation`.
3. `RootNavigation` mounts `BottomTabNavigation` under `Home`.
4. `BottomTabNavigation` mounts `JournalNavigation` behind the `Journal` tab.

`BottomTabNavigation` still initializes the authenticated tab shell to `Calendar`. That is current-state evidence only and is not a redesign target in this lane.

Active code also shows that `JournalNavigation` currently owns a nested stack with `initialRouteName="Journal"` and the following eight registered routes:

- `Journal`
- `WeightLog`
- `QuarterlyEntry`
- `DailyEntry`
- `WeeklyEntry`
- `SupplementLog`
- `Calories`
- `TraitDirectory`

The current journal export surface in `src/screens/journal/index.js` matches those eight wrappers.

Live journal flow evidence also supports keeping those routes together for this lane:

- the journal landing page launches `DailyEntry`, `WeightLog`, `Calories`, `SupplementLog`, `WeeklyEntry`, and `QuarterlyEntry`
- `DailyEntry` opens `TraitDirectory`
- `TraitDirectory` navigates to `DailyEntry` with a selected trait

This is current-state evidence only, not an automatic prompt to rename routes, redesign the journal flow, or reopen broader cross-domain extraction decisions.

`README.md` is a consistency check only for the local-first/offline posture and current startup truthfulness. It does not override live code.

## Objective

Make `JournalNavigation` a clearer, thinner journal-domain boundary under the `Journal` tab.

Ensure journal routes are intentionally owned by the journal stack rather than remaining ambiguous across broader navigation layers. This cleanup should make later journal cleanup, naming cleanup, and smoke-test lanes safer and smaller.

## Boundary Rule for This Lane

After this cleanup, the journal nested stack should own only:

- the journal-domain entry route mounted by the `Journal` tab
- the minimum nested routes that clearly belong to the same journal-domain flow
- the minimal stack configuration needed to support that flow

The journal nested stack should not:

- become a catch-all host for unrelated detail routes
- duplicate root-stack responsibilities
- duplicate tab-shell responsibilities
- reopen broader domain-boundary decisions for nutrition, recreation, settings, or dashboard
- alter the startup contract that routes returning users into `Home` and no-profile users into `CompleteProfile`

Operational deferral rule:

- if clarifying the journal-stack boundary would require deciding that a route belongs to a different domain navigator rather than the journal flow, stop and defer that decision to a later lane instead of widening this one

## Proposed Implementation Shape

This lane is bounded cleanup guidance, not a navigator redesign.

- preserve `Home` in `RootNavigation` as the authenticated shell entry
- preserve `Journal` in `BottomTabNavigation` as the tab that mounts `JournalNavigation`
- preserve the current journal-stack routing behavior unless a smaller extraction cleanup requires a narrowly scoped ownership adjustment
- narrow `JournalNavigation` to journal-stack concerns only: journal-domain entry, nested flow ownership, and stack-level defaults
- preserve the current eight journal route names and current journal nested-flow behavior unless a minimal wiring fix is strictly required
- avoid moving unrelated detail routes into `JournalNavigation`
- avoid renaming routes in this lane unless strictly required to keep the nested stack functioning
- if a cleanup idea requires broader journal-domain redesign or a cross-domain ownership decision rather than journal-stack extraction, defer that work to a later lane instead of widening scope here

## Public Interfaces

This artifact changes no public APIs, route names, types, providers, dependencies, or runtime behavior.

The current contracts in `src/bootstrap/AppBootstrap.js`, `src/root-container/RootContainer.js`, `src/navigation/RootNavigation.js`, `src/navigation/BottomTabNavigation.js`, and `src/navigation/JournalNavigation.js` are preserved invariants for this lane:

- local `user_profile` decides `Home` versus `CompleteProfile`
- `initialRouteName` passes through unchanged from bootstrap to root navigation
- `Home` remains the authenticated shell entry
- `Journal` remains the tab route that enters the journal stack
- `JournalNavigation` remains the owner of the current eight journal nested-stack routes unless a minimal wiring fix is strictly required

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane even when supplied outside the current repo snapshot or current chat file state
- nearby approved lane docs may inform style and section rhythm, but they do not replace the governing Brunch Body project template and scope for this lane
- bootstrap semantics must remain unchanged
- `RootNavigation` must continue to mount the authenticated shell through `Home`
- `BottomTabNavigation` must continue to mount `JournalNavigation` through the `Journal` tab
- `src/screens/journal/index.js` should be treated as the current journal export surface for the mounted wrappers
- `docs/architecture/navigation-tree-and-route-ownership.md` should be treated as a baseline evidence map only, with active code taking precedence if older prose still describes pre-extraction root ownership
- `docs/architecture/root-stack-boundary-cleanup.md`, `docs/architecture/bottom-tab-shell-cleanup.md`, and `docs/architecture/calendar-stack-boundary-cleanup.md` should remain separate companion boundaries so this lane does not absorb their responsibilities
- active code is the source of truth if repo docs differ

## Acceptance Criteria

- `AppBootstrap` still resolves `Home` for saved `user_profile` data and `CompleteProfile` otherwise
- `RootNavigation` still mounts `BottomTabNavigation` under `Home`
- `BottomTabNavigation` still mounts `JournalNavigation` under the `Journal` tab
- `JournalNavigation` still uses `initialRouteName="Journal"`
- `JournalNavigation` remains limited to the existing journal-stack route registrations needed for the current nested flow, stack-level options, and existing nested-flow entry points, with no new non-journal detail-route registrations introduced in this lane
- the current journal stack route set remains:
  - `Journal`
  - `WeightLog`
  - `QuarterlyEntry`
  - `DailyEntry`
  - `WeeklyEntry`
  - `SupplementLog`
  - `Calories`
  - `TraitDirectory`
- the current journal nested flow still works for representative navigation into:
  - `Journal`
  - `WeightLog`
  - `QuarterlyEntry`
  - `DailyEntry`
  - `WeeklyEntry`
  - `SupplementLog`
  - `Calories`
  - `TraitDirectory`
- navigation into and back out of representative journal-stack routes still works
- no startup behavior changes occur
- no route renames, copy changes, privacy changes, or dependency changes are introduced unless strictly required for safe stack wiring

## Validation

- static review that the startup-path statements in this artifact match live code in `AppBootstrap`, `RootContainer`, and `RootNavigation`
- static review that `RootNavigation` still mounts `BottomTabNavigation` under `Home`
- static review that `BottomTabNavigation` still mounts `JournalNavigation` under `Journal`
- static review that `JournalNavigation` remains the owner of the current journal stack routes
- static review that the route list in this artifact matches the journal exports and current journal-stack registrations
- static review that the final diff adds only `docs/architecture/journal-stack-extraction.md`
- manual smoke coverage for returning-user path to `Home`
- manual smoke coverage for tab-shell render
- manual smoke coverage for entering `Journal`
- manual smoke coverage for representative navigation from `Journal` into `WeightLog` and `DailyEntry`
- manual smoke coverage for representative navigation between `DailyEntry` and `TraitDirectory`
- manual smoke coverage for representative back navigation from nested journal-stack screens

## Risks / Notes

- main risk is accidental boundary drift, where journal extraction starts reopening root-stack, tab-shell, or cross-domain decisions that belong to other lanes
- another risk is conflating route naming cleanup with extraction work
- current code-backed names such as `WeightLog`, `QuarterlyEntry`, and `TraitDirectory` should be recorded and tolerated here unless a minimal wiring fix is strictly required
- this should remain a minimal-diff journal-stack extraction, not a broader journal redesign
- preserve local-first truthfulness and the current `Home` startup contract

## Follow-on Lane Seeds

- journal route naming/constants cleanup
- dead-route audit
- journal flow smoke tests
- journal/calendar relationship cleanup
- journal-domain UX clarification lane

## Assumptions

- the requested artifact should follow the same reviewable cadence as the approved `1.1.2.2.1` through `1.1.2.2.4` lane docs while still treating `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` as the governing inputs
- active code is authoritative over repo prose for startup facts, navigator ownership, nested-flow evidence, and route names
- this lane is about extraction and boundary clarity, not feature redesign
- if a cleaner journal boundary would require deciding that a route belongs to another domain navigator, that decision should be deferred rather than absorbed here

## Constraints

- docs-only
- create exactly one new file: `docs/architecture/journal-stack-extraction.md`
- no production code changes
- no config changes
- no tests changed
- no dependency or package changes
- no route renames
- no behavior changes
- keep the lane present-state aware and cleanup-bounded
- use active code as the source of truth if repo docs differ

## Acceptance

- exactly one new docs file is added at `docs/architecture/journal-stack-extraction.md`
- the artifact is in Brunch Body Project Template style
- the artifact defines a bounded, Codex-ready journal-stack extraction lane
- the artifact preserves current bootstrap and shell semantics in its contract
- the artifact clearly distinguishes in-scope journal-stack extraction from out-of-scope root-stack work, tab-shell work, naming cleanup, and broader journal redesign
- the artifact provides binary, reviewable acceptance criteria
- the artifact does not implement cleanup or propose unrelated product changes

## Do not

- implement the refactor
- change `JournalNavigation.js`
- change `BottomTabNavigation.js`
- change `RootNavigation.js`
- change `AppBootstrap.js`
- change `RootContainer.js`
- rename routes
- redesign tabs
- widen into journal feature redesign or cross-domain extraction
- mix this lane with root cleanup, tab-shell cleanup, naming cleanup, privacy work, or UX redesign

## Review standard

- keep scope narrow
- do not expand beyond stated files or surfaces
- do not introduce backend or cloud behavior unless explicitly requested
- do not change disclosures, privacy claims, or deletion semantics unless this lane explicitly includes them
- prefer minimal diffs
- add tests only for touched logic or required acceptance
- if the task is broader than stated, stop and leave a note rather than widening scope
