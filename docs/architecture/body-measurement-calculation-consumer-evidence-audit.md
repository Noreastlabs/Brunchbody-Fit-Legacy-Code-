# Body Measurement Calculation Consumer Evidence Audit

## Status And Scope

This is an internal architecture and evidence artifact for `Lane 1.3.1.1.5 Calculation Consumer Evidence Audit`.

This lane inventories current body-measurement calculation consumers before canonical metric body fields become calculation sources. It is audit-only and evidence-only.

What changed: one internal architecture artifact only.

What users experience: no user-facing change.

This lane changes no BMI logic, BMR logic, calorie-burn logic, reducers, profile storage, Weight Log behavior, dashboard behavior, exports, onboarding/Profile UI, tests, migrations, package files, lockfiles, CI, public docs, disclosures, routes, navigation, conversion utilities, or persisted data.

## Evidence Method

Current mounted code and current local tests are the evidence source for this artifact. Existing architecture notes are used only as context; current repo behavior wins where there is any tension.

Primary search used:

```sh
rg -n "bmi|bmr|BMR|BMI|weight|height|calorie|calories|MET|parseFloat\(user\.weight|703|2\.205|heightCentimeters|weightKilograms|bodyUnitPreference" src __tests__
```

Supporting inspection focused on:

- `src/redux/reducer/auth.js`
- `src/redux/actions/auth.js`
- `src/redux/actions/profileStorage.js`
- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
- `src/screens/setting/pages/MyProfile/MyVitals.js`
- `src/screens/setting/pages/MyProfile/MyProfile.js`
- `src/screens/journal/pages/Calories/Calories.js`
- `src/screens/journal/components/Calories.js`
- `src/screens/journal/pages/WeightLog/WeightLog.js`
- `src/screens/journal/components/WeightLog.js`
- `src/screens/dashboard/readModel.js`
- `src/screens/dashboard/components/Carousel.js`
- `src/screens/dashboard/components/Weight.js`
- `src/screens/recreation/pages/Recreation/Recreation.js`
- `src/screens/recreation/pages/EditProgram/EditProgram.js`
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js`
- `src/utils/bodyMeasurementUnits.js`
- related current tests for auth/profile repair, onboarding/profile vitals, Weight Log, dashboard read model, recreation form behavior, and unit conversion helpers

This artifact separates verified current behavior from additive fields, future contract decisions, implementation recommendations, unresolved risks, and unverified areas.

## Current Calculation Consumer Matrix

| Surface | File / symbol | Current input | Current unit assumption | Current output | Classification | Later owner lane |
| --- | --- | --- | --- | --- | --- | --- |
| BMI derivation | `src/redux/reducer/auth.js` / `deriveUserMetrics`, `getBmi`, `getUserHeight`, `getParsedWeight` | `userData.height`, `userData.weight` | `height` is dot-notation feet/inches text; `weight` is pounds; BMI uses imperial factor `703` | Derived `user.bmi` string with two decimals on `SET_USER` | legacy imperial consumer | calculation parity and hardening lane |
| BMR derivation | `src/redux/reducer/auth.js` / `deriveUserMetrics`, `getBmr`, `getUserHeight`, `getActualAge`, `getParsedWeight` | `userData.height`, `userData.weight`, `userData.dob`, `userData.gender` | `height` becomes total inches; `weight` is pounds; BMR formulas are pound/inch/age based | Derived `user.bmr` string with two decimals on `SET_USER` | legacy imperial consumer | calculation parity and hardening lane |
| Derived-field stripping before reducer derivation | `src/redux/reducer/auth.js` / `stripDerivedProfileFields` | incoming `action.payload.bmi`, `action.payload.bmr` | Incoming derived values are not trusted regardless of units | Removes incoming `bmi`/`bmr` before local derivation | derived-field producer | calculation parity and hardening lane |
| Durable profile storage boundary | `src/redux/actions/profileStorage.js` / `stripDerivedProfileFields`, `loadStoredProfile`, `saveStoredProfile` | stored profile object | `bmi` and `bmr` are derived, not durable profile facts | Removes durable `bmi`/`bmr`; rewrites storage if loaded profile contained them | storage/compatibility boundary | storage boundary lane only if derived-field contract changes |
| Profile merge and dispatch boundary | `src/redux/actions/auth.js` / `profile`, `loggedIn`, `persistProfileAndDispatch` | direct profile payload plus stored profile | Direct fields are persisted; reducer derives `bmi`/`bmr` after dispatch | Saves sanitized profile, dispatches `SET_USER` | storage/compatibility boundary | storage boundary lane only if calculation source contract changes |
| Profile BMI display | `src/screens/setting/pages/MyProfile/MyProfile.js` / `bmiSummary`, `getBmiBadgeTone` | `user.bmi` | Already-derived numeric BMI value; display thresholds only | Display value plus badge tone/text | derived-field display | profile display lane after calculation parity |
| Profile BMR display | `src/screens/setting/pages/MyProfile/MyProfile.js` / `bmrText` | `user.bmr` | Already-derived BMR calories value | Display text like `<value> CALORIES` | derived-field display | profile display lane after calculation parity |
| Profile current weight display | `src/screens/setting/pages/MyProfile/MyProfile.js` / `getWeightText` | `user.weight`, `user.bodyUnitPreference` | `user.weight` is parsed as standard pounds, then formatted for display preference | Display-only current weight text | display-only consumer | profile display lane |
| Journal Calories BMR consumer | `src/screens/journal/pages/Calories/Calories.js` / `bmr`, `onSaveHandler` | `entryData.bmr || user.bmr`, completed-workout calories, actual calories | BMR is already-derived calories; exercise calories are already stored on workout entries | Saves `CaloriesEntry.bmr` and `CaloriesEntry.caloriesDifferential` | derived-field display | calorie journal parity lane after BMR parity |
| Journal Calories output display | `src/screens/journal/components/Calories.js` / total output and differential display | `bmr`, `calFromExe`, `totalCaloriesFromMeals` | BMR and exercise calories are calorie values | Displays BMR output, calories from exercise, total calories out, difference, and differential | derived-field display | calorie journal parity lane after BMR parity |
| Recreation completed-plan calorie burn | `src/screens/recreation/pages/Recreation/Recreation.js` / `calorieCalculationHandler`, `getPlan` | `user.weight`, exercise `met`, `rpm`, `mph`, `amount`, `unit` | `user.weight` is pounds; code converts with `/ 2.205` before MET math | Exercise `cal` strings for selected/completed plan entries | calorie-burn consumer | calculation parity and hardening lane |
| Program edit calorie burn | `src/screens/recreation/pages/EditProgram/EditProgram.js` / `calorieCalculationHandler` | `user.weight`, selected exercise `met`, `rpm`, `mph`, `amount`, `unit` | `user.weight` is pounds; code converts with `/ 2.205` before MET math | Exercise `cal` strings stored in custom program entries and superset options | calorie-burn consumer | calculation parity and hardening lane |
| Onboarding body measurement payload | `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js` / `getBodyMeasurementPayload` | selected height/weight plus `bodyUnitPreference` | Produces canonical metric fields while preserving legacy pounds/feet-inches compatibility fields | `bodyUnitPreference`, `height`, `heightCentimeters`, `weight`, `weightKilograms` | not a calculation consumer | profile/onboarding canonical field lane |
| My Vitals height editor | `src/screens/setting/pages/MyProfile/MyVitals.js` / `getInitialHeightCentimeters`, `getDraftHeightCentimeters`, `onUpdateHandler` | `user.heightCentimeters` or legacy `user.height`, draft height, `bodyUnitPreference` | Prefers canonical centimeters when present; falls back to legacy feet/inches height | Saves `height`, `heightCentimeters`, `bodyUnitPreference`, gender/name/dob; does not edit weight | not a calculation consumer | profile/vitals canonical field lane |
| Weight Log profile update | `src/screens/journal/pages/WeightLog/WeightLog.js` / `onSaveHandler` | Weight Log form `weight` | UI labels and profile update path assume pounds | Saves `WeightLog.weight`; after successful journal save dispatches `profile({ weight })` | display-only consumer | Weight Log unit/display lane |
| Weight Log input display | `src/screens/journal/components/WeightLog.js` | `weight` prop | Label says `Enter Weight (lbs)` and placeholder says `lbs` | Pounds-oriented input UI | display-only consumer | Weight Log unit/display lane |
| Dashboard weight read model | `src/screens/dashboard/readModel.js` / `buildDashboardReadModel` | `WeightLog.weight` | Current chart data is legacy Weight Log weight; period views parse it as numeric | Day/week/month/year `weightData` arrays | display-only consumer | dashboard unit/display lane |
| Dashboard chart label | `src/screens/dashboard/components/Carousel.js` / `weightChart` | `weightData` | Label says `Weight (lbs)` | Chart legend for weight data | display-only consumer | dashboard unit/display lane |
| Dashboard chart rendering | `src/screens/dashboard/components/Weight.js` | chart `data` | Renders provided data without unit conversion | Line chart | display-only consumer | dashboard unit/display lane |
| Selected journal export | `src/screens/setting/pages/Export To CSV/ExportToCSV.js` / `toggleSwitch`, `exportDataToExcel` | selected journal entry payloads, including `WeightLog` and `CaloriesEntry` when selected | Exports current payload shape; no explicit body-unit calculation or labeling contract | `.xlsx` workbook rows from selected entry data | not a calculation consumer | export semantics lane |
| Body measurement utility | `src/utils/bodyMeasurementUnits.js` | feet/inches, centimeters, pounds, kilograms, `bodyUnitPreference` | Pure conversion/formatting helper; canonical units are centimeters and kilograms | Converted/formatted values | not a calculation consumer | utility parity lane only if calculation consumers adopt helpers |

## Legacy Imperial Assumptions

Verified current calculation behavior still uses legacy compatibility fields as calculation inputs:

- BMI and BMR derive from `height` and `weight` in `src/redux/reducer/auth.js`.
- `height` is parsed by splitting a string on `.`, interpreting the first segment as feet and the second segment as inches. Example: `5.06` means 5 feet 6 inches, not 5.06 feet.
- BMI uses `703 * (weight / heightInches^2)`, where `weight` is parsed from `userData.weight` as pounds.
- BMR uses pound/inch formulas:
  - male: `66 + 6.23 * weight + 12.7 * heightInches - 6.8 * age`
  - female: `655 + 4.35 * weight + 4.7 * heightInches - 4.7 * age`
- Recreation calorie burn uses MET math after converting profile weight from pounds to kilograms with `/ 2.205`.
- Weight Log UI labels entered weight as pounds and updates profile `weight` after a successful journal save.
- Dashboard weight charts read `WeightLog.weight` and label chart data as `Weight (lbs)`.
- Profile current weight display parses `user.weight` as standard pounds before formatting for the profile preference.

These assumptions are documented only. This lane does not change them.

## Canonical Metric Field Status

Additive canonical body fields exist in current profile/onboarding flows:

- `bodyUnitPreference`
- `heightCentimeters`
- `weightKilograms`

Verified current producers and users:

- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js` writes `heightCentimeters`, `weightKilograms`, and `bodyUnitPreference` while also writing legacy `height` and `weight`.
- `src/screens/setting/pages/MyProfile/MyVitals.js` reads `heightCentimeters` when present, falls back to legacy `height`, and writes `heightCentimeters` and `bodyUnitPreference`. It does not edit weight and does not write `weightKilograms`.
- `src/utils/bodyMeasurementUnits.js` contains pure helpers for centimeters, kilograms, pounds, feet/inches, legacy height parsing, and display formatting.
- Current tests cover additive canonical field creation/formatting and the auth reducer compatibility expectation that BMI/BMR remain sourced from legacy fields even when `heightCentimeters`, `weightKilograms`, and `bodyUnitPreference: 'metric'` are present.

Verified current non-use in calculations:

- `src/redux/reducer/auth.js` does not consume `heightCentimeters` or `weightKilograms` for BMI/BMR.
- `src/screens/recreation/pages/Recreation/Recreation.js` does not consume `weightKilograms` for calorie burn.
- `src/screens/recreation/pages/EditProgram/EditProgram.js` does not consume `weightKilograms` for calorie burn.
- `src/screens/journal/pages/Calories/Calories.js` consumes already-derived `bmr` and completed-workout calorie values, not canonical metric body fields.

## Derived Field Handling

Verified current behavior:

- `bmi` and `bmr` are derived profile values.
- `src/redux/actions/profileStorage.js` strips `bmi` and `bmr` before durable profile storage and repairs stored profiles that contain those fields.
- `src/redux/reducer/auth.js` strips incoming `bmi` and `bmr` from `SET_USER` payloads before deriving current values.
- `src/screens/setting/pages/MyProfile/MyProfile.js` displays current derived `bmi` and `bmr` but does not produce them.
- `src/screens/journal/pages/Calories/Calories.js` stores the current `user.bmr` value inside `CaloriesEntry` and uses local state initialized from `entryData.bmr || user.bmr` for calorie output math.

Future contract decision still required:

- Whether `CaloriesEntry.bmr` should remain a point-in-time copied derived value, be recalculated from current profile data, or be governed by a separate journal-entry snapshot rule is not decided in this lane.

## Calorie-Burn Consumers

Verified current body-weight calorie-burn consumers:

- `src/screens/recreation/pages/Recreation/Recreation.js` uses `parseFloat(user.weight, 10) / 2.205` to convert pounds to kilograms, then calculates `calPerMin = (item.met * 3.5 * weightKg) / 200`.
- `src/screens/recreation/pages/EditProgram/EditProgram.js` uses the same `parseFloat(user.weight, 10) / 2.205` boundary before MET math.
- Both consumers branch by exercise shape:
  - `rpm` with reps/minutes/hours/seconds
  - `mph` with miles/meters/kilometers/yards/minutes/hours/seconds
  - plain MET duration with minutes/hours/seconds
- Both return calorie values as strings and store them on workout/program plan entries as `cal`.

This audit records the existing pounds-to-kilograms boundary. It does not change the conversion factor, math, units, storage shape, rounding, or error behavior.

Related calorie surfaces that are not body-weight calorie-burn consumers:

- `src/screens/journal/pages/Calories/Calories.js` totals already-stored workout `cal` values and optional additional calories out.
- `src/screens/journal/components/Calories.js` displays BMR, exercise calories, total output, difference, and differential.
- `src/screens/dashboard/readModel.js` reads saved `CaloriesEntry.caloriesDifferential` for charts.

## Display-Only Or Calculation-Adjacent Surfaces

These surfaces participate in body-measurement display or nearby workflows but are not current BMI/BMR or calorie-burn calculation sources:

- `src/screens/setting/pages/MyProfile/MyProfile.js` displays current weight, BMI, BMR, and target totals. Its BMI badge thresholding is a display classification of the already-derived BMI value, not BMI derivation.
- `src/screens/journal/pages/WeightLog/WeightLog.js` stores Weight Log entries and updates profile `weight` only after successful journal save. It is calculation-adjacent because profile `weight` later feeds BMI/BMR and calorie burn, but this page does not calculate those values.
- `src/screens/journal/components/WeightLog.js` labels the input as pounds and provides the visible field.
- `src/screens/dashboard/readModel.js` aggregates Weight Log and calorie differential values into chart arrays. The week/month/year views parse and average values for visualization, not body-measurement calculation hardening.
- `src/screens/dashboard/components/Carousel.js` labels the chart `Weight (lbs)`.
- `src/screens/dashboard/components/Weight.js` renders the chart data only.
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js` exports selected journal payload fields and remains a future unit-label semantics risk, not a calculation consumer.

## Non-Consumer Surfaces

These surfaces are explicitly not current body-measurement calculation consumers:

- `src/utils/bodyMeasurementUnits.js`: pure helper library for parsing, converting, and formatting body measurement values. It is not yet integrated as a BMI/BMR or calorie-burn calculation source.
- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`: produces compatibility and canonical profile fields but does not derive BMI/BMR or exercise calories.
- `src/screens/setting/pages/MyProfile/MyVitals.js`: edits profile vitals and canonical height fields but does not derive BMI/BMR or exercise calories.
- `src/screens/completeProfile/components/Height.js`, `src/screens/completeProfile/components/Weight.js`, and `src/screens/setting/components/My Profile/MyVitals.js`: UI components for unit preference, height, and weight entry/display; no body-measurement calculation source behavior was found there.
- `src/resources/strings.js`: contains body-measurement labels/helper/error copy; no calculation behavior.
- `src/redux/actions/onboardingStorage.js`: stores onboarding draft keys including `bodyUnitPreference`; no calculation behavior.

## Future Calculation Hardening Requirements

Before any calculation source changes from legacy compatibility fields to canonical metric fields, a later lane must define and prove:

- BMI parity for legacy standard profiles and metric-equivalent profiles.
- BMR parity for legacy standard profiles and metric-equivalent profiles.
- The exact source precedence for each calculation: legacy fields, canonical fields, or explicit conversion boundary.
- Rounding and string/number output rules for BMI, BMR, and exercise calories.
- Invalid, missing, malformed, zero, and partial profile handling.
- Whether calorie-burn consumers should read `weightKilograms` directly, derive kilograms from `weight`, or call a shared helper.
- Whether journal `CaloriesEntry.bmr` is a point-in-time snapshot or should be regenerated under a future calculation contract.
- Compatibility behavior for profiles that have only legacy fields, only partial canonical fields, or conflicting legacy/canonical values.
- No durable trust in incoming `bmi` or `bmr` unless a separate storage contract lane explicitly changes that rule.

Implementation recommendation for later lanes:

- Do not flip BMI/BMR or calorie-burn consumers directly to canonical metric fields until parity fixtures cover both standard and metric-equivalent source profiles.
- Prefer a narrow calculation-source lane that first centralizes source selection and proves parity, then separate display/storage/export lanes for visible unit semantics.

## Future Test Coverage Inventory

No tests are added in this lane. Future lanes should add or update tests only for the logic they touch.

Required future parity and boundary coverage:

- Auth reducer BMI parity for legacy `height`/`weight` and equivalent `heightCentimeters`/`weightKilograms` source data.
- Auth reducer BMR parity across male/female profiles, birthday boundary behavior, and metric-equivalent source data.
- Auth reducer refusal to trust incoming `bmi`/`bmr` unless a future lane intentionally changes that contract.
- Calorie-burn parity for `Recreation.js` and `EditProgram.js` with pound-source and kilogram-source profiles.
- MET calorie calculations for rpm, mph, duration-only, distance, time, and unsupported-unit branches.
- Journal Calories behavior for `entryData.bmr || user.bmr`, saved `CaloriesEntry.bmr`, total calories out, calorie difference, and `caloriesDifferential`.
- Weight Log profile update behavior under unit preference changes, including whether Weight Log should write canonical weight later.
- Dashboard chart unit-label/data behavior after Weight Log semantics are changed.
- Export output unit labels and body-field semantics if export is touched by a later lane.
- Utility helper tests for any helper promoted into BMI/BMR or calorie-burn source selection.

Existing relevant test evidence found during this audit includes:

- `__tests__/authProfileRepair.test.js`
- `__tests__/authStorageBoundary.test.js`
- `__tests__/completeProfileFlowBoundary.test.js`
- `__tests__/settingsFormUxBoundary.test.js`
- `__tests__/bodyMeasurementUnits.test.js`
- `__tests__/journalFormUxBoundary.test.js`
- `__tests__/dashboardReadModelBoundary.test.js`
- `__tests__/recreationFormUxBoundary.test.js`
- `__tests__/localDataValidation.test.js`

Unverified test gap:

- No dedicated journal Calories page calculation test was identified by the targeted searches in this lane; current evidence for that surface is source inspection plus downstream dashboard read-model tests for saved `CaloriesEntry.caloriesDifferential`.

## Unresolved Risks

- Canonical metric fields already exist, but current calculations still use legacy compatibility fields. Treating canonical fields as ready calculation sources before parity is proven could change BMI, BMR, or calorie-burn behavior.
- Legacy `height` uses dot notation for feet/inches text. Any future parser that treats it as decimal feet will change results.
- `weight` remains a shared compatibility field used by profile display, BMI/BMR derivation, recreation calorie burn, and Weight Log profile updates.
- Recreation calorie-burn logic currently converts pounds to kilograms inline with `/ 2.205`; replacing that boundary without test fixtures risks small or broad calorie changes.
- Journal Calories stores and uses BMR in entry-level calorie math. Its snapshot-versus-current-profile contract is unresolved.
- Dashboard read-model aggregation parses Weight Log weights and calorie differentials for visualization. It should not be bundled into calculation hardening unless the later lane intentionally changes chart semantics.
- Export can leak ambiguous body-unit semantics if body fields change without a dedicated export lane.
- Profiles may contain both legacy and canonical body fields. Source precedence for conflicting values remains undecided.

## Recommended Next Lane

Recommended next lane: a narrow calculation parity and source-selection hardening lane.

That lane should:

- keep `bmi` and `bmr` derived, not durable trusted fields
- define source precedence for BMI, BMR, and recreation calorie burn
- add parity tests before changing any calculation source
- prove current legacy behavior remains stable for existing profiles
- only then consider moving BMI/BMR or calorie-burn consumers toward canonical metric fields or shared conversion helpers

The next lane should not combine calculation hardening with Weight Log UI, dashboard chart labels, export semantics, storage migration, public docs, or disclosure changes.

## Non-Claims

This artifact does not claim or approve:

- any source code change
- any test change
- any reducer or storage change
- any migration
- any BMI/BMR behavior change
- any calorie-burn behavior change
- any Weight Log, dashboard, export, onboarding, or Profile UI behavior change
- any public documentation, release-note, privacy, or disclosure change
- any package, lockfile, CI, or navigation change
- canonical metric fields as current calculation sources
- `weightKilograms` or `heightCentimeters` as parity-proven for BMI/BMR or calorie-burn calculations
- import, restore, backup, sync, cloud, account, or portability behavior
- medical, clinical, diagnostic, treatment, prevention, or medical-grade precision behavior

body_measurement_calculation_consumer_evidence_audit_recorded
