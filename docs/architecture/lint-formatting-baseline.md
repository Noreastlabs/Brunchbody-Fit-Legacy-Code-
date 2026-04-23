# Lint And Formatting Baseline

This document is the present-state lint and formatting baseline for lane
`1.1.6.3` as inspected on April 23, 2026.

Lane rule: this is a baseline-only documentation lane. It does not approve or
perform repo-wide lint cleanup, repo-wide formatting, `eslint --fix`,
`prettier --write`, rule overhauls, dependency upgrades, CI expansion, or app
behavior changes.

## Current Tooling Surface

- `package.json` defines `lint` as `eslint .`.
- `package.json` does not define a `format`, `format:check`, or Prettier script.
- `.eslintrc.js` is the active local ESLint config.
- `.eslintrc.js` extends `@react-native`.
- `.eslintrc.js` enables the `prettier` and `import` plugins.
- `.eslintrc.js` explicitly keeps `prettier/prettier` off.
- `.prettierrc.js` is present and configures Prettier with:
  - `arrowParens: 'avoid'`
  - `singleQuote: true`
  - `trailingComma: 'all'`
- `prettier` is installed as a dev dependency at `2.8.8`.
- No `.eslintignore` file is present.
- No `.prettierignore` file is present.
- No `tsconfig.json` file is present.

## CI And Workflow Baseline

No lint or formatting workflow is currently wired in `.github/workflows`.

The inspected workflow surface contains:

- `.github/workflows/secret-scan.yml`
- `.github/workflows/local-only-guard.yml`

The inspected branch-protection note only documents `Secret scan (required)` as
a required check. This lane does not add or require lint or formatting in CI.

## Baseline Results

Current lint behavior is preserved as-is:

- `yarn lint` runs `eslint .`.
- The command exits successfully with warnings only.
- Current result: `284 problems (0 errors, 284 warnings)`.
- Current autofixable warning count reported by ESLint: `70 warnings potentially
fixable with the --fix option`.

Current formatter behavior is documented without introducing a new package
script:

- `yarn prettier --version` exits successfully and reports `2.8.8`.
- `yarn prettier --check .` is callable because Prettier is installed.
- `yarn prettier --check .` currently exits with code `1`.
- Current result: `Code style issues found in 315 files. Forgot to run
Prettier?`

Those lint warnings and formatting findings are baseline facts only. They are
not remediation targets for this lane.

## Validation Notes

Commands run during this lane:

- `git status --short`
  - Result: exit `0`; no output before changes.
- `yarn lint`
  - Result: exit `0`.
  - Summary: `284 problems (0 errors, 284 warnings)`.
  - Additional summary: `0 errors and 70 warnings potentially fixable with the
--fix option`.
- `yarn prettier --version`
  - Result: exit `0`.
  - Summary: `2.8.8`.
- `yarn prettier --check .`
  - Result: exit `1`.
  - Summary: `Code style issues found in 315 files. Forgot to run Prettier?`
- `yarn prettier --check docs/architecture/lint-formatting-baseline.md`
  - First result: exit `1` before manual Markdown formatting adjustment.
  - Final result: exit `0` after manual Markdown formatting adjustment.
  - Final summary: `All matched files use Prettier code style!`
- `yarn prettier docs/architecture/lint-formatting-baseline.md`
  - Result: exit `0`.
  - Summary: printed Prettier-formatted Markdown to stdout for manual patching;
    did not write files.
- Final `git status --short`
  - Result: exit `0`.
  - Summary: only `?? docs/architecture/lint-formatting-baseline.md`.

Yarn also emitted local cache/global-folder warnings in this environment because
the preferred user cache/global folders were not writable. Those warnings did
not change the command outcomes above.
