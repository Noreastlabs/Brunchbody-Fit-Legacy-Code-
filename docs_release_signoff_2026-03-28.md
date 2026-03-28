# Release Sign-off — 2026-03-28

## 1) Policy / Support Link Validation (`Setting.js`)
Validated the three external links referenced by the **About** section in settings:

- Terms of Use → `https://brunchbodyfit.com/terms-conditions/`
- Privacy Policy → `https://brunchbodyfit.com/privacy-policy/`
- Support & Contact → `https://brunchbodyfit.com/contact-us/`

Validation command:

```bash
for u in https://brunchbodyfit.com/terms-conditions/ https://brunchbodyfit.com/privacy-policy/ https://brunchbodyfit.com/contact-us/; do
  curl -I -L -s -o /tmp/hdr -w "%{http_code} %{url_effective}\n" "$u"
done
```

Result: all three URLs resolved with HTTP 200 on 2026-03-28.

## 2) iOS Privacy Manifest Check (`ios/BrunchBody/PrivacyInfo.xcprivacy`)
Manifest currently declares:

- `NSPrivacyAccessedAPICategoryUserDefaults`
- `NSPrivacyAccessedAPICategoryFileTimestamp`
- `NSPrivacyAccessedAPICategorySystemBootTime`
- `NSPrivacyCollectedDataTypes = []`
- `NSPrivacyTracking = false`

Codebase review did not find first-party use of camera, mic, photos, contacts, location, health, or tracking APIs. Current declarations remain aligned with observed app behavior and library profile.

## 3) Version / Build Number Bump
Prepared next candidate versions:

- **App semver**: `1.0.1` → `1.0.2`
- **Android**: `versionName 1.0.2`, `versionCode 5`
- **iOS**: `MARKETING_VERSION 1.0.2`, `CURRENT_PROJECT_VERSION 5`

## 4) Signed Candidate Build + Smoke Test Outcome
### Smoke tests
- `yarn test --watch=false` ✅ pass (2/2 suites)
- `yarn check:local-only` ✅ pass
- `yarn lint` ❌ fail (eslint plugin resolution for this environment/dependency set)

### Signed candidates
- Android release build attempt blocked in this environment (`ANDROID_HOME`/SDK missing).
- iOS archive/sign attempt blocked in this environment (`xcodebuild` unavailable on Linux container).

## Go / No-Go
**NO-GO** for final signed release promotion from this environment.

Reason: signed artifacts cannot be produced here due missing mobile build toolchains/signing environment, and lint gate is currently failing.
