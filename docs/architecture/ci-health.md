# CI Health

Lane 1.1.6.4 is an audit/inventory lane only. This lane approves no CI workflow changes, package-script changes, dependency changes, config changes, native-build changes, source changes, test changes, privacy changes, disclosure changes, or release-readiness claims.

Any existing failures, warnings, missing workflows, missing validation coverage, or formatting drift recorded here are current-state findings, not things to repair in this lane.

## Lane Boundary

This document inventories the current CI and local validation posture for the Brunch Body legacy app. It documents what CI surfaces exist, how package scripts map to validation commands, which bounded local commands were run, and what those commands reported in this checkout.

No public API, type, workflow, package script, dependency, lockfile, Metro, Babel, Jest, ESLint, Prettier, native-build, source, test, privacy, disclosure, or user-facing behavior change is approved or made by this lane.

## Current CI Surfaces

`.github/workflows/` exists.

Observed workflow files:

- `.github/workflows/local-only-guard.yml`
- `.github/workflows/secret-scan.yml`

`local-only-guard.yml` runs on pull requests and pushes to `main`. Its validation steps are:

- `yarn install --frozen-lockfile`
- `yarn run check:local-only`

`secret-scan.yml` runs on pull requests targeting `main` and pushes to `main`. Its validation steps include:

- resolving the relevant commit range
- requiring explicit security-review labels for secret-scan policy updates on pull requests
- `yarn run check:secrets --range="${{ steps.range.outputs.range }}" --report=secret-scan-report.txt`
- enforcing non-overridable failures on non-PR events
- attaching and uploading `secret-scan-report.txt`

CI is present but incomplete. The existing workflows appear usable for the configured local-only guard and secret scan, but they do not currently run lint, Jest tests, formatting checks, app builds, or native/platform validation. Hosted CI pass/fail state was not queried in this lane; this document records repository configuration and local command results only.

## Local Validation Commands

Package manager and runtime context visible in `package.json`:

- `packageManager`: `yarn@1.22.22`
- `engines.node`: `>=18`
- CI workflows use Node 20 and Corepack before Yarn commands.

Validation-relevant package scripts:

- `lint`: `eslint .`
- `test`: `jest`
- `check:local-only`: `node scripts/check-local-only-mode.js`
- `check:secrets`: `./scripts/check-secrets.sh`

Platform/runtime scripts present but not treated as bounded audit validation commands:

- `android`: `react-native run-android`
- `ios`: `react-native run-ios`
- `start`: `react-native start`

No package script for formatting, Prettier checking, app build validation, or native CI validation is currently defined.

## Observed Results

| Command | Exit code | Result summary | Audit-lane classification |
| --- | ---: | --- | --- |
| `git status --short` | 0 | Pre-change baseline had no output before creating `docs/architecture/ci-health.md`. | Informational |
| `yarn run check:local-only` | 0 | Passed: no Firebase/AWS imports or `api/user/` calls found in `src/` while local-only mode is enabled. Yarn reported local cache/global-folder warnings. | Informational |
| `yarn run check:secrets --report=/tmp/brunchbody-secret-scan-report.txt` | 0 | Passed: exclusions validated and tracked repository files scanned for forbidden secret artifacts and patterns. Yarn reported local cache/global-folder warnings. | Informational |
| `yarn lint` | 0 | Completed with `0` errors and `284` warnings, including inline-style, unused-disable, unused-variable, equality, shadowing, radix, and related warning categories. | Warning-only |
| `yarn test --watchAll=false` | 0 | Passed `41` test suites and `288` tests with `0` snapshots. Jest reported a worker graceful-exit warning after completion. | Warning-only |

Skipped commands:

- Direct `yarn prettier --check .` or equivalent was not run because no package script exists for formatting checks, and this lane does not invent missing validation commands.
- `yarn android` was not run because it is environment-dependent and invokes a native Android app run.
- `yarn ios` was not run because it is environment-dependent and invokes a native iOS app run.
- `yarn start` was not run because it starts the React Native Metro server and is a runtime command, not a bounded audit validation command.

## CI Coverage Gaps

Observed CI coverage gaps:

- CI does not run `yarn lint`.
- CI does not run `yarn test` or another Jest command.
- CI does not run a formatting check.
- CI does not run app build validation.
- CI does not run native Android or iOS validation.
- Package scripts exist for lint and tests but are not wired to CI.
- Formatting is not CI-covered and not package-script-backed in this lane; no direct Prettier command is added or run.

## Current Health Classification

CI present but incomplete.

The repository has GitHub Actions workflows for the local-only guard and secret scan, and the corresponding local package commands passed in this checkout. However, CI does not currently cover lint, Jest tests, formatting checks, app builds, or native/platform validation, so the current posture is narrower than a full CI validation gate.

## Not Approved In This Lane

This lane does not approve:

- adding workflows
- changing workflow triggers
- changing package scripts
- changing test, lint, or format behavior
- changing dependencies
- making native build changes
- broad repo formatting
- broad lint cleanup
- fixing Jest worker shutdown behavior
- changing privacy posture, deletion semantics, disclosures, or user-facing claims
- declaring release readiness

## Follow-on Lane Seeds

Bounded follow-on lanes justified by the observed findings:

- `1.1.6.4.1 Add minimal CI workflow coverage for lint and tests`
- `1.1.6.4.2 Align CI validation commands with package scripts`
- `1.1.6.4.3 Formatting check policy decision`
- `1.1.6.4.4 Native build CI feasibility review`

## Validation Notes

Validation results in this document reflect the local checkout at the time of this lane and are not a guarantee that hosted CI currently passes on all branches.

The Jest worker graceful-exit warning is recorded as current-state validation noise, not repaired or reclassified as a failure in this lane.

The pre-change `git status --short` baseline was clean before creating this artifact. Closeout verification for this lane should show only:

```text
?? docs/architecture/ci-health.md
```
