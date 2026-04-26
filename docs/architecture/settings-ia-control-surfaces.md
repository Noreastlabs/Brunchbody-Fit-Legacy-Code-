# Settings IA for Control Surfaces

## Status and Scope

This is an internal Brunch Body architecture guidance artifact for Settings information architecture. It maps where user-facing controls should live, how they should be grouped, which controls are current versus planned or gated, and which follow-on lanes should implement or align each surface.

This document does not implement settings UI, change navigation, change app behavior, change data handling, change privacy posture, update public docs, create store or disclosure language, add controls, add storage keys, change reducers or thunks, change deletion/reset semantics, change backup/export/import behavior, change permission prompts, add backend sync, add AI behavior, add desktop support, or add monetization behavior.

## Evidence Basis

This IA must remain grounded in observed app behavior and existing project docs. A control must not be labeled `current` unless this document records a repo evidence note, such as a source file path, route/screen name, or observed behavior note. If evidence is incomplete, runtime reachability is unclear, or behavior is only inferred, label the control `unknown`, `planned`, or `gated`, not `current`.

Evidence inputs reviewed for this lane:

- `src/navigation/SettingsNavigation.js`
- `src/navigation/routeNames.js`
- `src/screens/setting/pages/Setting/Setting.js`
- `src/screens/setting/components/Setting.js`
- `src/screens/setting/pages/MyProfile/MyProfile.js`
- `src/screens/setting/components/My Profile/MyProfile.js`
- `src/screens/setting/pages/MyProfile/MyVitals.js`
- `src/screens/setting/components/My Profile/MyVitals.js`
- `src/screens/setting/pages/MyProfile/DeleteAccount.js`
- `src/screens/setting/components/My Profile/DeleteAccount.js`
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js`
- `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js`
- `src/screens/setting/components/Abbrevations/Abbrevations.js`
- `src/screens/setting/components/Tutorials/Tutorials.js`
- `docs/architecture/in-app-transparency-surfaces.md`
- `docs/architecture/privacy-messaging-and-trust-language.md`
- `docs/architecture/permission-and-access-transparency.md`
- `docs/architecture/transparency-copy-contract.md`
- `docs/architecture/documentation-governance.md`
- `docs/architecture/local-only-contract-closeout.md`

Legacy or dormant files may be documented as repo evidence, but they must not be treated as live user controls unless they are reachable in the current app. Use `unknown` when a row is visible in code but its runtime reachability or user-facing behavior is unclear.

## Settings IA Principles

- User controls should be easy to find from the Settings landing surface.
- Privacy and data controls should not be buried under vague account, legal, or help labels.
- Destructive controls should be calm, explicit, and recoverability-aware.
- Backup, export, and import controls should clearly explain user responsibility and limits.
- Settings should not imply cloud sync, account-backed restore, automatic backup, or off-device storage unless those behaviors are implemented and verified.
- Future controls should be grouped in predictable locations without claiming shipped behavior.
- Internal implementation names such as `DeleteAccount` or `ExportToCSV` should not drive user-facing IA labels when current copy and behavior are narrower.
- Trust-sensitive controls should preserve the source-of-truth order from existing governance docs: live app behavior and code first, then tests, architecture docs, public docs, and roadmap intent.

## Control Surface Map

| Group | Control name | User purpose | Status | Evidence note | Trust sensitivity | Implementation owner / follow-on lane | Disclosure / doc impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Profile and App Preferences | View and edit profile | Let the user review profile summary values and reach editable vitals/profile details. | current | Settings row `View and edit profile` navigates to `SETTINGS_ROUTES.MY_PROFILE` in `src/screens/setting/pages/Setting/Setting.js`; stack route registered in `src/navigation/SettingsNavigation.js`. | high | Maintain in current Settings; future profile copy lane. | Keep local storage and calculation wording aligned with Privacy & Data copy. |
| Profile and App Preferences | Edit nickname and vitals | Let the user edit nickname, date of birth, gender, and height used for in-app display/calculations. | current | `src/screens/setting/components/My Profile/MyVitals.js` renders nickname, date of birth, gender, height, and `Saved on this device only...`; `src/screens/setting/pages/MyProfile/MyVitals.js` saves through profile actions. | high | Future profile/vitals UX and copy lane. | Do not imply medical, diagnostic, cloud account, or server profile behavior. |
| Profile and App Preferences | Profile summary values | Show current weight, BMI, BMR, and target totals. | current | `src/screens/setting/pages/MyProfile/MyProfile.js` builds rows for Current Weight, BMI, BMR, and Current Target Totals; `src/screens/setting/components/My Profile/MyProfile.js` renders local-first helper copy. | high | Future profile summary review lane. | Treat body, weight, and calculated values as sensitive personal information. |
| Profile and App Preferences | 24-hour clock preference | Let the user change clock display preference in Settings. | current | Settings list includes `Clock` > `24 HOUR` toggle in `src/screens/setting/pages/Setting/Setting.js`. No persistence behavior is established by this IA. | low | Future app preference implementation/review lane. | Avoid claiming persisted preference behavior unless verified. |
| Profile and App Preferences | Measurement and unit preferences | Give users a future place to choose units such as weight, height, energy, or distance. | planned | No dedicated global unit preference control was verified in current Settings. Existing profile height UI uses feet/inches; Abbreviations help surface lists unit terms. | medium | Future measurement/unit settings lane. | Do not imply unit conversion or saved unit preferences before implementation. |
| Privacy and Data | Privacy & Data explainer | Explain current local-first data behavior, export responsibility, delete-local-data limits, and legal boundary. | current | Settings row `Privacy & Data` navigates to `SETTINGS_ROUTES.PRIVACY_AND_DATA`; copy lives in `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js`. | high | Future Privacy & Data section implementation/copy lane. | Must stay aligned with privacy/trust docs, public docs, and disclosures without becoming legal policy. |
| Privacy and Data | Legal Privacy Policy link | Let users open the legal privacy policy. | current | Settings About row `Privacy Policy` opens `https://brunchbodyfit.com/privacy-policy/` from `ABOUT_LINKS` in `src/screens/setting/pages/Setting/Setting.js`. | high | Future legal/disclosure alignment lane. | This IA does not approve privacy-policy content or legal completeness. |
| Privacy and Data | Data sharing preference | Potential future user control for data sharing or telemetry-style choices. | gated | `shareMyDataToggle` appears only in commented-out code in `src/screens/setting/pages/Setting/Setting.js`; no current live Settings control verified. | high | Requires product, privacy, analytics/telemetry, and disclosure decision lane. | Do not claim data sharing controls, analytics posture, opt-in, opt-out, or telemetry status from this doc. |
| Backup, Export, and Import | Export journal data | Let the user export selected journal entry types to an Excel workbook file. | current | Settings row `Export journal data` navigates to `SETTINGS_ROUTES.EXPORT_TO_CSV`; `src/screens/setting/pages/Export To CSV/ExportToCSV.js` exports selected journal data using `xlsx`, `react-native-scoped-storage`, and `.xlsx` file names. | high | Future export placement/copy lane. | Describe as selected journal `.xlsx` export only; not full backup, all-data export, import, or restore. |
| Backup, Export, and Import | Export responsibility notice | Explain that exported files become user-managed outside app-managed storage. | current | Export success copy in `src/screens/setting/pages/Export To CSV/ExportToCSV.js` says the user is responsible for where the file is saved, copied, shared, uploaded, or deleted. | high | Future export transparency lane. | Must stay aligned with Privacy & Data and delete-local-data copy. |
| Backup, Export, and Import | Full backup | Future all-data backup control if product decides to build it. | gated | No current full backup route or behavior was observed; `docs/architecture/in-app-transparency-surfaces.md` records no dedicated backup/import/restore surface. | high | Requires backup product, implementation, test, privacy, and disclosure lanes. | Do not imply automatic backup, cloud backup, complete export, or account restore. |
| Backup, Export, and Import | Import / restore | Future import or restore control if product decides to build it. | gated | No repo-observed import or restore flow was found in the reviewed Settings/export surfaces or transparency docs. | high | Requires import/restore design, migration, validation, copy, and disclosure lanes. | Do not imply exported files can be restored into the app. |
| Delete, Reset, and Local Data Management | Delete local data | Let the user remove saved Brunch Body data from this device. | current | Settings row `Delete local data` navigates to `SETTINGS_ROUTES.DELETE_ACCOUNT`; `src/screens/setting/components/My Profile/DeleteAccount.js` renders device-local deletion copy and confirmation. | high | Future delete/reset UX review lane. | Must distinguish local app-managed data from exported files, OS backups, device-transfer tools, and external locations. |
| Delete, Reset, and Local Data Management | Post-delete profile setup return | Route user to setup after successful local data deletion. | current | `src/screens/setting/pages/MyProfile/DeleteAccount.js` resets navigation to `ROOT_ROUTES.COMPLETE_PROFILE` after successful delete. | high | Future delete/reset UX review lane. | Describe as post-delete setup return, not account deletion or cloud reset. |
| Delete, Reset, and Local Data Management | Reset all settings only | Future scoped reset control for preferences without deleting user content. | planned | No separate reset-settings-only control was verified in current Settings. | high | Future reset semantics lane. | Must define recoverability and affected data before implementation. |
| Permissions and Device Access | Export storage permission explanation | Explain storage/file access near the journal export action. | current | `src/screens/setting/pages/Export To CSV/ExportToCSV.js` checks and requests `PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE` before export. | high | Future permission/access explanation lane. | Do not imply broader file scanning or permission behavior beyond verified export access. |
| Permissions and Device Access | General permissions/access screen | Future place for explaining permissions, device access, and platform behavior. | planned | No dedicated Settings permissions screen was verified. `docs/architecture/permission-and-access-transparency.md` provides internal guidance only. | high | Future settings permissions/access implementation lane. | Must not claim prompts are requested unless current platform behavior verifies them. |
| Help, Documentation, and About | Terms of Use link | Let users open Terms of Use. | current | Settings About row `Terms of Use` opens `https://brunchbodyfit.com/terms-conditions/` from `ABOUT_LINKS` in `src/screens/setting/pages/Setting/Setting.js`. | medium | Future legal/disclosure alignment lane. | This IA does not approve terms content or legal completeness. |
| Help, Documentation, and About | Support & Contact link | Let users open support/contact. | current | Settings About row `Support & Contact` opens `https://brunchbodyfit.com/contact-us/` from `ABOUT_LINKS` in `src/screens/setting/pages/Setting/Setting.js`. | medium | Future support/docs lane. | Support copy must match current data, export, delete, and backup limits. |
| Help, Documentation, and About | Tutorial | Let users view tutorial screens from Settings. | current | Settings About row `Tutorial` navigates to `ROOT_ROUTES.TUTORIALS`; `src/screens/setting/components/Tutorials/Tutorials.js` renders tutorial images and next/completed buttons. | low | Future help/docs lane. | Tutorial content should not become privacy, backup, deletion, or policy authority. |
| Help, Documentation, and About | Abbreviations | Let users understand abbreviations and unit-like labels. | current | Live route/UI spelling is `Abbrevations` in `SETTINGS_ROUTES.ABBREVIATIONS`, Settings row, and `src/screens/setting/components/Abbrevations/Abbrevations.js`. IA label should use `Abbreviations` except when quoting live spelling. | low | Future help/docs cleanup lane. | Safe as help content; avoid treating it as a unit preference control. |
| Help, Documentation, and About | Version | Show app version or build information. | unknown | Settings About row includes `Version` with empty `screen` in `src/screens/setting/pages/Setting/Setting.js`; rendered behavior/value was not verified in this lane. | low | Future about/version lane. | Do not claim version display quality or release metadata alignment without verification. |
| Help, Documentation, and About | Rate us | Let users rate the app. | unknown | Settings About row includes `Rate us` with empty `screen` in `src/screens/setting/pages/Setting/Setting.js`; no link or route was verified. | low | Future store/review UX lane. | Do not claim store integration or rating behavior before implementation. |
| Future / Gated Controls | Reminder controls | Future reminder or notification settings. | gated | Current Alert rows exist in `src/screens/setting/pages/Setting/Setting.js`, but `onAddAlarmHandler` shows `Alarm notifications are disabled in this build.` | high | Requires notification permission, reminder behavior, copy, tests, and disclosure lane. | Do not imply active reminders, notifications, or permission prompts before implementation. |
| Future / Gated Controls | AI controls | Future AI preferences, explanations, or opt-ins. | gated | No current AI Settings control was verified. Existing governance docs require AI behavior to remain future work unless implemented and reviewed. | high | Requires AI product, privacy, implementation, testing, and disclosure lanes. | Do not imply AI coaching, AI processing, summaries, or off-device AI behavior. |
| Future / Gated Controls | Sync / cloud account controls | Future sync, cloud account, backup, or restore controls. | gated | Current Privacy & Data copy says the app does not automatically sync to a Brunch Body cloud account and does not provide automatic Brunch Body cloud backup. | high | Requires backend/sync product, security, privacy, implementation, migration, and disclosure lanes. | Do not imply cloud sync, account-backed restore, or developer-server storage. |
| Future / Gated Controls | Monetization controls | Future subscriptions, purchases, trials, or entitlements settings. | gated | No current monetization Settings control was verified. | medium | Requires monetization product, store, implementation, and support lanes. | Do not imply pricing, subscription, purchase, ad, or entitlement behavior. |
| Future / Gated Controls | Legacy account/email/password controls | Dormant account-style screens that should not be treated as current Settings controls. | gated | Legacy files and route constants exist, but `docs/architecture/in-app-transparency-surfaces.md` records they are not registered in `SettingsNavigation` and not exposed by current Settings/My Profile list data. | high | Requires explicit cleanup or reactivation lane. | Do not imply live account, email change, password reset, backend identity, or account deletion behavior. |

## Recommended Settings Groups

1. Profile and App Preferences
2. Privacy and Data
3. Backup, Export, and Import
4. Delete, Reset, and Local Data Management
5. Permissions and Device Access
6. Help, Documentation, and About
7. Future / Gated Controls

Recommended placement rules:

- Put profile/vitals editing, app display preferences, clock format, and future unit preferences under Profile and App Preferences.
- Put plain-English local-first, privacy/data, data-use, and legal-boundary explainers under Privacy and Data.
- Put selected journal export, future full export, backup, import, restore, and device-change guidance under Backup, Export, and Import.
- Put destructive or semi-destructive actions under Delete, Reset, and Local Data Management.
- Put OS permission, scoped-storage, file-access, notification, platform access, and future device-integration explanations under Permissions and Device Access.
- Put tutorials, abbreviations, version, support, contact, terms, and legal-policy links under Help, Documentation, and About.
- Keep reminders, AI, sync, cloud accounts, backup restore, monetization, and dormant legacy account flows in Future / Gated Controls until separate lanes approve behavior.

## Existing vs Planned Controls

Use these labels consistently:

- `current`: verified in live app behavior, current source, current Settings navigation, or current docs, with an evidence note recorded in the control map.
- `planned`: intended for Phase 1 or a future lane, but not implemented in this lane and not verified as live behavior.
- `gated`: requires later product, policy, privacy, security, disclosure, backend, platform, or implementation decisions before it can be exposed as a user control.
- `unknown`: visible in code or docs, but runtime reachability, user-facing behavior, persistence, or product intent is unclear.

Rules for ambiguous surfaces:

- File presence alone is not enough to mark a control `current`.
- Commented code is not a current control.
- A route constant is not a current control unless it is registered and reachable from current navigation or UI.
- A Settings row with no route, link, value, or verified behavior should be `unknown`, not `current`, unless a later lane verifies the behavior.
- Existing docs can support architecture context, but current app behavior and code remain the source of truth for current controls.

## Trust and Privacy Language Rules

Future Settings copy must not:

- imply cloud sync unless implemented and verified
- imply automatic backup unless implemented and verified
- imply off-device storage, backend account storage, or developer-server collection unless implemented and verified
- imply deletion from services, cloud accounts, operating-system backups, device-transfer tools, or exported files that the app does not control
- imply permissions are requested when they are not
- imply export/import behavior before implemented
- imply legal privacy-policy, Terms of Use, app-store, or disclosure status
- imply HIPAA, clinical, medical, diagnostic, treatment, or professional advice status
- imply analytics, telemetry, AI, advertising, or third-party sharing posture unless the shipped build and disclosures have been reviewed
- describe local-first behavior as a permanent guarantee that data can never leave the device

Settings language should:

- use present-state wording such as "current app" or "current observed behavior" when describing verified behavior
- treat fitness, nutrition, journal, supplement, reflection, profile, body, routine, calendar, todo, and planning data as potentially sensitive
- distinguish app-managed local data from exported files and platform-managed behavior
- keep legal policy links separate from plain-English Privacy & Data explanations
- seed follow-on work when stronger claims are desired

## Delete, Reset, Backup, Export, and Import Placement Rules

- `Delete local data` belongs in Delete, Reset, and Local Data Management, not under legal policy or generic About.
- Delete copy must explain what is deleted from this device, what is not deleted, and what may appear again after setup when supported by verified behavior.
- Do not use `Delete account` as user-facing IA unless a later lane implements and verifies account deletion semantics.
- Reset controls must be scoped by affected data class before implementation, such as preferences-only reset versus local data deletion.
- Current export belongs in Backup, Export, and Import as selected journal `.xlsx` export.
- Current export must not be described as a full backup, all-data export, import system, restore system, cloud backup, or device-transfer feature.
- Future backup, import, restore, and device-change guidance should live beside export, but each must remain `gated` until implemented, tested, and disclosure-reviewed.
- Any import or restore control must explain the selected source, data read, data overwritten or merged, failure modes, and recovery limits before release.

## Permission and Access Explanation Placement

- Permission explanations should be placed close to the control that triggers the access.
- Export storage/file access explanation belongs near Export journal data and any future export/import controls.
- Future notification permission explanation belongs near reminders, not in a generic privacy paragraph.
- Future health-platform, camera, photos, location, microphone, contacts, calendar, sensor, Bluetooth, or file-access explanations require a dedicated permissions/access review lane before release.
- Settings copy should distinguish OS permission prompts from in-app confirmation, warning, success, and error modals.
- Do not claim "no internet access" or "no off-device access" from Settings IA alone; platform config, dependencies, external legal/support links, and release behavior require separate review.

## Gated Future Controls

The following areas may be grouped in Settings IA as placeholders only:

- Reminder controls: gated until notification behavior, prompt timing, permission copy, persistence, tests, and disclosures are defined.
- AI controls: gated until AI feature behavior, data flow, model processing, opt-in/opt-out, privacy copy, tests, and disclosures are defined.
- Sync and cloud account controls: gated until backend account, sync, recovery, deletion, security, migration, and disclosure requirements are defined.
- Full backup, import, and restore: gated until data coverage, file format, failure handling, recovery semantics, tests, and disclosure language are defined.
- Monetization controls: gated until store, subscription, purchase, entitlement, support, and disclosure behavior is defined.
- Legacy account/email/password controls: gated until a later lane either removes residue or explicitly reactivates account-style behavior.

Placeholders must be visibly labeled as future/gated in internal docs and must not be surfaced as shipped user behavior.

## Out-of-Scope Claims

This document does not claim that Brunch Body:

- has implemented new Settings UI
- has changed navigation or route registration
- has changed storage, persistence, reducers, thunks, selectors, or data flow
- has changed privacy posture
- has changed deletion, reset, backup, export, import, or restore behavior
- has changed permission prompts or platform access
- has backend accounts, cloud sync, account-backed restore, or automatic cloud backup
- has an import or restore system
- deletes exported files, shared files, uploaded files, operating-system backups, device-transfer copies, or files outside app-managed storage
- has AI behavior, AI coaching, AI summaries, AI data processing, or AI controls
- has monetization, subscription, purchase, ad, or entitlement behavior
- has final privacy-policy, Terms of Use, store, data-safety, or platform disclosure language
- has legal, medical, clinical, HIPAA, privacy-certified, launch-ready, or store-ready status

## Follow-on Lane Seeds

- `1.2.3.2 Settings control surface copy rules`
- `1.2.3.3 Settings privacy/data section implementation`
- `1.2.3.4 Settings backup/export/import placement`
- `1.2.3.5 Settings delete/reset UX review`
- `1.2.3.6 Settings disclosure alignment review`
- `1.2.3.7 Settings permission/access explanation review`
- `1.2.3.8 Settings profile, units, and app preferences review`
- `1.2.3.9 Settings dormant account residue disposition`
- `1.2.3.10 Settings help/docs/about cleanup`

Each follow-on lane should keep a narrow file radius, verify current behavior before making claims, and avoid public docs or disclosure changes unless explicitly in scope.

## Reviewer Checklist

- Exactly one new file was created: `docs/architecture/settings-ia-control-surfaces.md`.
- The document uses the required section structure in order.
- The document states that it is internal IA guidance only and does not change app behavior.
- Every proposed settings/control item has a status label, trust sensitivity, implementation/follow-on owner, and disclosure/doc impact.
- Every control labeled `current` includes a brief repo-evidence note.
- Controls with incomplete evidence are labeled `unknown`, `planned`, or `gated`.
- Privacy/data, delete/reset, backup/export/import, and permissions/access controls are treated as high-trust surfaces.
- The document does not claim unverified cloud sync, automatic backup, off-device storage, service deletion, import/restore, permission prompts, legal privacy-policy status, AI, monetization, backend behavior, or disclosure readiness.
- Dormant legacy account/email/password files are not treated as current live controls.
- `Abbreviations` is used as the IA label, with `Abbrevations` preserved only when quoting observed live route/UI spelling.
- Follow-on lane seeds are included.
- `git diff --check` passes.
