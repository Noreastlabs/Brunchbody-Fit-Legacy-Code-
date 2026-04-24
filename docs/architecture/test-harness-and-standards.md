# Test Harness and Standards

Lane `1.1.7.3` is documentation/standards only. It approves no code, test, config, dependency, CI, privacy, disclosure, package, route, storage, reducer, selector, app UX, backend/cloud, native-build, or product behavior changes.

This artifact records the current Brunch Body test harness and validation expectations from repository evidence. It does not claim the app is fully tested, launch-ready, release-ready, privacy-certified, or medically/domain complete.

## Lane Boundary

This lane adds exactly one docs-only artifact: `docs/architecture/test-harness-and-standards.md`.

No production source, existing test, package script, package file, lockfile, Jest, Babel, Metro, ESLint, Prettier, CI workflow, privacy/disclosure copy, route behavior, storage behavior, reducer behavior, selector behavior, UI behavior, native behavior, backend/cloud behavior, or dependency change is approved or made by this lane.

Warnings, failures, missing validation coverage, and unclear harness behavior found during this lane are current-state evidence to record. They are not permission to repair, normalize, rewrite, or expand the harness.

## Current Harness Summary

Repository evidence shows a Yarn v1 React Native test harness centered on Jest:

- `package.json` declares `packageManager: yarn@1.22.22`, `private: true`, and `engines.node: >=18`.
- `package.json` defines `test` as `jest`.
- `package.json` defines `lint` as `eslint .`.
- `package.json` defines `check:local-only` as `node scripts/check-local-only-mode.js`.
- `package.json` defines `check:secrets` as `./scripts/check-secrets.sh`.
- `jest.config.js` uses the `react-native` preset, loads `jest.setup.js` through `setupFilesAfterEnv`, and configures `transformIgnorePatterns` for React Native and selected React Native ecosystem packages.
- `babel.config.js` uses `module:@react-native/babel-preset`; in test mode it omits the `react-native-worklets/plugin` that is used outside tests.
- `jest.setup.js` installs `react-native-gesture-handler/jestSetup` and shared mocks for navigation shells, AsyncStorage, responsive font helpers, icons, chart/calendar/swiper/wheel/scoped-storage/fs dependencies, and related React Native surface dependencies.
- `__tests__/` currently contains 41 Jest test files.

CI-adjacent repository evidence:

- `.github/workflows/local-only-guard.yml` runs `yarn run check:local-only` on pull requests and pushes to `main`.
- `.github/workflows/secret-scan.yml` runs `yarn run check:secrets --range=... --report=secret-scan-report.txt` on pull requests targeting `main` and pushes to `main`, with explicit override handling for PR secret-scan failures.
- Existing `docs/architecture/ci-health.md` records that CI does not currently run `yarn lint` or `yarn test`.

## Current Test Surface Inventory

The current Jest surface is broad but should be described conservatively. File names and `describe` labels show practical coverage categories, not complete behavioral certification.

Bootstrap and navigation smoke:

- `__tests__/App.test.js`
- `__tests__/AppBootstrap.test.js`
- `__tests__/navigationSmokeNavigators.test.js`
- `__tests__/navigationSmokeFlows.test.js`
- `__tests__/completeProfileFlowBoundary.test.js`
- `__tests__/completeProfileNicknameBoundary.test.js`
- `__tests__/accountFlows.test.js`

Storage boundary and hydration:

- `__tests__/asyncStorageJsonBoundary.test.js`
- `__tests__/authStorageBoundary.test.js`
- `__tests__/exerciseStorageBoundary.test.js`
- `__tests__/recreationStorageBoundary.test.js`
- `__tests__/nutritionStorageBoundary.test.js`
- `__tests__/calendarThemeStorageBoundary.test.js`
- `__tests__/todoStorageBoundary.test.js`
- `__tests__/journalTraitsStorageBoundary.test.js`
- `__tests__/mmkvHydration.test.js`

Repair, integrity, and migration-adjacent boundaries:

- `__tests__/authProfileRepair.test.js`
- `__tests__/exerciseMergeDirectoryBoundary.test.js`
- `__tests__/localDataValidation.test.js`
- `__tests__/calendarThemeRepeatedThemeBoundary.test.js`
- `__tests__/calendarTodoOwnershipBoundary.test.js`
- `__tests__/calendarTodoSubmissionBoundary.test.js`
- `__tests__/recreationModalRepatriationBoundary.test.js`
- `__tests__/nutritionModalRepatriationBoundary.test.js`
- `__tests__/journalCalendarModalRepatriationBoundary.test.js`
- `__tests__/reduxSharedContractBoundary.test.js`

Selectors and read-models:

- `__tests__/calendarSelectorBoundary.test.js`
- `__tests__/dashboardReadModelBoundary.test.js`

Domain, form UX, slice, and surface boundaries:

- `__tests__/journalSliceBoundary.test.js`
- `__tests__/recreationSliceBoundary.test.js`
- `__tests__/nutritionSupplementContract.test.js`
- `__tests__/journalFormUxBoundary.test.js`
- `__tests__/writingFormUxBoundary.test.js`
- `__tests__/recreationFormUxBoundary.test.js`
- `__tests__/nutritionFormUxBoundary.test.js`
- `__tests__/settingsFormUxBoundary.test.js`
- `__tests__/calendarTodoFormUxBoundary.test.js`
- `__tests__/primitiveFamilySurfaceBoundary.test.js`
- `__tests__/modalShellSurfaceBoundary.test.js`
- `__tests__/appShellChromeSurfaceBoundary.test.js`
- `__tests__/settingsTutorialsOwnership.test.js`

Local-only and security validation:

- `scripts/check-local-only-mode.js` checks `src/config/runtimeMode.js`; when local-only mode is enabled it scans `src/` for Firebase/AWS imports and `api/user/` calls.
- `scripts/check-secrets.sh` validates secret-scan exclusions, scans tracked repository files for forbidden credential artifacts and patterns, and optionally scans a commit range.
- These checks are adjacent validation surfaces, not Jest tests.

## Focused Test Standard

Future implementation lanes should run focused Jest tests when they touch executable behavior, reducers, selectors, storage helpers, navigation registration, route handoff, form behavior, repair logic, or domain contracts.

Focused tests should match the touched logic or the nearest stable boundary seam. Prefer the smallest command that exercises the changed seam, for example:

```sh
yarn test --watchAll=false __tests__/calendarSelectorBoundary.test.js
```

When a lane touches multiple seams, include each relevant focused file. Do not broaden focused validation to unrelated domains just to make the lane look more comprehensive. If no focused test exists for the touched seam, record that gap and choose the closest existing boundary test only when it exercises the affected behavior.

Docs-only lanes do not need focused Jest unless the document makes or changes executable behavior claims that should be checked against the harness.

## Full Suite Standard

Future implementation lanes should run the full Jest suite with:

```sh
yarn test --watchAll=false
```

Run full Jest when a lane changes shared contracts, navigation shell behavior, storage or hydration infrastructure, Redux shared behavior, cross-domain selectors, Jest setup/config, package test behavior, or multiple domains. Run it for closeout lanes that certify a sequence of implementation work.

Record the command, exit status, suite/test counts when available, and any warning/noise that appears after or during the run. A passing full suite with warnings should be reported as pass-with-known-noise, not silently cleaned up. A failing full suite is a blocker for implementation lanes unless the lane explicitly classifies and accepts the failure as pre-existing evidence without widening scope.

## Docs-Only Validation Standard

Docs-only lanes may use diff-only validation when they only add or edit documentation and do not introduce executable behavior claims that require the harness to prove.

Minimum docs-only closeout validation:

- `git diff --check`
- `git status --short`

Full Jest is not required for every docs-only lane. It is appropriate when the docs-only artifact inventories the current harness, records current suite health, or depends on current test behavior as evidence. This lane runs full Jest because its purpose is to document the current test harness and standards.

Docs-only validation must still verify file radius. The final `git status --short` should match the lane's allowed changed files exactly.

## Known Current Noise / Non-Blocking Warnings

Warnings observed during validation for this lane are recorded here and not fixed.

- Yarn reported the local cache/global-folder warnings on `yarn test --watchAll=false`, `yarn lint`, `yarn run check:local-only`, and `yarn run check:secrets --report=/tmp/brunchbody-test-harness-secret-scan-report.txt`.
- `yarn test --watchAll=false` printed MMKV hydration `console.log` output from `src/storage/mmkv/hydration.js`.
- `yarn test --watchAll=false` printed the existing React unique-key warning from Nutrition rendering through `__tests__/navigationSmokeFlows.test.js`.
- `yarn test --watchAll=false` printed the existing Jest worker graceful-exit warning after all suites passed.
- `yarn lint` completed with `0` errors and `284` warnings, including unused variables, unnecessary escape characters, unused eslint-disable comments, inline styles, equality, shadowing, radix, and nested-component warning categories.

Warnings recorded in existing architecture docs before this lane include:

- `docs/architecture/ci-health.md` records Yarn cache/global-folder warnings during local validation commands, lint warning output with zero lint errors, and a Jest worker graceful-exit warning after the full suite completed.
- `docs/architecture/flow-smoke-test-closeout.md` records an existing React key warning from Nutrition surface rendering in `__tests__/navigationSmokeFlows.test.js` and an existing Jest worker teardown warning after successful focused/full runs.

These entries are warning debt unless a command exits nonzero.

## Future Lane Reporting Standard

Every future implementation lane should report:

- changed files, grouped by source/test/doc/config surface
- focused validation commands run and their outcomes
- full validation commands run and their outcomes when applicable
- skipped validation commands with specific reasons
- observed warnings or known non-blocking noise
- final `git status --short`

Reporting should be explicit when validation is intentionally narrow. Do not imply release readiness, privacy certification, medical/domain correctness, store readiness, backend readiness, or full product coverage from green Jest results.

## Gaps / Unknowns

Current gaps and unknowns from repo evidence:

- CI currently covers local-only and secret-scan checks, but existing repo docs record that it does not run Jest or lint.
- No package script for formatting or `git diff --check` exists; docs lanes should run `git diff --check` directly.
- No package script groups the expected local closeout checks into one command.
- The full Jest suite can pass while still printing known warning/noise; ownership and prioritization of that noise remains separate follow-on work.
- The shared navigation mocks in `jest.setup.js` return children directly, which is useful for many smoke tests but may be insufficient for route-registration assertions that need to inspect `Screen` props.
- This artifact does not prove hosted CI status, native Android/iOS build health, Metro runtime health, app-store readiness, privacy/disclosure correctness, or domain safety.

## Follow-on Lane Seeds

Bounded future candidates:

- Formalize a reusable test reporting checklist for implementation lane closeouts.
- Isolate recurring Jest warning investigation without changing app behavior.
- Audit flaky or noisy suites and classify warning ownership.
- Evaluate CI parity with local validation for `yarn test`, `yarn lint`, local-only, and secret-scan checks.
- Decide whether a package script should group local closeout validation without changing individual command semantics.

These seeds are not approved for implementation by lane `1.1.7.3`.

## Validation

Validation for lane `1.1.7.3`:

| Command | Exit status | Summary output |
| --- | ---: | --- |
| `yarn test --watchAll=false` | 0 | Passed: 41 test suites, 301 tests, 0 snapshots. Observed Yarn cache/global-folder warnings, MMKV hydration logs, existing Nutrition React key warning, and existing Jest worker graceful-exit warning. |
| `yarn lint` | 0 | Completed with 0 errors and 284 warnings. Output reported 70 warnings potentially fixable with `--fix`; no fixes were applied. |
| `yarn run check:local-only` | 0 | Passed: no Firebase/AWS imports or `api/user/` calls found in `src/`. Observed Yarn cache/global-folder warnings. |
| `yarn run check:secrets --report=/tmp/brunchbody-test-harness-secret-scan-report.txt` | 0 | Passed: exclusions validated and tracked repository files scanned for forbidden secret artifacts and patterns. Observed Yarn cache/global-folder warnings. |
| `git diff --check` | 0 | Passed with no output. |
| `git status --short` | 0 | Only `?? docs/architecture/test-harness-and-standards.md`. |

Final `git status --short` output:

```text
?? docs/architecture/test-harness-and-standards.md
```
