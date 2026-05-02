# Lane: 1.3.2.3.1 Migration Scope And Non-Goal Record

## Status And Scope

This is the internal architecture artifact for `Lane 1.3.2.3.1 Migration Scope And Non-Goal Record`.

This lane is docs-only and planning-only. It creates the parent scope and non-goal record for `1.3.2.3 Migration Planning` inside the Phase 1 measurement-system workstream. It does not decide or implement a migration strategy.

What changed: one internal architecture artifact only, `docs/architecture/body-measurement-migration-planning-scope.md`.

What users experience: no app behavior change.

Docs/disclosures required now: none.

This lane does not change app source, tests, storage reads or writes, AsyncStorage behavior, MMKV behavior, schema versioning, Profile behavior, Weight Log behavior, export output, import behavior, restore behavior, backup behavior, dashboard behavior, BMI/BMR behavior, calorie-burn behavior, routes, navigation, package files, lockfiles, CI, public docs, privacy/disclosure files, support copy, release notes, backend sync, remote persistence, account behavior, login/password behavior, or cross-device continuity.

Current source and tests remain the source of truth for future implementation work. Existing architecture documents are context only; where older docs conflict with current repo behavior, future lanes must verify current source/tests before implementation rather than resolving that conflict in this parent scope record.

## Purpose

This artifact defines the parent scope for body-measurement migration planning. Its purpose is to keep later `1.3.2.3.x` lanes narrow, reviewable, and tied to Phase 1 measurement-system needs.

Migration planning must not be treated as permission to implement broad storage or behavior changes. This record explicitly blocks drift into storage rewrites, source cleanup, import or restore semantics, backup semantics, backend sync, export schema expansion, privacy posture changes, account behavior, or cross-device continuity claims.

This lane creates the planning boundary only. It does not choose whether future work should use no migration, lazy repair, or explicit versioned migration. That decision belongs to a later strategy lane.

## Current Boundary

Brunch Body Phase 1 remains:

- mobile-first;
- local-first;
- device-local;
- measurement-system focused;
- bounded to planning until later implementation lanes are explicitly approved.

For body-measurement work, this means future migration discussion may inspect Profile, Weight Log, export context, dashboard consumers, calculation consumers, and tests as evidence. It may not use that inspection to change runtime behavior inside this parent lane.

The current local-first posture remains unchanged. This artifact does not introduce backend persistence, cloud storage, automatic backup, account continuity, login behavior, password behavior, cross-device reconciliation, or remote sync.

## Migration Planning Definition

For `1.3.2.3`, migration planning means:

- identifying candidate Profile and Weight Log fields that may need compatibility handling;
- identifying compatibility risks created by current and legacy body-measurement shapes;
- identifying dashboard, calculation, export, and storage consumers affected by future shape changes;
- deciding in a later strategy lane whether no migration, lazy repair, or explicit versioned migration is appropriate;
- planning focused test coverage for any later approved implementation lane;
- sequencing future implementation lanes so each lane has one domain or one storage surface only.

Migration planning is not migration implementation.

This parent lane does not read, write, repair, normalize, version, rewrite, or delete stored payloads. It does not change storage keys, reducer state, export rows, import behavior, restore behavior, backup behavior, dashboard output, calculation output, or user-facing behavior.

## Non-Goals

The following are explicit non-goals for this lane and must not be introduced by implication in later planning artifacts:

- backend sync;
- cloud storage;
- remote persistence;
- cross-device continuity;
- account behavior;
- login behavior;
- password behavior;
- import behavior;
- restore behavior;
- backup behavior;
- export schema changes;
- export output changes;
- public privacy or disclosure changes;
- support-copy changes;
- release-note changes;
- deletion or reset semantics;
- broad source cleanup;
- storage-key renames;
- reducer mount-key changes;
- AsyncStorage migration;
- MMKV migration;
- schema versioning implementation;
- Profile repair implementation;
- Weight Log repair implementation;
- dashboard behavior changes;
- BMI/BMR behavior changes;
- calorie-burn behavior changes;
- package, lockfile, route, navigation, CI, or test changes.

Future lanes must not use the words "migration planning" to claim import, restore, backup, sync, cloud, account, or cross-device behavior. Any lane that needs one of those product areas must reopen that scope explicitly outside this parent measurement-system planning record.

## Follow-On Lane Map

Recommended follow-on lane sequence:

1. `1.3.2.3.2 Profile Migration Candidate Inventory`
2. `1.3.2.3.3 Weight Log Migration Candidate Inventory`
3. `1.3.2.3.4 Export / Import Boundary Decision`
4. `1.3.2.3.5 Dashboard And Calculation Consumer Migration Risk Audit`
5. `1.3.2.3.6 Migration Strategy Decision`
6. `1.3.2.3.9 Migration Test Matrix`
7. `1.3.2.3.7 Profile Lazy Repair Implementation Scope`, only if approved
8. `1.3.2.3.8 Weight Log Lazy Repair Implementation Scope`, only if approved
9. `1.3.2.3.10 Migration Planning Closeout`

The lane numbers above intentionally preserve the requested sequencing. Implementation-scope lanes remain conditional and must not begin until the inventory, boundary, consumer-risk, strategy, and test-matrix lanes make them ready.

## Readiness Rules For Future Implementation

A later migration implementation lane is not ready unless it has:

- one domain or one storage surface only;
- clear owner and source-of-truth field definitions;
- explicit legacy compatibility handling;
- explicit safe fallback rules;
- focused tests for the touched behavior;
- no hidden import, restore, backup, export, cloud, account, or cross-device claims;
- no privacy or disclosure drift.

If a future lane cannot prove the current owner, source-of-truth fields, legacy compatibility path, safe fallback, and test scope without widening into unrelated domains, it must stop and remain a planning lane.

Future implementation lanes must verify current source and focused tests before changing behavior. If current repo evidence conflicts with older architecture docs, the implementation lane must record that tension and keep the actual change bounded rather than silently resolving broad storage, privacy, export, import, restore, backup, cloud, or account policy questions.

## Acceptance Notes

Acceptance for this lane is:

- Exactly one new internal architecture artifact is created: `docs/architecture/body-measurement-migration-planning-scope.md`.
- The artifact clearly states this lane is docs-only and planning-only.
- The artifact states users experience no app behavior change.
- The artifact states no docs/disclosures are updated in this lane.
- The artifact explicitly lists implementation non-goals.
- The artifact lists the follow-on `1.3.2.3.x` lane sequence.
- The artifact does not claim migration implementation.
- The artifact does not claim import, restore, backup, sync, cloud, account, or cross-device continuity behavior.
- No app source files are changed.
- No tests are changed.
- No package files, lockfiles, CI, routes, navigation, public docs, privacy/disclosure files, or release files are changed.
- `git diff --check` passes.
- `git status --short --untracked-files=all` shows only `?? docs/architecture/body-measurement-migration-planning-scope.md`, unless pre-existing unrelated changes are explicitly called out.
