# App Store Privacy Disclosure Prep

## Status and Scope

This is an internal App Store privacy disclosure preparation artifact for Brunch Body.

This artifact is not legal advice, not a final App Store Connect submission, not a privacy policy, not a public user-facing statement, and not a behavior change. It does not approve legal, store, privacy-label, launch-readiness, or App Store readiness claims.

This lane changes no app behavior, source code, tests, CI, native manifests, package files, dependency behavior, storage behavior, export behavior, delete/reset semantics, privacy posture, public docs, privacy policy, store metadata, App Store Connect answers, analytics, tracking, ads, crash reporting, backend behavior, cloud sync, account behavior, Apple Health, Google Fit, AI behavior, monetization, or permissions.

What changed in this lane: one internal documentation artifact only.

What users experience: no user-facing change.

Docs/disclosures required now: none. Final App Store Connect answers, public privacy policy text, public docs, store metadata, and legal/store claims require owner and legal review after this prep artifact.

Current repo behavior is the required evidence source for verified disclosure prep claims. Prior internal docs may support interpretation only where they match current repo behavior inspected during this lane.

## Apple Disclosure Frame

Apple's App Privacy Details guidance says App Store Connect privacy responses must account for data collected by the developer and by third-party partners whose code is integrated into the app. Apple also says developers are responsible for keeping responses accurate and up to date as practices change.

Apple frames "collect" around transmitting data off the device in a way that lets the developer or third-party partners access it for longer than needed to service the request in real time. Apple separately states that data processed only on device is not "collected" for App Store privacy-answer purposes, and any derived data sent off device should be considered separately.

Apple also asks whether collected data is linked to the user and whether it is used for tracking. Apple defines tracking around linking data collected from the app with third-party data for targeted advertising or advertising measurement, or sharing collected app data with a data broker.

Apple sources reviewed for this prep:

- Apple Developer, App Privacy Details: `https://developer.apple.com/app-store/app-privacy-details/`
- Apple Developer, Manage App Privacy: `https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy`

Disclosure rule for this Brunch Body prep: on-device-only data should not be inflated into an App Store "collected" data claim unless current repo evidence shows off-device transmission or third-party access. This is a prep rule only, not a final App Store Connect answer.

## Evidence Basis

Evidence labels used in this artifact:

- `verified current behavior`: directly supported by current repo files inspected during this lane.
- `supporting internal context`: prior internal docs that match current repo behavior but are not the source of truth by themselves.
- `unverified`: not proven by current repo evidence inspected during this lane.
- `out of scope / future surface`: excluded from this lane or reserved for future work.
- `owner/legal review required`: not safe to convert into final store or public language without review.

Current repo evidence inspected during this lane:

- Project and lane context: `docs/architecture/Brunch Body Project Scope.md`.
- Runtime mode and local-first config: `src/config/runtimeMode.js`, `src/config/appMode.js`.
- Store and local persistence: `package.json`, `src/redux/store/store.js`, `src/root-container/RootContainer.js`, `src/bootstrap/AppBootstrap.js`, `src/redux/actions/profileStorage.js`, `src/redux/actions/onboardingStorage.js`, `src/redux/actions/auth.js`, `src/storage/asyncStorageJson.js`, `src/redux/actions/nutritionStorage.js`, `src/redux/actions/calendarThemeStorage.js`, `src/redux/actions/exerciseStorage.js`, `src/redux/actions/recreationStorage.js`, `src/redux/actions/todoStorage.js`, `src/storage/mmkv/index.js`, `src/storage/mmkv/hydration.js`.
- Settings, export, and delete-local-data surfaces: `src/screens/setting/pages/Setting/Setting.js`, `src/screens/setting/components/Setting.js`, `src/screens/setting/pages/Export To CSV/ExportToCSV.js`, `src/screens/setting/components/Export To CSV/ExportToCSV.js`, `src/screens/setting/pages/MyProfile/DeleteAccount.js`, `src/screens/setting/components/My Profile/DeleteAccount.js`, `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js`.
- Native privacy, permission, and network config: `ios/BrunchBody/PrivacyInfo.xcprivacy`, `ios/BrunchBody/Info.plist`, `ios/Podfile`, `ios/Podfile.lock`, `android/app/src/main/AndroidManifest.xml`, `android/app/src/main/res/xml/network_security_config.xml`, `android/app/src/debug/res/xml/network_security_config.xml`, `android/app/build.gradle`.
- Dependency and local-only review inputs: `package.json`, `yarn.lock`, `scripts/check-local-only-mode.js`, targeted `rg` searches across `src`, `App.js`, `ios/BrunchBody`, `ios/Podfile`, `android/app/src/main`, and `android/app/build.gradle`.

Supporting internal context inspected during this lane:

- `docs/architecture/permission-and-access-transparency.md`
- `docs/architecture/data-export-and-portability-controls.md`
- `docs/architecture/local-only-contract-closeout.md`
- `docs/architecture/delete-reset-archive-semantics-decision.md`
- `docs/architecture/dependency-audit.md`
- `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md`

Supporting context warning: `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md` contains prior draft-style privacy summary language. This prep artifact does not reuse that language as a final App Store Connect answer. Current repo behavior and owner/legal review must control final submission wording.

## Current Data Handling Inventory

| Area | Prep classification | Current-behavior note | Repo evidence |
| --- | --- | --- | --- |
| Runtime posture | `verified current behavior` | Local-only mode is enabled, and the app-mode helper maps the current mode to `LOCAL_ONLY`. | `src/config/runtimeMode.js`; `src/config/appMode.js` |
| Persisted app state | `verified current behavior` | Redux Persist is configured with AsyncStorage and whitelists `auth`, `recreation`, `journal`, `nutrition`, `calendar`, `exercise`, and `todo`; `PersistGate` mounts the persisted store. | `src/redux/store/store.js`; `src/root-container/RootContainer.js` |
| Profile and first-route check | `verified current behavior` | Startup checks the direct local profile key before choosing the initial route; profile helpers read and write `user_profile` in AsyncStorage. | `src/bootstrap/AppBootstrap.js`; `src/redux/actions/profileStorage.js` |
| Onboarding draft data | `verified current behavior` | Onboarding draft keys are local AsyncStorage keys for `name`, `dob`, `height`, `weight`, and `gender`. | `src/redux/actions/onboardingStorage.js`; `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js` |
| Local credential residue | `verified current behavior` | Local password and reset-request sentinel values are stored in AsyncStorage by current auth actions. | `src/redux/actions/auth.js` |
| Domain storage read seams | `verified current behavior` | Nutrition, calendar themes, exercise, recreation, todo, and generic JSON helpers read app data from AsyncStorage-backed local keys. | `src/storage/asyncStorageJson.js`; `src/redux/actions/nutritionStorage.js`; `src/redux/actions/calendarThemeStorage.js`; `src/redux/actions/exerciseStorage.js`; `src/redux/actions/recreationStorage.js`; `src/redux/actions/todoStorage.js` |
| Bundled plan sidecar | `verified current behavior` | MMKV stores bundled Brunch Body plan data under a local `workout-storage` instance and seeds bundled plans when needed. | `src/storage/mmkv/index.js`; `src/storage/mmkv/hydration.js` |
| Selected journal export | `verified current behavior` | The Settings entry is `Export journal data`; the export screen creates selected journal-entry `.xlsx` workbooks using `xlsx`, `react-native-fs`, and `react-native-scoped-storage`. | `src/screens/setting/pages/Setting/Setting.js`; `src/screens/setting/pages/Export To CSV/ExportToCSV.js`; `src/screens/setting/components/Export To CSV/ExportToCSV.js`; `package.json` |
| Exported file boundary | `verified current behavior` | Export copy says exported files are user-managed after export and are not removed by Delete local data. | `src/screens/setting/pages/Export To CSV/ExportToCSV.js`; `src/screens/setting/components/Export To CSV/ExportToCSV.js`; `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js` |
| Delete local data | `verified current behavior` | The UI describes Delete local data as clearing Brunch Body app-managed local data on this device; the action dispatches `RESET_APP`, clears AsyncStorage, clears MMKV, and rehydrates bundled plans. | `src/screens/setting/pages/MyProfile/DeleteAccount.js`; `src/screens/setting/components/My Profile/DeleteAccount.js`; `src/redux/actions/auth.js`; `src/storage/mmkv/hydration.js` |
| Legal/support links | `verified current behavior` | Settings contains external HTTPS links for Terms of Use, Privacy Policy, and Support & Contact. | `src/screens/setting/pages/Setting/Setting.js`; `src/screens/setting/components/Setting.js` |
| Android permissions and network config | `verified current behavior` | Android declares `INTERNET`, `VIBRATE`, `WAKE_LOCK`, and `RECEIVE_BOOT_COMPLETED`; production config disables cleartext traffic. | `android/app/src/main/AndroidManifest.xml`; `android/app/src/main/res/xml/network_security_config.xml` |
| Android export permission path | `verified current behavior` | The selected journal export path checks and requests `WRITE_EXTERNAL_STORAGE` before export. | `src/screens/setting/pages/Export To CSV/ExportToCSV.js` |
| iOS privacy manifest | `verified current behavior` | The iOS privacy manifest declares required-reason accessed API categories for UserDefaults, FileTimestamp, and SystemBootTime; `NSPrivacyCollectedDataTypes` is empty and `NSPrivacyTracking` is false. | `ios/BrunchBody/PrivacyInfo.xcprivacy` |
| iOS App Transport Security | `verified current behavior` | `Info.plist` disables arbitrary loads and allows local networking. | `ios/BrunchBody/Info.plist` |
| Active app-code network calls | `unverified absence / review input` | Targeted source searches did not find active `axios`, `fetch`, `XMLHttpRequest`, or WebSocket call sites in `src` and `App.js`; this is search evidence, not a runtime network guarantee. | Targeted `rg` searches; `package.json`; `src/screens/setting/pages/Setting/Setting.js` |
| Analytics, ads, crash, monetization SDKs | `unverified absence / review input` | Targeted searches did not find named Firebase, Sentry, Bugsnag, Segment, Mixpanel, Amplitude, PostHog, AppCenter, AdMob, Crashlytics, RevenueCat, in-app-purchase, OneSignal, or Braze integrations in the inspected app/native surfaces. This is not a final SDK attestation. | Targeted `rg` searches; `package.json`; `ios/Podfile`; `android/app/build.gradle` |

## App Store Privacy Question Prep

This section maps current repo evidence to questions an App Store Connect preparer must later answer. It is not a final answer set.

| App Store question area | Current evidence map | Prep posture | Review needed before final entry |
| --- | --- | --- | --- |
| Does the app or third-party partners collect data from the app? | Verified app data paths are local AsyncStorage, Redux Persist, MMKV, and user-selected exported files. Targeted searches did not find active app-code network calls, analytics, ads, or crash SDK integrations, but Android declares `INTERNET`, Settings opens external HTTPS links, and `axios` is installed. | Do not call local-only app-managed data "collected" unless off-device transmission or third-party access is verified. Do not enter a final "No" answer from this prep alone. | Owner/legal review; release-build network review; dependency/native SDK review; public privacy policy alignment. |
| Which data types are involved if collection is later verified? | Current local app data includes profile, vitals, journal, fitness/workout, nutrition, supplements, calendar/todo/planning, themes, local credential residue, and exported selected journal workbook content. | Treat these as sensitive local data classes for evidence prep. They become App Store collected data types only if repo/release evidence shows qualifying off-device collection. | Data-type mapping by owner/legal reviewer if any off-device transmission or third-party access is found. |
| Is data linked to the user? | Current local data may include profile and health/fitness-related values, but linkage questions apply to collected data. | Do not answer linked/not-linked until a collected data type is verified. | Owner/legal review of any verified collected data and identifiers. |
| Is data used for tracking? | `ios/BrunchBody/PrivacyInfo.xcprivacy` sets `NSPrivacyTracking` false. Targeted repo searches did not find named ads/tracking SDK integrations in inspected surfaces. | Treat tracking as not repo-observed in current inspected surfaces, not as final App Store Connect approval. | Confirm no tracking SDK behavior, ATT usage, advertising identifiers, data broker sharing, or third-party data linkage in the release build. |
| Are third-party partners collecting data? | Active storage/export dependencies are present, and many React Native/native dependencies are integrated. No named analytics/ad/crash SDK integrations were observed in targeted searches. Some installed packages are network-capable or unresolved residue. | Dependency installation alone is not data collection. Integrated SDK behavior must be reviewed before final entry. | Owner/legal review; dependency privacy manifest review; native build inspection; release binary/privacy report review where available. |
| Are privacy links required? | Settings links to public Terms, Privacy Policy, and Support pages, but this lane does not inspect or approve public policy content. | This prep artifact does not validate privacy policy sufficiency. | Owner/legal review of public privacy policy URL and content before App Store Connect submission. |

## Local-Only Interpretation Notes

- Current repo evidence supports a Phase 1 local-first app posture through `src/config/runtimeMode.js`, `src/config/appMode.js`, local AsyncStorage paths, Redux Persist, MMKV, and current in-app Privacy & Data copy.
- Apple App Store privacy "collection" depends on qualifying off-device transmission/access. Local app-managed processing and storage must not be inflated into a collection claim unless current repo or release-build evidence shows data is transmitted off device in a way the developer or third-party partner can access beyond real-time request servicing.
- Installed network-capable dependencies, Android `INTERNET`, external HTTPS links, and native platform capabilities are review signals. They are not, by themselves, proof that user data is collected for App Store privacy answers.
- Exported files are different from app-managed local data. The current export flow writes selected journal `.xlsx` files to user-selected storage, and current copy treats exported files as user-managed after export.
- Do not use absolute claims such as "no internet access," "no network access," "data never leaves the device," "no third-party access risk," or "App Store ready" from this evidence.
- The draft posture remains conditional until dependency, native permission, network, export, release-build, owner, and legal review are complete.

## Third-Party Code and SDK Review

Apple requires App Store privacy disclosure prep to include third-party partners whose code is integrated into the app. The classifications below are review inputs only.

| Classification | Dependency or surface | Current repo evidence | Disclosure-prep note |
| --- | --- | --- | --- |
| Installed and active | AsyncStorage, Redux Persist, Redux/React Redux | Declared in `package.json`; store uses `redux-persist` with AsyncStorage in `src/redux/store/store.js`; `PersistGate` mounts in `src/root-container/RootContainer.js`; AsyncStorage helpers are used across `src/redux/actions/*Storage.js` and `src/storage/asyncStorageJson.js`. | Local persistence is active and trust-sensitive. Treat as on-device storage unless off-device transmission is separately verified. |
| Installed and active | `react-native-mmkv` | Declared in `package.json`; `src/storage/mmkv/index.js` creates the store; `src/storage/mmkv/hydration.js` seeds bundled plans. | Local sidecar storage is active. Review native/library behavior before final store answers. |
| Installed and active | `xlsx`, `react-native-fs`, `react-native-scoped-storage` | Declared in `package.json`; imported and used by `src/screens/setting/pages/Export To CSV/ExportToCSV.js`. | Export/file-write surface is active and disclosure-sensitive because exported files leave app-managed storage. |
| Installed and active | React Native, React, React Navigation, React Native Paper, vector icons, gesture/safe-area/screen and UI/input packages | Declared in `package.json`; imports and native build surfaces are present in `src`, `ios/Podfile`, `android/app/build.gradle`, and supporting navigation/UI files. | Integrated app dependencies require release dependency review, but current repo evidence does not by itself show data collection. |
| Installed but active runtime use not verified | `axios` | Declared in `package.json`; targeted searches did not find active `axios` imports or call sites in `src` or `App.js`. | Network-capable installed dependency. Do not treat as collection by installation alone; review before final App Store Connect entry. |
| Installed but active runtime use not verified | Expo family: `expo`, `expo-linear-gradient`, `expo-modules-core` | Declared in `package.json`; targeted app/native searches did not verify active runtime use. | Treat as dependency residue or unresolved integration until a targeted dependency review verifies status. |
| Installed but active runtime use not verified | `@react-native-community/datetimepicker`, `@react-native-picker/picker`, `@react-native/new-app-screen`, `redux-promise`, Reanimated/worklets-related packages | Declared in `package.json`; current targeted review did not settle runtime behavior for each package. | Do not turn installed-package presence into collection claims. Review native linkage and runtime behavior before final entry. |
| Not observed in repo | Named analytics, ads, crash, push/marketing, and monetization SDK families searched in this lane | Targeted searches did not find Firebase, Sentry, Bugsnag, Segment, Mixpanel, Amplitude, PostHog, AppCenter, AdMob, Crashlytics, RevenueCat, `react-native-iap`, OneSignal, or Braze integrations in inspected app/native surfaces. | Absence in targeted searches is not a legal attestation. Confirm in dependency, native, and release-build review. |
| Out of scope / future surface | Backend/cloud sync, accounts, AI, Apple Health, Google Fit, ads, tracking, crash reporting, analytics, monetization | No implementation is in this lane; current `src/config/runtimeMode.js` reserves future backend reintroduction behind local-only mode, and `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js` says current app does not automatically sync to a Brunch Body cloud account. | Do not disclose as current behavior unless a future implementation lane adds and verifies it. |
| Requires owner/legal review | Any final third-party partner data collection statement | Apple requires third-party partner practices to be included, and current repo evidence alone cannot prove every integrated SDK's runtime data behavior. | Owner/legal review must approve final App Store Connect answers. |

## Unverified or Out-of-Scope Behaviors

The following are unverified or out of scope for this prep artifact and must not become App Store Connect answers without separate evidence:

- Final "Data Not Collected" App Store Connect answer.
- Final linked-to-user, tracking, data-use, or data-type selections.
- Public privacy policy sufficiency or legal approval.
- Release-build network behavior, dependency-level telemetry, SDK diagnostics, native library behavior, or platform privacy-report output.
- Whether OS backups, device-transfer tools, iCloud/Google backup behavior, shared folders, or user-selected cloud storage include app data or exported files.
- Import, restore, full backup, all-data export, cross-device sync, cloud sync, backend account storage, account deletion, or account recovery.
- Apple Health, Google Fit, AI processing, ads, tracking, analytics, crash reporting, push notification, monetization, or third-party marketing integrations.
- Native permission behavior beyond the inspected manifests, privacy manifest, Info.plist, Android network config, and export permission code path.

## Draft Disclosure Posture

This is a conservative prep posture only, not a final App Store Connect answer:

- Current repo evidence supports treating Brunch Body Phase 1 app-managed user data as local-first and device-local for prep purposes.
- Local app data should not be represented as "collected" in App Store privacy prep unless current repo or release-build evidence shows qualifying off-device transmission or third-party access.
- Exported selected journal workbooks should be treated as user-managed exported copies after export, not as app-managed backend collection by default. Their destination may have its own privacy and backup behavior outside Brunch Body's control.
- Installed dependencies and platform permissions should be treated as review signals, not automatic collection claims.
- The iOS privacy manifest currently declares no collected data types and tracking false, but this artifact does not approve that manifest as a final App Store Connect answer.
- Any final posture must remain conditional until dependency review, native permission review, network review, export review, release-build review, public privacy policy review, owner review, and legal review are complete.

## Final Submission Checklist

Before any App Store Connect privacy submission or published update, confirm:

- The exact release build has been reviewed, not only source docs.
- Current app source, native manifests, iOS privacy manifest, package files, lockfiles, Pod/Gradle surfaces, and dependency privacy manifests have been checked.
- Active network calls, external links, web views, SDK telemetry, diagnostics, analytics, crash reporting, ads, identifiers, tracking, and backend paths have been reviewed.
- All local storage and export behavior has been mapped by data type and sensitivity.
- Any off-device transmission has been mapped to Apple data type, data use, linked-to-user status, and tracking status.
- Third-party partner collection has been reviewed for integrated SDKs and native dependencies.
- Public privacy policy URL/content and any privacy choices URL are owner/legal approved.
- In-app copy, public docs, support copy, privacy policy, platform disclosures, and App Store Connect answers are aligned with the release behavior.
- The final answer does not rely on roadmap intent, older docs, or package installation alone.
- Owner/legal has approved final App Store Connect entries.

## Non-Goals

This artifact does not:

- Submit or generate final App Store Connect answers.
- Claim Brunch Body is App Store ready or launch ready.
- Provide legal advice, legal approval, or privacy policy language.
- Change app behavior, storage behavior, export behavior, permissions, native config, source code, tests, CI, dependencies, package files, lockfiles, public docs, README content, release notes, store metadata, or privacy policy files.
- Add analytics, tracking, ads, crash reporting, backend, cloud sync, accounts, Apple Health, Google Fit, AI, monetization, push notifications, import, restore, backup, or all-data export behavior.
- Expand or weaken the current local-first posture.

## Validation

Validation for this docs-only lane:

- Confirm the only lane-created file is `docs/architecture/app-store-privacy-disclosure-prep.md`.
- Run `git diff --check`.
- Run `git status --short --untracked-files=all`.
- Expected status caveat: `docs/architecture/backup-responsibility-ux.md` was already untracked before this lane and should remain untouched. It is not part of this lane.
- Confirm no app source, tests, CI workflows, public docs, privacy policy, package files, lockfiles, native manifests, or store metadata changed.
