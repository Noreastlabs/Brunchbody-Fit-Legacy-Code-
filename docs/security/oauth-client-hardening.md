# Google OAuth Client Hardening Checklist (iOS)

This project currently uses the iOS OAuth URL scheme/client identifier declared in `ios/BrunchBody/Info.plist`:

- Reversed client ID (redirect URL scheme):
  - `com.googleusercontent.apps.719080501603-jtfuc0ft8v83milid7pdfa92rfcc4vl6`
- OAuth client ID:
  - `719080501603-jtfuc0ft8v83milid7pdfa92rfcc4vl6.apps.googleusercontent.com`

## 1) Map `Info.plist` client identifier to the Google Cloud OAuth app

In Google Cloud Console (**APIs & Services → Credentials**), this value maps to exactly one OAuth app:

| Source in repo | Google Cloud object | Required production value |
| --- | --- | --- |
| `CFBundleURLSchemes` = `com.googleusercontent.apps.719080501603-jtfuc0ft8v83milid7pdfa92rfcc4vl6` | iOS OAuth 2.0 Client ID | `719080501603-jtfuc0ft8v83milid7pdfa92rfcc4vl6.apps.googleusercontent.com` |
| iOS app identity (`PRODUCT_BUNDLE_IDENTIFIER`) | Authorized bundle ID on that iOS OAuth client | `com.brunchbody` |

The reversed-client-id scheme must correspond to the same OAuth client as the iOS bundle ID above.

## 2) Restrict bundle IDs / redirect schemes to production-only values

In the iOS OAuth client configuration in Google Cloud:

- Keep only bundle ID `com.brunchbody`.
- Remove test, debug, localhost, and retired bundle IDs.
- Ensure the app only uses the production reversed-client-id scheme:
  - `com.googleusercontent.apps.719080501603-jtfuc0ft8v83milid7pdfa92rfcc4vl6`

In this repo, `Info.plist` registers that scheme once under `CFBundleURLTypes`.

## 3) Remove unused scopes and keep consent screen minimal

In **Google Auth Platform → OAuth consent screen**:

- Keep only baseline Sign in with Google scopes actually required by the app:
  - `openid`
  - `email`
  - `profile`
- Remove any extra scopes not required by current features (especially sensitive/restricted scopes).
- Ensure app name, support email, authorized domain(s), and privacy policy links match production metadata.
- Ensure publishing status and user type are correct for production release.

## 4) Secret handling policy (repo-level)

OAuth **client IDs are public identifiers** and may appear in app metadata.

Never commit any of the following:

- OAuth client secrets
- Refresh tokens / access tokens
- Service account private keys

Store secrets in secure secret managers/CI variables and rotate immediately if exposure is suspected.
