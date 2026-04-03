# Lane: 1.1.2.2.16 Compatibility-hold route-name audit

## Summary

This artifact audits the current navigation surface for active route names that are intentionally awkward, compatibility-preserving, or likely later rename candidates.

This lane is docs-only and evidence-first. It exists to separate current code-backed compatibility holds from true cleanup candidates without changing runtime behavior.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane. Live code is authoritative for current-state facts. Nearby approved lane docs may inform cadence and phrasing only.

Startup behavior, authenticated-shell entry, current route registrations, current tab ownership, current nested-stack ownership, and current visible labels must be preserved exactly. This artifact classifies evidence only. It does not authorize implementation cleanup.

## Classification

Ready for codex

## Scope

### In Scope

- create one docs-only audit artifact for compatibility-hold route names
- inspect current registered route names across the root stack, bottom-tab shell, and mounted nested stacks
- identify active route names that are:
  - awkward but active
  - compatibility holds
  - likely rename candidates later
  - ambiguous enough to defer
- classify each finding with one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- distinguish:
  - `code-backed route-name only`
  - `code-backed route-name with visible-label mismatch context`
  - `compatibility hold requiring later migration planning`
- keep `Dashboard` versus visible `Home` as related context only, with cross-reference to the separate label-vs-route-name audit

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

Startup invariant confirmation only:

- `src/bootstrap/AppBootstrap.js`

Representative route-entry and screen-heading evidence inspected for seeded findings:

- `src/screens/writing/components/Writing.js`
- `src/screens/writing/components/EditWriting.js`
- `src/screens/writing/components/NewDay.js`
- `src/screens/calendar/pages/calendar/Calendar.js`
- `src/screens/nutrition/pages/Meal/Meal.js`
- `src/screens/setting/pages/Setting/Setting.js`
- `src/screens/setting/components/Abbrevations/Abbrevations.js`

Current-state baseline and companion references only:

- `docs/architecture/route-naming-and-constants-cleanup.md`
- `docs/architecture/label-vs-route-name-audit.md`
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

The current route constants already preserve several awkward but active registered names:

- `CALENDAR_ROUTES.MAIN = 'CalendarMain'`
- `CALENDAR_ROUTES.EDIT_WRITING = 'Edit Writing'`
- `CALENDAR_ROUTES.NEW_DAY = 'NewDay'`
- `NUTRITION_ROUTES.MEALS_LIST = 'MealsList'`
- `SETTINGS_ROUTES.ABBREVIATIONS = 'Abbrevations'`

Those are present-state facts only. They do not by themselves authorize a route rename, label change, ownership move, or startup reinterpretation in this lane.

## Objective

Answer, from current code rather than older prose:

- which active route names are intentionally awkward compatibility holds
- which should remain unchanged for now
- which should be treated as later cleanup candidates
- which would require a true rename migration lane rather than local cleanup

## Boundary Rule

This lane may:

- inspect current registered route names
- compare live route names to their constant keys, navigator owners, and representative entry or heading context
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

- if resolving a route name would require behavior change, broad call-site migration, label redesign, or ownership change, classify it as `defer` or `candidate cleanup` rather than forcing a rename conclusion in this lane

## Audit Method

- inventory current registered routes by live navigator owner
- confirm each seeded finding is backed by both a route constant and a current navigator registration
- inspect representative navigation call sites or destination headings only when needed to understand whether the awkward route name is purely code-backed or also sits beside visible naming context
- keep `Dashboard` versus visible `Home` out of the findings register because that issue is primarily a label-vs-route-name mismatch already covered in `docs/architecture/label-vs-route-name-audit.md`
- treat active registered routes not listed in the findings register as current `keep` by omission

## Mismatch Taxonomy

- `code-backed route-name only`: the registered route name is awkward, legacy, or inconsistent in code, but this lane found no separate visible-label mismatch that should make it a primary label issue
- `code-backed route-name with visible-label mismatch context`: the registered route name is awkward in code and the current destination naming context suggests later review, but the issue is still primarily route-name drift rather than a standalone label mismatch finding for this lane
- `compatibility hold requiring later migration planning`: the current route name appears intentionally preserved because changing it would likely require coordinated migration work across registrations and call sites

## Disposition Taxonomy

- `keep`: the current route naming is acceptable enough to preserve as-is in this lane
- `keep for compatibility`: the current route name should remain unchanged for now because it appears tied to current navigation expectations or later migration work
- `candidate cleanup`: the route name should seed a later bounded cleanup or rename lane, but not be changed here
- `defer`: the route name issue is real, but current evidence is too entangled with broader naming or flow decisions to force a narrower cleanup conclusion in this lane

## Findings Register

Only active code-backed route-name findings are listed below. User-visible label mismatch findings belong in the separate label-vs-route-name audit.

| route name | constant key / owner | navigator owner | evidence | mismatch type | disposition | follow-on lane |
| --- | --- | --- | --- | --- | --- | --- |
| `CalendarMain` | `CALENDAR_ROUTES.MAIN` | `CalendarNavigation` | `src/navigation/routeNames.js` defines `CALENDAR_ROUTES.MAIN = 'CalendarMain'`. `src/navigation/CalendarNavigation.js` uses that constant as the nested stack initial route and first registered screen under the `Calendar` tab. `src/navigation/BottomTabNavigation.js` mounts `CalendarNavigation` as the live tab owner. | `compatibility hold requiring later migration planning` | `keep for compatibility` | route rename migration lane |
| `Edit Writing` | `CALENDAR_ROUTES.EDIT_WRITING` | `CalendarNavigation` | `src/navigation/routeNames.js` defines `CALENDAR_ROUTES.EDIT_WRITING = 'Edit Writing'`. `src/navigation/CalendarNavigation.js` registers that route. `src/screens/writing/components/Writing.js` actively navigates to `CALENDAR_ROUTES.EDIT_WRITING`. `src/screens/writing/components/EditWriting.js` renders a dynamic destination heading of `{currentTheme?.name || 'Writing'} Day`, so the awkward registered name sits beside visible naming context without creating a clean standalone label mismatch finding for this lane. | `code-backed route-name with visible-label mismatch context` | `defer` | route rename migration lane |
| `NewDay` | `CALENDAR_ROUTES.NEW_DAY` | `CalendarNavigation` | `src/navigation/routeNames.js` defines `CALENDAR_ROUTES.NEW_DAY = 'NewDay'`. `src/navigation/CalendarNavigation.js` registers that route. `src/screens/calendar/pages/calendar/Calendar.js` actively navigates to `CALENDAR_ROUTES.NEW_DAY`. `src/screens/writing/components/NewDay.js` renders a dynamic destination heading of `{theme.name} Day`, so the compressed route name sits beside visible naming context without becoming a primary label-mismatch finding here. | `code-backed route-name with visible-label mismatch context` | `defer` | route rename migration lane |
| `MealsList` | `NUTRITION_ROUTES.MEALS_LIST` | `NutritionNavigation` | `src/navigation/routeNames.js` defines `NUTRITION_ROUTES.MEALS_LIST = 'MealsList'`. `src/navigation/NutritionNavigation.js` registers that route. `src/screens/nutrition/pages/Meal/Meal.js` actively navigates to `NUTRITION_ROUTES.MEALS_LIST` from the meal flow. Current inspected screen evidence does not show a separate visible-label mismatch that would move this out of route-name drift. | `code-backed route-name only` | `candidate cleanup` | route rename migration lane |
| `Abbrevations` | `SETTINGS_ROUTES.ABBREVIATIONS` | `SettingsNavigation` | `src/navigation/routeNames.js` defines `SETTINGS_ROUTES.ABBREVIATIONS = 'Abbrevations'`. `src/navigation/SettingsNavigation.js` registers that route. `src/screens/setting/pages/Setting/Setting.js` exposes the Settings entry as `Abbrevations` and points it to `SETTINGS_ROUTES.ABBREVIATIONS`. `src/screens/setting/components/Abbrevations/Abbrevations.js` renders the same misspelled heading. Current evidence shows live spelling drift carried through code and copy, so any eventual fix should be coordinated rather than implied here. | `code-backed route-name only` | `candidate cleanup` | route rename migration lane with coordinated copy correction |

## Related Context / Non-Findings

- `Dashboard` versus visible `Home` is intentionally excluded from the findings register for this lane. That issue is primarily a user-visible label mismatch and is already documented in `docs/architecture/label-vs-route-name-audit.md`.
- `Writing`, `DailyEntry`, `WeightLog`, `SupplementLog`, and similar routes are not findings here when the current issue is only code-style formatting such as camel case versus spacing.
- Same-name tab-route and nested-entry pairs such as `Journal`, `Nutrition`, `Recreation`, and `Settings` remain separate context already covered by the dead-route and duplicate-route audit. They are not compatibility-hold route-name findings for this lane.
- `CalendarMain`, `Edit Writing`, `NewDay`, `MealsList`, and `Abbrevations` are the seeded live-code rows for this artifact because each one reflects material naming drift that is still active in current code.

## Public Interfaces

This artifact changes no public APIs, route destinations, providers, dependencies, or runtime behavior.

Preserved invariants for this lane:

- `resolveInitialRouteName()` still returns `Home` when local `user_profile` exists and `CompleteProfile` otherwise
- `Home` remains the authenticated shell entry at root
- `BottomTabNavigation` still owns the same six top-level tab routes
- current root, tab, and nested-stack ownership remains unchanged
- current registered route names remain unchanged in this lane

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane
- live code is authoritative for startup facts, navigator ownership, route registrations, and current route names
- nearby approved lane docs may inform cadence and phrasing only; they do not replace the governing inputs
- `docs/architecture/label-vs-route-name-audit.md` remains the authoritative companion artifact for true visible-label mismatch findings
- earlier route-naming and dead-route audits remain context and should not be reopened as implementation scope

## Acceptance Criteria

- add exactly one new docs artifact at `docs/architecture/compatibility-hold-route-name-audit.md`
- keep the diff docs-only
- inventory current compatibility-hold route-name candidates using live evidence
- give each finding one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- clearly distinguish code-backed compatibility holds from true visible-label mismatches
- seed the findings register with `CalendarMain`, `Edit Writing`, `NewDay`, `MealsList`, and `Abbrevations`
- keep `Dashboard` versus visible `Home` in related context only, with cross-link to the label-vs-route-name audit
- preserve startup behavior, route ownership, route names, and visible labels
- clearly separate audit findings from later implementation work

## Validation

- static review that startup and shell statements match `src/bootstrap/AppBootstrap.js`, `src/navigation/RootNavigation.js`, and `src/navigation/BottomTabNavigation.js`
- static review that each seeded row is backed by a constant definition, a live navigator registration, and the cited supporting evidence
- static review that the mismatch taxonomy and disposition taxonomy use the exact requested labels
- static review that the findings register excludes `Dashboard` versus visible `Home` and instead cross-links that issue to `docs/architecture/label-vs-route-name-audit.md`
- static review that the artifact distinguishes route-name drift from user-visible label mismatch
- final diff review that the only repo change is `docs/architecture/compatibility-hold-route-name-audit.md`

## Risks / Notes

- the main risk is confusing code-backed naming drift with true visible-label mismatch
- another risk is treating an awkward active route name as permission to rename it immediately
- another risk is widening into route migration work rather than keeping this lane bounded and reviewable
- dynamic headings in the writing flow make `Edit Writing` and `NewDay` easy to overread as label mismatches; for this lane they remain route-name findings with deferred follow-on decisions
- `Abbrevations` is especially likely to invite an immediate typo fix, but current live code shows that route name, entry label, and screen heading all move together and should be documented before any migration work

## Follow-on Lane Seeds

- route rename migration lane for explicitly approved compatibility-hold and candidate-cleanup route names
- compatibility-hold reconciliation pass after rename-migration decisions are approved
- stale architecture-doc reconciliation update if later rename planning changes the canonical route inventory
- navigator smoke validation for any future approved route rename lane
