# Release Security Checklist

Use this checklist for every release candidate before creating or pushing a release tag.

## Blocking release requirements (must all pass)

Complete each check, attach evidence, and record explicit owner sign-off. The repo/app **cannot** be marked ready for public release until every blocking item is complete.

| # | Requirement | Verification command / source | Evidence attachment | Owner sign-off (required) | Date (UTC) |
|---|---|---|---|---|---|
| 1 | **Clean secret scan** | `./scripts/check-secrets.sh --report=<report_path>` | Attach CLI output + report file in RC audit docs. | Engineering/Security owner: `________________` | `YYYY-MM-DD` |
| 2 | **No tracked key artifacts** | `./scripts/verify-no-tracked-key-material.sh` | Attach command output in RC audit docs. | Engineering/Security owner: `________________` | `YYYY-MM-DD` |
| 3 | **Production Android security settings verified** | Verify `android/app/build.gradle`, `android/app/src/main/AndroidManifest.xml`, and `android/app/src/main/res/xml/network_security_config.xml` release-safe settings. | Attach verification notes/output excerpt in RC audit docs. | Engineering/Security owner: `________________` | `YYYY-MM-DD` |
| 4 | **Full repository scans rerun after remediation** | Re-run all release scans after remediation and confirm clean status/review disposition. | Attach all rerun outputs to release candidate documentation. | Engineering/Security owner: `________________` | `YYYY-MM-DD` |

## Mandatory release gating sequence

1. Run and document all checklist verification steps above.
2. Attach rerun scan outputs to the release candidate audit documentation.
3. Obtain **explicit sign-off** from the named Engineering/Security owner.
4. **Only after** steps 1–3 are complete, mark the repository/application as **ready for public release**.

## Final release readiness gate

- [ ] Checklist requirements 1–4 completed with evidence links.
- [ ] Explicit Engineering/Security owner sign-off recorded.
- [ ] Repository/app marked ready for public release (allowed only after both checks above).

Release manager name/handle: `________________`

Engineering/Security owner name/handle: `________________`

Date (UTC): `YYYY-MM-DD`
