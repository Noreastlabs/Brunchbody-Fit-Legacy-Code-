# Google OAuth Hardening Record (iOS)

_Last updated: 2026-03-28_

## Current application behavior

BrunchBody currently ships without Sign in with Google or any other OAuth-based login flow. Authentication/onboarding is local-only in the app runtime.

## 1) OAuth app mapping from prior iOS client identifier

Historical iOS redirect scheme/client pair (removed from app metadata in this change):

- Reversed client ID scheme: `com.googleusercontent.apps.719080501603-jtfuc0ft8v83milid7pdfa92rfcc4vl6`
- OAuth client ID: `719080501603-jtfuc0ft8v83milid7pdfa92rfcc4vl6.apps.googleusercontent.com`

In Google Cloud Console (**Google Auth Platform → Clients** or **APIs & Services → Credentials**), this identifier maps to one iOS OAuth client. Use that exact client as the target for hardening/decommissioning actions below.

## 2) Authorized identity + redirect/scheme restrictions

Because OAuth is not used by the current app, the intended production/dev values are:

- **Production app OAuth redirect schemes:** none
- **Development app OAuth redirect schemes:** none
- **Authorized iOS bundle IDs on active OAuth clients for this app:** none

Hardening action:

1. Remove inactive/test bundle IDs and redirect schemes from the mapped iOS OAuth client.
2. Prefer disabling or deleting the unused iOS OAuth client entirely.
3. Keep OAuth disabled unless a signed product requirement reintroduces Google sign-in.

Repository alignment for this decision:

- `CFBundleURLTypes` Google OAuth scheme was removed from `ios/BrunchBody/Info.plist`.

## 3) Scope minimization + consent screen alignment

Since the app does not initiate Google OAuth:

- Remove all unused nonessential scopes from the consent screen configuration.
- If no Google sign-in remains, keep no active public scope grants for this app/client.
- Ensure consent screen metadata does not claim unsupported sign-in behavior.

If Google sign-in is reintroduced later, re-enable only the minimal baseline scopes required at launch (`openid`, `email`, `profile`) and document why each scope is needed.

## 4) Decision log (2026-03-28)

- Decision: Decommission Google OAuth usage for current mobile builds.
- Repo control: iOS OAuth URL scheme removed from app metadata.
- Cloud control required: disable/delete mapped iOS OAuth client and prune consent screen scopes to match current non-OAuth behavior.
- Reintroduction gate: any future OAuth re-enable requires security review + documented scope justification.

## Secret handling reminder

OAuth client IDs are public identifiers and may appear in app metadata. Never commit client secrets, refresh/access tokens, or service-account private keys.
