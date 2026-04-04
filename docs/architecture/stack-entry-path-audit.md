# Lane: 1.1.2.2.20 Stack entry-path audit

## Summary

This artifact audits how users currently enter each active stack or major navigation area in the live app.

This lane is docs-only and evidence-first. It classifies current stack entry paths as intentional, compatibility-preserving, quirk-shaped, or later cleanup candidates without changing runtime behavior.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane. Live mounted code is authoritative for startup facts, navigator ownership, route registrations, and current entry-path behavior. Nearby approved lane docs may inform cadence and phrasing only.

Startup behavior, authenticated-shell entry, current root/tab/stack ownership, current registered route names, and current visible labels must be preserved exactly. This artifact classifies evidence only. It does not authorize entry-path implementation cleanup.

## Classification

Ready for codex

## Scope

### In Scope

- create one docs-only audit artifact for stack entry paths
- inspect the live entry paths into:
  - root startup
  - authenticated shell
  - six top-level tab destinations
  - calendar and writing flow
  - settings flow
  - tutorial re-entry flow
  - complete-profile completion flow
- classify each audited entry path with one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- distinguish between:
  - `current-owner aligned entry`
  - `current-owner aligned with compatibility context`
  - `preserved UX quirk`
  - `unresolved ambiguity`
- seed later cleanup lanes without implementing them

### Out of Scope

- no production code changes
- no route renames
- no label changes
- no navigator ownership moves
- no startup-rule changes
- no tab redesign
- no screen-internal behavior changes
- no dependency or tooling changes
- no unrelated UX cleanup

## Files / Surfaces

Primary evidence surfaces inspected for this artifact:

- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`
- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/CalendarNavigation.js`
- `src/navigation/SettingsNavigation.js`
- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
- `src/screens/completeProfile/components/Welcome.js`
- `src/screens/setting/pages/Tutorials/Tutorials.js`
- `src/screens/setting/pages/Setting/Setting.js`

Representative stack-local entry surfaces inspected to confirm non-findings:

- `src/screens/calendar/pages/calendar/Calendar.js`
- `src/screens/calendar/components/Writing.js`
- `src/screens/writing/components/Writing.js`
- `src/screens/journal/components/Journal.js`
- `src/screens/nutrition/pages/Nutrition/Nutrition.js`
- `src/screens/recreation/pages/Recreation/Recreation.js`

Companion architecture docs used as context only:

- `docs/architecture/navigation-call-site-drift-audit.md`
- `docs/architecture/cross-navigator-ownership-exception-audit.md`
- `docs/architecture/label-vs-route-name-audit.md`
- `docs/architecture/route-constants-adoption-audit.md`

Legacy residue checked only to avoid false startup conclusions:

- `src/screens/splashScreen/pages/splashScreen/SplashScreen.js`

Live mounted code is authoritative for this lane. Older docs and unmounted residue are framing/context only.

## Current State

Active code shows the current mounted startup and entry contract as:

1. `resolveInitialRouteName()` in `src/bootstrap/AppBootstrap.js` reads local `user_profile` from AsyncStorage and returns `ROOT_ROUTES.HOME` when profile data exists and `ROOT_ROUTES.COMPLETE_PROFILE` otherwise.
2. `AppBootstrap` hydrates workout plans during bootstrap, keeps `initialRouteName` in local state, and returns `null` until that route resolves.
3. `RootContainer` receives `initialRouteName` and passes it through to `RootNavigation`.
4. `RootNavigation` currently registers exactly three root routes: `CompleteProfile`, `Home`, and `Tutorials`.
5. `Home` mounts `BottomTabNavigation` as the authenticated shell entry.

The authenticated tab shell currently registers these six top-level destinations:

- `Dashboard`
- `Journal`
- `Calendar`
- `Nutrition`
- `Recreation`
- `Settings`

Current tab-shell evidence also shows:

- `BottomTabNavigation` still uses `initialRouteName={AUTH_TAB_ROUTES.CALENDAR}`
- the `Dashboard` tab is still displayed with visible label `Home`

Current nested owner evidence relevant to entry-path review also shows:

- `CalendarNavigation` owns `CalendarMain`, `Writing`, `Edit Writing`, and `NewDay`
- `SettingsNavigation` owns the settings stack starting at `Settings`
- `Tutorials` remains registered at root, not inside `SettingsNavigation`

Current entry-path evidence also shows two preserved completion overrides:

- complete-profile completion does not simply fall through to the tab shell default; `Welcome.js` passes `ROOT_ROUTES.HOME` as the wizard target and `CompleteProfile.js` translates that completion into `navigation.navigate(ROOT_ROUTES.HOME, { screen: AUTH_TAB_ROUTES.DASHBOARD })`
- tutorial completion also exits through `navigation.navigate(ROOT_ROUTES.HOME, { screen: AUTH_TAB_ROUTES.DASHBOARD })`, while first-slide back uses `navigation.goBack()` when tutorials were entered as a sub-flow

These are present-state facts only. They do not by themselves authorize default-tab normalization, ownership moves, route renames, or flow redesign in this lane.

## Objective

Answer, from current code rather than older prose:

- which stack entry paths are currently intentional and aligned
- which entry paths are preserved compatibility or UX holds
- which entry-path quirks should remain documented before any cleanup
- which findings require a later implementation lane rather than immediate action

The goal is to reduce confusion before any later lane tries to normalize default tabs, completion exits, or stack-entry behavior.

## Boundary Rule for This Lane

This lane may:

- inspect current entry-path behavior
- compare current entry paths against current navigator ownership
- classify stack-entry quirks and compatibility paths
- recommend follow-on cleanup lanes

This lane must not:

- rewrite entry paths
- rename routes
- move ownership between navigators
- change startup behavior
- redesign tabs or flows
- convert the audit into implementation work

Operational deferral rule:

- if normalizing an entry path would require a behavior change, ownership change, label redesign, or broader UX decision, classify it as `defer` or `candidate cleanup` rather than forcing implementation in this lane

## Audit Method

- inventory the current root, shell, and stack ownership baseline from the mounted navigators
- inspect representative entry paths for bootstrap entry, authenticated-shell entry, tab default entry, complete-profile completion, tutorial completion, calendar and writing entry, and settings entry
- record one row per meaningful entry-path finding
- require every finding to be backed by:
  - current route registration evidence
  - current navigation call-site evidence
  - current owner alignment or quirk evidence
- keep ordinary current-owner aligned entries out of the findings register unless they are needed as comparison context
- do not add extra findings unless the proof is at least as strong as the seeded rows

### Entry-path taxonomy

- `current-owner aligned entry`
- `current-owner aligned with compatibility context`
- `preserved UX quirk`
- `unresolved ambiguity`

### Disposition taxonomy

- `keep`
- `keep for compatibility`
- `candidate cleanup`
- `defer`

## Findings Register

Only include a row in this register when live evidence shows a meaningful preserved entry-path decision, compatibility hold, or ambiguity point worth carrying forward. Clearly ordinary aligned entries stay out of the table.

| entry-path surface | current navigation target | registered owner | evidence | entry-path type | disposition | follow-on lane |
| --- | --- | --- | --- | --- | --- | --- |
| Bootstrap entry | `ROOT_ROUTES.HOME` or `ROOT_ROUTES.COMPLETE_PROFILE` | `RootNavigation` | `src/bootstrap/AppBootstrap.js` defines `resolveInitialRouteName()` to return `ROOT_ROUTES.HOME` when `user_profile` exists and `ROOT_ROUTES.COMPLETE_PROFILE` otherwise, then passes that result into `RootContainer`. `src/root-container/RootContainer.js` forwards `initialRouteName` into `RootNavigation`, and `src/navigation/RootNavigation.js` uses it as the root stack `initialRouteName`. | `current-owner aligned entry` | `keep` | none |
| Tab shell default | `AUTH_TAB_ROUTES.CALENDAR` | `BottomTabNavigation` | `src/navigation/BottomTabNavigation.js` registers the six authenticated tab destinations `Dashboard`, `Journal`, `Calendar`, `Nutrition`, `Recreation`, and `Settings`, while still setting `initialRouteName={AUTH_TAB_ROUTES.CALENDAR}` on the tab navigator. | `preserved UX quirk` | `defer` | entry-path normalization lane |
| Complete-profile completion | `ROOT_ROUTES.HOME` with `{ screen: AUTH_TAB_ROUTES.DASHBOARD }` | `RootNavigation` plus tab shell | `src/screens/completeProfile/components/Welcome.js` passes `ROOT_ROUTES.HOME` as the wizard target through `nextScreen`. `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js` detects that target and calls `navigation.navigate(ROOT_ROUTES.HOME, { screen: AUTH_TAB_ROUTES.DASHBOARD })` instead of leaving completion on the tab shell default `Calendar` entry path. `src/navigation/RootNavigation.js` registers `Home`, and `src/navigation/BottomTabNavigation.js` registers `Dashboard`. | `current-owner aligned with compatibility context` | `keep for compatibility` | entry-path normalization lane |
| Tutorial completion | `ROOT_ROUTES.HOME` with `{ screen: AUTH_TAB_ROUTES.DASHBOARD }` | `RootNavigation` plus tab shell | `src/screens/setting/pages/Setting/Setting.js` exposes `Tutorial` from the settings landing through `ROOT_ROUTES.TUTORIALS`. `src/navigation/RootNavigation.js` registers `Tutorials` at root. `src/screens/setting/pages/Tutorials/Tutorials.js` sends the final tutorial step to `navigation.navigate(ROOT_ROUTES.HOME, { screen: AUTH_TAB_ROUTES.DASHBOARD })`, while first-slide back uses `navigation.goBack()` when tutorials were entered as a sub-flow. `src/navigation/BottomTabNavigation.js` registers `Dashboard` in the authenticated shell. | `current-owner aligned with compatibility context` | `keep for compatibility` | entry-path normalization lane |

Current audit did not confirm any additional live entry-path quirk with evidence strong enough to justify another findings row. In particular, no extra row met the proof bar for `candidate cleanup` or `unresolved ambiguity`.

## Related Context / Non-Findings

- authenticated-shell entry through `Home` is an ordinary aligned root-to-tab-shell entry and stays out of the findings register
- `Settings` tab entry into `SettingsNavigation` is an ordinary aligned tab-to-stack entry and stays out of the findings register
- the calendar and writing flow remains a stack-local entry path: `Calendar` opens the calendar stack, `src/screens/calendar/components/Writing.js` navigates to `CALENDAR_ROUTES.WRITING`, and `src/screens/writing/components/Writing.js` navigates to `CALENDAR_ROUTES.EDIT_WRITING`
- the inspected journal, nutrition, and recreation surfaces remain ordinary tab-owned or stack-owned entries rather than entry-path exceptions: `Journal`, `Nutrition`, and `Recreation` are registered top-level destinations, and their representative in-stack transitions stay local to their mounted owners
- `Dashboard` versus visible `Home` is a label-vs-route-name issue, not an entry-path finding by itself; it is supporting context only and remains primarily covered by `docs/architecture/label-vs-route-name-audit.md`
- root-owned `Tutorials` is a cross-navigator ownership exception, not an entry-path finding by itself; it remains primarily covered by `docs/architecture/cross-navigator-ownership-exception-audit.md`
- route-name compatibility holds such as `CalendarMain`, `Edit Writing`, `NewDay`, `MealsList`, and `Abbrevations` are naming concerns, not stack-entry findings, unless a future lane proves that an entry path depends on one of those names
- `src/screens/splashScreen/pages/splashScreen/SplashScreen.js` contains older `Home` and `CompleteProfile` navigation residue, but it is not part of the mounted startup chain `AppBootstrap -> RootContainer -> RootNavigation -> BottomTabNavigation` and therefore does not drive current startup findings in this lane

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
- live mounted code is authoritative for startup facts, navigator ownership, route registrations, and current entry-path behavior
- nearby approved lane docs may inform cadence and phrasing only; they do not replace the governing inputs
- earlier ownership, naming, and call-site audits remain context and should not be reopened as implementation scope

## Acceptance Criteria

- exactly one new docs artifact is added at `docs/architecture/stack-entry-path-audit.md`
- the artifact follows the established Brunch Body architecture-lane doc cadence used in this repo
- the artifact inventories stack entry-path findings using live evidence
- each finding includes one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- the artifact clearly distinguishes ordinary aligned entry, compatibility-context entry, preserved UX quirk, and unresolved ambiguity
- the artifact captures complete-profile completion and tutorial completion accurately as `Home -> Dashboard` entry paths
- the artifact keeps the tab-shell default documented as `Calendar` unless stronger contrary evidence appears in a later approved lane
- the artifact does not rename routes, move ownership, or change startup behavior
- the artifact clearly separates audit findings from later implementation work

## Validation

- static review that startup and shell statements match `src/bootstrap/AppBootstrap.js`, `src/root-container/RootContainer.js`, `src/navigation/RootNavigation.js`, and `src/navigation/BottomTabNavigation.js`
- static review that each findings row is backed by both route-registration evidence and current navigation call-site evidence
- static review that complete-profile completion and tutorial completion are documented specifically as `Home -> Dashboard`, not as simple tab-default entry
- static review that the tab-shell default remains `Calendar` unless stronger contrary evidence appears during a later approved lane
- static review that ordinary aligned authenticated-shell, settings, calendar and writing, journal, nutrition, and recreation entry paths remain outside the findings register
- final diff review that the only repo change is `docs/architecture/stack-entry-path-audit.md`

## Risks / Notes

- the main risk is confusing current entry-path quirks with bugs and then silently normalizing them
- another risk is widening this audit into UX redesign or ownership cleanup
- another risk is mixing label mismatch or route-name compatibility issues into this lane's findings register
- unmounted startup residue such as `SplashScreen` is easy to overread as current behavior if the mounted bootstrap chain is not treated as authoritative
- this lane should stay conservative and only record additional findings when the proof is at least as strong as the seeded rows

## Follow-on Lane Seeds

- entry-path normalization lane
- stack-by-stack runtime smoke validation lane
- ownership exception clarification lane
- cleanup decision log update
- stale architecture-doc reconciliation update

## Assumptions

- this artifact should follow the same reviewable cadence as the approved `1.1.2.2.x` lane docs while still treating `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` as the governing inputs
- live mounted code is authoritative over older docs and over unmounted legacy residue such as `src/screens/splashScreen/...` for startup facts, navigator ownership, route registrations, and current entry-path behavior
- this lane is about audit and classification only, not entry-path rewrites, tab-default normalization, or tutorial ownership redesign
