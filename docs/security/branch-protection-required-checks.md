# Branch Protection: Required Secret Scan Check

To enforce merge blocking on protected branches, configure branch protection so the GitHub Actions check named **`Secret scan (required)`** is mandatory.

## Why

The `Secret scan` workflow scans:

- the full tracked repository contents, and
- PR-introduced diff hunks.

It hard-fails on detections unless an explicit security review override is applied on pull requests using both labels:

- `security-review-approved`
- `secret-scan-override-approved`

## GitHub UI setup

1. Go to **Settings → Branches → Branch protection rules**.
2. Create or edit the rule for `main` (and any other protected branches).
3. Enable **Require status checks to pass before merging**.
4. Add **`Secret scan (required)`** to required checks.
5. Save the rule.

## Optional GitHub CLI/API example

You can also enforce this through the API (replace placeholders):

```bash
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/OWNER/REPO/branches/main/protection \
  -f required_status_checks.strict=true \
  -f enforce_admins=true \
  -F required_status_checks.contexts[]='Secret scan (required)'
```

Keep this check required on every protected branch to ensure secrets scanning gates merges.
