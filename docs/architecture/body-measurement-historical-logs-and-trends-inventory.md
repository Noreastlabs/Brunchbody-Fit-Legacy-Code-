# Lane: 1.3.4.2.1 Historical Logs And Trends Inventory

## Status And Scope

This is the internal architecture artifact for `Lane 1.3.4.2.1 Historical Logs And Trends Inventory`.

This lane is docs-only and inventory-only. It records current Weight Log historical-entry/edit behavior, current dashboard day/week/month/year trend surfaces, current canonical kilogram versus legacy pound source rules, current body-unit display boundaries, focused test coverage, and consumer risks for later `1.3.4.2` implementation lanes.

What changed: one internal architecture artifact only, `docs/architecture/body-measurement-historical-logs-and-trends-inventory.md`.

What users experience: no app behavior change.

Public APIs, interfaces, and types changed: none.

This lane does not implement Weight Log history display changes, dashboard trend changes, chart redesign, trend insights, coaching, analytics, goals, habits, streaks, reminders, storage migration, lazy repair, schema versioning, startup migration, export/import/backup changes, profile/auth changes, public docs changes, privacy/disclosure changes, route/navigation changes, package changes, lockfile changes, CI changes, source changes, or test changes.

## Evidence Method

Current source and focused tests define current behavior. Older architecture artifacts are context only where they conflict with current source or focused tests.

Primary source surfaces inspected:

- `src/screens/journal/pages/WeightLog/WeightLog.js`
- `src/screens/journal/components/WeightLog.js`
- `src/screens/dashboard/readModel.js`
- `src/screens/dashboard/components/Carousel.js`
- `src/screens/dashboard/components/Weight.js`
- `src/screens/dashboard/components/Day.js`
- `src/screens/dashboard/components/Week.js`
- `src/screens/dashboard/components/Month.js`
- `src/screens/dashboard/components/Year.js`
- `src/utils/bodyMeasurementUnits.js`

Primary focused tests inspected:

- `__tests__/journalFormUxBoundary.test.js`
- `__tests__/dashboardReadModelBoundary.test.js`
- `__tests__/dashboardWeightBoundary.test.js`
- `__tests__/bodyMeasurementUnits.test.js`

Architecture context inspected:

- `docs/architecture/body-measurement-weight-log-migration-candidate-inventory.md`
- `docs/architecture/body-measurement-weight-log-lazy-repair-implementation-scope.md`
- `docs/architecture/body-measurement-dashboard-calculation-consumer-migration-risk-audit.md`
- `docs/architecture/body-measurement-export-unit-semantics.md`
- `docs/architecture/measurement-system-final-regression-closeout.md`

Evidence search used for this lane:

```sh
rg -n "WeightLog|weightKilograms|bodyUnitPreference|buildDashboardReadModel|CarouselCards|Weight \\(" src/screens/journal src/screens/dashboard src/utils __tests__ docs/architecture
```

## Current Weight Log History Surfaces

The Weight Log create/edit surface is owned by `src/screens/journal/pages/WeightLog/WeightLog.js` and rendered through `src/screens/journal/components/WeightLog.js`. The page receives optional historical entry data through `route.params.entryData` and optional edit identity through `route.params.entryId`. Saving with an `entryId` dispatches `editJournalEntry`; saving without an `entryId` dispatches `addJournalEntry`.

The visible form includes an entry date/name field, a weight input, a note input, a save action, and a clear-entry confirmation. Entry name is derived from the entry date when present and is rendered non-editable. The clear action resets local form state only unless the user later saves changed data.

Displayed weight input when revisiting an existing entry depends on `user.bodyUnitPreference` after fallback through the page's local resolver. Missing or unsupported profile preference resolves to standard/pounds display. Metric preference uses kilogram display and a decimal keyboard; standard fallback uses pounds display and a number keyboard.

Current displayed-value selection:

- If a valid `WeightLog.weightKilograms` is present, the revisited entry display prefers it.
- For standard users, valid canonical kilograms are converted to pounds and shown with one decimal place.
- For metric users, valid canonical kilograms are shown as kilograms with one decimal place.
- If canonical kilograms are missing, historical legacy `WeightLog.weight` remains the necessary fallback. Metric display can convert legacy pounds through `getBodyWeightKilograms`; standard display can show the legacy pound string.
- If a canonical field is present but invalid, the form does not treat it as valid canonical data. The current standard display can still show legacy text, but save validation blocks an unedited invalid-present canonical value.

Current save payload behavior:

- `WeightLog.weight` is written as the legacy/source pounds value.
- `WeightLog.weightKilograms` is written as canonical kilogram context where the input or existing entry can be validated.
- Edited standard input writes the entered pounds as `WeightLog.weight` and derives `weightKilograms`.
- Edited metric input writes deterministic converted pounds as `WeightLog.weight` and writes the entered kilograms as `weightKilograms`.
- Unedited entries preserve an existing valid canonical kilogram value and preserve an existing legacy source value, including conflicting legacy source text.
- Unedited legacy-only entries can derive canonical kg from valid legacy pounds during save.
- Unedited invalid-present canonical entries block save instead of silently overwriting canonical kg from legacy pounds.
- `enteredWeightValue` and `enteredWeightUnit` are written only when the weight was edited, or preserved only when both provenance fields already exist on an unedited entry.
- `enteredWeightValue` and `enteredWeightUnit` are display/input provenance fields, not canonical source-of-truth fields.
- `note` is ordinary journal note content and is included in the Weight Log payload.
- `isDeleted: false` is written in the save payload and remains a journal lifecycle/filter marker, not a body-measurement source field.
- `bodyUnitPreference` is not written into the `WeightLog` payload.
- After a successful journal save, the page dispatches `profile({weight, weightKilograms})`; profile update failure does not undo the successful journal-save flow.

The presentational Weight Log component does not own source selection. It renders the label, placeholder, keyboard type, weight value, note value, validation text, and modal state supplied by the page.

## Current Dashboard Trend Surfaces

`buildDashboardReadModel` in `src/screens/dashboard/readModel.js` builds the current dashboard trend read model from `state.journal?.allJournalEntriesList || []`. The dashboard page passes the read model into the dashboard component tree, where the selected top tab chooses day, week, month, or year display.

The read model returns four datasets:

- `day`
- `week`
- `month`
- `year`

Each period contains three seven-point arrays:

- `weightData`
- `outlookData`
- `calDiffData`

Day behavior sorts entries by descending `createdOn`, takes up to seven entries, and pushes `WeightLog`, `DailyEntry.feelingRate`, and `CaloriesEntry.caloriesDifferential` values into the three arrays. If fewer than seven source entries exist, the arrays are padded with `0`.

Week, month, and year behavior uses the same seven-point output length but aggregates entries by period key. Current weight values are divided by `7` for week, by days in the current month for month, and by `365.24` for year. Outlook and calorie differential use matching period aggregation and divisor behavior for their own data sources.

Dashboard weight read-model behavior emits pound-based chart values:

- valid `WeightLog.weightKilograms` is preferred;
- valid canonical kilograms are converted to pounds and rounded for chart data;
- if canonical kilograms are missing or invalid for the read model, legacy `WeightLog.weight` remains the compatibility fallback;
- absent legacy weight falls back to `'0'` in the daily source path, and aggregate parsing then contributes `0`-like values where applicable.

`Day`, `Week`, `Month`, and `Year` each reverse the read-model arrays before passing them to `CarouselCards`. `Day` passes computed weekday labels, `Week` passes fixed labels `W7` through `W1`, `Month` passes computed month labels, and `Year` passes computed year labels. `CarouselCards` reverses the label array again inside each chart data object.

`CarouselCards` builds three current trend cards:

- Outlook
- Weight
- Calorie Differential

The Weight card is the only one that applies body-unit display conversion. Carousel resolves `user.bodyUnitPreference` with standard fallback, converts pound read-model values to kilograms only for metric display, and labels the legend as `Weight (kg)` for metric or `Weight (lbs)` for standard fallback. Unsupported or missing preference uses pounds values and `Weight (lbs)`.

Outlook and Calorie Differential cards pass through their read-model data without body-unit conversion. Their legends are `Outlook` and `Calorie Differential`.

The chart components (`Weight`, `Outlook`, and `Calorie`) share the same current chart assumptions: each renders a `LineChart` with the supplied chart data, common chart config, two horizontal segments, no vertical lines, and no empty-state redesign in this lane. Current zero padding is part of the chart input contract; this inventory does not reinterpret zeros as insights, coaching, goals, habits, or recommendations.

## Current Source-Of-Truth Rules

Current source-of-truth behavior is recorded here without changing it:

- Valid `WeightLog.weightKilograms` is canonical where present.
- Legacy `WeightLog.weight` remains the compatibility/source pounds field.
- Legacy fallback remains necessary for historical entries that do not have canonical kilograms.
- `enteredWeightValue` and `enteredWeightUnit` are display/input provenance fields, not canonical source-of-truth fields.
- `bodyUnitPreference` controls current display/input interpretation boundaries; it is not a Weight Log canonical measurement value and is not persisted into the `WeightLog` payload.
- `note` is ordinary journal content and not a body-measurement source field.
- `isDeleted` is a journal lifecycle/filter marker and not a body-measurement source field.
- Invalid canonical values must not be silently treated as valid canonical values.
- Missing canonical values are not valid canonical values; current compatibility paths may derive or fall back from legacy pounds only where current source/tests already do so.
- This lane does not change source-of-truth behavior, source precedence, fallback behavior, invalid-value behavior, or persistence behavior.

## Current Body-Unit Display Boundaries

Current body-unit behavior crosses persistence, read-model aggregation, chart display conversion, and visible labels. These boundaries are distinct.

| Boundary | Current Behavior | Unit Role |
| --- | --- | --- |
| Persisted source field | `WeightLog.weight` remains stored legacy/source pounds. | Source/compatibility pounds. |
| Persisted canonical field | `WeightLog.weightKilograms` stores canonical kg where valid/present. | Canonical kilograms. |
| Input provenance fields | `enteredWeightValue` and `enteredWeightUnit` preserve or record edit context. | Display/input context only. |
| Profile preference | `user.bodyUnitPreference` resolves display/input preference with standard fallback. | Preference/control, not a measurement. |
| Read-model aggregation | `buildDashboardReadModel` emits weight chart data in pound-based values after canonical-first selection. | Aggregation values remain pounds for dashboard chart input. |
| Chart display conversion | `CarouselCards` converts pound read-model values to kg only for metric users. | Display-only conversion. |
| User-visible label | Weight Log input labels use `kg` or `lbs`; dashboard legend uses `Weight (kg)` or `Weight (lbs)`. | Label/display context. |

This inventory does not collapse these boundaries. Persisted source/canonical fields, read-model aggregation values, chart display conversion, and visible labels remain separate current concerns.

## Current Test Coverage

Existing focused tests cover the current behavior relevant to this inventory. No tests are added or changed in this lane.

`__tests__/journalFormUxBoundary.test.js` covers Weight Log form behavior including required-weight validation, guarded save/profile update behavior, standard fallback for unsupported body units, metric display for legacy pound entries, canonical kg display precedence, preservation of conflicting legacy source for unedited canonical entries, legacy-only canonical backfill on save, edited metric save payload shape, provenance field preservation, invalid metric input blocking, invalid-present canonical blocking, and malformed legacy-source blocking.

`__tests__/dashboardReadModelBoundary.test.js` covers the current dashboard read-model output contract, seven-point array lengths, canonical kg preference over legacy pounds, legacy pound fallback when canonical kg is invalid, non-mutation of source journal entries, and the journal reducer boundary that leaves dashboard aggregate ownership out of the journal reducer.

`__tests__/dashboardWeightBoundary.test.js` covers Carousel weight display behavior for missing preference, unsupported preference, standard preference, and metric preference. It verifies pounds labels/value pass-through for standard fallback and kilogram labels/converted values for metric display.

`__tests__/bodyMeasurementUnits.test.js` covers body-unit preference validation/fallback, pounds/kilograms conversion, parsing weight into canonical kilograms by explicit preference, canonical weight selection before legacy compatibility weight, weight formatting, and invalid weight handling.

No Jest run is required for this lane because the lane is docs-only and changes no source or test files.

## Consumer Risk Notes

These are risk notes for future implementation lanes only. They do not authorize implementation in this lane.

- Weight Log history display consumers can drift if a future lane treats `enteredWeightValue` or `enteredWeightUnit` as canonical rather than provenance.
- Weight Log edit consumers can drift if a future lane overwrites valid canonical kg, drops legacy `WeightLog.weight`, or silently resolves canonical/source conflicts.
- Dashboard trend consumers can drift if a future lane changes read-model values from pound-based chart inputs to display-unit values without updating Carousel and focused tests.
- Dashboard chart labels can drift if conversion and legend labeling are split inconsistently between read model and Carousel.
- Invalid, blank, zero, negative, non-finite, malformed, missing, or conflicting historical values need explicit future handling before any trend empty-state or invalid-state hardening.
- Current zero padding supports chart shape stability but can be mistaken for meaningful trend data. This inventory records that risk without adding insights, coaching, analytics, or redesign.
- Profile update after Weight Log save is adjacent and consumer-visible in later behavior, but this inventory does not change profile/auth behavior.
- Export/import/backup/delete/privacy semantics are adjacent only as downstream risk surfaces; this lane does not change or claim any of them.

## Future Implementation Readiness Notes

Likely follow-on lanes are future candidates only:

- `1.3.4.2.2 Weight Log History Display Contract`
- `1.3.4.2.3 Dashboard Trend Unit Contract`
- `1.3.4.2.4 Historical Trend Empty / Invalid State Hardening`
- `1.3.4.2.5 Historical Logs And Trends Closeout`

This lane does not provide implementation instructions for those candidates. Before any later implementation lane changes behavior, that lane should restate its own scope, current source evidence, source-of-truth rules, display boundaries, focused tests, invalid-state expectations, and non-goals.

This inventory does not make broader progress-view expansion ready. Trend insights, coaching, analytics, habit expansion, goals, streaks, reminders, and `1.6` feature expansion remain outside this lane.

## Acceptance Notes

Acceptance for this lane is:

- Exactly one new artifact is created: `docs/architecture/body-measurement-historical-logs-and-trends-inventory.md`.
- The artifact is clearly marked docs-only and inventory-only.
- The artifact maps current Weight Log history/edit surfaces.
- The artifact maps dashboard trend/chart surfaces.
- The artifact records canonical kg versus legacy pounds behavior without changing it.
- The artifact records body-unit display boundaries without changing them.
- The artifact identifies existing focused tests.
- The artifact identifies future implementation candidates without authorizing them.
- The artifact explicitly states no app behavior changed.
- No app source files are changed.
- No tests are changed.
- No package files, lockfiles, CI, routes, navigation, public docs, privacy/disclosure files, support copy, or release files are changed.
- `git diff --check` passes.
- `git status --short --untracked-files=all` truthfully shows only this new artifact plus any pre-existing unrelated working-tree changes.

Suggested validation for this lane:

```sh
rg -n "WeightLog|weightKilograms|bodyUnitPreference|buildDashboardReadModel|CarouselCards|Weight \\(" src/screens/journal src/screens/dashboard src/utils __tests__ docs/architecture
git diff --check
git status --short --untracked-files=all
```

No Jest run is required because this lane is docs-only and must not change source or tests.

## Non-Claims

This lane does not claim:

- app behavior changed;
- source files changed;
- tests changed;
- Weight Log history display changes were implemented;
- dashboard trend behavior changed;
- chart design changed;
- chart empty states changed;
- trend insights, coaching, analytics, goals, habits, streaks, reminders, or `1.6` expansion were added;
- canonical/source conflict policy changed;
- legacy `WeightLog.weight` can be removed;
- `enteredWeightValue` or `enteredWeightUnit` became canonical source-of-truth fields;
- storage migration, lazy repair, schema versioning, or startup migration was implemented;
- export, import, backup, restore, delete, privacy, disclosure, public docs, support copy, release, route, navigation, package, lockfile, or CI behavior changed;
- this lane completes `1.3.4.2` overall.
