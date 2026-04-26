# In-app Transparency Truthfulness Review

## Scope Lock

- Review and closeout only.
- No app behavior changes.
- No app copy changes.
- No legal/disclosure changes.
- Mismatches are recorded as follow-on work, not fixed here.

## Purpose

This review closes the `1.2.2.1 In-app transparency surfaces` sequence by checking the implemented in-app transparency surfaces against current repo-observed app behavior, the transparency copy contract, public documentation, platform disclosure posture, and the local-first trust model.

The review verifies that the completed surfaces stay truthful and bounded. It does not create new privacy claims, legal approvals, store-disclosure approvals, backup/import/restore behavior, backend sync, or app behavior changes.

## Source-of-Truth Rule

Live app behavior and implemented surfaces are authoritative for this review. Architecture docs, README/public docs, privacy/disclosure notes, and legal/store-disclosure language are checked for alignment, but they do not create app behavior or approve broader claims.

## Surfaces Reviewed

| Surface | File(s) | Expected Contract | Result | Notes |
|---|---|---|---|---|
| Settings Privacy & Data entry point | `src/screens/setting/pages/Setting/Setting.js` | Settings exposes the approved `Privacy & Data` label as a transparency entry point without introducing backup/sync/legal claims. | Pass | The About section includes `Privacy & Data` and routes to `SETTINGS_ROUTES.PRIVACY_AND_DATA`. Settings also keeps the live `Export journal data` and `Delete local data` rows distinct. |
| Privacy & Data screen | `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js`; `src/screens/setting/pages/PrivacyAndData/PrivacyAndData.js` | Plain-English present-state explainer covering device-local storage, no Brunch Body cloud sync, no automatic Brunch Body cloud backup, exported-file responsibility, delete limits, profile/vitals local use, and legal-policy boundary. | Pass | Copy is explicit that the current app is local-first, data is stored on this device in local app storage, there is no automatic Brunch Body cloud account sync or Brunch Body cloud backup, exported files are user-managed, and the screen is not the legal Privacy Policy or Terms of Use. |
| Delete local data screen and success modal | `src/screens/setting/components/My Profile/DeleteAccount.js`; `src/screens/setting/pages/MyProfile/DeleteAccount.js` | User-facing copy must say `Delete local data`, describe device-local removal, avoid account/server deletion claims, and explain exported-file and starter-plan limits. | Pass | Screen title and action use delete-local-data language. Body copy distinguishes deleted on-device app data from exported/copied/shared/uploaded/saved files outside the app. Success modal repeats those limits and notes starter plans may appear again after setup. Internal `DeleteAccount` names remain implementation residue, not user-facing copy. |
| Export Journal Data helper copy and success modal | `src/screens/setting/components/Export To CSV/ExportToCSV.js`; `src/screens/setting/pages/Export To CSV/ExportToCSV.js` | Export must be framed as selected journal export to an Excel workbook, not full backup/import/restore, and must warn that exported files may contain sensitive information and become user-managed. | Pass | Screen copy says selected journal entries export as `.xlsx`; helper copy warns about personal fitness/journal/nutrition/supplement/reflection/profile-related information and responsibility for saved/copied/shared/uploaded/deleted files. Success modal confirms `.xlsx` export and user responsibility. Internal `ExportToCSV` names remain implementation residue. |
| Profile helper copy | `src/screens/setting/components/My Profile/MyProfile.js`; `src/screens/setting/pages/MyProfile/MyProfile.js` | Profile copy should state local storage and local in-app calculation/display use without medical, clinical, diagnostic, treatment, or guaranteed-accuracy claims. | Pass | Profile helper copy says values are saved on this device only and used for in-app calculations and display. |
| My Vitals/Profile details helper copy | `src/screens/setting/components/My Profile/MyVitals.js`; `src/screens/setting/pages/MyProfile/MyVitals.js`; `src/resources/strings.js` | Vitals copy should stay short and bounded: locally stored values used for local calculations/display, including BMI/BMR context, without medical or accuracy claims. | Pass | Profile details helper copy repeats the device-only calculation/display boundary. Field helper strings include local BMI/BMR calculation context and input guidance only. |
| Onboarding local-data notice | `src/screens/completeProfile/components/Name.js`; `src/resources/strings.js` | Onboarding must notify users that profile details are saved on this device and used for in-app calculations/display. | Pass | The onboarding name step renders `strings.completeProfile.helperText.localDataNotice`, which states profile details are saved on this device and used for in-app calculations and display. |

## Cross-surface Truthfulness Checks

### Local-first / Device-local Data

- Result: Pass.
- Evidence: `Privacy & Data`, Profile, Profile details, onboarding, README, public privacy/data guide, and platform privacy disclosures all describe current app data as local-first or device-local.

### No Brunch Body Cloud Sync

- Result: Pass.
- Evidence: `Privacy & Data` states the current app does not automatically sync data to a Brunch Body cloud account. README and public privacy/data docs also state that current project evidence does not show Brunch Body cloud/account sync for user app data.

### No Automatic Brunch Body Cloud Backup

- Result: Pass.
- Evidence: `Privacy & Data` states Brunch Body does not currently provide automatic Brunch Body cloud backup for device-local app data. README and public docs align by describing no automatic cloud backup/sync for current local records.

### Delete Local Data

- Result: Pass.
- Evidence: Settings and the delete screen use `Delete local data` in user-facing copy. Delete flow copy says saved Brunch Body data is removed from this device, exported/copied/shared/uploaded/saved files outside the app are not deleted, and starter plans may appear again after setup.

### Exported Files / User-managed Responsibility

- Result: Pass.
- Evidence: Export helper copy and success modal explain that exported files may contain sensitive personal information and that the user is responsible for where exported files are saved, copied, shared, uploaded, or deleted. Public docs align by distinguishing exported files from app-managed storage.

### Profile/Vitals Data Use

- Result: Pass.
- Evidence: Profile and Profile details helper copy states values are saved on this device only and used for in-app calculations and display. Field helper strings keep BMI/BMR wording local and do not make medical or guaranteed-accuracy claims.

### Onboarding Local-data Notice

- Result: Pass.
- Evidence: The onboarding name step displays the local-data notice from `strings.completeProfile.helperText.localDataNotice`, which states profile details are saved on this device and used for in-app calculations and display.

### Legal Boundary

- Result: Pass.
- Evidence: `Privacy & Data` says it is a plain-English explanation of current app behavior and not the legal Privacy Policy or Terms of Use. Public privacy/data docs similarly state they are not a legal privacy policy, legal advice, app store disclosure, or medical privacy notice.

### Forbidden Claims

- Result: Pass.
- Evidence: Source review found no intended user-facing claims for delete account, secure backup, cross-device sync, stored-in-account data, cloud recovery, full backup, restore/import, HIPAA, clinical, medical advice, or guaranteed accuracy. The scoped static search returned zero matches in `src/screens/setting`, `src/screens/completeProfile`, and `src/resources`.

## Docs / Disclosure Alignment Notes

- README: Aligned as current-behavior context. It describes device-local profile setup/editing, journal export, `Delete local data`, no cross-device reconciliation or cloud backup for user-generated data, and no automatic cloud backup/sync for device-local records. This review does not approve future backend-sync or migration language.
- Public privacy/data guide: Aligned as a broader plain-English public guide. It describes local-first behavior, no Brunch Body cloud account/sync, selected journal `.xlsx` export, delete/reset limits, exported-file responsibility, OS/platform-backup caveats, and no medical/HIPAA/clinical guarantees. This review does not turn that guide into legal policy or store-disclosure approval.
- Platform privacy disclosures: Present at `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md` and aligned as disclosure posture for the current local-only build. It records no developer-server data collection, no tracking, local AsyncStorage/MMKV storage, `.xlsx` export, and delete-local-data limits. This review does not approve new App Store or Google Play disclosure changes.
- Any missing or renamed docs: None observed for the requested docs. `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md` is present.

## Tests / Validation

- Commands run:
  - Pass: `yarn test __tests__/privacyAndDataScreen.test.js __tests__/accountFlows.test.js __tests__/exportTransparencyCopy.test.js __tests__/profileVitalsTransparencyCopy.test.js __tests__/completeProfileOnboardingTransparencyCopy.test.js __tests__/navigationSmokeFlows.test.js --runInBand`
  - Pass: `rg -n "Delete account|securely backed up|synced across devices|stored in your account|cloud recovery|full backup|restore/import|HIPAA|clinical|medical advice|guaranteed accurate" src/screens/setting src/screens/completeProfile src/resources`
  - Pass: `git diff --check`
  - Pass: `git status --short --untracked-files=all`
- Results:
  - Focused transparency tests passed: 6 suites, 38 tests.
  - Forbidden-pattern search returned zero matches in scoped app source/resource paths.
  - `git diff --check` passed.
  - `git status --short --untracked-files=all` showed only `?? docs/architecture/in-app-transparency-truthfulness-review.md`.
- Known unrelated warnings/noise:
  - Yarn reported the preferred cache folder was not writable and used a temp cache folder.
  - Yarn reported no suitable global folder.
  - `navigationSmokeFlows.test.js` emitted the existing Nutrition React key warning. This review records it but does not fix it.

## Findings

- Passes:
  - All reviewed in-app transparency surfaces align with `docs/architecture/transparency-copy-contract.md`.
  - User-facing copy distinguishes device-local app storage, no current Brunch Body cloud sync, no automatic Brunch Body cloud backup, exported-file responsibility, delete-local-data limits, profile/vitals local use, onboarding local-data notice, and the plain-English explainer/legal-policy boundary.
  - README, public privacy/data guide, and platform privacy disclosures align with the current local-first trust model at the level reviewed here.
- Ambiguities:
  - Internal route/component/action names such as `DeleteAccount` and `ExportToCSV` remain implementation residue. They are not user-facing copy failures in this lane.
  - Public docs discuss OS/platform backup and device-transfer caveats more broadly than in-app copy. That remains appropriate public-doc context, not a source of new in-app behavior.
- Mismatches:
  - None observed in the reviewed surfaces before validation.
- Follow-on lane seeds:
  - Open a separate lane if legal Privacy Policy, Terms of Use, App Store, Google Play, OS backup/device-transfer, import/restore, backend sync, account, or full-backup language needs approval or updates.
  - Open a separate cleanup lane if internal legacy names such as `DeleteAccount` or `ExportToCSV` should be renamed.

## Non-Approvals

- This review does not approve new privacy claims.
- This review does not approve legal policy language.
- This review does not approve store disclosure changes.
- This review does not approve backup/import/restore behavior.
- This review does not approve backend sync.
- This review does not approve app behavior changes.
