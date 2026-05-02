# Lane: 1.3.2.3.4 Export / Import Boundary Decision Record

## Status And Scope

This is the internal architecture decision artifact for `Lane 1.3.2.3.4 Export / Import Boundary Decision Record`.

This lane is docs-only and decision-only. It records the boundary between `1.3.2.3 Migration Planning` for body-measurement data shape compatibility and later `1.4 Backup, Export, Import, and Portability` lanes.

What changed: one internal architecture artifact only, `docs/architecture/body-measurement-export-import-boundary-decision.md`.

What users experience: no app behavior change.

Docs/disclosures required now: none.

This lane does not change app source, tests, storage reads or writes, AsyncStorage behavior, MMKV behavior, schema versioning, Profile behavior, Weight Log behavior, export output, `.xlsx` schema, import behavior, restore behavior, backup behavior, portability behavior, dashboard behavior, calculation behavior, routes, navigation, package files, lockfiles, CI, public docs, privacy/disclosure files, support copy, release notes, backend sync, remote persistence, account behavior, login/password behavior, cloud storage, or cross-device continuity.

## Decision

Owner-selected boundary: **Option A - internal storage only**.

For Phase 1, `1.3.2.3 Migration Planning` covers internal local body-measurement data shape planning only. It may identify export as an adjacent consumer risk, but it does not define, implement, or authorize import, restore, backup, sync, cloud, account, or cross-device continuity behavior. Any import/restore/backup/portability behavior must be routed to dedicated `1.4` lanes.

## Boundary Table

| Surface | 1.3.2.3 Decision | Owner |
| --- | --- | --- |
| Internal body-measurement storage shape planning | Covered. | `1.3.2.3` |
| Profile migration inventory | Covered as internal compatibility planning. | `1.3.2.3.2` |
| Weight Log migration inventory | Covered as internal compatibility planning. | `1.3.2.3.3` |
| Export compatibility | Not owned here; reference only as adjacent consumer risk/context. | Dedicated export or `1.4` portability lanes |
| Import behavior | Deferred. | `1.4` |
| Restore behavior | Deferred. | `1.4` |
| Backup behavior | Deferred. | `1.4` |
| Portability behavior | Deferred. | `1.4` |
| Backend sync, cloud storage, account continuity, and cross-device continuity | Out of scope and not claimed. | Future explicitly approved lanes only |

## Rationale

Body-measurement migration planning under `1.3.2.3` is intentionally narrow and internal. The parent migration scope, Profile inventory, and Weight Log inventory are planning artifacts for local data shape compatibility, not behavior authorization.

Export can be a real downstream consumer of Weight Log body-measurement shape, so future planning may reference export as a risk surface. That reference must not become ownership of export schema, import semantics, restore semantics, backup behavior, cloud continuity, account recovery, or broad portability.

Keeping import, restore, backup, and portability in `1.4` preserves the Phase 1 local-first posture and avoids accidental public or user-facing claims before those behaviors are separately designed, implemented, tested, and disclosure-reviewed.

## Reference Context

The following artifacts are context only for this decision and are not edited or expanded by this lane:

- `docs/architecture/body-measurement-migration-planning-scope.md`
- `docs/architecture/body-measurement-profile-migration-candidate-inventory.md`
- `docs/architecture/body-measurement-weight-log-migration-candidate-inventory.md`
- `docs/architecture/body-measurement-export-unit-semantics.md`
- `docs/architecture/data-export-and-portability-controls.md`
- `docs/architecture/migration-invariants-and-repair-policy.md`

Current source and tests remain the source of truth for future implementation lanes. If older architecture text conflicts with current source or focused tests, the future implementation lane must verify current behavior and keep its change bounded rather than resolving broad portability, disclosure, storage, or account-policy questions by implication.

## Non-Claims

This decision does not approve, claim, or imply:

- migration implementation;
- Profile repair;
- Weight Log repair;
- schema versioning;
- storage key changes;
- reducer shape changes;
- export output changes;
- export schema changes;
- selected-journal `.xlsx` column changes;
- import behavior;
- restore behavior;
- backup behavior;
- broad portability behavior;
- cloud sync;
- backend persistence;
- account continuity;
- cross-device continuity;
- public privacy or disclosure changes;
- public docs changes;
- support-copy changes;
- release-note changes.

Future lanes must not use this decision record as evidence that import, restore, backup, sync, cloud, account, cross-device, or broader portability behavior exists.

## Acceptance Notes

Acceptance for this lane is:

- Exactly one new internal architecture artifact is created: `docs/architecture/body-measurement-export-import-boundary-decision.md`.
- The artifact records Option A as the selected boundary.
- The artifact states that `1.3.2.3` covers internal local body-measurement data shape planning only.
- The artifact states that export is an adjacent consumer/risk surface, not a migration owner.
- The artifact states that import, restore, backup, sync, cloud, account, cross-device continuity, and broader portability behavior are deferred to dedicated `1.4` lanes or later explicitly approved work.
- The artifact includes explicit non-claims for backend sync, cloud storage, account continuity, cross-device continuity, import/restore/backup behavior, and public privacy/disclosure changes.
- No app source files are changed.
- No tests are changed.
- No export schema is changed.
- No import, restore, backup, or portability behavior is changed.
- No public docs, privacy/disclosure files, support copy, release notes, package files, lockfiles, CI, routes, or navigation files are changed.
- `git diff --check` passes.
- `git status --short --untracked-files=all` shows only `?? docs/architecture/body-measurement-export-import-boundary-decision.md`, unless pre-existing unrelated changes are explicitly called out.
