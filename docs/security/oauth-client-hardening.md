# Google OAuth Client Hardening Checklist (iOS)

This project currently uses the iOS OAuth URL scheme/client identifier declared in `ios/BrunchBody/Info.plist`:

- `com.googleusercontent.apps.719080501603-jtfuc0ft8v83milid7pdfa92rfcc4vl6`

## 1) Locate the OAuth client in Google Cloud

1. Open **Google Cloud Console** for the project that owns this app.
2. Go to **APIs & Services → Credentials**.
3. Find the **OAuth 2.0 Client IDs** entry whose value matches:
   - `719080501603-jtfuc0ft8v83milid7pdfa92rfcc4vl6.apps.googleusercontent.com`
4. Confirm the client type is **iOS**.

## 2) Restrict to intended app identity and redirect usage

In the iOS OAuth client configuration:

- Set **Bundle ID** to only the shipped app bundle identifier(s).
- Do not keep stale bundle IDs from test or retired apps.
- Ensure redirects are only via the iOS reversed-client-id URL scheme:
  - `com.googleusercontent.apps.719080501603-jtfuc0ft8v83milid7pdfa92rfcc4vl6`

In this repo, the app only registers that scheme once in `Info.plist` under `CFBundleURLTypes`.

## 3) Remove unused scopes and verify consent screen settings

In **Google Auth Platform → OAuth consent screen**:

- Keep only scopes actively required by current app features.
- Remove broad/unused scopes (especially sensitive or restricted scopes).
- Verify app publishing status and test-user configuration are correct.
- If sensitive/restricted scopes are required, ensure verification is complete and current.

## 4) Secret handling policy (repo-level)

OAuth **client IDs are public identifiers** and may appear in app metadata.

Never commit any of the following:

- OAuth client secrets
- Refresh tokens / access tokens
- Service account private keys

Store secrets in secure secret managers/CI variables and rotate immediately if exposure is suspected.
