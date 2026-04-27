# Retention and History Semantics Decision

## Status and Scope

Lane: `1.2.3.4.1 Retention and History Semantics Decision`

Status: owner-approved semantic baseline.

This is an internal architecture decision record for Brunch Body retention, history, deletion, reset, archive, export, backup, restore, account-deletion, and local-data vocabulary.

This lane changes no app behavior, no user-facing copy, no tests, no public docs, no README content, no privacy language, no store disclosure language, no export behavior, no import behavior, no storage behavior, no archive behavior, no backend behavior, no cloud deletion behavior, and no off-device transfer behavior.

What changed: one internal architecture decision record only.

What users experience: no user-facing change.

Docs/disclosures required: no public docs, privacy language, store disclosures, platform disclosures, support text, release notes, or README content are changed in this lane. Later public docs and disclosure changes must wait until current repo behavior is verified by the follow-on inventory lane.

Brunch Body remains Phase 1 mobile-first, local-first, and privacy-forward for this decision. This record preserves that posture by keeping retention and deletion language narrow, current-state, device-scoped, and separate from backup, export, import, archive, cloud, account, and store-disclosure claims.

## Decision Summary

- Primary destructive data-control vocabulary: `Delete local data`.
- `Delete local data` means clearing Brunch Body app-managed local data on this device.
- `Delete local data` must not claim to delete exported files, copied files, shared files, uploaded files, operating-system backups, device-transfer copies, cloud-drive copies, or files stored outside app-managed storage.
- `Delete account` is forbidden unless a future verified lane introduces a real backend account deletion flow.
- `Reset` is restricted in user-facing copy and should be avoided unless tied to a specific verified control.
- `Archive` is not current behavior and is forbidden in current-state user-facing copy.
- `Archive` may appear only in clearly labeled future-roadmap or internal planning text.
- Exported files should be described as `exported copy` by default.
- `Backup` is restricted and may be used only with a clear limitation that exported files are user-managed and restore is not guaranteed unless implemented.
- Public/user-facing retention statements must describe current behavior only.
- Future behavior may appear only in internal architecture docs with explicit `future` or `not implemented` labels.

## Approved Vocabulary

| Term | Approved current meaning | User-facing status | Rules |
| --- | --- | --- | --- |
| `retained` | Stored locally by the app until changed, cleared, or removed by platform/app action. | Allowed | Must specify local/device scope. Do not imply indefinite storage, cloud retention, or universal deletion guarantees. |
| `history` | User-created or app-recorded past entries within a specific domain. | Allowed with qualifier | Qualify the domain, such as journal history, workout history, or calendar history. Do not imply every domain behaves the same way. |
| `Delete local data` | Clear app-managed local data on this device. | Preferred | Must not imply exported files, copied files, shared files, uploaded files, platform backups, cloud copies, or external storage locations are deleted. |
| `clear local data` | Plain-language equivalent of clearing app-managed local data when the object is explicit. | Allowed | Prefer `Delete local data` for the primary destructive control. Avoid vague `clear everything`. |
| `reset` / `Reset app` | Avoid unless tied to a specific verified control. | Restricted | Do not equate reset with delete-local-data unless a future audit proves the behavior is identical and a lane approves that wording. Internal `RESET_APP` naming is not user-facing product language. |
| `Delete account` | Backend account deletion, only if a real backend account deletion flow exists. | Forbidden for current local-first app copy | Do not use for the current local-data control. Internal route/action/component names must not define user-facing claims. |
| `archive` | Not current behavior unless verified by a future domain-specific lane. | Forbidden for current-state copy | May appear in internal roadmap/future sections only when clearly labeled as not current behavior. |
| `exported copy` | File created outside the app-managed storage lifecycle. | Preferred | Explain that the user manages the file after export. |
| `backup` | A separate recovery-oriented copy only when that behavior is implemented and verified. | Restricted | If used for exported files, pair it with the limitation that exported files are user-managed and Brunch Body does not guarantee automatic restore unless a restore feature exists. |
| `restore` / `import` | Bringing data back into the app through an implemented flow. | Restricted | Do not imply support unless implemented, tested, and verified. |
| `cloud backup` / `cloud sync` | Backend or platform-mediated off-device continuity. | Restricted | Do not claim unless implemented, verified, and disclosure-reviewed. |

## Interface and Copy Contract

No public API, schema, storage, reducer, route, navigation, export, import, restore, backup, sync, or account-deletion changes are approved by this lane.

Future implementation, Settings, confirmation, docs, README, privacy, public guidance, architecture, test, store, and release lanes must treat this decision as a vocabulary contract:

- Use current behavior as the source for user-facing and disclosure-adjacent claims.
- Use `Delete local data` for the strongest current local destructive action.
- Treat exported files as user-managed copies once they are outside app-managed storage.
- Keep `history` domain-qualified until each surface is inventoried.
- Keep `retained` local/device-scoped unless future backend behavior is implemented and verified.
- Treat restore, import, cloud backup, cloud sync, backend account deletion, and global archive as disallowed claims unless future lanes implement and verify them.
- Do not let internal names such as `RESET_APP`, `DeleteAccount`, `deleteAccount`, or route names define public product language.

## Boundary Rules

### Local Deletion

`Delete local data` may only describe the app-local deletion boundary. It must not say or imply deletion from exported files, copied files, shared files, uploaded files, operating-system backups, device-transfer tools, cloud-drive folders, another app, or any storage location outside Brunch Body app-managed storage.

If future behavior broadens deletion beyond app-managed local data, that work requires a separate implementation lane, test lane, and disclosure review.

### Reset

`Reset` must not be used as a synonym for local data deletion unless a future lane verifies that a specific user-facing reset control has exactly the same behavior and owner approval explicitly allows that wording.

If reset means a narrower action, such as preferences-only reset, credential reset, or internal reducer reset, name the specific behavior instead of using broad reset language.

### Archive

Archive is not approved current behavior. It must not be used in current-state Settings copy, confirmation dialogs, public docs, privacy-adjacent notes, store notes, release notes, or support language.

A future archive lane must define the domain, data class, visibility, recoverability, export behavior, deletion relationship, retention effect, and interaction with Delete local data before any archive wording or behavior is introduced.

### Exported Copies and Backups

An exported file should be described as an `exported copy`. After export, the file is outside Brunch Body app-managed storage, and the user is responsible for where it is saved, copied, shared, uploaded, backed up, moved, retained, restored, or deleted.

Do not call the current export flow a full backup, restore system, import system, account recovery system, cloud backup, or device-transfer feature unless a future lane implements and verifies that behavior.

### Bundled Starter Content

Bundled starter content that ships with Brunch Body may appear again after local data deletion if verified by current behavior. Describe that as app-provided starter content, not retained user data and not restored user data.

## Compatibility Terms

These terms remain separate from the approved local-data vocabulary:

- `Log out`: session or auth-state behavior only when a live control is verified; it does not mean local data deletion.
- `Reset password`: credential behavior only when a live control is verified; it does not mean local data deletion.
- `Uninstall`: platform behavior outside Brunch Body's direct control; do not equate it with in-app Delete local data without platform-specific verification.
- `Operating-system backup` and `device transfer`: platform behavior outside this decision; do not claim inclusion, exclusion, deletion, or restore behavior without release-specific verification.

## Source-of-Truth Order

Future public claims must follow this order:

1. Live app behavior in the build being described.
2. Current source code and tests.
3. Architecture docs and storage inventories.
4. Current public docs.
5. Roadmap or future intent.

Roadmap or future intent must never override current behavior for Settings copy, confirmation copy, README/help docs, public guidance, privacy/disclosure-adjacent language, store notes, or release notes.

## Follow-On Validation

Future lanes must verify:

- Settings and confirmation copy do not use `Delete account`, vague `reset`, or current-state `archive`.
- Public docs distinguish app-managed local data from exported, copied, shared, uploaded, backed up, moved, or externally saved files.
- Export language does not imply full backup, import, restore, account recovery, or automatic recovery.
- Delete-local-data language does not imply deletion of exported files, operating-system backups, cloud folders, shared files, or external copies.
- Current behavior is inventoried per domain before `history` language is generalized.
- Any use of `backup` includes the user-managed exported-copy limitation unless a true backup/restore flow exists.

The next lane may proceed as `1.2.3.4.2 Present-State Retention Surface Inventory`.

## Acceptance Notes

This decision gate is complete because this record states:

- owner approval for the retention and history semantic baseline
- no behavior, copy, tests, public docs, README content, privacy language, store disclosures, export/import behavior, or storage behavior changed
- `Delete local data` is the preferred primary destructive data-control phrase
- `Delete account` is forbidden unless a real backend account deletion flow exists
- `Reset` is restricted and avoided in user-facing copy unless tied to a verified control
- `Archive` is not current behavior and is forbidden in current-state user-facing copy
- `exported copy` is the preferred exported-file phrase
- `Backup` is restricted and must not imply restore guarantees
- public/user-facing retention statements are current-state only
- follow-on lanes can proceed without guessing at retention vocabulary

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
