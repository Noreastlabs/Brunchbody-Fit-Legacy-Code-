# Security Policy

## Reporting a Vulnerability (Private Disclosure)

Please report suspected vulnerabilities **privately** before opening any public issue or pull request.

### Disclosure contact

Use one of the following private channels:

1. **Preferred:** Open a private GitHub Security Advisory draft for this repository.
2. **Fallback:** Contact repository maintainers through the private maintainer contact listed in project ownership records.

When reporting, include:

- Affected file(s), branch, and commit hash (if known).
- Reproduction steps and expected/observed impact.
- Whether any credential, token, or signing material may have been exposed.
- Suggested mitigation (if available).

### Response expectations

- Initial acknowledgement target: **within 3 business days**.
- Triage updates: provided during investigation until resolution.
- Public disclosure: only after remediation is merged and any exposed secrets are rotated/revoked.

## Secret Handling Rules

Secrets and key material must never be committed to git history.

### Never commit

- Private keys (`-----BEGIN ... PRIVATE KEY-----`)
- Keystores/cert bundles (`*.keystore`, `*.jks`, `*.p12`, `*.pem`)
- Access tokens / bearer tokens / refresh tokens
- Cloud provider keys (for example AWS access key IDs)
- Database URLs containing embedded credentials
- Signing credentials or signing property files containing plaintext secrets

### Required controls

- Run `./scripts/check-secrets.sh` before each push and before release tagging.
- Keep long-lived secrets in secret managers or CI-protected variables.
- Keep `.secret-scan-exclusions` minimal and limited to known-safe noisy paths only.
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
