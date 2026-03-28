# Public Release Checklist

Use this checklist before creating a public release tag.

## Required gates

- [ ] Local-only guardrail passes (`npm run check:local-only`).
- [ ] **Pre-merge PR security checks completed** (`./scripts/check-secrets.sh` passes and signing-configuration verification is recorded in the PR checklist/review notes).
- [ ] Secret scan passes with no high-risk findings (`./scripts/check-secrets.sh`).
- [ ] Verify `.secret-scan-exclusions` still contains only low-risk/noisy files.
- [ ] **Signing configuration check completed** (keystore/cert references are valid, credentials are sourced from secure environment variables, and no plaintext signing secrets are committed).
- [ ] **Network-security check completed** (Android release manifest/config keep HTTPS-only policy with no release cleartext exceptions).
- [ ] Signed Android release artifact generated.
- [ ] Signed iOS release artifact generated.
- [ ] Release notes published with local-only data behavior statement.

## Explicit release sign-off (required)

Before tagging, a release owner must explicitly sign off that every required gate above is complete.

- [ ] **Release owner sign-off:** I verified all checklist gates and approve this build for public release tagging.
- Sign-off name/handle: `__________________`
- Date (UTC): `YYYY-MM-DD`

## Tagging rule

Do **not** create or push public release tags until every required gate is checked **and** explicit release owner sign-off is recorded.
