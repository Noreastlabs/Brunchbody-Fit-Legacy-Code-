# Lane: 1.1.1.3 Risk and coupling audit

## Overview / Summary

This document is a present-state, docs-only audit of the main architectural and trust-sensitive coupling points visible in the current Brunch Body legacy app codebase.

It exists to support Phase 1 cleanup and stabilization by identifying where small changes are most likely to create outsized risk, trust drift, or review complexity. The goal is not to redesign the app or reopen product scope. The goal is to make later cleanup lanes safer, more bounded, and easier to review.

This audit stays evidence-first. It is grounded in the inspected repository state, the current local-first/mobile-first posture described in `README.md`, and companion architecture/release/security documentation already present in the repo. It does not change behavior.

It is aligned to the Brunch Body Phase 1 cleanup and stabilization scope and does not reopen out-of-scope sync, AI, desktop, monetization, or broad redesign work.

## Scope

### In Scope

- Inspect current coupling across boot, navigation, persistence, Redux domain boundaries, and trust-sensitive settings/account flows.
- Distinguish architecture coupling from trust/disclosure coupling where the repo evidence supports that distinction.
- Identify the highest blast-radius surfaces for Phase 1 cleanup sequencing.
- Propose short, bounded follow-on lane seeds that stay inside local-first, minimal-diff stabilization work.

### Out of Scope

- No production code changes.
- No test changes.
- No config changes.
- No behavior changes.
- No privacy or disclosure rewrites.
- No backend, cloud-sync, AI, desktop, or monetization expansion.
- No broad redesign recommendations.
- No attempt to prove claims that are not supported by inspected repo surfaces.

Scope note: this lane is an audit artifact only. It does not implement cleanup work or alter current app behavior.

## Audit method

- Reviewed the requested primary evidence surfaces first: `App.js`, `src/bootstrap/AppBootstrap.js`, `src/root-container/RootContainer.js`, `src/navigation/`, `src/redux/store/store.js`, `src/redux/actions/auth.js`, onboarding/settings/nutrition screens, and current public/local-first repo docs.
- Used `docs/architecture/app-structure-inventory.md` as the main companion map for startup, navigation, Redux, and persistence structure.
- Used `docs/architecture/legacy-residue-audit.md` as companion context for local-only/runtime residue and docs-truth drift risk.
- Checked trust-sensitive documentation surfaces only where they directly affected current posture or account/settings behavior, including `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md`, `docs/release/public-repository-visibility-2026-03-29.md`, `docs/release/public-repo-release-go-no-go-2026-03-29-rc2.md`, `docs/security/security-review-2026-03-28-followup.md`, and `docs/qa/local-data-validation-report.md`.
- Treated the requested risk areas as assessment targets, not pre-proven conclusions. Items are included below only where the inspected repo state provided enough evidence to support them.

### Limits

- This is a static repo audit, not a runtime or device validation pass.
- Severity ratings are practical Phase 1 cleanup ratings, not formal security ratings.
- Phase 1 alignment in this audit is based on the current project scope, the local-first/mobile-first repo posture, and verified companion architecture/release/security docs.
- Tooling/runtime ambiguity is included only as a low-severity note because the evidence is weaker and more verification-oriented than the main app-structure findings.

## Risk and coupling register

### Summary Table

| ID | Class | Risk | Severity | Primary surfaces | Recommended bounded follow-on lane |
| --- | --- | --- | --- | --- | --- |
| RC-01 | Architecture coupling | Boot-path coupling | High | `src/bootstrap/AppBootstrap.js`, `src/root-container/RootContainer.js`, onboarding/storage helpers | Boot-path ownership note |
| RC-02 | Architecture coupling | Navigation entry and ownership coupling | Medium-High | `src/navigation/RootNavigation.js`, `src/navigation/BottomTabNavigation.js`, mounted nested navigators | Navigation ownership clarification note |
| RC-03 | Architecture coupling | Mixed persistence / storage truth | High | Redux Persist store, AsyncStorage callsites, MMKV hydration, nutrition/onboarding flows | Local persistence boundary map |
| RC-04 | Trust/disclosure coupling | Local-first truth vs remote-mode residue | Medium | `src/config/runtimeMode.js`, `src/config/appMode.js`, `README.md` | Local-first truth alignment pass |
| RC-05 | Trust/disclosure coupling | Settings/account trust coupling | High | settings/account screens, `src/redux/actions/auth.js`, local export/delete flows | Settings/account trust-surface behavior matrix |
| RC-06 | Architecture coupling | Cross-domain Redux/domain sprawl | Medium-High | `src/redux/store/store.js`, reducers/actions, broad screen domains | Redux domain boundary review |
| RC-07 | Architecture coupling | Tooling/runtime ambiguity | Low | `package.json`, `src/utils/storageUtils.ts`, `docs/qa/local-data-validation-report.md` | Verification/tooling clarification note |
| RC-08 | Trust/disclosure coupling | Code/docs/disclosure truth drift risk | Medium-High | README, privacy/release/security docs, settings labels and local account semantics | Docs-truth alignment pass |

### RC-01 - Boot-path coupling

- Class: Architecture coupling
- Severity: High
- Evidence / affected surfaces:
  - `App.js` is now a thin entrypoint that renders `AppBootstrap`.
  - `src/bootstrap/AppBootstrap.js` calls `hydrateWorkoutPlans()` on mount before rendering the root container.
  - `src/bootstrap/AppBootstrap.js` reads `AsyncStorage.getItem('user_profile')` to choose `Home` versus `CompleteProfile`, returns `null` until that read finishes, and then renders `RootContainer`.
  - `src/root-container/RootContainer.js` adds Redux `Provider`, `PersistGate`, gesture shell, `PaperProvider`, and `RootNavigation`.
  - `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js` writes transient onboarding keys and later writes `user_profile` directly to AsyncStorage before dispatching `SET_USER`.
  - `docs/architecture/app-structure-inventory.md` documents that startup ownership is already split across bootstrap, root container, navigation, and storage helpers.
- Coupling pattern:
  - Startup hydration, persisted-store boot, initial route choice, and onboarding completion are spread across separate layers that each hold part of the startup truth.
- Why it matters:
  - This makes fresh-install, returning-user, and reset behavior dependent on coordination across multiple files and storage conventions instead of one owned startup boundary.
- Likely blast radius:
  - App launch, onboarding completion, persisted-session restore, delete/reset flows, and any future startup guardrail work.
- Recommended bounded follow-on lane:
  - Boot-path ownership note.

### RC-02 - Navigation entry and ownership coupling

- Class: Architecture coupling
- Severity: Medium-High
- Evidence / affected surfaces:
  - `src/navigation/RootNavigation.js` now keeps root ownership narrow with `CompleteProfile`, `Home`, and the preserved `Tutorials` exception.
  - `src/navigation/BottomTabNavigation.js` sets `initialRouteName="Calendar"` even though the first tab route is `Dashboard` with the visible label `Home`.
  - `src/navigation/JournalNavigation.js`, `src/navigation/NutritionNavigation.js`, `src/navigation/RecreationNavigation.js`, and `src/navigation/SettingsNavigation.js` each reuse the tab route string as their own nested initial route.
  - `docs/architecture/app-structure-inventory.md` and `docs/architecture/dead-route-and-duplicate-route-audit.md` both note that `Tutorials` remains root-owned while the screen still lives under the settings module.
- Coupling pattern:
  - Navigation ownership is cleaner than the earlier root-heavy structure, but entry meaning is still split across the root shell, the tab shell, nested initial routes, visible tab labels, and the preserved `Tutorials` exception.
- Why it matters:
  - Small route, shell, or exception-surface changes can still affect onboarding exit, tutorial entry and exit, tab defaults, and later cleanup reviews because navigation meaning is distributed across layers.
- Likely blast radius:
  - Onboarding-to-home transition, tutorial entry and exit, tab resets, nested-stack entry assumptions, and later navigation cleanup lanes.
- Recommended bounded follow-on lane:
  - Navigation ownership clarification note.

### RC-03 - Mixed persistence / storage truth

- Class: Architecture coupling
- Severity: High
- Evidence / affected surfaces:
  - `src/redux/store/store.js` persists seven Redux slices to the `root` AsyncStorage key.
  - `src/redux/actions/auth.js` separately reads and writes `user_profile`, local password keys, and onboarding keys outside the persisted `root` blob.
  - `src/bootstrap/AppBootstrap.js` reads `user_profile` directly from AsyncStorage for initial route selection.
  - `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js` stores onboarding values and final profile data directly in AsyncStorage.
  - `src/screens/nutrition/pages/Nutrition/Nutrition.js` writes `meal_id` directly to AsyncStorage, and `src/screens/nutrition/pages/MealDetail/MealDetail.js` reads it back for item insertion flow.
  - `src/storage/mmkv/hydration.js` seeds bundled plans into MMKV under `plans_brunch_body`, independent of the persisted Redux root.
  - `README.md` and `docs/architecture/app-structure-inventory.md` both describe a split local storage posture across Redux Persist, direct AsyncStorage keys, and MMKV.
- Coupling pattern:
  - Domain truth is distributed across Redux Persist, direct AsyncStorage keys, UI-level storage handoff, and MMKV bootstrap state.
- Why it matters:
  - Reset, bug-fix, cleanup, and review work must account for multiple persistence paths, which raises the risk of partial fixes or incorrect assumptions about the source of truth.
- Likely blast radius:
  - Launch behavior, profile/account state, nutrition flows, recreation plan hydration, delete/reset semantics, and any future persistence cleanup.
- Recommended bounded follow-on lane:
  - Local persistence boundary map.

### RC-04 - Local-first truth vs remote-mode residue

- Class: Trust/disclosure coupling
- Severity: Medium
- Evidence / affected surfaces:
  - `src/config/runtimeMode.js` keeps `LOCAL_ONLY_MODE_ENABLED = true` as the current source of truth while reserving `false` for future backend reintroduction.
  - `src/config/appMode.js` still defines `APP_MODES.REMOTE_SYNC` and preserves fail-fast mode helpers around the local-only contract.
  - `README.md` documents the local-only mode flag, explicitly reserves future backend return, and includes migration notes for later reintroduction.
  - `docs/architecture/legacy-residue-audit.md` already classifies runtime/mode residue as a scoped cleanup concern rather than an active behavior path.
- Coupling pattern:
  - The current local-only contract is coupled to retained future-mode scaffolding and public documentation about a mode that is not active today.
- Why it matters:
  - This is less a runtime defect than a truth-management risk: reviewers and future contributors can over-read remote readiness if current-only behavior and reserved future scaffolding are not clearly separated.
- Likely blast radius:
  - README accuracy, review assumptions, local-only guardrail reasoning, and future cleanup prioritization.
- Recommended bounded follow-on lane:
  - Local-first truth alignment pass.

### RC-05 - Settings/account trust coupling

- Class: Trust/disclosure coupling
- Severity: High
- Evidence / affected surfaces:
  - `README.md` states that current behavior includes device-local account actions in Settings plus delete-account reset behavior and local export.
  - `src/screens/setting/pages/Setting/Setting.js` exposes logout, export, support/legal links, and account/profile entrypoints from one settings surface.
  - `src/redux/actions/auth.js` implements local email update, local password change/reset, logout, and delete-account behavior using device-local storage only.
  - `src/screens/setting/pages/MyProfile/DeleteAccount.js` confirms the delete flow through UI messaging and then resets navigation to `CompleteProfile`.
  - `src/redux/actions/auth.js` clears AsyncStorage, clears MMKV, dispatches `RESET_APP`, and then re-runs plan hydration after delete.
  - `src/screens/setting/pages/Export To CSV/ExportToCSV.js` writes export files locally via filesystem/storage permissions rather than any server path.
  - `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md` and `docs/release/public-repository-visibility-2026-03-29.md` both rely on these settings/account behaviors when describing current local-only posture.
- Coupling pattern:
  - One trust-sensitive area mixes local credential-like values, delete/reset semantics, export behavior, legal/support links, and navigation reset expectations across code and disclosure surfaces.
- Why it matters:
  - These are high-trust user-facing behaviors. Even a bounded cleanup lane can create confusion if delete/reset, local-only account semantics, or export behavior drift out of sync across code and docs.
- Likely blast radius:
  - Settings, delete/reset, export, account profile flows, privacy posture, and public-release communication.
- Recommended bounded follow-on lane:
  - Settings/account trust-surface behavior matrix.

### RC-06 - Cross-domain Redux/domain sprawl

- Class: Architecture coupling
- Severity: Medium-High
- Evidence / affected surfaces:
  - `src/redux/store/store.js` persists seven slices under one root persistence boundary.
  - `docs/architecture/app-structure-inventory.md` notes that action modules read local storage directly, reducers contain derived-data logic, and broad domains such as recreation and settings hold mixed responsibilities.
  - The same inventory notes that todo state lives as its own Redux slice while the main todo UI sits under the calendar screen domain.
  - `src/redux/index.js` re-exports actions, constants, reducers, store, and persistor from one central Redux surface, which makes Redux a major cross-domain fan-in point.
- Coupling pattern:
  - State ownership spans reducers, direct storage calls, derived calculations, and screen-domain boundaries that do not map cleanly to one another.
- Why it matters:
  - Cleanup lanes become harder to bound because a change that appears domain-local can rely on shared reducer behavior, persisted shapes, or storage side effects elsewhere.
- Likely blast radius:
  - State reset behavior, derived dashboards, calendar/todo interaction, recreation and nutrition persistence, and future refactor scoping.
- Recommended bounded follow-on lane:
  - Redux domain boundary review.

### RC-07 - Tooling/runtime ambiguity

- Class: Architecture coupling
- Severity: Low
- Evidence / affected surfaces:
  - `package.json` mixes React Native app/runtime dependencies with Expo packages and TypeScript tooling.
  - `src/utils/storageUtils.ts` is the only inspected TypeScript source file under `src/`, which suggests the repo is not consistently typed end-to-end.
  - `docs/qa/local-data-validation-report.md` records that the requested validation suite failed to execute in that environment because of dependency-resolution issues, even though static local-only checks passed.
- Coupling pattern:
  - Verification confidence depends partly on a toolchain story that is mixed and not fully reflected in one runtime/test boundary.
- Why it matters:
  - This is not currently the highest product-risk surface, but it can slow or complicate Phase 1 verification lanes when cleanup work needs fresh automated evidence.
- Likely blast radius:
  - CI/test reruns, local validation, and verification effort for later cleanup lanes more than end-user runtime behavior.
- Recommended bounded follow-on lane:
  - Verification/tooling clarification note.

### RC-08 - Code/docs/disclosure truth drift risk

- Class: Trust/disclosure coupling
- Severity: Medium-High
- Evidence / affected surfaces:
  - `README.md` is the main current-behavior contract for local-first operation, startup routing, settings account actions, storage posture, and no-cloud-sync claims.
  - `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md`, `docs/release/public-repository-visibility-2026-03-29.md`, and `docs/security/security-review-2026-03-28-followup.md` repeat parts of that local-only/device-local posture in release and disclosure form.
  - `src/screens/setting/pages/Setting/Setting.js` labels the export entry as `Export Journal to Files`, while the routed surface is `ExportToCSV`, and local delete/reset/export behavior is spread across several code and doc surfaces.
  - `docs/architecture/legacy-residue-audit.md` already identifies naming and disclosure-adjacent drift risk around export semantics, naming, and public posture.
- Coupling pattern:
  - Current trust posture depends on multiple docs and in-app labels staying aligned with local-only code behavior.
- Why it matters:
  - In Phase 1, trust can drift through partial doc or copy updates even when runtime behavior does not change. That makes this a cleanup-sequencing risk as well as a disclosure hygiene risk.
- Likely blast radius:
  - Public repo positioning, privacy/release statements, review expectations, and settings/account user expectations.
- Recommended bounded follow-on lane:
  - Docs-truth alignment pass.

## Most sensitive files / surfaces

### Highest blast radius

- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`
- `src/navigation/RootNavigation.js`
- `src/redux/store/store.js`
- `src/redux/actions/auth.js`
- `src/storage/mmkv/hydration.js`

### Highest trust sensitivity

- `src/screens/setting/pages/Setting/Setting.js`
- `src/screens/setting/pages/MyProfile/DeleteAccount.js`
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js`
- `README.md`
- `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md`
- `docs/release/public-repository-visibility-2026-03-29.md`

### Highest structural review priority

- Root startup boundary: `src/bootstrap/AppBootstrap.js`, `src/root-container/RootContainer.js`, `src/navigation/RootNavigation.js`
- Onboarding persistence boundary: `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
- Nutrition storage handoff boundary: `src/screens/nutrition/pages/Nutrition/Nutrition.js`, `src/screens/nutrition/pages/MealDetail/MealDetail.js`
- Local reset and hydration boundary: `src/redux/actions/auth.js`, `src/storage/mmkv/hydration.js`

## Priority order

1. Clean up boot-path ownership and mixed persistence truth first. Those surfaces have the highest blast radius and affect both launch behavior and later cleanup safety.
2. Review settings/account trust-sensitive semantics next, especially delete/reset/export behavior and the local-only account contract.
3. Tackle navigation entry and ownership coupling plus Redux/domain sprawl after startup and trust-sensitive storage boundaries are better mapped.
4. Align code/docs/disclosure truth once the core behavior boundaries are clearly described, so later updates do not reintroduce trust drift.
5. Leave tooling/runtime clarification for last unless it blocks verification evidence for the higher-priority lanes.

## Suggested follow-on lane seeds

These lane seeds are sequencing inputs only. They are not implementation approval.

- Boot-path ownership note
- Local persistence boundary map
- Settings/account trust-surface behavior matrix
- Navigation ownership clarification note
- Redux domain boundary review
- Docs-truth alignment pass

## Bottom line

The safest Phase 1 sequence is to stabilize startup and storage truth first, then review the trust-sensitive settings/account surfaces that depend on that truth, then narrow navigation and Redux boundary cleanup, and only after that tighten supporting docs and verification posture. That sequence keeps the highest blast-radius behavior stable while preserving the current local-first contract.
