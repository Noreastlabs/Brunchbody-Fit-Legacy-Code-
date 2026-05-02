# In-app Transparency Surface Inventory

## Scope Lock

- Inventory only.
- No behavior changes.
- No copy changes.
- No disclosure changes.
- Live repo behavior is the source of truth.

## Purpose

This inventory maps the current in-app surfaces where Brunch Body explains, implies, or affects user trust, data handling, deletion/reset, export, permissions/access, privacy, terms, profile/vitals, and local-first expectations.

The goal is to record what the repo currently shows before later transparency, copy, UX, privacy, disclosure, backup, export, or delete/reset lanes change anything. Mismatches and unclear surfaces are captured here as follow-on seeds, not fixed in this document.

## Source-of-Truth Rule

Observed app files and live navigation behavior outrank older prose, public docs, release notes, and roadmap intent. Public docs can provide alignment context, but they do not create app behavior, privacy posture, storage semantics, export behavior, delete behavior, legal approval, or store disclosure approval.

When a surface is unclear, this inventory records the ambiguity and leaves resolution to a later lane.

## Current Transparency Surface Map

Statuses are limited to `existing`, `missing/proposed`, `unclear`, and `dormant residue`.

| Surface | Route / Entry Point | Current File(s) | Current Purpose | Trust Topic | Status | Notes |
|---|---|---|---|---|---|---|
| Settings landing | Bottom tab `Settings`; Settings stack initial route `SETTINGS_ROUTES.SETTINGS` / `Settings` | `src/navigation/BottomTabNavigation.js`; `src/navigation/SettingsNavigation.js`; `src/screens/setting/pages/Setting/Setting.js`; `src/screens/setting/components/Setting.js` | Lists Profile, Clock, Alerts, Export data, Delete local data, and About entries. | privacy/data handling; deletion/reset; export/backup responsibility; legal/policy; user education/help | existing | About entries include reachable in-app `Privacy & Data` and `Help & Support` rows. Terms of Use, Privacy Policy, and Support & Contact open external URLs. A `shareMyDataToggle` section exists only as commented code in `Setting.js`. |
| My Profile | `SETTINGS_ROUTES.MY_PROFILE` / `MyProfile`; Settings row `View and edit profile` | `src/screens/setting/pages/MyProfile/MyProfile.js`; `src/screens/setting/components/My Profile/MyProfile.js` | Displays profile summary, current weight, BMI, BMR, and current target totals; links to My Vitals. | privacy/data handling; profile/vitals sensitivity | existing | Screen copy includes `Saved on this device only.` This is an in-app local-first signal, not a full privacy policy. |
| My Vitals | `SETTINGS_ROUTES.MY_VITALS` / `MyVitals`; My Profile row `Edit nickname and vitals` | `src/screens/setting/pages/MyProfile/MyVitals.js`; `src/screens/setting/components/My Profile/MyVitals.js`; `src/resources/strings.js` | Lets the user edit nickname, date of birth, gender, and height; saves profile changes. | privacy/data handling; profile/vitals sensitivity | existing | Helper copy includes local calculation context such as gender being `Used for local BMI and BMR calculations.` |
| Delete local data | `SETTINGS_ROUTES.DELETE_ACCOUNT` / `DeleteAccount`; Settings section and row `Delete local data` | `src/navigation/SettingsNavigation.js`; `src/screens/setting/pages/MyProfile/DeleteAccount.js`; `src/screens/setting/components/My Profile/DeleteAccount.js`; `src/redux/actions/auth.js` | Confirms and performs removal of saved Brunch Body data from this device, then returns to profile setup on success. | deletion/reset; export/backup responsibility; privacy/data handling | existing | Internal route/component naming still uses `DeleteAccount`; user-facing copy says `Delete local data`. Copy states exported files are not deleted and bundled starter plans may appear again after setup. |
| Export journal data | `SETTINGS_ROUTES.EXPORT_TO_CSV` / `ExportToCSV`; Settings section `Export data`, row `Export journal data` | `src/screens/setting/pages/Export To CSV/ExportToCSV.js`; `src/screens/setting/components/Export To CSV/ExportToCSV.js` | Lets the user select one journal entry type and export matching entries. | export/backup responsibility; privacy/data handling | existing | Internal route name says `ExportToCSV`, but current implementation and copy export an Excel workbook (`.xlsx`). This is selected journal export, not full backup/import/restore. |
| Privacy & Data | `SETTINGS_ROUTES.PRIVACY_AND_DATA` / `PrivacyAndData`; Settings About row `Privacy & Data` | `src/screens/setting/pages/PrivacyAndData/PrivacyAndData.js`; `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js`; `__tests__/privacyAndDataScreen.test.js` | Presents a plain-English explanation of current local-first storage, Brunch Body cloud sync/backup limitations, profile/vitals use, exported file responsibility, and Delete local data boundaries. | privacy/data handling; export/backup responsibility; deletion/reset; legal/policy boundary | existing | This is a live in-app transparency screen. It is not the legal Privacy Policy or Terms of Use and should remain behavior-matched to current app storage/export/delete behavior. |
| Help & Support | `SETTINGS_ROUTES.HELP_AND_SUPPORT` / `HelpAndSupport`; Settings About row `Help & Support` | `src/screens/setting/pages/HelpAndSupport/HelpAndSupport.js`; `src/screens/setting/components/HelpAndSupport/HelpAndSupport.js`; `__tests__/helpAndSupportScreen.test.js` | Consolidates local-first support boundaries, delete/export limitations, recovery limits, feedback guidance, and non-professional health/training/nutrition support framing. | user education/help; privacy/data handling; deletion/reset; export/backup responsibility; support limitations | existing | This is a support explanation surface only. It does not add a support workflow, support-side data access, backend recovery, cloud restore, or professional guidance. |
| Terms of Use | Settings About row `Terms of Use`; registered stack route `SETTINGS_ROUTES.TERMS_OF_USE` / `TermsOfUse` | `src/screens/setting/pages/Setting/Setting.js`; `src/screens/setting/pages/TermsOfUse/TermsOfUse.js`; `src/screens/setting/components/TermsOfUse/TermsOfUse.js` | Settings landing opens `https://brunchbodyfit.com/terms-conditions/`; in-app wrapper renders only a heading and empty body. | legal/policy | unclear | The route exists in `SettingsNavigation`, but the observed Settings entry uses an external link rather than navigating to the in-app wrapper. This inventory does not endorse legal language. |
| Privacy Policy | Settings About row `Privacy Policy`; registered stack route `SETTINGS_ROUTES.PRIVACY_POLICY` / `PrivacyPolicy` | `src/screens/setting/pages/Setting/Setting.js`; `src/screens/setting/pages/PrivacyPolicy/PrivacyPolicy.js`; `src/screens/setting/components/Privacy Policy/PrivacyPolicy.js` | Settings landing opens `https://brunchbodyfit.com/privacy-policy/`; in-app wrapper renders only a heading and empty body. | privacy/data handling; legal/policy | unclear | The route exists in `SettingsNavigation`, but the observed Settings entry uses an external link rather than navigating to the in-app wrapper. This inventory does not approve privacy-policy copy. |
| Abbrevations | `SETTINGS_ROUTES.ABBREVIATIONS` / `Abbrevations`; Settings About row `Abbrevations` | `src/screens/setting/pages/Abbrevations/Abbrevations.js`; `src/screens/setting/components/Abbrevations/Abbrevations.js` | Lists abbreviations and units such as BMI, BMR, macros, weights, measures, and RTD. | user education/help; profile/vitals sensitivity | existing | Spelling is preserved as observed in route and UI copy. This is a help-like surface, not a privacy or policy surface. |
| Tutorials | Root route `ROOT_ROUTES.TUTORIALS` / `Tutorials`; Settings About row `Tutorial`; onboarding completion link | `src/navigation/RootNavigation.js`; `src/screens/setting/pages/Tutorials/Tutorials.js`; `src/screens/setting/components/Tutorials/Tutorials.js`; `src/resources/images.js` | Shows tutorial images and exits to Home/Dashboard when completed. | user education/help | existing | Root-owned route, not a Settings stack route. The tutorial content is image-based and was not treated as privacy/legal policy text in this inventory. |
| Onboarding / profile completion | Root route `ROOT_ROUTES.COMPLETE_PROFILE` / `CompleteProfile`; first-run bootstrap route when no local profile exists | `src/bootstrap/AppBootstrap.js`; `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`; `src/screens/completeProfile/components/Name.js`; `src/screens/completeProfile/components/DateOfBirth.js`; `src/screens/completeProfile/components/Height.js`; `src/screens/completeProfile/components/Weight.js`; `src/screens/completeProfile/components/Gender.js`; `src/resources/strings.js` | Captures nickname, date of birth, height, weight, and gender; stores profile data and moves to the app after completion. | profile/vitals sensitivity; privacy/data handling; user education/help | existing | Live flow includes helper text for date of birth, height, weight, and local BMI/BMR calculation context. Older data-selection/study strings and components exist but are not part of the observed `CompleteProfile` live branch. |
| Export permission and file access | Export Journal Data flow; Android storage permission request; scoped/document-tree destination chooser | `src/screens/setting/pages/Export To CSV/ExportToCSV.js`; `android/app/src/main/AndroidManifest.xml`; `ios/BrunchBody/Info.plist`; `ios/BrunchBody/PrivacyInfo.xcprivacy`; `docs/architecture/permission-and-access-transparency.md` | Requests Android write-storage permission when needed, opens a document tree/destination, and writes selected journal export files. Native configs also expose platform access/disclosure signals. | permissions/access; export/backup responsibility; privacy/data handling | existing | This is inventory context only. Do not broaden it into claims about all file access, no internet access, OS backup behavior, or store disclosure approval without a separate permission/disclosure lane. |
| Generic confirmation modals | Reused `PermissionModal` pattern across delete/remove/save confirmations and status messages | `src/components/PermissionModal/PermissionModal.js`; domain screens that pass delete/remove/status copy | Presents in-app confirmation, warning, success, or error modal copy. | deletion/reset; user control; permissions wording risk | existing | Despite the component name, these are app modals, not OS permission prompts. Future lanes should distinguish confirmation copy from Android/iOS permission prompt copy. |
| Legacy account/email/password residue | Route constants `MY_ACCOUNT`, `MY_EMAIL`, `MY_PASSWORD`; files under MyProfile pages/components | `src/navigation/routeNames.js`; `src/screens/setting/pages/MyProfile/MyAccount.js`; `src/screens/setting/pages/MyProfile/MyEmail.js`; `src/screens/setting/pages/MyProfile/MyPassword.js`; matching component files | Legacy account-style files and constants remain on disk. | privacy/data handling; legal/policy | dormant residue | Not registered in `SettingsNavigation` and not exposed by current Settings/My Profile list data. Do not treat file presence as a live account/auth surface without a later cleanup or reactivation lane. |
| Older onboarding study/data-sharing residue | `strings.completeProfile.labels.dataSelection`; `ChooseInput`, `ChooseLabel`, and `ChooseButton` helper branches | `src/resources/strings.js`; `src/screens/completeProfile/components/ChooseInput.js`; `src/screens/completeProfile/components/ChooseLabel.js`; `src/screens/completeProfile/components/ChooseButton.js`; `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js` | Older data-sharing/study strings and helper branches remain in the repo. | consent/data sharing; privacy/data handling | dormant residue | The observed live `CompleteProfile` branch does not route through the data-selection/study step. Do not treat these strings as reachable Phase 1 UX without a later flow review or cleanup lane. |
| Backup/import/restore transparency | No dedicated in-app route observed | Settings, Privacy & Data, Help & Support, export, delete, and profile surfaces above | Current in-app copy touches export responsibility, delete limitations, and recovery limits, but no full backup, import, restore, device-transfer, or Brunch Body cloud-backup surface was observed. | export/backup responsibility; privacy/data handling | missing/proposed | Public docs discuss backup/device-change caveats, but no dedicated in-app backup/import/restore UX was observed in this lane. |

## Surface Categories

### Privacy / Data Handling

- Settings landing exposes privacy-relevant entry points through Profile, Delete local data, Export journal data, Privacy & Data, Help & Support, Privacy Policy, Terms of Use, Tutorial, and Abbrevations.
- Privacy & Data is a live in-app transparency screen with local-first, cloud sync/backup limitation, export responsibility, delete boundary, and legal-boundary copy.
- Help & Support is a live in-app consolidation surface for local-first support boundaries, delete/export limits, recovery limits, feedback, and professional-guidance boundaries.
- My Profile and My Vitals include direct local-first signals through `Saved on this device only.` and local calculation helper text.
- Onboarding/profile completion captures profile and vitals inputs before the main app opens.
- Privacy Policy is ambiguous as an in-app surface because the route/wrapper exists, but the Settings landing opens the external policy URL and the in-app wrapper body is empty.
- Legacy account/email/password files and route constants remain as dormant residue, not live Settings surfaces.

### Deletion / Reset

- The live destructive action is user-facing `Delete local data`.
- The registered internal route and wrapper still use `DeleteAccount` naming.
- Delete copy says saved Brunch Body data is removed from this device, exported files are not deleted, and bundled starter plans may appear again after setup.
- The post-delete reset path returns the app to `CompleteProfile`; this inventory does not change that behavior.

### Export / Backup Responsibility

- The live export entry is Settings `Export data` > `Export journal data`.
- The export screen describes selected journal export as an Excel workbook (`.xlsx`).
- The implementation and copy do not describe a full backup, import, restore, or all-data export.
- Export helper copy warns that files saved outside the app are not removed by Delete local data.
- Privacy & Data and Help & Support include backup/recovery limitation copy, but no dedicated in-app backup/import/restore or device-change guidance surface was observed.

### Permissions / Access

- The export flow checks and requests Android `WRITE_EXTERNAL_STORAGE` before selected journal export when needed.
- The export flow opens a document tree/destination and writes a user-managed `.xlsx` file outside normal app-managed storage.
- Android manifest entries include internet, vibration, wake-lock, and boot-completed permissions; iOS config and privacy manifest include platform access/disclosure signals.
- Reused `PermissionModal` copy is an in-app confirmation/status modal pattern, not an OS permission prompt.
- This inventory records access surfaces only; it does not approve permission explanations, store disclosures, platform privacy answers, or broad claims such as no network access, no file access, or no OS backup behavior.

### Profile / Vitals / Sensitive Inputs

- Onboarding collects nickname, date of birth, height, weight, and gender.
- My Profile displays current weight, BMI, BMR, and target totals.
- My Vitals lets the user edit nickname, date of birth, gender, and height.
- Profile/vitals copy identifies device-local storage and local BMI/BMR calculation context, but does not provide a full data-use policy.

### Legal / Policy Screens

- Terms of Use and Privacy Policy stack routes are registered.
- Settings landing opens external legal/policy URLs instead of navigating to the in-app wrappers.
- The in-app Terms of Use and Privacy Policy components render headings with empty bodies.
- This document inventories those surfaces only and does not approve or rewrite legal or privacy-policy language.

### Help / Education Surfaces

- Help & Support is reachable from Settings and includes support, recovery, feedback, and health/training/nutrition guidance boundaries.
- Abbrevations lists unit, macro, BMI, BMR, and related abbreviations.
- Tutorials is reachable from Settings and the onboarding completion screen through a root-owned route.
- Onboarding helper text explains how to enter profile/vitals fields and notes local BMI/BMR calculation context for gender.

## Current Alignment Notes

- README alignment: `README.md` broadly aligns with the observed local-first Settings surfaces by describing device-local profile editing, journal export, and `Delete local data`.
- In-app copy alignment: current live copy is narrower than some internal names. User-facing copy says `Delete local data`, while internal identifiers still say `DeleteAccount`; user-facing export copy says `.xlsx`, while the route name says `ExportToCSV`.
- Permission/access alignment: export-related storage and document-tree behavior is currently recorded as inventory context only; permission prompt copy and platform disclosure posture require a separate lane if changed or published.
- Public docs alignment: `docs/public/brunch-body-privacy-and-data.md` and related public docs discuss local-first, export, delete/reset, backup, and device-change expectations more fully than the current in-app surfaces.
- Store/disclosure follow-on: `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md` records platform-disclosure posture, but this inventory does not validate or approve store answers.

## Gaps and Ambiguities

- Terms of Use and Privacy Policy have both registered in-app stack routes and external Settings links; the in-app wrapper bodies are empty.
- `DeleteAccount` remains as an internal route/component/action naming pattern while user-facing copy says `Delete local data`.
- `ExportToCSV` remains as an internal route naming pattern while current copy and behavior export `.xlsx`.
- No dedicated in-app backup/import/restore/device-change transparency surface was observed.
- Privacy & Data and Help & Support now provide dedicated in-app transparency copy, but they are explanatory surfaces only and do not create legal policy, backup, restore, sync, or support workflow behavior.
- Permission/access surfaces are currently concentrated around export and native configuration signals; no broad in-app permission center was observed.
- Legacy `MyAccount`, `MyEmail`, and `MyPassword` files and route constants remain on disk but are not registered in the live Settings stack.
- Older onboarding data-sharing/study strings and helper components remain in the repo but are not part of the observed live `CompleteProfile` branch.
- Store/disclosure alignment cannot be approved from this inventory alone.

## Follow-on Lane Seeds

- Privacy & Data Screen Transparency Copy
- Delete Local Data Confirmation Transparency
- Export / Backup Responsibility Transparency
- Help & Support Transparency Consolidation
- Profile and Vitals Data-use Helper Copy Drift Review
- Onboarding Local-data Notice Drift Review
- Permission / Access Explanation Surface Review
- Public Docs Alignment Review after any user-facing copy changes

## Non-Approvals

- This document does not approve new privacy claims.
- This document does not approve legal policy language.
- This document does not approve store disclosure changes.
- This document does not approve backup/import behavior.
- This document does not approve backend sync.
- This document does not approve app behavior changes.
- This document does not approve route, storage, export, delete, reset, consent, onboarding, or copy changes.
