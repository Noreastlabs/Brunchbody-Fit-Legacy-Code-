# Permission and Access Transparency

## Status and Scope

This is an internal Brunch Body guidance artifact only. It is not a legal
privacy policy, not legal advice, not a store disclosure, not a platform
privacy submission, and not public user-facing copy.

This document is based on current observed app behavior and repo evidence. It
sets rules for future permission and access wording across in-app copy,
settings copy, onboarding notes, backup/export/import wording, public docs, and
store/disclosure preparation.

This lane changes no user experience. It does not change app behavior,
permissions, manifests, native config, storage behavior, export/import
behavior, privacy posture, legal policy, store materials, onboarding, settings,
source code, package files, lockfiles, tests, CI, backend behavior, cloud sync,
AI, monetization, or desktop behavior.

No docs or disclosures are updated by this lane. Future privacy, public-docs,
settings, onboarding, or store-disclosure lanes should use this artifact as
input only after validating the shipped behavior they describe.

## Evidence Basis

Evidence labels used in this document:

- `Observed repo evidence`: directly visible in current source, config, tests,
  or docs reviewed for this lane.
- `Inferred risk area`: a cautious conclusion from dependency presence,
  platform behavior, or adjacent implementation details that needs release
  verification before public use.
- `Unknown / follow-up`: not proven by the reviewed repo evidence and should not
  be claimed without a later validation lane.

Observed repo evidence:

- `package.json` includes local persistence and file/export-related packages,
  including `@react-native-async-storage/async-storage`, `react-native-mmkv`,
  `react-native-fs`, `react-native-scoped-storage`, `redux-persist`, and
  `xlsx`.
- `package.json` also includes `axios`, so the repo must not use blanket
  wording such as "no internet access" without a release-specific network
  review.
- Android main manifest currently declares `android.permission.INTERNET`,
  `android.permission.VIBRATE`, `android.permission.WAKE_LOCK`, and
  `android.permission.RECEIVE_BOOT_COMPLETED`.
- Android main manifest sets `android:allowBackup="false"` and
  `android:usesCleartextTraffic="false"`, with production network security
  config denying cleartext traffic.
- Android debug config permits cleartext only for local development endpoints
  such as localhost and emulator loopback addresses.
- iOS `Info.plist` includes App Transport Security settings with arbitrary
  loads disabled and local networking allowed.
- No camera, photo library, microphone, or location usage-description strings
  were observed in the reviewed iOS `Info.plist`.
- iOS `PrivacyInfo.xcprivacy` declares accessed API categories for UserDefaults,
  FileTimestamp, and SystemBootTime, declares tracking as false, and has an
  empty collected-data-types array.
- Current local persistence evidence includes Redux Persist backed by
  AsyncStorage, direct AsyncStorage keys, and MMKV-backed bundled plan data.
- Current export evidence includes selected journal export to an `.xlsx`
  workbook using `react-native-scoped-storage`, `react-native-fs`, and `xlsx`.
- The export code requests Android `WRITE_EXTERNAL_STORAGE` in the selected
  journal export path.
- No repo-observed import or restore flow was found in the reviewed app paths.
- Scoped source search did not find active `fetch(` or `axios` call sites in
  current app code, while Settings legal/support rows open external HTTPS URLs.

Inferred risk areas:

- Dependency presence can indicate capability, but it is not standalone proof
  that a permission, file access path, or network transfer is active at runtime.
- Platform backup, device-transfer, dependency-level network behavior, and
  native library behavior require release-specific review before public claims.
- The Android export permission/code/config relationship should be reviewed in
  a future implementation or disclosure lane; this artifact only records it as
  transparency input.

Unknown / follow-up:

- Whether any app-store questionnaire, public privacy statement, or platform
  disclosure remains accurate for a future release build.
- Whether operating-system backups, device-transfer tools, or user-selected
  cloud folders include Brunch Body app data or exported files.
- Whether future dependencies, native modules, or platform changes add new
  prompts, access paths, telemetry, analytics, network calls, import/restore
  behavior, or cloud behavior.

## Current Permission and Access Surface

Use cautious present-state wording when describing current surfaces. Do not turn
these observations into permanent product guarantees.

- Android OS permissions: current repo evidence shows manifest-declared
  internet, vibration, wake-lock, and boot-completed permissions. Future copy
  should explain only the permission being discussed and why the app needs it in
  the relevant context.
- Android export storage access: current export code checks and requests
  `WRITE_EXTERNAL_STORAGE` and uses scoped/document-tree file access to write a
  selected journal export. Describe this as export-related file access, not as
  broad device-file scanning.
- iOS permissions: reviewed `Info.plist` evidence did not show camera, photo,
  microphone, or location usage-description strings. Do not claim "no iOS
  permissions are used" unless native config, linked dependencies, and release
  behavior are reviewed for the shipped build.
- iOS required-reason APIs: current privacy manifest declares UserDefaults,
  FileTimestamp, and SystemBootTime accessed API categories. Treat these as
  disclosure-relevant platform access signals, not as user-facing feature copy
  by themselves.
- Local storage access: current app evidence includes AsyncStorage,
  redux-persist, direct AsyncStorage keys, and MMKV. Plain-English copy may say
  that working app data appears to be stored in local app-managed storage in the
  current app when verified for that surface.
- Export access: the current observed export surface is selected journal export
  to an Excel workbook (`.xlsx`). It is not a verified all-data export, backup,
  import, or restore system.
- Import access: no repo-observed import or restore flow was found. Future copy
  must not imply exported files can be imported back into the app unless a later
  implementation and verification lane adds that behavior.
- Network/off-device access: Android declares `INTERNET`, `axios` is installed,
  and Settings opens external HTTPS legal/support links. Scoped source search
  did not find active `fetch(` or `axios` call sites in current app code. Do not
  claim "no internet access" or "no off-device access" without a release-specific
  review across app code, native config, dependencies, and public links.

## User-Facing Language Rules

Future user-facing permission and access copy must be plain, narrow, and tied
to the user action or app surface that creates the access.

- Say what access is being requested or used.
- Say why the app needs it in that moment.
- Say what the user can do next, such as continue, cancel, choose a folder, or
  manage the exported file outside the app.
- Keep local-first language present-tense and evidence-based, such as "in the
  current app" or "based on current observed behavior."
- Treat fitness, nutrition, journal, supplement, profile, calendar, planning,
  and reflection data as potentially sensitive.
- Distinguish app-managed local data from exported files, copied files, shared
  files, uploaded files, platform backups, and user-selected storage locations.
- Do not use legal, compliance, security, medical, or store-readiness language
  unless the lane explicitly includes qualified review of that claim.

Acceptable patterns when verified for the target release:

- "Brunch Body is local-first in the current app."
- "Selected journal data can be exported as an Excel workbook (`.xlsx`)."
- "Exported files may contain sensitive personal information depending on what
  you choose to export."
- "After export, the file is outside Brunch Body's normal app-managed storage."
- "Delete local data does not remove files you exported, copied, shared,
  uploaded, or saved outside the app."
- "Before public privacy or store language is finalized, verify the shipped app
  behavior and align all disclosure surfaces."

## Permission Prompt Rules

Future OS permission prompts or prompt-adjacent copy must follow these rules:

- Explain the specific OS-level permission or picker access in plain English.
- Place explanation close to the user action that triggers the prompt.
- Avoid asking for permission before the user understands the feature that
  needs it.
- Do not imply access is broader or narrower than the platform actually grants.
- Do not hide user choice. If the user can cancel, defer, deny, or pick a
  different location, say so when the surrounding UX needs that context.
- Distinguish OS permission prompts from in-app confirmation, warning, success,
  and error modals. A Brunch Body modal is not the same thing as an Android or
  iOS permission prompt.
- If a permission is optional or only needed for export, say it is tied to that
  action instead of implying it is required for the whole app.
- If a future feature adds camera, photos, media, microphone, location,
  health-platform, notification, contacts, calendar, Bluetooth, sensor, or other
  sensitive permissions, create a dedicated review lane before shipping the
  copy.

## File, Backup, Export, and Import Access Rules

File and backup wording must be especially narrow because exported data can
leave app-managed storage.

- Describe current export as selected journal export to `.xlsx` only when that
  matches the verified build.
- Do not call the current export flow a full backup, complete export, restore
  system, import system, device-transfer feature, or cloud backup.
- Say exported files may contain sensitive personal information, including
  fitness, journal, nutrition, supplement, reflection, or profile-related
  information depending on the entries exported.
- Say exported files become user-managed once saved outside the app.
- Say Delete local data does not remove exported files, copied files, shared
  files, uploaded files, or files saved outside app-managed storage.
- Do not claim Brunch Body never accesses files while export or scoped storage
  access exists.
- Do not claim exported files are encrypted, anonymized, securely deleted, or
  protected from other apps unless a future lane verifies and approves that
  exact behavior.
- For future import or restore features, explain the selected source, the data
  being read, what the app will change, what will not be changed, and what users
  should check before proceeding.
- For future backup wording, distinguish Brunch Body-provided backup from
  operating-system backup, device-transfer tools, cloud folders selected by the
  user, and third-party apps used to store or share exported files.

## Local-First and Off-Device Access Rules

Local-first copy must describe current observed behavior without becoming a
guarantee that data can never leave the device.

- Prefer "current app," "current observed behavior," or "based on current repo
  evidence" when describing local-first behavior.
- Explain that working app data appears to live in local app-managed storage
  only when that is verified for the build and surface being described.
- Do not imply local storage is risk-free. Device access, exported files,
  platform backups, screenshots, shared folders, and user-selected cloud
  locations can still matter.
- Do not claim "no internet access" because Android declares `INTERNET`,
  `axios` is installed, legal/support links open HTTPS URLs, and dependency or
  future behavior must be reviewed before making that claim.
- Do not claim "no data leaves the device" unless export behavior, user sharing,
  legal/support links, platform backups, native dependencies, and release code
  have all been reviewed for that exact statement.
- If future backend sync, analytics, telemetry, AI, ads, push notifications,
  cloud backup, account recovery, platform health integrations, or third-party
  SDKs are added, privacy, permission, public docs, and store/disclosure
  language must be reviewed before release.

## Store and Disclosure Review Notes

This artifact is disclosure input, not disclosure approval.

Future store or disclosure lanes should:

- Verify native manifests, iOS plist files, privacy manifests, dependency
  behavior, app source, export/import behavior, network behavior, local storage,
  deletion/reset behavior, and public links for the target release build.
- Align in-app copy, public docs, support wording, privacy policy work, release
  notes, App Store privacy details, Google Play Data safety answers, and any
  platform-required privacy manifests.
- Treat dependency-level capabilities as signals for review, not automatic
  claims of runtime behavior.
- Preserve `Needs verification` wording when evidence is incomplete.
- Record any real permission/disclosure mismatch as a follow-on lane seed
  unless the current lane explicitly authorizes fixing it.
- Avoid claiming store readiness, legal compliance, privacy-policy completeness,
  or disclosure completeness from this document.

Docs and disclosures are not updated in this lane. Future disclosure lanes
should use this artifact as source material only after validating current
behavior against the build being submitted or published.

## Do Not Claim

Do not use these claims unless a future lane explicitly verifies and approves
the exact behavior for the shipped build:

- "We never access files."
- "Brunch Body has no file access."
- "No internet access."
- "No network access."
- "No permissions are used."
- "No OS prompts are used."
- "All data never leaves the device."
- "Your data can never leave your device."
- "Delete local data removes every copy."
- "Delete local data removes exported files."
- "Delete local data removes files from backups, cloud drives, shared folders,
  email, messages, or other apps."
- "Export is a full backup."
- "Export can be restored into the app."
- "Import is supported."
- "Cloud backup is available."
- "Cloud sync is available."
- "Cross-device sync is available."
- "Account recovery restores your Brunch Body data."
- "Everything is encrypted."
- "Exported files are encrypted."
- "Data is anonymized."
- "Secure deletion is guaranteed."
- "Store-ready."
- "Legally compliant."
- "Privacy-policy complete."
- "HIPAA compliant."
- "Clinical privacy compliant."
- "No analytics or telemetry."
- "No third-party access risk."
- "No dependency-level network behavior."
- "No platform backup behavior."

Also do not rely on internal implementation names such as `ExportToCSV` or
`DeleteAccount` as user-facing truth when current product copy and behavior use
narrower wording such as selected journal `.xlsx` export and Delete local data.

## Reviewer Checklist

Before approving future permission or access wording, confirm:

- The target lane is allowed to edit that surface.
- The wording is based on current observed app behavior for the release build.
- Observed evidence, inferred risk areas, and unknowns are separated.
- The copy explains what access is used, why it is needed, and when it occurs.
- OS permission prompts are not confused with in-app confirmation modals.
- Local-first wording does not imply a permanent guarantee or "never leaves
  device" claim.
- File/export wording says exported files are user-managed once saved outside
  app storage.
- Exported and backup files are treated as potentially sensitive.
- Delete wording does not promise deletion of exported files, copied files,
  shared files, uploaded files, platform backups, or other external copies.
- Import, restore, backup, sync, cloud, account recovery, and device-transfer
  behavior are not claimed unless implemented and verified.
- Internet/network wording accounts for Android `INTERNET`, installed network
  dependencies, external HTTPS links, and any dependency-level behavior.
- Native manifests, iOS plist files, privacy manifests, app code, and
  dependencies have been reviewed before saying a permission is unused.
- Store/disclosure wording is routed to a dedicated review lane before public
  use.
- Any mismatch is captured as follow-on work instead of being fixed outside the
  lane scope.

## Follow-On Lane Seeds

- Review Android export permission behavior against current Android platform
  requirements, manifest declarations, scoped-storage behavior, and user-facing
  export copy.
- Verify release-build network and dependency behavior before any public claim
  about internet access, off-device transfer, analytics, telemetry, or
  third-party services.
- Review platform backup and device-transfer behavior before public backup,
  delete, uninstall, or device-change wording is strengthened.
- Create a dedicated permission-copy lane if future features add camera, photo,
  media, microphone, location, health-platform, notification, contacts,
  Bluetooth, calendar, sensor, or other sensitive OS permissions.
- Create a dedicated import/restore transparency lane if Brunch Body later adds
  import, restore, full backup, device-transfer, or cloud backup behavior.
- Reconcile app copy, public docs, privacy policy work, and store/disclosure
  answers before any release submission that changes permissions, storage,
  export/import, network, backup, sync, or off-device behavior.
