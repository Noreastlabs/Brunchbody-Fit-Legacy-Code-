# Lane: 1.3.2.3.7 Profile Lazy Repair Implementation Scope

## Status And Scope

This is the internal architecture artifact for `Lane 1.3.2.3.7 Profile Lazy Repair Implementation Scope`.

This lane is docs-only and scoping-only. It defines the future implementation boundary for Profile-only Lazy Repair of body-measurement fields. It does not implement repair, change app behavior, change storage behavior, change reducer behavior, change tests, or authorize a storage migration.

What changed: one internal architecture artifact only, `docs/architecture/body-measurement-profile-lazy-repair-implementation-scope.md`.

What users experience: no app behavior change.

Docs/disclosures required now: none.

This lane scopes a future implementation only. This lane does not implement repair.

Actual Profile repair implementation remains blocked until `1.3.2.3.9 Migration Test Matrix` is completed or explicitly folded into a later approved implementation lane.

This lane does not change app source, tests, storage reads or writes, AsyncStorage behavior, MMKV behavior, schema versioning, startup behavior, Profile behavior, onboarding behavior, Weight Log behavior, dashboard behavior, BMI/BMR behavior, calorie-burn behavior, export output, import behavior, restore behavior, backup behavior, sync behavior, cloud behavior, account behavior, cross-device continuity, routes, navigation, package files, lockfiles, CI, public docs, privacy/disclosure files, support copy, or release notes.

## Evidence Method

Current source and focused tests define current behavior. Older architecture documents are context only where they conflict with current source/tests.

Architecture context inspected:

- `docs/architecture/body-measurement-migration-planning-scope.md`
- `docs/architecture/body-measurement-profile-migration-candidate-inventory.md`
- `docs/architecture/body-measurement-weight-log-migration-candidate-inventory.md`
- `docs/architecture/body-measurement-export-import-boundary-decision.md`
- `docs/architecture/body-measurement-dashboard-calculation-consumer-migration-risk-audit.md`
- `docs/architecture/body-measurement-migration-strategy-decision.md`
- `docs/architecture/body-measurement-data-shape-cleanup-inventory.md`
- `docs/architecture/migration-invariants-and-repair-policy.md`
- `docs/architecture/measurement-system-final-regression-closeout.md`

Source files inspected:

- `src/redux/actions/profileStorage.js`
- `src/redux/reducer/auth.js`
- `src/redux/actions/auth.js`
- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
- `src/screens/setting/pages/MyProfile/MyVitals.js`
- `src/screens/setting/pages/MyProfile/MyProfile.js`
- `src/utils/bodyMeasurementUnits.js`
- `src/utils/bodyMetrics.js`

Focused tests inspected:

- `__tests__/authProfileRepair.test.js`
- `__tests__/authStorageBoundary.test.js`
- `__tests__/completeProfileFlowBoundary.test.js`
- `__tests__/settingsFormUxBoundary.test.js`
- `__tests__/bodyMetrics.test.js`
- `__tests__/calorieBurnMetrics.test.js`
- `__tests__/recreationFormUxBoundary.test.js`

Current behavior evidence for this scope:

- `profileStorage.js` strips durable `bmi` and `bmr` from direct profile storage and otherwise preserves the profile shape.
- `auth.js` profile save currently canonicalizes incoming legacy `height` and `weight` only when those fields are submitted.
- The `auth` reducer strips incoming `bmi` and `bmr`, derives runtime BMI/BMR, prefers valid canonical body fields, and falls back to valid legacy body fields.
- Focused tests confirm direct profile load/save does not generate missing `heightCentimeters` or `weightKilograms`.

## Selected Strategy Context

Lazy Repair is the selected Phase 1 body-measurement migration strategy. That selection does not itself authorize implementation.

Lazy Repair is bounded. A later implementation lane may touch only the approved surface, only when current source-of-truth fields and safe fallbacks are explicit, and only when repair is deterministic and tested.

Profile repair and Weight Log repair remain separate. A Profile-only repair lane must not infer Weight Log behavior, Weight Log payload changes, dashboard behavior, export behavior, import behavior, restore behavior, backup behavior, sync behavior, cloud behavior, account behavior, or cross-device behavior.

Valid existing payloads must be preserved. Valid canonical fields must not be rewritten merely because legacy/source fields also exist. Legacy/source fields must remain preserved for compatibility.

Explicit schema versioning and broad startup migration remain deferred unless a later approved lane reopens them.

The selected strategy previously named `1.3.2.3.9 Migration Test Matrix` before implementation. This lane may proceed as a docs-only scope artifact, but actual Profile repair implementation remains blocked until that test matrix is completed or explicitly folded into the later implementation lane.

## Profile Repair Scope Candidate Table

| Field / Case | Current Role | Future Repair Eligibility | Required Rule |
| --- | --- | --- | --- |
| `heightCentimeters` present and valid | Canonical profile height | Preserve | Do not rewrite |
| `heightCentimeters` missing + legacy `height` valid | Missing canonical height | Eligible for future deterministic backfill | Convert legacy feet/inches to cm |
| `heightCentimeters` invalid + legacy `height` valid | Conflicted/invalid canonical case | Defer unless later rule approves | Do not silently overwrite |
| `weightKilograms` present and valid | Canonical profile weight | Preserve | Do not rewrite |
| `weightKilograms` missing + legacy `weight` valid | Missing canonical weight | Eligible for future deterministic backfill | Convert legacy pounds to kg |
| `weightKilograms` invalid + legacy `weight` valid | Conflicted/invalid canonical case | Defer unless later rule approves | Do not silently overwrite |
| Legacy `height` | Compatibility/source height | Preserve | Do not delete |
| Legacy `weight` | Compatibility/source weight | Preserve | Do not delete |
| `bodyUnitPreference` valid | Profile preference/control | Preserve | Do not reinterpret as measurement |
| `bodyUnitPreference` missing/unsupported | Preference fallback case | Future rule required | Do not repair silently without explicit rule |
| Persisted `bmi` / `bmr` | Stale derived residue | Strip/ignore only | Must not become durable |
| Runtime `user.bmi` / `user.bmr` | Derived runtime values | Not repair targets | Continue treating as derived |

## Future Repair Rules

A later Profile Lazy Repair implementation must follow these rules:

- Repair only Profile/auth storage shape.
- Preserve valid canonical fields.
- Preserve legacy/source fields.
- Backfill canonical fields only when deterministic.
- Do not silently resolve canonical/legacy conflicts.
- Do not guess on blank, malformed, zero, negative, non-finite, or unsupported values.
- Do not treat `bmi` or `bmr` as durable fields.
- Do not infer Weight Log behavior from Profile behavior.
- Do not change export, import, backup, sync, cloud, account, or cross-device behavior.
- Do not add schema versioning unless a later approved lane explicitly reopens that decision.
- Do not run a broad startup migration.
- Do not delete legacy `height` or legacy `weight`.
- Preserve current local-first/device-local Phase 1 posture.

## Conflict And Defer Cases

The following cases must stop or defer in a future implementation lane unless that lane explicitly defines a safe rule:

- valid canonical height conflicts with valid legacy height;
- valid canonical weight conflicts with valid legacy weight;
- invalid canonical field plus valid legacy field;
- valid canonical field plus invalid legacy field;
- malformed legacy height;
- non-finite or unsupported weight;
- missing or unsupported `bodyUnitPreference`;
- persisted `bmi` or `bmr` reappearing in payloads;
- any case where repair would require changing UX, public docs, export/import, or privacy/disclosure language.

Persisted `bmi` or `bmr` reappearing must not be promoted into durable profile data. Any future behavior beyond the current strip/ignore boundary must be explicitly scoped and tested by the later implementation lane.

## Future Test Requirements

Do not add tests in this lane. This lane records future test requirements only.

Future Profile Lazy Repair implementation should include or update focused tests for:

- canonical fields preserved when valid;
- missing `heightCentimeters` backfilled from valid legacy `height`;
- missing `weightKilograms` backfilled from valid legacy `weight`;
- legacy `height` and `weight` preserved;
- persisted/incoming `bmi` and `bmr` stripped or ignored;
- invalid, malformed, non-finite, zero, negative, unsupported, and conflict cases deferred or handled by the future lane's explicit safe fallback;
- auth reducer still derives BMI/BMR from canonical-first, legacy-fallback source selection;
- calorie-burn consumers remain stable if profile weight repair changes source availability;
- no Weight Log behavior changes.

Likely relevant suites:

- `__tests__/authProfileRepair.test.js`
- `__tests__/authStorageBoundary.test.js`
- `__tests__/bodyMetrics.test.js`
- `__tests__/calorieBurnMetrics.test.js`
- `__tests__/recreationFormUxBoundary.test.js`
- `__tests__/settingsFormUxBoundary.test.js`
- `__tests__/completeProfileFlowBoundary.test.js`

No app tests are required for this lane because it changes no source or test files.

## Implementation Non-Authorization

This artifact scopes a future implementation lane. It does not authorize Codex to implement repair in this lane.

Lazy Repair selection permits future narrow repair lanes only after the needed test matrix and per-surface implementation scope are approved.

This artifact does not authorize storage writes, storage migration, schema versioning, broad startup migration, Redux Persist changes, auth reducer behavior changes, onboarding behavior changes, My Profile or My Vitals behavior changes, Weight Log behavior changes, dashboard behavior changes, export/import behavior changes, backup behavior changes, sync/cloud/account behavior changes, privacy/disclosure changes, support-copy changes, release-note changes, route changes, navigation changes, package changes, lockfile changes, or CI changes.

## Acceptance Notes

Acceptance criteria:

- Exactly one new artifact is created: `docs/architecture/body-measurement-profile-lazy-repair-implementation-scope.md`.
- The artifact is docs/scoping-only.
- The artifact is Profile-only.
- The artifact defines future Profile Lazy Repair eligibility without implementing repair.
- The artifact preserves legacy `height` and `weight`.
- The artifact does not recommend deleting legacy fields.
- The artifact does not authorize silent canonical/legacy conflict repair.
- The artifact does not treat `bmi` or `bmr` as durable migration fields.
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
- No Profile repair was implemented.
- No storage write or storage migration was added.
- No schema versioning was added.
- No broad startup migration was added.
- No Redux Persist behavior was changed.
- No auth reducer behavior was changed.
- No onboarding behavior was changed.
- No My Profile or My Vitals behavior was changed.
- No Weight Log behavior or payload was changed.
- No dashboard behavior was changed.
- No export schema or `.xlsx` behavior was changed.
- No import, restore, backup, sync, cloud, account, or cross-device behavior was changed.
- No public docs, privacy/disclosure files, support copy, release notes, routes, navigation, package files, lockfiles, or CI files were changed.
- No legacy `height` or `weight` deletion was approved.
- No silent canonical/legacy conflict repair was approved.

Risks and notes:

- Main risk: treating this scope artifact as permission to implement Profile repair immediately. It is not.
- Secondary risk: silently repairing canonical/legacy conflicts. Do not permit that here.
- Do not delete legacy `height` or `weight`.
- Do not choose Weight Log behavior here.
- Do not introduce schema versions.
- Do not run broad startup migration.
- Do not change dashboard, export, import, backup, sync, cloud, account, or privacy/disclosure behavior.
