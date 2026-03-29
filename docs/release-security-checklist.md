# Release Security Checklist

Complete this checklist for **every release candidate** before creating/pushing a release tag or changing repository visibility to public.

## Required security checks (all required)

| # | Required check | How to verify | Evidence to attach |
|---|---|---|---|
| 1 | **Clean scan** | Run release security scans (for example: `./scripts/check-secrets.sh --report=<report_path>` and any RC-required scan suite) and confirm there are no unresolved findings. | Attach scan outputs and report files in the release-candidate audit folder. |
| 2 | **No tracked keys** | Run `./scripts/verify-no-tracked-key-material.sh` and confirm no tracked key/certificate artifacts are present. | Attach command output in the release-candidate audit folder. |
| 3 | **Android release hardening verified** | Verify release-safe Android settings in `android/app/build.gradle`, `android/app/src/main/AndroidManifest.xml`, and `android/app/src/main/res/xml/network_security_config.xml`. | Attach verification notes or command output in the release-candidate audit folder. |

## Owner sign-off (required)

All three owner approvals are mandatory.

- Engineering owner sign-off: `________________`  Date (UTC): `YYYY-MM-DD`
- Security owner sign-off: `________________`  Date (UTC): `YYYY-MM-DD`
- Release manager sign-off: `________________`  Date (UTC): `YYYY-MM-DD`

## Release gate policy (blocking)

The release is blocked until this checklist is fully completed.

- [ ] All required security checks (1-3) completed.
- [ ] Evidence for each check attached in release-candidate audit docs.
- [ ] Engineering, Security, and Release Manager sign-offs recorded.

**Policy:** Do **not** create/push the release tag and do **not** change repository/app visibility to public until every box above is checked.

## Archival requirement (required)

After approval and release execution:

- [ ] Save this completed checklist alongside the release artifacts (same release-candidate or release archive folder).
- [ ] Keep links/paths to the attached evidence with the archived checklist for traceability.
