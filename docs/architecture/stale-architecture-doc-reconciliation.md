# Lane: 1.1.2.2.12 Stale architecture-doc reconciliation

## Summary

This artifact defines a bounded reconciliation lane for stale architecture documentation so the current `docs/architecture` folder can again be trusted as a present-state reference set.

This lane is docs-only and evidence-first. It compares older architecture-doc statements against live code and the newer approved navigation lane family without changing runtime behavior, navigator ownership, route names, or startup semantics.

For this lane, live code is the baseline truth. `src/bootstrap/AppBootstrap.js`, `src/root-container/RootContainer.js`, the mounted navigator files in `src/navigation/`, and `src/navigation/routeNames.js` are the authoritative current-state surfaces for bootstrap behavior, navigator ownership, and route constants. `App.js` may be inspected as context, but it should not override those active bootstrap and navigation surfaces unless its active entry role is explicitly re-verified during implementation.

## Classification

Ready for codex

## Scope

### In Scope

- create one docs-only reconciliation artifact for stale architecture-doc cleanup
- inventory the full pre-existing `docs/architecture` architecture-doc set as reconciliation targets
- compare older architecture-doc statements against:
  - live bootstrap and navigation code
  - newer approved navigation cleanup, extraction, audit, and smoke-test docs
- identify stale sections or statements rather than hand-waving at whole files
- classify each stale item using a bounded issue-type vocabulary
- assign each stale item one bounded disposition
- produce a bounded update-priority list for architecture docs only
- distinguish doc drift from unresolved architecture ambiguity

### Out of Scope

- no production code changes
- no route removals
- no route renames
- no navigator ownership moves
- no startup-rule changes
- no tab redesign
- no screen-internal behavior changes
- no privacy or disclosure changes
- no dependency or tooling changes
- no unrelated UX cleanup
- no direct edits to existing architecture docs in this lane

## Files / Surfaces

Primary current-state evidence surfaces for this lane:

- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`
- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/CalendarNavigation.js`
- `src/navigation/JournalNavigation.js`
- `src/navigation/NutritionNavigation.js`
- `src/navigation/RecreationNavigation.js`
- `src/navigation/SettingsNavigation.js`
- `src/navigation/routeNames.js`

Supporting context only:

- `App.js`
- `README.md`
- `src/navigation/DashboardNavigation.js`

Current architecture-doc reconciliation target set:

| Doc | Current role in the folder |
| --- | --- |
| `docs/architecture/app-structure-inventory.md` | Older present-state inventory that now includes stale startup and navigation ownership statements |
| `docs/architecture/bottom-tab-shell-cleanup.md` | Earlier shell-cleanup lane doc with some now-stale current-state framing |
| `docs/architecture/calendar-stack-boundary-cleanup.md` | Newer lane doc that reflects current calendar nested-stack ownership |
| `docs/architecture/dead-route-and-duplicate-route-audit.md` | Newer audit artifact that already reflects current narrowed root ownership |
| `docs/architecture/journal-stack-extraction.md` | Newer lane doc that reflects current journal nested-stack ownership |
| `docs/architecture/legacy-residue-audit.md` | Older companion audit; mostly context, not current navigation truth |
| `docs/architecture/navigation-smoke-tests.md` | Newer lane doc that reflects the current bootstrap and ownership contract |
| `docs/architecture/navigation-tree-and-route-ownership.md` | Older current-state route inventory with stale root and nested ownership details |
| `docs/architecture/nutrition-stack-extraction.md` | Newer lane doc that reflects current nutrition nested-stack ownership |
| `docs/architecture/recreation-stack-extraction.md` | Newer lane doc that reflects current recreation nested-stack ownership |
| `docs/architecture/risk-and-coupling-audit.md` | Older audit whose boot-path and root-fan-in findings now include stale evidence bullets |
| `docs/architecture/root-stack-boundary-cleanup.md` | Earlier root-cleanup lane doc with now-stale current-state framing |
| `docs/architecture/route-naming-and-constants-cleanup.md` | Newer lane doc that reflects current route-constants ownership and current route sets |
| `docs/architecture/settings-account-stack-extraction.md` | Newer lane doc that reflects current settings-stack ownership and the preserved root-owned `Tutorials` exception |

Newer approved lane docs that form the current reconciliation baseline:

- `docs/architecture/calendar-stack-boundary-cleanup.md`
- `docs/architecture/journal-stack-extraction.md`
- `docs/architecture/nutrition-stack-extraction.md`
- `docs/architecture/recreation-stack-extraction.md`
- `docs/architecture/settings-account-stack-extraction.md`
- `docs/architecture/route-naming-and-constants-cleanup.md`
- `docs/architecture/dead-route-and-duplicate-route-audit.md`
- `docs/architecture/navigation-smoke-tests.md`

## Current State

At the start of this lane, `docs/architecture` contained 14 pre-existing architecture docs. This artifact adds a fifteenth document, while those 14 pre-existing docs remain the reconciliation target set. That target set mixes older inventories and audits with newer navigation cleanup and extraction artifacts.

Active code currently shows the following startup and navigation contract:

1. `AppBootstrap` calls `resolveInitialRouteName()`.
2. `resolveInitialRouteName()` reads `AsyncStorage.getItem('user_profile')`.
3. `resolveInitialRouteName()` returns `ROOT_ROUTES.HOME` when saved profile data exists and `ROOT_ROUTES.COMPLETE_PROFILE` otherwise.
4. `AppBootstrap` calls `hydrateWorkoutPlans()` during bootstrap and returns `null` until `initialRouteName` resolves.
5. `RootContainer` receives `initialRouteName` and passes it into `RootNavigation`.
6. `RootNavigation` mounts the root stack with that same `initialRouteName`.

Active code also shows that the current root stack now owns only three routes:

- `CompleteProfile`
- `Home`
- `Tutorials`

Active code also shows that `BottomTabNavigation` owns the current six top-level authenticated destinations:

- `Dashboard`
- `Journal`
- `Calendar`
- `Nutrition`
- `Recreation`
- `Settings`

Active code also shows that the authenticated shell now mounts nested domain navigators for:

- `Journal`
- `Calendar`
- `Nutrition`
- `Recreation`
- `Settings`

`Dashboard` remains the only direct tab-wrapper destination in the current tab shell. `routeNames.js` is the current route-constants surface for root, tab, and nested-stack route names.

`App.js` can still be inspected as context for the active entry path, but this lane should not rely on it over `AppBootstrap`, `RootContainer`, the mounted navigator files, and `routeNames.js` when older docs describe an earlier bootstrap or navigation ownership model.

Newer lane docs already reflect the current narrowed root ownership, the extracted domain stacks, the route-constants surface, and the current smoke-test contract. Older inventory and audit docs now require reconciliation against that newer baseline instead of standing alone.

## Objective

Produce a bounded stale-doc reconciliation lane that answers:

- which architecture docs are now stale
- which sections or statements are stale
- which newer doc or live-code surface supersedes them
- which docs should be updated first
- which mismatches are doc drift only versus signals of unresolved architecture ambiguity

The goal is to restore trust in the architecture docs as a current-state reference set before additional cleanup work builds on outdated prose.

## Boundary Rule for This Lane

This lane may:

- inspect current architecture docs against live code
- identify stale statements, stale ownership descriptions, stale route counts, stale file references, and superseded framing
- recommend bounded doc updates or supersession notes
- produce a reconciliation register and follow-on update seeds

This lane must not:

- edit production code
- reopen already-approved navigation boundary decisions
- remove docs without evidence
- turn reconciliation findings into implementation work
- treat older prose as authoritative when live code and newer approved lane docs disagree

Operational deferral rule:

- if a mismatch appears to reflect a real unresolved architecture issue rather than simple doc drift, record it as `defer` instead of trying to settle it inside this reconciliation lane

## Reconciliation Method

Use the smallest safe docs-only change set.

1. Inventory the 14 pre-existing architecture docs in `docs/architecture`.
2. Compare older or drifted architecture-doc statements against:
   - live code in the authoritative current-state surfaces
   - newer approved navigation lane docs
3. Reconcile at section level by default. A document may contain both stale and still-valid sections; only mark the whole document superseded if it is now entirely historical.
4. Record each stale item in a reconciliation register with:
   - source doc
   - stale section or statement summary
   - current truth source
   - issue type
   - disposition
   - follow-on doc update seed
5. Treat `App.js` as supporting context only unless its active role is explicitly re-verified during later implementation.

Issue-type vocabulary for this lane:

- `stale ownership description`
- `stale route-name description`
- `stale route-count description`
- `stale file/reference description`
- `superseded by newer doc`
- `unresolved ambiguity`

Disposition vocabulary for this lane:

- `update now`
- `keep with note`
- `superseded by newer doc`
- `defer`

## Reconciliation Register

| Source doc | Stale section or statement summary | Current truth source | Issue type | Disposition | Follow-on doc update seed |
| --- | --- | --- | --- | --- | --- |
| `docs/architecture/navigation-tree-and-route-ownership.md` | The navigator tree still shows the root stack owning large detail-route clusters and only the calendar tab as a nested domain stack. | `src/navigation/RootNavigation.js`; `src/navigation/BottomTabNavigation.js`; `src/navigation/JournalNavigation.js`; `src/navigation/NutritionNavigation.js`; `src/navigation/RecreationNavigation.js`; `src/navigation/SettingsNavigation.js` | `stale ownership description` | `update now` | targeted current-state route-tree refresh |
| `docs/architecture/navigation-tree-and-route-ownership.md` | The route ownership table still claims 42 touched routes with 32 root-stack routes, 6 bottom-tab routes, and 4 calendar nested-stack routes. | live mounted navigators; `docs/architecture/dead-route-and-duplicate-route-audit.md` | `stale route-count description` | `update now` | route-count and owner-table refresh |
| `docs/architecture/navigation-tree-and-route-ownership.md` | The ownership table still records root-owned `Dashboard`, `Nutrition`, journal detail routes, recreation detail routes, settings detail routes, and duplicate root registrations that no longer exist in live code. | `src/navigation/RootNavigation.js`; `src/navigation/BottomTabNavigation.js`; newer extraction docs | `stale ownership description` | `update now` | owner-table rewrite using live navigator owners only |
| `docs/architecture/app-structure-inventory.md` | The app-entrypoint section says `App.js` runs `hydrateWorkoutPlans()` and then renders `RootContainer` directly. | `App.js`; `src/bootstrap/AppBootstrap.js`; `src/root-container/RootContainer.js` | `stale file/reference description` | `update now` | bootstrap chain refresh centered on `AppBootstrap` |
| `docs/architecture/app-structure-inventory.md` | The initial-route section says `RootNavigation` reads `user_profile`, decides the initial route, and returns `null` until resolution. | `src/bootstrap/AppBootstrap.js`; `src/navigation/RootNavigation.js` | `stale ownership description` | `update now` | startup ownership refresh for initial-route resolution |
| `docs/architecture/app-structure-inventory.md` | The root-stack route surface still inventories many journal, nutrition, recreation, settings, and dashboard routes as root-owned. | `src/navigation/RootNavigation.js`; `docs/architecture/dead-route-and-duplicate-route-audit.md` | `stale ownership description` | `update now` | root-stack inventory rewrite |
| `docs/architecture/app-structure-inventory.md` | The bottom-tab structure still says `Journal`, `Nutrition`, `Recreation`, and `Settings` mount wrapper components directly instead of mounted nested navigators. | `src/navigation/BottomTabNavigation.js`; `src/navigation/JournalNavigation.js`; `src/navigation/NutritionNavigation.js`; `src/navigation/RecreationNavigation.js`; `src/navigation/SettingsNavigation.js` | `stale file/reference description` | `update now` | tab-surface component map refresh |
| `docs/architecture/root-stack-boundary-cleanup.md` | The current-state framing still says the live root stack owns both app-entry routes and many domain/detail routes directly. | `src/navigation/RootNavigation.js`; `docs/architecture/dead-route-and-duplicate-route-audit.md` | `superseded by newer doc` | `keep with note` | add historical-context note or current-state correction lane |
| `docs/architecture/bottom-tab-shell-cleanup.md` | The current-state section still says only `Calendar` mounts a nested stack and the other tab destinations mount wrapper components directly. | `src/navigation/BottomTabNavigation.js`; mounted nested navigator files | `stale file/reference description` | `keep with note` | current-state shell ownership note refresh |
| `docs/architecture/bottom-tab-shell-cleanup.md` | The current-state section still cites root-level overlap for `Dashboard` and `Nutrition` that no longer matches the current three-route root stack. | `src/navigation/RootNavigation.js`; `docs/architecture/dead-route-and-duplicate-route-audit.md` | `stale ownership description` | `keep with note` | stale overlap note refresh |
| `docs/architecture/risk-and-coupling-audit.md` | RC-01 still says `App.js` calls `hydrateWorkoutPlans()` and that `RootNavigation` reads AsyncStorage to choose `Home` versus `CompleteProfile`. | `src/bootstrap/AppBootstrap.js`; `App.js`; `src/navigation/RootNavigation.js` | `stale file/reference description` | `update now` | boot-path evidence refresh |
| `docs/architecture/risk-and-coupling-audit.md` | RC-02 still says `RootNavigation` combines onboarding, tab shell, journal detail screens, nutrition routes, recreation routes, settings routes, and standalone screens in one root stack. | `src/navigation/RootNavigation.js`; mounted nested navigator files; newer extraction docs | `stale ownership description` | `update now` | root-fan-in finding refresh |
| `docs/architecture/settings-account-stack-extraction.md` and newer navigation lane docs | The current root-owned `Tutorials` exception could look like doc drift if read without context, but live code still preserves it intentionally. | `src/navigation/RootNavigation.js`; `docs/architecture/settings-account-stack-extraction.md`; `docs/architecture/navigation-smoke-tests.md` | `unresolved ambiguity` | `defer` | root-versus-settings ownership clarification lane, if later reopened |

## Update Priority

Update the architecture docs in this order:

1. `docs/architecture/navigation-tree-and-route-ownership.md`
   - It is the most visibly stale current-state route map and still presents a pre-extraction ownership model.
2. `docs/architecture/app-structure-inventory.md`
   - It still assigns bootstrap, initial-route, root-stack, and tab-mounting ownership to older surfaces.
3. `docs/architecture/root-stack-boundary-cleanup.md` and `docs/architecture/bottom-tab-shell-cleanup.md`
   - Keep these lane docs, but refresh or annotate the current-state framing so they are not mistaken for present-tense ownership truth.
4. `docs/architecture/risk-and-coupling-audit.md`
   - Refresh only the stale boot-path and root-fan-in evidence bullets without widening the rest of the audit.
5. Broader supersession or index cleanup
   - Leave folder-level supersession notes, index cleanup, or decision-log work to a separate follow-on lane.

## Public Interfaces

This artifact changes no public APIs, route destinations, providers, dependencies, or runtime behavior.

Preserved invariants for this lane:

- `AppBootstrap` still resolves `ROOT_ROUTES.HOME` for saved local `user_profile` data and `ROOT_ROUTES.COMPLETE_PROFILE` otherwise
- `AppBootstrap` still calls `hydrateWorkoutPlans()` during bootstrap
- `AppBootstrap` still returns `null` until the initial route resolves
- `RootContainer` still passes `initialRouteName` into `RootNavigation`
- `RootNavigation` still owns `CompleteProfile`, `Home`, and `Tutorials`
- `BottomTabNavigation` still owns the same six top-level authenticated destinations
- current nested navigator ownership remains whatever live code currently says it is

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane even when supplied outside the current repo snapshot
- live code is authoritative for startup facts, navigator ownership, route registrations, and route names
- `src/bootstrap/AppBootstrap.js`, `src/root-container/RootContainer.js`, the mounted navigator files, and `src/navigation/routeNames.js` are the primary evidence surfaces for this reconciliation lane
- `App.js` is supporting context only unless its active role is explicitly re-verified during later implementation
- newer approved navigation lane docs may inform current-state reconciliation and cadence, but they do not override live code
- older architecture docs are the reconciliation target set, not competing truth sources

## Acceptance Criteria

- exactly one new docs artifact is added at `docs/architecture/stale-architecture-doc-reconciliation.md`
- the artifact follows the existing reviewable lane-doc style used by the current `1.1.2.2.x` docs
- the artifact inventories the full pre-existing `docs/architecture` reconciliation target set
- the artifact identifies stale sections or statements using evidence from live code and/or newer approved lane docs
- each register row includes:
  - source doc
  - stale section or statement summary
  - current truth source
  - issue type
  - disposition
  - follow-on doc update seed
- the artifact uses only the bounded issue-type vocabulary defined in this lane
- the artifact uses only the bounded disposition vocabulary defined in this lane
- the artifact clearly separates doc-drift findings from unresolved architecture ambiguity
- the artifact does not change production code, route ownership, startup behavior, or route names
- the artifact does not widen into architecture redesign or implementation work

## Validation

- static review that the reconciliation target list matches the 14 pre-existing architecture docs in `docs/architecture`, excluding this new reconciliation artifact
- static review that startup and shell statements match live code in `AppBootstrap`, `RootContainer`, `RootNavigation`, `BottomTabNavigation`, the mounted nested navigator files, and `routeNames.js`
- static review that `App.js` is treated as supporting context only unless its active role is explicitly re-verified
- static review that every stale claim is grounded in a live-code surface or a newer approved lane doc
- static review that every `superseded by newer doc` judgment names the current replacing source
- final diff review that the only repo change is `docs/architecture/stale-architecture-doc-reconciliation.md`

## Risks / Notes

- main risk is turning a doc-reconciliation lane into a code-cleanup lane
- another risk is letting older architecture prose compete with live code when they disagree
- another risk is overusing whole-document supersession when only one section has drifted
- another risk is reintroducing fresh doc drift by overstating `App.js` rather than treating `AppBootstrap`, `RootContainer`, the mounted navigators, and `routeNames.js` as the current authoritative evidence hierarchy
- explicit supersession or reconciliation notes are safer than silent drift because the folder currently mixes older inventories with newer cleanup docs

## Follow-on Lane Seeds

- targeted update lane for `docs/architecture/navigation-tree-and-route-ownership.md`
- targeted update lane for `docs/architecture/app-structure-inventory.md`
- targeted current-state note refresh for `docs/architecture/root-stack-boundary-cleanup.md`
- targeted current-state note refresh for `docs/architecture/bottom-tab-shell-cleanup.md`
- targeted evidence refresh for `docs/architecture/risk-and-coupling-audit.md`
- architecture-doc supersession and index cleanup
- architecture-doc decision log

## Assumptions

- the Brunch Body template and scope files are not locally visible in this repo snapshot, so the established `1.1.2.2.x` lane-doc cadence is the best local style reference
- live code is authoritative over older architecture prose for bootstrap facts, navigator ownership, route registrations, and route names
- section-level treatment is the default; whole-document supersession should be rare and evidence-backed
- the current root-owned `Tutorials` exception should be deferred rather than normalized away unless a later lane explicitly reopens that decision

## Constraints

- docs-only
- create exactly one new file: `docs/architecture/stale-architecture-doc-reconciliation.md`
- no production code changes
- no config changes
- no tests changed
- no dependency or package changes
- no route removals
- no route renames
- no behavior changes
- keep the lane present-state aware and reconciliation-bounded

## Acceptance

- exactly one new docs file is added at `docs/architecture/stale-architecture-doc-reconciliation.md`
- the artifact defines a bounded, Codex-ready stale architecture-doc reconciliation lane
- the artifact preserves the current bootstrap and shell semantics in its contract
- the artifact inventories the pre-existing architecture-doc target set
- the artifact provides a bounded reconciliation register with evidence-backed dispositions
- the artifact clearly distinguishes doc drift from unresolved architecture ambiguity
- the artifact does not implement cleanup or propose unrelated product changes

## Do not

- implement code cleanup
- remove or rename routes
- move routes across navigator layers
- redesign tabs or flows
- widen into ownership cleanup already covered by earlier lanes
- collapse older docs into blanket supersession without section-level evidence
- treat `App.js` as the controlling bootstrap source unless that role is explicitly re-verified
- mix this lane with privacy work, UX redesign, or broad repo cleanup

## Review standard

- keep scope narrow
- do not expand beyond stated files and surfaces
- do not introduce backend or cloud behavior unless explicitly requested
- do not change disclosures, privacy claims, or deletion semantics unless this lane explicitly includes them
- prefer minimal diffs
- if a finding is ambiguous, classify it and defer it rather than widening scope
- if the task becomes broader than stated, stop and leave a note rather than expanding the lane
