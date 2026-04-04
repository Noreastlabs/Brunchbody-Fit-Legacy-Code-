# Lane: 1.1.2.2.22 Navigation cleanup decision log

## Summary

This artifact consolidates already-established navigation cleanup decisions from the completed `1.1.2.2` audit family into one bounded decision log.

This lane is docs-only and evidence-first. It records what is currently kept, kept for compatibility, a later cleanup candidate, or still deferred without reopening strategy, re-auditing the repo from scratch, or implementing cleanup.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane. Prior completed audit artifacts are authoritative for the decisions they already established. Live code may be cited only as confirmation context when a source-backed decision needs wording support.

Current startup behavior, current route names, current visible labels, and current root/tab/stack ownership must remain unchanged. This artifact consolidates evidence only. It does not authorize implementation cleanup.

## Classification

Ready for codex

## Scope

### In Scope

- create exactly one docs-only decision-log artifact at `docs/architecture/navigation-cleanup-decision-log.md`
- consolidate bounded outcomes already established by the completed navigation audit family under `1.1.2.2`
- normalize those outcomes into one stable decision surface using the exact values:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- record one row per admitted decision-worthy item with:
  - `item`
  - `current decision`
  - `decision basis`
  - `source artifact`
  - `follow-on lane`
- make later cleanup lanes easier to scope without relitigating prior audit conclusions
- prefer under-inclusion over stronger new conclusions when a source audit is ambiguous

### Out of Scope

- no production code changes
- no route renames
- no label changes
- no navigator ownership moves
- no startup-rule changes
- no tab redesign
- no screen-internal behavior changes
- no dependency or tooling changes
- no unrelated UX cleanup
- no new audit work beyond consolidating already-established findings

## Files / Surfaces

Primary evidence sources for this decision log:

- `docs/architecture/dead-route-and-duplicate-route-audit.md`
- `docs/architecture/unreferenced-navigation-surface-audit.md`
- `docs/architecture/unreferenced-screen-tree-audit.md`
- `docs/architecture/label-vs-route-name-audit.md`
- `docs/architecture/compatibility-hold-route-name-audit.md`
- `docs/architecture/route-constants-adoption-audit.md`
- `docs/architecture/cross-navigator-ownership-exception-audit.md`
- `docs/architecture/navigation-call-site-drift-audit.md`
- `docs/architecture/stack-entry-path-audit.md`
- `docs/architecture/navigator-test-coverage-gap-audit.md`
- `docs/architecture/stale-architecture-doc-reconciliation.md`

Context-only companion docs:

- `docs/architecture/navigation-tree-and-route-ownership.md`
- `docs/architecture/app-structure-inventory.md`
- `docs/architecture/root-stack-boundary-cleanup.md`
- `docs/architecture/bottom-tab-shell-cleanup.md`
- `docs/architecture/calendar-stack-boundary-cleanup.md`
- `docs/architecture/journal-stack-extraction.md`
- `docs/architecture/nutrition-stack-extraction.md`
- `docs/architecture/recreation-stack-extraction.md`
- `docs/architecture/settings-account-stack-extraction.md`
- `docs/architecture/route-naming-and-constants-cleanup.md`
- `docs/architecture/navigation-smoke-tests.md`

Live code confirmation context only:

- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`
- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/CalendarNavigation.js`
- `src/navigation/JournalNavigation.js`
- `src/navigation/NutritionNavigation.js`
- `src/navigation/RecreationNavigation.js`
- `src/navigation/SettingsNavigation.js`

## Current State

The project now has a broad family of navigation cleanup, audit, and reconciliation docs under `docs/architecture`. Those artifacts already establish bounded findings and dispositions for residual navigation surfaces, dormant screen trees, label-vs-route mismatch, route-name compatibility holds, ownership exceptions, entry-path quirks, representative call-site ambiguity, route-constants adoption context, navigator coverage gaps, and stale-doc drift.

Those outcomes are now distributed across enough artifacts that it is harder to answer simple review questions such as:

- what is intentionally kept
- what is only kept for compatibility
- what is the next low-risk cleanup candidate
- what still needs to be deferred

This lane creates one maintained decision log for those already-established outcomes without changing the underlying findings.

## Objective

Produce a bounded decision log that answers:

- which navigation findings are settled enough to treat as current decisions
- which items are intentionally kept
- which items are preserved for compatibility
- which items are later cleanup candidates
- which items remain deferred pending stronger evidence or broader scope
- which source artifact established each decision
- which follow-on lane should absorb later work

The goal is to prevent repeated rediscovery of the same navigation conclusions across future lanes.

## Boundary Rule for This Lane

This lane may:

- consolidate already-established audit outcomes
- normalize prior findings into one stable decision taxonomy
- cross-reference the most specific audit artifact that established each admitted decision
- reuse source-named or clearly equivalent follow-on lanes

This lane must not:

- add new implementation conclusions not already supported by prior audits
- rename routes
- move ownership between navigators
- change startup behavior
- redesign tabs or flows
- convert the decision log into implementation work

Operational deferral rule:

- if a prior audit did not already establish a clean equivalent decision, omit the item rather than strengthening it in this consolidation lane
- if a cited source already classified a subject as `defer`, carry that deferral forward unchanged rather than narrowing it here

## Audit Method

1. Inventory the completed navigation audit outputs listed in the primary evidence sources.
2. Extract only the bounded findings and dispositions already established by those artifacts.
3. Normalize source dispositions conservatively into this lane's four-value taxonomy:
   - `keep` -> `keep`
   - `keep for compatibility` -> `keep for compatibility`
   - `candidate remove` / `candidate consolidate` -> `candidate cleanup` only when the consolidated row does not broaden the source conclusion
   - `defer` -> `defer`
4. Admit a row only when:
   - the source audit already states that decision explicitly, or the row is clearly equivalent in meaning and strength
   - the wording stays at or below the source audit's conclusion strength
   - the item is a decision-worthy navigation cleanup outcome rather than ordinary baseline structure
5. Prefer the most specific audit artifact when the same subject appears in multiple places, and do not duplicate the decision under a broader source.
6. Keep related-context-only mentions, stale-doc-only update dispositions such as `update now` or `keep with note`, and live-code-only observations out of the table.
7. Use filename-only values in `source artifact`.
8. Under-inclusion is preferred. Omit any plausible row that would require stronger wording than the source audit supports.

## Decision Taxonomy

- `keep`: current navigation behavior is intentionally preserved as-is and the source audit treated it as a settled decision-worthy finding
- `keep for compatibility`: current behavior or naming is intentionally preserved because current contracts, entry paths, or compatibility context still matter
- `candidate cleanup`: later cleanup or migration work is supported by existing evidence, but not in this lane
- `defer`: the issue is real or meaningful, but current evidence or scope is not strong enough to turn it into narrower cleanup approval

`candidate cleanup` is the normalized consolidation value used when a source audit recorded `candidate remove` or `candidate consolidate` without supporting a stronger cleanup conclusion here.

## Decision Log

Omission is intentional. Ordinary current-owner aligned routes, stacks, and entry paths remain current `keep` by omission unless a prior audit elevated them as a decision-worthy exception. Likewise, source artifacts that only established baseline keep/adoption context, related context / non-findings, or stale-doc update dispositions do not add standalone rows here unless they also support a clean equivalent cleanup decision.

| item | current decision | decision basis | source artifact | follow-on lane |
| --- | --- | --- | --- | --- |
| Bootstrap entry: `Home` vs `CompleteProfile` | `keep` | mounted startup entry remains current-owner aligned at the root contract | `stack-entry-path-audit.md` | `none` |
| `CalendarMain` | `keep for compatibility` | active nested entry route remains an explicit code-backed compatibility hold | `compatibility-hold-route-name-audit.md` | `route rename migration lane` |
| Complete-profile completion -> `Home` -> `Dashboard` | `keep for compatibility` | completion exit intentionally re-enters `Home` and targets nested `Dashboard` instead of the tab default | `stack-entry-path-audit.md` | `entry-path normalization lane` |
| Dashboard route name versus visible `Home` | `keep for compatibility` | confirmed route-name and visible-label mismatch is preserved under the current shell and re-entry contract | `label-vs-route-name-audit.md` | `label-versus-route-name clarification lane` |
| Tutorial completion -> `Home` -> `Dashboard` | `keep for compatibility` | tutorial exit intentionally re-enters `Home` and targets nested `Dashboard` | `stack-entry-path-audit.md` | `entry-path normalization lane` |
| Tutorials root ownership exception | `keep for compatibility` | root-owned `Tutorials` remains intentional despite settings-tree locality and multiple entry paths | `cross-navigator-ownership-exception-audit.md` | `ownership exception clarification lane` |
| `Abbrevations` | `candidate cleanup` | active misspelled route name persists as coordinated later migration work rather than an in-place fix | `compatibility-hold-route-name-audit.md` | `route rename migration lane with coordinated copy correction` |
| `Calories` versus visible `Calories In/Out` | `candidate cleanup` | current route name differs from the visible journal label and destination naming | `label-vs-route-name-audit.md` | `label-versus-route-name clarification lane` |
| `DashboardNavigation.js` | `candidate cleanup` | present in `src/navigation` but unreferenced by current inspected wiring | `unreferenced-navigation-surface-audit.md` | `targeted navigation-surface removal lane` |
| `ExportToCSV` versus visible `Export Journal to Files` | `candidate cleanup` | current route name differs from both the visible entry label and destination heading | `label-vs-route-name-audit.md` | `label-versus-route-name clarification lane` |
| `Journal` tab route plus `Journal` nested entry route | `candidate cleanup` | duplicate tab and nested entry registration remains a later consolidation candidate | `dead-route-and-duplicate-route-audit.md` | `duplicate-route consolidation lane` |
| `MealsList` | `candidate cleanup` | awkward active route name remains a later rename candidate | `compatibility-hold-route-name-audit.md` | `route rename migration lane` |
| `MyAccount` versus visible `My Accounts` | `candidate cleanup` | current route name differs from the visible profile entry label | `label-vs-route-name-audit.md` | `label-versus-route-name clarification lane` |
| `Nutrition` tab route plus `Nutrition` nested entry route | `candidate cleanup` | duplicate tab and nested entry registration remains a later consolidation candidate | `dead-route-and-duplicate-route-audit.md` | `duplicate-route consolidation lane` |
| `QuarterlyEntry` versus visible `Quarterly Review` | `candidate cleanup` | current route name differs from the journal entry label and destination naming | `label-vs-route-name-audit.md` | `label-versus-route-name clarification lane` |
| `Recreation` tab route plus `Recreation` nested entry route | `candidate cleanup` | duplicate tab and nested entry registration remains a later consolidation candidate | `dead-route-and-duplicate-route-audit.md` | `duplicate-route consolidation lane` |
| `Settings` tab route plus `Settings` nested entry route | `candidate cleanup` | duplicate tab and nested entry registration remains a later consolidation candidate | `dead-route-and-duplicate-route-audit.md` | `duplicate-route consolidation lane` |
| `src/screens/welcome/` | `candidate cleanup` | present but unreferenced by current inspected wiring while the active welcome experience already lives in the complete-profile flow | `unreferenced-screen-tree-audit.md` | `targeted approved screen-tree removal lane` |
| `TermsOfUse` plus `PrivacyPolicy` registered routes | `candidate cleanup` | still registered even though the current settings landing uses external links and the audit found no additional `src` navigation references | `dead-route-and-duplicate-route-audit.md` | `dead-route removal lane` |
| `Tutorials` route name versus visible `Tutorial` | `candidate cleanup` | current route name differs from the visible Settings entry label | `label-vs-route-name-audit.md` | `label-versus-route-name clarification lane` |
| Untouched stack-local child routes outside representative smoke set | `candidate cleanup` | registered routes remain structurally covered but under-exercised at runtime | `navigator-test-coverage-gap-audit.md` | `cleanup decision log update` |
| `WeeklyEntry` versus visible `Weekly Review` | `candidate cleanup` | current route name differs from the journal entry label and destination naming | `label-vs-route-name-audit.md` | `label-versus-route-name clarification lane` |
| Compatibility-path runtime coverage | `defer` | preserved onboarding and tutorial compatibility paths remain under-asserted at runtime | `navigator-test-coverage-gap-audit.md` | `focused compatibility-path test lane` |
| `Edit Writing` | `defer` | active route name sits beside visible-label context and was not safe to narrow to simple cleanup | `compatibility-hold-route-name-audit.md` | `route rename migration lane` |
| Journal cluster call-site drift | `defer` | representative journal call sites remain mixed and ambiguous rather than clearly stale or fully settled | `navigation-call-site-drift-audit.md` | `navigator-local registry normalization lane` |
| `NewDay` | `defer` | active route name sits beside visible-label context and was not safe to narrow to simple cleanup | `compatibility-hold-route-name-audit.md` | `route rename migration lane` |
| Representative flow-level navigation smoke | `defer` | current runtime smoke coverage remains partial rather than comprehensive | `navigator-test-coverage-gap-audit.md` | `stack-by-stack runtime smoke validation lane` |
| `src/screens/splashScreen/` | `defer` | unmounted startup residue overlaps historical startup logic and was not safe to narrow to removal | `unreferenced-screen-tree-audit.md` | `startup-residue decision lane` |
| Tab shell default = `Calendar` | `defer` | preserved tab default remains a stable UX quirk that is not yet normalized | `stack-entry-path-audit.md` | `entry-path normalization lane` |

## Related Context / Non-Findings

- ordinary current-owner aligned routes, stacks, and entry paths remain current `keep` by omission unless a prior audit elevated them as a decision-worthy exception
- `route-constants-adoption-audit.md` was reviewed as primary evidence, but its baseline keep/adoption rows did not add standalone cleanup decisions beyond context already captured here
- `stale-architecture-doc-reconciliation.md` was reviewed as primary evidence, but its update dispositions such as `update now` and `keep with note` are not equivalent to this lane's decision taxonomy and therefore do not become standalone rows here
- `dead-route-and-duplicate-route-audit.md` contributes only the subjects that were not already owned more specifically by unreferenced-surface, screen-tree, label-mismatch, compatibility-hold, ownership-exception, or entry-path audits
- `DashboardTabs`, `style.js`, onboarding `Welcome.js`, and settings landing `Setting.js` were intentionally left out because the more specific source-backed decisions here already cover the relevant cleanup surface or because the source audit treated them as context rather than a standalone cleanup decision

## Public Interfaces

None.

This artifact changes no public APIs, route destinations, labels, providers, dependencies, or runtime behavior.

Preserved invariants for this lane:

- bootstrap still resolves `Home` versus `CompleteProfile`
- `Home` remains the authenticated shell entry
- current root, tab, and nested-stack ownership remains unchanged
- current registered route names and visible labels remain unchanged in this lane

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane
- prior completed audit artifacts are authoritative for the decisions they already established
- live code may be cited only as confirmation context where a source-backed decision needs wording support
- nearby approved lane docs may inform cadence and phrasing only; they do not replace the governing inputs

## Acceptance Criteria

- exactly one new docs artifact is added at `docs/architecture/navigation-cleanup-decision-log.md`
- the artifact is in Brunch Body Project Template style
- the artifact consolidates prior navigation audit outcomes into one bounded decision log
- the artifact uses one decision-log table with exactly these columns:
  - `item`
  - `current decision`
  - `decision basis`
  - `source artifact`
  - `follow-on lane`
- each row uses one of the exact decision values:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- the artifact does not invent stronger conclusions than the source audits support
- the artifact does not rename routes, move ownership, or change startup behavior
- the artifact clearly separates consolidated decisions from later implementation work

## Validation

- static review that every admitted row traces to an explicit source finding or a clearly equivalent source-backed decision
- static review that source precedence favors the most specific audit artifact when the same subject appears in multiple docs
- static review that each `current decision` cell uses only the four required values
- static review that no row overstates its source, renames routes, moves ownership, or changes startup behavior
- final diff review that the only repo change is `docs/architecture/navigation-cleanup-decision-log.md`

## Risks / Notes

- the main risk is over-consolidating and turning ambiguous prior findings into stronger conclusions than the source audits actually support
- another risk is duplicating the same subject under multiple source artifacts instead of selecting the most specific source
- another risk is widening the log into baseline route inventory or implementation planning instead of keeping it as a bounded consolidation artifact
- this lane should stay conservative and prefer omission over stronger wording whenever a source finding does not cleanly survive normalization

## Follow-on Lane Seeds

- targeted navigation-surface removal lane
- targeted approved screen-tree removal lane
- startup-residue decision lane
- label-versus-route-name clarification lane
- route rename migration lane
- ownership exception clarification lane
- entry-path normalization lane
- navigator-local registry normalization lane
- stack-by-stack runtime smoke validation lane
- focused compatibility-path test lane
- duplicate-route consolidation lane
- dead-route removal lane
- cleanup decision log update

## Assumptions

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` are the governing inputs for this lane
- prior completed audit artifacts are the primary authority for the decisions this log records
- under-inclusion is preferred over strengthening or broadening ambiguous source findings
- this lane is about consolidation only, not new analysis or implementation
