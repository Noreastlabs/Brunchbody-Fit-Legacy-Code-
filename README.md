# brunch-body-clone

A React Native application for tracking and visualizing brunch-related fitness data. This clone is streamlined: authentication and local onboarding have been removed for a smoother developer experience.

## Project Overview

The project demonstrates a mobile interface with charts, scheduling tools, and state management using Redux. Without authentication or onboarding flows, developers can jump directly into exploring features and adding new ones.

## App Mode

Local/remote behavior is controlled by a single config flag in `src/config/runtimeMode.js`:

- `LOCAL_ONLY_MODE_ENABLED = true` (current default): all Redux actions use local data paths only.
- `LOCAL_ONLY_MODE_ENABLED = false`: reserved for future backend reintroduction (`REMOTE_SYNC`).
- `LOCAL_ONLY` is still exported as a backwards-compatible alias.

`src/config/appMode.js` maps this single flag to `APP_MODE` and keeps `assertLocalOnlyMode(...)` checks so unsupported remote code paths fail fast.

## Android Network Security Policy (Production HTTPS-only)

Android release builds enforce HTTPS-only traffic:

- `android/app/src/main/AndroidManifest.xml` sets `android:usesCleartextTraffic="false"`.
- `android/app/src/main/res/xml/network_security_config.xml` sets `<base-config cleartextTrafficPermitted="false" />`.
- Cleartext allowances are permitted only for local development in debug scope:
  - `android/app/src/debug/AndroidManifest.xml`
  - `android/app/src/debug/res/xml/network_security_config.xml` (localhost + emulator loopback addresses only)

When adding network features, keep production endpoints on HTTPS and confine any HTTP localhost exceptions to debug-only manifests/config.

## Local-only Guardrail in CI

A dedicated CI workflow (`.github/workflows/local-only-guard.yml`) runs `npm run check:local-only` on pushes and pull requests.

The check fails if `LOCAL_ONLY_MODE_ENABLED` is `true` (or legacy `LOCAL_ONLY` resolves to `true`) **and** any source file under `src/` introduces:
- Firebase imports
- AWS/AppSync/Amplify imports
- `api/user/...` remote persistence calls

This keeps the current local-only contract enforceable at review time.

## Secret & Keystore Guardrail

A dedicated CI workflow (`.github/workflows/secret-scan.yml`) runs `./scripts/check-secrets.sh` on pushes and pull requests, and a repository pre-commit hook is provided at `.githooks/pre-commit`.

The check fails if git-tracked content includes:
- secret container file types (`*.keystore`, `*.jks`, `*.p12`, `*.pem`)
- cloud access keys (for example AWS-style key IDs)
- bearer tokens
- database URLs with embedded credentials
- private key blocks (for example `-----BEGIN ... PRIVATE KEY-----`)

False-positive exclusions are tracked in `.secret-scan-exclusions` (lockfiles and other known-safe noisy files only).

For local debug key setup and guidance on history cleanup before/after making the repository public, see `docs/secrets-and-debug-keys.md`.

## Storage Map & Offline Behavior

The app is local-first and can operate offline.

| Domain | Primary persistence | Storage key(s) | Offline behavior |
| --- | --- | --- | --- |
| Profile / user | Redux Persist via AsyncStorage | `root` (`auth` slice), bootstrap reads: `traits`, `user_profile` | Profile/traits load from local cache; edits stay on-device. |
| Recreation | Redux Persist via AsyncStorage + MMKV for bundled plans | `root` (`recreation` slice), direct keys: `routines`, `workouts`; MMKV: `plans_brunch_body` (`STORAGE_KEYS.PLANS.BRUNCH_BODY`) | Routines/workouts remain editable offline; Brunch Body plan catalog reads from MMKV with no network dependency. |
| Journal | Redux Persist via AsyncStorage | `root` (`journal` slice) | Journal entries and dashboard-derived values continue to work offline. |
| Nutrition | Redux Persist via AsyncStorage + direct AsyncStorage bootstrap | `root` (`nutrition` slice), direct keys: `meals`, `supplements`, `meal_categories`, `meals_directory` | Meals/supplements and nutrition directories remain fully available offline. |
| Calendar | Redux Persist via AsyncStorage + direct AsyncStorage bootstrap | `root` (`calendar` slice), direct key: `themes` | Themes/repeated themes continue to load/update without connectivity. |
| Exercise | Redux Persist via AsyncStorage + direct AsyncStorage bootstrap | `root` (`exercise` slice), direct key: `exercise_directory` | Exercise list and directory browsing/editing remain available offline. |
| Todo | Redux Persist via AsyncStorage + direct AsyncStorage bootstrap | `root` (`todo` slice), direct key: `todos` | Todo CRUD remains fully offline. |


### Explicitly local vs intentionally not synced

- **Stored locally (on-device only):**
  - Redux Persist state in **AsyncStorage** (`root` key; includes `auth`, `journal`, `recreation`, `nutrition`, `calendar`, `exercise`, `todo` slices).
  - Direct **AsyncStorage** bootstrap/domain keys: `traits`, `user_profile`, `routines`, `workouts`, `meals`, `supplements`, `meal_categories`, `meals_directory`, `themes`, `exercise_directory`, `todos`.
  - **MMKV** key: `plans_brunch_body` (`STORAGE_KEYS.PLANS.BRUNCH_BODY`) for bundled Brunch Body plans.
- **Intentionally not synced:**
  - No Firebase sync.
  - No AWS/AppSync/Amplify sync.
  - No `api/user/...` network persistence paths in local-only mode.
  - No cross-device reconciliation or cloud backup for user-generated data.

### No-cloud-sync guarantee (current behavior)

- There is **no backend persistence** in the current build.
- There is **no automatic cloud backup/sync** for user records, workouts, meals, todos, or themes.
- Data continuity depends on local device storage (`AsyncStorage` + MMKV). Clearing app storage or uninstalling the app removes locally stored data.
- Any future backend return must be explicitly enabled via the single app-mode switch (`LOCAL_ONLY_MODE_ENABLED` in `src/config/runtimeMode.js`).

### Notes on legacy API snippets

In `src/redux/actions/{nutrition,recreation,calendar,exercise,todo}.js`, legacy commented `api/user/...` request snippets were removed and each module is explicitly guarded by `assertLocalOnlyMode(...)`.

## Migration Notes (future backend reintroduction)

To preserve compatibility with existing local users when backend sync returns:

1. **Keep local schema stable first**
   - Treat current persisted shapes as canonical v1.
   - Introduce explicit schema versioning before changing any object structure.

2. **Add non-destructive hydration/migration**
   - On first backend-enabled launch, import local Redux/AsyncStorage/MMKV data into memory.
   - Merge server data by deterministic keys (`id` where available) without deleting local-only entries.

3. **Stage sync behind `APP_MODE`**
   - Add API clients only under `REMOTE_SYNC` code paths.
   - Keep `LOCAL_ONLY` logic as a guaranteed fallback until parity is proven.

4. **Dual-write transition window**
   - Temporarily write to both local store and backend when remote mode is enabled.
   - Mark records with sync metadata (`syncedAt`, `source`, conflict marker) to aid reconciliation.

5. **Conflict resolution policy**
   - Define per-domain strategy (e.g., last-write-wins for simple fields, merge lists by stable item id for meals/workouts/routines).
   - Never overwrite unknown local fields from server payloads.

6. **Rollback safety**
   - If backend fails, continue reading/writing local data with no data loss.
   - Keep migration idempotent so retries are safe.

## Setup

### Requirements

- Node.js >= 18
- Yarn package manager

### Installation

1. Install dependencies:
   ```bash
   yarn install
   ```
2. Start the Metro bundler:
   ```bash
   yarn start
   ```
3. Run on a platform of your choice:
   ```bash
   yarn android # or yarn ios
   ```

No authentication or local onboarding steps are required; the application launches directly to the main interface.

## Contributing

Contributions are welcome! **Before opening a PR, read [SECURITY.md](SECURITY.md) and [CONTRIBUTING.md](CONTRIBUTING.md)** so security disclosure, secret handling, and release expectations are followed from the start. Note that the project intentionally omits authentication and local onboarding features, so new contributions should respect this simplified setup.

## Release Checklist

Before creating a public release tag, complete `docs/release/RELEASE_CHECKLIST.md`, including required secret-scan, signing-configuration, and network-security checks, plus explicit release-owner sign-off before tagging.

## License

This project is licensed under the [MIT License](LICENSE).

## OAuth Security Notes

- The app currently does **not** ship with Google OAuth runtime sign-in and no Google OAuth URL scheme is registered in `ios/BrunchBody/Info.plist`.
- OAuth **client secrets**, service account private keys, refresh tokens, and access tokens are sensitive credentials and must never be committed.
- For the OAuth hardening/decommission decision record (client mapping, identity/redirect restrictions, scope minimization, and consent alignment), see `docs/security/oauth-client-hardening.md`.
