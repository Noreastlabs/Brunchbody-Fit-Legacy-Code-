# Unit System Evidence Audit And Model Contract

## Status And Scope

This is an internal architecture and evidence artifact for `Lane 1.3.1.1 Unit System Evidence Audit And Model Contract`.

This lane records current repo evidence, approved product decisions, candidate affected surfaces for later work, future test coverage inventory, and unresolved risks for body measurement unit support.

This lane is docs/audit-only. It changes no app source, tests, persisted data, export output, calculation logic, routes, reducers, storage helpers, migrations, user-facing copy, privacy posture, backend behavior, account model, import behavior, restore behavior, backup behavior, sync behavior, or platform disclosure material.

What changed: one internal architecture artifact only.

What users experience: no user-facing change.

Docs/disclosures required: no public docs, store disclosures, privacy policy text, release notes, or support copy are changed by this lane. Future implementation lanes that affect visible behavior, exports, storage, calculations, or disclosures must trigger their own review.

## Evidence Basis

This artifact is evidence-first. Source code and current architecture records outrank roadmap intent or older wording.

Evidence inputs for this lane:

- `docs/architecture/Brunch Body Project Scope.md` includes metric and standard measurement support in Phase 1 scope, including canonical unit model, conversion utilities, profile input updates, display formatting changes, calculation hardening, export behavior definitions, and tests.
- `docs/architecture/phase-1-profile-only-account-model.md` records that the Phase 1 user-facing model is a device-local `Profile` used for nickname, vitals, personalization, calculations, and display, with no accounts, backend sync, account recovery, or cross-device continuity.
- `docs/architecture/data-export-and-portability-controls.md` records that current export behavior is selected journal `.xlsx` export only, not full backup, import, restore, cloud sync, or device-transfer behavior.
- `src/redux/actions/profileStorage.js` owns the direct `user_profile` storage key and strips durable derived profile fields `bmi` and `bmr`.
- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js` hydrates onboarding draft values for `height` and `weight`, stores height as a dot-separated string through `getStoredHeightValue({feet, inches})`, and validates weight as a whole-number field.
- `src/screens/setting/pages/MyProfile/MyVitals.js` reads and writes the same feet/inches dot-notation profile height shape for Profile details.
- `src/redux/reducer/auth.js` treats `height` as a string split on `.`, interprets the first segment as feet and the second segment as inches, converts that to total inches, parses `weight` as a number, strips derived incoming fields, and derives BMI/BMR locally.
- `src/screens/setting/pages/MyProfile/MyProfile.js` displays current profile weight with a hard-coded `LBS` label and displays BMR as calories.
- `src/screens/journal/components/WeightLog.js` labels Weight Log input as pounds, while `src/screens/journal/pages/WeightLog/WeightLog.js` stores the entered weight in a `WeightLog` payload and updates the local profile weight after a successful save.
- `src/screens/dashboard/readModel.js` reads `WeightLog.weight` into chart data, and `src/screens/dashboard/components/Carousel.js` labels the weight chart as `Weight (lbs)`.
- `src/screens/recreation/pages/Recreation/Recreation.js` and `src/screens/recreation/pages/EditProgram/EditProgram.js` calculate exercise calories using `parseFloat(user.weight, 10) / 2.205`, which assumes current profile weight is pounds before converting to kilograms for MET math.
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js` exports selected journal entry payloads into an `.xlsx` workbook by spreading the selected entry payload into worksheet rows. Current body measurement rows do not have an explicit unit contract beyond the current source payload shape.
- `src/resources/WheelPickerItems.js`, `src/screens/nutrition/pages/MealDetail/MealDetail.js`, supplement screens, and recreation exercise forms already contain domain-specific unit choices. Those units are not body-profile measurement preferences and are out of scope for this contract.

## Current Body Measurement Evidence Matrix

| Surface | Current evidence | Current unit assumption | Classification for this lane |
| --- | --- | --- | --- |
| Direct profile storage | `user_profile` persists direct profile fields through `profileStorage.js`; `bmi` and `bmr` are stripped before durable storage. | Height and weight are direct profile inputs; derived BMI/BMR are not durable canonical fields. | Current evidence only; no storage changes approved. |
| Onboarding height | `CompleteProfile.js` stores height with `getStoredHeightValue({feet, inches})` as a dot-separated string. | Dot notation means feet and inches text. | Legacy compatibility input. |
| Onboarding weight | `CompleteProfile.js` stores trimmed weight after whole-number validation. | Pounds-first current behavior. | Legacy compatibility input. |
| Profile details height | `MyVitals.js` parses and writes the same dot-separated feet/inches shape. | Feet and inches. | Candidate future profile slice. |
| Profile summary weight | `MyProfile.js` renders `${weight} LBS`. | Pounds. | Candidate future display slice. |
| BMI/BMR | `auth.js` derives BMI with the imperial BMI factor `703` and BMR with pound/inch formulas. | Pounds and inches. | Candidate future calculation hardening slice. |
| Weight Log | Weight Log visible copy says `Enter Weight (lbs)` and stores `WeightLog.weight`. | Pounds. | Candidate future journal/display slice. |
| Dashboard weight chart | Dashboard read model uses `WeightLog.weight`; carousel legend says `Weight (lbs)`. | Pounds. | Candidate future dashboard slice. |
| Exercise calorie burn | Recreation and EditProgram convert `user.weight` from pounds to kilograms using `/ 2.205`. | Pounds source weight. | Candidate future calculation hardening slice. |
| Selected journal export | Export spreads selected entry payload rows into `.xlsx` output. | Existing body fields are unlabeled except by current payload names and UI context. | Candidate future export semantics slice. |

## Approved Model Contract

Future body measurement implementation should use metric canonical values internally:

- canonical height unit: centimeters
- canonical weight unit: kilograms

Future user-facing body measurement preference should be one local profile-level preference with these allowed values:

- `standard`
- `metric`

The preference is for profile/body measurements only. It must not be inferred per field and must not create mixed body states such as height in centimeters and weight in pounds for the same profile preference.

Legacy or unspecified local profiles are interpreted as `standard` for compatibility planning only. This lane must not write a new preference field, change existing profiles, or migrate persisted values.

Legacy dot-notation height strings, including values such as `5.06`, must be documented as feet/inches compatibility input. The segment after the dot is inches text, not decimal feet. For example, `5.06` means 5 feet 6 inches, not 5.06 feet.

BMI and BMR remain derived values. They must not become trusted durable canonical profile fields.

Body measurements in future exports must never be unlabeled once unit-system work touches export output. Future export semantics should include explicit unit labels and enough canonical/display context to avoid ambiguity, without implying import, restore, backup, sync, account continuity, or portability support.

## Candidate Affected Surfaces For Later Lanes

Later body-measurement implementation lanes may affect:

- profile and onboarding body measurement inputs
- Profile details display
- Current Weight display
- Weight Log entry and edit behavior
- dashboard weight chart labels and chart data
- BMI and BMR calculation paths
- calorie-burn calculations that depend on profile body weight
- selected journal export body fields
- tests for the specific slice being changed

This lane only documents and classifies those surfaces. It does not modify or test them.

## Out-Of-Scope Unit Domains

The following unit systems are out of scope for this body measurement contract and require separate model decisions before broad changes:

- nutrition serving units such as grams, kilograms, pounds, and ounces
- supplement units such as micrograms, milligrams, grams, tablespoons, pounds, or ounces
- exercise distance, time, and repetition units such as yards, meters, kilometers, miles, reps, seconds, minutes, and hours
- future domain-specific units for goals, habits, routines, plans, imports, exports, backups, or integrations

Do not use the profile body measurement preference to rewrite or reinterpret these domain-specific unit systems.

## Future Lane Sequence

Recommended sequence after this contract:

1. Evidence audit and model contract doc.
2. Conversion utility lane.
3. Profile/onboarding body measurement slice.
4. Calculation hardening lane.
5. Weight Log and dashboard display lane.
6. Export semantics lane.

Each later lane should remain narrow, state whether it changes storage or display only, define its own tests, and preserve local-first/profile-only vocabulary.

## Future Test Coverage Inventory

This lane adds no tests. The following cases should be recorded for future implementation lanes:

- metric canonical height in centimeters and weight in kilograms
- standard display formatting for feet/inches and pounds
- metric display formatting for centimeters and kilograms
- rounding rules for kg/lb and cm/ft-in display
- invalid height and weight input in both supported body systems
- legacy `5.06` height parsing as 5 feet 6 inches
- legacy unspecified profile preference defaulting to `standard` for compatibility
- no durable trust in incoming `bmi` or `bmr` values
- BMI parity for known standard and metric-equivalent inputs
- BMR parity for known standard and metric-equivalent inputs
- calorie-burn consumers receiving canonical or explicitly converted weight
- Weight Log entry, edit, profile-update, and display behavior under the chosen body preference
- dashboard chart labels and chart data under the chosen body preference
- selected journal export body fields including explicit unit labels and canonical/display context
- no changes to nutrition serving units, supplement units, or exercise distance/time/reps units unless a separate lane approves them

The tests themselves are deferred to the relevant implementation lanes.

## Unresolved Risks

- Existing persisted `height` and `weight` values may be ambiguous if code treats dot-notation height as decimal feet instead of feet/inches text.
- Current body-weight consumers are scattered across profile, journal, dashboard, recreation, and export surfaces.
- Converting existing local values too early could change what users see and damage trust.
- Export column or row changes can create portability, backup, import, restore, and disclosure drift if handled outside a dedicated export lane.
- A broad app-wide unit preference could conflict with existing nutrition, supplement, and exercise unit systems.
- Calculation parity must be proven before any BMI, BMR, or calorie-burn behavior changes ship.

## Implementation Preconditions For Later Lanes

Before a later lane changes body measurement behavior, it must define:

- exact storage fields added, read, written, migrated, or left untouched
- whether the lane changes persisted data or only read/display behavior
- compatibility treatment for legacy `height` and `weight` values
- rounding and formatting rules
- calculation inputs and expected parity cases
- export field names, units, and disclosure impact if export is touched
- tests for the specific slice
- user-facing copy and disclosure review needs when visible behavior changes

No later implementation lane should rely on this artifact alone as proof that migration, export/import, restore, backup, sync, or device transfer exists.

## Acceptance Notes

This lane is complete when this internal artifact exists and records:

- current body measurement storage evidence
- current calculation consumers
- current display and export surfaces
- approved Phase 1 unit-system model contract
- candidate affected surfaces for later lanes
- future lane order
- future test coverage inventory
- unresolved risks

No app source, tests, reducers, storage helpers, UX copy, export behavior, route behavior, migration behavior, or calculation behavior are approved or changed by this lane.

## Non-Claims

This record does not approve:

- implementation of conversion utilities
- source code changes
- test changes
- new profile fields
- persisted data migration
- export column changes
- import, restore, backup, sync, or portability behavior
- backend accounts or cloud profile storage
- app-wide unit settings
- per-field body unit preferences
- medical, clinical, diagnostic, treatment, prevention, or medical-grade precision claims

unit_system_evidence_audit_and_model_contract_recorded
