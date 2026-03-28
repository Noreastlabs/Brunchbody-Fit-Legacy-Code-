# Security Policy

## Supported Versions

This repository tracks active hardening on the `main` branch and current release candidates.
If you discover a security issue, report it privately before opening any public issue or pull request.

## Vulnerability Disclosure Process

1. **Do not disclose publicly first.**
2. Report details to the maintainers via private channels (security contact in project ownership records) and include:
   - Affected file(s), commit hash, and branch.
   - Reproduction steps and expected impact.
   - Whether the issue is already present in public history.
3. Maintainers will acknowledge receipt within **3 business days** and provide status updates while triaging.
4. If credentials might be exposed, immediate rotation/revocation is required before any public fix notes.
5. Public disclosure should happen only after a fix is merged and impacted keys/tokens are rotated.

## Prohibited Secrets

Never commit plaintext secrets or credential material, including:

- Cloud access keys (for example AWS access key IDs).
- Bearer tokens and API access tokens.
- Database connection URLs containing embedded credentials.
- Private key blocks (`-----BEGIN ... PRIVATE KEY-----`).
- Secret container files (`*.keystore`, `*.jks`, `*.p12`, `*.pem`).

Automated guardrails are enforced by `scripts/check-secrets.sh` in both pre-commit and CI.

## Commit Hygiene Rules

Before every push (and before release tagging):

1. Run `./scripts/check-secrets.sh` and ensure it passes.
2. Confirm staged changes do not include generated credentials, dumps, or copied production config.
3. Keep secrets in secret managers / CI variables, never in source files.
4. If a secret was committed accidentally:
   - Revoke/rotate immediately.
   - Remove it from git history.
   - Open a security incident report with remediation notes.

## False-Positive Exclusions

To keep scans strict but low-noise, false-positive path exclusions are versioned in:

- `.secret-scan-exclusions`

Only add exclusions for files that are known-safe and noisy (for example lockfiles). Do not exclude source directories broadly.
