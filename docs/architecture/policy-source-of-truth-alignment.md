# Policy and Source-of-Truth Alignment

## Status and Scope

This document is internal policy/source-of-truth guidance only. It is not a legal privacy policy, store disclosure, user agreement, app behavior change, or release approval. It must not be used to claim behavior that has not been verified in the app.

This is a docs-only Phase 1 trust, documentation, and user-control artifact for Brunch Body. It defines how future reviewers should align policy-adjacent claims across app behavior, in-app copy, public docs, privacy language, store disclosure prep, deletion/reset language, export/backup/import language, permissions, and future release materials.

This artifact exists to prevent product, privacy, backup, deletion, permissions, store, and future-feature claims from becoming broader than current evidence. It does not approve any public wording, disclosure answer, privacy statement, release note, platform listing, or app behavior.

## Source-of-Truth Hierarchy

Use this hierarchy when policy-adjacent claims conflict or when a reviewer needs to decide which surface controls the wording:

1. Current app behavior and executable code
2. Current tests that verify behavior
3. Current internal architecture docs
4. Current public docs/user-facing help docs
5. Store/disclosure prep artifacts
6. Older docs, comments, plans, proposals, and stale references

Current app behavior and executable code are the highest source of truth for current behavior claims. Current tests can verify behavior, but tests do not create behavior by themselves. Architecture docs, public docs, and store/disclosure prep artifacts must stay bounded by current behavior and current evidence.

Older docs, comments, proposal text, plans, and stale references must never override current behavior. If older text conflicts with current app behavior, treat the older text as stale until a future lane verifies and updates it.

## Policy-Adjacent Surfaces

This guidance applies to policy-adjacent claims in internal, public, release-facing, and store-facing materials, including:

- local-first storage posture
- profile/account wording
- Delete local data
- reset/archive/delete language
- export/backup/import/restore/device migration
- privacy and data transparency docs
- App Store privacy disclosure prep
- Google Play Data safety prep
- permissions/access transparency
- AI, sync/backend, monetization, health platform integrations, and desktop/tablet expansion if mentioned anywhere in docs

These surfaces are trust-sensitive because small wording changes can imply app behavior, data handling, legal posture, platform disclosure status, account behavior, recovery support, or future release readiness.

## Alignment Rules

- Behavior claims must match current app behavior and executable code. If behavior has not been verified, do not describe it as current, supported, automatic, guaranteed, complete, approved, or release-ready.
- Deletion/reset claims must distinguish Delete local data, reset, archive, delete, uninstall, exported files, operating-system backups, and account deletion language. Do not collapse these into one broad deletion promise.
- Export/backup/import claims must distinguish one-way export, user-managed backup, import, restore, device migration, cloud backup, and cross-device recovery. Do not call an export a full backup unless that exact behavior is verified.
- Account/profile claims must distinguish local profile information from accounts, authentication, cloud identity, sync, subscription identity, password reset, and remote recovery. Do not imply accounts or authentication unless current behavior verifies them.
- Privacy/store disclosure claims must match verified app behavior, current privacy/data transparency docs, permissions, package/dependency evidence, manifests, and disclosure prep. Do not make final App Store, Google Play, legal, compliance, or privacy-policy claims from this document.
- Future/planned feature claims must be labeled as planned, proposed, future, deferred, or out of scope. Roadmap text must never be written as shipped behavior.
- Non-claims for unavailable behavior must be explicit when needed. If backend sync, cloud accounts, AI behavior, monetization, health platform integrations, desktop/tablet expansion, import/restore, or similar behavior is unavailable or unverified, do not imply it by omission or optimistic wording.

## Conflict Resolution Rules

- If app behavior and docs conflict, app behavior wins.
- If tests and docs conflict, inspect app behavior before changing claims.
- If public docs and internal docs conflict, resolve toward verified behavior.
- If store/disclosure prep and repo evidence conflict, mark the claim unresolved instead of broadening it.
- If a claim cannot be verified, label it unverified, unknown, future, or out of scope, whichever is most accurate.

Conflict resolution must preserve narrow, evidence-bound wording. A mismatch is not permission to strengthen a claim, finalize a disclosure, or change app semantics in a docs lane.

## Evidence Requirements

Every current behavior claim in a policy-adjacent surface must name evidence. Acceptable evidence includes:

- file path
- test file
- route/screen
- copy string
- storage key
- manifest/permission file
- package/dependency file
- docs artifact

Do not invent evidence. If evidence is not inspected in this lane, the rule is that future claim-specific lanes must inspect and name evidence before making or approving current behavior claims.

Evidence should be specific enough for a reviewer to find the source again. When the evidence is partial, stale, indirect, or not release-certified, label the claim accordingly instead of making the wording broader.

## Non-Claims

This document does not:

- change app behavior
- change privacy posture
- change deletion/reset semantics
- change export/import/backup behavior
- create cloud sync
- create accounts or authentication
- create AI behavior
- create monetization behavior
- approve App Store or Google Play answers
- replace legal review
- make the app launch-ready

This document also does not approve final public docs, privacy policy text, support scripts, app-store listing text, platform privacy labels, Google Play Data safety answers, release notes, screenshots, or in-app copy.

## Reviewer Checklist

Future reviewers should confirm:

- [ ] Claim matches current app behavior.
- [ ] Source evidence is named.
- [ ] Public docs do not exceed verified behavior.
- [ ] Privacy/store language does not exceed verified behavior.
- [ ] Deletion/export/backup/import language stays bounded.
- [ ] Planned/future behavior is labeled as planned/future.
- [ ] Stale docs are not treated as source of truth.
- [ ] No backend/cloud/account/AI/monetization behavior is implied by accident.

## Validation

- Docs-only lane.
- No app behavior changed.
- No public docs changed; this lane creates only the requested internal architecture artifact.
- No privacy policy changed.
- No store metadata changed.
- No manifests changed.
- No package files or lockfiles changed.
- Validation commands run:
  - `git diff --check`
  - `git status --short --untracked-files=all`
  - `rg -n "This document is internal policy/source-of-truth guidance only" docs/architecture/policy-source-of-truth-alignment.md`
  - `rg -n "current app behavior|source-of-truth|unverified|Non-Claims|Reviewer Checklist" docs/architecture/policy-source-of-truth-alignment.md`
