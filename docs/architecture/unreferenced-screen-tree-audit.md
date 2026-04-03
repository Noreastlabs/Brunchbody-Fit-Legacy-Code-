# Lane: 1.1.2.2.14 Unreferenced screen-tree audit

## Summary

This artifact audits the current top-level `src/screens/` tree for screen domains that still exist on disk but do not appear to be entered by the current inspected bootstrap, root, tab, or nested-stack wiring.

This lane is docs-only and evidence-first. It classifies current-use screen trees, residual unreferenced screen trees, and unresolved ambiguity without changing runtime behavior.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane even when supplied outside the repo snapshot or current chat file state. Live code is authoritative for startup facts, navigator ownership, route registrations, and current entry paths. Nearby approved architecture docs and the supplied lane brief may inform cadence and phrasing only.

Startup behavior, root-shell entry, current tab ownership, current nested-stack ownership, and current route names must be preserved exactly. This artifact classifies evidence only. It does not authorize removal, renaming, or navigator ownership moves.

## Classification

Ready for codex

## Scope

### In Scope

- create one docs-only audit artifact for unreferenced screen-tree review
- inspect the current top-level `src/screens/` tree against live bootstrap, root, tab, and nested-stack wiring
- identify which screen trees are entered by current wiring versus present-but-unreferenced
- classify each exception with one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate remove`
  - `defer`
- distinguish clearly between:
  - current-use screen trees
  - unreferenced by current inspected wiring
  - intentionally dormant or compatibility-hold trees if evidence supports them
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

Primary current-state evidence surfaces inspected for this artifact:

- `src/screens/`
- `src/screens/splashScreen/`
- `src/screens/welcome/`
- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`
- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/CalendarNavigation.js`
- `src/navigation/JournalNavigation.js`
- `src/navigation/NutritionNavigation.js`
- `src/navigation/RecreationNavigation.js`
- `src/navigation/SettingsNavigation.js`

Thin entrypoint context re-verified during implementation:

- `App.js`

Companion current-state and prior-audit context only:

- `docs/architecture/app-structure-inventory.md`
- `docs/architecture/unreferenced-navigation-surface-audit.md`
- `docs/architecture/legacy-residue-audit.md`
- nearby approved architecture docs in `docs/architecture/`

Representative repo-wide reference checks used as supporting evidence:

- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
- `src/screens/completeProfile/components/Welcome.js`
- `src/redux/actions/auth.js`

Live mounted code is authoritative for this lane. Older docs are companion evidence only.

## Current State

Active code shows the current startup and shell contract through these authoritative surfaces:

1. `AppBootstrap.js` reads `AsyncStorage.getItem('user_profile')`, resolves `Home` when that local profile exists and `CompleteProfile` otherwise, and then renders `RootContainer` with `initialRouteName`.
2. `RootContainer.js` passes `initialRouteName` into `RootNavigation`.
3. `RootNavigation.js` mounts a narrow root stack with only:
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
6. Current nested navigators mount these screen-tree entry surfaces:
   - `dashboard` via `DashboardWrapper` directly in `BottomTabNavigation`
   - `calendar` via `CalendarWrapper` in `CalendarNavigation`
   - `writing` via `WritingWrapper`, `EditWritingWrapper`, and `NewDayWrapper` in `CalendarNavigation`
   - `journal` via `JournalNavigation`
   - `nutrition` via `NutritionNavigation`
   - `recreation` via `RecreationNavigation`
   - `setting` via `SettingsNavigation`, with `Tutorials` still root-owned but implemented under the settings screen tree
   - `completeProfile` via `CompleteProfileWrapper` in `RootNavigation`

`App.js` was re-verified during implementation as a thin entrypoint that renders `AppBootstrap`, but the authoritative current-state surfaces for this audit remain `AppBootstrap.js`, `RootContainer.js`, and the mounted navigator files listed above.

Current code therefore supports eight clearly entered top-level screen trees and two present-but-unentered screen-tree candidates in `src/screens/`.

## Objective

Answer, from current code rather than older prose:

- which top-level `src/screens/` trees are currently entered by active inspected wiring
- which screen trees exist on disk but are not referenced by the inspected bootstrap, root, tab, or nested-stack wiring
- which unreferenced screen trees are strong cleanup candidates versus bounded deferrals
- whether any screen tree is confirmed as a compatibility hold by current evidence

## Boundary Rule for This Lane

This lane may:

- inspect current screen-tree folders and live mounting references
- compare folder presence against current bootstrap, root, tab, and nested-stack entry paths
- classify unreferenced screen trees with bounded dispositions
- recommend later cleanup lanes

This lane must not:

- delete files
- rename routes
- move ownership between navigators
- change startup behavior
- treat a present-but-unreferenced screen tree as dead runtime code without bounded evidence
- convert the audit into implementation work

Operational deferral rule:

- if a screen tree appears unreferenced by inspected wiring but may still be used indirectly, historically, or through unverified call paths, classify it as `defer` or `keep for compatibility` instead of forcing a removal conclusion in this lane

## Audit Method

- inventory the current top-level contents of `src/screens/`
- identify which screen trees are mounted directly by `RootNavigation`, `BottomTabNavigation`, or the nested stack files
- use repo-wide reference searches before calling a screen tree unreferenced by current wiring
- require each exception disposition to be justified from:
  - current file presence and wrapper/export surface
  - inspected bootstrap/root/tab/nested-stack wiring
  - repo-wide reference search evidence
- use `docs/architecture/app-structure-inventory.md` as companion reconciliation context only
- allow working hypotheses for seeded findings, but prove the final disposition from current evidence rather than treating it as pre-approved
- default ambiguous unmounted screen trees to `defer`
- do not modify code, routes, docs outside this artifact, or runtime behavior

## Screen-Tree Inventory

| screen tree | current role | reference status | notes |
| --- | --- | --- | --- |
| `calendar` | calendar tab domain tree | current-use | `CalendarNavigation.js` imports `CalendarWrapper` from `../screens/calendar` and mounts it as `CalendarMain`. |
| `completeProfile` | onboarding root-entry tree | current-use | `RootNavigation.js` mounts `CompleteProfileWrapper` from `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`. |
| `dashboard` | authenticated dashboard tree | current-use | `BottomTabNavigation.js` imports `DashboardWrapper` from `../screens/dashboard` and mounts it for the `Dashboard` tab. |
| `journal` | journal nested-stack tree | current-use | `JournalNavigation.js` imports the journal wrappers from `../screens/journal` and mounts the journal route set. |
| `nutrition` | nutrition nested-stack tree | current-use | `NutritionNavigation.js` imports the nutrition wrappers from `../screens/nutrition` and mounts the nutrition route set. |
| `recreation` | recreation nested-stack tree | current-use | `RecreationNavigation.js` imports the recreation wrappers from `../screens/recreation` and mounts the recreation route set. |
| `setting` | settings and root-owned tutorials tree | current-use | `SettingsNavigation.js` imports wrappers from `../screens/setting`, and `RootNavigation.js` separately mounts `TutorialsWrapper` from `src/screens/setting/pages/Tutorials`. |
| `splashScreen` | residual startup-oriented screen tree | unreferenced by current inspected wiring | Tree exists with `pages/` and `components/`, but no live bootstrap/root/tab/nested-stack mount was found. |
| `welcome` | residual welcome screen tree | unreferenced by current inspected wiring | Tree exists with `pages/` and `components/`, but no live bootstrap/root/tab/nested-stack mount was found. |
| `writing` | calendar-owned detail tree | current-use | `CalendarNavigation.js` imports `WritingWrapper`, `EditWritingWrapper`, and `NewDayWrapper` from `../screens/writing`. |

All inventoried screen trees not listed in the findings register below remain current `keep`.

## Findings Register

This register is exception-based. Any top-level screen tree not listed below remains a current `keep`.

| screen tree | current evidence | reference status | issue type | disposition | follow-on lane |
| --- | --- | --- | --- | --- | --- |
| `src/screens/splashScreen/` | File presence: `src/screens/splashScreen/index.js` re-exports `pages/splashScreen`, and `src/screens/splashScreen/pages/splashScreen/SplashScreen.js` exports `SplashScreenWrapper`. Wiring evidence: current startup behavior is handled by `AppBootstrap.js`, `RootContainer.js`, and `RootNavigation.js`, and no live root/tab/nested-stack file mounts the splash-screen tree. Repo-wide reference evidence: current search found no live `src` imports of `SplashScreenWrapper`, `src/screens/splashScreen`, or `pages/splashScreen`. The tree still contains legacy startup redirect logic built around `loggedIn()` and `ROOT_ROUTES`, which overlaps historical startup responsibilities even though that tree is not currently entered. | unreferenced by current inspected wiring | historical startup residue | `defer` | startup-residue decision lane |
| `src/screens/welcome/` | File presence: `src/screens/welcome/index.js` re-exports `pages/welcome`, and `src/screens/welcome/pages/welcome/Welcome.js` exports `WelcomeWrapper`. Wiring evidence: no live root/tab/nested-stack file mounts the welcome tree. Repo-wide reference evidence: current search found no live `src` imports of `WelcomeWrapper`, `src/screens/welcome`, or `pages/welcome`. Current active onboarding already includes an internal `Welcome` step inside `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`, and `src/screens/completeProfile/components/Welcome.js` supplies the active welcome UI and navigation into `Tutorials` and `Home`. | unreferenced by current inspected wiring | superseded dormant screen tree | `candidate remove` | targeted approved screen-tree removal lane |

Current evidence for this lane did not confirm any top-level screen tree as `keep for compatibility`. If later work finds an indirect runtime dependency or documented compatibility contract, that later lane can revise the disposition for the affected tree.

## Public Interfaces

This artifact changes no public APIs, route destinations, providers, dependencies, or runtime behavior.

Preserved invariants for this lane:

- the current bootstrap decision contract remains unchanged
- the current root stack remains `CompleteProfile`, `Home`, and `Tutorials`
- `Home` remains the authenticated shell entry
- `BottomTabNavigation` remains the owner of the six current top-level authenticated destinations
- current nested-stack ownership remains unchanged
- current route names remain unchanged

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane even when supplied outside the repo snapshot or current chat file state
- live code is authoritative for startup facts, navigator ownership, route registrations, current entry paths, and current screen-tree reference status
- `docs/architecture/app-structure-inventory.md` is primary companion context because it already records `src/screens/splashScreen/` and `src/screens/welcome/` as present but not referenced by the inspected root or tab wiring
- `docs/architecture/unreferenced-navigation-surface-audit.md` is companion context for audit cadence and exception-register shape only
- earlier approved architecture lanes may inform phrasing and follow-on lane naming only; they do not reopen implementation scope here

## Acceptance Criteria

- exactly one new docs artifact is added at `docs/architecture/unreferenced-screen-tree-audit.md`
- the artifact follows the established Brunch Body architecture-lane doc cadence used in this repo
- the artifact inventories the current top-level `src/screens/` surfaces relevant to the audit
- the artifact identifies which screen trees are currently referenced by active wiring
- the artifact identifies which screen trees appear unreferenced by active wiring using live evidence
- each finding includes a bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate remove`
  - `defer`
- the artifact does not remove files, rename routes, or move navigator ownership
- the artifact clearly separates current evidence from follow-on cleanup work

## Validation

- static review that the top-level `src/screens/` inventory matches the current folder contents
- static review that current-use claims are supported by `RootNavigation.js`, `BottomTabNavigation.js`, and the mounted nested navigator files
- static review that any `unreferenced by current inspected wiring` claim is grounded in both inspected wiring and repo-wide search evidence
- static review that the seeded `splashScreen` and `welcome` findings are supported by file presence and current non-reference in the inspected wiring
- static review that `welcome` is only treated as a removal candidate because current active onboarding already contains its own internal welcome step
- static review that `splashScreen` remains bounded as startup residue rather than overstated dead code
- final diff review that the only repo change is `docs/architecture/unreferenced-screen-tree-audit.md`

## Risks / Notes

- the main risk is overstating `unreferenced by current inspected wiring` into `dead code`
- another risk is collapsing dormant, superseded, historical, and genuinely removable screen trees into one bucket
- another risk is reopening startup-flow or navigator-ownership cleanup instead of documenting evidence
- `splashScreen` is intentionally held at `defer` because it still contains historical startup-routing logic even though the active bootstrap path no longer mounts it
- `welcome` is a stronger removal candidate because the active complete-profile flow already owns the current welcome experience

## Follow-on Lane Seeds

- targeted approved screen-tree removal lane for explicitly approved candidates such as `src/screens/welcome/`
- startup-residue decision lane for `src/screens/splashScreen/`
- dormant screen compatibility-hold register if later evidence identifies intentionally preserved unmounted trees
- stale architecture-doc reconciliation update for newly confirmed screen-tree findings
- screen-tree decision log for approved keep-versus-remove outcomes

## Assumptions

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` are the governing inputs for this lane; the supplied brief is a working restatement, not a replacement source of truth
- `AppBootstrap.js`, `RootContainer.js`, and the mounted navigator files are the authoritative current-state surfaces for this audit; `App.js` is thin entrypoint context only
- live code is authoritative over older prose for startup facts, navigator ownership, route registrations, and current screen-tree usage
- the seeded `splashScreen` and `welcome` findings began as working hypotheses and were only classified here after current file-presence, wiring, and repo-wide reference evidence was gathered

## Constraints

- docs-only
- create exactly one new file: `docs/architecture/unreferenced-screen-tree-audit.md`
- no production code changes
- no config changes
- no tests changed
- no dependency or package changes
- no file removals
- no route renames
- no behavior changes
- keep the lane present-state aware and cleanup-bounded

## Acceptance

- exactly one new docs file is added at `docs/architecture/unreferenced-screen-tree-audit.md`
- the artifact defines a bounded, Codex-ready unreferenced screen-tree audit lane
- the artifact preserves current bootstrap and shell semantics in its contract
- the artifact clearly distinguishes in-scope audit work from out-of-scope removal, rename, and ownership changes
- the artifact provides binary, reviewable acceptance criteria
- the artifact does not implement cleanup or propose unrelated product changes
