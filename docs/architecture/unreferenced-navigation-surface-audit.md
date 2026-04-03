# Lane: 1.1.2.2.13 Unreferenced navigation-surface audit

## Summary

This artifact audits the current `src/navigation/` folder for navigation surfaces that still exist on disk but do not appear to be referenced by the current inspected root, tab, or nested-stack wiring.

This lane is docs-only and evidence-first. It classifies current-use navigation surfaces, residual unreferenced surfaces, and unresolved folder residue without changing runtime behavior.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` are not present in the current repo snapshot. For this lane, the governing input is the approved scope supplied in chat. Live code is authoritative for current-state navigator ownership and reference status. Nearby approved lane docs may inform cadence and phrasing only.

Startup behavior, root-shell entry, current tab ownership, current nested-stack ownership, and current route names must be preserved exactly. This artifact classifies evidence only. It does not authorize removal, renaming, or navigator ownership moves.

## Classification

Ready for codex

## Scope

### In Scope

- create one docs-only audit artifact for unreferenced navigation-surface review
- inspect the current `src/navigation/` folder against live root, tab, and nested-stack wiring
- identify navigation surfaces that are mounted by current wiring versus present-but-unreferenced
- classify each exception with one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate remove`
  - `defer`
- distinguish clearly between:
  - current-use navigation surfaces
  - unreferenced by current wiring
  - intentionally dormant or compatibility-hold surfaces if evidence supports them
  - unresolved ambiguity
- seed follow-on cleanup lanes without implementing them

### Out of Scope

- no production code changes
- no file removals
- no route renames
- no navigator ownership moves
- no startup-rule changes
- no tab redesign
- no screen-internal behavior changes
- no dependency or tooling changes
- no unrelated UX cleanup

## Files / Surfaces

Primary evidence surfaces inspected for this artifact:

- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/CalendarNavigation.js`
- `src/navigation/JournalNavigation.js`
- `src/navigation/NutritionNavigation.js`
- `src/navigation/RecreationNavigation.js`
- `src/navigation/SettingsNavigation.js`
- `src/navigation/DashboardNavigation.js`
- `src/navigation/getRootNavigation.js`
- `src/navigation/routeNames.js`
- `src/navigation/style.js`

Companion current-state and prior-audit context only:

- `docs/architecture/app-structure-inventory.md`
- `docs/architecture/dead-route-and-duplicate-route-audit.md`
- `docs/architecture/legacy-residue-audit.md`
- `docs/architecture/route-naming-and-constants-cleanup.md`
- nearby approved architecture docs in `docs/architecture/`

Representative repo-wide reference checks used as supporting evidence:

- `src/root-container/RootContainer.js`
- `src/screens/setting/pages/Setting/Setting.js`
- `src/screens/setting/pages/MyProfile/DeleteAccount.js`

Live mounted code is authoritative for this lane. Older docs are companion evidence only.

## Current State

Active code shows the current startup and shell path as:

1. `AppBootstrap` resolves the initial route and passes it into `RootContainer`.
2. `RootContainer` passes `initialRouteName` into `RootNavigation`.
3. `RootNavigation` mounts a narrow root stack with only:
   - `CompleteProfile`
   - `Home`
   - `Tutorials`
4. `Home` mounts `BottomTabNavigation`.
5. `BottomTabNavigation` mounts six authenticated destinations:
   - `Dashboard`
   - `Journal`
   - `Calendar`
   - `Nutrition`
   - `Recreation`
   - `Settings`

Current tab-shell evidence also shows:

- the `Dashboard` tab mounts `DashboardWrapper` directly rather than a dashboard-specific navigator
- the `Journal`, `Calendar`, `Nutrition`, `Recreation`, and `Settings` tabs each mount their own nested navigator files
- `BottomTabNavigation` contains no `DashboardNavigation` reference
- `RootNavigation` contains no `DashboardNavigation` reference

Repo-wide reference checks for this lane also show:

- `getRootNavigation.js` is actively imported by `src/screens/setting/pages/Setting/Setting.js` and `src/screens/setting/pages/MyProfile/DeleteAccount.js`
- no live `src` references were found to `DashboardNavigation` or its `DashboardTabs` route
- no live `src` imports were found for `src/navigation/style.js`

Current code therefore supports one clear unmounted navigator surface in `src/navigation/` and one unresolved non-navigator residue surface in the same folder.

## Objective

Answer, from current code rather than older prose:

- which `src/navigation/` surfaces are currently referenced by active wiring
- which surfaces exist on disk but are not referenced by the inspected root, tab, or nested-stack wiring
- which unreferenced surfaces are strong cleanup candidates versus bounded deferrals
- whether any file-level compatibility-hold surface is confirmed by current evidence

## Boundary Rule for This Lane

This lane may:

- inspect current navigation files and live mounting references
- compare folder presence against current root, tab, and nested-stack ownership
- classify unreferenced folder surfaces with bounded dispositions
- recommend later cleanup lanes

This lane must not:

- delete files
- rename routes
- move ownership between navigators
- change startup behavior
- treat folder residue as dead runtime code without bounded evidence
- convert the audit into implementation work

Operational deferral rule:

- if a folder surface appears unreferenced by inspected wiring but may still be used indirectly, historically, or through unverified call paths, classify it as `defer` or `keep for compatibility` instead of forcing a removal conclusion in this lane

## Audit Method

- inventory the current contents of `src/navigation/`
- identify which files are mounted directly by `RootNavigation`, `BottomTabNavigation`, or the nested stack files
- identify which support files are actively imported by current `src` code even when they are not navigator components
- run repo-wide reference searches before calling a surface unreferenced by current wiring
- use `docs/architecture/app-structure-inventory.md` and `docs/architecture/dead-route-and-duplicate-route-audit.md` as companion reconciliation context only
- default ambiguous non-mounted folder residue to `defer`
- do not modify code, routes, docs outside this artifact, or runtime behavior

## Navigation Folder Inventory

| surface | current role | reference status | notes |
| --- | --- | --- | --- |
| `RootNavigation.js` | root navigator | current-use | Mounted by `src/root-container/RootContainer.js`. |
| `BottomTabNavigation.js` | authenticated tab navigator | current-use | Mounted by `RootNavigation` under `Home`. |
| `CalendarNavigation.js` | nested feature navigator | current-use | Mounted by `BottomTabNavigation` for the `Calendar` tab. |
| `JournalNavigation.js` | nested feature navigator | current-use | Mounted by `BottomTabNavigation` for the `Journal` tab. |
| `NutritionNavigation.js` | nested feature navigator | current-use | Mounted by `BottomTabNavigation` for the `Nutrition` tab. |
| `RecreationNavigation.js` | nested feature navigator | current-use | Mounted by `BottomTabNavigation` for the `Recreation` tab. |
| `SettingsNavigation.js` | nested feature navigator | current-use | Mounted by `BottomTabNavigation` for the `Settings` tab. |
| `routeNames.js` | route constants support surface | current-use | Imported by active navigation code and screen call sites. |
| `getRootNavigation.js` | navigation helper support surface | current-use | Imported by current settings flows that need root-level navigation access. |
| `DashboardNavigation.js` | residual navigator surface | unreferenced by current wiring | Defines a separate dashboard stack that current root/tab wiring does not mount. |
| `style.js` | residual folder support surface | unresolved | Present in `src/navigation/`, but no live `src` import was found during this audit. |

All inventoried surfaces not listed in the findings register below remain current `keep`.

## Findings Register

This register is exception-based. Any inventoried surface not listed below remains a current `keep`.

| navigation surface | current evidence | reference status | issue type | disposition | follow-on lane |
| --- | --- | --- | --- | --- | --- |
| `DashboardNavigation.js` | `src/navigation/DashboardNavigation.js` defines a separate stack with a `DashboardTabs` screen. `RootNavigation.js` mounts `BottomTabNavigation` under `Home`, and `BottomTabNavigation.js` mounts `DashboardWrapper` directly for the `Dashboard` tab. Repo-wide search found no live `src` references to `DashboardNavigation` or `DashboardTabs`. | unreferenced by current wiring | residual unmounted navigator surface | `candidate remove` | targeted navigation-surface removal lane |
| `style.js` | `src/navigation/style.js` exists in the navigation folder, but current audit searches found no live `src` imports of that file. It is also not itself a navigator surface. | unresolved | non-navigator folder residue | `defer` | residual navigation-folder cleanup decision lane |

Current evidence for this lane did not confirm any file-level `keep for compatibility` navigation surface inside `src/navigation/`. If later work finds an indirect runtime dependency or documented compatibility contract, that later lane can revise the disposition for the affected file.

## Public Interfaces

This artifact changes no public APIs, route destinations, providers, dependencies, or runtime behavior.

Preserved invariants for this lane:

- the current bootstrap chain remains unchanged
- the current root stack remains `CompleteProfile`, `Home`, and `Tutorials`
- `Home` remains the authenticated shell entry
- `BottomTabNavigation` remains the owner of the six current top-level authenticated destinations
- current nested-stack ownership remains unchanged
- current route names remain unchanged

## Dependencies

- the approved chat-supplied lane scope remains authoritative because `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` are not available in the current repo snapshot
- live code is authoritative for mounted navigators, helper imports, route ownership, and current reference status
- `docs/architecture/app-structure-inventory.md` is primary companion context because it already records that `DashboardNavigation.js` exists but is not referenced by the inspected root or tab wiring
- `docs/architecture/dead-route-and-duplicate-route-audit.md` is companion context because it already classifies `DashboardNavigation.js` as a removal candidate, but live code remains authoritative for this lane
- earlier architecture lanes may inform phrasing and follow-on lane naming only; they do not reopen implementation scope here

## Acceptance Criteria

- exactly one new docs artifact is added at `docs/architecture/unreferenced-navigation-surface-audit.md`
- the artifact follows the established Brunch Body architecture-lane doc cadence used in this repo
- the artifact inventories the current `src/navigation/` folder surfaces relevant to the audit
- the artifact identifies which navigation surfaces are currently referenced by active wiring
- the artifact identifies which folder surfaces appear unreferenced by active wiring using live evidence
- each finding includes a bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate remove`
  - `defer`
- the artifact does not remove files, rename routes, or move navigator ownership
- the artifact clearly separates current evidence from follow-on cleanup work

## Validation

- static review that the `src/navigation/` inventory matches the current folder contents
- static review that mounted current-use claims are supported by `RootNavigation.js`, `BottomTabNavigation.js`, and current nested navigator mounts
- static review that any `unreferenced by current wiring` claim is grounded in both inspected wiring and repo-wide search evidence
- static review that the seeded `DashboardNavigation.js` finding is supported by file presence, current non-reference in the inspected wiring, and current companion architecture-doc context
- static review that `style.js` is treated as bounded ambiguity rather than overstated dead runtime code
- final diff review that the only repo change is `docs/architecture/unreferenced-navigation-surface-audit.md`

## Risks / Notes

- the main risk is overstating `unreferenced by current wiring` into `dead code`
- another risk is collapsing mounted current-use surfaces, helper support surfaces, residual navigators, and generic folder residue into one bucket
- another risk is reopening ownership cleanup already handled by earlier root, shell, and stack lanes
- `DashboardNavigation.js` is the clearest current candidate because current live wiring mounts `DashboardWrapper` directly instead
- `style.js` is intentionally not escalated beyond `defer` in this lane because it is folder residue, not a mounted navigation surface

## Follow-on Lane Seeds

- targeted navigation-surface removal lane for explicitly approved unmounted navigator files
- navigation-folder compatibility-hold register if later evidence identifies intentionally dormant files
- residual navigation-folder cleanup decision lane for non-navigator residue such as unused helpers or styles
- unreferenced screen-tree audit for screen folders that remain outside active wiring
- stale architecture-doc reconciliation update for newly confirmed navigation-surface findings

## Assumptions

- this artifact should follow the same reviewable cadence as the approved `1.1.2.2.1` through `1.1.2.2.12` lane docs while still treating the chat-supplied scope as the governing input
- live code is authoritative over older prose for startup facts, navigator ownership, and current navigation-surface usage
- non-navigator residue inside `src/navigation/` stays in inventory, but defaults to `defer` unless live code proves either active use or an intentional compatibility role
- the absence of current evidence for a file-level compatibility hold means this artifact should say so explicitly rather than invent one

## Constraints

- docs-only
- create exactly one new file: `docs/architecture/unreferenced-navigation-surface-audit.md`
- no production code changes
- no config changes
- no tests changed
- no dependency or package changes
- no file removals
- no route renames
- no behavior changes
- keep the lane present-state aware and cleanup-bounded

## Acceptance

- exactly one new docs file is added at `docs/architecture/unreferenced-navigation-surface-audit.md`
- the artifact defines a bounded, Codex-ready unreferenced navigation-surface audit lane
- the artifact preserves current bootstrap, shell, and nested-stack semantics in its contract
- the artifact clearly distinguishes current-use surfaces, unreferenced surfaces, and deferred ambiguity
- the artifact provides binary, reviewable acceptance criteria
- the artifact does not implement cleanup or propose unrelated product changes

## Do not

- implement file removal
- rename routes
- move routes across navigator layers
- redesign tabs or flows
- widen into ownership cleanup already covered by earlier lanes
- mix this lane with privacy work, UX redesign, or broad code cleanup

## Review standard

- keep scope narrow
- do not expand beyond stated files and surfaces
- do not introduce backend or cloud behavior unless explicitly requested
- do not change disclosures, privacy claims, or deletion semantics unless this lane explicitly includes them
- prefer minimal diffs
- add tests only for touched logic or required acceptance in later implementation lanes
- if the task is broader than stated, stop and leave a note rather than widening scope
