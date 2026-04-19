# Platform Privacy Disclosures (Release Candidate 1.0.0-rc2)

_Last reviewed: 2026-04-19_

## iOS App Store Connect + Privacy Manifest

### Privacy manifest file
- Source of truth: `ios/BrunchBody/PrivacyInfo.xcprivacy`.
- `NSPrivacyTracking = false`.
- `NSPrivacyCollectedDataTypes` is intentionally empty because this build does not transmit user data off device.
- Accessed Required Reason APIs declared:
  - UserDefaults (`CA92.1`, `1C8F.1`, `C56D.1`)
  - FileTimestamp (`C617.1`)
  - SystemBootTime (`35F9.1`)

### Data handling summary for App Privacy questionnaire
- Data linked to user: **No**
- Tracking: **No**
- Third-party advertising / SDK tracking: **No**
- Data collection by developer server: **No (local-only storage model in current build)**

## Google Play Data Safety

Declare the following for this release candidate:
- Data collected: **No** (developer-server collection not implemented)
- Data shared: **No**
- Data processed ephemerally for analytics/ads: **No**
- Security practices:
  - Data is stored locally on device (AsyncStorage/MMKV)
  - HTTPS links are used for legal/support web pages

## Verification Notes
- Settings legal/support links resolve successfully with HTTP 200:
  - `https://brunchbodyfit.com/terms-conditions/`
  - `https://brunchbodyfit.com/privacy-policy/`
  - `https://brunchbodyfit.com/contact-us/`
- Repository scan confirms user data persistence is local-device storage only in current app paths:
  - AsyncStorage is used across profile, navigation bootstrap, and Redux action persistence.
  - No analytics/ads SDKs are integrated for tracking or third-party data sharing.
  - Export journal data writes local `.xlsx` workbook files via `react-native-fs`.
  - `Delete local data` removes on-device app data, does not remove user-exported copies outside app-controlled storage, and may re-seed bundled starter plans included with the app.
