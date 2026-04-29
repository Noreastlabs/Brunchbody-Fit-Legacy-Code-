# Support Response Template for External Access and Deletion Questions

Last reviewed: 2026-04-29

## Status and Scope

This is an internal-only support guidance artifact for `Lane 1.2.5.5 - Support Response Template for External Access/Deletion Questions`.

Status: Phase 1 internal support-response template.

This artifact is not legal advice, not a legal privacy policy, not store or platform disclosure language, not public support copy, and not approved public-facing language unless a later lane separately approves it for that surface.

This lane changes no app behavior, source code, tests, routes, UI copy, public docs, privacy policy, store metadata, platform disclosures, backend behavior, account behavior, sync behavior, support form, request portal, ticketing workflow, or legal/compliance workflow.

Use this artifact only to help internal reviewers draft narrow responses to questions about external access or deletion. Do not use it to create a formal request process, operational support workflow, legal request workflow, account workflow, backend workflow, or public commitment.

## Evidence Basis

This template is based on the resolved Phase 1 posture and public privacy/data alignment already recorded in:

- `docs/architecture/external-deletion-access-request-posture.md`
- `docs/public/brunch-body-privacy-and-data.md`
- `docs/architecture/phase-1-profile-only-account-model.md`
- `docs/architecture/delete-reset-archive-semantics-decision.md`
- `docs/architecture/delete-reset-archive-public-docs-disclosure-alignment.md`
- `docs/architecture/privacy-edge-case-communication.md`

The current Phase 1 posture is:

- Brunch Body app-managed data is local to the device.
- Brunch Body cannot remotely retrieve app-managed local data from a user's device.
- Brunch Body cannot remotely delete app-managed local data from a user's device.
- Users control app-managed local data through in-app controls on that device, including `Delete local data`.
- In-app export, where available, is the user-controlled way to create selected exported copies.
- Support/contact records, if any, are separate from app-managed local data.

Current shipped behavior remains the source of truth. If app behavior, storage behavior, export behavior, support handling, account behavior, backend behavior, privacy policy language, or store disclosure language changes, this template must be reviewed before reuse.

## Core Response Principles

Use these principles when adapting a support response:

- Keep the response local-first and device-scoped.
- Use the phrase `app-managed local data` when describing data controlled by the app on the user's device.
- Say `on this device` when describing the scope of `Delete local data`.
- Direct users to `Delete local data` for Brunch Body app-managed local data on the device.
- Direct users to in-app export where available for selected exportable data.
- Explain that exported, copied, shared, backed-up, or externally saved records are outside Brunch Body app-managed local storage.
- Treat support/contact records as separate from app-managed local data.
- Defer support/contact record handling to owner-approved guidance without promising an outcome.

Do not make the answer broader than the verified app behavior. Avoid legal, privacy-rights, platform, account, backend, cloud, recovery, or disclosure conclusions.

## Approved Response Templates

The templates below are internal starting points. Reviewers may tailor tone and context, but must preserve the boundaries in this artifact.

### Can you delete my data?

Brunch Body app-managed data in Phase 1 is local to the device where you use the app. Brunch Body cannot remotely delete app-managed local data from your device.

To clear Brunch Body app-managed local data on this device, use `Delete local data` in the app. That action is device-scoped and does not remove exported files, copied or shared files, screenshots, screen recordings, OS or device backups, cloud folders, platform-provider records, third-party destination records, or support/contact records.

### Can you send me a copy of my data?

Brunch Body cannot remotely retrieve app-managed local data from your device.

Where the app provides export for selected data, in-app export is the user-controlled way to create an exported copy. Current export behavior should be described only as export where available, not as a full access, backup, import, restore, or recovery system.

### I exported/shared/backed up my data. Can Brunch Body delete it?

No. Once data is exported, copied, shared, backed up, saved to a cloud folder, captured in a screenshot or screen recording, uploaded, or sent to another destination, that copy is outside Brunch Body app-managed local storage.

`Delete local data` clears Brunch Body app-managed local data on this device. It does not delete exported files, copied or shared files, screenshots, screen recordings, OS or device backups, cloud folders, platform-provider records, third-party destination records, or support/contact records.

### What about support emails or messages I sent you?

Support emails, messages, contact-form submissions, or other information voluntarily sent outside the app are separate from Brunch Body app-managed local data on your device.

Do not promise deletion, access, retention, timing, or handling outcomes for support/contact records unless owner-approved support/privacy guidance exists for the specific situation. If needed, defer the question for owner-approved handling.

### Do I need to delete an account?

For Phase 1 app-managed local data, Brunch Body does not have a user-facing Brunch Body cloud account or cloud profile to delete.

Use `Delete local data` to clear Brunch Body app-managed local data on this device. Do not describe this as account deletion, cloud deletion, backend deletion, password handling, or a login/logout action.

## Forbidden Claims

Do not claim or imply that Phase 1 has:

- account deletion
- cloud deletion
- backend deletion
- remote access to app-managed local data
- remote retrieval of app-managed local data
- remote deletion of app-managed local data
- remote export of app-managed local data
- a Brunch Body cloud account for app-managed local data
- a backend profile for app-managed local data
- cloud sync
- all-data export
- import, restore, recovery, or backup as an access path
- a formal request portal
- a rights portal
- a support intake workflow created by this artifact
- a ticketing workflow created by this artifact
- a legal request process created by this artifact
- a requirement to submit a legal request
- password, reset, login, or logout behavior tied to data deletion
- legal, compliance, privacy-policy, App Store, or Google Play approval from this artifact

Do not say that `Delete local data` deletes:

- exported files
- copied files
- shared files
- screenshots
- screen recordings
- OS backups
- device backups
- cloud folders
- platform-provider records
- third-party destination records
- support/contact records

## Support/Contact Records Boundary

Support/contact records are separate from Brunch Body app-managed local data. They may include support emails, contact messages, form submissions, or other voluntary communications sent to Brunch Body outside the app's local storage model.

Support/contact records must not be used to imply that Brunch Body can retrieve, inspect, export, or delete app-managed local data from a user's device.

Do not promise deletion, access, retention, timing, identity verification, or fulfillment outcomes for support/contact records in this template. Those questions require owner-approved handling outside this artifact.

## Escalation and Deferral

Use owner-approved deferral language when a question goes beyond this template.

Approved internal deferral pattern:

> Brunch Body app-managed local data is handled on your device through the app. Records you sent to Brunch Body separately, such as support or contact messages, are separate from app-managed local data and need separate owner-approved handling.

Escalate or defer when a question asks for:

- legal, privacy-rights, compliance, or jurisdiction-specific handling
- support/contact record deletion or access outcomes
- store disclosure, platform-provider, payment-provider, or third-party destination handling
- cloud, backend, account, sync, import, restore, recovery, or all-data export behavior
- a public statement, policy statement, or launch-facing commitment

## Non-Goals

This artifact does not create, approve, or imply:

- public support copy
- privacy policy language
- store or platform disclosure language
- legal advice or compliance approval
- a legal request process
- a formal external request workflow
- a rights portal
- a support form
- a support intake workflow
- a ticketing workflow
- account deletion
- cloud deletion
- backend deletion
- remote access, remote retrieval, or remote deletion
- cloud sync, cloud backup, import, restore, recovery, or all-data export
- user accounts, login, logout, password handling, or authentication behavior
- support/contact record operational procedures
- changes to `Delete local data` behavior
- changes to in-app Privacy & Data copy
- changes to public docs, privacy policy, or store disclosures

## Validation Notes

Validation for this docs-only lane:

```bash
git diff --check
git status --short --untracked-files=all
rg -n "account deletion|cloud deletion|remote deletion|remote retrieval|request portal|legal request|rights portal|backend profile|cloud account|login|logout|password|reset" docs/architecture/support-response-template-external-access-deletion.md
```

Expected file-change boundary:

- Only `docs/architecture/support-response-template-external-access-deletion.md` is added by this lane.
- No app source, tests, public docs, privacy policy files, store/disclosure files, support forms, routes, backend/account/auth files, package files, lockfiles, or native manifests are changed.
