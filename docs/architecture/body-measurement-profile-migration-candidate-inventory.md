# Lane: 1.3.2.3.2 Profile Migration Candidate Inventory

## Status And Scope

This is the internal architecture artifact for `Lane 1.3.2.3.2 Profile Migration Candidate Inventory`.

This lane is docs/audit-only and profile-only. It follows `1.3.2.3.1 Migration Scope And Non-Goal Record` and narrows the next planning step to the Profile/auth seam only.

What changed: one internal architecture artifact only, `docs/architecture/body-measurement-profile-migration-candidate-inventory.md`.

What users experience: no app behavior change.

Docs/disclosures required now: none.

This lane does not authorize migration implementation. It does not repair profile data, add schema versioning, change storage behavior, change reducer behavior, change tests, decide a migration strategy, or choose between no migration, lazy repair, and explicit versioned migration.

## Evidence Method

Current source and focused tests define current behavior. Older architecture documents are context only where they conflict with current source/tests. Future implementation lanes must verify current source and focused tests before making changes.

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

Architecture context inspected:

- `docs/architecture/body-measurement-migration-planning-scope.md`
- `docs/architecture/body-measurement-data-shape-cleanup-inventory.md`
- `docs/architecture/migration-invariants-and-repair-policy.md`
- `docs/architecture/measurement-system-final-regression-closeout.md`

## Profile Field Inventory

| Field | Current Role | Classification | Migration Candidate? | Notes |
| --- | --- | --- | --- | --- |
| `heightCentimeters` | Canonical profile height. | canonical authoritative field | Yes, candidate for preservation/repair planning. | Do not remove. |
| `weightKilograms` | Canonical profile weight. | canonical authoritative field | Yes, candidate for preservation/repair planning. | Do not remove. |
| `height` | Legacy profile height. | legacy/source compatibility field | Yes, compatibility candidate. | Preserve until later strategy approves otherwise. |
| `weight` | Legacy profile weight. | legacy/source compatibility field | Yes, compatibility candidate. | Preserve until later strategy approves otherwise. |
| `bodyUnitPreference` | Profile-level display/input preference. | preference/control field | Yes, preservation candidate. | Not a measurement value. |
| persisted/incoming `bmi` | Stored or incoming derived residue. | stale/dead residue | No, strip/ignore candidate only. | Must not become durable. |
| persisted/incoming `bmr` | Stored or incoming derived residue. | stale/dead residue | No, strip/ignore candidate only. | Must not become durable. |
| runtime `user.bmi` | Reducer-derived display/runtime value. | derived field | No. | Runtime only. |
| runtime `user.bmr` | Reducer-derived display/runtime value. | derived field | No. | Runtime only. |

## Current Source-Of-Truth Rules

The direct profile storage key is `user_profile`.

Current profile storage strips `bmi` and `bmr` from persisted profile payloads. A persisted payload that only contains stripped derived fields becomes unusable and is removed rather than promoted into durable profile data.

Current auth reducer behavior strips incoming `bmi` and `bmr`, then derives runtime `user.bmi` and `user.bmr` from source fields. It prefers canonical `heightCentimeters` and `weightKilograms` when both are valid positive finite numbers. When canonical fields are missing, partial, or invalid, it falls back to valid legacy `height` and `weight` fields.

Profile source rules for future planning:

- Prefer canonical `heightCentimeters` and `weightKilograms` when valid.
- Preserve legacy `height` and `weight` as compatibility/source fields.
- Treat `bodyUnitPreference` as profile-level preference/control, not as a measurement value.
- Treat `bmi` and `bmr` as derived and untrusted for durable persistence.
- Do not infer Weight Log migration behavior from profile behavior.

## Candidate Migration Questions

These questions belong to later lanes only. This lane records them but does not answer them.

- Should future profile repair backfill `heightCentimeters` from valid legacy `height`?
- Should future profile repair backfill `weightKilograms` from valid legacy `weight`?
- Should unsupported or missing `bodyUnitPreference` be repaired in storage or only resolved at read/display time?
- Should profile migration remain lazy repair, or require explicit schema versioning?
- What should happen when canonical and legacy fields conflict?
- Should malformed canonical values be preserved untouched, discarded, or normalized when valid legacy fields exist?
- Should any repair write back to `user_profile`, or normalize in memory only?

## Non-Candidates

The following are not migration targets in this lane:

- persisted `bmi`
- persisted `bmr`
- incoming `bmi`
- incoming `bmr`
- runtime `user.bmi`
- runtime `user.bmr`
- DOB, gender, and age fields unless a later BMR-specific lane opens them
- Weight Log fields
- dashboard fields
- export-only context fields

## Future Implementation Readiness Notes

A profile migration implementation lane is not ready until it defines:

- exact repair strategy;
- source-of-truth precedence;
- conflict handling;
- malformed value handling;
- safe fallback rules;
- whether repair writes back to storage or only normalizes in memory;
- focused tests;
- no privacy/disclosure drift.

Future implementation must remain profile-only unless a later lane explicitly reopens scope. It must not use this inventory to change Weight Log, dashboard, export, import, restore, backup, sync, cloud, account, cross-device, public-docs, privacy/disclosure, or release behavior by implication.

## Acceptance Notes

Acceptance for this lane is:

- Exactly one new artifact is created: `docs/architecture/body-measurement-profile-migration-candidate-inventory.md`.
- The artifact is profile-only.
- The artifact classifies all required profile fields.
- The artifact distinguishes canonical authoritative fields, legacy/source compatibility fields, preference/control fields, derived fields, and stale/dead residue.
- The artifact does not implement or authorize migration.
- The artifact does not decide no migration vs lazy repair vs explicit versioned migration.
- The artifact does not touch Weight Log, dashboard, export, import, restore, backup, sync, cloud, account, or cross-device behavior.
- No app source files are changed.
- No tests are changed.
- No package files, lockfiles, CI, routes, navigation, public docs, privacy/disclosure files, or release files are changed.
- `git diff --check` passes.
- `git status --short --untracked-files=all` shows only `?? docs/architecture/body-measurement-profile-migration-candidate-inventory.md`, unless pre-existing unrelated changes are explicitly called out.

Pre-existing working-tree caveat for this implementation pass: `docs/architecture/body-measurement-migration-planning-scope.md` was already untracked before this artifact was created and was not edited by this lane.
