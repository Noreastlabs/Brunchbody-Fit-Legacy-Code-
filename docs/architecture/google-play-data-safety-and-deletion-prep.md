# Google Play Data Safety and Deletion Prep

Last reviewed: 2026-04-28

## Status and Scope

This is an internal Google Play Data safety and deletion preparation artifact for Brunch Body.

This artifact is not legal advice, not a final Play Console submission, not a privacy policy, not a public user-facing statement, and not a behavior change. It does not approve Google Play Data safety answers, deletion answers, store listing text, public privacy-policy text, release-readiness claims, or legal/privacy claims.

This lane changes no app behavior, source code, tests, CI, Android manifests, package files, dependency behavior, storage behavior, export behavior, delete/reset semantics, privacy posture, public docs, privacy policy, store metadata, Play Console answers, analytics, tracking, ads, crash reporting, backend behavior, cloud sync, account behavior, Google Fit, Health Connect, AI behavior, monetization, or permissions.

What changed in this lane: one internal documentation artifact only.

What users experience: no user-facing change.

Docs/disclosures required now: none. Final Play Console answers, public privacy policy text, public docs, store metadata, and legal/store claims require owner and privacy/legal review after this prep artifact.

Current repo behavior is the required evidence source for verified Google Play prep notes. Prior internal docs may support interpretation only where they match current repo behavior inspected during this lane.

## Google Play Policy Frame

Google Play sources reviewed for this prep:

- Google Play Console Help, Provide information for Google Play's Data safety section: `https://support.google.com/googleplay/android-developer/answer/10787469?hl=en`
- Google Play Console Help, User Data policy: `https://support.google.com/googleplay/android-developer/answer/10144311?hl=en`
- Google Play Console Help, Understanding Google Play's app account deletion requirements: `https://support.google.com/googleplay/android-developer/answer/13327111?hl=en`

Prep-only interpretation rules for Brunch Body:

- Google Play requires developers to complete Data safety information for published apps, including apps that do not collect user data, and to keep declarations accurate when behavior changes.
- Google Play Data safety prep must review collection, sharing, security practices, permissions/APIs, and third-party SDK behavior. SDK behavior matters even if data is transmitted to a third party instead of directly to the developer.
- Google Play frames "collect" around transmitting data off the user's device. Brunch Body local app storage should not be inflated into a collection claim unless repo/release evidence shows off-device transmission.
- Google Play's User Data policy requires a privacy policy link in Play Console and a privacy policy link or text in the app. The policy must be publicly accessible and consistent with app data handling.
- Google Play account deletion obligations apply when the app lets users create an app account. Google describes an app account as a developer-provided user-facing identity used across apps or devices, typically involving authentication or verification. Accounts created and operated offline are not in scope for that specific app-account policy requirement.
- If a future Brunch Body version adds account creation or developer-held off-device user data, Google Play deletion prep must be reopened before submission.

This Google Play frame is different from Apple's privacy questionnaire and iOS privacy manifest frame. Do not copy Apple prep answers into Google Play answers without Android-specific evidence review.

## Evidence Basis

Evidence labels used in this artifact:

- `verified current behavior`: directly supported by current repo files inspected during this lane.
- `review input`: search or configuration evidence that should guide a later reviewer, but is not a final claim by itself.
- `unverified absence`: targeted searches did not find a surface, but this is not a legal or runtime attestation.
- `out of scope / future surface`: not implemented or not approved by this lane.
- `owner/privacy review required`: not safe to convert into public or Play Console language without review.

Current repo evidence inspected during this lane:

- Project and local-first context: `README.md`, `docs/architecture/Brunch Body Project Scope.md`, `docs/architecture/Brunch Body Project Template.md`.
- Prior privacy/disclosure prep: `docs/architecture/app-store-privacy-disclosure-prep.md`, `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md`, `docs/public/brunch-body-privacy-and-data.md`.
- Runtime mode: `src/config/runtimeMode.js`, `src/config/appMode.js`.
- Android app metadata and security posture: `android/build.gradle`, `android/app/build.gradle`, `android/app/src/main/AndroidManifest.xml`, `android/app/src/main/res/xml/network_security_config.xml`.
- Local persistence and deletion behavior: `src/redux/store/store.js`, `src/redux/actions/auth.js`, `src/redux/actions/profileStorage.js`, `src/redux/actions/onboardingStorage.js`, `src/storage/mmkv/index.js`, `src/storage/mmkv/hydration.js`.
- Settings, privacy, export, and deletion surfaces: `src/screens/setting/pages/Setting/Setting.js`, `src/screens/setting/components/Setting.js`, `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js`, `src/screens/setting/pages/MyProfile/DeleteAccount.js`, `src/screens/setting/components/My Profile/DeleteAccount.js`, `src/screens/setting/pages/Export To CSV/ExportToCSV.js`, `src/screens/setting/components/Export To CSV/ExportToCSV.js`.
- Account/profile semantic context: `docs/architecture/local-only-contract-closeout.md`, `docs/architecture/delete-reset-archive-semantics-decision.md`, `docs/architecture/delete-reset-archive-current-state-audit.md`, `docs/architecture/profile-auth-onboarding-retention-truth-check.md`.
- Dependency and SDK review inputs: `package.json`, `yarn.lock`, targeted `rg` searches across `src`, `App.js`, `android`, `ios`, and `package.json`.

Supporting context warning: `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md` contains prior release-candidate Google Play summary language. This prep artifact does not reuse that file as final Play Console evidence. Current repo behavior and owner/privacy review must control final submission wording.

## Key Decisions for This Prep

- Treat Phase 1 Android as no user-facing accounts, with local profile/onboarding data only.
- Treat legacy account-named code, routes, and internal action names as implementation residue, not as proof of a Google Play app account.
- Treat `Delete local data` as device-local app-managed data deletion only.
- Do not claim deletion of exported files, OS backups, shared/copied/uploaded files, cloud folders, or data outside app-managed storage.
- Do not create or require a Google Play account-deletion web resource now. Revisit only if accounts or developer-held off-device user data are introduced later.
- Keep this artifact internal-only. Public privacy-policy edits or public gap lists require a later lane.

## Current Android and Data Handling Inventory

| Area | Prep classification | Current-behavior note | Repo evidence |
| --- | --- | --- | --- |
| Android package metadata | `verified current behavior` | Android package is `com.brunchbody`; version code is `7`; version name is `1.0.3-rc.2`; min SDK is `24`; compile and target SDK are `35`. | `android/build.gradle`; `android/app/build.gradle` |
| Android permissions | `verified current behavior` | Main manifest declares `INTERNET`, `VIBRATE`, `WAKE_LOCK`, and `RECEIVE_BOOT_COMPLETED`. | `android/app/src/main/AndroidManifest.xml` |
| Android backup and network security | `verified current behavior` | Main manifest sets `android:allowBackup="false"` and `android:usesCleartextTraffic="false"` with a production network security config whose base config disables cleartext traffic. | `android/app/src/main/AndroidManifest.xml`; `android/app/src/main/res/xml/network_security_config.xml` |
| Runtime posture | `verified current behavior` | Local-only mode is enabled, and app mode maps to `LOCAL_ONLY`. | `src/config/runtimeMode.js`; `src/config/appMode.js` |
| Persisted app state | `verified current behavior` | Redux Persist uses AsyncStorage and whitelists app slices for local persisted state. | `src/redux/store/store.js` |
| Profile and onboarding data | `verified current behavior` | Profile and onboarding helpers use direct AsyncStorage keys for local profile and draft setup data. | `src/redux/actions/profileStorage.js`; `src/redux/actions/onboardingStorage.js` |
| Local credential residue | `verified current behavior` | Local password and reset-request sentinel values can be stored in AsyncStorage by current auth actions. These are local app data, not backend account evidence. | `src/redux/actions/auth.js`; `docs/architecture/profile-auth-onboarding-retention-truth-check.md` |
| Bundled plan sidecar | `verified current behavior` | MMKV stores bundled Brunch Body plan data and can rehydrate starter plans when missing or after local clear. | `src/storage/mmkv/index.js`; `src/storage/mmkv/hydration.js` |
| Delete local data | `verified current behavior` | Delete local data dispatches `RESET_APP`, clears AsyncStorage, clears MMKV, then rehydrates bundled starter plans. | `src/redux/actions/auth.js`; `src/screens/setting/pages/MyProfile/DeleteAccount.js`; `src/screens/setting/components/My Profile/DeleteAccount.js` |
| Delete boundary copy | `verified current behavior` | UI says Delete local data clears app-managed local data on this device and does not delete exported, copied, shared, moved, backed-up, uploaded, cloud-folder, OS-backup, or otherwise external files. | `src/screens/setting/pages/MyProfile/DeleteAccount.js`; `src/screens/setting/components/My Profile/DeleteAccount.js`; `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js` |
| Selected journal export | `verified current behavior` | Current export surface exports selected journal entry types to Excel workbook files (`.xlsx`) using `xlsx`, `react-native-fs`, and `react-native-scoped-storage`. | `src/screens/setting/pages/Export To CSV/ExportToCSV.js`; `src/screens/setting/components/Export To CSV/ExportToCSV.js`; `package.json` |
| Android storage permission path | `review input` | Export code checks and requests `PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE`; main manifest review did not observe a corresponding storage permission declaration. Treat as export-surface evidence for later Android review, not a final permissions answer. | `src/screens/setting/pages/Export To CSV/ExportToCSV.js`; `android/app/src/main/AndroidManifest.xml` |
| Exported-file boundary | `verified current behavior` | Export copy says exported files are user-managed after export and not removed by Delete local data. | `src/screens/setting/components/Export To CSV/ExportToCSV.js`; `src/screens/setting/pages/Export To CSV/ExportToCSV.js` |
| In-app privacy surface | `verified current behavior` | Settings exposes `Privacy & Data` and a public `Privacy Policy` link. The Privacy & Data screen describes local-first behavior, no automatic Brunch Body cloud sync, no automatic Brunch Body cloud backup, export sensitivity, and Delete local data limits. | `src/screens/setting/pages/Setting/Setting.js`; `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js` |
| Public privacy/support links | `verified current behavior` | Settings contains HTTPS links for Terms of Use, Privacy Policy, and Support & Contact. This artifact does not verify public policy content sufficiency. | `src/screens/setting/pages/Setting/Setting.js`; `src/screens/setting/components/Setting.js` |
| Active app-code network calls | `unverified absence` | Targeted searches did not find active `axios`, `fetch`, `XMLHttpRequest`, or WebSocket call sites in `src` or `App.js`. Settings uses `Linking.openURL` for legal/support links. | Targeted `rg` searches; `src/screens/setting/pages/Setting/Setting.js`; `src/screens/setting/components/Setting.js` |
| Network-capable dependency residue | `review input` | `axios` is installed, but targeted searches did not find active app-code imports or call sites. Installation alone is not a collection claim. | `package.json`; targeted `rg` searches |
| Analytics, ads, crash, push, monetization SDKs | `unverified absence` | Targeted searches did not find named Firebase, Crashlytics, Sentry, Bugsnag, AppCenter, Segment, Mixpanel, Amplitude, PostHog, AdMob, RevenueCat, OneSignal, Braze, or similar active integrations in inspected surfaces. | `package.json`; targeted `rg` searches |
| Health integrations | `unverified absence` | Targeted searches did not find Google Fit, Health Connect, or `react-native-health` integrations in inspected surfaces. | `package.json`; targeted `rg` searches |

## Account and Deletion Prep Posture

This section is prep-only and must not be copied into Play Console as final answers.

Current repo evidence supports treating Phase 1 as no user-facing Google Play app account:

- The live Settings surface exposes profile editing, export, Delete local data, and privacy/legal/help surfaces.
- Local profile setup and profile editing are device-local behavior backed by AsyncStorage and persisted app state.
- Prior closeout docs classify account-oriented internal names as legacy residue where not user-facing.
- Google Play's app-account deletion policy should not be triggered by local profile setup alone unless a future lane verifies a user-facing developer account creation flow.

Current deletion posture for prep:

- `Delete local data` clears Brunch Body app-managed local data on this device through AsyncStorage/MMKV local clear behavior.
- `Delete local data` is not account deletion, cloud deletion, backend deletion, exported-file deletion, OS-backup deletion, or deletion from copied/shared/uploaded/cloud-folder files.
- Starter content included with Brunch Body may appear again after local data deletion because bundled plan hydration runs after the clear path.
- No Google Play account-deletion web resource is needed for current prep unless later evidence shows account creation or developer-held off-device user data.

## Third-Party SDK and Dependency Review Inputs

This section is a review input only, not a final third-party data-sharing statement.

| Dependency or surface | Current evidence | Google Play prep note |
| --- | --- | --- |
| AsyncStorage and Redux Persist | Declared in `package.json`; Redux Persist uses AsyncStorage in `src/redux/store/store.js`; storage helpers use AsyncStorage. | Active local storage. Treat as on-device storage unless off-device transmission is separately verified. |
| `react-native-mmkv` | Declared in `package.json`; MMKV storage and hydration files are active. | Active local sidecar storage for bundled plan data. Review native library behavior before final store answers. |
| `xlsx`, `react-native-fs`, `react-native-scoped-storage` | Declared in `package.json`; used by selected journal export flow. | Active export/file-write surface. Exported files are user-managed after export and disclosure-sensitive. |
| React Native, React Navigation, UI, chart, picker, gesture, safe-area, SVG, and related app dependencies | Declared in `package.json` and integrated by app source/native build. | Integrated dependencies require release dependency review, but presence alone does not prove user-data collection. |
| `axios` | Declared in `package.json`; no active app-code imports or call sites found by targeted search. | Network-capable dependency residue or unresolved integration. Do not treat installation alone as collection. |
| Expo family packages | Declared in `package.json`; targeted search did not settle every runtime path. | Review native linkage and runtime behavior before final Google Play answers. |
| Named analytics, ads, crash, push, and monetization SDK families | Targeted searches did not find active integrations in inspected surfaces. | Absence in targeted search is not a legal attestation. Confirm with dependency, native, and release-build review. |
| Google Fit, Health Connect, and health-platform SDK families | Targeted searches did not find active integrations in inspected surfaces. | Treat as not repo-observed, not as a final health-data integration attestation. |

## Google Play Answer Prep Map

This map identifies what a later reviewer must decide. It is not a Play Console answer set.

| Google Play area | Current evidence map | Prep posture | Review needed before final entry |
| --- | --- | --- | --- |
| Does the app collect or share user data? | Verified app data paths are local AsyncStorage, Redux Persist, MMKV, and user-selected exported files. Targeted searches did not find active app-code user-data network calls or analytics/ads/crash SDKs, but Android declares `INTERNET`, Settings opens external HTTPS legal/support links, and `axios` is installed. | Do not draft a final "No collection" or "No sharing" answer from this prep alone. Treat local-only evidence as strong review input, not a final Play Console claim. | Owner/privacy review; release-build network review; SDK/dependency review; public privacy-policy alignment. |
| Which data types would matter if collection is later verified? | Local app data can include profile/nickname/email-like values if saved, date of birth, gender, height, weight, BMI/BMR-derived display values, fitness/workout data, nutrition/supplement data, journal/reflection data, calendar/todo data, and exported workbook content. | Treat these as sensitive local data categories for evidence prep. They become Google Play collected/shared data types only if off-device transmission or sharing is verified. | Data-type mapping by privacy reviewer if any collection/sharing is found. |
| Is data encrypted in transit? | Production Android cleartext traffic is disabled, and Settings links are HTTPS. No active user-data network call path was found in targeted source searches. | Do not make a final in-transit encryption answer until all verified collection/sharing paths are known. | Release-build network and SDK review. |
| Does the app provide a way to request data deletion? | Current app provides Delete local data, scoped to app-managed local data on the device. No developer-held backend data path was verified. | Distinguish local data deletion from Google Play account deletion or developer-server data deletion. | Owner/privacy review of how Google Play's deletion question should be answered for a local-only app. |
| Does the app allow account creation? | Current live Phase 1 posture is no user-facing accounts. Legacy account-named files and internal route/action names remain but are not live account-creation evidence. | Treat no-account posture as the prep default. Do not create a web deletion resource from current evidence. | Reopen if future evidence shows account creation, login, cross-device identity, server-side account data, or reviewer-visible account terminology. |
| Privacy policy alignment | Settings has a Privacy Policy HTTPS link and in-app Privacy & Data text. This artifact does not inspect or approve hosted policy content. | Public policy edits are out of scope for this lane. | Later owner/privacy review of hosted policy content, Play Console policy link, and in-app consistency. |

## Unverified or Out-of-Scope Behaviors

The following must not become Play Console answers without separate evidence:

- Final Google Play Data safety "Data collected" answer.
- Final Google Play Data safety "Data shared" answer.
- Final security-practices answers, including encryption-in-transit answers.
- Final data deletion answers.
- Final account creation or account deletion answers.
- Public privacy-policy sufficiency or legal approval.
- Release-build network behavior, dependency telemetry, SDK diagnostics, native library behavior, Google Play SDK Index findings, or binary/runtime traffic inspection.
- Whether operating-system backups, device-transfer tools, cloud folders, or user-selected storage destinations include exported files or app data.
- Google Fit, Health Connect, ads, analytics, crash reporting, push notification, monetization, AI processing, backend sync, cloud sync, import, restore, all-data export, account recovery, account deletion, or web deletion request flows.

## Draft Disclosure Posture

This is conservative prep posture only, not final Google Play language:

- Current repo evidence supports treating Brunch Body Phase 1 app-managed user data as local-first and device-local for prep purposes.
- Local app data should not be represented as Google Play "collected" user data unless current repo or release-build evidence shows off-device transmission by the app or integrated SDKs.
- Exported selected journal workbooks should be treated as user-managed exported copies after export, not as app-managed backend collection by default. Their destination may have its own privacy, backup, retention, and sharing behavior outside Brunch Body's control.
- Android `INTERNET`, installed network-capable dependencies, and integrated third-party code are review signals. They are not, by themselves, final collection or sharing claims.
- Account deletion web-resource obligations should be revisited only if account creation or developer-held off-device user data are introduced.

## Final Review Checklist Before Play Console Work

Before any Play Console Data safety or deletion submission, confirm:

- The exact Android release build has been reviewed, not only source docs.
- Android manifests, Gradle config, dependency manifests, package files, lockfiles, and native integrations have been checked.
- Active network calls, external links, web views, SDK telemetry, diagnostics, analytics, crash reporting, ads, identifiers, tracking, backend paths, and health integrations have been reviewed.
- Third-party SDK behavior has been reviewed, including any SDK-provider data collection or sharing.
- Android permissions and sensitive APIs have been mapped to current app functionality.
- Local storage, local profile/onboarding data, local credential residue, domain data, export behavior, and Delete local data behavior have been mapped.
- Any off-device transmission has been mapped to Google Play data type, purpose, collection/sharing status, encryption-in-transit status, optional/required status, and deletion request handling.
- Public privacy policy URL/content and in-app Privacy & Data copy are reviewed for consistency with final Play Console answers.
- Owner/privacy/legal reviewers approve final Google Play entries.

## Validation for This Docs-Only Lane

Required validation:

```bash
yarn check:local-only
git diff --check
git status --short --untracked-files=all
```

Focused evidence searches:

```bash
rg -n "(uses-permission|allowBackup|usesCleartextTraffic|networkSecurityConfig|applicationId|versionCode|versionName|targetSdkVersion|minSdkVersion|compileSdk)" android/app/src/main/AndroidManifest.xml android/app/build.gradle android/build.gradle
rg -n "(axios|fetch\\(|XMLHttpRequest|WebSocket|Linking\\.openURL|http://|https://|PermissionsAndroid|WRITE_EXTERNAL_STORAGE|READ_EXTERNAL_STORAGE|MANAGE_EXTERNAL_STORAGE)" src App.js android ios package.json
rg -n "(firebase|analytics|crashlytics|sentry|bugsnag|admob|advertising|ads|appcenter|segment|mixpanel|amplitude|posthog|revenuecat|onesignal|braze|Health Connect|HealthConnect|Google Fit|GoogleFit|react-native-health|fit\\.google|expo-notifications|push notification|notification)" src android ios package.json
rg -n "(account|login|log in|logout|sign.?in|sign.?up|Delete Account|Delete local data|cloud|sync|export|privacy policy|Privacy & Data|Data safety|Google Play)" src docs/architecture docs/privacy docs/public README.md package.json android ios
```

Expected file-change boundary:

- Only `docs/architecture/google-play-data-safety-and-deletion-prep.md` should be added or changed by this lane.
- No app source, tests, CI workflows, public docs, privacy policy, package files, lockfiles, native manifests, permissions, or store metadata should change.
