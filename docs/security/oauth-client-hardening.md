# Google OAuth Hardening Record (iOS)

_Last updated: 2026-03-29 (OAuth review refresh)_

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
- **2026-03-29 (refresh):** Completed targeted review checklist:
  - Reviewed `ios/BrunchBody/Info.plist` for iOS OAuth client identifiers and redirect schemes (none present).
  - Confirmed only intended iOS bundle identifier in project build settings (`com.brunchbody`).
  - Re-confirmed expected cloud posture: only intended bundle ID allowed if client retained, no redirect schemes, and unused scopes removed from consent/app configuration.
  - Noted operational limitation: Google Cloud Console settings cannot be directly validated from repository contents; console verification remains a required manual control by a project owner with cloud access.
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

## 6) 2026-03-29 targeted audit execution (requested checklist)

This section records execution of the requested four-step OAuth audit:

1. **Audit client ID referenced in `ios/BrunchBody/Info.plist`:**
   - Result: no OAuth client ID is present in `Info.plist` and no OAuth redirect scheme is registered (`CFBundleURLTypes` absent).
   - `CFBundleIdentifier` remains indirect (`$(PRODUCT_BUNDLE_IDENTIFIER)`), with iOS project settings resolving to `com.brunchbody`.
2. **Restrict provider app identity / redirect schemes to intended environments:**
   - Required target posture in provider console:
     - Authorized iOS app identity: none (preferred if OAuth client is removed) or `com.brunchbody` only.
     - Authorized redirect schemes: none for both production and development.
   - Execution status: repository-side verification complete; provider-console enforcement requires a maintainer with Google Cloud access.
3. **Remove unused scopes and verify consent settings:**
   - Required target posture in provider console:
     - Remove nonessential scopes and keep no active Google OAuth scopes for this app while OAuth remains unused.
     - Ensure consent-screen text does not advertise unsupported Google sign-in capability.
   - Execution status: policy documented and revalidated in-repo; console-side scope/consent verification remains an owner action.
4. **Document audit in security documentation:**
   - Completed by this section update.

Evidence commands used during this audit window:

- `rg -n "PRODUCT_BUNDLE_IDENTIFIER|com\\.brunchbody|CFBundleURLTypes|googleusercontent|apps\\.googleusercontent" ios/BrunchBody.xcodeproj/project.pbxproj ios/BrunchBody/Info.plist docs/security/oauth-client-hardening.md -S`
- `sed -n '1,220p' ios/BrunchBody/Info.plist`
