# Lane: 1.1.2.2.19 Navigation call-site drift audit

## Summary

This artifact audits representative live navigation call sites against the current mounted navigator owners and the current shared route-constant surface.

This lane is docs-only and evidence-first. It classifies representative call-site alignment, compatibility-context alignment, and remaining ambiguity without changing runtime behavior, renaming routes, moving ownership, or reopening earlier boundary decisions.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane. Live code is authoritative for startup facts, navigator ownership, route registrations, and current call-site behavior. Nearby approved lane docs may inform cadence and phrasing only.

Startup behavior, authenticated-shell entry, current root/tab/stack ownership, and current registered route names must be preserved exactly. This artifact classifies evidence only. It does not authorize implementation cleanup.

## Classification

Ready for codex

## Scope

### In Scope

- create one docs-only audit artifact for navigation call-site drift
- inspect representative navigation call sites in onboarding and each active domain flow
- compare current call-site targets against the live navigator ownership baseline
- classify each finding with one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- distinguish clearly between:
  - `current-owner aligned`
  - `current-owner aligned with compatibility context`
  - `stale owner assumption`
  - `mixed / ambiguous`
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
- `src/navigation/routeNames.js`
- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/CalendarNavigation.js`
- `src/navigation/JournalNavigation.js`
- `src/navigation/NutritionNavigation.js`
- `src/navigation/RecreationNavigation.js`
- `src/navigation/SettingsNavigation.js`

Representative call-site clusters inspected for this artifact:

- onboarding:
  - `src/screens/completeProfile/components/Welcome.js`
  - `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
- settings:
  - `src/screens/setting/pages/Setting/Setting.js`
  - `src/screens/setting/components/Setting.js`
- calendar and writing:
  - `src/screens/calendar/pages/calendar/Calendar.js`
  - `src/screens/calendar/components/Writing.js`
  - `src/screens/writing/components/Writing.js`
- journal:
  - `src/screens/journal/pages/Journal/Journal.js`
  - `src/screens/journal/components/Journal.js`
  - `src/screens/journal/components/DailyEntry.js`
  - `src/screens/journal/components/TraitDirectory.js`
- nutrition:
  - `src/screens/nutrition/pages/Nutrition/Nutrition.js`
  - `src/screens/nutrition/components/Nutrition.js`
  - `src/screens/nutrition/pages/Meal/Meal.js`
  - `src/screens/nutrition/components/MealsList.js`
  - `src/screens/nutrition/components/MealDirectory.js`
- recreation:
  - `src/screens/recreation/pages/Recreation/Recreation.js`
  - `src/screens/recreation/components/BodyPlans.js`
  - `src/screens/recreation/components/MyRoutines.js`
  - `src/screens/recreation/pages/ProgramManager/ProgramManager.js`
  - `src/screens/recreation/components/RoutineManager.js`

Companion architecture docs used as context only:

- `docs/architecture/route-constants-adoption-audit.md`
- `docs/architecture/cross-navigator-ownership-exception-audit.md`
- `docs/architecture/label-vs-route-name-audit.md`
- `docs/architecture/dead-route-and-duplicate-route-audit.md`

Live code is authoritative for this lane. Older docs and nearby lane artifacts are framing/context only.

## Current State

Active code shows the current startup and ownership contract as:

1. `resolveInitialRouteName()` in `src/bootstrap/AppBootstrap.js` reads local `user_profile` and returns `Home` when that data exists and `CompleteProfile` otherwise.
2. `src/navigation/routeNames.js` defines `ROOT_ROUTES` as `CompleteProfile`, `Home`, and `Tutorials`.
3. `RootNavigation` currently registers exactly those three root routes: `CompleteProfile`, `Home`, and `Tutorials`.
4. `Home` mounts `BottomTabNavigation` as the authenticated shell entry.
5. `BottomTabNavigation` registers the six top-level authenticated destinations: `Dashboard`, `Journal`, `Calendar`, `Nutrition`, `Recreation`, and `Settings`.
6. The mounted nested navigators currently own these route sets:
   - `CalendarNavigation`: `CalendarMain`, `Writing`, `Edit Writing`, `NewDay`
   - `JournalNavigation`: `Journal`, `WeightLog`, `QuarterlyEntry`, `DailyEntry`, `WeeklyEntry`, `SupplementLog`, `Calories`, `TraitDirectory`
   - `NutritionNavigation`: `Nutrition`, `Supplement`, `Meal`, `MealsList`, `MealDirectory`, `MealDetail`
   - `RecreationNavigation`: `Recreation`, `RoutineManager`, `ProgramManager`, `EditProgram`, `EditRoutine`, `MyExercises`
   - `SettingsNavigation`: `Settings`, `MyProfile`, `MyVitals`, `MyAccount`, `MyEmail`, `MyPassword`, `DeleteAccount`, `ExportToCSV`, `TermsOfUse`, `PrivacyPolicy`, `Abbrevations`

Representative current call-site evidence also shows:

- onboarding `Welcome.js` routes to `ROOT_ROUTES.TUTORIALS`, and onboarding completion routes through root `Home` into nested tab `Dashboard`
- settings `Setting.js` mixes `SETTINGS_ROUTES.*` destinations with the root-owned `ROOT_ROUTES.TUTORIALS` entry, while `Terms of Use`, `Privacy Policy`, and `Support & Contact` currently open external links rather than local route targets
- the journal landing defines each entry's `screen` via `JOURNAL_ROUTES.*`, and the journal modal later calls `navigation.navigate(pageDetail.screen, ...)`
- the audited calendar/writing, nutrition, and recreation clusters currently navigate through the current domain routes directly or through local `screen` state populated from those routes

These are present-state facts only. They do not by themselves authorize call-site rewrites, ownership changes, or route cleanup in this lane.

## Objective

Answer, from current code rather than older prose:

- which representative navigation call sites target the current navigator owners
- which representative call sites still depend on older ownership assumptions
- which representative call sites are already constant-backed and aligned
- which representative call sites remain mixed or ambiguous and should be deferred for a later cleanup lane

The goal is to reduce uncertainty before any later implementation lane changes call sites, consolidates ownership, or removes compatibility paths.

## Boundary Rule for This Lane

This lane may:

- inspect representative navigation call sites
- compare current call-site targets against live navigator ownership
- classify drift, ambiguity, and current-owner alignment
- recommend follow-on cleanup lanes

This lane must not:

- rewrite call sites
- rename routes
- move ownership between navigators
- change startup behavior
- redesign entry paths
- convert the audit into implementation work

Operational deferral rule:

- if resolving a drift finding would require ownership migration, route rename, behavior change, or broad call-site churn, classify it as `defer` or `candidate cleanup` rather than forcing an implementation conclusion in this lane

## Audit Method

- inventory the current navigator ownership baseline from `src/navigation/routeNames.js` and the mounted navigator files
- inspect one representative call-site cluster for onboarding, settings, calendar/writing, journal, nutrition, and recreation
- compare each representative call-site target against the current registered owner
- record one row per meaningful drift, compatibility-context alignment, or ambiguity finding
- keep obvious current-owner aligned flows out of the findings register unless they are needed as explicit evidence for a preserved exception

### Drift taxonomy

- `current-owner aligned`: the audited call site targets the current registered owner directly and does not need exception or compatibility framing
- `current-owner aligned with compatibility context`: the audited call site targets the current registered owner, but the surrounding flow still reflects a preserved exception or compatibility-shaped boundary that should stay documented
- `stale owner assumption`: the audited call site still targets a route as if it were owned by an older navigator surface rather than the current registered owner
- `mixed / ambiguous`: the audited call site currently resolves through indirect registry data, mixed target surfaces, or otherwise incomplete evidence that is not strong enough to close as fully aligned or stale

### Disposition taxonomy

- `keep`
- `keep for compatibility`
- `candidate cleanup`
- `defer`

## Findings Register

Only include a row in this register when the live evidence shows a meaningful alignment exception, drift question, or ambiguity point worth preserving for follow-on review. Clearly current-owner aligned domain-local flows stay out of the table.

| call-site cluster | current navigation target | registered owner | evidence | drift type | disposition | follow-on lane |
| --- | --- | --- | --- | --- | --- | --- |
| Onboarding `Welcome.js` | `ROOT_ROUTES.TUTORIALS` | `RootNavigation` | `src/screens/completeProfile/components/Welcome.js` calls `navigation.navigate(ROOT_ROUTES.TUTORIALS)`. `src/navigation/RootNavigation.js` registers `ROOT_ROUTES.TUTORIALS` in the current root stack. The current target is aligned, but it still participates in the preserved root-owned tutorial exception also entered from settings. | `current-owner aligned with compatibility context` | `keep for compatibility` | ownership exception clarification lane |
| Settings landing `Setting.js` | mixed `SETTINGS_ROUTES.*` plus `ROOT_ROUTES.TUTORIALS` | `SettingsNavigation` for settings routes, `RootNavigation` for `Tutorials` | `src/screens/setting/pages/Setting/Setting.js` builds its list with `SETTINGS_ROUTES.MY_PROFILE`, `SETTINGS_ROUTES.EXPORT_TO_CSV`, `SETTINGS_ROUTES.ABBREVIATIONS`, and `ROOT_ROUTES.TUTORIALS`. `src/navigation/SettingsNavigation.js` registers the settings-stack routes, and `src/navigation/RootNavigation.js` registers `Tutorials`. The current targets match the live owners, but the mixed surface depends on the preserved root-owned tutorial exception. | `current-owner aligned with compatibility context` | `keep for compatibility` | ownership exception clarification lane |
| Journal cluster | `pageDetail.screen` | journal stack | `src/screens/journal/pages/Journal/Journal.js` populates each list entry's `screen` from `JOURNAL_ROUTES.*`. `src/screens/journal/components/Journal.js` later calls `navigation.navigate(pageDetail.screen, ...)`. `src/navigation/JournalNavigation.js` owns the current journal stack route set. The source values appear current-owner aligned, but they resolve indirectly through registry data, so the evidence is not strong enough to close as a simple keep row or as stale owner targeting. | `mixed / ambiguous` | `defer` | navigator-local registry normalization lane |

Current audit did not confirm additional representative rows with equally strong live evidence of stale owner targeting or unresolved ambiguity. No audited representative cluster met the bar for a `stale owner assumption` finding in this lane.

## Related Context / Non-Findings

- the audited calendar and writing cluster currently points at `CalendarNavigation` owners: `src/screens/calendar/pages/calendar/Calendar.js` navigates to `CALENDAR_ROUTES.NEW_DAY`, `src/screens/calendar/components/Writing.js` navigates to `CALENDAR_ROUTES.WRITING`, and `src/screens/writing/components/Writing.js` navigates to `CALENDAR_ROUTES.EDIT_WRITING`
- the audited nutrition cluster currently points at `NutritionNavigation` owners: the representative `Nutrition`, `Meal`, `MealsList`, and `MealDirectory` surfaces navigate through `NUTRITION_ROUTES.*` to `Meal`, `Supplement`, `MealsList`, `MealDirectory`, and `MealDetail`
- the audited recreation cluster currently points at `RecreationNavigation` owners: `BodyPlans` and `MyRoutines` populate local `screen` state from `RECREATION_ROUTES.PROGRAM_MANAGER` and `RECREATION_ROUTES.ROUTINE_MANAGER`, `Recreation.js` navigates through that current state, and the representative manager surfaces navigate to `RECREATION_ROUTES.EDIT_PROGRAM`, `RECREATION_ROUTES.EDIT_ROUTINE`, and `RECREATION_ROUTES.MY_EXERCISES`
- `Dashboard` versus visible `Home` is a label-vs-route-name issue, not navigation call-site drift
- `CalendarMain`, `Edit Writing`, `NewDay`, `MealsList`, and `Abbrevations` are route-name compatibility holds, not call-site drift findings unless a representative call site proves stale targeting
- the audited live flow set did not show direct `navigation.navigate('LiteralRoute')` style route targets; the remaining observed root resets already target the current root owner `CompleteProfile` and do not count as drift findings
- the current settings legal and support entries use external URLs rather than local navigator targets, so they do not enter this findings register as call-site drift evidence

## Public Interfaces

This artifact changes no public APIs, route destinations, labels, providers, dependencies, or runtime behavior.

Preserved invariants for this lane:

- bootstrap still resolves `Home` versus `CompleteProfile`
- `Home` remains the authenticated shell entry
- current root, tab, and nested-stack ownership remains unchanged
- current registered route names remain unchanged in this lane

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane
- live code is authoritative for startup facts, navigator ownership, route registrations, and current call-site behavior
- nearby approved lane docs may inform cadence and phrasing only; they do not replace the governing inputs
- earlier ownership, naming, and adoption audits remain context and should not be reopened as implementation scope

## Acceptance Criteria

- exactly one new docs artifact is added at `docs/architecture/navigation-call-site-drift-audit.md`
- the artifact follows the established Brunch Body architecture-lane doc cadence used in this repo
- the artifact inventories representative call-site drift findings using live evidence
- each finding includes one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- the artifact clearly distinguishes current-owner alignment, compatibility-context alignment, stale owner assumptions, and mixed / ambiguous cases
- the artifact captures `Welcome.js` and `Setting.js` accurately as current-owner aligned with compatibility context
- the artifact keeps the journal cluster as `mixed / ambiguous` unless stronger direct evidence is found during a later approved lane
- the artifact does not rename routes, move ownership, or change startup behavior
- the artifact clearly separates audit findings from later implementation work

## Validation

- static review that startup and shell statements match live code in `src/bootstrap/AppBootstrap.js`, `src/navigation/RootNavigation.js`, `src/navigation/BottomTabNavigation.js`, and the mounted nested navigator files
- static review that each findings row is backed by both route registration evidence and representative call-site evidence
- static review that `src/screens/completeProfile/components/Welcome.js` and `src/screens/setting/pages/Setting/Setting.js` are captured accurately as current-owner aligned with compatibility context
- static review that the journal cluster remains `mixed / ambiguous` unless stronger direct evidence appears during a later approved lane
- static review that the audited calendar/writing, nutrition, and recreation clusters remain non-findings because their representative current targets align with the current registered owners
- final diff review that the only repo change is `docs/architecture/navigation-call-site-drift-audit.md`

## Risks / Notes

- the main risk is confusing route-name awkwardness with true call-site drift
- another risk is treating a preserved ownership exception as a stale owner assumption
- another risk is widening this audit into implementation work or ownership refactor work
- because the journal cluster resolves through indirect registry data, overstating that evidence as confirmed drift would be a false positive
- this lane should stay conservative and only record additional findings when the proof is at least as strong as the seeded rows

## Follow-on Lane Seeds

- navigator-local registry normalization lane
- ownership exception clarification lane
- targeted call-site cleanup lane for low-risk drift findings
- navigator-wide smoke validation after approved call-site cleanup
- cleanup decision log update

## Assumptions

- this artifact should follow the same reviewable cadence as the approved `1.1.2.2.x` lane docs while still treating `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` as the governing inputs
- live code is authoritative over older docs for startup facts, navigator ownership, route registrations, and current call-site behavior
- nearby approved lane docs may inform cadence and phrasing only; they do not replace the governing inputs
- this lane is about audit and classification only, not call-site rewrites or navigation redesign
- no extra findings should be added without evidence at least as strong as the seeded rows
