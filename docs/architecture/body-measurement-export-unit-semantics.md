# Body Measurement Export Unit Semantics

## Status And Scope

This is an internal architecture and scope artifact for `Lane 1.3.1.1.14 Export Unit Semantics Scope`.

This lane defines the future selected-journal export contract for body-measurement units after the unit-system work. It does not change export output.

What changed: one internal architecture artifact only.

What users experience: no user-facing change.

This lane does not change app source, tests, export output, selected-journal `.xlsx` columns, workbook rows, payload behavior, storage, migrations, UI, dashboard behavior, Weight Log behavior, Profile or onboarding behavior, BMI/BMR behavior, calorie-burn behavior, package files, lockfiles, CI, routes, navigation, public docs, privacy text, disclosure text, release notes, import behavior, restore behavior, backup behavior, sync behavior, account behavior, cloud behavior, or portability behavior.

## Evidence Method

This artifact is evidence-first. Current source and tests define the current behavior; future semantics in this document define the intended contract for a later implementation lane.

Evidence inspected for this lane:

- `src/screens/setting/pages/Export To CSV/ExportToCSV.js`
- `src/screens/setting/components/Export To CSV/ExportToCSV.js`
- `src/screens/journal/pages/WeightLog/WeightLog.js`
- `src/screens/journal/components/WeightLog.js`
- `src/screens/dashboard/components/Carousel.js`
- `src/screens/dashboard/readModel.js`
- `src/utils/bodyMeasurementUnits.js`
- `__tests__/exportTransparencyCopy.test.js`
- `__tests__/journalFormUxBoundary.test.js`
- `__tests__/dashboardWeightBoundary.test.js`
- `__tests__/dashboardReadModelBoundary.test.js`
- `__tests__/bodyMeasurementUnits.test.js`
- `docs/architecture/unit-system-evidence-audit-and-model-contract.md`
- `docs/architecture/data-export-and-portability-controls.md`

Required evidence search run for this lane:

```sh
rg -n "ExportToCSV|xlsx|WeightLog|CaloriesEntry|weight|bodyUnitPreference|weightKilograms|heightCentimeters|formatWeight|poundsToKilograms" src __tests__
```

## Current Selected-Journal Export Behavior

The current selected-journal export surface offers an Excel workbook export for one selected journal entry type at a time. The selectable entry types include `DailyEntry`, `WeightLog`, `CaloriesEntry`, `SupplementLog`, `WeeklyEntry`, and `QuarterlyEntry`.

When a user selects an entry type, `src/screens/setting/pages/Export To CSV/ExportToCSV.js` scans `journalEntriesList`, sorts entries by `createdOn` descending, and builds each export row as:

```js
{
  Dated: moment(item.createdOn).format('M/D/YYYY'),
  ...item[name],
}
```

The current export then passes `entryData` directly to `XLSX.utils.json_to_sheet(entryData)`, appends the sheet to a workbook, writes with `bookType: 'xlsx'`, and saves an `.xlsx` file named with the selected entry type and current time.

For Weight Log exports, the current exported row therefore includes the stored `WeightLog` payload fields as raw columns. Today, `WeightLog.weight` exports as `weight` with no explicit unit column or unit-bearing field name.

The current user-facing export copy describes selected journal entries as an Excel workbook (`.xlsx`) and frames exported files as user-managed copies after export. Current tests cover that copy boundary and do not assert any import, restore, backup, sync, account, cloud, or portability behavior.

## Current Body-Measurement Export Risks

Current selected-journal export can place a body-measurement value in a workbook without unit context. A `weight` column alone does not tell the reader whether the value is pounds, kilograms, a displayed value, a stored source value, or a canonical value.

Weight Log now has unit-aware display behavior in the app, but export still spreads the stored journal payload. For metric users, the app can display or accept kilograms while the stored `WeightLog.weight` value remains a legacy pound value. Exporting only raw `weight` can therefore become misleading once users reasonably expect their body-measurement preference to affect visible values.

The main risks are:

- a future export leaves body measurements unlabeled;
- a metric user reads legacy stored pounds as kilograms;
- a consumer cannot distinguish source, display, and canonical metric values;
- export field naming accidentally implies import, restore, backup, sync, account continuity, cloud storage, or guaranteed portability;
- unrelated fields such as calories, notes, dates, supplement fields, BMI, or BMR get relabeled as body-measurement unit fields.

## Approved Export Unit Principles

Future selected-journal exports must not contain unlabeled body measurements. A body-measurement value must either have an adjacent explicit unit field or be represented through a field name that encodes the semantic role and unit context clearly enough to avoid ambiguity.

Future exports must distinguish these concepts when they are present:

| Concept | Meaning |
| --- | --- |
| Legacy/source value | Stored Weight Log value, interpreted as pounds. |
| Display value | Value shown according to `bodyUnitPreference`. |
| Canonical value | Metric value derived for unit clarity. |
| Unit label | Explicit unit accompanying each body-measurement value. |

Selected-journal export remains a user-managed export copy. Clearer units do not make export a full backup, restore, import, sync, account-continuity, cross-device-continuity, cloud-storage, or guaranteed-portability system.

Display preference controls display values only. It must not rewrite stored journal values during export.

Canonical metric values are invariant export context. When included, canonical weight values must be kilogram equivalents and must be labeled `kg`.

## Body-Measurement Field Classification

| Category | Examples | Required handling |
| --- | --- | --- |
| Body measurement | `WeightLog.weight` | Explicit units required. |
| Legacy/source body value | Stored Weight Log value | Label as source/legacy and label unit as `lb`. |
| Display body value | Preference-based Weight Log display value | Label as display value and include display unit. |
| Canonical body value | Kilogram equivalent of Weight Log source value | Label as canonical value and label unit as `kg`. |
| Derived calculation | BMI, BMR, calorie outputs if present | Classify separately; do not treat as canonical body measurements. |
| Non-body journal field | Dates, notes, names, feelings, supplement fields, nutrition fields | No body-unit relabeling. |
| Export metadata/copy | Generated file context, success copy, selected entry type | Preserve selected-export and user-managed-copy posture. |

Weight Log weight is a body measurement. BMI and BMR are derived calculation values, not canonical body measurements. Calories entries may be calculation outputs or journal values, but they are not body-measurement unit-system fields.

## Weight Log Export Semantics

Current Weight Log storage writes `WeightLog.weight` as the legacy source value. In current unit-aware Weight Log behavior:

- missing or unsupported `bodyUnitPreference` falls back to standard display;
- standard display uses pounds;
- metric display converts legacy pounds to kilograms for display;
- edited metric input is converted back to a deterministic legacy pound payload before storage;
- the stored journal entry remains `WeightLog.weight`.

Future selected-journal export should preserve that storage meaning. Export may add display and canonical context, but it must not mutate the journal entry, rewrite stored Weight Log values, or silently replace the legacy source value with a displayed or canonical value.

For future Weight Log export rows, the stored source value should remain identifiable as legacy pounds even if additional display or canonical fields are added.

## Displayed Value Semantics

Displayed export values represent what a user would expect to see under the active body-measurement preference. They are preference-controlled context fields, not storage fields.

Future display semantics:

| Preference | Display value | Display unit | Legacy/source value | Canonical value |
| --- | --- | --- | --- | --- |
| missing | Pounds | `lb` | Stored pounds | Kilogram equivalent |
| unsupported | Pounds | `lb` | Stored pounds | Kilogram equivalent |
| `standard` | Pounds | `lb` | Stored pounds | Kilogram equivalent |
| `metric` | Kilograms | `kg` | Stored pounds | Kilogram equivalent |

The future implementation lane should use the same preference fallback posture as current unit-aware app surfaces: missing or unsupported preferences resolve to standard/pounds display context.

Rounding and invalid-value display details should be finalized in the implementation lane. Regardless of those details, any exported display body-measurement value must carry explicit unit context.

## Legacy Source Value Semantics

The legacy/source value is the stored Weight Log value. For Weight Log, the source value is interpreted as pounds.

Future export rules:

- the source value must be labeled as a source or legacy value;
- the source unit must be explicit and should be `lb`;
- source fields must not be controlled by `bodyUnitPreference`;
- export must not convert and overwrite source fields in place;
- export must not mutate `WeightLog.weight` or any stored journal entry.

If the existing raw `weight` field is preserved for initial backward compatibility, it must be accompanied by explicit unit/context fields so the workbook is no longer ambiguous. Preserving the raw field must not be used as the only unit context.

## Canonical Metric Value Semantics

The canonical metric weight value is the kilogram equivalent of the legacy/source pound value. It is invariant context and should not change based on `bodyUnitPreference`.

Future export rules:

- canonical weight value unit must be `kg`;
- canonical weight value should be derived from the stored legacy/source pound value;
- canonical value fields must not be used to imply a storage migration;
- canonical value fields must not imply import, restore, backup, sync, account continuity, cloud storage, or guaranteed portability;
- exact rounding and invalid/unparseable value handling should be finalized in the implementation lane.

If a source weight cannot be parsed or converted, the future implementation must still avoid ambiguity. The source value should remain labeled with `lb`, and the implementation lane should define whether the canonical value is blank, null, omitted, or accompanied by a non-converted marker.

## Unit Label Requirements

Future selected-journal exports must use explicit unit context for every exported body-measurement value.

Accepted patterns:

- paired value and unit fields, such as `weight_display_value` and `weight_display_unit`;
- source/display/canonical field groups, such as `weight_source_value`, `weight_source_unit`, `weight_canonical_value`, and `weight_canonical_unit`;
- explicitly unit-bearing field names where ambiguity is impossible, such as `weight_legacy_pounds` or `weight_canonical_kg`.

Rejected patterns:

- bare body-measurement columns such as `weight` without adjacent context;
- relying on workbook name, sheet name, selected entry type, UI label, or app preference alone as unit context;
- relabeling unrelated fields as standard or metric body measurements;
- using display preference to rewrite the stored source value.

Recommended export labels for weight are `lb` and `kg`. Current UI may use `lbs`, but future export schema should prefer concise unit labels that can be tested consistently.

## Unsupported Or Missing Preference Rules

Future export must treat missing or unsupported `bodyUnitPreference` as standard display context.

| Preference state | Future display value | Future display unit | Source value | Source unit | Canonical unit |
| --- | --- | --- | --- | --- | --- |
| Missing | Stored pounds | `lb` | Stored pounds | `lb` | `kg` |
| Unsupported | Stored pounds | `lb` | Stored pounds | `lb` | `kg` |
| `standard` | Stored pounds | `lb` | Stored pounds | `lb` | `kg` |
| `metric` | Kilogram equivalent | `kg` | Stored pounds | `lb` | `kg` |

Unsupported preferences must not create mixed or inferred body-measurement states in export output.

## Non-Body-Measurement Fields

Selected-journal export contains fields that are not controlled by body-measurement preference. Future export implementation must leave those semantics alone unless a separate lane explicitly changes them.

Non-body fields include:

- export date columns such as `Dated`;
- journal notes and text fields;
- entry names, feelings, reflections, and review fields;
- supplement and nutrition fields;
- calories entry values such as `CaloriesEntry.caloriesDifferential`;
- export metadata and user-managed-copy messaging.

Derived values such as BMI, BMR, exercise calorie burn, or journal calorie calculations must be classified separately if they ever appear in export payloads. They must not be described as canonical body measurements, and the Weight Log export lane must not relabel unrelated calculated values as metric or standard body measurements.

## Future Implementation Options

Possible future implementation paths:

1. Add explicit unit/context columns next to preserved existing fields.
2. Add source/display/canonical groups while leaving existing raw fields in place for a compatibility period.
3. Replace ambiguous raw body-measurement fields only in a later breaking export-schema lane after compatibility needs are reviewed.

Preferred direction for the first implementation is option 2: preserve existing raw Weight Log fields initially, then add explicit source, display, and canonical fields so new exports are clear without abruptly removing columns that users may already depend on.

The first implementation should be narrow. It should update selected-journal Weight Log export rows only, add focused export tests, and avoid changes to Weight Log storage, dashboard display, Profile/onboarding, BMI/BMR, calorie-burn logic, import/restore behavior, backup behavior, sync behavior, routes, navigation, public docs, privacy text, and package files.

## Recommended Future Export Shape

For Weight Log rows, future selected-journal export should add these fields while initially preserving existing raw fields for compatibility:

| Field | Meaning |
| --- | --- |
| `weight_source_value` | Stored Weight Log value. |
| `weight_source_unit` | `lb`. |
| `weight_display_value` | Pounds or kilograms based on resolved body preference. |
| `weight_display_unit` | `lb` or `kg`. |
| `weight_canonical_value` | Kilogram equivalent where derivable. |
| `weight_canonical_unit` | `kg`. |

The existing raw `weight` field should be preserved in the first implementation lane if practical, but it must no longer be the only weight context in the exported row.

The future implementation must treat `bodyUnitPreference` as an input to display fields only. Source and canonical fields must remain invariant for the same stored Weight Log entry.

## Future Test Coverage Inventory

This lane adds no tests. Future implementation tests should cover:

- Weight Log export row includes explicit unit context.
- Missing preference exports standard display context.
- Unsupported preference exports standard display context.
- `standard` preference exports pounds display context.
- `metric` preference exports kilograms display context.
- Legacy/source pounds are preserved and labeled.
- Canonical kilograms are included and labeled.
- Existing selected-journal export behavior remains otherwise unchanged.
- Non-body fields are not changed.
- Export does not imply import behavior.
- Export does not imply restore behavior.
- Export does not imply backup behavior.
- Export does not imply sync behavior.
- Export does not imply account, cloud, cross-device, or portability behavior.
- No Weight Log storage mutation occurs during export.
- No dashboard behavior changes occur during export implementation.
- No Profile or onboarding behavior changes occur during export implementation.
- No BMI/BMR behavior changes occur during export implementation.
- No calorie-burn behavior changes occur during export implementation.

## Out Of Scope

This lane does not:

- change export output;
- change selected-journal `.xlsx` columns, rows, workbook shape, copy, or payload behavior;
- change source code;
- add, remove, or modify tests;
- change Weight Log behavior;
- change dashboard behavior;
- change Profile or onboarding behavior;
- change BMI/BMR behavior;
- change calorie-burn behavior;
- change Journal Calories behavior;
- change storage or migrations;
- change package files or lockfiles;
- change CI;
- change routes or navigation;
- change public docs, privacy text, disclosure text, support copy, or release notes;
- implement import, restore, backup, sync, account, cloud, or portability behavior;
- make medical, clinical, diagnostic, treatment, prevention, or medical-grade precision claims.

## Unresolved Risks

- Exact rounding for future exported display and canonical values still needs implementation-lane approval.
- Exact handling for invalid or unparseable stored Weight Log source values still needs implementation-lane approval.
- Preserving the existing raw `weight` field may continue to confuse consumers unless added context fields are clear and tested.
- Removing or renaming existing export fields could break user workflows and should not happen in the first implementation lane without a separate compatibility decision.
- Broadening export language could drift into backup, restore, import, sync, account, cloud, or portability claims.
- Non-body fields could be accidentally relabeled if implementation uses broad key matching instead of a narrow Weight Log body-measurement mapping.

## Recommended Next Lane

Recommended next lane:

`1.3.1.1.15 Export Unit Semantics Implementation`

Likely implementation target:

- update selected-journal export output for Weight Log body measurements;
- add explicit source/display/canonical unit-context columns;
- preserve existing export behavior where possible;
- add focused export tests;
- avoid import, restore, backup, sync, account, cloud, and portability claims.

## Non-Claims

This artifact does not approve or claim:

- export output changes;
- `.xlsx` schema changes;
- source code changes;
- test changes;
- Weight Log behavior changes;
- dashboard behavior changes;
- Profile or onboarding behavior changes;
- BMI/BMR behavior changes;
- calorie-burn behavior changes;
- storage or migration behavior;
- import behavior;
- restore behavior;
- backup behavior;
- sync behavior;
- account continuity;
- cross-device continuity;
- cloud storage;
- guaranteed portability;
- public documentation, privacy, disclosure, support, or release-note language;
- medical, clinical, diagnostic, treatment, prevention, or medical-grade precision behavior.

body_measurement_export_unit_semantics_scope_recorded
