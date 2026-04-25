# Transparency Copy Contract

## Classification

This docs-only lane is **Ready for Codex** because the parent
`1.2.2.1.1 Transparency Copy Contract` discussion decisions are resolved.
This document records those decisions as approved copy-contract inputs. It
does not reopen them.

This is a decision artifact, not an implementation lane. It does not change
app behavior, app source, routes, storage, deletion, export, backup/import,
restore, backend sync, privacy policy, Terms of Use, store disclosures, or
platform disclosures.

## Purpose

This contract defines the approved plain-English copy rules for Brunch Body's
in-app transparency surfaces before user-facing copy is changed one surface at
a time.

Future lanes should use this contract to keep Settings, Privacy & Data,
Delete local data, Export, Profile/Vitals, Onboarding, README/help docs,
privacy language, backup/deletion language, and future store/disclosure
language aligned with current app behavior.

Reusable wording patterns in this document do not replace screen-specific
copy review in later lanes.

## Source of Truth

Current repo-observed app behavior remains the source of truth. Observed app
files and live navigation behavior outrank older prose, public docs, release
notes, roadmap intent, and dormant source files.

Reference inputs reviewed for this contract:

- `docs/architecture/in-app-transparency-surfaces.md`
- `README.md`
- `docs/public/brunch-body-privacy-and-data.md`
- `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md`
- `docs/architecture/local-only-contract-closeout.md`

These referenced docs were present when this contract was created. If a future
lane finds that a referenced doc is missing or renamed, record that observation
in the lane output instead of creating or editing extra files outside that
lane's scope.

## Approved Decisions

The owner-approved copy decisions are:

- Main transparency label: `Privacy & Data`
- Destructive action language: `Delete local data`
- Export responsibility: explicitly warn that exported files may contain
  sensitive information and become user-managed once saved or shared outside
  the app.
- Legal boundary: in-app `Privacy & Data` copy is a plain-English explainer
  of current app behavior, not a legal Privacy Policy or Terms of Use rewrite.
- Profile/vitals helper copy: profile and vitals values are stored locally and
  used for in-app calculations/display only.

## Approved Wording Principles

### Present State Only

Copy must describe what the current app does now, not planned behavior.

Approved concept:

- `In the current app, your Brunch Body data is stored on this device.`

Avoid turning current behavior into a permanent promise. If future backend,
sync, AI, import/export, platform, permission, or deletion behavior changes,
the copy contract and affected public/support/disclosure language must be
reviewed again.

### Privacy & Data Label

Use `Privacy & Data` as the main user-facing transparency umbrella.

Use `local data` inside body copy when precision matters, especially for
device-local storage, export limitations, and delete behavior.

Avoid using `Data & Backup` as the main umbrella until backup/import/restore
behavior exists and is approved in a separate lane.

### Local-First / Device-Local Data

Approved concepts:

- `Your Brunch Body data is stored on this device in the current app.`
- `Profile, journal, workout, nutrition, calendar, todo, and planning data are
  saved in local app storage in the current build.`
- `Data continuity depends on this device's app storage unless a supported
  platform feature or future Brunch Body feature handles it separately.`

Use cautious present-state language. Do not claim that data can never leave the
device unless the shipped build, exports, permissions, platform behavior, and
disclosures have all been reviewed for that exact claim.

### No Current Brunch Body Cloud Sync Or Backup

Approved concepts:

- `The current app does not automatically sync your data to a Brunch Body cloud
  account.`
- `Brunch Body does not currently provide automatic Brunch Body cloud backup
  for device-local app data.`
- `The current local-only app path does not show backend persistence for
  user-generated app data.`

Use `no Brunch Body-provided cloud sync or automatic Brunch Body cloud backup`
instead of broad language about every possible OS-level backup mechanism.

Do not make claims about iCloud, Google backup, operating-system backups,
device-transfer tools, or platform-managed backups unless a later lane reviews
that behavior directly.

### Delete Local Data

Approved concepts:

- `Delete local data removes saved Brunch Body data from this device.`
- `Delete local data does not remove files you exported, copied, shared,
  uploaded, or saved outside the app.`
- `Starter plans included with Brunch Body may appear again after setup.`

Use `Delete local data` in user-facing copy. Internal identifiers such as
`DeleteAccount`, `DeleteAccountWrapper`, and `deleteAccount` are implementation
residue and must not drive user-facing wording.

Avoid implying account closure, server deletion, remote revocation, forensic
deletion, deletion from OS backups, or deletion from files outside
Brunch Body's app-managed storage.

### Export Responsibility

Approved concepts:

- `Exported files may contain personal fitness, journal, nutrition, weight,
  supplement, reflection, or profile-related information depending on the
  entries you export.`
- `Once exported, you are responsible for where the file is saved, copied,
  shared, uploaded, or deleted.`
- `Files saved outside the app are not removed by Delete local data.`
- `The current export feature is selected journal export and creates an Excel
  workbook (.xlsx).`

Do not call export a full backup, all-data export, import system, restore
system, cloud backup, or device-transfer feature unless that behavior is
implemented, verified, and approved in a separate lane.

Internal identifiers such as `ExportToCSV` are implementation residue. Current
user-facing copy should follow the verified behavior: selected journal export
to an `.xlsx` workbook.

### Profile And Vitals

Approved concepts:

- `These values are stored locally and used for in-app calculations and
  display.`
- `Saved on this device only.`
- `Used for local BMI and BMR calculations.`

Keep helper copy short and bounded. It may explain local calculations/display,
but it must not become medical, diagnostic, clinical nutrition, treatment,
individualized training, or guaranteed-accuracy copy.

### Legal / Policy Boundary

Approved concepts:

- `This screen is a plain-English explanation of current app behavior, not a
  legal privacy policy.`
- `Privacy Policy and Terms of Use changes require separate approval.`

In-app `Privacy & Data` copy may explain current behavior in plain English.
It must not rewrite or replace the legal Privacy Policy, Terms of Use, platform
privacy disclosures, store listing copy, or store data-safety answers.

### Tone

Use calm, direct, plain-English copy.

Prefer:

- honest limitations
- explicit user control
- clear distinctions between app-managed data and exported files
- short helper text close to the relevant action

Avoid:

- scare tactics
- dark patterns
- pressure-heavy trust language
- vague assurances
- broad guarantees

## Forbidden Wording Patterns

Do not use these patterns in user-facing transparency copy unless a later lane
explicitly changes behavior and approves the claim:

- `Delete account`
- `Delete your account`
- `Account deletion`
- `Securely backed up`
- `Automatically backed up`
- `Synced across devices`
- `Available on all your devices`
- `Stored in your account`
- `Stored in the cloud`
- `Cloud recovery`
- `Cloud restore`
- `Full backup`
- `Complete backup`
- `Restore your data`
- `Import your backup`
- `Recover your account`
- `Permanently deleted everywhere`
- `Deleted from all backups`
- `HIPAA compliant`
- `Clinical privacy compliant`
- `Medical record`
- `Diagnoses`
- `Treats`
- `Prevents`
- `Medical advice`
- `Guaranteed accurate`

Also do not reuse dormant or legacy strings without review, including:

- older onboarding study/data-sharing strings
- dormant account/email/password strings
- route or component names that imply accounts, CSV export, sync, backup,
  import, restore, legal approval, or medical claims beyond current behavior

## Explicit Non-Approvals

This contract does not approve:

- app source changes
- route changes
- user-facing screen copy changes
- delete/reset behavior changes
- export behavior changes
- import/restore/backup behavior
- backend sync
- new off-device transfer
- legal Privacy Policy changes
- Terms of Use changes
- store listing changes
- App Store or Google Play disclosure changes
- privacy-policy, legal, medical, or clinical compliance claims
- AI, monetization, desktop, platform-expansion, or broad Settings redesign work

## Follow-On Lane Use

The following lanes may use this contract as an input, but each lane still
needs its own bounded review and acceptance criteria:

- `1.2.2.1.2 Settings Landing Transparency Entry Point`
- `1.2.2.1.3 Privacy & Data Screen Present-State Rewrite`
- `1.2.2.1.4 Delete Local Data Transparency Copy`
- `1.2.2.1.5 Export Transparency Copy`
- `1.2.2.1.6 Profile and Vitals Data-use Helper Copy`
- `1.2.2.1.7 Onboarding Local-data Notice`
- `1.2.2.1.8 Cross-surface Truthfulness Review`

Later lanes should flag mismatches between app behavior, in-app copy,
README/help docs, privacy language, backup/deletion language, and
store/disclosure language. They should not hide or smooth over mismatches.
