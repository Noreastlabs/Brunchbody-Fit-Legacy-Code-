# Public Release Checklist

Use this checklist before creating a public release tag.

## Required gates

- [ ] **Release Security Gating Checklist completed and archived** (`docs/release/RELEASE_SECURITY_GATING_CHECKLIST.md` completed, signed by Engineering owner + Release manager, and stored under the release candidate artifacts path).
- [ ] Local-only guardrail passes (`npm run check:local-only`).
- [ ] **Pre-merge PR security checks completed** (`./scripts/check-secrets.sh` passes and signing-configuration verification is recorded in the PR checklist/review notes).
- [ ] Secret scan passes with no high-risk findings (`./scripts/check-secrets.sh`).
- [ ] **One-time tracked key-material verification completed (blocking)** (`./scripts/verify-no-tracked-key-material.sh` returns no tracked `*.keystore`, `*.jks`, `*.p12`, `*.pem`, `*.key`, `*.mobileprovision` files).
- [ ] Verify `.secret-scan-exclusions` still contains only low-risk/noisy files.
- [ ] **Signing configuration check completed** (keystore/cert references are valid, credentials are sourced from secure environment variables, and no plaintext signing secrets are committed).
- [ ] **Network-security check completed** (Android release manifest/config keep HTTPS-only policy with no release cleartext exceptions).
- [ ] Signed Android release artifact generated.
- [ ] Signed iOS release artifact generated.
- [ ] Release notes published with local-only data behavior statement (for example `docs/release/RELEASE_NOTES_1.0.3-rc.2.md`).
- [ ] **Final security report approved (blocking)** (latest RC final report, e.g. `docs/release/candidates/1.0.3-rc.2/audit/release-security-report-2026-03-29.md`, is approved by release owner/security approver before public tag creation).

## Explicit release sign-off (required)

Before tagging, a release owner must explicitly sign off that every required gate above is complete.

- [ ] **Release owner sign-off:** I verified all checklist gates and approve this build for public release tagging.
- Sign-off name/handle: `__________________`
- Date (UTC): `YYYY-MM-DD`

## Tagging rule

Do **not** create or push public release tags until every required gate is checked, explicit release owner sign-off is recorded, and the completed security gating checklist is stored with release artifacts for traceability.
