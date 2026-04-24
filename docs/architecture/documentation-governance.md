# Lane: 1.2.1.4 Documentation Governance

## Scope Lock

This is an internal documentation-governance artifact for Brunch Body. It is not a legal policy, privacy policy, store submission, user-facing help guide, release certification, medical guidance, or product behavior document.

This lane creates one documentation artifact only. It does not change app source, tests, package files, config, CI, privacy disclosures, store metadata, deletion semantics, backup semantics, AI scope, platform scope, monetization scope, or medical, nutrition, and fitness claims.

Future documentation lanes must use this artifact to keep claims accurate, bounded, user-trustworthy, and aligned with observed app behavior. If a documentation issue requires changing public copy, privacy language, store/disclosure language, in-app copy, or product behavior, that work must be split into a later lane.

## Purpose

Brunch Body documentation should help users, testers, reviewers, and collaborators understand what the app does without overstating what has been built, tested, disclosed, or approved.

The governance goals are:

- keep current-behavior claims grounded in live app behavior and repo evidence
- distinguish observed behavior from project intent and future roadmap
- prevent accidental privacy, backup, AI, platform, store, or medical claims
- carry contradictions forward as follow-on work instead of widening narrow docs lanes
- make future public docs easier to review for truthfulness before release

## Governed Documentation Surfaces

Known Phase 1 public docs governed by this artifact:

- `docs/public/brunch-body-user-guide.md`
- `docs/public/brunch-body-privacy-and-data.md`
- `docs/public/brunch-body-non-coder-onboarding.md`

Other governed surfaces when later lanes create or edit them:

- public user guides, onboarding guides, support docs, and FAQ-style docs
- privacy and data guides, privacy-policy drafts, platform privacy labels, and store data-safety answers
- release notes, release checklists, go/no-go reports, and launch-readiness materials
- in-app trust, help, tutorial, settings, privacy, delete/reset, export/import, backup, or safety copy
- store listing copy, screenshots, descriptions, review notes, and disclosure support materials
- contributor-facing docs that describe user-visible behavior, storage, deletion, export, privacy, AI, platform, release, or medical boundaries

Governance applies to both new documents and later edits to existing documents. A doc can be public-facing while still needing internal evidence review before release.

## Source-Of-Truth Hierarchy

Use this hierarchy when docs disagree, when a claim is unclear, or when a reviewer needs to decide whether wording is safe.

1. Live app behavior and code
2. Tests and validation artifacts
3. Architecture docs
4. Public docs
5. Roadmap/future intent

Rules:

- Live behavior and current code win over older docs.
- Tests and validation artifacts support behavior claims but do not create behavior by themselves.
- Architecture docs explain current contracts and known risks, but they must yield to live code if stale.
- Public docs must simplify carefully without becoming broader than the evidence.
- Roadmap and future intent must never be written as shipped behavior.

## Claim Classification Model

Every meaningful documentation claim about product behavior, data handling, privacy, deletion, export/import, backup, AI, platform support, store readiness, or medical/fitness/nutrition posture should fit one of these labels:

| Claim type | Meaning | Required wording posture |
| --- | --- | --- |
| Observed behavior | Directly observed in current app behavior or current code. | Describe narrowly and cite or name the supporting surface when practical. |
| Validated behavior | Covered by a test, checklist, release artifact, or other validation record. | Name the validation source and avoid implying broader coverage. |
| Architecture-supported interpretation | Supported by architecture docs, inventories, or audits. | Use cautious wording such as "current project evidence supports" or "architecture docs describe." |
| Public explanation | A plain-language explanation of observed or validated behavior. | Keep it simpler than internal docs but not stronger than the evidence. |
| Legal/privacy/store requirement | A requirement or review need for legal, privacy, or platform disclosure alignment. | Mark as a requirement or review input, not as legal advice or final disclosure copy. |
| Project intent | A desired direction in scope, planning, or roadmap docs. | Label as intent and keep it separate from current behavior. |
| Planned/proposed future work | A possible later feature, review, or documentation lane. | Label as planned, proposed, future work, or follow-on work. |
| Unknown | Not proven by current evidence. | Label as unknown or needs verification; do not fill the gap with assumptions. |

Unverified behavior must be labeled as `planned`, `proposed`, `unknown`, `needs verification`, or `future work`. It must not be described as shipped, current, supported, guaranteed, automatic, secure, compliant, or store-ready.

## Public-Facing Documentation Rules

Public-facing docs should be plain, useful, and conservative.

- State what the app appears to do only when that is supported by current behavior, code, tests, or current architecture docs.
- Use "appears to," "based on current project evidence," "current observed behavior," or `Needs verification` when the evidence is real but not release-certified.
- Keep current behavior, project intent, and future roadmap in separate sentences or sections.
- Do not use roadmap language to soften or replace a current limitation.
- Do not imply launch readiness, store readiness, legal approval, privacy certification, medical review, or full QA coverage unless a later lane explicitly proves and approves that claim.
- If public docs need stronger wording than the evidence supports, stop and seed a follow-on verification lane.

## Privacy And Data Wording Rules

Privacy and data wording is trust-sensitive. It must be reviewed against live behavior, storage evidence, platform disclosures, and current public docs before release use.

- Local-first/privacy-forward language must describe the current observed posture only. Do not turn it into a permanent promise or a legal guarantee.
- Do not claim that data never leaves the device unless all relevant app behavior, platform behavior, exports, permissions, analytics, third-party services, and disclosure surfaces have been checked for the shipped build.
- Do not claim backend, cloud account, remote sync, analytics, ads, AI processing, or third-party sharing behavior unless it is directly verified and disclosure-reviewed.
- Do not claim secure deletion, forensic deletion, deletion from operating-system backups, or deletion from files saved outside the app unless specifically verified.
- Do not claim HIPAA compliance, clinical privacy compliance, medical-record handling, or regulated health-data compliance unless a qualified later lane explicitly authorizes it.
- Treat fitness, nutrition, journal, calendar, profile, body, routine, and reflection information as sensitive in documentation tone, even when current docs describe local storage.
- Store/disclosure language must match the shipped app behavior, privacy docs, in-app copy, release docs, and platform disclosure answers.

## Backup, Export, Import, And Delete/Reset Rules

Docs that mention backup, export, import, restore, delete, reset, logout, uninstall, device transfer, or device loss need extra care.

- Do not describe an export as a full backup unless every included data class, restore path, and limitation is verified.
- Do not claim import or restore support unless a current user-facing import/restore flow exists and has been reviewed.
- Do not claim automatic cross-device sync, cloud backup, or account recovery unless it is implemented and disclosure-reviewed.
- Do not claim exported files are deleted by app-level delete/reset behavior unless the app actually controls and deletes those external files.
- Do not collapse logout, reset, delete-local-data, delete-account wording, app uninstall, and OS backup behavior into one broad "delete" claim.
- When behavior is unclear, say `Needs verification` and seed follow-on work instead of inventing a support answer.

## Medical, Nutrition, And Fitness Boundaries

Brunch Body documentation must not imply medical, clinical, nutrition, or training authority beyond what has been explicitly approved.

Do not claim that Brunch Body:

- diagnoses, treats, cures, or prevents medical conditions
- provides medical, mental health, nutrition, or individualized training advice
- replaces a qualified professional
- provides medical-grade, clinical-grade, or professionally reviewed calculations
- guarantees fitness, weight, nutrition, habit, recovery, or health outcomes
- is a medical device or regulated clinical product

Public docs may describe personal tracking, organization, journaling, planning, and user-entered information when supported by evidence. Safety language should stay general and should not become individualized advice.

## AI, Platform, Monetization, Backend, Cloud, And Sync Boundaries

Docs must not introduce current product behavior by implication.

- AI features, automated coaching, model processing, personalization, or AI data handling must be labeled future work unless implemented and reviewed in a dedicated AI lane.
- Desktop, tablet, web, wearable, or expanded platform availability must be labeled future work unless implemented and supported by release evidence.
- Monetization, subscriptions, purchases, ads, trials, or pricing must not be claimed unless product and store materials are in scope for that lane.
- Backend, cloud sync, account storage, remote backup, and cross-device recovery must not be described as current behavior unless live code, tests, privacy language, and store/disclosure materials all support the same claim.
- Do not use broad product language such as "always synced," "AI-powered," "secure cloud," "clinically guided," or "store-ready" as shorthand for future intent.

## Do Not Claim Unless Verified

Before any governed document claims one of the following, verify it against live behavior and the source-of-truth hierarchy:

- Brunch Body stores user data in a backend or cloud account.
- Brunch Body does not send any user data off-device.
- Brunch Body automatically syncs across devices.
- Brunch Body provides cloud backup, full backup, import, restore, or device recovery.
- Brunch Body deletes exported files, OS backups, shared files, or files outside app-managed storage.
- Brunch Body performs secure deletion or forensic deletion.
- Brunch Body has AI features, AI coaching, AI summaries, or off-device AI processing.
- Brunch Body supports desktop, tablet, web, wearable, or multi-platform behavior beyond the reviewed build.
- Brunch Body provides medical, nutrition, mental health, clinical, or individualized training advice.
- Brunch Body is HIPAA-compliant, clinically compliant, medical-grade, or professionally reviewed.
- Brunch Body is launch-ready, store-ready, disclosure-complete, or privacy-certified.
- Platform privacy labels, Google Play Data safety answers, App Store privacy details, or privacy-policy language are final and aligned.
- Release notes, screenshots, support docs, in-app copy, public docs, and store copy all describe the same behavior.

If verification is missing, use `planned`, `proposed`, `unknown`, `needs verification`, or `future work`.

## Documentation Change Checklist

Use this checklist before creating or editing a governed doc:

- Identify whether the doc is internal, public-facing, release-facing, privacy-facing, store-facing, or in-app copy.
- Confirm the lane allows edits to that surface.
- Classify behavior, data, privacy, AI, platform, medical, backup, export/import, and store claims using the claim model above.
- Check the source-of-truth hierarchy for each trust-sensitive claim.
- Use cautious public wording for observed behavior that is not release-certified.
- Mark unclear behavior as `Needs verification` or record it as follow-on work.
- Preserve the distinction between current behavior, project intent, and future roadmap.
- Do not edit adjacent public docs, disclosures, or app copy unless the lane explicitly allows it.
- Record contradictions as follow-on lane seeds when the lane does not allow fixing them.
- Run docs-only validation for docs-only lanes: `git diff --check` and `git status --short --untracked-files=all`.

## Reviewer Checklist

Reviewers should confirm:

- The diff touches only the approved documentation surface.
- The document does not create app behavior, privacy policy, legal terms, store copy, or medical guidance.
- Current-behavior claims are grounded in live app behavior, code, tests, or current architecture docs.
- Unverified behavior is labeled as planned, proposed, unknown, needs verification, or future work.
- Local-first/privacy-forward wording is cautious and does not become a permanent guarantee.
- Delete/reset/export/import/backup wording does not overstate app control or user recovery.
- AI, backend, cloud, sync, platform, desktop, monetization, medical, and store-readiness language is not introduced as current behavior.
- Public docs simplify without becoming stronger than internal evidence.
- Contradictions found outside the lane are seeded for follow-on work rather than fixed opportunistically.
- Validation and final worktree status match the lane.

## Stop Conditions

Stop and split the work into a later lane if:

- a doc change would alter privacy posture, disclosure language, deletion semantics, backup semantics, store claims, medical boundaries, AI scope, platform scope, monetization scope, or product behavior
- a reviewer cannot tell whether a claim is observed behavior, project intent, or future roadmap
- existing docs directly contradict live app behavior and the current lane does not allow editing them
- public wording needs legal, privacy, medical, store, or owner approval before it can be made stronger
- a docs lane becomes a release-readiness, privacy-policy, store-submission, product-design, or behavior-change lane
- verification requires running app flows or adding tests beyond the lane's docs-only validation scope

When a stop condition appears, leave a precise follow-on seed rather than widening the current lane.

## Maintenance Rule For Future Docs Lanes

Future docs lanes that add or change governed surfaces must check this governance artifact before editing. If a later lane intentionally changes governance rules, it must update this file in a lane that explicitly allows documentation-governance changes.

Every future governed doc lane should report:

- changed documentation surfaces
- claim categories used for trust-sensitive language
- source-of-truth evidence checked
- any `Needs verification` items added or preserved
- follow-on lane seeds for contradictions or deferred alignment work
- validation results and final worktree status

## Follow-On Lane Seeds

Known bounded follow-on candidates:

- `1.2.1.5` Public docs index / documentation map
- `1.2.1.6` Public docs consistency pass
- `1.2.2.x` In-app privacy/data copy alignment
- `1.4.x` Backup/export/import user guidance
- `1.9.x` Store disclosure documentation alignment

Additional follow-on seeds if contradictions are discovered in later reviews:

- Align delete/reset wording across app copy, public docs, release docs, privacy language, and store/disclosure materials.
- Align export wording across settings copy, public docs, release notes, and implementation evidence.
- Re-check local-first/privacy-forward public wording against the exact shipped build before release use.
