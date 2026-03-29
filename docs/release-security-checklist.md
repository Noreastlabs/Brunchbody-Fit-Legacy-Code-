# Release Security Checklist

Use this checklist for every release candidate before creating or pushing a release tag.

## Blocking security verification items

Complete each check and capture evidence links (CI job, log snippet, or review comment). Every item requires a named reviewer sign-off before tagging.

| # | Checklist item | Verification details | Reviewer sign-off (required) | Date (UTC) |
|---|---|---|---|---|
| 1 | Secret scan pass | Run `./scripts/check-secrets.sh` and confirm pass with no unresolved high-risk findings. | Name/handle: `________________` | `YYYY-MM-DD` |
| 2 | No tracked key artifacts | Run `./scripts/verify-no-tracked-key-material.sh` and confirm no tracked key artifacts (`*.keystore`, `*.jks`, `*.p12`, `*.pem`, `*.key`, `*.mobileprovision`). | Name/handle: `________________` | `YYYY-MM-DD` |
| 3 | Android production security checks complete | Verify release build security checks below are complete and documented. | Name/handle: `________________` | `YYYY-MM-DD` |
| 3a | `android/app/build.gradle` release signing config verified | Confirm `release` signing config does not include hardcoded secrets, uses secure environment/CI-provided credentials, and references the correct production keystore path/alias. | Name/handle: `________________` | `YYYY-MM-DD` |
| 3b | `android/app/src/main/AndroidManifest.xml` cleartext policy verified | Confirm release configuration preserves HTTPS-only behavior and does not allow cleartext traffic for production. | Name/handle: `________________` | `YYYY-MM-DD` |

## Pre-tag release approval

Before tagging, verify that all checklist rows above are complete and signed by named reviewers.

- [ ] **Release manager approval (required):** All blocking security items are completed, evidence is attached, and reviewer sign-offs are recorded.
- Release manager name/handle: `________________`
- Date (UTC): `YYYY-MM-DD`

## Audit archival requirement

After release approval and tagging:

- [ ] Archive the completed checklist with the release artifacts for auditability.
- [ ] Store the archive in the release artifact/audit location used by the team (for example, the release candidate audit folder).
- [ ] Ensure the archived record includes: checklist file, reviewer names, UTC dates, and evidence links.
