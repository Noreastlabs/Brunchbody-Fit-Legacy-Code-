# Lane: 1.3.2.3.5 Dashboard And Calculation Consumer Migration Risk Audit

## Status And Scope

This is the internal architecture artifact for `Lane 1.3.2.3.5 Dashboard And Calculation Consumer Migration Risk Audit`.

This lane is docs/audit-only. It audits dashboard and calculation consumers that could be affected by future body-measurement migration work. It does not implement migration, repair stored data, add schema versioning, change dashboard behavior, change BMI/BMR behavior, change calorie-burn behavior, change Weight Log behavior, change Profile/Auth behavior, change tests, or choose a migration strategy.

What changed: one internal architecture artifact only, `docs/architecture/body-measurement-dashboard-calculation-consumer-migration-risk-audit.md`.

What users experience: no app behavior change.

Docs/disclosures required now: none.

This lane does not authorize migration implementation or consumer behavior changes. It records downstream risk surfaces only, so later implementation lanes can define affected consumers, source precedence, conflict handling, invalid-value handling, and focused regression needs before changing persisted Profile or Weight Log body-measurement shapes.

## Evidence Method

Current source and focused tests define current behavior. Older architecture documents are context only where they conflict with current source/tests.

Architecture context inspected:

- `docs/architecture/body-measurement-migration-planning-scope.md`
- `docs/architecture/body-measurement-profile-migration-candidate-inventory.md`
- `docs/architecture/body-measurement-weight-log-migration-candidate-inventory.md`
- `docs/architecture/body-measurement-export-import-boundary-decision.md`
- `docs/architecture/body-measurement-data-shape-cleanup-inventory.md`
- `docs/architecture/measurement-system-final-regression-closeout.md`
- `docs/architecture/migration-invariants-and-repair-policy.md`

Source files inspected:

- `src/redux/reducer/auth.js`
- `src/utils/bodyMetrics.js`
- `src/utils/bodyMeasurementUnits.js`
- `src/utils/calorieBurnMetrics.js`
- `src/screens/dashboard/readModel.js`
- `src/screens/dashboard/components/Carousel.js`
- `src/screens/dashboard/components/Weight.js`
- `src/screens/recreation/pages/Recreation/Recreation.js`
- `src/screens/recreation/pages/EditProgram/EditProgram.js`
- `src/screens/journal/pages/WeightLog/WeightLog.js`

Focused tests inspected:

- `__tests__/authProfileRepair.test.js`
- `__tests__/bodyMetrics.test.js`
- `__tests__/calorieBurnMetrics.test.js`
- `__tests__/dashboardReadModelBoundary.test.js`
- `__tests__/dashboardWeightBoundary.test.js`
- `__tests__/journalFormUxBoundary.test.js`
- `__tests__/recreationFormUxBoundary.test.js`

## Consumer Inventory

| Consumer | Inputs Read | Current Role | Migration Risk | Required Future Guard |
| --- | --- | --- | --- | --- |
| Auth reducer BMI/BMR | `heightCentimeters`, `weightKilograms`, legacy `height`, legacy `weight`, `dob`, `gender` | Derives runtime BMI/BMR | Future profile repair could change source precedence or derived values | Preserve canonical-first, legacy fallback behavior unless explicitly changed |
| Body metric helpers | Metric and imperial body inputs | Calculation helpers | Invalid repair values could feed calculations | Keep invalid/malformed handling explicit |
| Dashboard read model | Weight Log entries | Builds chart data | Future Weight Log repair could change chart source values | Add dashboard regression if Weight Log shape changes |
| Dashboard chart/display | Chart data plus body preference | Displays weight chart in selected unit context | Unit conversion may drift if read-model shape changes | Preserve display semantics or test changed behavior |
| Recreation calorie burn | Profile weight fields | Calculates calorie estimates | Profile migration could change weight source selection | Add calorie-burn regression if profile weight repair changes |
| Edit Program calorie burn | Profile weight fields | Calculates calorie estimates in edit flow | Same as recreation source-selection risk | Add focused regression if touched |

## Current Source-Of-Truth Rules

Current consumer rules are recorded here without changing them:

- BMI/BMR are runtime-derived values, not durable profile migration targets.
- Canonical metric profile fields should remain preferred where valid.
- Legacy profile fields remain compatibility fallback unless a later approved strategy changes that contract.
- Dashboard consumers may depend on Weight Log canonical/legacy source-selection behavior.
- Calorie-burn consumers may depend on Profile weight source-selection behavior.
- Dashboard and calculation behavior must not be changed by inventory or planning lanes.
- Current dashboard read model behavior prefers valid `WeightLog.weightKilograms`, converts it to pound chart values, and falls back to legacy `WeightLog.weight` or `0` when canonical kg is absent or invalid.
- Current dashboard display behavior leaves pound read-model values in pounds for standard fallback and converts them to kilograms for metric display.
- Current calorie-burn behavior prefers valid numeric profile `weightKilograms` and falls back to legacy profile `weight` pounds when canonical kg is missing or invalid.

## Migration Risk Scenarios

These are risk scenarios for later lanes only. This artifact does not solve them.

- A future Profile repair backfills `weightKilograms` from legacy `weight`, changing BMI/BMR or calorie-burn outputs.
- A future Weight Log repair backfills `weightKilograms`, changing dashboard chart values.
- Canonical and legacy fields conflict, and a future lane chooses the wrong source silently.
- Invalid, zero, blank, non-finite, or malformed values become calculation inputs.
- A future lane deletes or stops preserving legacy fields before all consumers are updated.
- Display units drift from stored source units.
- Dashboard/export tests fail because a storage-shape change affected downstream consumers.
- A future lane treats derived BMI/BMR values as durable repair targets instead of reducer-derived runtime output.
- A future lane changes Profile or Weight Log source-selection behavior without focused dashboard, BMI/BMR, or calorie-burn regression coverage.

## Non-Goals And Non-Claims

This artifact does not:

- change dashboard output;
- change chart labels;
- change BMI/BMR calculations;
- change calorie-burn calculations;
- change Weight Log storage;
- change Profile storage;
- change export behavior;
- change import/restore/backup behavior;
- approve migration strategy;
- approve schema versioning;
- approve deletion of legacy fields;
- recommend deleting legacy `height`, `weight`, or `WeightLog.weight`;
- change Profile/Auth reducer behavior;
- change Weight Log save, input, or display behavior;
- change public docs, privacy/disclosure files, support copy, release notes, routes, navigation, package files, lockfiles, or CI;
- make medical, clinical, diagnostic, or precision claims.

This artifact also does not decide between no migration, lazy repair, or explicit versioned migration. That decision belongs to a later approved strategy lane.

## Future Implementation Readiness Notes

Any future migration implementation touching Profile or Weight Log data is not ready unless it defines:

- affected consumers;
- source-of-truth precedence;
- canonical/legacy conflict handling;
- invalid/malformed value handling;
- whether repair writes back to storage or normalizes in memory;
- required focused tests for touched consumer surfaces;
- dashboard regression needs if Weight Log shape changes;
- BMI/BMR regression needs if Profile shape changes;
- calorie-burn regression needs if Profile weight behavior changes;
- no export/import/backup/sync/cloud/account/privacy drift.

Future implementation must keep export/import/backup/sync/cloud/account/privacy behavior out of scope unless a later lane explicitly opens that product area. Export may be referenced as an adjacent consumer risk only; this artifact does not infer export, import, restore, backup, sync, cloud, account, or cross-device behavior from dashboard or calculation risks.

## Recommended Test Coverage Map For Later Lanes

No tests are added in this lane. This table records likely future test coverage only.

| Future Change Type | Likely Test Coverage |
| --- | --- |
| Profile canonical repair | `authProfileRepair.test.js`, `bodyMetrics.test.js`, `calorieBurnMetrics.test.js`, `recreationFormUxBoundary.test.js` |
| Weight Log canonical repair | `journalFormUxBoundary.test.js`, `dashboardReadModelBoundary.test.js`, `dashboardWeightBoundary.test.js` |
| Dashboard source-selection change | `dashboardReadModelBoundary.test.js`, `dashboardWeightBoundary.test.js` |
| BMI/BMR source-selection change | `authProfileRepair.test.js`, `bodyMetrics.test.js` |
| Calorie-burn source-selection change | `calorieBurnMetrics.test.js`, `recreationFormUxBoundary.test.js` |

## Acceptance Notes

Acceptance for this lane is:

- Exactly one new artifact is created: `docs/architecture/body-measurement-dashboard-calculation-consumer-migration-risk-audit.md`.
- The artifact is docs/audit-only.
- The artifact inventories dashboard and calculation consumers affected by future body-measurement migration work.
- The artifact includes dashboard read model, dashboard display, Auth/Profile BMI/BMR, body metric helpers, and recreation calorie-burn consumers.
- The artifact records consumer risks without solving or implementing them.
- The artifact does not implement or authorize migration.
- The artifact does not decide no migration vs lazy repair vs explicit versioned migration.
- The artifact does not change Profile/Auth, Weight Log, dashboard, export, import, restore, backup, sync, cloud, account, or cross-device behavior.
- The artifact does not recommend deleting legacy height, weight, or `WeightLog.weight`.
- No app source files are changed.
- No tests are changed.
- No package files, lockfiles, CI, routes, navigation, public docs, privacy/disclosure files, support copy, or release files are changed.
- `git diff --check` passes.
- `git status --short --untracked-files=all` truthfully reports the new artifact plus any pre-existing unrelated or prior-lane untracked files.

Verification plan for this docs-only lane:

```sh
git diff --check
git status --short --untracked-files=all
```

No app tests are required because this lane is docs-only and does not change source or test files.

Final non-claims for this lane:

- No dashboard or calculation behavior was changed.
- No migration strategy was chosen.
- No export, import, restore, backup, sync, cloud, account, or cross-device behavior was changed or claimed.
- No medical, clinical, diagnostic, or precision claim was added.
