# Security Policy

## Reporting a Vulnerability (Private Disclosure)

This project follows a **private-first** vulnerability disclosure process. Do not post exploit details in public issues, discussions, or pull requests before maintainers complete triage and mitigation.

Please report suspected vulnerabilities **privately** before opening any public issue or pull request.

### Disclosure channels

Use one of the following private channels:

1. **Preferred:** Open a private GitHub Security Advisory draft for this repository.
2. **Fallback:** Contact repository maintainers through the private maintainer contact listed in project ownership records.

When reporting, include:

- Affected file(s), branch, and commit hash (if known).
- Reproduction steps and expected/observed impact.
- Whether any credential, token, or signing material may have been exposed.
- Suggested mitigation (if available).

### Triage and remediation workflow

After intake, maintainers will:

1. Confirm receipt and classify severity/affected scope.
2. Reproduce and validate impact in a private channel.
3. Prepare and review a remediation patch.
4. Rotate/revoke any exposed secrets or signing credentials before disclosure.
5. Coordinate publication timing with reporter when applicable.

### Response expectations

- Initial acknowledgement target: **within 3 business days**.
- Triage updates: provided during investigation until resolution.
- Public disclosure: only after remediation is merged and any exposed secrets are rotated/revoked.

## Secret Handling Standards

Secrets and key material must never be committed to git history.

### Never commit

- Private keys (`-----BEGIN ... PRIVATE KEY-----`)
- Keystores/cert bundles (`*.keystore`, `*.jks`, `*.p12`, `*.pem`, `*.key`, `*.mobileprovision`)
- Access tokens / bearer tokens / refresh tokens
- Cloud provider keys (for example AWS access key IDs)
- Database URLs containing embedded credentials
- Signing credentials or signing property files containing plaintext secrets
- `.env` files that contain signing passwords, API secrets, tokens, or private keys

### Prohibited commit examples

The following are examples of commits that are **not allowed**:

- Adding `android/app/release.keystore` or `ios/certs/dist.p12` to git.
- Committing `.env`, `.env.production`, or `android/signing.properties` with real secret values.
- Committing a private-key block such as `-----BEGIN PRIVATE KEY-----` in any source/config/documentation file.
- Adding a hardcoded token or URL with embedded credentials (for example `postgres://<credentials-redacted>@host/db`).

### Required controls

- Run `./scripts/check-secrets.sh` before each push and before release tagging.
- Keep long-lived secrets in secret managers or CI-protected variables.
- Keep signing values and environment secrets in local developer paths or CI variables, never in tracked files.
- Keep `.secret-scan-exclusions` minimal, limited to known-safe noisy paths only, and document rationale for each entry.
- Secret-scan detections fail CI by default; any exception requires explicit security approval (`security-override-approved` PR label).
- On protected branches, require the status check `Secret scan (changed + full repo)` before merge.
- Treat accidental secret commits as incidents (see incident response below).

> OAuth client IDs (for example `*.apps.googleusercontent.com` and reversed-client-id URL schemes) are public identifiers, not secrets.

## Incident Response Basics

If a secret leak, signing-key exposure, or other security incident is suspected:

1. **Contain immediately**
   - Revoke/rotate affected secrets, tokens, or keys.
   - Disable impacted credentials and release pipelines if needed.
2. **Assess scope**
   - Determine affected versions, branches, and systems.
   - Confirm whether exposure exists in git history, CI logs, artifacts, or release assets.
3. **Remediate**
   - Remove leaked material from the codebase and, when required, from git history.
   - Patch root cause and add/adjust preventive checks.
4. **Communicate**
   - Coordinate updates through private channels until safe for public disclosure.
   - Publish a post-incident summary after remediation and credential rotation are complete.
5. **Verify closure**
   - Re-run secret scan and release gates.
   - Confirm signing/network-security checks before any new public release tag.
