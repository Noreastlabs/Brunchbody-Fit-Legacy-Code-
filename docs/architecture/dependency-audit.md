# Dependency Audit

This document is the present-state dependency inventory for lane `1.1.6.1` as inspected on April 22, 2026.

Lane rule: `1.1.6.1` is an audit and inventory lane only. No dependency, config, native, tooling, privacy, disclosure, or behavior changes are approved by this lane.

Verification rule: named packages, dependency families, and coordination-risk examples below were treated as verification targets, not guaranteed findings. When current branch evidence was mixed or incomplete, the item was downgraded to `inferred` or `unknown / needs follow-on` rather than forced into a stronger conclusion.

- What changed in this lane: one new internal architecture audit document.
- What users will experience: no app behavior change.
- What this lane does not do: no upgrades, removals, deduplication, refactors, lockfile rewrites, Pod changes, Gradle changes, CI rewrites, or disclosure edits.

## Method And Evidence Labels

This audit was built from current repo truth only:

- `package.json`
- `yarn.lock`
- `ios/Podfile`
- `ios/Podfile.lock`
- `android/build.gradle`
- `android/app/build.gradle`
- `android/settings.gradle`
- `android/gradle.properties`
- `babel.config.js`
- `metro.config.js`
- `jest.config.js`
- `jest.setup.js`
- `.eslintrc.js`
- `.prettierrc.js`
- `README.md`
- `SECURITY.md`
- `.github/workflows/local-only-guard.yml`
- `.github/workflows/secret-scan.yml`
- `scripts/check-local-only-mode.js`
- targeted `src/` and `__tests__/` imports/usages where needed to confirm live use

Evidence labels used in this document:

- `repo-observed`: directly supported by inspected repo files.
- `inferred`: likely active based on indirect but meaningful evidence such as autolink, Pod/Gradle lock state, or framework convention.
- `unknown / needs follow-on`: mixed, incomplete, missing, or conflicting evidence.

Additional audit rules:

- Current branch files win when older docs disagree.
- Package-manifest presence alone is not enough to prove active usage.
- Dev/test/tooling usage may be confirmed through config, setup files, tests, scripts, or native/build wiring, not only through `src/` imports.
- If a named surface is absent in the inspected repo, it is recorded as not present rather than assumed.
- Absence claims in this document mean "no repo-observed active integration found in inspected surfaces," not an absolute runtime guarantee.

## Current Dependency Surface Summary

- JS manifest surface: `package.json` + `yarn.lock`
- Native iOS surface: `ios/Podfile` + `ios/Podfile.lock`
- Native Android surface: `android/build.gradle`, `android/app/build.gradle`, `android/settings.gradle`, `android/gradle.properties`
- Root build/test/tooling surface: Babel, Metro, Jest, ESLint, Prettier, GitHub Actions workflows, and root scripts
- Not present in inspected repo:
  - `package-lock.json`
  - `tsconfig.json`
  - `app.json`
  - `app.config.js`
  - `app.config.ts`

## Runtime App Dependencies

| dependency / family | where declared | usage confirmed | evidence | current status | why it matters |
| --- | --- | --- | --- | --- | --- |
| React / React Native core (`react@19.1.0`, `react-native@^0.80.2`) | `package.json`; native build surfaces in `android/build.gradle`, `android/app/build.gradle`, and `ios/Podfile.lock` | Yes. Core imports appear throughout `src/`; Android and iOS native surfaces also reference React Native runtime pieces. | `repo-observed` | `active` | This is the version anchor for nearly every other dependency family and for later cleanup lanes. |
| Navigation shell (`@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`) | `package.json` | Yes. Imports appear in `src/navigation/`, `src/components/`, multiple screen modules, and `jest.setup.js`. | `repo-observed` | `active` | Navigation packages are deeply coupled to route ownership, tab/stack behavior, and navigator smoke tests. |
| App-shell native helpers (`react-native-gesture-handler@^2.28.0`, `react-native-safe-area-context@^5.6.0`) | `package.json`; `ios/Podfile.lock` for safe-area-context | Yes. `GestureHandlerRootView` is mounted in `src/root-container/RootContainer.js`; `SafeAreaView` is imported in shared and journal UI; Jest setup also loads gesture-handler test support. | `repo-observed` | `active` | These are required for app-shell rendering, input behavior, and layout correctness. |
| Screen management helper (`react-native-screens@^4.13.1`) | `package.json`; `ios/Podfile.lock` | No direct app import was found. Matching Pod lock entries exist and the package is a normal React Navigation companion dependency. | `inferred` | `active` | This appears to be live through navigation/native integration, but the current repo does not directly import it. |
| State and local persistence (`@reduxjs/toolkit@^2.8.2`, `redux@^5.0.1`, `react-redux@^9.2.0`, `redux-persist@^6.0.0`, `@react-native-async-storage/async-storage@^2.2.0`, `react-native-mmkv@^3.3.0`) | `package.json`; `ios/Podfile.lock` confirms AsyncStorage; store and storage code under `src/redux/` and `src/storage/` | Yes. Store setup, async storage helpers, Redux wrappers, and MMKV hydration are all live in app code. | `repo-observed` | `overlapping` | This is the most trust-sensitive dependency family in the repo because current persistence spans Redux Persist, direct AsyncStorage usage, and MMKV. |
| UI component system (`react-native-paper@^5.14.5`, `react-native-vector-icons@^10.3.0`, `prop-types@^15.8.1`, `react-native-responsive-fontsize@^0.5.1`) | `package.json`; Android vector-icons wiring also appears in `android/settings.gradle` and `android/app/build.gradle` | Yes. Imports appear across shared components, settings, calendar, nutrition, recreation, onboarding, and root container code. | `repo-observed` | `active` | These packages shape the current UI contract and increase the cost of later design-system or native-linkage cleanup. |
| Calendar, chart, and time helpers (`react-native-calendars@^1.1313.0`, `react-native-chart-kit@^6.12.0`, `react-native-swiper@^1.6.0`, `react-native-dashed-line@^1.1.0`, `moment@^2.30.1`) | `package.json`; `yarn.lock` | Yes. Imports are live in calendar, dashboard, recreation, journal, settings, and shared UI files; Jest setup also mocks several of these packages. | `repo-observed` | `active` | These packages back visible user flows and are good candidates for later targeted modernization lanes, but not for change in this audit. |
| Data-entry helpers (`@react-native-community/slider@^4.5.7`, `react-native-wheel-pick@^1.2.6`, `react-native-wheel-color-picker@^1.3.1`) | `package.json`; `yarn.lock` | Yes. Slider, wheel-picker, and color-picker imports are live in onboarding, calendar, nutrition, recreation, and shared modal code; Jest setup also mocks the wheel packages. | `repo-observed` | `active` | These packages represent current native/input dependencies and are relevant to later UX and native cleanup work. |
| Export and file handling (`xlsx@^0.18.5`, `react-native-fs@^2.20.0`, `react-native-scoped-storage@^1.9.5`) | `package.json`; `yarn.lock` | Yes. `src/screens/setting/pages/Export To CSV/ExportToCSV.js` imports and uses all three packages; Jest setup also mocks `react-native-fs` and `react-native-scoped-storage`. | `repo-observed` | `active` | This family is release- and trust-sensitive because it writes user-exported files and crosses app-managed storage boundaries. |

## Dev / Test Dependencies

| dependency / family | where declared | usage confirmed | evidence | current status | why it matters |
| --- | --- | --- | --- | --- | --- |
| Jest test harness (`jest@^29.6.3`, `react-test-renderer@19.1.0`) | `package.json`; `jest.config.js`; `jest.setup.js` | Yes. The repo has a broad `__tests__/` surface and explicit Jest config/setup wiring. | `repo-observed` | `active` | Test execution and current regression coverage depend on this stack. |
| AST-based boundary tests (`@babel/parser@^7.28.4`) | `package.json`; direct imports in multiple boundary tests under `__tests__/` | Yes. Boundary tests parse source files with `@babel/parser`. | `repo-observed` | `active` | This package matters because some test coverage is structural rather than purely render- or reducer-driven. |
| ESLint base (`eslint@^8.19.0`, `@react-native/eslint-config@0.80.2`, `eslint-plugin-import@^2.32.0`, `eslint-plugin-prettier@^4.2.1`) | `package.json`; `.eslintrc.js` | Yes. Local ESLint config extends `@react-native` and enables `prettier` and `import` plugins. | `repo-observed` | `active` | This is the live lint baseline for later lint/formatting cleanup. |
| Prettier (`prettier@2.8.8`) | `package.json`; `.prettierrc.js` | Yes. A repo-local Prettier config is present and ESLint references the Prettier plugin. | `repo-observed` | `active` | Formatting policy is part of the current contributor/tooling surface even though this lane makes no formatting changes. |
| TypeScript footprint (`typescript@^5.9.2`, `@typescript-eslint/parser@^7.0.0`) | `package.json`; one live TS file at `src/utils/storageUtils.ts` | Partly. `src/utils/storageUtils.ts` is live and imported by app code, but no `tsconfig.json` is present and the local ESLint config does not directly reference `@typescript-eslint/parser`. | `repo-observed` | `uncertain` | The repo has a real but small TS footprint, which makes toolchain intent unclear and worth later cleanup or clarification. |

## Native / Build / Tooling Dependencies

| dependency / family | where declared | usage confirmed | evidence | current status | why it matters |
| --- | --- | --- | --- | --- | --- |
| React Native Gradle plugin (`@react-native/gradle-plugin@^0.81.0`) | `package.json`; `android/settings.gradle`; `android/build.gradle` | Yes. The plugin is included from `node_modules` and used by the Android build. | `repo-observed` | `active` | This is a key Android build dependency and also a coordination-risk example because the declared plugin version does not match the main `react-native` package version. |
| React Native CLI surface (`@react-native-community/cli@^20.0.0`, `@react-native-community/cli-platform-android@19.1.1`, `@react-native-community/cli-platform-ios@19.1.1`) | `package.json`; root scripts `android`, `ios`, and `start` | Indirectly. The current scripts depend on the React Native CLI entrypoints, but no direct local imports of the CLI packages were found. | `inferred` | `active` | The CLI family is part of the build/run workflow and also a coordination-risk example because core and platform CLI package versions differ. |
| iOS Pod and autolink surface | `ios/Podfile`; `ios/Podfile.lock` | Yes. The Podfile uses `use_native_modules!` and `use_react_native!`; Pod lock entries confirm `RNCAsyncStorage`, `react-native-safe-area-context`, `RNScreens`, `React-Core`, and `hermes-engine`. | `repo-observed` | `active` | This is the main source of truth for iOS native dependency linkage in the inspected repo. |
| Android native build surface | `android/build.gradle`; `android/app/build.gradle`; `android/settings.gradle`; `android/gradle.properties` | Yes. Android native config includes SDK levels, Kotlin version, architecture flags, Hermes enablement, explicit `resolutionStrategy.force(...)` calls, and manual `react-native-vector-icons` wiring. | `repo-observed` | `overlapping` | This surface materially affects release readiness and already contains forced-version coordination logic worth later review. |
| Hermes / JSC runtime selection | `android/gradle.properties`; `android/app/build.gradle`; `ios/Podfile.lock` | Yes. Android sets `hermesEnabled=true` with a JSC fallback branch; iOS Pod lock includes `hermes-engine`. | `repo-observed` | `active` | JS engine selection affects runtime behavior, binary composition, and native dependency troubleshooting. |
| Babel transform stack (`@babel/core@^7.25.2`, `@react-native/babel-preset@0.80.2`, `@babel/runtime@^7.25.0`) | `package.json`; `babel.config.js` | Yes. Babel config uses the React Native preset; Babel packages are part of the active transform pipeline. | `repo-observed` | `active` | This is core build tooling for app and test transforms. |
| Metro bundler (`@react-native/metro-config@0.80.2`) | `package.json`; `metro.config.js` | Yes. Metro config merges `getDefaultConfig(__dirname)` from the React Native Metro package. | `repo-observed` | `active` | Metro determines bundling behavior and is the relevant place to verify any future asset-transform changes. |
| Package-manager and install surface (`yarn.lock`, README Yarn setup, GitHub Actions `npm ci`) | `yarn.lock`; `README.md`; `.github/workflows/local-only-guard.yml`; `.github/workflows/secret-scan.yml` | Yes. The repo tracks `yarn.lock`, README setup calls for Yarn, and both inspected workflows install with `npm ci`. `package-lock.json` is not present in the inspected repo. | `repo-observed` | `overlapping` | This is a build reproducibility and CI-health concern because install guidance and lockfile/tool choice are not aligned. |
| Local-only and secret-scan workflow tooling | `.github/workflows/local-only-guard.yml`; `.github/workflows/secret-scan.yml`; `scripts/check-local-only-mode.js`; `scripts/check-secrets.sh` | Yes. The workflows and scripts are live parts of the current build/test/release pipeline. | `repo-observed` | `active` | These are trust- and release-sensitive tooling surfaces even though they are not app runtime dependencies. |

## Unknown / Needs Follow-On

| dependency / family | where declared | usage confirmed | evidence | current status | why it matters |
| --- | --- | --- | --- | --- | --- |
| Networking residue candidate (`axios@^1.11.0`) | `package.json`; `yarn.lock` | No direct import or callsite was found in the inspected app, native, script, or test surfaces. | `unknown / needs follow-on` | `residual` | This expands the dependency and security review surface unless a deeper native or branch-specific use is confirmed later. |
| Redux middleware residue candidate (`redux-promise@^0.6.0`) | `package.json`; `yarn.lock` | No store wiring or direct import was found in the inspected Redux store, actions, or root setup files. | `unknown / needs follow-on` | `residual` | This is a good example of declared middleware that is not currently proven to be part of the live store path. |
| Expo family (`expo@^53.0.20`, `expo-linear-gradient@~14.1.5`, `expo-modules-core@^2.5.0`) | `package.json`; `yarn.lock` | No direct app import, Expo config file, or Expo-specific build wiring was found in the inspected surfaces. | `unknown / needs follow-on` | `residual` | These packages may be leftover scaffold or experimentation residue, but this audit does not prove they are safe to remove. |
| New app scaffold residue candidate (`@react-native/new-app-screen@0.80.2`) | `package.json`; `yarn.lock` | No live import or config use was found in the inspected repo. | `unknown / needs follow-on` | `residual` | This looks like template-era residue and is a good child-lane cleanup candidate if no hidden use remains. |
| Date and picker residue candidates (`@react-native-community/datetimepicker@^8.4.4`, `@react-native-picker/picker@^2.11.1`) | `package.json`; `yarn.lock` | No direct imports or config use were found in the inspected repo. | `unknown / needs follow-on` | `residual` | These may overlap with the current wheel-picker-based input strategy, but the audit keeps them conservative until a targeted prune lane verifies removal safety. |
| SVG toolchain (`react-native-svg@^15.12.1`, `react-native-svg-transformer@^1.5.1`) | `package.json`; `yarn.lock`; one SVG import in `src/resources/images.js` | Mixed. `src/resources/images.js` imports `../assets/tutorialsSVG/gettingStarted.svg`, but the inspected tutorial flow uses `images.tutorialImages` PNG entries and `metro.config.js` does not add a custom SVG transformer. | `unknown / needs follow-on` | `uncertain` | This is a good example of why shallow import presence is not enough: some SVG-related code exists, but current live usage is not clearly confirmed. |
| Reanimated / worklets (`react-native-reanimated@^4.0.2`, `react-native-worklets@^0.4.1`) | `package.json`; `yarn.lock`; `babel.config.js`; `jest.setup.js` | Mixed. Babel config enables `react-native-worklets/plugin`, and Jest mocks a `react-native-reanimated` internal module path, but no direct runtime imports were found in the inspected app code. | `unknown / needs follow-on` | `uncertain` | This may be active only indirectly or may be residue; it needs targeted native/runtime verification before any cleanup or upgrade decision. |
| Additional lint residue candidates (`eslint-plugin-jest@^28.11.0`, `eslint-plugin-ft-flow@^3.0.11`, `hermes-eslint@^0.32.0`) | `package.json` | No direct references were found in the local ESLint config. | `unknown / needs follow-on` | `residual` | These may still be pulled in transitively through shared config, but current local evidence does not prove that. |
| Low-confidence Babel helper packages (`@babel/preset-env@^7.25.3`, `@babel/types@7.25.2`) | `package.json` | No direct local config or import usage was found in the inspected repo. | `unknown / needs follow-on` | `residual` | These are likely low-priority cleanup candidates, but the current branch does not prove whether they are retained for indirect toolchain reasons. |
| Native verification gaps for JS-confirmed packages (`react-native-fs`, `react-native-mmkv`, `react-native-vector-icons`) | `package.json`; live JS usage; Android vector-icons wiring | Mixed. JS usage is confirmed, but matching iOS Pod lock confirmation was not found for each package, and only vector-icons has explicit Android manual linkage in inspected native files. | `unknown / needs follow-on` | `uncertain` | These packages are live enough to matter, but their current native-linkage story is not equally visible across inspected iOS and Android surfaces. |

## Trust- Or Disclosure-Sensitive Families

### Storage and persistence

- Family: `@react-native-async-storage/async-storage`, `redux-persist`, `react-native-mmkv`, Redux store wiring
- Status: active
- Evidence: `repo-observed`
- Why it matters:
  - This family stores device-local user data and is therefore trust-sensitive even without any backend sync.
  - The current storage story is intentionally overlapping across persisted Redux state, direct AsyncStorage helpers, and MMKV.
  - Later cleanup or disclosure review must not assume a single storage layer already exists.

### Export and file-write surface

- Family: `xlsx`, `react-native-fs`, `react-native-scoped-storage`
- Status: active
- Evidence: `repo-observed`
- Why it matters:
  - The app exports journal data to user-chosen storage locations.
  - This is a release- and disclosure-sensitive capability because exported files sit outside the app's managed local-state surface.
  - Any future cleanup lane should review platform-specific behavior and user-facing copy together.

### Networking and auth residue

- Family: `axios`, local-only guard workflow, OAuth hardening docs history
- Status: uncertain / residual
- Evidence: `unknown / needs follow-on`
- Why it matters:
  - No repo-observed active integration found in inspected surfaces for live `axios` usage or backend SDK wiring.
  - The repo still preserves local-only guardrails and historical OAuth documentation, so later lanes should review dependency residue and disclosure history together rather than assume the network surface is fully absent forever.

### Analytics, crash reporting, notifications, and monetization

- Scope inspected: `package.json`, `src/`, `ios/`, `android/`, `README.md`, and `docs/`
- Search families:
  - analytics / crash: Firebase, Sentry, Bugsnag, Segment, Mixpanel
  - notifications / messaging: OneSignal, Braze, push notification keywords
  - monetization / billing: RevenueCat, Stripe, `react-native-iap`
- Result:
  - No repo-observed active integration found in inspected surfaces for these families.
  - Historical or policy references in docs do not count as active SDK integration evidence.

## Docs Drift / Stale Claims

### Package-manager guidance does not match current CI install behavior

- `README.md` describes Yarn as the package manager and uses `yarn install`, `yarn start`, `yarn android`, and `yarn ios`.
- The inspected GitHub Actions workflows install with `npm ci`.
- `package-lock.json` is not present in the inspected repo, while `yarn.lock` is present.
- Current assessment:
  - This is a real build/tooling drift signal.
  - The dependency audit should treat the repo files themselves as truth and should not normalize the mismatch in this lane.
  - Follow-on cleanup belongs under build/script or CI health work, not here.

### Earlier dependency-residue notes are useful context but not source-of-truth

- `docs/architecture/legacy-residue-audit.md` and `docs/architecture/store-and-middleware-review.md` already flag some package residue candidates such as `redux-promise`, Expo-related packages, and `axios`.
- Current assessment:
  - Those docs are directionally useful, but current manifests, configs, native files, and live imports remain the source-of-truth for this lane.
  - If later code changes invalidate those earlier notes, they should be treated as stale rather than used to override current repo evidence.

## Findings Buckets

### Likely keep

- React / React Native core and navigation families with confirmed live usage
- Redux, AsyncStorage, Redux Persist, and MMKV storage stack as current-state dependencies
- React Native Paper, vector icons, responsive font sizing, and other broad UI shell packages
- Calendar, chart, swiper, dashed-line, slider, wheel-picker, color-picker, and moment-based feature helpers
- Export/file handling packages that are directly used by the settings export flow
- Active build/test/tooling surfaces such as Babel, Metro, Jest, ESLint base config, Pod/Gradle wiring, and workflow guardrails

### Candidate cleanup

- `axios`
- `@react-native/new-app-screen`
- `@react-native-community/datetimepicker`
- `@react-native-picker/picker`
- `redux-promise`
- `eslint-plugin-jest`
- `eslint-plugin-ft-flow`
- `hermes-eslint`
- possibly the Expo family if a later targeted lane confirms no hidden native/build reliance

### Candidate upgrade / risk review

- `react-native@^0.80.2` versus `@react-native/gradle-plugin@^0.81.0`
- `@react-native-community/cli@^20.0.0` versus `@react-native-community/cli-platform-android@19.1.1` and `@react-native-community/cli-platform-ios@19.1.1`
- Android forced dependency versions in `android/app/build.gradle`
- package-manager drift between `yarn.lock`, README Yarn instructions, and GitHub Actions `npm ci`
- manual Android `react-native-vector-icons` linkage alongside current autolink setup
- TypeScript footprint without `tsconfig.json`

### Unknown / Needs Targeted Inspection

- Expo family
- SVG toolchain
- reanimated / worklets
- native-linkage confirmation for some JS-confirmed packages such as MMKV, RNFS, and vector icons
- whether currently unreferenced dev/test helper packages are intentional indirect toolchain dependencies or real residue

## Follow-On Lane Seeds

| lane | why this audit seeds it | bounded next question |
| --- | --- | --- |
| `1.1.6.2 Build and script cleanup` | The current install, script, CLI, and native build surfaces are active but not fully aligned. | Which install path, script surface, and native build glue should become the single supported baseline without changing runtime behavior? |
| `1.1.6.3 Lint and formatting baseline` | The repo has an active lint/format stack plus several weak-evidence lint/tooling packages. | Which lint and formatting packages are truly required, and which are residue or indirect shared-config carryovers? |
| `1.1.6.4 CI health` | CI currently installs with `npm ci` while the inspected lockfile and README setup point to Yarn. | What package-manager and lockfile policy should CI enforce, and which current workflows are inconsistent with that policy? |
| Child lane: runtime dependency residue verification and prune | Several declared runtime packages appear unused or only weakly evidenced. | Can each candidate residue package be proven unnecessary through targeted repo and native verification, one family at a time? |
| Child lane: native linkage verification and cleanup | Some JS-confirmed packages do not have equally clear native evidence across inspected iOS and Android files. | Which packages still require manual linkage, which are fully autolinked, and which native surfaces are now dead weight? |
| Child lane: trust-sensitive dependency and disclosure review | Storage, export, and network-residue families affect user trust and release truthfulness. | Do current docs, settings copy, and release materials accurately describe the dependency-backed storage/export/network behavior now present in the repo? |

## Closing Notes

- This audit records current dependency surfaces only.
- It intentionally does not choose winners among overlapping libraries or make removal decisions.
- When evidence was mixed, the item stayed conservative instead of being promoted to a stronger claim.
