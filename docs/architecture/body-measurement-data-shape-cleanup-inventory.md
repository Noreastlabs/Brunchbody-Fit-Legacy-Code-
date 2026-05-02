# Body Measurement Data Shape Cleanup Inventory

## Status And Scope

This is the internal architecture artifact for `Lane 1.3.2.2.1 Data Shape Cleanup Inventory`.

This lane is docs/audit-only. It inventories current body-measurement data shapes after the Phase 1 measurement-system workstream. It does not clean up code, change behavior, change storage, change exports, change calculations, or change UI.

What changed: one internal architecture artifact only.

What users experience: no change.

This lane does not change app source, tests, storage, export output, migrations, public docs, privacy/disclosure files, package files, lockfiles, CI, routes, navigation, Profile, onboarding, Weight Log, dashboard, BMI/BMR, recreation calorie burn, import, restore, backup, sync, cloud, account, AI, monetization, desktop behavior, or release notes.

Field classifications in this artifact are audit classifications only. They do not authorize source cleanup, storage migration, export schema changes, privacy/data-handling changes, or behavior changes.

## Evidence Method

Current source and current focused tests are the evidence base for this inventory. Existing architecture documents are context only. Current repo behavior wins where older docs are stale or in tension with source/tests.

Primary source files inspected:

- `src/redux/actions/profileStorage.js`
- `src/redux/actions/auth.js`
- `src/redux/reducer/auth.js`
- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
- `src/screens/setting/pages/MyProfile/MyVitals.js`
- `src/screens/setting/pages/MyProfile/MyProfile.js`
- `src/screens/journal/pages/WeightLog/WeightLog.js`
- `src/screens/journal/components/WeightLog.js`
- `src/screens/dashboard/readModel.js`
- `src/screens/dashboard/components/Carousel.js`
- `src/screens/dashboard/components/Weight.js`
- `src/screens/recreation/pages/Recreation/Recreation.js`
- `src/screens/recreation/pages/EditProgram/EditProgram.js`
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js`
- `src/utils/bodyMeasurementUnits.js`
- `src/utils/bodyMetrics.js`
- `src/utils/calorieBurnMetrics.js`

Focused tests inspected:

- `__tests__/bodyMeasurementUnits.test.js`
- `__tests__/bodyMetrics.test.js`
- `__tests__/calorieBurnMetrics.test.js`
- `__tests__/completeProfileFlowBoundary.test.js`
- `__tests__/settingsFormUxBoundary.test.js`
- `__tests__/authProfileRepair.test.js`
- `__tests__/authStorageBoundary.test.js`
- `__tests__/recreationFormUxBoundary.test.js`
- `__tests__/journalFormUxBoundary.test.js`
- `__tests__/dashboardWeightBoundary.test.js`
- `__tests__/dashboardReadModelBoundary.test.js`
- `__tests__/exportToCsvBoundary.test.js`
- `__tests__/exportTransparencyCopy.test.js`

Architecture context inspected:

- `docs/architecture/unit-system-evidence-audit-and-model-contract.md`
- `docs/architecture/body-measurement-calculation-consumer-evidence-audit.md`
- `docs/architecture/body-measurement-export-unit-semantics.md`
- `docs/architecture/measurement-system-final-regression-closeout.md`

Searches focused on body-measurement and calculation terms such as `heightCentimeters`, `weightKilograms`, `bodyUnitPreference`, `height`, `weight`, `bmi`, `bmr`, `WeightLog`, `weight_source_value`, `weight_display_value`, `weight_canonical_value`, and calorie-burn helper usage.

## Current Shape Matrix

| Surface | Field / Shape | Current Meaning | Unit / Semantic Role | Classification | Later Cleanup Owner |
| --- | --- | --- | --- | --- | --- |
| Profile persistence | `user_profile.heightCentimeters` | Stored profile height where present. | Centimeters. | canonical authoritative field | Profile/auth shape contract |
| Profile persistence | `user_profile.weightKilograms` | Stored profile weight where present. | Kilograms. | canonical authoritative field | Profile/auth shape contract |
| Profile persistence | `user_profile.height` | Stored compatibility height. | Legacy feet/inches dot text such as `5.6` or `5.06`. | legacy/source compatibility field | Profile/auth shape contract |
| Profile persistence | `user_profile.weight` | Stored compatibility weight. | Legacy pounds source value. | legacy/source compatibility field | Profile/auth shape contract |
| Profile persistence | `user_profile.bodyUnitPreference` | Persisted profile-level body measurement preference/control. | Not a measurement value; controls current display, input interpretation, and export context where used. | profile-level preference/control field | Profile/auth shape contract |
| Profile persistence | Stored `bmi`, `bmr` | Old or incoming derived values found in storage/payloads. | Derived values are not durable trusted facts. | stale/dead residue | Profile/auth shape contract |
| Auth reducer | Runtime `user.bmi`, `user.bmr` | Locally derived on `SET_USER`. | BMI value and BMR calories, fixed to two decimals. | derived field | Calculation source contract |
| Auth reducer | Canonical metric calculation path | Uses `heightCentimeters` and `weightKilograms` when both are valid numbers. | Centimeters and kilograms. | canonical authoritative field | Calculation source contract |
| Auth reducer | Legacy calculation fallback | Uses `height` and `weight` when canonical pair is missing, partial, or invalid. | Inches derived from legacy height; pounds from legacy weight. | legacy/source compatibility field | Calculation source contract |
| Complete Profile | Submitted body measurement payload | Writes `bodyUnitPreference`, `height`, `heightCentimeters`, `weight`, and `weightKilograms`. | Canonical fields plus legacy compatibility fields. | mixed canonical and compatibility/source shape | Onboarding producer cleanup |
| My Vitals | Height edit payload | Writes `height`, `heightCentimeters`, `bodyUnitPreference`, `name`, `dob`, and `gender`; does not edit weight. | Height canonicalization plus profile preference/control. | mixed canonical and preference/control shape | Profile producer cleanup |
| My Profile | Current weight display text | Formats current profile weight from canonical kg when possible, otherwise falls back to legacy pounds. | Display in `kg` or `lb` based on preference. | display-only field | Profile display cleanup |
| My Profile | BMI/BMR display text | Displays reducer-derived values. | Derived body metrics and calories. | derived field | Profile display cleanup |
| Weight Log storage | `WeightLog.weight` | Stored Weight Log source value and raw export column. | Legacy pounds source value. | legacy/source compatibility field | Weight Log payload cleanup |
| Weight Log storage | `WeightLog.weightKilograms` | Stored canonical Weight Log value where present; preferred by entry display and dashboard read model. | Kilograms. | canonical authoritative field | Weight Log payload cleanup |
| Weight Log storage | `enteredWeightValue`, `enteredWeightUnit` | Edited-input provenance metadata when present. | Entered value plus `kg` or `lb`; not source-of-truth storage. | display-only field | Weight Log payload cleanup |
| Weight Log display | `weight` component prop, label, placeholder, keyboard type | Current form display/input state. | Pounds for standard fallback; kilograms for metric. | display-only field | Weight Log UX cleanup |
| Weight Log profile update | `profile({ weight, weightKilograms })` after save | Updates profile only after journal save succeeds. | Legacy pounds plus canonical kilograms. | mixed compatibility/source and canonical shape | Weight Log/profile boundary cleanup |
| Dashboard read model | `weightData` | Seven-point chart input from Weight Log entries. | Normalized to pounds when canonical kg exists; otherwise legacy weight or `0`. | display-only field | Dashboard read-model cleanup |
| Dashboard chart | `weightDisplayData`, `Weight (kg/lbs)` legend | Converts pound read-model values to kg for metric users and labels chart. | Display preference context. | display-only field | Dashboard display cleanup |
| BMI helper inputs | `heightInches`, `weightPounds` | Imperial helper input shape. | Inches and pounds. | legacy/source compatibility field | Calculation source contract |
| BMI helper inputs | `heightCentimeters`, `weightKilograms` | Metric helper input shape. | Centimeters and kilograms. | canonical authoritative field | Calculation source contract |
| BMR helper context | `age`, `gender`, `dob`-derived age | BMR formula context. | Not body-measurement unit fields. | unresolved/future-work field | Calculation source contract |
| Recreation calorie burn | `user.weightKilograms` | Preferred profile weight for calorie burn when valid numeric kg exists. | Kilograms. | canonical authoritative field | Recreation calculation cleanup |
| Recreation calorie burn | `user.weight` | Fallback calorie-burn profile weight. | Legacy pounds converted by helper. | legacy/source compatibility field | Recreation calculation cleanup |
| Recreation calorie burn | Workout/program `cal` | Stored exercise calorie output. | Derived calories from MET and duration. | derived field | Recreation calculation cleanup |
| Export row | Raw `weight` | Existing Weight Log source column. | Legacy pounds source value. | legacy/source compatibility field | Export shape cleanup |
| Export row | Raw `weightKilograms` when present | Spread from Weight Log payload if present. | Canonical kg entry field, not added by export context helper. | canonical authoritative field | Export shape cleanup |
| Export row | `weight_source_value`, `weight_source_unit` | Explicit source context added for Weight Log rows. | Source value and `lb` unit when source is exportable. | export-only context field | Export shape cleanup |
| Export row | `weight_display_value`, `weight_display_unit` | Preference-based export display context. | `kg` for metric; `lb` for standard fallback. | export-only context field | Export shape cleanup |
| Export row | `weight_canonical_value`, `weight_canonical_unit` | Export-only kilogram context derived from raw source weight. | Kilograms and `kg`. | export-only context field | Export shape cleanup |
| Export row | `Dated` | Workbook row date context. | Export-only date label. | export-only context field | Export shape cleanup |
| Prior audit docs | Older claims that canonical fields are not calculation/export/dashboard inputs | Stale relative to current source and tests. | Documentation residue only. | stale/dead residue | Architecture reconciliation |

## Profile Persistence Shapes

Profile persistence is owned by `src/redux/actions/profileStorage.js` and the `user_profile` AsyncStorage key.

`heightCentimeters` is the canonical authoritative profile height. `weightKilograms` is the canonical authoritative profile weight where present. These fields are persisted direct profile facts and should not be treated as display residue.

Legacy `height` and `weight` remain compatibility/source fields unless a later implementation lane changes that contract. `height` is legacy feet/inches dot notation. `weight` is legacy pounds source data.

`bodyUnitPreference` is a persisted profile-level body measurement preference/control field. It is not a canonical measurement value, not a per-field unit state, and not merely display-only residue. It influences body-measurement display, input interpretation, and export context where current code uses it. Missing or unsupported values resolve to `standard` unless a later lane changes that contract.

`bmi` and `bmr` must not be treated as durable trusted profile fields. Storage load/save strips those fields, and load repairs persisted profiles that contain them.

## Onboarding And Profile Vitals Shapes

Complete Profile submits canonical and compatibility fields together:

| Field | Current role | Classification |
| --- | --- | --- |
| `bodyUnitPreference` | Profile-level measurement preference/control. | profile-level preference/control field |
| `heightCentimeters` | Canonical profile height. | canonical authoritative field |
| `weightKilograms` | Canonical profile weight. | canonical authoritative field |
| `height` | Legacy compatibility height generated from selected input. | legacy/source compatibility field |
| `weight` | Legacy compatibility weight generated from selected input. | legacy/source compatibility field |

My Vitals edits height and profile vitals only. It reads canonical height first, falls back to legacy height, and saves `height`, `heightCentimeters`, and `bodyUnitPreference`. It does not write `weight` or `weightKilograms`.

Current Profile display formats weight from canonical kilograms when possible and falls back to legacy pounds if needed. BMI and BMR display uses reducer-derived values.

## Weight Log Shapes

Weight Log has separate source, canonical, provenance, and display shapes.

`WeightLog.weight` is the stored legacy/source value. Current code treats it as pounds for storage compatibility, profile update compatibility, dashboard fallback, and raw export compatibility.

`WeightLog.weightKilograms` is the canonical Weight Log value where present. Current entry display and dashboard read-model behavior prefer it when valid. Its presence must not be treated as a storage migration or permission to remove `WeightLog.weight`.

`enteredWeightValue` and `enteredWeightUnit` are edited-input provenance fields. They record what was entered when the form is edited, but they are not canonical fields and should not replace source/canonical semantics in a later cleanup lane without an explicit contract.

Weight Log display state, labels, placeholders, and keyboard type are display/input fields controlled by `bodyUnitPreference`. Standard and unsupported preferences use pounds. Metric uses kilograms.

After a successful Weight Log save, the page dispatches a profile update with both `weight` and `weightKilograms`. That profile boundary must not be changed in this inventory lane.

## Dashboard Weight Shapes

The dashboard read model consumes Weight Log entries and builds seven-point chart arrays.

When `WeightLog.weightKilograms` is valid, the read model converts kilograms to pounds and rounds before handing data to the chart layer. When canonical kg is absent or invalid, it falls back to `WeightLog.weight` or `0`.

The Carousel receives `weightData` as the chart input shape. For metric users, it converts pound values to kilograms for display and labels the legend `Weight (kg)`. For standard fallback, it leaves the values as pounds and labels the legend `Weight (lbs)`.

The chart component renders the provided data and does not own body-measurement semantics.

## Calculation Input And Derived Output Shapes

BMI/BMR runtime values are derived and must not be trusted as durable profile fields.

Current reducer behavior strips incoming `bmi` and `bmr`, then derives runtime values. If both `heightCentimeters` and `weightKilograms` are valid numbers, the reducer uses the canonical metric path. If canonical fields are missing, partial, or invalid, it falls back to legacy `height` and `weight`.

Calculation utility shapes:

| Shape | Role | Classification |
| --- | --- | --- |
| `heightCentimeters`, `weightKilograms` | Canonical metric BMI/BMR inputs. | canonical authoritative field |
| `heightInches`, `weightPounds` | Legacy/imperial BMI/BMR inputs. | legacy/source compatibility field |
| `age`, `gender`, DOB-derived age | BMR calculation context, not unit-system fields. | unresolved/future-work field |
| BMI/BMR return values | Runtime calculations. | derived field |

Recreation and Edit Program calorie burn prefer valid numeric `user.weightKilograms` for MET calculations and fall back to legacy `user.weight` pounds through the pounds helper when canonical kg is absent or invalid. Workout/program `cal` values are derived calorie outputs.

If a field appears in current code but is not clearly owned by body-measurement cleanup, classify it as unresolved/future-work rather than removing, relabeling, or reinterpreting it.

## Export Body-Measurement Shapes

Selected-journal Weight Log export currently spreads stored Weight Log fields, deletes `isDeleted`, adds `Dated`, and appends explicit source/display/canonical weight context fields.

Raw `weight` remains the legacy/source export column. Raw `weightKilograms`, `enteredWeightValue`, and `enteredWeightUnit` may also appear in export rows if present in the stored Weight Log payload because export spreads entry fields before adding context.

Export context fields are classified by their export role only. Their presence must not be treated as a storage migration, import contract, restore contract, backup contract, sync contract, account-continuity contract, cloud-storage claim, or guaranteed-portability claim.

Current export context behavior:

| Field | Current meaning | Classification |
| --- | --- | --- |
| `weight_source_value` | Exportable raw Weight Log source weight. | export-only context field |
| `weight_source_unit` | Source unit, currently `lb` when source is exportable. | export-only context field |
| `weight_display_value` | Display-context value based on profile preference. | export-only context field |
| `weight_display_unit` | Display-context unit, `kg` or `lb`. | export-only context field |
| `weight_canonical_value` | Kilogram context derived from raw source weight. | export-only context field |
| `weight_canonical_unit` | Canonical export context unit, `kg`. | export-only context field |
| `Dated` | Workbook row date context. | export-only context field |

Important ambiguity: current export context derives display and canonical values from `WeightLog.weight`, not from `WeightLog.weightKilograms`. If a stored row has conflicting `weight` and `weightKilograms`, export may include raw `weightKilograms` while the added `weight_canonical_value` reflects the legacy source weight. This inventory records that tension only; it does not resolve it.

## Test Coverage Map

| Coverage area | Focused tests |
| --- | --- |
| Body conversion helpers | `bodyMeasurementUnits.test.js` |
| BMI/BMR helper parity and invalid inputs | `bodyMetrics.test.js` |
| Calorie-burn helper parity and invalid inputs | `calorieBurnMetrics.test.js` |
| Complete Profile canonical plus compatibility payloads | `completeProfileFlowBoundary.test.js` |
| My Vitals height edits and Profile current-weight/BMI/BMR display | `settingsFormUxBoundary.test.js` |
| Derived-field stripping and auth reducer source precedence | `authProfileRepair.test.js` |
| Profile storage/auth persistence boundary | `authStorageBoundary.test.js` |
| Recreation/Edit Program calorie source selection | `recreationFormUxBoundary.test.js` |
| Weight Log input/display/save/profile update semantics | `journalFormUxBoundary.test.js` |
| Dashboard chart preference behavior | `dashboardWeightBoundary.test.js` |
| Dashboard read-model ownership and canonical kg preference | `dashboardReadModelBoundary.test.js` |
| Selected-journal Weight Log export context fields | `exportToCsvBoundary.test.js` |
| Export/local-only transparency copy | `exportTransparencyCopy.test.js` |

This docs-only lane did not add or edit tests.

## Field Classification Summary

Canonical authoritative fields:

- `heightCentimeters`
- `weightKilograms`
- `WeightLog.weightKilograms` where present

Legacy/source compatibility fields:

- `height`
- `weight`
- `WeightLog.weight`
- `heightInches`
- `weightPounds`

Profile-level preference/control fields:

- `bodyUnitPreference`

Display-only fields:

- Profile formatted current-weight text
- Weight Log form display/input state, labels, placeholders, and keyboard type
- `enteredWeightValue` and `enteredWeightUnit` as input provenance
- Dashboard `weightData` display/read-model shape and chart legend/display values

Derived fields:

- Runtime `user.bmi`
- Runtime `user.bmr`
- BMI/BMR helper outputs
- Recreation/Edit Program `cal` outputs

Export-only context fields:

- `Dated`
- `weight_source_value`
- `weight_source_unit`
- `weight_display_value`
- `weight_display_unit`
- `weight_canonical_value`
- `weight_canonical_unit`

Stale/dead residue:

- Persisted or incoming `bmi` and `bmr` values before reducer/storage stripping
- Older architecture-doc claims that canonical fields are not calculation, dashboard, recreation, or export-adjacent inputs where current code/tests now prove otherwise

Unresolved/future-work fields:

- `dob`, `gender`, and derived age as BMR context rather than body-measurement unit fields
- Conflict behavior for export rows containing both `WeightLog.weight` and `WeightLog.weightKilograms`
- Any non-body field that appears near body-measurement code but is not clearly owned by this cleanup inventory

## Cleanup Recommendations

Do not clean up code in this lane.

Later cleanup lanes should keep source-selection contracts explicit before deleting or relabeling fields. In particular:

- Keep `heightCentimeters` as canonical profile height.
- Keep `weightKilograms` as canonical profile weight where present.
- Keep legacy `height` and `weight` as compatibility/source fields until a later lane intentionally changes them.
- Keep `bmi` and `bmr` derived and untrusted as durable profile fields.
- Preserve Weight Log source/display/canonical semantics until a Weight Log-specific lane changes them.
- Preserve export unit context semantics until an export-specific lane changes them.
- Treat `bodyUnitPreference` as persisted profile-level preference/control, not as disposable display-only residue.

## Recommended Next Lane Order

1. Profile persistence and auth reducer shape contract cleanup.
2. Complete Profile and My Vitals producer cleanup.
3. BMI/BMR and recreation calorie-burn calculation source contract cleanup.
4. Weight Log source/display/canonical payload cleanup.
5. Dashboard weight read-model and chart display cleanup.
6. Selected-journal Weight Log export shape cleanup.
7. Final focused regression and architecture closeout for implemented cleanup lanes.

## Risks / Ambiguities

The main risk is turning this inventory into cleanup. This artifact records current state only.

Known risks and ambiguities:

- `bodyUnitPreference` crosses persistence, input, display, and export context. It must not be classified as merely display-only.
- Export context currently derives canonical/display fields from raw `WeightLog.weight`, while raw `WeightLog.weightKilograms` may also be exported if present.
- Dashboard read-model data is normalized to pounds before metric display conversion, so dashboard cleanup should wait for an explicit Weight Log/source contract.
- My Vitals does not edit profile weight. Later producer cleanup should not infer missing weight behavior from the height editor.
- DOB, gender, and age-derived BMR context are calculation inputs, not body-measurement unit fields.
- Older architecture docs contain stale current-state claims relative to later measurement-system implementation and tests.
- No migration requirements should be inferred from this lane.

## Non-Claims

This artifact does not claim:

- any user-facing change;
- any storage migration;
- any app behavior change;
- any export output/schema change;
- any dashboard behavior change;
- any calculation behavior change;
- any import, restore, backup, sync, cloud, account-continuity, cross-device, portability, AI, monetization, or desktop behavior;
- any public docs, privacy policy, store disclosure, support copy, or release-note update;
- any backend behavior.

This artifact does not make privacy, deletion, backup, restore, sync, portability, medical, or clinical claims.

## Acceptance Notes

This lane creates exactly one internal docs artifact:

- `docs/architecture/body-measurement-data-shape-cleanup-inventory.md`

Expected final review posture:

- Users experience no change.
- No app source files are changed.
- No tests are changed.
- No storage, export output, migrations, public docs, privacy/disclosure files, package files, lockfiles, CI, routes, or navigation files are changed.
- `git diff --check` passes.
- `git status --short --untracked-files=all` shows only this new docs artifact unless pre-existing unrelated changes are explicitly called out.
