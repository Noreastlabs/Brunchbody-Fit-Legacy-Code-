# Delete / Reset / Archive Semantics Decision

## Status and Scope

This is an internal decision-gate artifact for Brunch Body delete, reset, logout, reset-password, and archive semantics.

This lane changes no app behavior, no user-facing copy, no tests, no public docs, no README content, no privacy language, no store disclosure language, no export behavior, no import behavior, no storage behavior, no archive behavior, no backend behavior, no cloud deletion behavior, and no off-device transfer behavior.

What changed: one internal architecture decision record only.

What users experience: no user-facing change.

Docs/disclosures required: no public docs, privacy language, store disclosures, platform disclosures, support text, release notes, or README content are changed in this lane. Later public docs and disclosure changes must wait until current repo behavior is verified by the follow-on audit lane.

Brunch Body remains mobile-first, local-first, and privacy-forward for this decision. This record preserves that posture by keeping destructive-control language narrow, evidence-bound, and separate from backup, export, import, archive, cloud, account, and store-disclosure claims.

## Evidence Basis

This record is a product-semantics decision, not a new behavior audit. It relies on existing architecture guidance and current repo context that already distinguish local deletion, reset behavior, logout behavior, exported files, and bundled starter-plan reseeding.

Existing context includes:

- `docs/architecture/privacy-messaging-and-trust-language.md` says delete/reset language must distinguish local app-managed data from exported files, copied files, shared files, operating-system backups, device-transfer behavior, and storage locations outside the app.
- `docs/architecture/data-export-and-portability-controls.md` says exported files outside app-managed storage must be treated as user-managed and outside Delete local data control.
- `docs/architecture/settings-ia-control-surfaces.md` classifies `Delete local data` as the current destructive local-data control and keeps backup, import, restore, sync, cloud account, and legacy account/password controls gated unless separately verified.
- `docs/architecture/local-only-contract-closeout.md` records `Delete local data` as the user-facing destructive action exposed in the live Phase 1 settings surface and treats internal `DeleteAccount` naming as implementation residue.
- `docs/architecture/storage-contract-matrix.md` and related storage docs record that bundled Brunch Body plans may be re-seeded after a local clear.

This decision record does not itself prove every current screen, route, reducer, storage key, or archive-like surface. The next audit lane must verify current behavior before any implementation, copy, test, public-doc, privacy, or disclosure lane relies on it.

## Decision Summary

- Primary destructive data-control vocabulary: `Delete local data`.
- `Delete local data` means Brunch Body app-local data stored by the app on this device.
- `Delete local data` does not claim to delete exported files, copied files, shared files, uploaded files, operating-system backups, device-transfer copies, cloud-drive copies, or files stored outside app-managed storage.
- `Reset app` is not preferred user-facing vocabulary unless a future verified lane defines it as equivalent to `Delete local data`.
- Internal names such as `RESET_APP`, `DeleteAccount`, and `deleteAccount` are implementation vocabulary and must not define user-facing product claims.
- `Log out` and `Reset password` are separate from local data deletion.
- `Archive` is not a global Phase 1 control and is not implementation-ready until audited.
- Bundled starter content that ships with Brunch Body may appear again after local deletion or reset; that content is app-provided starter content, not restored user data.
- Public docs, privacy language, store disclosures, platform disclosures, and support language must not be updated from intent alone. They must wait for repo behavior verification.

## Canonical Definitions

| Term | Canonical meaning | Product boundary |
| --- | --- | --- |
| `Delete local data` | Clears Brunch Body app-local data stored by the app on this device. | Does not claim cloud deletion, account deletion, exported-file deletion, OS-backup deletion, device-transfer deletion, or deletion of files outside app-managed storage. |
| `Reset app` | Avoid as user-facing vocabulary unless a future verified lane intentionally defines it as equivalent to `Delete local data`. | Internal `RESET_APP` behavior is not enough to make `Reset app` a public label. If a future reset is narrower, such as preferences-only reset, it must be named and scoped separately. |
| `Log out` | Ends the current signed-in or local session/auth state when such a control is live. | Does not mean all Brunch Body local data is deleted unless a future audit and implementation lane prove that exact behavior. |
| `Reset password` | Changes, clears, or resets authentication credentials only when such a control is live. | Does not delete app-local Brunch Body data, exported files, starter content, or other user content. |
| `Archive` | A possible domain-specific future behavior or existing archive-like behavior to be audited. | Not a global Phase 1 control and not ready for implementation, copy, docs, tests, or disclosures until the repo audit defines the affected domain, data class, visibility, recoverability, and deletion relationship. |

## Boundary Rules

### Exported Files

`Delete local data` may only claim the app-local deletion boundary. Once a file is exported, copied, shared, uploaded, backed up, moved, saved through a system picker, stored in a cloud drive, or otherwise placed outside Brunch Body app-managed storage, that file is outside the app-local deletion guarantee.

Future copy, docs, tests, and disclosures must not say or imply that Brunch Body can delete exported files everywhere. If exported-file deletion is desired in a later release, it requires a separate platform/filesystem capability review, implementation lane, tests, and disclosure review.

### Bundled Starter Content

Bundled starter content may be included with Brunch Body and may be recreated or re-seeded after local data deletion or reset. That content must be described as app-provided starter content, not retained user data and not restored user data.

Future user-facing language may say that starter plans or starter content included with Brunch Body may appear again after setup if the audited behavior supports that claim.

### Archive

Archive must not be treated as one global cross-app feature until audited. A future archive lane must define the domain before implementation, such as journal entries, workouts, meals, todos, plans, profile history, or another specific record type.

Any archive-like behavior must define:

- whether archived records remain stored locally
- whether archived records are hidden, read-only, recoverable, exported, searchable, or included in summaries
- whether archive affects deletion, reset, backup, export, import, or privacy language
- what users experience when they delete local data after archiving something

### Docs and Disclosures

Later public docs, privacy language, store disclosures, platform disclosures, support language, and release notes must wait for repo behavior verification. They may not be updated solely from this decision record.

The source-of-truth order for future public claims remains:

1. Live app behavior in the build being described.
2. Current source code and tests.
3. Architecture docs and storage inventories.
4. Current public docs.
5. Roadmap or future intent.

## Follow-On Lanes

- `1.2.3.3.1 Current-State Audit of Delete, Reset, and Archive Surfaces`
- `1.2.3.3.2 Delete Local Data Copy and Confirmation Clarity`
- `1.2.3.3.3 Delete Local Data Execution Boundary Tests`
- `1.2.3.3.4 Reset Password vs. Reset App Language Separation`
- `1.2.3.3.5 Archive Control Discovery and Deferral Rule`
- `1.2.3.3.7 Public Docs and Disclosure Alignment`

The next Codex-ready lane is `1.2.3.3.1 Current-State Audit of Delete, Reset, and Archive Surfaces`.

## Acceptance Notes

This decision gate is complete when this record exists and states:

- no behavior, copy, tests, public docs, README content, privacy language, store disclosures, export/import behavior, or storage behavior changed
- `Delete local data`, `Reset app`, `Log out`, `Reset password`, and `Archive` are defined
- exported files are outside the app-local deletion guarantee once created, shared, moved, backed up, uploaded, or stored externally
- bundled starter content may reappear as app-provided content, not restored user data
- archive is not implementation-ready until audited
- later public docs and disclosure changes must wait for repo behavior verification
- the next Codex-ready lane is `1.2.3.3.1 Current-State Audit of Delete, Reset, and Archive Surfaces`

## Non-Approvals

This record does not approve:

- app behavior changes
- user-facing copy changes
- test changes
- README or public-doc changes
- privacy-policy changes
- store or platform disclosure changes
- export, import, restore, backup, sync, account, or cloud behavior
- backend deletion behavior
- operating-system backup or device-transfer claims
- archive implementation
- broad Settings redesign
- legal, medical, clinical, HIPAA, launch-readiness, or store-readiness claims
