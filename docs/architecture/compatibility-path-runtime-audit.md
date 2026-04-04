# Lane: 1.1.2.2.24 Compatibility-path runtime audit

## Summary

This artifact audits the remaining runtime-sensitive compatibility paths that are still preserved in the live navigation contract.

This lane is docs-only and evidence-first. It narrows the open compatibility-path runtime-coverage question already identified in `navigator-test-coverage-gap-audit.md` without reopening the broader navigation branch, changing runtime behavior, or adding tests.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane. Prior completed audit artifacts are authoritative for the decisions they already established. Live mounted code is authoritative for current compatibility-path behavior. Current test files are authoritative only for the specific runtime assertions that can be re-verified directly from their current local contents during drafting.

## Classification

Ready for codex

## Scope

### In Scope

- create exactly one docs-only audit artifact at `docs/architecture/compatibility-path-runtime-audit.md`
- inspect the current compatibility-sensitive runtime paths around:
  - onboarding entry into `Tutorials`
  - settings entry into `Tutorials`
  - tutorial exit through `Home -> Dashboard`
  - complete-profile completion through `Home -> Dashboard`
  - tutorial back-out behavior when entered as a sub-flow
- classify each audited path with one bounded disposition:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- distinguish between:
  - `runtime-covered compatibility path`
  - `partially covered compatibility path`
  - `uncovered but low risk`
  - `uncovered and follow-on worthy`
- seed follow-on cleanup or test lanes without implementing them

### Out of Scope

- no production code changes
- no new tests
- no route renames
- no ownership moves
- no startup-rule changes
- no tab redesign
- no screen-internal behavior changes
- no dependency or tooling changes
- no unrelated UX cleanup

## Files / Surfaces

Primary evidence surfaces inspected for this artifact:

- `docs/architecture/navigator-test-coverage-gap-audit.md`
- `docs/architecture/stack-entry-path-audit.md`
- `docs/architecture/cross-navigator-ownership-exception-audit.md`
- `__tests__/navigationSmokeFlows.test.js`
- `__tests__/AppBootstrap.test.js`
- `src/bootstrap/AppBootstrap.js`
- `src/navigation/RootNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/routeNames.js`
- `src/screens/completeProfile/components/Welcome.js`
- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
- `src/screens/setting/pages/Setting/Setting.js`
- `src/screens/setting/pages/Tutorials/Tutorials.js`

Optional corroboration inspected during drafting only where it added value without becoming required proof:

- `src/screens/setting/components/Setting.js`

Context-only companion docs:

- `docs/architecture/navigation-call-site-drift-audit.md`
- `docs/architecture/ownership-exception-clarification-audit.md`
- `docs/architecture/navigation-cleanup-decision-log.md`

Live mounted code is authoritative for current compatibility-path behavior. Current test files are authoritative only for the specific runtime assertions they actually make and that can be directly re-verified from their current local contents.

## Current State

The live navigation contract still preserves a small set of compatibility-sensitive paths that cross ordinary stack boundaries. Current mounted code continues to show the following baseline:

1. `src/navigation/RootNavigation.js` still registers exactly three root routes: `CompleteProfile`, `Home`, and `Tutorials`.
2. `Home` remains the authenticated shell entry and still mounts `BottomTabNavigation`.
3. `src/navigation/BottomTabNavigation.js` still registers `Dashboard` in the authenticated shell and still preserves the current tab-shell contract.
4. `src/screens/completeProfile/components/Welcome.js` still routes onboarding tutorial entry into `ROOT_ROUTES.TUTORIALS` and still passes `ROOT_ROUTES.HOME` as the completion target from the welcome step.
5. `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js` still converts that completion target into `navigation.navigate(ROOT_ROUTES.HOME, { screen: AUTH_TAB_ROUTES.DASHBOARD })` rather than falling through to the tab-shell default.
6. `src/screens/setting/pages/Setting/Setting.js` still exposes a visible `Tutorial` entry targeting `ROOT_ROUTES.TUTORIALS`. The lower-level settings component was reviewed only as optional corroboration and is not required proof for this lane.
7. `src/screens/setting/pages/Tutorials/Tutorials.js` still sends final tutorial advance to `navigation.navigate(ROOT_ROUTES.HOME, { screen: AUTH_TAB_ROUTES.DASHBOARD })` and still uses `navigation.goBack()` when tutorial back is pressed on the first image.

Current test evidence remains narrower than the live compatibility surface:

- `__tests__/AppBootstrap.test.js` directly asserts bootstrap resolution between `Home` and `CompleteProfile`, but it does not directly assert any of the compatibility-sensitive runtime paths in this lane.
- `__tests__/navigationSmokeFlows.test.js` can only be credited where exact current local assertions were directly re-verified during drafting. Its file presence alone does not prove broader compatibility-path runtime coverage.

## Objective

Produce a bounded audit that answers:

- which compatibility-sensitive runtime paths are already asserted by current tests
- which are only partially covered
- which are still unasserted but low risk
- which remain follow-on worthy because they protect preserved compatibility behavior

The goal is to prevent future test lanes from over-claiming coverage or re-discovering the same unresolved compatibility-path gap.

## Boundary Rule for This Lane

This lane may:

- inspect current compatibility-path behavior in live mounted code
- inspect the current navigation-related test files for actual runtime assertions
- classify compatibility-path runtime coverage
- recommend one or more follow-on test lanes

This lane must not:

- add tests
- rewrite entry paths
- rename routes
- move ownership between navigators
- change startup behavior
- redesign flows
- convert the audit into implementation work

Operational deferral rule:

- if closing a compatibility-path gap would require new harness work, simulator or device infrastructure, or broader behavior normalization, classify it as `defer` rather than forcing implementation through this lane

## Audit Method

1. Reconstruct the live compatibility-path baseline from mounted code only.
2. Re-check the current test files for direct runtime assertions on those paths.
3. Compare each compatibility path against actual current assertions, not filename presence.
4. Record one row per meaningful compatibility-path finding.
5. Prefer under-claiming over over-claiming when current runtime evidence is partial.

### Coverage taxonomy

- `runtime-covered`
- `partially covered`
- `uncovered but low risk`
- `uncovered and follow-on worthy`

### Decision taxonomy

- `keep`
- `keep for compatibility`
- `candidate cleanup`
- `defer`

## Findings Register

Only include a row in this register when current live behavior plus current test evidence or current missing evidence is strong enough to support a bounded compatibility-path finding. Keep this register fixed at five rows for this lane.

| compatibility path | current live behavior | current test evidence | coverage status | current decision | follow-on lane |
| --- | --- | --- | --- | --- | --- |
| Onboarding entry -> Tutorials | `src/screens/completeProfile/components/Welcome.js` routes the onboarding tutorial entry into `ROOT_ROUTES.TUTORIALS`, preserving onboarding access to the root-owned tutorial flow. | No direct runtime assertion for onboarding entry into `ROOT_ROUTES.TUTORIALS` was re-verified from the current local named suites. `__tests__/navigationSmokeFlows.test.js` does not, by file presence alone, prove this entry path. | `uncovered and follow-on worthy` | `defer` | `focused compatibility-path test lane` |
| Settings entry -> Tutorials | `src/screens/setting/pages/Setting/Setting.js` defines a visible `Tutorial` entry targeting `ROOT_ROUTES.TUTORIALS`, preserving settings access to the root-owned tutorial flow. Optional corroboration in `src/screens/setting/components/Setting.js` was not required to establish this live path. | No direct runtime assertion for the settings `Tutorial` entry path was re-verified from the current local named suites. The current representative settings assertion in `__tests__/navigationSmokeFlows.test.js` covers `MyAccount` exposure, not the `Tutorial` path. | `uncovered and follow-on worthy` | `defer` | `focused compatibility-path test lane` |
| Tutorial exit -> Home -> Dashboard | `src/screens/setting/pages/Tutorials/Tutorials.js` sends the final tutorial advance to `navigation.navigate(ROOT_ROUTES.HOME, { screen: AUTH_TAB_ROUTES.DASHBOARD })`, preserving tutorial exit through the authenticated shell into `Dashboard`. | Current local `__tests__/navigationSmokeFlows.test.js` is credited only to the extent directly re-verified in this drafting pass: it asserts the page-level `TutorialsPage` behavior that final advance calls `navigate(ROOT_ROUTES.HOME, { screen: AUTH_TAB_ROUTES.DASHBOARD })`. This row under-claims the broader compatibility path and does not treat file presence alone as end-to-end proof. | `partially covered` | `keep for compatibility` | `focused compatibility-path test lane` |
| Tutorial back-out as sub-flow | `src/screens/setting/pages/Tutorials/Tutorials.js` uses `navigation.goBack()` when tutorial back is pressed on the first image, preserving back-out behavior when tutorials were entered as a sub-flow. | Current local `__tests__/navigationSmokeFlows.test.js` is credited only to the extent directly re-verified in this drafting pass: it asserts the page-level `TutorialsPage` behavior that first-image back calls `goBack()`. This row under-claims the broader sub-flow compatibility contract and does not treat file presence alone as end-to-end proof. | `partially covered` | `keep for compatibility` | `focused compatibility-path test lane` |
| Complete-profile completion -> Home -> Dashboard | `src/screens/completeProfile/components/Welcome.js` passes `ROOT_ROUTES.HOME` as the completion target, and `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js` translates that completion into `navigation.navigate(ROOT_ROUTES.HOME, { screen: AUTH_TAB_ROUTES.DASHBOARD })`. | No direct runtime assertion for complete-profile completion into `ROOT_ROUTES.HOME` with nested `AUTH_TAB_ROUTES.DASHBOARD` was re-verified from the current local named suites. `__tests__/AppBootstrap.test.js` proves only bootstrap route selection, not completion-path runtime behavior. | `uncovered and follow-on worthy` | `defer` | `focused compatibility-path test lane` |

Current audit did not confirm any additional compatibility-path finding with equally strong live behavior plus equally strong direct runtime-coverage evidence. No extra row was admitted.

## Related Context / Non-Findings

- `Dashboard` versus visible `Home` remains a label-versus-route-name issue, not a compatibility-path runtime finding by itself.
- `Tutorials` being root-owned remains an ownership-exception finding, not a runtime-gap finding by itself.
- the tab-shell default of `Calendar` remains an entry-path quirk, not a compatibility-path finding unless a preserved compatibility path depends on it.
- structural route-set coverage and stack registration coverage stay in the navigator test-coverage gap audit and should not be duplicated here.
- the mere presence of `__tests__/navigationSmokeFlows.test.js` does not imply comprehensive compatibility-path coverage. This audit credits that file only for the specific assertions that were directly re-verified from its current local contents during drafting.

## Public Interfaces

None.

This artifact changes no public APIs, route destinations, labels, providers, dependencies, or runtime behavior.

Preserved invariants for this lane:

- bootstrap still resolves `Home` versus `CompleteProfile`
- `Home` remains the authenticated shell entry
- `Tutorials` remains root-owned in current mounted code
- current root, tab, and nested-stack ownership remains unchanged in this lane

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane
- prior completed audit artifacts are authoritative for the decisions they already established
- live mounted code is authoritative for current compatibility-path behavior
- current test files are authoritative only for the specific runtime assertions they directly make and that can be directly re-verified from their current local contents
- nearby approved lane docs may inform cadence and phrasing only; they do not replace the governing inputs

## Acceptance Criteria

- exactly one new docs artifact is added at `docs/architecture/compatibility-path-runtime-audit.md`
- the artifact is in Brunch Body Project Template style
- the artifact inventories compatibility-path runtime coverage using live behavior plus directly re-verified current test evidence
- each finding includes one of the required four decision values:
  - `keep`
  - `keep for compatibility`
  - `candidate cleanup`
  - `defer`
- the artifact does not add tests, rename routes, move ownership, or change startup behavior
- the artifact clearly separates runtime-coverage clarification from later implementation work

## Validation

- static review that each compatibility-path statement is grounded in mounted live code
- static review that each coverage claim is backed by directly re-verified current test assertions or directly re-verified missing assertions
- static review that no coverage claim is made from filename presence alone
- static review that the two tutorial rows stay below `runtime-covered` even when locally re-verified
- static review that the artifact stays clarification-only and does not drift into test implementation
- final diff review that the only repo change is `docs/architecture/compatibility-path-runtime-audit.md`

## Risks / Notes

- the main risk is overstating runtime coverage because a flow test file exists
- another risk is mixing ownership or label questions into a runtime-coverage clarification lane
- another risk is turning this lane into a stealth test-implementation request
- another risk is treating page-level tutorial assertions as proof of the broader preserved compatibility contract
- this lane should remain conservative and under-claim when current runtime assertions are only representative

## Follow-on Lane Seeds

- focused compatibility-path test lane
- stack-by-stack runtime smoke validation lane
- cleanup decision log update
- stale architecture-doc reconciliation update

## Assumptions

- this artifact should follow the same reviewable cadence as the approved `1.1.2.2.x` lane docs while still treating `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` as the governing inputs
- prior completed audit artifacts are authoritative for the decisions they already established
- live mounted code is authoritative for current compatibility-path behavior
- current test files are authoritative only for the specific runtime assertions they directly make
- this lane is clarification-only, not test implementation or behavior normalization
- under-claiming remains the governing posture for this lane
