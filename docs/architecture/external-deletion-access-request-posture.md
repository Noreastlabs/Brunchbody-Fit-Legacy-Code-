# External Deletion and Access Request Posture

Last reviewed: 2026-04-29

## Status and Scope

This is the internal posture artifact for `Lane 1.2.5.3 - External Deletion / Access Requests`.

Status: Phase 1 lightweight guidance posture.

This artifact is not a legal privacy policy, not legal advice, not a public help page, not store-submission language, not a support-script implementation, and not a behavior change. It records how Brunch Body should reason about external deletion and access questions for the current local-first, profile-only Phase 1 app.

This lane changes no app behavior, source code, tests, routes, UI copy, public docs, privacy policy, store metadata, platform disclosures, backend behavior, account behavior, sync behavior, support form, request portal, or legal/compliance workflow.

What changed in this lane: one internal documentation artifact only.

What users experience: no user-facing change.

Docs/disclosures required now: none. Any later public docs, in-app Privacy & Data copy, support template, privacy policy wording, App Store privacy detail, Google Play Data safety wording, or store listing language must be handled by a separate lane after owner and privacy/legal review.

## Evidence Basis

Current repo evidence and prior internal decisions support this posture:

- `docs/architecture/phase-1-profile-only-account-model.md` records that Brunch Body Phase 1 has no user-facing account model. The approved model is a device-local `Profile`, and `Delete local data` is the canonical destructive local-data action.
- `docs/architecture/delete-reset-archive-semantics-decision.md` records that `Delete local data` means clearing Brunch Body app-managed local data on this device and must not imply exported-file, copied-file, shared-file, backup, cloud, or backend deletion.
- `docs/architecture/delete-reset-archive-public-docs-disclosure-alignment.md` records public-doc alignment rules for Delete local data and explicitly defers cloud deletion, account deletion, password reset, backup, restore, import, and Archive claims.
- `docs/architecture/privacy-edge-case-communication.md` records that support and tester communication should answer narrowly and avoid privacy guarantees broader than verified behavior.
- `docs/architecture/app-store-privacy-disclosure-prep.md` and `docs/architecture/google-play-data-safety-and-deletion-prep.md` treat local app storage as distinct from developer-held off-device data and keep final platform answers deferred to owner/privacy/legal review.
- Current in-app `Privacy & Data` and `Delete local data` copy describe local-first storage, no automatic Brunch Body cloud sync or cloud backup, exported-file responsibility, and device-scoped local deletion.

This artifact relies on those records as supporting context. Current shipped behavior remains the source of truth for any future public, support, legal, privacy, or store-facing language.

## Decision Summary

Brunch Body Phase 1 should use lightweight external deletion/access guidance.

Brunch Body should not create a formal external request workflow in Phase 1 unless a later lane introduces accounts, backend data, developer-held off-device user records, or a legal/compliance process that requires it.

For app-managed local data:

- Brunch Body cannot remotely retrieve app-managed local data from a user's device.
- Brunch Body cannot remotely delete app-managed local data from a user's device.
- Users control app-managed local data through the app and device.
- `Delete local data` is the current in-app destructive action for app-managed local data on that device.
- In-app export, where available, is the current user-controlled way to create selected exported copies.

For support/contact records:

- Support emails, contact-form submissions, or other information voluntarily sent to Brunch Body are separate from app-managed local data.
- Those records should be handled only as Brunch Body-controlled support/contact records if they exist and are actually controlled by Brunch Body.
- Support/contact records must not be used to imply that Brunch Body can access or delete in-app local data on a user's device.

## Data Categories

| Category | Phase 1 treatment | External deletion/access posture |
| --- | --- | --- |
| App-managed local data | Brunch Body working app data stored in app-managed local storage on the device. This can include profile, vitals, journal, fitness, nutrition, calendar, todo, theme, and other app-managed local data depending on feature use. | Controlled through the app/device. Brunch Body cannot remotely inspect, retrieve, export, or delete it. Users may use `Delete local data` on the device and export controls where available. |
| Exported files and user-managed copies | Files or copies outside Brunch Body app-managed storage, including exported workbooks, copied files, shared files, uploads, screenshots, screen recordings, cloud-folder files, and externally saved copies. | Outside `Delete local data` and outside Brunch Body app-managed storage. Users manage these copies wherever they were saved or shared. |
| Operating-system, platform, and provider records | OS backups, device-transfer copies, platform account data, App Store or Google Play records, cloud-device backups, cloud-drive records, and third-party destination records. | Outside Brunch Body's app-managed local delete action. Do not claim inclusion, exclusion, access, restore, or deletion unless a release-specific lane verifies the platform behavior and owner/privacy/legal review approves the wording. |
| Support/contact records | Emails, contact-form submissions, or other voluntary communications sent to Brunch Body outside the app's local storage model. | Separate from app-managed local data. If Brunch Body controls these records, they may need a separate support/privacy process. This artifact does not create that process. |

## Approved Internal Response Principles

When asked externally to delete app data, the Phase 1 internal posture is:

- Brunch Body Phase 1 does not have a Brunch Body cloud account or cloud profile for app-managed local data.
- Brunch Body cannot remotely delete app-managed local data from a user's device.
- The current user-controlled app action is `Delete local data`, which clears Brunch Body app-managed local data on that device.
- `Delete local data` does not remove exported files, copied files, shared files, uploaded files, screenshots, screen recordings, OS backups, cloud folders, platform-provider records, support emails, or other records outside app-managed local storage.

When asked externally to access app data, the Phase 1 internal posture is:

- Brunch Body cannot remotely retrieve app-managed local data from a user's device.
- If the app provides export for a data class, the user can use the in-app export control where available.
- Current export behavior must be described narrowly. Do not imply all-data export, backup, restore, import, account recovery, or cloud access unless a future lane implements and verifies that behavior.

When asked about support/contact records, the Phase 1 internal posture is:

- Support/contact records are separate from app-managed local data.
- A response may distinguish between local app data on the user's device and information the user voluntarily sent to Brunch Body.
- Any deletion/access handling for support/contact records needs a separate support/privacy process and privacy/legal review before it becomes public or operational policy.

## Forbidden Claims

Do not claim or imply that Phase 1 has:

- user-facing Brunch Body accounts
- a Brunch Body cloud profile
- backend sync
- remote operator access to app-managed local data
- remote export of app-managed local data
- remote deletion of app-managed local data
- account deletion
- password reset as part of data deletion
- cloud deletion
- server-side local-data deletion
- all-data export
- import or restore from exported files
- automatic Brunch Body cloud backup
- guaranteed device migration or cross-device continuity
- a formal external deletion/access request portal
- legal, compliance, privacy-policy, App Store, or Google Play approval from this artifact

Do not say that `Delete local data` deletes:

- exported files
- copied or shared files
- uploaded files
- screenshots or screen recordings
- files saved in another app or folder
- OS backups
- device-transfer copies
- cloud backups or cloud-drive copies
- App Store, Google Play, payment, platform-provider, or third-party records
- support emails or contact records outside app-managed local storage

## Future Lane Guidance

This artifact may seed later lanes, but each later lane must be scoped separately:

- Internal support-response template: may draft response language for support reviewers, but must keep app-managed local data separate from support/contact records.
- Public docs update: may explain external deletion/access limits to users, but must not imply remote access, account deletion, backend deletion, or formal request intake.
- In-app Privacy & Data update: may add concise local-first external-request clarification if UX and privacy reviewers approve it.
- Store/disclosure prep update: may use this artifact as supporting context, but final App Store and Google Play answers require release-specific evidence and owner/privacy/legal review.
- Future account/backend lane: must reopen deletion, access, export, portability, support, privacy, security, migration, and disclosure decisions before implementation or public claims.

## Validation for This Docs-Only Lane

Required validation:

```bash
git diff --check
git status --short --untracked-files=all
rg -n "remote delete|remotely delete|remote retrieve|remotely retrieve|account deletion|cloud deletion|formal external|request portal|exported files|OS backups|support/contact" docs/architecture/external-deletion-access-request-posture.md
```

Expected file-change boundary:

- Only `docs/architecture/external-deletion-access-request-posture.md` is added or changed by this lane.
- No app source, tests, public docs, README, privacy policy, store/disclosure files, package files, lockfiles, native manifests, support forms, request portals, routes, backend code, or UI copy are changed.

## Non-Approvals

This artifact does not approve:

- accounts or authentication
- backend profile storage
- backend deletion
- backend access/export
- cloud sync
- cloud backup
- account deletion
- password reset
- all-data export
- import or restore
- device migration
- formal legal/compliance request intake
- support/contact record operational procedures
- public privacy policy language
- public help copy
- in-app copy
- App Store or Google Play submission answers
- legal, privacy, compliance, store, or launch readiness
