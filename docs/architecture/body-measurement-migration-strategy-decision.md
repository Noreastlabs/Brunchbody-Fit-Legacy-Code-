# Lane: 1.3.2.3.6 Migration Strategy Decision Record

## Status And Scope

This is the internal architecture decision artifact for `Lane 1.3.2.3.6 Migration Strategy Decision Record`.

This lane is docs-only and decision-only. It records the selected Phase 1 body-measurement migration strategy for later planning and implementation-scope lanes. It does not implement migration, repair stored data, add schema versioning, change storage behavior, change Profile behavior, change Weight Log behavior, change dashboard behavior, change calculation behavior, change export behavior, change tests, or change app behavior.

What changed: one internal architecture artifact only, `docs/architecture/body-measurement-migration-strategy-decision.md`.

What users experience: no app behavior change.

Docs/disclosures required now: none.

This lane does not change app source, tests, storage reads or writes, AsyncStorage behavior, MMKV behavior, schema versioning, startup behavior, Profile behavior, Weight Log behavior, dashboard behavior, BMI/BMR behavior, calorie-burn behavior, export output, import behavior, restore behavior, backup behavior, sync behavior, cloud behavior, account behavior, cross-device continuity, routes, navigation, package files, lockfiles, CI, public docs, privacy/disclosure files, support copy, or release notes.

Current source and tests remain the source of truth for future implementation lanes. Existing architecture documents are context only; where older docs conflict with current repo behavior, future lanes must verify current source/tests before implementation rather than resolving that conflict in this strategy record.

## Decision

Owner-selected strategy: **Option B - Lazy Repair**.

Phase 1 body-measurement migration strategy is Lazy Repair. Future implementation lanes may repair only the touched Profile or Weight Log surface, only when current source-of-truth fields and safe fallbacks are explicit, and only when repair is deterministic and tested. Valid existing payloads must remain preserved. Legacy/source fields must not be deleted. Explicit schema versioning, broad startup migration, import/restore/backup semantics, sync/cloud/account behavior, and cross-device continuity are deferred unless a later approved lane reopens them.

This decision does not authorize immediate repair. It only selects the strategy that later Profile-only and Weight Log-only lanes must use if they are separately approved for implementation.

## Strategy Comparison

| Option | Decision | Rationale |
| --- | --- | --- |
| No Migration | Not selected as the primary Phase 1 strategy. | Safest in the short term, but too passive because it leaves known canonical-field compatibility risks unplanned and forces every consumer to keep legacy fallback behavior indefinitely. |
| Lazy Repair | Selected. | Best fit for Phase 1 because repair stays bounded to touched surfaces, preserves local-first/device-local behavior, avoids broad storage rewrites, and lets Profile and Weight Log remain separate lanes. |
| Explicit Versioned Migration | Deferred. | Potentially useful later, especially if broad import, restore, sync, or portability work appears, but too heavy for current Phase 1 body-measurement planning. |

## Lazy Repair Rules

Future implementation lanes that use this decision must follow these rules:

- Keep one surface at a time: Profile repair and Weight Log repair remain separate lanes.
- Preserve valid payloads: valid canonical and legacy/source fields remain untouched unless the later lane explicitly defines a safe repair.
- Preserve legacy/source fields: do not delete profile `height`, profile `weight`, or `WeightLog.weight`.
- Backfill canonical fields only when deterministic:
  - profile `heightCentimeters` may be backfilled from valid legacy `height`;
  - profile `weightKilograms` may be backfilled from valid legacy profile `weight`;
  - `WeightLog.weightKilograms` may be backfilled from valid legacy `WeightLog.weight`.
- Stop or defer on ambiguity: conflicting canonical and legacy values must not be silently rewritten without a later explicit conflict rule.
- Do not guess invalid values: blank, zero, negative, non-finite, malformed, or unsupported values must use the later lane-defined safe fallback or defer.
- Do not treat derived fields as migration targets: persisted `bmi` and `bmr` remain stale/dead residue, while runtime `user.bmi` and `user.bmr` remain derived.
- Keep export/import out of ownership: export may be used as regression context only; import, restore, backup, sync, cloud, account, portability, and cross-device behavior remain out of `1.3.2.3`.
- Add consumer tests if a future repair affects consumers: Profile repair may require BMI/BMR and calorie-burn regression checks; Weight Log repair may require dashboard regression checks.

## Surface Application

Profile fields are eligible only for later Profile-specific lazy repair planning. Canonical profile fields may be backfilled from valid legacy/source profile fields only when the later lane proves source precedence, conflict handling, invalid-value handling, safe fallback behavior, and focused tests.

Weight Log fields are eligible only for later Weight Log-specific lazy repair planning. `WeightLog.weightKilograms` may be backfilled from valid legacy/source `WeightLog.weight` only when the later lane proves source precedence, conflict handling, invalid-value handling, safe fallback behavior, dashboard impact, and focused tests.

Dashboard and calculation consumers are regression surfaces, not migration owners. Later lanes must preserve current consumer behavior unless they explicitly approve and test a changed source-selection rule.

Export is reference context only. This decision does not change export output, export schema, import behavior, restore behavior, backup behavior, sync behavior, cloud behavior, account behavior, portability behavior, or cross-device continuity.

Tests are required only in later implementation lanes. This decision record adds no tests because it changes no behavior.

## Follow-On Lane Map

The recommended follow-on sequence is:

1. `1.3.2.3.9 Migration Test Matrix`
2. `1.3.2.3.7 Profile Lazy Repair Implementation Scope`
3. `1.3.2.3.8 Weight Log Lazy Repair Implementation Scope`
4. `1.3.2.3.10 Migration Planning Closeout`

The Profile and Weight Log implementation-scope lanes remain conditional. They must not begin until the strategy, affected surfaces, source-of-truth rules, conflict handling, invalid-value handling, safe fallbacks, and focused tests are explicit.

## Non-Claims

This decision does not approve, claim, or imply:

- migration implementation;
- Profile repair implementation;
- Weight Log repair implementation;
- broad startup migration;
- explicit schema versioning;
- storage key changes;
- reducer shape changes;
- deletion of profile `height`;
- deletion of profile `weight`;
- deletion of `WeightLog.weight`;
- export output changes;
- export schema changes;
- import behavior;
- restore behavior;
- backup behavior;
- sync behavior;
- cloud storage;
- backend persistence;
- account continuity;
- cross-device continuity;
- public privacy or disclosure changes;
- public docs changes;
- support-copy changes;
- release-note changes;
- route or navigation changes;
- package, lockfile, or CI changes;
- medical, clinical, diagnostic, or precision claims.

Future lanes must not use this decision record as evidence that import, restore, backup, sync, cloud, account, cross-device, or broader portability behavior exists.

## Reference Context

This decision is grounded in the following prior planning artifacts:

- `docs/architecture/body-measurement-migration-planning-scope.md`
- `docs/architecture/body-measurement-profile-migration-candidate-inventory.md`
- `docs/architecture/body-measurement-weight-log-migration-candidate-inventory.md`
- `docs/architecture/body-measurement-export-import-boundary-decision.md`
- `docs/architecture/body-measurement-dashboard-calculation-consumer-migration-risk-audit.md`
- `docs/architecture/body-measurement-data-shape-cleanup-inventory.md`
- `docs/architecture/migration-invariants-and-repair-policy.md`
- `docs/architecture/measurement-system-final-regression-closeout.md`

Current source and tests remain the source of truth for any later implementation lane.

## Acceptance Notes

Acceptance for this lane is:

- Exactly one new internal architecture artifact is created: `docs/architecture/body-measurement-migration-strategy-decision.md`.
- The artifact records Lazy Repair as the selected Phase 1 body-measurement migration strategy.
- The artifact compares No Migration, Lazy Repair, and Explicit Versioned Migration.
- The artifact states what Lazy Repair permits in future lanes.
- The artifact states what Lazy Repair forbids in this lane and future lanes unless explicitly reopened.
- The artifact states that explicit schema versioning is deferred for Phase 1.
- The artifact states that broad startup migration is deferred.
- The artifact states that legacy/source fields must remain preserved unless a later approved lane explicitly changes that contract.
- The artifact states that import, restore, backup, sync, cloud, account, and cross-device behavior remain out of scope.
- No app source files are changed.
- No tests are changed.
- No migration behavior is implemented.
- No public docs, privacy/disclosure files, support copy, release notes, package files, lockfiles, CI, routes, or navigation files are changed.
- `git diff --check` passes.
- `git status --short --untracked-files=all` truthfully reports the new artifact plus any pre-existing unrelated files.

Verification plan for this docs-only lane:

```sh
git diff --check
git status --short --untracked-files=all
```

No app tests are required because this lane is docs-only and does not change source or test files.
