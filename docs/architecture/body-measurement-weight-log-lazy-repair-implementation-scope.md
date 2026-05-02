# Lane: 1.3.2.3.8 Weight Log Lazy Repair Implementation Scope

## Status And Scope

This is the internal architecture artifact for `Lane 1.3.2.3.8 Weight Log Lazy Repair Implementation Scope`.

This lane is docs-only and scoping-only. It defines the future implementation boundary for Weight Log-only Lazy Repair of body-measurement fields. It does not implement repair, change app behavior, change storage behavior, change journal behavior, change tests, or authorize a storage migration.

What changed: one internal architecture artifact only, `docs/architecture/body-measurement-weight-log-lazy-repair-implementation-scope.md`.

What users experience: no app behavior change.

Docs/disclosures required now: none.

This lane scopes a future implementation only. This lane does not implement repair.

Actual Weight Log repair implementation remains blocked until `1.3.2.3.9 Migration Test Matrix` is completed or explicitly folded into a later approved implementation lane.

This lane does not change app source, tests, storage reads or writes, AsyncStorage behavior, MMKV behavior, schema versioning, startup behavior, Redux Persist behavior, journal reducer behavior, Weight Log input behavior, Weight Log display behavior, Weight Log save behavior, Profile behavior, Auth behavior, dashboard read-model behavior, chart behavior, export output, `.xlsx` schema, import behavior, restore behavior, backup behavior, sync behavior, cloud behavior, account behavior, cross-device continuity, routes, navigation, package files, lockfiles, CI, public docs, privacy/disclosure files, support copy, or release notes.

## Evidence Method

Current source and focused tests define current behavior. Older architecture documents are context only where they conflict with current source/tests.

Architecture context inspected:

- `docs/architecture/body-measurement-migration-planning-scope.md`
- `docs/architecture/body-measurement-profile-migration-candidate-inventory.md`
- `docs/architecture/body-measurement-weight-log-migration-candidate-inventory.md`
- `docs/architecture/body-measurement-export-import-boundary-decision.md`
- `docs/architecture/body-measurement-dashboard-calculation-consumer-migration-risk-audit.md`
- `docs/architecture/body-measurement-migration-strategy-decision.md`
- `docs/architecture/body-measurement-profile-lazy-repair-implementation-scope.md`
- `docs/architecture/body-measurement-data-shape-cleanup-inventory.md`
- `docs/architecture/migration-invariants-and-repair-policy.md`
- `docs/architecture/measurement-system-final-regression-closeout.md`

Source files inspected:

- `src/screens/journal/pages/WeightLog/WeightLog.js`
- `src/screens/journal/components/WeightLog.js`
- `src/redux/actions/journal.js`
- `src/screens/dashboard/readModel.js`
- `src/screens/dashboard/components/Carousel.js`
- `src/screens/dashboard/components/Weight.js`
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js`
- `src/utils/bodyMeasurementUnits.js`

Focused tests inspected:

- `__tests__/journalFormUxBoundary.test.js`
- `__tests__/dashboardReadModelBoundary.test.js`
- `__tests__/dashboardWeightBoundary.test.js`
- `__tests__/exportToCsvBoundary.test.js`
- `__tests__/bodyMeasurementUnits.test.js`

Current behavior evidence for this scope:

- Weight Log save currently stores `WeightLog.weight` as the legacy/source pounds value and `WeightLog.weightKilograms` as canonical kg context.
- Current Weight Log source preserves existing input provenance fields only when both `enteredWeightValue` and `enteredWeightUnit` are already present on an unedited entry.
- Current Weight Log source records edited input provenance as `enteredWeightValue` plus `enteredWeightUnit`, but those fields are display/input context rather than canonical source-of-truth fields.
- Dashboard read model currently prefers valid `WeightLog.weightKilograms`, converts it to pound chart values, and falls back to legacy `WeightLog.weight` when canonical kg is absent or invalid.
- Export currently preserves raw Weight Log fields while adding source, display, and canonical weight context for exported Weight Log rows.

## Selected Strategy Context

Lazy Repair is the selected Phase 1 body-measurement migration strategy. That selection does not itself authorize implementation.

Lazy Repair is bounded. A later implementation lane may touch only the approved surface, only when current source-of-truth fields and safe fallbacks are explicit, and only when repair is deterministic and tested.

Profile repair and Weight Log repair remain separate. A Weight Log-only repair lane must not infer Profile/Auth behavior, dashboard behavior, export behavior, import behavior, restore behavior, backup behavior, sync behavior, cloud behavior, account behavior, or cross-device behavior.

Valid existing payloads must be preserved. Valid canonical fields must not be rewritten merely because legacy/source fields also exist. Legacy/source fields must remain preserved for compatibility.

Explicit schema versioning and broad startup migration remain deferred unless a later approved lane reopens them.

Import, restore, backup, sync, cloud, account, and cross-device continuity remain out of scope.

The selected strategy previously named `1.3.2.3.9 Migration Test Matrix` before implementation. This lane may proceed as a docs-only scope artifact, but actual Weight Log repair implementation remains blocked until that test matrix is completed or explicitly folded into the later implementation lane.

## Weight Log Repair Scope Candidate Table

| Field / Case | Current Role | Future Repair Eligibility | Required Rule |
| --- | --- | --- | --- |
| `WeightLog.weightKilograms` present and valid | Canonical Weight Log kg context | Preserve | Do not rewrite |
| `WeightLog.weightKilograms` missing + `WeightLog.weight` valid | Missing canonical kg context | Eligible for future deterministic backfill | Convert legacy/source pounds to kg |
| `WeightLog.weightKilograms` invalid + `WeightLog.weight` valid | Conflicted/invalid canonical case | Defer unless later rule approves | Do not silently overwrite |
| `WeightLog.weight` | Legacy/source Weight Log value | Preserve | Treat as pounds unless a later strategy changes contract |
| `enteredWeightValue` present | Input provenance/display-context value | Preserve if present unless later rule approves otherwise | Do not treat as source of truth |
| `enteredWeightUnit` present | Input provenance/display-context unit | Preserve if present unless later rule approves otherwise | Do not treat as source of truth |
| `enteredWeightValue` / `enteredWeightUnit` missing | Missing provenance case | Defer or leave absent unless future rule approves | Do not reconstruct by guessing |
| `note` | User journal note | Not a body-measurement repair target | Preserve as ordinary journal content |
| `isDeleted` | Journal lifecycle/filter marker | Not a body-measurement repair target | Do not reinterpret in body migration lane |

## Future Repair Rules

A later Weight Log Lazy Repair implementation must follow these rules:

- Repair only the Weight Log journal payload seam.
- Preserve valid canonical `WeightLog.weightKilograms`.
- Preserve legacy/source `WeightLog.weight`.
- Backfill canonical kg only when deterministic from valid legacy/source pounds.
- Do not silently resolve canonical/source conflicts.
- Do not guess on blank, malformed, zero, negative, non-finite, or unsupported values.
- Do not reconstruct provenance fields unless a later implementation lane defines a safe rule.
- Do not treat `enteredWeightValue` or `enteredWeightUnit` as canonical source-of-truth fields.
- Do not infer Profile repair behavior from Weight Log behavior.
- Do not change dashboard, export, import, backup, sync, cloud, account, or privacy/disclosure behavior.
- Do not add schema versioning unless a later approved lane explicitly reopens that decision.
- Do not run a broad startup migration.
- Do not delete legacy/source `WeightLog.weight`.
- Preserve current local-first/device-local Phase 1 posture.

## Conflict And Defer Cases

The following cases must stop or defer in a future implementation lane unless that lane explicitly defines a safe rule:

- valid `WeightLog.weightKilograms` conflicts with valid `WeightLog.weight`;
- invalid `WeightLog.weightKilograms` plus valid `WeightLog.weight`;
- valid `WeightLog.weightKilograms` plus invalid legacy/source `WeightLog.weight`;
- blank, zero, negative, non-finite, malformed, or unsupported weight values;
- missing `WeightLog.weight` and missing `WeightLog.weightKilograms`;
- missing provenance fields;
- provenance fields that conflict with source/canonical fields;
- deleted entries where repair could affect lifecycle semantics;
- any case where repair would require changing Weight Log UI, dashboard display, export output, import/restore/backup behavior, or privacy/disclosure language.

Missing or conflicting provenance fields must not be reconstructed by guessing. Any future behavior beyond preserving known fields or leaving absent fields absent must be explicitly scoped and tested by the later implementation lane.

## Consumer Guardrails

A future Weight Log repair implementation may affect downstream consumers and must account for them before claiming completion.

- Dashboard read model may depend on Weight Log source/canonical selection.
- Dashboard chart/display may depend on read-model unit assumptions.
- Export may include raw Weight Log payload plus unit-context fields, but export changes are out of scope unless separately approved.
- Profile update behavior after Weight Log save is adjacent but not owned by Weight Log repair planning.
- Future implementation must include focused consumer tests if repair changes source availability or selection.

This artifact does not authorize dashboard, export, Profile/Auth, import, restore, backup, sync, cloud, account, or privacy/disclosure behavior changes.

## Future Test Requirements

Do not add tests in this lane. This lane records future test requirements only.

Future Weight Log Lazy Repair implementation should include or update focused tests for:

- canonical `WeightLog.weightKilograms` preserved when valid;
- missing `WeightLog.weightKilograms` backfilled from valid legacy/source `WeightLog.weight`;
- legacy/source `WeightLog.weight` preserved;
- `enteredWeightValue` and `enteredWeightUnit` preserved when present;
- missing provenance fields left absent unless future rule says otherwise;
- invalid, malformed, non-finite, zero, negative, unsupported, and conflict cases deferred or explicitly handled;
- dashboard read model remains stable if repaired canonical kg changes availability;
- dashboard display remains stable if read-model assumptions are preserved;
- export behavior remains unchanged unless separately approved;
- no Profile/Auth behavior changes.

Likely relevant suites:

- `__tests__/journalFormUxBoundary.test.js`
- `__tests__/dashboardReadModelBoundary.test.js`
- `__tests__/dashboardWeightBoundary.test.js`
- `__tests__/exportToCsvBoundary.test.js`
- `__tests__/bodyMeasurementUnits.test.js`

No app tests are required for this lane because it changes no source or test files.

## Implementation Non-Authorization

This artifact scopes a future implementation lane. It does not authorize Codex to implement Weight Log repair in this lane.

Future eligible repair cases are not executable requirements until a later implementation lane restates them with exact tests and acceptance criteria.

Lazy Repair selection permits future narrow repair lanes only after the needed test matrix and per-surface implementation scope are approved.

This artifact does not authorize storage writes, storage migration, schema versioning, broad startup migration, Redux Persist changes, journal reducer behavior changes, Weight Log input/display/save behavior changes, Profile/Auth behavior changes, dashboard behavior changes, export/import behavior changes, backup behavior changes, sync/cloud/account behavior changes, privacy/disclosure changes, support-copy changes, release-note changes, route changes, navigation changes, package changes, lockfile changes, or CI changes.

## Acceptance Notes

Acceptance criteria:

- Exactly one new artifact is created: `docs/architecture/body-measurement-weight-log-lazy-repair-implementation-scope.md`.
- The artifact is docs/scoping-only.
- The artifact is Weight Log-only.
- The artifact defines future Weight Log Lazy Repair eligibility without implementing repair.
- The artifact preserves legacy/source `WeightLog.weight`.
- The artifact does not recommend deleting legacy/source `WeightLog.weight`.
- The artifact does not authorize silent canonical/source conflict repair.
- The artifact does not treat `enteredWeightValue` or `enteredWeightUnit` as canonical source-of-truth fields.
- The artifact does not reinterpret `note` or `isDeleted` as body-measurement migration targets.
- The artifact states actual implementation remains blocked until the test matrix and future implementation lane are approved.
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

No app tests are required because this lane changes no source or test files.

Non-claims:

- No app behavior was changed.
- No Weight Log repair was implemented.
- No storage write or storage migration was added.
- No schema versioning was added.
- No broad startup migration was added.
- No Redux Persist behavior was changed.
- No journal reducer behavior was changed.
- No Weight Log input, display, or save behavior was changed.
- No Profile/Auth behavior was changed.
- No dashboard behavior was changed.
- No export schema or `.xlsx` behavior was changed.
- No import, restore, backup, sync, cloud, account, or cross-device behavior was changed.
- No public docs, privacy/disclosure files, support copy, release notes, routes, navigation, package files, lockfiles, or CI files were changed.
- No legacy/source `WeightLog.weight` deletion was approved.
- No silent canonical/source conflict repair was approved.
- No `enteredWeightValue` or `enteredWeightUnit` canonical source-of-truth role was approved.
- No `note` or `isDeleted` body-measurement migration target role was approved.

Risks and notes:

- Main risk: treating this scope artifact as permission to implement Weight Log repair immediately. It is not.
- Secondary risk: treating provenance fields as canonical source-of-truth fields. Do not permit that here.
- Do not delete legacy/source `WeightLog.weight`.
- Do not choose Profile behavior here.
- Do not introduce schema versions.
- Do not run broad startup migration.
- Do not change dashboard, export, import, backup, sync, cloud, account, or privacy/disclosure behavior.
