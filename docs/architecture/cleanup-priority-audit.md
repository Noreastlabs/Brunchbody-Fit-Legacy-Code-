# Lane: 1.1.2.2.25 Cleanup-priority audit

## Summary

This artifact ranks already-established navigation cleanup candidates from the completed `1.1.2.2` audit family into one bounded priority register.

This lane is docs-only and evidence-first. It prioritizes likely follow-on implementation order without reopening the full navigation audit family, re-auditing the repo from scratch, or implementing cleanup.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane. Prior completed audit artifacts are authoritative for the decisions they already established. Live code may be cited only as confirmation context when a source-backed row needs wording support.

Current startup behavior, current route names, current visible labels, current root/tab/stack ownership, and current test-suite contents must remain unchanged. This artifact ranks already-established candidates only. It does not authorize implementation cleanup.

## Classification

Ready for codex

## Scope

### In Scope

- create exactly one docs-only artifact at `docs/architecture/cleanup-priority-audit.md`
- rank already-established navigation cleanup candidates and defer decisions into one conservative priority register
- use the completed `1.1.2.2` audit family as the primary decision surface for admitted rows
- record one row per admitted priority item with exactly these columns:
  - `item`
  - `current decision`
  - `implementation class`
  - `dependency / blocker`
  - `blast radius`
  - `recommended priority`
  - `source artifact`
  - `next lane`
- use only these implementation classes:
  - `targeted removal`
  - `rename migration`
  - `entry-path normalization`
  - `ownership clarification`
  - `test expansion`
- use only these blast-radius values:
  - `low`
  - `medium`
  - `high`
- use only these recommended-priority values:
  - `do first`
  - `do next`
  - `do later`
  - `hold`
- make later cleanup lanes easier to start without reopening the full audit family
- prefer under-inclusion over stronger new prioritization conclusions when a candidate row is ambiguous

### Out of Scope

- no production code changes
- no new tests
- no route renames
- no label changes
- no navigator ownership moves
- no startup-rule changes
- no entry-path normalization
- no UX or product decisions
- no dependency or tooling changes
- no speculative new cleanup candidates beyond source-backed admissions
- no new audit work beyond conservative prioritization of already-established decisions

## Files / Surfaces

Primary decision sources for this priority audit:

- `docs/architecture/navigation-cleanup-decision-log.md`
- `docs/architecture/unreferenced-navigation-surface-audit.md`
- `docs/architecture/unreferenced-screen-tree-audit.md`
- `docs/architecture/label-vs-route-name-audit.md`
- `docs/architecture/compatibility-hold-route-name-audit.md`
- `docs/architecture/cross-navigator-ownership-exception-audit.md`
- `docs/architecture/ownership-exception-clarification-audit.md`
- `docs/architecture/stack-entry-path-audit.md`
- `docs/architecture/navigator-test-coverage-gap-audit.md`
- `docs/architecture/compatibility-path-runtime-audit.md`

Context-only companion docs:

- `docs/architecture/dead-route-and-duplicate-route-audit.md`
- `docs/architecture/route-naming-and-constants-cleanup.md`
- `docs/architecture/route-constants-adoption-audit.md`
- `docs/architecture/navigation-call-site-drift-audit.md`

Live code confirmation context only when needed:

- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/routeNames.js`
- `src/screens/completeProfile/components/Welcome.js`
- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
- `src/screens/setting/pages/Setting/Setting.js`
- `src/screens/setting/pages/Tutorials/Tutorials.js`

## Current State

The navigation audit family is now complete through the decision-log stage. The completed specialist audits plus `navigation-cleanup-decision-log.md` already contain enough established candidate-cleanup, keep-for-compatibility, and defer decisions to support a bounded priority ranking without fresh discovery work.

Those outcomes are now distributed across enough documents that it is harder to answer simple sequencing questions such as:

- which already-established cleanup items appear safest to start first
- which items should follow only after the safest removals
- which compatibility holds still belong on hold instead of in an implementation lane
- which focused test-expansion lanes are worth sequencing after the safest cleanup work

This lane creates one conservative priority register for those already-established decisions without changing the underlying findings.

## Objective

Produce a bounded cleanup-priority audit that answers:

- which already-established cleanup candidates appear safest to do first
- which source-backed items are better suited for later sequencing
- which compatibility holds and defers should remain on hold
- which source artifact backs each admitted row
- which follow-on lane each admitted row should feed when implementation work is later approved

The goal is to let future implementation lanes start from a stable priority view instead of reopening the full navigation audit family.

## Boundary Rule for This Lane

This lane may:

- rank already-established cleanup candidates conservatively
- admit a row only when the cited source already established the underlying decision
- reuse the most specific supporting audit artifact when it stays at or below the same source strength as the decision log
- group clearly equivalent follow-on lane labels when that grouping does not broaden the source conclusion

This lane must not:

- strengthen any source conclusion
- convert `keep for compatibility` into approved implementation work
- turn `defer` into narrower implementation approval
- add speculative cleanup candidates
- rename routes, move ownership, change startup behavior, or add tests
- convert prioritization into implementation work

Operational admission rule:

- if a seeded candidate cannot be ranked without stronger blocker, blast-radius, or priority wording than the source supports, downgrade the wording to source strength or omit the row
- if a cited source already classified a subject as `keep for compatibility` or `defer`, preserve that current decision unchanged and treat the priority column as sequencing guidance only

## Audit Method

1. Inventory the completed audit outputs listed in the primary decision sources.
2. Start from the seeded 11-item candidate set as the preferred input set, not as automatic admissions.
3. Check each seeded candidate against `navigation-cleanup-decision-log.md` first, then the most specific cited audit only when that audit keeps the row at or below the same strength.
4. Admit a row only when its `current decision`, blocker wording, blast-radius wording, and recommended priority can all be stated without fresh analysis beyond the source-backed decision plus conservative sequencing logic.
5. If a candidate row would require stronger wording than the source supports, downgrade the wording to source strength or omit the row.
6. Do not add non-seeded rows unless a source-backed blocker row is strictly necessary to explain a seeded candidate.
7. Use filename-only values in `source artifact`.
8. Under-inclusion is preferred. Omit any plausible row that would require stronger priority language than the sources support.

## Priority Taxonomy

Blast radius in this lane means likely implementation reach for the next approved follow-on lane, not defect severity.

Implementation classes:

- `targeted removal`
- `rename migration`
- `entry-path normalization`
- `ownership clarification`
- `test expansion`

Blast-radius values:

- `low`
- `medium`
- `high`

Recommended-priority values:

- `do first`
- `do next`
- `do later`
- `hold`

Ranking rules:

- candidate cleanup items with `low` blast radius and weak dependencies rank highest
- `targeted removal` usually ranks above `rename migration` unless the source already indicates comparably low-risk rename work
- items currently at `defer` generally remain `hold` when the blocker is unresolved evidence, behavior, or product direction
- bounded `test expansion` rows may rank `do next` or `do later` when the source audit already isolates the missing coverage as focused follow-on work and the recommendation remains sequencing guidance rather than behavior-change approval
- `test expansion` ranks after the safest cleanup items unless a source audit already shows it is a prerequisite
- `hold` means preserve the current decision until a later lane is explicitly approved

## Priority Register

Omission is intentional. The seeded candidate set was reviewed conservatively, and each admitted row below stays at or below the cited source strength. No additional blocker row was needed to explain the admitted priorities.

| item | current decision | implementation class | dependency / blocker | blast radius | recommended priority | source artifact | next lane |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `DashboardNavigation.js` | `candidate cleanup` | `targeted removal` | confirm no hidden live references beyond audited wiring | `low` | `do first` | `unreferenced-navigation-surface-audit.md` | `targeted removal lane` |
| `src/screens/welcome/` | `candidate cleanup` | `targeted removal` | confirm no hidden runtime references beyond audited wiring | `low` | `do first` | `unreferenced-screen-tree-audit.md` | `targeted removal lane` |
| `Abbrevations` | `candidate cleanup` | `rename migration` | coordinated route-name plus copy migration | `medium` | `do next` | `compatibility-hold-route-name-audit.md` | `route rename migration lane` |
| `MealsList` | `candidate cleanup` | `rename migration` | coordinated navigation and call-site migration | `medium` | `do next` | `compatibility-hold-route-name-audit.md` | `route rename migration lane` |
| Dashboard route name versus visible `Home` | `keep for compatibility` | `rename migration` | cross-cutting label and route contract decision | `high` | `hold` | `label-vs-route-name-audit.md` | `label-versus-route-name clarification lane` |
| Tutorials root ownership exception | `keep for compatibility` | `ownership clarification` | multi-entry compatibility contract still intentional in current evidence | `high` | `hold` | `ownership-exception-clarification-audit.md` | `targeted ownership consolidation lane` |
| Tab shell default = `Calendar` | `defer` | `entry-path normalization` | UX and product decision required | `high` | `hold` | `stack-entry-path-audit.md` | `entry-path normalization lane` |
| Complete-profile completion -> `Home` -> `Dashboard` | `keep for compatibility` | `entry-path normalization` | completion-flow UX decision required before normalization | `medium` | `do later` | `stack-entry-path-audit.md` | `entry-path normalization lane` |
| Tutorial completion -> `Home` -> `Dashboard` | `keep for compatibility` | `entry-path normalization` | tutorial compatibility-path decision required before normalization | `medium` | `do later` | `stack-entry-path-audit.md` | `entry-path normalization lane` |
| Compatibility-path runtime coverage | `defer` | `test expansion` | direct runtime assertions for preserved compatibility paths remain incomplete | `low` | `do next` | `compatibility-path-runtime-audit.md` | `focused compatibility-path test lane` |
| Representative flow-level navigation smoke | `defer` | `test expansion` | representative forward-entry and back-navigation coverage remains partial | `medium` | `do later` | `navigator-test-coverage-gap-audit.md` | `stack-by-stack runtime smoke validation lane` |

## Related Context / Non-Findings

- ordinary `keep` items are intentionally omitted unless they are required as blockers for an admitted priority row
- stale-doc reconciliation-only findings do not become priority-register rows in this lane
- context-only naming, ownership, or call-site drift items stay out unless a source audit already classified them into the decision taxonomy
- the broader decision log contains additional `candidate cleanup`, `keep`, and `defer` rows, but this lane does not rank them unless they are part of the seeded candidate set or required blocker context
- no extra cleanup candidates were added just because they seemed plausible; this register is source-backed and intentionally under-inclusive

## Public Interfaces

None.

This artifact changes no public APIs, route destinations, labels, providers, dependencies, tests, or runtime behavior.

Preserved invariants for this lane:

- bootstrap still resolves `Home` versus `CompleteProfile`
- `Home` remains the authenticated shell entry
- current root, tab, and nested-stack ownership remains unchanged
- current registered route names and visible labels remain unchanged in this lane
- current test files remain unchanged in this lane

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane
- prior completed audit artifacts are authoritative for the cleanup decisions they already established
- `navigation-cleanup-decision-log.md` is the first-stop consolidation surface for seeded row admission
- live code may be cited only as confirmation context where a source-backed row needs wording support
- nearby approved lane docs may inform cadence and phrasing only; they do not replace the governing inputs

## Acceptance Criteria

- exactly one new docs artifact is added at `docs/architecture/cleanup-priority-audit.md`
- the artifact is in Brunch Body Project Template style
- the artifact uses one priority register with exactly these columns:
  - `item`
  - `current decision`
  - `implementation class`
  - `dependency / blocker`
  - `blast radius`
  - `recommended priority`
  - `source artifact`
  - `next lane`
- every admitted row uses only the allowed implementation-class, blast-radius, and recommended-priority values
- every admitted row traces to an already-established decision in the decision log or an equally strong, more specific source audit that does not broaden it
- the artifact stays docs-only and does not imply implementation approval
- the artifact does not rename routes, move ownership, change startup behavior, or add tests

## Validation

- static review that the only repo change is `docs/architecture/cleanup-priority-audit.md`
- static review that every admitted row traces to an already-established decision in the decision log or an equally strong, more specific source audit
- static review that each `source artifact` cell uses filename-only values
- static review that each recommended priority is justified by blocker and blast radius using conservative sequencing logic rather than fresh discovery
- static review that any seeded candidate needing stronger new reasoning would be downgraded or omitted instead of overstated
- static review that the artifact clearly states that priority values are sequencing guidance only and do not upgrade `keep for compatibility` or `defer` into implementation approval

## Risks / Notes

- the main risk is overstating a source-backed decision by turning prioritization into fresh analysis
- another risk is making `do next` or `do later` sound like execution approval instead of sequencing guidance
- another risk is broadening grouped lane labels beyond what the source audits actually support
- another risk is promoting compatibility holds or defers into implied implementation decisions
- this lane should remain conservative and under-claim whenever a ranking judgment would otherwise require stronger new reasoning

## Follow-on Lane Seeds

- `targeted removal lane`
- `route rename migration lane`
- `label-versus-route-name clarification lane`
- `targeted ownership consolidation lane`
- `entry-path normalization lane`
- `focused compatibility-path test lane`
- `stack-by-stack runtime smoke validation lane`

## Assumptions

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain the governing inputs for this lane
- prior completed audit artifacts are authoritative for the cleanup decisions being ranked
- live code is confirmation context only, not a source for new cleanup conclusions in this lane
- under-claiming is preferred over broadening any source conclusion
- this lane is prioritization-only: it ranks likely implementation order but does not approve or perform the work
