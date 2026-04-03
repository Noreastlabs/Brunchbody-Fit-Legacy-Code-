# Lane: 1.1.2.2.15 Label-vs-route-name audit

## Summary

This artifact audits the current navigation surface for mismatches between registered route names and the labels or destination names users currently see in the app.

This lane is docs-only and evidence-first. It exists to make later label clarification, route rename migration, and compatibility-hold cleanup lanes safer without changing runtime behavior.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane. Live code is authoritative for current-state facts. Nearby approved lane docs may inform cadence and phrasing only.

Startup behavior, authenticated-shell entry, current route registrations, current tab ownership, current nested-stack ownership, and current visible labels must be preserved exactly. This artifact classifies evidence only. It does not authorize implementation cleanup.

## Classification

Ready for codex

## Scope

### In Scope

- create one docs-only audit artifact for label-vs-route-name review
- inspect the current root stack, bottom-tab shell, and mounted nested stacks for route-name versus visible-label mismatch
- inspect representative label-bearing screens and menu surfaces that navigate by current route name
- classify each finding with one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- distinguish true user-visible label mismatch from code-backed naming drift that should remain context only
- seed later cleanup lanes without implementing them

### Out of Scope

- no production code changes
- no route renames
- no tab-label changes
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
- `src/navigation/JournalNavigation.js`
- `src/navigation/NutritionNavigation.js`
- `src/navigation/RecreationNavigation.js`
- `src/navigation/SettingsNavigation.js`
- `src/navigation/routeNames.js`

Representative current label-bearing screens inspected for visible destination-name evidence:

- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
- `src/screens/setting/pages/Tutorials/Tutorials.js`
- `src/screens/setting/pages/Setting/Setting.js`
- `src/screens/setting/components/Setting.js`
- `src/screens/setting/pages/MyProfile/MyProfile.js`
- `src/screens/setting/components/My Profile/MyAccount.js`
- `src/screens/setting/components/Export To CSV/ExportToCSV.js`
- `src/screens/dashboard/components/Dashboard.js`
- `src/screens/journal/pages/Journal/Journal.js`
- `src/screens/journal/components/Journal.js`
- `src/screens/journal/components/Calories.js`
- `src/screens/journal/components/WeeklyEntry.js`
- `src/screens/journal/components/QuarterlyEntry.js`

Current-state baseline and companion references only:

- `docs/architecture/route-naming-and-constants-cleanup.md`
- `docs/architecture/dead-route-and-duplicate-route-audit.md`
- `docs/architecture/navigation-tree-and-route-ownership.md`

`src/navigation/routeNames.js` is an inventory helper only. A route is treated as live for this artifact only when the current navigator wiring also registers it.

## Current State

Active code shows the current startup path as:

1. `AppBootstrap` calls `resolveInitialRouteName()`.
2. `resolveInitialRouteName()` reads local `user_profile` from AsyncStorage.
3. `resolveInitialRouteName()` returns `Home` when profile data exists and `CompleteProfile` when it does not.
4. `RootContainer` receives `initialRouteName` and passes it into `RootNavigation`.
5. `RootNavigation` mounts `BottomTabNavigation` under `Home`.

Active code also shows that the current root stack still registers only three routes:

- `CompleteProfile`
- `Home`
- `Tutorials`

The authenticated shell still registers the same six top-level tab destinations:

- `Dashboard`
- `Journal`
- `Calendar`
- `Nutrition`
- `Recreation`
- `Settings`

Current tab-shell evidence also shows:

- the visible tab label for `Dashboard` is still `Home`
- the authenticated tab shell still uses `initialRouteName="Calendar"`

The currently mounted nested stacks still register these route sets:

- `CalendarNavigation`: `CalendarMain`, `Writing`, `Edit Writing`, `NewDay`
- `JournalNavigation`: `Journal`, `WeightLog`, `QuarterlyEntry`, `DailyEntry`, `WeeklyEntry`, `SupplementLog`, `Calories`, `TraitDirectory`
- `NutritionNavigation`: `Nutrition`, `Supplement`, `Meal`, `MealsList`, `MealDirectory`, `MealDetail`
- `RecreationNavigation`: `Recreation`, `RoutineManager`, `ProgramManager`, `EditProgram`, `EditRoutine`, `MyExercises`
- `SettingsNavigation`: `Settings`, `MyProfile`, `MyVitals`, `MyAccount`, `MyEmail`, `MyPassword`, `DeleteAccount`, `ExportToCSV`, `TermsOfUse`, `PrivacyPolicy`, `Abbrevations`

Current label-bearing screen evidence also shows:

- onboarding completion and tutorial exit still re-enter through root `Home` into tab route `Dashboard`
- the settings landing currently surfaces `Tutorial`, `Export Journal to Files`, and `Abbrevations`
- the profile/account settings surfaces currently show `My Accounts` as the entry label that opens route `MyAccount`
- the journal landing renders `Daily Entry`, `Weight Log`, `Calories In/Out`, `Supplement Log`, `Weekly Review`, and `Quarterly Review` as visible destination labels while retaining code-style internal keys for stored-entry lookup

These are present-state facts only. They do not by themselves authorize a route rename, copy refresh, ownership move, or UX redesign in this lane.

## Objective

Answer, from current code rather than older prose:

- which registered route names differ from current visible labels or destination names
- which mismatches are intentional and should be preserved for now
- which mismatches are compatibility holds that should stay documented rather than silently “fixed”
- which mismatches are later cleanup candidates
- which findings require a later rename or UX clarification lane instead of immediate action

## Boundary Rule for This Lane

This lane may:

- inspect current route registrations and visible labels
- compare live route names to current user-visible labels and destination names
- classify findings with bounded dispositions
- recommend follow-on cleanup lanes

This lane must not:

- rename routes
- change visible labels
- move ownership between navigators
- change startup behavior
- redesign tabs or flows
- convert the audit into implementation work

Operational deferral rule:

- if resolving a mismatch would require a behavior change, rename migration, broad call-site rewrite, or ownership decision, classify it as `defer` or `candidate cleanup` rather than forcing an implementation conclusion in this lane

## Audit Method

- inventory current registered routes by live navigator owner
- collect current visible labels from tab configuration and currently mounted label-bearing screens
- record only cases where a live route can be paired with a current visible label or destination name that differs in more than code-style formatting, or where multiple visible names layer over the same route and create current ambiguity
- keep code-backed naming drift in context only when the current visible destination name still matches the route concept closely enough that the issue is not primarily label-vs-route mismatch

### Mismatch taxonomy

- `user-visible label only`: the registered route name differs from the user-visible label, but the visible destination naming remains otherwise consistent
- `code-backed route-name only`: the registered route name is awkward, legacy, or inconsistent in code, but this lane found no distinct current user-visible label mismatch; these belong in context, not as primary findings
- `dual mismatch requiring later review`: the registered route name differs from one or more visible destination names and the visible names themselves are layered or ambiguous enough that later clarification should decide whether copy cleanup, route rename, or both are warranted

### Disposition taxonomy

- `keep`: the mismatch is currently intentional enough to preserve as-is in this lane
- `keep for compatibility`: the mismatch appears tied to current compatibility or navigation-entry expectations and should stay documented rather than silently changed
- `candidate cleanup`: the mismatch should seed a later bounded clarification or rename lane, but not be resolved here
- `defer`: the mismatch is real, but resolving it would require broader decisions that this lane must not absorb

## Findings Register

Only actual current mismatches or ambiguity points are listed below. Simple camel-case versus spaced-label differences are excluded unless the visible destination name also changes in meaning.

| route name | visible label / destination name | navigator owner | evidence | mismatch type | disposition | follow-on lane |
| --- | --- | --- | --- | --- | --- | --- |
| `Dashboard` | `Home` tab label; root shell entry still named `Home`; screen heading remains `Dashboard` | Bottom-tab shell | `src/navigation/BottomTabNavigation.js` registers `Dashboard` and sets `tabBarLabel` to `Home`. `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js` and `src/screens/setting/pages/Tutorials/Tutorials.js` both re-enter through root `Home` and target nested tab `Dashboard`. `src/screens/dashboard/components/Dashboard.js` still renders `Dashboard` as the screen heading. | `dual mismatch requiring later review` | `keep for compatibility` | label-versus-route-name clarification lane |
| `Tutorials` | `Tutorial` | Root stack plus settings entry surface | `src/navigation/RootNavigation.js` registers `Tutorials`. `src/screens/setting/pages/Setting/Setting.js` labels the Settings entry as `Tutorial` and points it to `ROOT_ROUTES.TUTORIALS`. | `user-visible label only` | `candidate cleanup` | label-versus-route-name clarification lane |
| `ExportToCSV` | `Export Journal to Files` entry label; destination heading `Export To CSV` | Settings nested stack | `src/navigation/SettingsNavigation.js` registers `ExportToCSV`. `src/screens/setting/pages/Setting/Setting.js` exposes the entry as `Export Journal to Files`. `src/screens/setting/components/Export To CSV/ExportToCSV.js` renders `Export To CSV` as the destination heading. | `dual mismatch requiring later review` | `candidate cleanup` | label-versus-route-name clarification lane |
| `MyAccount` | `My Accounts` entry label; destination heading `My Account` | Settings nested stack | `src/navigation/SettingsNavigation.js` registers `MyAccount`. `src/screens/setting/pages/MyProfile/MyProfile.js` labels the entry as `My Accounts`. `src/screens/setting/components/My Profile/MyAccount.js` renders `My Account` as the destination heading. | `user-visible label only` | `candidate cleanup` | label-versus-route-name clarification lane |
| `Calories` | `Calories In/Out` journal entry label; destination heading `Calories In / Out` | Journal nested stack | `src/navigation/JournalNavigation.js` registers `Calories`. `src/screens/journal/pages/Journal/Journal.js` pairs that route with visible heading `Calories In/Out`. `src/screens/journal/components/Calories.js` renders `Calories In / Out` as the destination heading. | `user-visible label only` | `candidate cleanup` | label-versus-route-name clarification lane |
| `WeeklyEntry` | `Weekly Review` journal entry label; destination heading `Weekly Entry` | Journal nested stack | `src/navigation/JournalNavigation.js` registers `WeeklyEntry`. `src/screens/journal/pages/Journal/Journal.js` pairs that route with visible heading `Weekly Review`. `src/screens/journal/components/WeeklyEntry.js` renders `Weekly Entry` as the destination heading. | `dual mismatch requiring later review` | `candidate cleanup` | label-versus-route-name clarification lane |
| `QuarterlyEntry` | `Quarterly Review` journal entry label; destination heading `Quarterly Entry` | Journal nested stack | `src/navigation/JournalNavigation.js` registers `QuarterlyEntry`. `src/screens/journal/pages/Journal/Journal.js` pairs that route with visible heading `Quarterly Review`. `src/screens/journal/components/QuarterlyEntry.js` renders `Quarterly Entry` as the destination heading. | `dual mismatch requiring later review` | `candidate cleanup` | label-versus-route-name clarification lane |

## Related context / non-findings

The current codebase also preserves naming drift that matters as compatibility context but is not a primary label-vs-route-name finding in this lane:

- `CalendarMain`, `Edit Writing`, `NewDay`, `MealsList`, and `Abbrevations` remain current code-backed naming holds. They should stay documented as context unless a later lane confirms a distinct visible label mismatch for those routes.
- `DailyEntry`, `WeightLog`, and `SupplementLog` currently differ from visible labels only by code-style formatting such as camel case versus spacing. That is not enough on its own to make them findings in this lane.
- `src/screens/journal/pages/Journal/Journal.js` uses code-style `title` keys such as `DailyEntry`, `WeightLog`, and `CaloriesEntry` to index stored entries, while `src/screens/journal/components/Journal.js` renders `heading` values as the user-visible labels. Those internal keys are evidence context, not standalone findings.
- `Abbrevations` is still both the route name and the current visible Settings label and screen heading. It is spelling drift, but not a current route-name-versus-label mismatch for this audit.

## Public Interfaces

This artifact changes no public APIs, route destinations, providers, dependencies, or runtime behavior.

Preserved invariants for this lane:

- `resolveInitialRouteName()` still returns `Home` when local `user_profile` exists and `CompleteProfile` otherwise
- `Home` remains the authenticated shell entry at root
- `BottomTabNavigation` still owns the same six top-level tab routes
- current route names and visible labels remain unchanged in this lane

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane
- live code is authoritative for startup facts, navigator ownership, route registrations, and current visible labels
- nearby approved lane docs may inform cadence and phrasing only; they do not replace the governing inputs
- earlier route-naming and dead-route audits remain context and should not be reopened as implementation scope

## Acceptance Criteria

- add exactly one new docs artifact at `docs/architecture/label-vs-route-name-audit.md`
- keep the diff docs-only
- inventory current label-vs-route-name mismatches using live evidence
- give each finding one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- clearly distinguish user-visible label mismatches from code-backed naming holds
- capture `Dashboard` versus visible `Home` accurately as a seeded finding
- complete a bounded second pass over label-bearing Journal entries and keep purely code-style differences out of the findings register
- preserve the current startup and shell contracts in the framing
- clearly separate audit findings from later implementation work

## Validation

- static review that startup and shell statements match live code
- static review that every finding is grounded in both a current route registration and a current visible label or destination-name source
- static review that `Dashboard` versus visible `Home` is captured accurately and remains classified as a compatibility hold
- static review that code-backed naming drift without a true visible-label mismatch stays in context rather than the findings register
- final diff review that the only repo change is `docs/architecture/label-vs-route-name-audit.md`

## Risks / Notes

- the main risk is confusing code-backed route naming drift with true user-visible label mismatch
- another risk is treating a visible-label mismatch as permission to rename routes immediately
- another risk is widening into UX redesign rather than bounded audit work
- journal list metadata is especially easy to overread; only the labels actually rendered in `src/screens/journal/components/Journal.js` count as visible destination names for this lane

## Follow-on Lane Seeds

- label-versus-route-name clarification lane
- route rename migration lane
- compatibility-hold label register
- navigator-wide smoke validation for visible labels
- stale architecture-doc reconciliation update for confirmed findings

## Assumptions

- this artifact should follow the same reviewable cadence as the approved `1.1.2.2.x` lane docs while still treating `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` as the governing inputs
- active code is authoritative over older repo prose for startup facts, navigator ownership, route registrations, and current labels
- if resolving a mismatch would require choosing between copy change, route rename, or ownership change, this lane should classify it rather than decide it
- if a route differs only by code-style formatting such as camel case versus spaces, it belongs in context unless the visible destination name also changes in meaning
