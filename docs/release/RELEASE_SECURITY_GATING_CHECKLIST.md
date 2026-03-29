# Release Security Gating Checklist

Use this checklist for every release candidate. This checklist is **required** before creating a git tag or publishing a public release.

## Checklist (all items required)

- [ ] **Clean secret scan** completed (`./scripts/check-secrets.sh`) with no unresolved high-risk findings.
  - Evidence link/path: `________________________________________`
  - Verification date (UTC): `YYYY-MM-DD`

- [ ] **No tracked key artifacts** confirmed (`./scripts/verify-no-tracked-key-material.sh`) and repository contains no tracked signing key material (`*.keystore`, `*.jks`, `*.p12`, `*.pem`, `*.key`, `*.mobileprovision`).
  - Evidence link/path: `________________________________________`
  - Verification date (UTC): `YYYY-MM-DD`

- [ ] **Android release signing configuration** verified as release-safe (keystore/cert references valid, secrets sourced from secure environment/CI, no plaintext signing credentials committed).
  - Verification source files: `android/app/build.gradle`, `android/signing.properties.example`, release pipeline/secret configuration notes.
  - Evidence link/path: `________________________________________`
  - Verification date (UTC): `YYYY-MM-DD`

- [ ] **Production cleartext policy** verified for Android release (release manifest/network security config enforce HTTPS-only policy and no production cleartext exceptions).
  - Verification source files: `android/app/src/main/AndroidManifest.xml`, `android/app/src/main/res/xml/network_security_config.xml`
  - Evidence link/path: `________________________________________`
  - Verification date (UTC): `YYYY-MM-DD`

## Required sign-off

Engineering owner (required):
- Name/handle: `____________________________`
- Signature/approval: `____________________________`
- Date (UTC): `YYYY-MM-DD`

Release manager (required):
- Name/handle: `____________________________`
- Signature/approval: `____________________________`
- Date (UTC): `YYYY-MM-DD`

## Release gate policy (blocking)

- Do **not** create or push a release tag until all checklist items are complete and both sign-offs are recorded.
- Do **not** publish a public release until this completed checklist is attached to the release candidate artifacts.

## Traceability and artifact storage

Store the completed checklist with release artifacts for every candidate/release. Recommended location:

- `docs/release/candidates/<version>/audit/completed-release-security-gating-checklist-<YYYY-MM-DD>.md`

The completed checklist must be retained alongside scan outputs and final release security reports to preserve audit traceability.
