# Lane: 1.1.2.2.10 Dead-route and duplicate-route audit

## Summary

This artifact audits the current navigation surface for dead routes, duplicate registrations, stale route references, compatibility-hold naming drift, and stale architecture-doc references in the active Brunch Body mobile app.

This lane is docs-only and evidence-first. It exists to make later route-removal, route-consolidation, route-rename, and doc-reconciliation lanes safer without changing runtime behavior.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` are not present in the current repo snapshot. For this lane, the governing input is the approved scope supplied in chat. Live code is authoritative for current-state facts. Nearby approved lane docs may inform cadence and phrasing only.

Startup behavior, root-shell entry, current tab ownership, current nested-stack ownership, visible tab labels, and current route names must be preserved exactly. This artifact classifies evidence only. It does not authorize implementation cleanup.

## Classification

Ready for codex

## Scope

### In Scope

- create one docs-only audit artifact for dead-route and duplicate-route review
- inspect current route registrations across the root stack, bottom-tab shell, and current nested stacks
- inspect current route-name usage patterns in touched navigation code and representative screen call sites
- identify duplicate registrations, stale registrations, compatibility holds, residual unmounted navigation surfaces, label-versus-route-name mismatch, and stale architecture-doc mismatch
- assign each finding one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate remove`
  - `candidate consolidate`
  - `defer`
- make later cleanup lanes safer by separating current evidence from future action

### Out of Scope

- no production code changes
- no route removals
- no route renames
- no ownership moves between navigators
- no startup-rule changes
- no tab redesign
- no screen-internal behavior changes
- no privacy, disclosure, or export-policy changes
- no dependency or tooling changes
- no unrelated UX cleanup

## Files / Surfaces

Primary evidence surfaces inspected for this artifact:

- `src/bootstrap/AppBootstrap.js`
- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/CalendarNavigation.js`
- `src/navigation/JournalNavigation.js`
- `src/navigation/NutritionNavigation.js`
- `src/navigation/RecreationNavigation.js`
- `src/navigation/SettingsNavigation.js`
- `src/navigation/DashboardNavigation.js`
- `src/navigation/routeNames.js`
- `src/navigation/getRootNavigation.js`

Representative current route-usage surfaces inspected for call-site evidence:

- `src/screens/completeProfile/components/Welcome.js`
- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
- `src/screens/setting/pages/Tutorials/Tutorials.js`
- `src/screens/setting/pages/Setting/Setting.js`
- `src/screens/setting/pages/MyProfile/MyProfile.js`
- `src/screens/setting/pages/MyProfile/MyAccount.js`
- `src/screens/calendar/components/Writing.js`
- `src/screens/calendar/pages/calendar/Calendar.js`
- `src/screens/writing/components/Writing.js`
- `src/screens/journal/pages/Journal/Journal.js`
- `src/screens/journal/components/DailyEntry.js`
- `src/screens/journal/components/TraitDirectory.js`
- `src/screens/nutrition/pages/Nutrition/Nutrition.js`
- `src/screens/nutrition/pages/Meal/Meal.js`
- `src/screens/nutrition/components/MealsList.js`
- `src/screens/nutrition/components/MealDirectory.js`
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
- `docs/architecture/recreation-stack-extraction.md`
- `docs/architecture/settings-account-stack-extraction.md`
- `docs/architecture/route-naming-and-constants-cleanup.md`
- `docs/architecture/app-structure-inventory.md`

`src/navigation/routeNames.js` is present in the current inspected repo snapshot. For this lane it is an inventory helper only, not the source of truth by itself. A route is only treated as live when the current navigator wiring also registers it.

## Current State

Active code shows the current startup path as:

1. `AppBootstrap` calls `resolveInitialRouteName()`.
2. `resolveInitialRouteName()` reads local `user_profile` from AsyncStorage.
3. `resolveInitialRouteName()` returns `Home` when profile data exists and `CompleteProfile` when it does not.
4. `RootContainer` receives `initialRouteName` and passes it into `RootNavigation`.
5. `RootNavigation` mounts the active root stack with that same `initialRouteName`.

Active code also shows that the current root stack now registers only three routes:

- `CompleteProfile`
- `Home`
- `Tutorials`

That current root ownership is narrower than some older architecture docs. Live code is authoritative for this artifact.

Active code also shows that `BottomTabNavigation` still owns the same six top-level authenticated destinations:

- `Dashboard`
- `Journal`
- `Calendar`
- `Nutrition`
- `Recreation`
- `Settings`

Current tab-shell evidence also shows:

- the visible tab label for the `Dashboard` route is `Home`
- the authenticated tab shell still uses `initialRouteName="Calendar"`

The active nested stacks currently register these route sets:

- `CalendarNavigation`: `CalendarMain`, `Writing`, `Edit Writing`, `NewDay`
- `JournalNavigation`: `Journal`, `WeightLog`, `QuarterlyEntry`, `DailyEntry`, `WeeklyEntry`, `SupplementLog`, `Calories`, `TraitDirectory`
- `NutritionNavigation`: `Nutrition`, `Supplement`, `Meal`, `MealsList`, `MealDirectory`, `MealDetail`
- `RecreationNavigation`: `Recreation`, `RoutineManager`, `ProgramManager`, `EditProgram`, `EditRoutine`, `MyExercises`
- `SettingsNavigation`: `Settings`, `MyProfile`, `MyVitals`, `MyAccount`, `MyEmail`, `MyPassword`, `DeleteAccount`, `ExportToCSV`, `TermsOfUse`, `PrivacyPolicy`, `Abbrevations`

The active mounted tree therefore registers 44 current routes across seven live navigator layers. This artifact inventories them by live owner only. It does not repeat older root-route inventories that no longer match current code.

## Objective

Answer, from current code rather than older prose:

- which registered routes are still clearly live and intentional
- which surfaces appear duplicated across active navigator layers
- which registrations look stale or weakly entered
- which names appear to be compatibility holds rather than cleanup permission
- which issues should be deferred to later cleanup lanes instead of being absorbed here

## Boundary Rule for This Lane

This lane may:

- inspect current route registrations and route-name usage
- compare live code against older architecture docs
- classify findings with bounded dispositions
- recommend follow-on cleanup lanes

This lane must not:

- remove routes
- rename routes
- move route ownership
- change startup behavior
- redesign visible labels versus registered route names
- treat audit findings as automatic approval to implement cleanup in the same lane

Operational deferral rule:

- if resolving a finding would require behavior change, ownership change, or broad call-site migration, classify it as a deferred follow-on item instead of absorbing it into this audit lane

## Audit Method

- inventory current registered routes by live navigator owner
- compare those registrations against representative route call sites
- compare live ownership against nearby architecture docs where those docs still describe earlier ownership
- record only the routes, route pairs, or doc surfaces that need special handling in the findings register
- treat every active registered route not listed in the findings register as a current `keep`

## Current Route Inventory

| Owner or surface | Current registered routes or surface | Notes |
| --- | --- | --- |
| Root stack | `CompleteProfile`, `Home`, `Tutorials` | Current live root ownership only. `Home` remains the authenticated shell entry. |
| Bottom-tab shell | `Dashboard`, `Journal`, `Calendar`, `Nutrition`, `Recreation`, `Settings` | `Dashboard` is shown with visible tab label `Home`. The tab shell still initializes to `Calendar`. |
| Calendar nested stack | `CalendarMain`, `Writing`, `Edit Writing`, `NewDay` | `CalendarMain` remains the nested entry route under the `Calendar` tab. |
| Journal nested stack | `Journal`, `WeightLog`, `QuarterlyEntry`, `DailyEntry`, `WeeklyEntry`, `SupplementLog`, `Calories`, `TraitDirectory` | The tab route and nested entry route currently share the same `Journal` string. |
| Nutrition nested stack | `Nutrition`, `Supplement`, `Meal`, `MealsList`, `MealDirectory`, `MealDetail` | The tab route and nested entry route currently share the same `Nutrition` string. |
| Recreation nested stack | `Recreation`, `RoutineManager`, `ProgramManager`, `EditProgram`, `EditRoutine`, `MyExercises` | The tab route and nested entry route currently share the same `Recreation` string. |
| Settings nested stack | `Settings`, `MyProfile`, `MyVitals`, `MyAccount`, `MyEmail`, `MyPassword`, `DeleteAccount`, `ExportToCSV`, `TermsOfUse`, `PrivacyPolicy`, `Abbrevations` | The tab route and nested entry route currently share the same `Settings` string. |
| Residual unmounted navigation surface | `DashboardTabs` in `src/navigation/DashboardNavigation.js` | No active root or tab mount was found for this separate navigator file. |

## Representative Current Route Usage

| Flow or surface | Evidence from live code |
| --- | --- |
| Onboarding and tutorial entry / exit | `src/screens/completeProfile/components/Welcome.js` opens `Tutorials`. `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js` and `src/screens/setting/pages/Tutorials/Tutorials.js` both navigate through `Home` into the `Dashboard` tab. |
| Settings landing and drill-down | `src/screens/setting/pages/Setting/Setting.js` launches `MyProfile`, `ExportToCSV`, `Abbrevations`, and root-owned `Tutorials`. `src/screens/setting/pages/MyProfile/MyProfile.js` launches `MyVitals` and `MyAccount`. `src/screens/setting/pages/MyProfile/MyAccount.js` launches `MyEmail`, `MyPassword`, and `DeleteAccount`. |
| Calendar and writing flow | `src/screens/calendar/components/Writing.js` navigates to `Writing`. `src/screens/calendar/pages/calendar/Calendar.js` navigates to `NewDay`. `src/screens/writing/components/Writing.js` navigates to `Edit Writing`. |
| Journal flow | `src/screens/journal/pages/Journal/Journal.js` launches `DailyEntry`, `WeightLog`, `Calories`, `SupplementLog`, `WeeklyEntry`, and `QuarterlyEntry`. `src/screens/journal/components/DailyEntry.js` opens `TraitDirectory`. `src/screens/journal/components/TraitDirectory.js` navigates back into `DailyEntry` with a selected trait. |
| Nutrition flow | `src/screens/nutrition/pages/Nutrition/Nutrition.js` navigates to `Supplement` and `Meal`. `src/screens/nutrition/pages/Meal/Meal.js` navigates to `MealsList`. `src/screens/nutrition/components/MealsList.js` navigates to `MealDirectory`. `src/screens/nutrition/components/MealDirectory.js` navigates to `MealDetail`. |
| Recreation flow | `src/screens/recreation/pages/Recreation/Recreation.js` uses current route strings to enter `RoutineManager`, `ProgramManager`, and `MyExercises`. `src/screens/recreation/components/RoutineManager.js` navigates to `EditRoutine`. `src/screens/recreation/pages/ProgramManager/ProgramManager.js` navigates to `EditProgram`. |
| Settings legal links | `src/screens/setting/pages/Setting/Setting.js` currently uses external URLs for Terms of Use and Privacy Policy rather than navigating to `TermsOfUse` or `PrivacyPolicy`. |

## Findings Register

Routes or route groups listed below need explicit later-lane handling. Every currently mounted route with direct entry evidence and no row below remains a current `keep`.

| subject | current owner or surface | evidence | issue type | disposition | follow-on lane |
| --- | --- | --- | --- | --- | --- |
| `DashboardTabs` | Residual `DashboardNavigation.js` surface | `src/navigation/DashboardNavigation.js` defines a separate navigator with `DashboardTabs`, but the current root stack and bottom-tab shell do not mount `DashboardNavigation`, and no `src` references to `DashboardTabs` were found. | `dead-route candidate` | `candidate remove` | dead-route removal lane |
| `Journal` tab route + `Journal` nested entry route | Bottom-tab shell + `JournalNavigation` | `BottomTabNavigation` registers `Journal` as a tab destination, while `JournalNavigation` also uses `Journal` as its initial screen name and first nested registration. | `duplicate registration` | `candidate consolidate` | duplicate-route consolidation lane |
| `Nutrition` tab route + `Nutrition` nested entry route | Bottom-tab shell + `NutritionNavigation` | `BottomTabNavigation` registers `Nutrition` as a tab destination, while `NutritionNavigation` also uses `Nutrition` as its initial screen name and first nested registration. | `duplicate registration` | `candidate consolidate` | duplicate-route consolidation lane |
| `Recreation` tab route + `Recreation` nested entry route | Bottom-tab shell + `RecreationNavigation` | `BottomTabNavigation` registers `Recreation` as a tab destination, while `RecreationNavigation` also uses `Recreation` as its initial screen name and first nested registration. | `duplicate registration` | `candidate consolidate` | duplicate-route consolidation lane |
| `Settings` tab route + `Settings` nested entry route | Bottom-tab shell + `SettingsNavigation` | `BottomTabNavigation` registers `Settings` as a tab destination, while `SettingsNavigation` also uses `Settings` as its initial screen name and first nested registration. | `duplicate registration` | `candidate consolidate` | duplicate-route consolidation lane |
| `Dashboard` route name with visible `Home` tab label | Bottom-tab shell | `BottomTabNavigation` registers the tab as `Dashboard` but sets `tabBarLabel` to `Home`. Onboarding and tutorial exit flows navigate through `Home` into the `Dashboard` tab. | `label/route mismatch` | `keep for compatibility` | label-versus-route-name clarification lane |
| `Tutorials` root ownership exception | Root stack plus settings-module screens | `RootNavigation` still registers `Tutorials` directly. `Welcome.js` and `Setting.js` both enter `Tutorials`, while `Tutorials.js` exits back through `Home` into `Dashboard`. The screen still lives under the settings module. | `ownership exception` | `keep for compatibility` | root-versus-settings ownership clarification lane |
| `CalendarMain` | `CalendarNavigation` | `CalendarNavigation` still uses `CalendarMain` as its local initial route under the `Calendar` tab. This is current code-backed naming, not cleanup permission. | `compatibility hold` | `keep for compatibility` | route rename migration lane |
| `Edit Writing` | `CalendarNavigation` | `CalendarNavigation` registers `Edit Writing`, and `src/screens/writing/components/Writing.js` still navigates to that exact spaced route name. | `compatibility hold` | `keep for compatibility` | route rename migration lane |
| `NewDay` | `CalendarNavigation` | `CalendarNavigation` registers `NewDay`, and `src/screens/calendar/pages/calendar/Calendar.js` still navigates to that exact compressed route name. | `compatibility hold` | `keep for compatibility` | route rename migration lane |
| `Abbrevations` | `SettingsNavigation` | `SettingsNavigation` registers `Abbrevations`, `src/navigation/routeNames.js` preserves that spelling, and `src/screens/setting/pages/Setting/Setting.js` still navigates to the same route string. | `compatibility hold` | `keep for compatibility` | route rename migration lane |
| `TermsOfUse` + `PrivacyPolicy` | `SettingsNavigation` | `SettingsNavigation` still registers both routes, and wrapper screens still exist, but `src/screens/setting/pages/Setting/Setting.js` currently uses external links for those entries. No `src` navigation references were found beyond route registration and settings exports. | `stale registration` | `candidate remove` | dead-route removal lane |
| Older architecture docs that still describe root-owned detail routes or root-owned `Dashboard` / `Nutrition` | Repo architecture docs | `docs/architecture/navigation-tree-and-route-ownership.md`, `docs/architecture/app-structure-inventory.md`, and `docs/architecture/bottom-tab-shell-cleanup.md` still describe older root-level ownership that does not match the current three-route root stack in live code. | `stale doc mismatch` | `defer` | stale architecture-doc reconciliation lane |

## Public Interfaces

This artifact changes no public APIs, route destinations, providers, dependencies, or runtime behavior.

Preserved invariants for this lane:

- `resolveInitialRouteName()` still returns `Home` when local `user_profile` exists and `CompleteProfile` otherwise
- `Home` remains the authenticated shell entry at root
- `BottomTabNavigation` still owns the same six top-level tab routes
- the current nested stacks still own their current route sets unless a later lane explicitly changes them

## Dependencies

- the approved chat-supplied lane scope remains authoritative because `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` are not available in the current repo snapshot
- live code is authoritative for startup facts, route registrations, navigator ownership, and current route names
- nearby approved lane docs may inform cadence and phrasing only; they do not replace the governing scope for this lane
- `src/navigation/routeNames.js` may be used as an inventory helper because it is present in the current snapshot, but live navigator registration still decides whether a route is actually live
- earlier boundary and extraction lane docs remain separate context only and should not be reopened through this audit

## Acceptance Criteria

- add exactly one new docs artifact at `docs/architecture/dead-route-and-duplicate-route-audit.md`
- keep the diff docs-only
- inventory the current registered routes across the touched navigators by live owner only
- identify duplicate-route, dead-route, compatibility-hold, stale-registration, label-mismatch, ownership-exception, and stale-doc candidates using live-code evidence
- give every finding one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate remove`
  - `candidate consolidate`
  - `defer`
- preserve the current startup and ownership contracts in the framing
- clearly separate audit findings from future cleanup work
- avoid removing, renaming, or moving any routes in this lane

## Validation

- static review that startup and shell statements match `src/bootstrap/AppBootstrap.js`, `src/navigation/RootNavigation.js`, and `src/navigation/BottomTabNavigation.js`
- static review that each touched navigator's registered route set is represented accurately
- static review that each finding cites either live code or a named stale-doc source
- final diff review that the only repo change is this new audit doc
- no tests, runtime changes, config changes, or dependency changes are required for completion of this docs-only audit

## Risks / Notes

- the main risk is turning the audit into an implicit implementation lane
- another risk is confusing the root route `Home`, the visible tab label `Home`, and the registered tab route `Dashboard`
- another risk is silently normalizing code-backed names such as `CalendarMain`, `Edit Writing`, `NewDay`, or `Abbrevations` instead of recording them first as compatibility holds
- older architecture docs still preserve earlier ownership snapshots, so this artifact must call out doc drift explicitly rather than inherit it

## Follow-on Lane Seeds

- dead-route removal lane for explicitly approved `candidate remove` items
- duplicate-route consolidation lane for same-name tab-route and nested-entry pairs
- route rename migration lane for compatibility-hold names
- label-versus-route-name clarification lane for `Dashboard` versus visible `Home`
- stale architecture-doc reconciliation lane for older root-ownership prose
- navigator smoke-test lane after any approved cleanup

## Assumptions

- the original template and scope files are unavailable in the current repo snapshot, so the approved chat-supplied scope text is the governing input for this lane
- live code under `src/bootstrap` and `src/navigation` is authoritative over older architecture prose for startup facts, navigator ownership, and current route registrations
- this lane is audit and classification only, not route-cleanup implementation
