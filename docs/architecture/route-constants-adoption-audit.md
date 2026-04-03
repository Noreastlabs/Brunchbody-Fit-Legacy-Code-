# Lane: 1.1.2.2.17 Route-constants adoption audit

## Summary

This artifact audits how fully the current live navigation layer has adopted `src/navigation/routeNames.js`.

This lane is docs-only and evidence-first. It exists to separate current shared-constant adoption from navigator-local registries, local helper-key residue, and later cleanup candidates without changing runtime behavior.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane. Live code is authoritative for current-state facts. Nearby approved lane docs may inform cadence and phrasing only.

Startup behavior, authenticated-shell entry, current navigator ownership, current registered route names, and current visible labels must be preserved exactly. This artifact classifies evidence only. It does not authorize implementation cleanup.

## Classification

Ready for codex

## Scope

### In Scope

- create one docs-only audit artifact for route-constants adoption
- inspect current navigation surfaces and representative navigation call sites for:
  - use of `routeNames.js`
  - remaining literal route strings
  - navigator-local registry or constant usage
  - compatibility-hold names preserved intentionally
- classify each finding with one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- distinguish between:
  - adopted via shared constants
  - adopted via navigator-local constants or registries
  - literal string still present
  - mixed or ambiguous adoption
- seed follow-on cleanup lanes without implementing them

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

- `src/navigation/routeNames.js`
- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/CalendarNavigation.js`
- `src/navigation/JournalNavigation.js`
- `src/navigation/NutritionNavigation.js`
- `src/navigation/RecreationNavigation.js`
- `src/navigation/SettingsNavigation.js`

Representative call-site clusters inspected for seeded findings:

- onboarding: `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`, `src/screens/completeProfile/components/Welcome.js`, `src/screens/setting/pages/Tutorials/Tutorials.js`
- calendar and writing: `src/screens/calendar/pages/calendar/Calendar.js`, `src/screens/calendar/components/Writing.js`, `src/screens/writing/components/Writing.js`
- journal: `src/screens/journal/pages/Journal/Journal.js`, `src/screens/journal/components/Journal.js`, `src/screens/journal/components/DailyEntry.js`, `src/screens/journal/components/TraitDirectory.js`
- nutrition: `src/screens/nutrition/pages/Nutrition/Nutrition.js`, `src/screens/nutrition/pages/Meal/Meal.js`, `src/screens/nutrition/components/Nutrition.js`, `src/screens/nutrition/components/MealsList.js`, `src/screens/nutrition/components/MealDirectory.js`
- recreation: `src/screens/recreation/pages/Recreation/Recreation.js`, `src/screens/recreation/pages/ProgramManager/ProgramManager.js`, `src/screens/recreation/components/BodyPlans.js`, `src/screens/recreation/components/MyRoutines.js`, `src/screens/recreation/components/RoutineManager.js`
- settings: `src/screens/setting/pages/Setting/Setting.js`, `src/screens/setting/components/Setting.js`, `src/screens/setting/pages/MyProfile/MyProfile.js`, `src/screens/setting/pages/MyProfile/MyAccount.js`, `src/screens/setting/pages/MyProfile/DeleteAccount.js`

Startup invariant confirmation only:

- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`
- `src/navigation/getRootNavigation.js`

Companion context only:

- `docs/architecture/route-naming-and-constants-cleanup.md`
- `docs/architecture/compatibility-hold-route-name-audit.md`
- `docs/architecture/label-vs-route-name-audit.md`
- `src/navigation/DashboardNavigation.js`
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js`

`src/navigation/routeNames.js` is an inventory helper only. Adoption is treated as live for this artifact only when the current mounted navigator wiring or inspected representative call sites actually use the shared constant surface.

## Current State

Active code shows the current startup path as:

1. `AppBootstrap` calls `resolveInitialRouteName()`.
2. `resolveInitialRouteName()` reads local `user_profile` from AsyncStorage.
3. `resolveInitialRouteName()` returns `Home` when profile data exists and `CompleteProfile` when it does not.
4. `RootContainer` receives `initialRouteName` and passes it into `RootNavigation`.
5. `RootNavigation` mounts `BottomTabNavigation` under `Home`.

Active code also shows that all currently mounted navigator owners already import `src/navigation/routeNames.js`:

- `RootNavigation` imports `ROOT_ROUTES`
- `BottomTabNavigation` imports `AUTH_TAB_ROUTES` and `ROOT_ROUTES`
- `CalendarNavigation` imports `CALENDAR_ROUTES`
- `JournalNavigation` imports `JOURNAL_ROUTES`
- `NutritionNavigation` imports `NUTRITION_ROUTES`
- `RecreationNavigation` imports `RECREATION_ROUTES`
- `SettingsNavigation` imports `SETTINGS_ROUTES`

That means the live mounted navigator registration layer is already broadly adopted on the shared route-constants surface.

Active code also shows that `CalendarNavigation` layers a local `CALENDAR_STACK_INITIAL_ROUTE` constant and a local `CALENDAR_STACK_SCREENS` registry on top of `CALENDAR_ROUTES`. That is still constant-backed adoption, but it is mediated through a navigator-local constant and registry layer rather than direct per-screen literal reuse.

The inspected representative call-site clusters currently show:

- onboarding root and tab transitions use `ROOT_ROUTES` and `AUTH_TAB_ROUTES`
- calendar and writing call sites use `CALENDAR_ROUTES`
- nutrition call sites use `NUTRITION_ROUTES`
- recreation uses local `screen` state and registry-like setup populated from `RECREATION_ROUTES`
- settings list registries and root resets use `ROOT_ROUTES` and `SETTINGS_ROUTES`
- journal screen destinations use `JOURNAL_ROUTES`, but the journal list registry still keeps route-like helper keys such as `DailyEntry`, `WeightLog`, `SupplementLog`, `WeeklyEntry`, and `QuarterlyEntry`

Those are present-state facts only. They do not by themselves authorize route rewrites, label cleanup, ownership moves, or navigator redesign in this lane.

## Objective

Answer, from current code rather than older prose:

- which navigators already use `routeNames.js`
- which navigation surfaces still rely on navigator-local constants or registries
- which representative call sites still keep route-like literal residue
- which remaining literal strings are acceptable local exceptions versus cleanup candidates
- which findings require a later implementation lane rather than immediate action

## Boundary Rule

This lane may:

- inspect current shared constants, local registries, and literal route strings
- compare representative navigation call sites against the current route-constants surface
- classify current adoption state and remaining drift
- recommend follow-on cleanup lanes

This lane must not:

- rewrite call sites
- rename routes
- move ownership between navigators
- change startup behavior
- redesign labels or flows
- convert the audit into implementation work

Operational deferral rule:

- if replacing a literal string would require behavior change, rename migration, broad call-site churn, or unresolved ownership decisions, classify it as `defer` or `candidate cleanup` rather than forcing implementation in this lane

## Audit Method

- inventory the current shared route-constants surface in `src/navigation/routeNames.js`
- compare each mounted navigator against that shared surface
- inspect representative navigation call-site clusters in onboarding, calendar, journal, nutrition, recreation, and settings flows
- record one row per meaningful adoption finding
- separate shared-constant adoption from navigator-local registry adoption, literal-string residue, and mixed helper-key cases
- keep label mismatch and compatibility-hold naming questions in companion context unless they change the adoption reading directly

## Adoption Taxonomy

- `adopted via shared constants`: live route registration or representative navigation call sites import and use `routeNames.js` directly as the route-definition source
- `adopted via navigator-local constants/registries`: live routes still derive from `routeNames.js`, but the immediate navigation surface is a local registry, local state slot, or local initial-route constant populated from the shared constants
- `literal string still present`: a live route registration or direct navigation destination still uses a literal route string instead of `routeNames.js` or a local constant surface sourced from it
- `mixed / ambiguous`: the live surface uses shared constants for actual navigation, but still keeps route-like literal helper keys or other residue that could be confused with route definitions

## Disposition Taxonomy

- `keep`: the current adoption shape is acceptable enough to preserve as-is in this lane
- `keep for compatibility`: the current adoption shape should remain unchanged for now because it appears tied to compatibility or migration timing
- `candidate cleanup`: the current adoption shape should seed a later bounded cleanup lane, but not be changed here
- `defer`: the current adoption issue is real, but resolving it would require broader decisions or wider cleanup than this lane allows

## Findings Register

| surface | current route-definition source | evidence | adoption type | disposition | follow-on lane |
| --- | --- | --- | --- | --- | --- |
| `src/navigation/RootNavigation.js` | shared `ROOT_ROUTES` via local `ROOT_STACK_SCREENS` registry | `RootNavigation` imports `ROOT_ROUTES`, defines `ROOT_STACK_SCREENS` with `ROOT_ROUTES.COMPLETE_PROFILE`, `ROOT_ROUTES.HOME`, and `ROOT_ROUTES.TUTORIALS`, and maps that registry into live `<Stack.Screen>` registrations. `AppBootstrap` and `RootContainer` preserve the same root contract. | `adopted via shared constants` | `keep` | none |
| `src/navigation/BottomTabNavigation.js` | shared `AUTH_TAB_ROUTES` and `ROOT_ROUTES` via local `tabScreens` registry | `BottomTabNavigation` imports `AUTH_TAB_ROUTES` and `ROOT_ROUTES`, defines `tabScreens` from those constants, and maps that registry into live `<Tab.Screen>` registrations. `tabBarLabel: ROOT_ROUTES.HOME` for the `Dashboard` tab is companion label-mismatch context only, not a route-constants adoption gap. | `adopted via shared constants` | `keep` | none |
| `src/navigation/CalendarNavigation.js` | shared `CALENDAR_ROUTES` plus local `CALENDAR_STACK_INITIAL_ROUTE` and `CALENDAR_STACK_SCREENS` | `CalendarNavigation` imports `CALENDAR_ROUTES`, derives `CALENDAR_STACK_INITIAL_ROUTE = CALENDAR_ROUTES.MAIN`, builds `CALENDAR_STACK_SCREENS` from `CALENDAR_ROUTES`, and maps that local registry into live stack registrations. | `adopted via navigator-local constants/registries` | `keep` | none |
| onboarding cluster: `CompleteProfile`, `Tutorials`, and `Welcome` | shared `ROOT_ROUTES` and `AUTH_TAB_ROUTES` plus local wizard-step state strings | `CompleteProfile` navigates to `ROOT_ROUTES.HOME` with nested `AUTH_TAB_ROUTES.DASHBOARD`. `Tutorials` returns through the same constant-backed path. `Welcome` navigates to `ROOT_ROUTES.TUTORIALS` and passes `ROOT_ROUTES.HOME` as the next screen. The remaining strings such as `Name` and `DateOfBirth` are local wizard-step state, not registered navigation routes. | `mixed / ambiguous` | `keep` | none |
| calendar cluster: `Calendar`, calendar `Writing`, and writing `Writing` | shared `CALENDAR_ROUTES` in direct call sites | `Calendar.js` navigates to `CALENDAR_ROUTES.NEW_DAY`. `src/screens/calendar/components/Writing.js` navigates to `CALENDAR_ROUTES.WRITING`. `src/screens/writing/components/Writing.js` navigates to `CALENDAR_ROUTES.EDIT_WRITING`. The inspected live calendar and writing flow therefore uses shared route constants directly at the call-site layer. | `adopted via shared constants` | `keep` | none |
| journal cluster: journal page registry plus modal and helper navigation | shared `JOURNAL_ROUTES` plus local route-like helper keys in registries | `src/screens/journal/pages/Journal/Journal.js` defines `screen` destinations from `JOURNAL_ROUTES`, but also keeps route-like local `title` keys such as `DailyEntry`, `WeightLog`, `SupplementLog`, `WeeklyEntry`, and `QuarterlyEntry`. `src/screens/journal/components/Journal.js` navigates via `pageDetail.screen`, so live navigation stays constant-backed. `src/screens/journal/components/DailyEntry.js` and `src/screens/journal/components/TraitDirectory.js` also navigate with `JOURNAL_ROUTES`. This leaves mixed helper-key residue rather than direct route-literal navigation. | `mixed / ambiguous` | `defer` | navigator-local registry normalization lane |
| nutrition cluster: `Nutrition`, `Meal`, `MealsList`, and `MealDirectory` | shared `NUTRITION_ROUTES` in direct call sites | `src/screens/nutrition/pages/Nutrition/Nutrition.js`, `src/screens/nutrition/components/Nutrition.js`, `src/screens/nutrition/pages/Meal/Meal.js`, `src/screens/nutrition/components/MealsList.js`, and `src/screens/nutrition/components/MealDirectory.js` all navigate through `NUTRITION_ROUTES` for `SUPPLEMENT`, `MEAL`, `MEALS_LIST`, `MEAL_DIRECTORY`, and `MEAL_DETAIL`. | `adopted via shared constants` | `keep` | none |
| recreation cluster: `Recreation`, `BodyPlans`, `MyRoutines`, `ProgramManager`, and `RoutineManager` | local `screen` state and local registries populated from `RECREATION_ROUTES` | `BodyPlans` and `MyRoutines` set local `screen` state from `RECREATION_ROUTES.PROGRAM_MANAGER` and `RECREATION_ROUTES.ROUTINE_MANAGER`. `Recreation.js` navigates via that local `screen` state and also compares it to `RECREATION_ROUTES.ROUTINE_MANAGER` during delete flow handling. `ProgramManager` and `RoutineManager` use `RECREATION_ROUTES.EDIT_PROGRAM`, `RECREATION_ROUTES.EDIT_ROUTINE`, and `RECREATION_ROUTES.MY_EXERCISES`. | `adopted via navigator-local constants/registries` | `keep` | none |
| settings cluster: `Setting`, `MyProfile`, `MyAccount`, `DeleteAccount`, and `Tutorials` | local registries and root resets populated from `ROOT_ROUTES`, `SETTINGS_ROUTES`, and `AUTH_TAB_ROUTES` | `Setting.js` and the nested My Profile and My Account pages define local `screen` fields from `SETTINGS_ROUTES` and `ROOT_ROUTES`. `src/screens/setting/components/Setting.js` and `src/screens/setting/components/My Profile/MyProfile.js` navigate through those local registry values. `DeleteAccount` resets to `ROOT_ROUTES.COMPLETE_PROFILE`. `Tutorials` returns to `ROOT_ROUTES.HOME` with nested `AUTH_TAB_ROUTES.DASHBOARD`. | `adopted via navigator-local constants/registries` | `keep` | none |

## Related Context / Non-Findings

- No inspected live representative flow used `navigation.navigate('LiteralRoute')`. Direct route navigation in the audited onboarding, calendar, journal, nutrition, recreation, and settings call sites is already constant-backed or mediated through local state populated from shared constants.
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js` still keeps literal route-like journal entry keys such as `DailyEntry`, `WeightLog`, `SupplementLog`, `WeeklyEntry`, and `QuarterlyEntry` as export and data-selector values. Those keys are not live registered navigation destinations, so they stay out of the main findings register and only inform the journal mixed-adoption reading.
- Residual `src/navigation/DashboardNavigation.js` still contains literal `DashboardTabs`, but the current root and tab shell do not mount that navigator. For this lane it belongs to dead or unreferenced navigation follow-up, not to the live route-constants adoption register.
- `Dashboard` versus visible `Home` remains companion label-mismatch context already covered in `docs/architecture/label-vs-route-name-audit.md`. It is not a route-constants adoption gap.
- Compatibility-hold route names such as `CalendarMain`, `Edit Writing`, `NewDay`, `MealsList`, and `Abbrevations` remain companion route-name context already covered in `docs/architecture/compatibility-hold-route-name-audit.md`. Current constant-backed use of those names is not itself an adoption failure in this lane.

## Public Interfaces

This artifact changes no public APIs, route destinations, labels, providers, dependencies, or runtime behavior.

Preserved invariants for this lane:

- `resolveInitialRouteName()` still returns `Home` when local `user_profile` exists and `CompleteProfile` otherwise
- `Home` remains the authenticated shell entry
- current root, tab, and nested-stack ownership remains unchanged
- current registered route names remain unchanged in this lane
- current visible labels remain unchanged in this lane

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane
- live code is authoritative for startup facts, navigator ownership, route registrations, and route-constants adoption state
- nearby approved lane docs may inform cadence and phrasing only; they do not replace the governing inputs
- `docs/architecture/route-naming-and-constants-cleanup.md`, `docs/architecture/compatibility-hold-route-name-audit.md`, and `docs/architecture/label-vs-route-name-audit.md` remain companion context only
- earlier naming and compatibility audits remain context and should not be reopened as implementation scope

## Acceptance Criteria

- add exactly one new docs artifact at `docs/architecture/route-constants-adoption-audit.md`
- keep the diff docs-only
- inventory current route-constants adoption using live evidence
- give each finding one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- clearly distinguish shared-constant adoption, navigator-local registry adoption, literal-string residue, and mixed helper-key cases
- preserve startup behavior, route ownership, route names, and visible labels
- clearly separate audit findings from later implementation work

## Validation

- static review that the only repo change is `docs/architecture/route-constants-adoption-audit.md`
- static review that the findings table uses the exact requested columns
- static review that each seeded row is backed by live evidence from `src/navigation/routeNames.js` plus the cited navigator or representative call-site cluster
- static review that the artifact distinguishes shared-constant adoption, navigator-local registry adoption, mixed helper-key residue, and the absence of live literal-route `navigate` calls
- static review that the artifact preserves the stated bootstrap and ownership invariants and does not widen into implementation guidance

## Risks / Notes

- the main risk is treating broad current adoption as permission for repo-wide migration
- another risk is confusing compatibility-hold route names with route-constants adoption status
- another risk is widening into rename migration or navigator redesign rather than bounded audit work
- journal helper keys and export selector values are easy to overread as live route definitions; this audit keeps them as mixed-adoption evidence only
- residual `DashboardNavigation.js` is easy to overread as live literal-string drift even though the current shell wiring leaves it unmounted

## Follow-on Lane Seeds

- targeted route-constants cleanup lane for literal-string call sites with low migration risk
- navigator-local registry normalization lane
- route rename migration lane
- compatibility-hold follow-up lane
- navigator-wide smoke validation after approved constant adoption cleanup
