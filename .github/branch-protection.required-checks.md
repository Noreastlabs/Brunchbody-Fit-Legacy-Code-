# Protected Branch Required Checks

To enforce secret scanning on the main branch, configure branch protection (or a ruleset)
so the following status check is required:

- `Secret scan (required)`

This check is intentionally blocking: any detected credential/secret pattern fails the PR
until the finding is removed or the false positive is explicitly allowlisted through the
security-reviewed exclusions process.

## GitHub CLI example

```bash
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/OWNER/REPO/branches/main/protection \
  -f required_status_checks.strict=true \
  -F required_status_checks.contexts[]='Secret scan (required)' \
  -f enforce_admins=true \
  -f required_pull_request_reviews.dismiss_stale_reviews=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f restrictions=
```

If you use organization-level rulesets instead of branch protection, add this same check
as a required status check in the main branch ruleset.
