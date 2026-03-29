# Google OAuth Hardening Record (iOS)

_Last updated: 2026-03-29_

## Current application behavior

BrunchBody currently ships without Sign in with Google or any other OAuth-based login flow. Authentication/onboarding is local-only in the app runtime.

## 1) Repository review of iOS OAuth client identifier references

Verification completed against `ios/BrunchBody/Info.plist` and iOS project settings:

- `ios/BrunchBody/Info.plist` has no Google OAuth client identifier literal and no `CFBundleURLTypes` entry for OAuth redirects.
- `CFBundleIdentifier` is dynamic (`$(PRODUCT_BUNDLE_IDENTIFIER)`), resolved from Xcode build settings.
- Active iOS bundle identifier value in project settings: `com.brunchbody`.

Historical iOS redirect scheme/client pair (previously used and now removed from app metadata):

- Reversed client ID scheme: `com.googleusercontent.apps.719080501603-jtfuc0ft8v83milid7pdfa92rfcc4vl6`
- OAuth client ID: `719080501603-jtfuc0ft8v83milid7pdfa92rfcc4vl6.apps.googleusercontent.com`

In Google Cloud Console (**Google Auth Platform → Clients** or **APIs & Services → Credentials**), this identifier maps to one iOS OAuth client. Use that exact client as the target for hardening/decommissioning actions below.

## 2) Google Cloud Console hardening: authorized identity + redirect/scheme restrictions

Because OAuth is not used by the current app, the intended values are:

- **Production app OAuth redirect schemes:** none
- **Development app OAuth redirect schemes:** none
- **Authorized iOS bundle IDs on active OAuth clients for this app:** none (preferred), or only `com.brunchbody` if temporary retention is required

Manual cloud actions (outside this repository):

1. Open the mapped iOS OAuth client in Google Cloud Console.
2. Remove inactive/test bundle IDs and any OAuth redirect scheme values.
3. Prefer disabling or deleting the unused iOS OAuth client entirely.
4. If deletion is temporarily blocked, keep only `com.brunchbody` as the authorized bundle ID and no extra redirect/scheme values.

Repository alignment for this decision:

- Google OAuth URL scheme is absent from `ios/BrunchBody/Info.plist`.

## 3) Scope minimization + consent screen alignment

Since the app does not initiate Google OAuth:

- Remove all unused nonessential scopes from the consent screen configuration.
- If no Google sign-in remains, keep no active public scope grants for this app/client.
- Ensure consent screen metadata does not claim unsupported sign-in behavior.

If Google sign-in is reintroduced later, re-enable only the minimal baseline scopes required at launch (`openid`, `email`, `profile`) and document why each scope is needed.

## 4) Decision log

- **2026-03-28:** Decommission Google OAuth usage for current mobile builds.
- **2026-03-29:** Re-validated repository state (`Info.plist` + bundle identifier settings) and reaffirmed cloud hardening requirements (bundle/scheme restrictions and scope cleanup).
- Repo control: iOS OAuth URL scheme removed from app metadata.
- Cloud control required: disable/delete mapped iOS OAuth client and prune consent screen scopes to match current non-OAuth behavior.
- Reintroduction gate: any future OAuth re-enable requires security review + documented scope justification.

## 5) Why client IDs are public, but secrets/tokens are never allowed in source

OAuth **client IDs** identify an app integration and are intentionally embedded in mobile/web app metadata so the authorization server can route requests to the correct app registration.

By contrast, OAuth **client secrets**, **refresh tokens**, **access tokens**, and **service-account private keys** grant or enable access. If committed to source control, they can be copied, replayed, and abused, and rotation/recovery is costly.

Required policy for this repository:

- Never commit client secrets, refresh/access tokens, or service-account private keys.
- Store secrets only in local secure developer paths, CI-protected variables, or approved secret managers.
- Treat any accidental commit of secrets/tokens as a security incident requiring immediate rotation/revocation.
