# Lane 1.1.8.2 Cleanup Decision Log

## Purpose / Scope Lock

Lane `1.1.8.2` is docs-only. It records cleanup decisions only.

This log approves no behavior, config, dependency, privacy, disclosure,
storage, route, reducer, selector, UX, AI, backend, desktop, monetization,
package, lockfile, CI, script, native, or production source changes.

This artifact is a lightweight governance record for Phase 1 cleanup and
stabilization decisions that are already supported by existing architecture
docs or repo-observed behavior. It does not create new cleanup approval, new
refactor approval, new migration approval, new privacy claims, or new
disclosure claims.

Live repo behavior remains more authoritative than older prose if a conflict
appears. If evidence is unclear, the decision must be marked `Needs
verification` instead of presented as settled fact.

## How to use this log

- Use this log to avoid re-deciding cleanup boundaries already recorded in
  Phase 1 architecture docs.
- Before opening a cleanup lane, check whether the proposed work touches a
  logged decision, a reopen trigger, or a `Needs verification` item.
- Treat each evidence/source entry as a pointer to the source artifact, not as
  a replacement for reading that artifact.
- Keep future lanes bounded to their approved files and behavior surfaces.
- Preserve local-first, mobile-first, minimal-diff, and product-truthfulness
  guardrails unless a later lane explicitly reopens them.

## Do not use this log to

- Create a roadmap, plan-to-plan layer, or broad cleanup program.
- Approve production behavior changes.
- Approve route, reducer, selector, storage, migration, persistence, reset,
  logout, delete, export, import, UX, copy, privacy, disclosure, dependency,
  tooling, CI, backend, AI, desktop, or monetization changes.
- Promote candidate cleanup findings into implementation approval.
- Resolve conflicts by changing older docs.
- Claim release readiness, accessibility certification, privacy certification,
  store-readiness, or backend/cloud absence beyond the cited evidence.

## Decision entry schema

Each cleanup decision entry must include:

- Decision ID
- Title
- Status
- Decision
- Rationale
- Evidence/source
- Impact on future cleanup lanes
- Reopen trigger

Status values used in this log:

- `Settled`: supported by current architecture docs or repo-observed behavior.
- `Settled / keep for compatibility`: supported, but preserved because current
  compatibility contracts still matter.
- `Settled with deferred normalization`: current behavior is recorded, while
  cleanup or migration remains explicitly deferred.
- `Settled current-state finding`: recorded as current state only, without
  approving remediation.
- `Settled scope boundary`: recorded as a boundary or standard, not as completed
  implementation.
- `Needs verification`: evidence supports caution or candidate review, but not a
  settled cleanup action.

## Cleanup decision log

| Decision ID | Title | Status | Decision | Rationale | Evidence/source | Impact on future cleanup lanes | Reopen trigger |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CL-001` | Cleanup governance is docs-only and non-authorizing | `Settled` | Cleanup governance docs record boundaries and evidence; they do not approve implementation. | The project template, project scope, and refactor guardrails all require bounded, minimal-diff, evidence-first cleanup. | `Brunch Body Project Template.md`; `Brunch Body Project Scope.md`; `refactor-guardrails.md` | Future cleanup lanes must define scope, forbidden surfaces, evidence, and validation before changing code or behavior. | Reopen only if the project owner changes the cleanup governance model or explicitly authorizes a broader implementation mode. |
| `CL-002` | Current navigation tree and route ownership are preserved unless explicitly reopened | `Settled / keep for compatibility` | Root, tab, nested-stack, startup, route-name, and route-ownership contracts remain current unless a lane explicitly reopens them. | Navigation docs record current ownership, compatibility holds, candidate cleanup items, and deferred items without changing behavior. | `navigation-tree-and-route-ownership.md`; `navigation-cleanup-decision-log.md` | Future navigation cleanup must preserve current route names, startup behavior, and ownership unless scoped as behavior-changing. | Reopen only with owner-approved route, startup, tab, or navigator behavior scope plus focused validation. |
| `CL-003` | Redux store, reducer keys, thunk semantics, and reset behavior are current contracts | `Settled` | The current Redux store topology, persisted reducer keys, thunk-shaped action usage, middleware reality, and `RESET_APP` behavior are documented contracts. | Store review documents current store wiring, persistence whitelist, disabled middleware checks, local-only guard coverage, and reset/delete distinctions. | `store-and-middleware-review.md` | Future Redux cleanup must preserve reducer mount keys, action/thunk semantics, screen-facing read contracts, and reset behavior unless explicitly reopened. | Reopen only with a lane that names the affected store contract, adds focused tests or characterization, and scopes any behavior change. |
| `CL-004` | Storage remains mixed local-first persistence; normalization and migration are deferred | `Settled with deferred normalization` | Current storage spans Redux Persist on AsyncStorage, direct AsyncStorage keys, MMKV bundled-plan state, and local export files. | Persistence and storage docs record overlapping ownership and defer normalization, migration, reset/delete semantics, and import/export changes. | `persistence-inventory.md`; `storage-contract-matrix.md` | Future storage lanes must not collapse logout, `RESET_APP`, delete-account, direct keys, Redux Persist, MMKV, or export behavior into one semantic bucket. | Reopen only with explicit storage/migration/reset/delete/export/import scope and evidence for current behavior. |
| `CL-005` | Dependency/tooling audits do not approve removals, upgrades, or lockfile/config edits | `Needs verification` | Dependency and tooling candidate findings remain audit findings only, not cleanup approval. | The dependency audit records active, residual, uncertain, and follow-on candidates; lint/formatting baseline records current warnings without remediation. | `dependency-audit.md`; `lint-formatting-baseline.md` | Future dependency or tooling lanes must verify current usage and scope package, lockfile, native, lint, formatting, or config changes explicitly. | Reopen only with a targeted dependency/tooling lane that proves candidate status and includes package, lockfile, config, native, and validation scope. |
| `CL-006` | CI is present but incomplete; this log does not expand CI | `Settled current-state finding` | Current CI coverage is limited to local-only guard and secret scan workflows; this log does not add CI coverage. | CI health docs record existing workflows, local command results, and gaps for lint, Jest, formatting, builds, and native validation. | `ci-health.md` | Future CI lanes must treat missing coverage as a scoped implementation choice, not as approved by this log. | Reopen only with owner-approved workflow, package-script, dependency, or validation-policy scope. |
| `CL-007` | Accessibility baseline is scoping, not certification or completed remediation | `Settled scope boundary` | Accessibility docs define a Phase 1 baseline and follow-on buckets, but do not claim certification or completed remediation. | Accessibility baseline docs are parent scoping only and explicitly avoid repo-wide accessibility rewrites, legal claims, and broad UX redesign. | `accessibility-baseline.md` | Future accessibility lanes must gather direct surface evidence and avoid implying full app accessibility sign-off from baseline scoping. | Reopen only with a bounded accessibility audit or remediation lane that names surfaces, evidence method, and validation. |
| `CL-008` | Test standards require validation matched to the changed surface | `Settled` | Source, test, config, package, route, storage, reducer, selector, UX, and docs-only lanes must choose validation according to the touched surface. | Test standards define focused, full-suite, and docs-only validation expectations; CI health records current CI gaps. | `test-harness-and-standards.md`; `ci-health.md` | Future lanes should run focused tests for touched behavior, full Jest for shared/cross-domain changes, and diff-only validation for narrow docs-only work. | Reopen only if test harness, CI coverage, package scripts, or validation policy changes in a later approved lane. |
| `CL-009` | Future refactors must stay bounded, behavior-preserving by default, and stop on trust-sensitive changes | `Settled` | Refactor lanes must use the narrowest classification, preserve current contracts by default, and stop or split when trust-sensitive surfaces enter scope. | Refactor guardrails define classification, lane sizing, forbidden cleanup-only shapes, route/state/storage boundaries, privacy checks, and stop triggers. | `refactor-guardrails.md` | Future cleanup lanes must not bundle broad rewrites, behavior change, privacy/disclosure edits, dependency changes, CI changes, AI, backend, desktop, or monetization work into cleanup-only scope. | Reopen only with explicit owner approval for a behavior-changing, policy/trust-affecting, or oversized refactor split into bounded lanes. |

## Future reviewer checklist

- Confirm the lane changes only approved files and surfaces.
- Confirm the lane classification matches the actual diff.
- Confirm no source, test, package, lockfile, CI, script, native, privacy,
  disclosure, route, reducer, selector, storage, UX, AI, backend, desktop, or
  monetization change slipped into a cleanup-only lane.
- Confirm every cleanup decision cites current evidence or is marked `Needs
  verification`.
- Confirm candidate cleanup findings are not treated as implementation approval.
- Confirm local-first behavior, reset/delete/export/import semantics, and
  product-truthfulness claims are preserved unless explicitly reopened.
- Confirm validation matches the changed surface.
- Confirm skipped tests are explained.
- Confirm final `git status --short` matches the lane's allowed file radius.

## Validation notes

Docs-only closeout validation for this lane:

- Run `git diff --check`.
- Run final `git status --short`.
- Jest, lint, package, native, CI, and app runtime tests are not required because
  this lane adds one docs-only artifact and changes no executable behavior.

Expected final `git status --short` output for this lane:

```text
?? docs/architecture/cleanup-decision-log.md
```
