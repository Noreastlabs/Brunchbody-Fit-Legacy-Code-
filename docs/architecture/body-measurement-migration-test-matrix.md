# Lane: 1.3.2.3.9 Migration Test Matrix

## Status And Scope

This is the internal architecture artifact for `Lane 1.3.2.3.9 Migration Test Matrix`.

This lane is docs/test-planning-only. It defines future test coverage required before any Profile or Weight Log Lazy Repair implementation. It does not add tests, edit tests, run app tests, implement repair, change app behavior, change source files, repair storage, change storage behavior, or choose a new migration strategy.

What changed: one internal architecture artifact only, `docs/architecture/body-measurement-migration-test-matrix.md`.

What users experience: no app behavior change.

Docs/disclosures required now: none.

This lane defines future test coverage only. This lane does not add, edit, or run app tests. This lane does not implement Profile repair, Weight Log repair, migration, storage writes, storage migration, schema versioning, broad startup migration, Redux Persist changes, auth reducer behavior changes, journal reducer behavior changes, onboarding behavior changes, My Profile behavior changes, My Vitals behavior changes, Weight Log UI/input/display/save behavior changes, dashboard behavior changes, export behavior changes, import behavior changes, restore behavior changes, backup behavior changes, sync behavior, cloud behavior, account behavior, cross-device behavior, public docs, privacy/disclosure files, support copy, release notes, routes, navigation, package files, lockfiles, or CI changes.

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
- `docs/architecture/body-measurement-weight-log-lazy-repair-implementation-scope.md`
- `docs/architecture/body-measurement-data-shape-cleanup-inventory.md`
- `docs/architecture/migration-invariants-and-repair-policy.md`
- `docs/architecture/measurement-system-final-regression-closeout.md`

Source files inspected:

- `src/redux/actions/profileStorage.js`
- `src/redux/reducer/auth.js`
- `src/redux/actions/auth.js`
- `src/screens/journal/pages/WeightLog/WeightLog.js`
- `src/screens/journal/components/WeightLog.js`
- `src/screens/dashboard/readModel.js`
- `src/screens/dashboard/components/Carousel.js`
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js`
- `src/utils/bodyMeasurementUnits.js`
- `src/utils/bodyMetrics.js`
- `src/utils/calorieBurnMetrics.js`

Focused tests inspected:

- `__tests__/authProfileRepair.test.js`
- `__tests__/authStorageBoundary.test.js`
- `__tests__/bodyMetrics.test.js`
- `__tests__/calorieBurnMetrics.test.js`
- `__tests__/completeProfileFlowBoundary.test.js`
- `__tests__/settingsFormUxBoundary.test.js`
- `__tests__/journalFormUxBoundary.test.js`
- `__tests__/dashboardReadModelBoundary.test.js`
- `__tests__/dashboardWeightBoundary.test.js`
- `__tests__/exportToCsvBoundary.test.js`
- `__tests__/bodyMeasurementUnits.test.js`
- `__tests__/recreationFormUxBoundary.test.js`

## Test Matrix Purpose

This matrix exists to make future lazy repair lanes reviewable before implementation. Future implementation lanes must restate the relevant matrix cases with exact touched files, focused test commands, acceptance criteria, and explicit conflict/defer handling before repair is approved.

Profile and Weight Log repair must remain separate. Canonical fields may be backfilled only in future implementation lanes. Legacy/source fields must be preserved. Conflicts and invalid cases must be tested or explicitly deferred. Consumer regressions must be identified before repair is approved.

## Profile Repair Test Matrix

| Case | Expected Future Coverage | Likely Suite | Notes |
| --- | --- | --- | --- |
| Valid `heightCentimeters` already present | Preserve canonical height; do not rewrite | `authProfileRepair.test.js`, `authStorageBoundary.test.js` | Future implementation only |
| Missing `heightCentimeters` + valid legacy `height` | Deterministic cm backfill if future lane approves | `authProfileRepair.test.js` | Must preserve legacy `height` |
| Invalid `heightCentimeters` + valid legacy `height` | Defer or explicit rule; no silent overwrite | `authProfileRepair.test.js` | Conflict/defer coverage |
| Valid `weightKilograms` already present | Preserve canonical weight; do not rewrite | `authProfileRepair.test.js`, `authStorageBoundary.test.js` | Future implementation only |
| Missing `weightKilograms` + valid legacy `weight` | Deterministic kg backfill if future lane approves | `authProfileRepair.test.js` | Must preserve legacy `weight` |
| Invalid `weightKilograms` + valid legacy `weight` | Defer or explicit rule; no silent overwrite | `authProfileRepair.test.js` | Conflict/defer coverage |
| Legacy `height` present | Preserve compatibility/source field | `authProfileRepair.test.js` | Do not delete |
| Legacy `weight` present | Preserve compatibility/source field | `authProfileRepair.test.js` | Do not delete |
| Stored/incoming `bmi` | Strip or ignore; never durable | `authProfileRepair.test.js`, `authStorageBoundary.test.js` | Derived residue |
| Stored/incoming `bmr` | Strip or ignore; never durable | `authProfileRepair.test.js`, `authStorageBoundary.test.js` | Derived residue |
| Runtime `user.bmi` / `user.bmr` | Still derived by reducer | `authProfileRepair.test.js`, `bodyMetrics.test.js` | No durable migration |
| Missing/unsupported `bodyUnitPreference` | Explicit future rule or current fallback preserved | `settingsFormUxBoundary.test.js` | Do not silently rewrite without rule |

## Weight Log Repair Test Matrix

| Case | Expected Future Coverage | Likely Suite | Notes |
| --- | --- | --- | --- |
| Valid `WeightLog.weightKilograms` already present | Preserve canonical kg; do not rewrite | `journalFormUxBoundary.test.js` | Future implementation only |
| Missing `WeightLog.weightKilograms` + valid `WeightLog.weight` | Deterministic kg backfill if future lane approves | `journalFormUxBoundary.test.js` | Must preserve `WeightLog.weight` |
| Invalid `WeightLog.weightKilograms` + valid `WeightLog.weight` | Defer or explicit rule; no silent overwrite | `journalFormUxBoundary.test.js` | Conflict/defer coverage |
| Valid `WeightLog.weight` | Preserve legacy/source pounds | `journalFormUxBoundary.test.js` | Do not delete or reformat |
| Missing both source and canonical weight | Defer or explicit safe fallback | `journalFormUxBoundary.test.js` | No guessing |
| Blank/zero/negative/non-finite/malformed weight | Defer or explicit safe fallback | `journalFormUxBoundary.test.js`, `bodyMeasurementUnits.test.js` | No guessing |
| `enteredWeightValue` present | Preserve provenance if present | `journalFormUxBoundary.test.js` | Not source of truth |
| `enteredWeightUnit` present | Preserve provenance if present | `journalFormUxBoundary.test.js` | Not source of truth |
| Missing provenance fields | Leave absent unless future rule approves otherwise | `journalFormUxBoundary.test.js` | Do not reconstruct by guessing |
| Provenance conflicts with source/canonical fields | Defer or explicit rule | `journalFormUxBoundary.test.js` | No silent reinterpretation |
| `note` present | Preserve ordinary journal content | `journalFormUxBoundary.test.js` | Not body migration target |
| `isDeleted` present | Preserve lifecycle/filter semantics | `journalFormUxBoundary.test.js` | Do not reinterpret |

## Consumer Regression Matrix

| Consumer | Future Trigger | Likely Coverage | Required Guard |
| --- | --- | --- | --- |
| Auth reducer BMI/BMR | Profile repair changes canonical availability | `authProfileRepair.test.js`, `bodyMetrics.test.js` | Preserve canonical-first, legacy-fallback behavior unless explicitly changed |
| Calorie burn helpers | Profile weight repair changes kg availability | `calorieBurnMetrics.test.js`, `recreationFormUxBoundary.test.js` | Preserve calculation source selection unless explicitly changed |
| Dashboard read model | Weight Log repair changes kg availability | `dashboardReadModelBoundary.test.js` | Preserve expected source selection or test changed rule |
| Dashboard chart/display | Read-model assumptions change | `dashboardWeightBoundary.test.js` | Preserve display semantics or test changed rule |
| Export Weight Log rows | Stored Weight Log shape affects raw/context output | `exportToCsvBoundary.test.js` | Export remains regression context only unless separately approved |
| Weight Log form/save | Repair interacts with input/save path | `journalFormUxBoundary.test.js` | Preserve current form behavior unless future lane owns change |

## Invalid And Conflict Case Matrix

The following values and cases must not be repaired by guessing:

- blank strings;
- whitespace-only strings;
- zero values;
- negative values;
- non-finite values;
- malformed legacy height;
- malformed weight;
- unsupported unit preference;
- canonical/legacy conflicts;
- source/canonical Weight Log conflicts;
- provenance/source/canonical conflicts;
- missing source and canonical fields;
- deleted-entry lifecycle ambiguity.

Future implementation lanes must either test the exact safe fallback or explicitly defer the case.

## Non-Claims And Boundaries

This test matrix does not:

- add tests;
- run tests;
- implement migration;
- authorize repair;
- authorize schema versioning;
- authorize broad startup migration;
- authorize legacy field deletion;
- authorize deletion of profile `height`, profile `weight`, or `WeightLog.weight`;
- authorize silent canonical/legacy conflict repair;
- change dashboard behavior;
- change calculations;
- change export behavior;
- change import behavior;
- change restore behavior;
- change backup behavior;
- introduce sync, cloud, account, or cross-device behavior;
- introduce broader portability behavior;
- change public docs, privacy/disclosure files, support copy, or release notes;
- make medical, clinical, diagnostic, or precision claims.

Export is included only as a regression boundary for future Weight Log implementation lanes. Export references in this matrix do not authorize export schema changes, `.xlsx` changes, import semantics, restore semantics, backup behavior, sync behavior, cloud continuity, account recovery, cross-device continuity, or guaranteed portability.

The current local-first/device-local Phase 1 posture remains unchanged.

## Future Implementation Readiness Gate

Future Profile or Weight Log implementation lanes are not ready unless they include:

- the relevant matrix cases in acceptance;
- exact touched files;
- focused test commands;
- conflict/defer handling;
- consumer regression expectations;
- confirmation that legacy/source fields are preserved;
- confirmation that profile `height`, profile `weight`, and `WeightLog.weight` are not deleted unless a later explicitly approved lane reopens that decision;
- confirmation that no import, restore, backup, sync, cloud, account, or cross-device behavior is introduced;
- confirmation that privacy/disclosure language remains unchanged unless explicitly opened.

## Recommended Future Test Commands

Do not run these commands in this lane. They are likely future commands for implementation lanes only.

Profile-related future commands may include:

```sh
yarn test __tests__/authProfileRepair.test.js --runInBand
yarn test __tests__/authStorageBoundary.test.js --runInBand
yarn test __tests__/bodyMetrics.test.js --runInBand
yarn test __tests__/calorieBurnMetrics.test.js --runInBand
yarn test __tests__/recreationFormUxBoundary.test.js --runInBand
yarn test __tests__/settingsFormUxBoundary.test.js --runInBand
yarn test __tests__/completeProfileFlowBoundary.test.js --runInBand
```

Weight Log-related future commands may include:

```sh
yarn test __tests__/journalFormUxBoundary.test.js --runInBand
yarn test __tests__/dashboardReadModelBoundary.test.js --runInBand
yarn test __tests__/dashboardWeightBoundary.test.js --runInBand
yarn test __tests__/exportToCsvBoundary.test.js --runInBand
yarn test __tests__/bodyMeasurementUnits.test.js --runInBand
```

## Acceptance Notes

Acceptance criteria:

- Exactly one new artifact is created: `docs/architecture/body-measurement-migration-test-matrix.md`.
- The artifact is docs/test-planning-only.
- The artifact does not add or edit tests.
- The artifact does not run app tests.
- The artifact covers Profile repair test cases.
- The artifact covers Weight Log repair test cases.
- The artifact covers consumer regression cases.
- The artifact covers invalid and conflict cases.
- The artifact lists likely future focused test suites/commands.
- The artifact states future implementation lanes remain blocked until they restate relevant matrix cases with exact tests and acceptance criteria.
- The artifact does not implement or authorize migration.
- The artifact does not decide a new migration strategy.
- The artifact does not recommend deleting legacy `height`, legacy `weight`, or `WeightLog.weight`.
- No app source files are changed.
- No test files are changed.
- No package files, lockfiles, CI, routes, navigation, public docs, privacy/disclosure files, support copy, or release files are changed.
- `git diff --check` passes.
- `git status --short --untracked-files=all` truthfully reports the new artifact plus any pre-existing unrelated or prior-lane untracked files.

Verification plan for this docs-only lane:

```sh
git diff --check
git status --short --untracked-files=all
```

No app tests are required because this lane changes no source or test files.

Risks and notes:

- Main risk: treating the test matrix as permission to implement repair. It is not.
- Secondary risk: making future test commands sound like they were run in this lane. They are clearly labeled future commands only.
- Do not add tests in this lane.
- Do not run app tests unless unexpected source/test changes occur.
- Do not change implementation.
- Do not choose a new migration strategy.
- Do not delete legacy fields.
- Do not change export, import, backup, sync, cloud, account, or cross-device behavior.
