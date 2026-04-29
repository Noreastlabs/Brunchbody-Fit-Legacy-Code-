# Body Measurement Calculation Parity And Source Selection

## Status And Scope

This is an internal architecture and scope artifact for `Lane 1.3.1.1.6 Calculation Parity And Source-Selection Scope`.

This lane defines the future calculation source-selection contract and parity-test requirements for moving body-measurement calculations from legacy compatibility fields to canonical metric fields.

What changed: one internal architecture artifact only.

What users experience: no user-facing change.

This lane changes no BMI logic, BMR logic, calorie-burn logic, reducers, profile storage, Weight Log behavior, dashboard behavior, exports, onboarding/Profile UI, tests, migrations, package files, lockfiles, CI, public docs, disclosures, routes, navigation, conversion utilities, or persisted data.

Current calculation consumers must continue to use legacy compatibility fields until a later implementation lane proves parity and intentionally changes source selection.

## Evidence Basis

This artifact is based on current repo evidence and the prior calculation consumer audit. Current mounted source code remains the source of truth if there is any conflict with older uploaded references.

Primary evidence sources:

- `docs/architecture/body-measurement-calculation-consumer-evidence-audit.md`
- `docs/architecture/unit-system-evidence-audit-and-model-contract.md`
- `src/redux/reducer/auth.js`
- `src/screens/recreation/pages/Recreation/Recreation.js`
- `src/screens/recreation/pages/EditProgram/EditProgram.js`
- `src/screens/journal/pages/Calories/Calories.js`
- `src/screens/journal/components/Calories.js`
- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
- `src/screens/setting/pages/MyProfile/MyVitals.js`
- `src/utils/bodyMeasurementUnits.js`
- current local tests covering auth/profile repair, onboarding/profile vitals, body measurement utilities, Weight Log, dashboard read models, and recreation form behavior

Evidence search to re-run for future source-selection lanes:

```sh
rg -n "bmi|bmr|BMR|BMI|weight|height|calorie|calories|MET|parseFloat\(user\.weight|703|2\.205|heightCentimeters|weightKilograms|bodyUnitPreference" src __tests__
```

Older external reference files should be re-uploaded before future cross-file comparison work if they are no longer available in the working context.

## Current Calculation Sources

Current BMI and BMR derivation remains legacy-field based:

- `src/redux/reducer/auth.js` derives `user.bmi` and `user.bmr` during `SET_USER`.
- `height` is parsed as dot-notation feet/inches compatibility input. For example, `5.06` means 5 feet 6 inches.
- `weight` is parsed as pounds.
- BMI uses the imperial factor `703`.
- BMR uses the current pound/inch/age formulas and current gender dependency.
- Incoming `bmi` and `bmr` are stripped before derivation and are not trusted as durable source fields.

Current Recreation and EditProgram calorie-burn calculations remain legacy-weight based:

- `src/screens/recreation/pages/Recreation/Recreation.js` reads `user.weight`.
- `src/screens/recreation/pages/EditProgram/EditProgram.js` reads `user.weight`.
- Both paths convert pounds to kilograms with `parseFloat(user.weight, 10) / 2.205` before MET math.
- Both paths return stored calorie values on workout/program entries.

Current Journal Calories behavior remains downstream of derived BMR:

- `src/screens/journal/pages/Calories/Calories.js` initializes local BMR state from `entryData.bmr || user.bmr`.
- Saved `CaloriesEntry` payloads use the current derived `user.bmr`.
- Calorie differential math uses BMR and already-stored exercise calorie values.
- Journal Calories does not read `heightCentimeters` or `weightKilograms` directly.

## Approved Future Source Selection Model

Future calculation-hardening lanes must use this precedence unless a later architecture lane explicitly replaces it:

1. Use canonical metric fields only when all required canonical values are present, finite, positive, complete for the calculation, and covered by parity tests.
2. Fall back to legacy compatibility fields when canonical fields are missing, invalid, partial, malformed, or unsupported.
3. Do not combine canonical height with legacy weight, or legacy height with canonical weight, for BMI/BMR unless a later lane explicitly proves and tests mixed-source behavior.
4. Preserve current results for valid legacy standard profiles within the agreed rounding tolerance for the specific calculation.
5. Do not rewrite stored legacy profiles as part of source selection.
6. Do not make canonical fields durable calculation sources until parity tests exist for the calculation being changed.

Canonical fields are future calculation inputs, not current source-of-truth fields for BMI/BMR or calorie-burn behavior.

## Canonical Source Eligibility Rules

Canonical fields may become calculation inputs only when the later implementation lane proves all relevant requirements:

- `heightCentimeters` is a finite positive number for height-dependent calculations.
- `weightKilograms` is a finite positive number for weight-dependent calculations.
- BMI/BMR source selection has the complete canonical pair before using canonical calculation inputs.
- Recreation and EditProgram calorie-burn source selection has a valid canonical weight before replacing the current legacy pounds-to-kilograms boundary.
- The calculation has parity tests comparing legacy and canonical paths.
- Invalid canonical values fall back safely rather than producing `NaN`, misleading results, changed UI state, or rewritten profile data.
- `bodyUnitPreference` is treated as profile/body-measurement context only; unsupported values must not force canonical sourcing.

## Legacy Fallback Rules

Legacy fallback remains required for:

- profiles created before unit-system integration
- profiles missing canonical fields
- profiles with only one canonical field
- profiles with malformed canonical values
- profiles with unsupported `bodyUnitPreference`
- app-local data restored manually or modified outside expected flows

Fallback must preserve the existing legacy interpretation:

- `height` dot notation means feet/inches compatibility input, not decimal feet.
- `weight` means pounds.
- BMI/BMR continue to use current legacy behavior until a later lane intentionally changes calculation source selection.
- Recreation and EditProgram calorie burn continue to use current pounds-to-kilograms conversion until a later lane intentionally changes calculation source selection.
- Source selection must not repair, rewrite, migrate, or normalize stored profile data on read/open.

## BMI Parity Requirements

Future BMI hardening must prove:

- legacy `height`/`weight` and canonical `heightCentimeters`/`weightKilograms` produce equivalent BMI for known standard examples
- rounding behavior is stable and intentionally documented
- invalid, missing, or partial canonical data falls back safely
- existing valid standard profiles keep the same displayed and derived BMI within the agreed rounding tolerance
- canonical fields do not change output for existing valid standard profiles before the canonical source-selection lane is approved
- mixed canonical/legacy BMI sources remain out of scope unless explicitly tested later

## BMR Parity Requirements

Future BMR hardening must prove:

- legacy inch/pound formulas and canonical metric fields produce equivalent or intentionally documented results
- age, birthday-boundary, gender, and profile dependency behavior remain unchanged unless a dedicated lane changes them
- current valid standard profiles retain expected BMR outputs within the agreed rounding tolerance
- invalid, missing, or partial canonical data falls back safely
- derived `bmr` remains non-canonical and non-durable until a reducer/storage lane changes that contract
- Journal Calories downstream behavior remains stable while BMR source behavior is hardened

## Calorie-Burn Parity Requirements

Future calorie-burn hardening must prove:

- current pounds-to-kilograms conversion behavior is preserved for valid standard profiles
- canonical `weightKilograms` can replace `parseFloat(user.weight, 10) / 2.205` only after parity tests pass
- Recreation and EditProgram source selection remain aligned
- rpm, mph, distance, duration, and plain MET branches keep current behavior unless explicitly changed
- incomplete or invalid profile weight does not produce misleading calorie estimates
- canonical calorie-burn sourcing does not rewrite workout/program entries or stored profile data as part of source selection

## Journal Calories Downstream Requirements

Future Journal Calories hardening must prove:

- downstream use of `user.bmr` and entry `bmr` remains stable
- calorie differential calculations do not change unless a dedicated lane explicitly updates BMR source behavior
- saved `CaloriesEntry` behavior remains compatible with existing entries
- completed-workout calorie totals remain based on already-stored workout calorie values
- Journal Calories does not directly read canonical body fields unless a later lane explicitly scopes and tests that behavior

## Invalid Or Partial Profile Data Rules

Future implementation lanes must handle invalid or partial profile data conservatively:

- Missing canonical height or canonical weight must not force canonical BMI/BMR sourcing.
- Missing canonical weight must not force canonical calorie-burn sourcing.
- Zero, negative, non-finite, non-numeric, or malformed canonical values must fall back to legacy fields when legacy fields are usable.
- Unsupported `bodyUnitPreference` must fall back to current compatibility behavior rather than changing calculations.
- Malformed legacy fields should preserve the current safe behavior unless a later lane explicitly changes error handling.
- Source selection must avoid `NaN`, misleading outputs, unintended UI state changes, and profile rewrites.
- No migration, export, dashboard, Weight Log, or display behavior may be coupled to calculation source selection in this lane.

## Future Test Coverage Inventory

This lane adds no tests. Later lanes must add tests before changing source selection.

Required future coverage:

- BMI legacy path
- BMI canonical path
- BMI fallback path
- BMR legacy path
- BMR canonical path
- BMR fallback path
- Recreation calorie-burn legacy path
- Recreation calorie-burn canonical path
- EditProgram calorie-burn legacy path
- EditProgram calorie-burn canonical path
- Journal Calories downstream BMR behavior
- invalid canonical fields
- missing canonical fields
- partial canonical fields
- malformed legacy fields
- unsupported unit preference
- no migration on read/open
- no export behavior change
- no dashboard behavior change
- no Weight Log behavior change

The tests themselves belong to the future implementation lanes that touch each behavior.

## Future Implementation Lane Boundaries

Recommended future sequence:

1. Calculation parity/source-selection contract, which is this lane.
2. BMI/BMR calculation helper extraction, limited to pure helper implementation and tests.
3. BMI/BMR canonical source implementation, limited to reducer/calculation integration after parity tests exist.
4. Calorie-burn helper extraction, limited to a shared Recreation/EditProgram helper and tests.
5. Calorie-burn canonical source implementation, switching from legacy `user.weight` only after parity tests pass.
6. Journal Calories downstream verification, confirming saved calorie entries and differential behavior after BMR hardening.
7. Weight Log/dashboard display lanes, still separate from calculation source selection.
8. Export semantics lane, still separate from calculation source selection.

Each future lane must state whether it changes calculation behavior, storage behavior, display behavior, or export behavior. Do not combine those surfaces without a separate approved scope.

## Unresolved Risks

- Canonical fields could be treated as source-of-truth before parity proof exists.
- Mixed canonical/legacy BMI/BMR source behavior could produce unreviewed differences.
- Legacy height dot notation could be misread as decimal feet.
- Recreation and EditProgram calorie-burn paths could drift if source selection is changed in only one place.
- Journal Calories could unintentionally change saved entry behavior if BMR derivation changes without downstream verification.
- Invalid canonical fields could produce `NaN`, misleading estimates, or changed UI state if fallback is not explicit.
- Calculation changes could accidentally trigger storage, migration, dashboard, Weight Log, export, or disclosure changes outside their lanes.

## Recommended Next Lane

The recommended next lane is BMI/BMR calculation helper extraction.

That lane should be limited to pure helper extraction and focused tests. It should preserve current legacy `height`/`weight` behavior, prove the current outputs, and prepare a narrow seam for later canonical source selection without reading canonical fields as calculation sources yet.

## Non-Claims

This artifact does not claim or approve:

- medical-grade BMI, BMR, or calorie-burn precision
- canonical fields as current calculation source-of-truth
- source-selection behavior changes in the current app
- profile migrations or profile rewrites
- reducer, storage, UI, Weight Log, dashboard, export, navigation, package, lockfile, CI, or public-doc changes
- cloud accounts, backend sync, import, restore, backup, device transfer, account recovery, or portability behavior
- privacy, disclosure, deletion, export, or support-copy changes
