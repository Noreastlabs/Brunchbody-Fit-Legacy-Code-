# Lane: 1.3.2.3.3 Weight Log Migration Candidate Inventory

## Status And Scope

This is the internal architecture artifact for `Lane 1.3.2.3.3 Weight Log Migration Candidate Inventory`.

This lane is docs/audit-only and Weight Log-only. It follows `1.3.2.3.1 Migration Scope And Non-Goal Record` and `1.3.2.3.2 Profile Migration Candidate Inventory`, then narrows the next planning step to the Weight Log journal payload seam only.

What changed: one internal architecture artifact only, `docs/architecture/body-measurement-weight-log-migration-candidate-inventory.md`.

What users experience: no app behavior change.

Docs/disclosures required now: none.

This lane does not authorize migration implementation. It does not repair Weight Log entries, add schema versioning, change storage behavior, change journal behavior, change dashboard behavior, change export behavior, change tests, decide a migration strategy, or choose between no migration, lazy repair, and explicit versioned migration.

## Evidence Method

Current source and focused tests define current behavior. Older architecture documents are context only where they conflict with current source/tests. Future implementation lanes must verify current source and focused tests before making changes.

Source files inspected:

- `src/screens/journal/pages/WeightLog/WeightLog.js`
- `src/screens/journal/components/WeightLog.js`
- `src/redux/actions/journal.js`
- `src/screens/dashboard/readModel.js`
- `src/screens/dashboard/components/Carousel.js`
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js`
- `src/utils/bodyMeasurementUnits.js`

Focused tests inspected:

- `__tests__/journalFormUxBoundary.test.js`
- `__tests__/dashboardReadModelBoundary.test.js`
- `__tests__/dashboardWeightBoundary.test.js`
- `__tests__/exportToCsvBoundary.test.js`
- `__tests__/bodyMeasurementUnits.test.js`

Architecture context inspected:

- `docs/architecture/body-measurement-migration-planning-scope.md`
- `docs/architecture/body-measurement-profile-migration-candidate-inventory.md`
- `docs/architecture/body-measurement-data-shape-cleanup-inventory.md`
- `docs/architecture/body-measurement-export-unit-semantics.md`
- `docs/architecture/migration-invariants-and-repair-policy.md`
- `docs/architecture/measurement-system-final-regression-closeout.md`

## Weight Log Field Inventory

| Field | Current Role | Classification | Migration Candidate? | Notes |
| --- | --- | --- | --- | --- |
| `WeightLog.weight` | Stored source value. | legacy/source compatibility field | Yes, preservation/compatibility candidate. | Treat as pounds unless later strategy changes contract. |
| `WeightLog.weightKilograms` | Stored canonical kg context. | canonical authoritative field where present | Yes, preservation/repair-planning candidate. | Do not remove. |
| `enteredWeightValue` | Original edited/display input value. | input provenance/display-context field | Maybe, preservation candidate. | Do not treat as source of truth. |
| `enteredWeightUnit` | Original edited/display input unit. | input provenance/display-context field | Maybe, preservation candidate. | `kg` or `lb` when present. |
| `note` | User note text. | non-body journal field | No body-measurement migration candidate. | Preserve as ordinary journal content. |
| `isDeleted` | Journal deletion/filter marker. | journal lifecycle field | No body-measurement migration candidate. | Do not reinterpret in body migration lane. |

## Current Source-Of-Truth Rules

Current Weight Log source rules:

- `WeightLog.weight` is the legacy/source value.
- `WeightLog.weight` is treated as pounds for compatibility.
- Current Weight Log source explicitly comments that `weight` remains the legacy/source pounds value and kg is canonical context.
- `WeightLog.weightKilograms` is the canonical kilogram field where present.
- Metric input is converted into a legacy/source pounds value plus canonical kg.
- Standard input stores legacy/source pounds plus derived canonical kg.
- `enteredWeightValue` and `enteredWeightUnit` are provenance/display-context fields, not canonical source-of-truth fields.
- Existing input provenance fields may be preserved when present.
- Weight Log display/input can vary by `bodyUnitPreference`, but stored source/canonical semantics must remain explicit.
- Weight Log save may update Profile with both `weight` and `weightKilograms`, but this lane must not infer Profile migration rules from Weight Log behavior.
- Dashboard/export behavior must not be changed in this lane.

## Candidate Migration Questions

These questions belong to later lanes only. This lane records them but does not answer them.

- Should future Weight Log repair backfill `weightKilograms` from valid legacy `WeightLog.weight`?
- Should future Weight Log repair preserve or reconstruct `enteredWeightValue` / `enteredWeightUnit`?
- Should unsupported or missing profile `bodyUnitPreference` affect Weight Log migration, or only display/input/export context?
- Should conflicting `weight` and `weightKilograms` prefer canonical kg, legacy pounds, or stop/defer?
- Should repair write back to persisted journal entries or normalize only at read time?
- Should Weight Log repair be lazy, explicit versioned migration, or no migration?
- What should happen to invalid, blank, non-finite, zero, or negative Weight Log values?

## Non-Candidates

The following are not body-measurement migration targets in this lane:

- `note`
- `isDeleted`
- journal entry `createdOn`
- journal entry wrapper IDs
- Profile fields
- dashboard read-model fields
- export-only context fields, including:
  - `weight_source_value`
  - `weight_source_unit`
  - `weight_display_value`
  - `weight_display_unit`
  - `weight_canonical_value`
  - `weight_canonical_unit`
- import/restore/backup fields
- sync/account/cloud metadata

## Consumer Risk Notes

Weight Log data feeds other surfaces. This artifact records consumer risks without changing them.

- Dashboard consumers may read Weight Log entries and should not be changed by this inventory lane.
- Export consumers may include raw Weight Log payload plus added unit context, but export schema/output is out of scope. The current export surface already adds source/display/canonical weight context for Weight Log rows.
- Profile update behavior after Weight Log save is adjacent but not owned by this lane.
- Future implementation lanes must define consumer tests before changing persisted Weight Log shape.

## Future Implementation Readiness Notes

A Weight Log migration implementation lane is not ready until it defines:

- exact repair strategy;
- source-of-truth precedence;
- canonical/legacy conflict handling;
- malformed value handling;
- blank/non-finite/invalid value handling;
- whether repair writes back to storage or normalizes in memory only;
- whether provenance fields are preserved, reconstructed, ignored, or left untouched;
- focused Weight Log tests;
- focused dashboard/export regression tests if touched;
- no privacy/disclosure drift;
- no import/restore/backup/sync/cloud/account claims.

Future implementation must remain Weight Log-only unless a later lane explicitly reopens scope. It must not use this inventory to change Profile/Auth, dashboard, export, import, restore, backup, sync, cloud, account, cross-device, public-docs, privacy/disclosure, support-copy, release, route, navigation, package, lockfile, CI, or test behavior by implication.

## Acceptance Notes

Acceptance for this lane is:

- Exactly one new artifact is created: `docs/architecture/body-measurement-weight-log-migration-candidate-inventory.md`.
- The artifact is Weight Log-only.
- The artifact classifies all required Weight Log fields.
- The artifact distinguishes:
  - canonical authoritative fields;
  - legacy/source compatibility fields;
  - input provenance/display-context fields;
  - non-body journal fields;
  - journal lifecycle fields;
  - export-only context fields.
- The artifact does not implement or authorize migration.
- The artifact does not decide no migration vs lazy repair vs explicit versioned migration.
- The artifact does not touch Profile/Auth, dashboard, export, import, restore, backup, sync, cloud, account, or cross-device behavior.
- The artifact does not recommend deleting legacy `WeightLog.weight`.
- No app source files are changed.
- No tests are changed.
- No package files, lockfiles, CI, routes, navigation, public docs, privacy/disclosure files, support copy, or release files are changed.
- `git diff --check` passes.
- `git status --short --untracked-files=all` shows the new artifact plus the already-untracked prior planning artifacts, expected as:

```text
?? docs/architecture/body-measurement-migration-planning-scope.md
?? docs/architecture/body-measurement-profile-migration-candidate-inventory.md
?? docs/architecture/body-measurement-weight-log-migration-candidate-inventory.md
```

unless other pre-existing unrelated changes are explicitly called out.

Pre-existing working-tree caveat for this implementation pass: `docs/architecture/body-measurement-migration-planning-scope.md` and `docs/architecture/body-measurement-profile-migration-candidate-inventory.md` are already tracked in this branch. If final status shows only the new Weight Log artifact, that is the observed branch state rather than a scope expansion.

Non-claims for this lane:

- This lane does not choose a migration strategy.
- This lane does not repair or normalize stored Weight Log entries.
- This lane does not add schema versioning.
- This lane does not change storage, journal reducer behavior, dashboard behavior, export output, Profile/Auth behavior, import, restore, backup, sync, cloud, account, cross-device behavior, privacy/disclosure text, public docs, support copy, release notes, routes, navigation, packages, lockfiles, CI, or tests.
- This lane does not delete or recommend deleting legacy `WeightLog.weight`.
