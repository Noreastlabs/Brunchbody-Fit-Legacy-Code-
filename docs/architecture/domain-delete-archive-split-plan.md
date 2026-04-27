# Domain-Level Delete / Archive Split Plan

## Status and Scope

This is an internal planning guidance artifact only. It converts completed delete, reset, and archive evidence into domain-specific follow-on lane candidates so future work can stay bounded by one domain, one flow, or one policy layer at a time.

This lane changes no app behavior, no source code, no tests, no user-facing copy, no README content, no public docs, no privacy language, no store disclosure language, no storage behavior, no export behavior, no import behavior, no delete behavior, no reset behavior, no archive behavior, no restore behavior, no undo behavior, no route behavior, no navigation behavior, no reducer behavior, and no action behavior.

What changed: one internal planning artifact only.

What users experience: no user-facing change.

This artifact does not create any user-facing archive, delete, reset, recovery, restore, export, import, backup, privacy, or store-disclosure claim. It does not approve a global Archive control. Global Archive remains deferred unless a future domain-specific lane verifies scope, labels, storage semantics, recovery behavior, export/import impact, tests, and disclosure implications.

## Evidence Basis

This split plan uses the completed internal evidence artifacts as inputs:

- `docs/architecture/delete-reset-archive-semantics-decision.md`
- `docs/architecture/delete-reset-archive-current-state-audit.md`
- `docs/architecture/archive-control-discovery-and-deferral.md`

The decision record defines the current vocabulary boundaries for `Delete local data`, `Reset app`, `Log out`, `Reset password`, and `Archive`. It says Archive is not a global Phase 1 control and is not implementation-ready until audited.

The current-state audit verifies current delete, reset, logout, reset-password, export-boundary, starter-content reseeding, and archive-like behavior. It identifies journal `isDeleted` behavior and calendar `deletedThemes` / `clearedThemeDays` behavior as domain-specific archive-like candidates, while todo, nutrition, recreation, and exercise currently appear to be delete, remove, or clear behavior.

The archive deferral artifact records that existing domain delete, remove, clear, hide, deleted, or restore-like behavior must not be described as Archive unless a future domain-specific lane verifies that product meaning.

This plan also depends on the completed lane sequence:

- `1.2.3.3.0 Delete / Reset / Archive Semantics Decision Gate`
- `1.2.3.3.1 Current-State Audit of Delete, Reset, and Archive Surfaces`
- `1.2.3.3.2 Delete Local Data Copy and Confirmation Clarity`
- `1.2.3.3.3 Delete Local Data Execution Boundary Tests`
- `1.2.3.3.4 Reset Password vs. Reset App Language Separation`
- `1.2.3.3.5 Archive Control Discovery and Deferral Rule`

## Planning Method

This artifact classifies future work by domain rather than bundling journal, calendar, nutrition, exercise, recreation, todo, and Settings controls into one broad rewrite.

Allowed classifications for this split plan are:

- `ready_for_codex_docs_only`
- `needs_discussion`
- `needs_current_state_audit`
- `needs_behavior_definition`
- `defer_no_lane`

Classification rules:

- Use `ready_for_codex_docs_only` when current evidence is sufficient for a documentation-only closeout or inventory lane.
- Use `needs_discussion` when product intent must be decided before a lane can safely be implemented.
- Use `needs_current_state_audit` when current code, reachability, storage, test, or label evidence needs a narrower domain audit.
- Use `needs_behavior_definition` when current behavior exists but user-facing meaning, recovery, export/import, or disclosure boundaries are not defined.
- Use `defer_no_lane` when the surface is not an Archive candidate and does not currently need a follow-on lane.

If existing evidence is incomplete or contradictory, this artifact records the uncertainty and seeds a future audit instead of editing the evidence inputs.

## Domain Split Matrix

| Domain / surface | Current evidence summary | Delete/remove/clear behavior? | Archive-like behavior? | Export/import impact? | User-facing label impact? | Trust risk | Recommended classification | Candidate follow-on lane |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Journal | Journal delete marks selected entry subtype data as `isDeleted: true`; normal journal rendering hides deleted subtype entries; journal export removes the `isDeleted` field from selected row data. No approved Archive label, recovery contract, or export visibility rule exists. | yes | yes | yes | unknown | medium | `needs_behavior_definition` | `1.2.3.3.6.1 Journal Soft-Delete and Export Visibility Definition` |
| Calendar themes | Calendar theme behavior includes theme deletion, current-theme clearing, stored `clearedThemeDays`, and repeated-theme date suppression through `deletedThemes`. Evidence suggests hide/clear/recovery ambiguity, not a global Archive contract. | yes | yes | unknown | unknown | medium | `needs_current_state_audit` | `1.2.3.3.6.2 Calendar Theme Hide / Clear / Recovery Semantics` |
| Calendar todo | Calendar todo deletion removes a task by id from the todo slice. Current evidence reads as delete/remove behavior rather than Archive. | yes | no | unknown | yes | low | `ready_for_codex_docs_only` | `1.2.3.3.6.3 Domain Delete/Remove Inventory Closeout` |
| Nutrition | Nutrition reducers remove meals, meal items, supplements, and supplement items from persisted Redux state. Current evidence reads as delete/remove behavior rather than Archive. | yes | no | unknown | yes | low | `ready_for_codex_docs_only` | `1.2.3.3.6.3 Domain Delete/Remove Inventory Closeout` |
| Recreation | Recreation reducers remove routines, routine tasks, custom plans, and workouts from matching arrays. Current evidence reads as delete/remove behavior rather than Archive. | yes | no | unknown | yes | low | `ready_for_codex_docs_only` | `1.2.3.3.6.3 Domain Delete/Remove Inventory Closeout` |
| Exercise | Exercise deletion removes a custom exercise and dispatches merge behavior so the visible exercise list reflects directory plus custom data. Current evidence reads as delete/remove behavior rather than Archive. | yes | no | unknown | yes | low | `ready_for_codex_docs_only` | `1.2.3.3.6.3 Domain Delete/Remove Inventory Closeout` |
| Settings/Delete local data | Settings exposes Delete local data. Current evidence says it dispatches internal `deleteAccount()`, resets Redux through `RESET_APP`, clears AsyncStorage, clears MMKV, and rehydrates bundled starter plans. Exported files remain outside the app-local deletion guarantee. | yes | no | yes | yes | high | `ready_for_codex_docs_only` | `1.2.3.3.6.4 Settings Delete/Reset Boundary Closeout` |
| Reset/password/logout-adjacent controls | `RESET_APP` is internal Redux reset behavior; logout is scoped auth/profile/onboarding cleanup; reset password is credential-related and live reachability remains ambiguous in the audit. These are not Archive candidates. | ambiguous | no | unknown | unknown | high | `defer_no_lane` | none |

## Recommended Lane Sequence

Do not start a global Archive implementation from this evidence. Future archive or recovery work must be domain-specific.

Recommended sequence:

1. Use `1.2.3.3.6.3 Domain Delete/Remove Inventory Closeout` if the team wants a docs-only closeout that records todo, nutrition, recreation, and exercise as current delete/remove/clear inventory rather than Archive candidates.
2. Use `1.2.3.3.6.4 Settings Delete/Reset Boundary Closeout` if the team wants a final docs-only check before public docs or disclosure alignment.
3. Use `1.2.3.3.6.1 Journal Soft-Delete and Export Visibility Definition` before any journal Archive, recovery, restore, export-visibility, copy, or disclosure work.
4. Use `1.2.3.3.6.2 Calendar Theme Hide / Clear / Recovery Semantics` before any calendar theme Archive, recovery, restore, storage, copy, or disclosure work.
5. Keep `1.2.3.3.7 Public Docs and Disclosure Alignment for Delete / Reset / Archive` downstream of verified behavior and any required closeout. This split plan does not redefine that public-doc lane and does not create new public claims.

Journal and calendar theme work must remain separate future lanes. They should not be combined into one Archive implementation lane.

## Candidate Lane Definitions

`1.2.3.3.6.1 Journal Soft-Delete and Export Visibility Definition`

- Classification: `needs_behavior_definition`
- Purpose: Decide whether journal `isDeleted` behavior should remain internal soft-delete behavior, become user-facing archive/recovery behavior, or remain out of scope.
- Must consider: visible delete behavior, `isDeleted` state, export visibility, recovery/restore semantics, test coverage, and future disclosure language.
- Non-approval: Do not implement journal delete, archive, restore, undo, export, storage, reducer, copy, or disclosure behavior in this split-plan lane.

`1.2.3.3.6.2 Calendar Theme Hide / Clear / Recovery Semantics`

- Classification: `needs_current_state_audit`
- Purpose: Decide whether calendar `deletedThemes`, `clearedThemeDays`, or similar behavior is hide/clear/recovery behavior, archive-like behavior, or purely internal state.
- Must consider: theme deletion, cleared days, repeated-theme behavior, recovery or restoration, user-facing labels, and storage/export implications.
- Non-approval: Do not implement calendar theme delete, archive, restore, undo, export, storage, reducer, copy, or disclosure behavior in this split-plan lane.

`1.2.3.3.6.3 Domain Delete/Remove Inventory Closeout`

- Classification: `ready_for_codex_docs_only`
- Purpose: Record that calendar todo, nutrition, recreation, and exercise currently appear to be delete/remove/clear behavior rather than Archive candidates, unless future evidence proves otherwise.
- Must consider: whether these domains need any immediate trust or copy follow-up, whether existing tests already cover delete/remove behavior, and whether public docs or disclosures need future alignment.
- Non-approval: Do not implement todo, nutrition, recreation, exercise, archive, restore, undo, export, storage, reducer, copy, or disclosure behavior in this split-plan lane.

`1.2.3.3.6.4 Settings Delete/Reset Boundary Closeout`

- Classification: `ready_for_codex_docs_only`
- Purpose: Decide whether Settings Delete local data work from `1.2.3.3.2` through `1.2.3.3.4` is sufficiently complete before public docs or disclosure alignment.
- Must consider: Delete local data copy, execution boundary tests, reset/password route separation, exported-file boundary, and starter-content boundary.
- Non-approval: Do not change Settings behavior, Settings navigation, delete/reset behavior, reset-password behavior, logout behavior, storage, export/import, copy, tests, README, public docs, privacy language, or store disclosures in this split-plan lane.

## Domains Deferred With No Current Lane

Global Archive has no current implementation lane. It remains deferred because the completed evidence does not show an approved global user-facing Archive control, route, action, reducer case, storage contract, export/import contract, test suite, public-doc claim, privacy-language claim, or store-disclosure claim.

Calendar todo, nutrition, recreation, and exercise should not get Archive work yet. Their current evidence should be handled only as delete/remove/clear inventory unless future evidence justifies a narrower audit.

Reset/password/logout-adjacent controls should not get Archive work. They remain separate Settings and auth-adjacent semantics, with reset-password reachability ambiguity already captured by the current-state audit.

Settings Delete local data should not get domain-level Archive work. It remains the destructive local-data control and should stay separate from domain hide, soft-delete, restore, undo, or recovery questions.

## Cross-Domain Non-Approvals

This artifact does not approve:

- source code changes
- tests
- user-facing copy changes
- README changes
- public docs changes
- privacy language changes
- store disclosure changes
- delete behavior changes
- reset behavior changes
- archive behavior changes
- global Archive implementation
- domain Archive implementation
- restore or undo implementation
- export behavior changes
- import behavior changes
- storage schema changes
- reducer or action changes
- navigation changes
- broad Settings redesign
- cross-domain shared archive abstractions
- legal, medical, clinical, HIPAA, launch-readiness, or store-readiness claims

No behavior, source code, tests, copy, README, public docs, privacy language, store disclosures, storage behavior, export/import behavior, delete/reset behavior, archive behavior, restore behavior, or navigation changed in this lane.

## Risks and Open Questions

Overall risk: low, because this lane is one internal docs file only.

Main risk: treating journal `isDeleted` or calendar `deletedThemes` / `clearedThemeDays` as approval for a global Archive feature. The control is to keep global Archive deferred and require separate journal and calendar lanes before any behavior, label, recovery, export/import, storage, test, copy, or disclosure work.

Open questions for future lanes:

- Should journal `isDeleted` remain an internal soft-delete implementation detail, become a user-facing recovery/archive model, or remain out of scope?
- Should journal export include, exclude, or disclose deleted subtype entries, and what test coverage would prove that behavior?
- Are calendar `deletedThemes` and `clearedThemeDays` user-facing hide/clear decisions, recovery candidates, or internal scheduling state?
- Do calendar theme labels need clarity before any storage or disclosure work?
- Is Settings Delete local data complete enough for `1.2.3.3.7 Public Docs and Disclosure Alignment for Delete / Reset / Archive`, or should `1.2.3.3.6.4` close it out first?

## Validation

No executable tests are required for this docs-only split-plan lane.

Required validation commands:

- `git diff --check`
- `rg -n "Domain-Level Delete / Archive Split Plan|global Archive|Journal Soft-Delete|Calendar Theme|Domain Delete/Remove Inventory|Settings Delete/Reset Boundary|ready_for_codex_docs_only|needs_discussion|needs_current_state_audit|needs_behavior_definition|defer_no_lane" docs/architecture/domain-delete-archive-split-plan.md`
- `git status --short --untracked-files=all`

Expected validation result: `git diff --check` passes, the required terms are found in this file, and `git status --short --untracked-files=all` reports only `?? docs/architecture/domain-delete-archive-split-plan.md` unless pre-existing changes are explicitly noted.
