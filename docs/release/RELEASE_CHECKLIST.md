# Public Release Checklist

Use this checklist before creating a public release tag.

## Required gates

- [ ] Local-only guardrail passes (`npm run check:local-only`).
- [ ] Secret scan passes with no high-risk findings (`./scripts/check-secrets.sh`).
- [ ] Verify `.secret-scan-exclusions` still contains only low-risk/noisy files.
- [ ] Signed Android release artifact generated.
- [ ] Signed iOS release artifact generated.
- [ ] Release notes published with local-only data behavior statement.

## Tagging rule

Do **not** create or push public release tags until every required gate above is checked.
