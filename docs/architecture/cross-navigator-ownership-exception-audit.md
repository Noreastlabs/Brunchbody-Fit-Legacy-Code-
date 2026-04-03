# Lane: 1.1.2.2.18 Cross-navigator ownership exception audit

## Summary

This artifact audits the current navigation tree for routes or screen surfaces that are module-adjacent to one domain but intentionally owned by a different navigator.

This lane is docs-only and evidence-first. It classifies current cross-navigator ownership exceptions without changing runtime behavior, renaming routes, moving ownership, or reopening earlier root/tab/stack boundary decisions.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane. Live code is authoritative for startup facts, navigator ownership, route registrations, and current entry paths. Nearby approved lane docs may inform cadence and phrasing only.

Startup behavior, authenticated-shell entry, current tab ownership, current settings-stack ownership, and the current root-owned `Tutorials` behavior must be preserved exactly. This artifact classifies evidence only. It does not authorize implementation cleanup.

## Classification

Ready for codex

## Scope

### In Scope

- create one docs-only audit artifact for cross-navigator ownership exceptions
- inspect current root, tab, and nested-stack ownership against module locality and entry-path behavior
- identify routes or surfaces that are:
  - owned by one navigator
  - but live under another domain's screen tree or conceptual feature area
- classify each finding with one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- distinguish clearly between:
  - intentional cross-entry exception
  - compatibility hold
  - historical residue
  - unresolved ambiguity
- seed later cleanup lanes without implementing them

### Out of Scope

- no production code changes
- no route removals
- no route renames
- no navigator ownership moves
- no startup-rule changes
- no tab redesign
- no screen-internal behavior changes
- no dependency or tooling changes
- no unrelated UX cleanup

## Files / Surfaces

Primary evidence surfaces inspected for this artifact:

- `src/bootstrap/AppBootstrap.js`
- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/SettingsNavigation.js`
- `src/navigation/routeNames.js`
- `src/screens/setting/pages/Setting/Setting.js`
- `src/screens/completeProfile/components/Welcome.js`
- `src/screens/setting/pages/Tutorials/Tutorials.js`
- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
- `src/screens/setting/index.js`

Companion architecture docs used as context only:

- `docs/architecture/Brunch Body Project Template.md`
- `docs/architecture/Brunch Body Project Scope.md`
- `docs/architecture/settings-account-stack-extraction.md`
- `docs/architecture/label-vs-route-name-audit.md`
- `docs/architecture/unreferenced-navigation-surface-audit.md`
- `docs/architecture/stale-architecture-doc-reconciliation.md`

Live code is authoritative for this lane. Older docs and nearby lane artifacts are framing/context only.

## Current State

Active code shows the current startup and ownership contract as:

1. `resolveInitialRouteName()` in `src/bootstrap/AppBootstrap.js` reads local `user_profile` and returns `Home` when that data exists and `CompleteProfile` otherwise.
2. `RootNavigation` currently registers exactly three root routes: `CompleteProfile`, `Home`, and `Tutorials`.
3. `Home` mounts `BottomTabNavigation` as the authenticated shell entry.
4. `BottomTabNavigation` registers the six top-level authenticated destinations: `Dashboard`, `Journal`, `Calendar`, `Nutrition`, `Recreation`, and `Settings`.
5. The `Settings` tab mounts `SettingsNavigation`.
6. `SettingsNavigation` currently owns the settings/account/legal/export route cluster:
   - `Settings`
   - `MyProfile`
   - `MyVitals`
   - `MyAccount`
   - `MyEmail`
   - `MyPassword`
   - `DeleteAccount`
   - `ExportToCSV`
   - `TermsOfUse`
   - `PrivacyPolicy`
   - `Abbrevations`

Current entry-path and module-locality evidence also shows:

- `RootNavigation` imports `TutorialsWrapper` from `../screens/setting/pages/Tutorials`, so the live root-owned tutorial surface currently lives inside the settings screen tree.
- `src/screens/setting/pages/Setting/Setting.js` still renders a visible `Tutorial` entry on the settings landing and routes it to `ROOT_ROUTES.TUTORIALS`.
- `src/screens/completeProfile/components/Welcome.js` also routes onboarding into `ROOT_ROUTES.TUTORIALS`.
- `src/screens/setting/pages/Tutorials/Tutorials.js` exits back through root `Home` into tab route `Dashboard`.

This is present-state evidence only. It supports one clear live cross-navigator ownership exception, `Tutorials`, without by itself authorizing an ownership move or flow redesign.

## Objective

Answer, from current code rather than older prose:

- which routes or surfaces are intentionally owned outside their nearest module/domain stack
- which exceptions are still justified by current entry-path behavior
- which exceptions should remain documented as compatibility holds
- which findings are later cleanup candidates
- which findings should be deferred because resolving them would reopen ownership or flow design

The goal is to reduce confusion before any later ownership-consolidation or cleanup lane is approved.

## Boundary Rule for This Lane

This lane may:

- inspect current route ownership versus module locality
- compare current entry-path behavior to navigator ownership
- classify cross-navigator ownership exceptions
- recommend follow-on cleanup lanes

This lane must not:

- move ownership between navigators
- rename routes
- change startup behavior
- redesign tab or stack entry paths
- convert the audit into implementation work

Operational deferral rule:

- if resolving an ownership exception would require a behavior change, cross-stack migration, or reopening an approved boundary decision, classify it as `defer` or `candidate cleanup` rather than forcing an implementation conclusion in this lane

## Audit Method

- inventory the current root, tab, and nested-stack owners from the mounted navigator files
- compare those owners against module locality and visible entry points in representative screens
- record only true ownership exceptions or ambiguity points in the findings register
- require every finding to be backed by:
  - current route registration evidence
  - current entry-path evidence
  - current file/module locality evidence
- keep obvious non-exception routes out of the findings register

### Exception taxonomy

- `intentional cross-entry exception`
- `compatibility hold`
- `historical residue`
- `unresolved ambiguity`

### Disposition taxonomy

- `keep`
- `keep for compatibility`
- `candidate cleanup`
- `defer`

## Findings Register

Include a route or surface in this register only when live evidence shows all three of the following:

- a registered owner in current navigator wiring
- a current entry path into that route or surface
- module/tree locality that points toward a different conceptual home

| route / surface | registered owner | module / tree locality | evidence | exception type | disposition | follow-on lane |
| --- | --- | --- | --- | --- | --- | --- |
| `Tutorials` | `RootNavigation` | settings screen tree | `src/navigation/RootNavigation.js` registers `Tutorials` and imports `TutorialsWrapper` from `../screens/setting/pages/Tutorials`. `src/navigation/SettingsNavigation.js` does not register `Tutorials`. `src/screens/setting/pages/Setting/Setting.js` launches `ROOT_ROUTES.TUTORIALS` from the settings landing. `src/screens/completeProfile/components/Welcome.js` also routes onboarding into `ROOT_ROUTES.TUTORIALS`. | `intentional cross-entry exception` | `keep for compatibility` | ownership exception clarification lane |

Current audit did not confirm any additional materially similar live ownership exceptions beyond `Tutorials`.

## Related Context / Non-Findings

- `Dashboard` versus visible `Home` is a label-vs-route-name issue, not a cross-navigator ownership exception.
- `Abbrevations`, `CalendarMain`, `Edit Writing`, `NewDay`, and `MealsList` are route-name compatibility concerns, not ownership exceptions.
- the settings stack itself is not an exception; it is mounted under the `Settings` tab and owns its registered routes as expected.
- settings/logout and delete-account resets into `CompleteProfile` are cross-stack transitions to a root onboarding route, not ownership exceptions, because `CompleteProfile` is not local to the settings module/tree.
- the current `TermsOfUse` and `PrivacyPolicy` external-link behavior on the settings landing is entry-path drift, not cross-navigator ownership drift.
- ordinary cross-stack navigation targets that do not show ownership drift should stay out of this findings register.

## Public Interfaces

This artifact changes no public APIs, route destinations, labels, providers, dependencies, or runtime behavior.

Preserved invariants for this lane:

- bootstrap still resolves `Home` versus `CompleteProfile`
- `Home` remains the authenticated shell entry
- `Settings` remains the tab route that mounts `SettingsNavigation`
- `Tutorials` remains root-owned in this lane
- no ownership or behavior changes are introduced

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane
- live code is authoritative for startup facts, navigator ownership, route registrations, and current entry paths
- nearby approved lane docs may inform cadence and phrasing only; they do not replace the governing inputs
- earlier boundary, extraction, and audit lanes remain context and should not be reopened as implementation scope

## Acceptance Criteria

- exactly one new docs artifact is added at `docs/architecture/cross-navigator-ownership-exception-audit.md`
- the artifact follows the established Brunch Body architecture-lane doc cadence used in this repo
- the artifact inventories cross-navigator ownership exceptions using live evidence
- each finding includes one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- the artifact clearly distinguishes ownership exceptions from label mismatches and route-name compatibility holds
- the artifact captures `Tutorials` accurately as the seeded finding
- the artifact does not rename routes, move ownership, or change startup behavior
- the artifact clearly separates audit findings from later implementation work

## Validation

- static review that startup and shell statements match live code in `src/bootstrap/AppBootstrap.js`, `src/navigation/RootNavigation.js`, `src/navigation/BottomTabNavigation.js`, and `src/navigation/SettingsNavigation.js`
- static review that the `Tutorials` finding is backed by:
  - route registration evidence in root
  - absence from the settings stack registration
  - settings-tree module locality
  - current entry-path evidence from settings and onboarding
- static review that no extra findings were added without equally strong live evidence
- static review that the artifact clearly separates ownership exceptions from label mismatches, compatibility-name holds, and ordinary cross-stack navigation targets
- final diff review that the only repo change is `docs/architecture/cross-navigator-ownership-exception-audit.md`
- manual/runtime validation may be listed only as future follow-on work if a later lane finds ownership ambiguity, not as completion criteria for this docs lane

## Risks / Notes

- the main risk is confusing module locality with navigator ownership and then "fixing" an intentional exception too early
- another risk is widening this audit into ownership refactor work
- another risk is mixing label mismatch or route-name compatibility issues into this lane's findings register
- current evidence supports at least one intentional exception, but this lane should stay conservative and only record additional ones when the proof is similarly strong

## Follow-on Lane Seeds

- ownership exception clarification lane
- targeted ownership consolidation lane for explicitly approved exceptions
- stale architecture-doc reconciliation update for confirmed ownership exceptions
- navigator-wide smoke validation for exception-owned entry paths
- cleanup decision log update

## Assumptions

- this artifact should follow the same reviewable cadence as the approved `1.1.2.2.x` lane docs while still treating `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` as the governing inputs
- live code is authoritative over older docs for startup facts, navigator ownership, route registrations, and current entry paths
- the current evidence supports one confirmed ownership exception, `Tutorials`, and does not support expanding the findings register further in this lane
- this lane is about audit and classification only, not ownership migration or navigation redesign
- any later resolution that would move ownership, redesign entry paths, or reopen approved boundaries must be documented only as `candidate cleanup` or `defer`, not implied as work for this lane
