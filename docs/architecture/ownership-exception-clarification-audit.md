# Lane: 1.1.2.2.23 Ownership-exception clarification audit

## Summary

This artifact re-checks the completed ownership-exception finding against current mounted code and current entry paths.

This lane is docs-only and clarification-first. It does not reopen the full navigation audit family. It narrows one known decision surface: whether `Tutorials` still remains the only confirmed live cross-navigator ownership exception, whether that exception is still justified by present entry-path behavior, and whether the current evidence still supports `keep for compatibility` rather than a stronger implementation conclusion.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane. The completed `cross-navigator-ownership-exception-audit.md` is the starting decision baseline. Live mounted code is authoritative for startup facts, navigator ownership, route registrations, and current entry paths. Nearby approved lane docs may inform cadence and phrasing only.

Current startup behavior, authenticated-shell entry, current root/tab/stack ownership, current route names, and the current root-owned `Tutorials` behavior must be preserved exactly. This artifact clarifies a decision only. It does not authorize implementation cleanup, ownership moves, route renames, startup changes, or entry-path redesign.

## Classification

Ready for codex

## Scope

### In Scope

- create exactly one docs-only clarification artifact at `docs/architecture/ownership-exception-clarification-audit.md`
- re-read the completed ownership-exception audit as the baseline source
- re-check the current mounted navigation structure for cross-navigator ownership exceptions
- confirm whether `Tutorials` remains the only clearly proven live exception
- verify whether current evidence still supports one bounded decision value:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- clarify whether any confirmed exception is best understood as:
  - `intentional cross-entry exception`
  - `compatibility hold`
  - `historical residue`
  - `unresolved ambiguity`
- seed follow-on cleanup lanes only where current evidence is already strong enough

### Out of Scope

- no production code changes
- no route renames
- no navigator ownership moves
- no startup-rule changes
- no tab redesign
- no screen-internal behavior changes
- no dependency or tooling changes
- no unrelated UX cleanup
- no broad re-audit of the full navigation branch

## Files / Surfaces

Primary evidence surfaces inspected for this artifact:

- `docs/architecture/cross-navigator-ownership-exception-audit.md`
- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/SettingsNavigation.js`
- `src/navigation/routeNames.js`
- `src/screens/setting/pages/Setting/Setting.js`
- `src/screens/completeProfile/components/Welcome.js`
- `src/screens/setting/pages/Tutorials/Tutorials.js`

Context-only companion docs:

- `docs/architecture/stack-entry-path-audit.md`
- `docs/architecture/navigation-call-site-drift-audit.md`
- `docs/architecture/navigation-cleanup-decision-log.md`

The completed ownership-exception audit is the baseline decision source for this lane. Live mounted code is authoritative for confirmation context. Companion docs are context only and do not reopen the broader audit family.

## Current State

The prior ownership-exception audit and the current decision log already treat `Tutorials` as the strongest confirmed cross-navigator ownership exception. Current mounted code still supports that same conclusion.

Active code currently shows:

1. `src/navigation/RootNavigation.js` still registers exactly three root routes: `CompleteProfile`, `Home`, and `Tutorials`.
2. `src/navigation/RootNavigation.js` still imports `TutorialsWrapper` from `../screens/setting/pages/Tutorials`, so the live root-owned tutorial surface still lives inside the settings screen tree.
3. `src/navigation/SettingsNavigation.js` still owns the ordinary settings/account/legal/export route cluster and still does not register `Tutorials`.
4. `src/screens/setting/pages/Setting/Setting.js` still exposes a visible `Tutorial` entry that targets `ROOT_ROUTES.TUTORIALS`.
5. `src/screens/completeProfile/components/Welcome.js` still routes onboarding into `ROOT_ROUTES.TUTORIALS`.
6. `src/screens/setting/pages/Tutorials/Tutorials.js` still exits through `navigation.navigate(ROOT_ROUTES.HOME, { screen: AUTH_TAB_ROUTES.DASHBOARD })`, preserving the current root-to-shell compatibility path.
7. `src/navigation/BottomTabNavigation.js` still registers `Dashboard` inside the authenticated shell, so the tutorial exit continues to depend on the current root-owned `Home` plus nested tab-target contract.

Current live evidence therefore still shows one clearly proven ownership exception, `Tutorials`, and does not show a second materially similar exception with equally strong proof.

Current live evidence also remains conservative rather than consolidation-ready. It confirms that `Tutorials` is still live, still intentionally entered from both settings and onboarding, and still kept separate from `SettingsNavigation`, but it does not reduce the compatibility context enough to promote ownership consolidation as the default next step.

## Objective

Produce a bounded clarification artifact that answers:

- whether `Tutorials` is still the only confirmed cross-navigator ownership exception
- whether current evidence still supports `keep for compatibility`
- whether any newly re-checked evidence strengthens or weakens that conclusion
- whether the item should remain deferred from implementation escalation or graduate into a later implementation candidate

The goal is to avoid relitigating this ownership exception in future lanes.

## Boundary Rule for This Lane

This lane may:

- re-check the existing ownership-exception finding against current mounted code and current entry paths
- confirm or narrow the current conclusion
- record whether the exception remains compatibility-preserving or becomes a later cleanup candidate
- recommend one follow-on implementation or clarification lane if current evidence clearly justifies it

This lane must not:

- move ownership between navigators
- rename routes
- change startup behavior
- redesign entry paths
- convert clarification into implementation

Operational deferral rule:

- if current evidence is still mixed, still compatibility-shaped, or still depends on broader UX or ownership decisions, keep the item at `defer` or `keep for compatibility` rather than forcing a stronger implementation conclusion

## Audit Method

1. Re-read the completed ownership-exception audit as the baseline source.
2. Re-check the current mounted navigation owners in live code.
3. Re-check the current entry-path evidence for `Tutorials`.
4. Confirm whether any second live ownership exception now meets the same evidence bar.
5. Record only clarified decisions, not fresh broad audit findings.

### Exception-status taxonomy

- `intentional cross-entry exception`
- `compatibility hold`
- `historical residue`
- `unresolved ambiguity`

### Decision taxonomy

- `keep`
- `keep for compatibility`
- `candidate cleanup`
- `defer`

## Findings Register

Only include a row in this register when current live evidence shows all of the following:

- a registered owner in mounted navigator wiring
- current entry-path evidence into the route or surface
- module or tree locality that points toward a different conceptual home

Do not add a second row unless the evidence is equally strong and materially similar to the seeded `Tutorials` case.

| route / surface | registered owner | module / tree locality | current evidence | exception status | current decision | follow-on lane |
| --- | --- | --- | --- | --- | --- | --- |
| `Tutorials` | `RootNavigation` | settings screen tree | `src/navigation/RootNavigation.js` still registers `Tutorials` and imports `TutorialsWrapper` from `../screens/setting/pages/Tutorials`. `src/navigation/SettingsNavigation.js` still does not register `Tutorials`. `src/screens/setting/pages/Setting/Setting.js` still exposes `Tutorial` through `ROOT_ROUTES.TUTORIALS`. `src/screens/completeProfile/components/Welcome.js` still routes onboarding into `ROOT_ROUTES.TUTORIALS`. `src/screens/setting/pages/Tutorials/Tutorials.js` still exits through `ROOT_ROUTES.HOME` with nested `AUTH_TAB_ROUTES.DASHBOARD`. | `intentional cross-entry exception` | `keep for compatibility` | `ownership exception clarification lane` |

This clarification pass did not confirm any second materially similar live ownership exception with equally strong proof.

Current evidence strengthens confidence that the existing finding is still accurate, but it does not strengthen far enough to promote `Tutorials` into a current `candidate cleanup` row. The present decision surface remains conservative: `Tutorials` is still the only confirmed exception, current evidence still supports `keep for compatibility`, and any stronger ownership-consolidation conclusion should remain deferred to a later approved lane rather than implied here.

## Related Context / Non-Findings

- `Dashboard` versus visible `Home` remains a label-versus-route-name issue, not an ownership exception.
- `CalendarMain`, `Edit Writing`, `NewDay`, `MealsList`, and `Abbrevations` remain route-name compatibility issues, not ownership exceptions.
- ordinary `SettingsNavigation` ownership remains ordinary stack ownership and stays out of this register.
- root resets into `CompleteProfile` from settings or account flows are cross-stack transitions, not ownership exceptions.
- no second row was admitted because no other inspected surface matched `Tutorials` on registered-owner drift, multi-entry-path evidence, and settings-tree locality at the same time.

## Public Interfaces

None.

This artifact changes no public APIs, route destinations, labels, providers, dependencies, or runtime behavior.

Preserved invariants for this lane:

- bootstrap still resolves `Home` versus `CompleteProfile`
- `Home` remains the authenticated shell entry
- `Tutorials` remains root-owned in this lane unless a later implementation lane explicitly changes it
- current root, tab, and nested-stack ownership remains unchanged

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane
- the completed ownership-exception audit is the primary decision baseline
- live mounted code is authoritative for confirmation context
- nearby approved lane docs may inform cadence and phrasing only; they do not replace the governing inputs

## Acceptance Criteria

- exactly one new docs artifact is added at `docs/architecture/ownership-exception-clarification-audit.md`
- the artifact is in Brunch Body Project Template style
- the artifact re-checks the existing ownership-exception finding conservatively
- the artifact includes only source-backed clarified decisions
- the artifact keeps `Tutorials` as the seeded finding unless equally strong evidence supports another row
- the artifact does not rename routes, move ownership, or change startup behavior
- the artifact clearly separates clarification from implementation

## Validation

- static review that the startup and ownership baseline still matches mounted live code in `src/navigation/RootNavigation.js`, `src/navigation/BottomTabNavigation.js`, and `src/navigation/SettingsNavigation.js`
- static review that `Tutorials` remains registered at root and still functions as settings-module-adjacent through current entry-path evidence in `src/screens/setting/pages/Setting/Setting.js` and `src/screens/completeProfile/components/Welcome.js`
- static review that the current tutorial flow still exits through `ROOT_ROUTES.HOME` with nested `AUTH_TAB_ROUTES.DASHBOARD` in `src/screens/setting/pages/Tutorials/Tutorials.js`
- static review that no additional row was admitted without equally strong proof
- final diff review that the only repo change is `docs/architecture/ownership-exception-clarification-audit.md`

## Risks / Notes

- the main risk is overstating the clarification and turning it into a stealth implementation recommendation
- another risk is admitting weaker second-row exceptions that do not meet the same evidence bar as `Tutorials`
- another risk is re-running the whole navigation audit family instead of clarifying one known decision surface
- current evidence is stronger on continued live usage than on safe ownership consolidation, so this lane should preserve the compatibility hold rather than imply an implementation move

## Follow-on Lane Seeds

- targeted ownership consolidation lane
- focused compatibility-path test lane
- cleanup decision log update
- stale architecture-doc reconciliation update

## Assumptions

- this artifact should follow the same reviewable cadence as the approved `1.1.2.2.x` lane docs while still treating `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` as the governing inputs
- the completed ownership-exception audit is authoritative for the initial finding
- live mounted code is authoritative for confirmation context
- this lane is clarification-only, not migration or redesign
- current evidence is still conservative rather than consolidation-ready, so `Tutorials` remains a compatibility hold in this lane
