# Public Repository Visibility Decision — 2026-03-29

## Summary

- Repository visibility decision: **READY AFTER DOC ALIGNMENT**
- Public mobile/app release decision: **NO-GO / NOT READY**

This repository can be made public once the top-level contributor-facing documentation accurately describes the current RC2 app behavior and active-development status. That decision is separate from the signed mobile app release path.

## Current Public Positioning

- The repository is intended to be public as an **active-development beta**.
- Additional fixes, cleanup, and feature updates are expected in the coming weeks.
- Current app behavior is local-first and device-local by default.
- Public repository visibility does **not** imply that the app is ready for public release tagging or store distribution.

## Current Behavior To Describe Publicly

- Fresh installs route to `CompleteProfile`.
- Existing local profiles route to `Home`.
- Settings exposes local account/profile actions, including logout, email update, password change/reset, delete-account reset behavior, and Export to CSV.
- User data remains stored on-device only in the current build.

## Relationship To RC2 Release Gating

- Keep `docs/release/public-repo-release-go-no-go-2026-03-29-rc2.md` as the source of truth for signed app/public-release tagging.
- RC2 remains blocked for public app release until:
  1. Signed Android release output exists.
  2. Signed iOS archive/IPA output exists.
  3. Engineering/Security owner and release-manager approvals are recorded.

## Repo Visibility Acceptance Criteria

- Top-level docs no longer claim authentication/local onboarding were removed.
- Top-level docs clearly state the active-development beta posture.
- Top-level docs clearly state that repo visibility and signed app release are separate decisions.
- Security and contributor guidance remain intact.
