# Lane: 1.1.1.2 Legacy residue audit

## Summary

Audit the legacy codebase for residue that increases maintenance cost, leaves misleading future-path signals, preserves dead transition-era patterns, or creates trust/disclosure ambiguity.

This is an evidence-gathering lane only. It belongs under Phase 1 cleanup/stabilization because the Brunch Body project scope explicitly includes architecture audit/refactor planning, navigation/state/storage cleanup, dependency/tooling cleanup, baseline testing, and cleanup decision logs.

## Classification

Ready for codex

## Scope

### In Scope

- Inventory legacy residue across:
  - app-mode/runtime flags
  - remote/backend remnants
  - dependency/tooling residue
  - storage/persistence residue
  - docs/copy/repo naming residue
  - release/readiness residue
- Identify code, config, docs, or dependency surfaces that exist only for:
  - backward compatibility
  - future remote/backend reintroduction
  - earlier architecture eras
  - abandoned or partially removed patterns
- Classify each residue item as:
  - keep intentionally
  - remove now
  - remove after dependent lane
  - document only
- Produce a prioritized residue register with evidence and suggested follow-up lanes.
- Flag any residue that weakens or confuses the current local-first/privacy-forward product story.
- Distinguish intentional scaffolding from accidental dead residue.

### Out of Scope

- No code removal
- No refactor
- No behavior change
- No backend/sync reintroduction
- No disclosure rewrite
- No store copy edits
- No broad architecture redesign
- No lint/tooling fixes in this lane
- No UX redesign

## Files / Surfaces

Primary requested surfaces for this audit:

- `README.md`
- `package.json`
- `src/config/runtimeMode.js`
- `src/config/appMode.js`
- `.github/workflows/local-only-guard.yml`
- `scripts/check-local-only-mode.js`
- `docs_release_signoff_2026-03-28.md`
- relevant `docs/` files covering local-only behavior, migration, secrets, export/backup, or release posture
- targeted `src/` files only as needed to verify residue categories

Additional supporting files were inspected only when directly implicated by evidence from the primary surfaces:

- `docs/architecture/app-structure-inventory.md`
- `src/config/mode.js`
- `src/redux/actions/auth.js`
- `src/storage/mmkv/hydration.js`
- `src/storage/mmkv/index.js`
- `src/storage/mmkv/keys.js`
- `src/navigation/RootNavigation.js`
- `src/navigation/DashboardNavigation.js`
- `src/screens/setting/pages/Setting/Setting.js`
- `src/screens/setting/pages/MyProfile/DeleteAccount.js`
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js`
- `src/screens/splashScreen/pages/splashScreen/SplashScreen.js`
- `src/screens/welcome/pages/welcome/Welcome.js`
- `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md`
- `docs/release/public-repository-visibility-2026-03-29.md`
- `docs/release/public-repo-release-go-no-go-2026-03-29-rc2.md`
- `docs/release/public-repo-release-go-no-go-2026-03-28.md`
- `docs/release/RELEASE_NOTES_1.0.3-rc.2.md`
- `docs/release/RELEASE_NOTES_1.0.0-rc1.md`
- `docs/security/oauth-client-hardening.md`

## Dependencies

- Governing inputs:
  - Brunch Body project template structure supplied with the task
  - `Brunch Body Project Scope.md`
  - current repo state
- Companion input:
  - `docs/architecture/app-structure-inventory.md` if available
- No policy decision dependency is required because this lane is inventory-only.

## Acceptance Criteria

- Create a single markdown audit artifact for lane `1.1.1.2`.
- The artifact lists each residue item with:
  - file/path
  - residue category
  - concrete evidence
  - why it qualifies as residue
  - risk if left in place
  - recommended disposition (`keep intentionally`, `remove now`, `remove after dependent lane`, `document only`)
  - follow-up lane suggestion if deferred
- The audit explicitly covers:
  - app-mode/runtime flags
  - remote/backend remnants
  - dependency/tooling residue
  - storage/persistence residue
  - docs/copy/repo naming residue
  - release/readiness residue
- The audit explicitly calls out items that may confuse users or reviewers about:
  - local-only behavior
  - trust/privacy posture
  - delete/reset/export semantics
  - future backend assumptions
- The audit separates:
  - intentional compatibility scaffolding
  - active guardrails
  - dead or suspicious residue
- No files are modified outside the new audit artifact.
- Findings are granular enough to derive at least 2-5 follow-on cleanup lanes.

## Risks / Notes

- Do not assume all legacy-looking material should be removed. Some is deliberate scaffolding.
- Current repo evidence states:
  - local-first by default
  - future backend mode is only reserved
  - `LOCAL_ONLY` is still exported as a backward-compatible alias
  - CI enforces local-only guardrails
  - release readiness remains blocked pending signed artifacts and approvals
- Treat those as classification evidence, not automatic removal targets.
- Keep this lane evidence-heavy and narrow.

## Constraints

- Keep scope narrow.
- Evidence only; no implementation changes.
- Do not expand beyond stated files/surfaces except where a primary surface directly implicates a supporting file.
- Do not introduce backend/cloud behavior.
- Do not change disclosures, privacy claims, or deletion semantics.
- Prefer minimal diffs.
- If a residue item is ambiguous, classify it and explain the ambiguity rather than removing or redesigning it.
- Ground claims in the repo and project scope.
- Use repo-relative paths and task-provided artifacts only; do not depend on absolute workstation paths.

## Acceptance

- One markdown audit artifact is created for `1.1.1.2`.
- The artifact includes an evidence-backed residue register with disposition and follow-up suggestions.
- No production behavior, tests, configs, or user-facing copy are changed.

## Do not

- Remove code
- Fix lint
- Refactor storage
- Rewrite docs
- Reopen backend/sync
- Collapse intentional guardrails into generic cleanup
- Widen this lane into a repo-wide modernization pass
- Consolidate or edit duplicate docs in this lane; classify them only

## Review standard

- Keep scope narrow.
- Do not expand beyond stated files/surfaces.
- Do not introduce backend/cloud behavior unless explicitly requested.
- Do not change disclosures, privacy claims, or deletion semantics unless this lane explicitly includes them.
- Prefer minimal diffs.
- Add tests only for touched logic or required acceptance.
- If the task is broader than stated, stop and leave a note rather than widening scope.

## Audit Method

- Reviewed the primary requested surfaces first, then inspected only directly implicated supporting files.
- Used `docs/architecture/app-structure-inventory.md` as companion context where it narrowed ambiguity around navigation, storage, and naming residue.
- Treated residue as any surface preserved for backward compatibility, future remote/backend reintroduction, earlier architecture eras, or partially removed patterns.
- Used exact `import` / `require` scans across `src`, `ios`, `android`, `scripts`, `__tests__`, `App.js`, and `index.js` before calling a dependency "unused in the current repo."
- Defaulted ambiguous items to `document only` rather than inferring removal.
- Did not modify code, tests, configs, or existing docs.

## Residue Register

### Summary Table

| ID | Bucket | Residue category | File / Path | Recommended disposition | Follow-up lane suggestion |
| --- | --- | --- | --- | --- | --- |
| LR-01 | intentional compatibility scaffolding | app-mode/runtime flags | `src/config/runtimeMode.js`, `src/config/appMode.js`, `README.md` | keep intentionally | none until a dedicated runtime-shim deprecation lane exists |
| LR-02 | dead or suspicious residue | app-mode/runtime flags | `src/config/mode.js` | remove after dependent lane | runtime mode shim cleanup |
| LR-03 | active guardrails | remote/backend remnants | `.github/workflows/local-only-guard.yml`, `scripts/check-local-only-mode.js` | keep intentionally | none while local-only contract remains enforced |
| LR-04 | dead or suspicious residue | remote/backend remnants | `README.md` | remove after dependent lane | future-path docs trim |
| LR-05 | intentional compatibility scaffolding | remote/backend remnants | `docs/security/oauth-client-hardening.md` | document only | backend/OAuth history framing lane |
| LR-06 | dead or suspicious residue | dependency/tooling residue | `package.json` | remove after dependent lane | dependency residue verification and prune |
| LR-07 | document-only transition residue | dependency/tooling residue | `package.json`, `src/utils/storageUtils.ts` | document only | JS/TS strategy clarification lane |
| LR-08 | dead or suspicious residue | storage/persistence residue | `README.md`, `docs/architecture/app-structure-inventory.md`, `src/navigation/RootNavigation.js` | remove after dependent lane | local persistence boundary cleanup |
| LR-09 | dead or suspicious residue | storage/persistence residue | `src/screens/setting/pages/MyProfile/DeleteAccount.js`, `src/redux/actions/auth.js`, `src/storage/mmkv/hydration.js` | remove after dependent lane | delete/reset semantics alignment |
| LR-10 | dead or suspicious residue | docs/copy/repo naming residue | `src/screens/setting/pages/Export To CSV/ExportToCSV.js`, `src/screens/setting/pages/Setting/Setting.js`, `README.md`, `docs/release/RELEASE_NOTES_1.0.3-rc.2.md` | remove after dependent lane | export naming and disclosure alignment |
| LR-11 | dead or suspicious residue | docs/copy/repo naming residue | `README.md`, `package.json`, `src/screens/setting/pages/Setting/Setting.js`, `src/navigation/RootNavigation.js`, `docs/architecture/app-structure-inventory.md` | remove after dependent lane | naming normalization lane |
| LR-12 | dead or suspicious residue | release/readiness residue | `docs_release_signoff_2026-03-28.md`, `docs/release-signoff-2026-03-28.md` | remove now | release evidence consolidation |
| LR-13 | dead or suspicious residue | release/readiness residue | `docs/release/public-repo-release-go-no-go-2026-03-28.md`, `docs/release/public-repo-release-go-no-go-2026-03-29-rc2.md`, `docs/release/public-repository-visibility-2026-03-29.md` | remove now | release source-of-truth cleanup |
| LR-14 | dead or suspicious residue | release/readiness residue | `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md`, `docs/release/RELEASE_NOTES_1.0.3-rc.2.md`, `package.json` | remove after dependent lane | release doc version alignment |

### App-mode/runtime flags

#### LR-01 - Compatibility mode surface intentionally retained

- Bucket: intentional compatibility scaffolding
- File / Path: `src/config/runtimeMode.js:1-10`; `src/config/appMode.js:1-22`; `README.md:22-30`
- Residue category: app-mode/runtime flags
- Concrete evidence:
  - `src/config/runtimeMode.js:4-10` defines `LOCAL_ONLY_MODE_ENABLED = true`, keeps `false` reserved for future backend reintroduction, and still exports `LOCAL_ONLY` as an alias.
  - `src/config/appMode.js:3-19` still defines `APP_MODES.LOCAL_ONLY` and `APP_MODES.REMOTE_SYNC`, exports `APP_MODE`, and throws when non-local mode is encountered.
  - `README.md:24-30` documents the single flag, the reserved `REMOTE_SYNC` path, and the backward-compatible alias.
- Why this qualifies as residue: the current app is local-only, but the mode surface intentionally preserves a transition API and a future remote branch that is not active today.
- Risk if left in place: reviewers may overestimate current remote readiness, but removing the surface too early would break compatibility and weaken explicit fail-fast behavior.
- Recommended disposition: keep intentionally
- Follow-up lane suggestion: none until a dedicated runtime-shim deprecation lane is approved

#### LR-02 - Orphaned mode re-export shim

- Bucket: dead or suspicious residue
- File / Path: `src/config/mode.js:1-2`
- Residue category: app-mode/runtime flags
- Concrete evidence:
  - `src/config/mode.js:1-2` contains only a comment calling itself a backward-compatible re-export plus a re-export of `LOCAL_ONLY` and `LOCAL_ONLY_MODE_ENABLED`.
  - This audit did not find in-repo `import` or `require` consumers for `config/mode`.
- Why this qualifies as residue: it is a transition shim with no confirmed current in-repo caller.
- Risk if left in place: it widens the apparent runtime-mode API surface and makes deprecation boundaries harder to reason about.
- Recommended disposition: remove after dependent lane
- Follow-up lane suggestion: runtime mode shim cleanup lane that first re-checks for external or branch-only consumers

### Remote/backend remnants

#### LR-03 - Local-only remote integration guard retained intentionally

- Bucket: active guardrails
- File / Path: `.github/workflows/local-only-guard.yml:1-26`; `scripts/check-local-only-mode.js:14-78`; `README.md:44-53`
- Residue category: remote/backend remnants
- Concrete evidence:
  - `.github/workflows/local-only-guard.yml:1-26` runs `npm run check:local-only` on pull requests and pushes to `main`.
  - `scripts/check-local-only-mode.js:14-37` keys off `LOCAL_ONLY_MODE_ENABLED` or legacy `LOCAL_ONLY`, then scans for Firebase, AWS/AppSync/Amplify, and `api/user/` usage.
  - `README.md:46-53` documents the workflow as the current enforcement mechanism.
- Why this qualifies as residue: the guard exists specifically because historical or future remote integration paths are considered a regression risk in a local-only codebase.
- Risk if left in place: low maintenance cost, but it can look like dormant remote support unless clearly framed as a guardrail. Removing it would directly weaken the local-only contract.
- Recommended disposition: keep intentionally
- Follow-up lane suggestion: none while local-only behavior remains the governed product posture

#### LR-04 - README carries a future-backend migration playbook in top-level public docs

- Bucket: dead or suspicious residue
- File / Path: `README.md:123-149`
- Residue category: remote/backend remnants
- Concrete evidence:
  - `README.md:123-149` contains a six-step "Migration Notes (future backend reintroduction)" section covering schema stability, hydration, dual-write windows, conflict resolution, and rollback behavior.
  - The same README also states the current build has no backend persistence and no automatic cloud backup/sync (`README.md:112-117`).
- Why this qualifies as residue: it preserves an implementation playbook for a future remote system inside the top-level current-state readme of a repo positioned as an active-development beta with local-only behavior.
- Risk if left in place: it sends misleading future-path signals to reviewers and contributors, and can blur the line between reserved behavior and supported behavior.
- Recommended disposition: remove after dependent lane
- Follow-up lane suggestion: future-path docs trim lane that moves speculative reintroduction notes out of top-level contributor-facing docs

#### LR-05 - Historical OAuth decommission record still advertises provider-side cleanup work

- Bucket: intentional compatibility scaffolding
- File / Path: `docs/security/oauth-client-hardening.md:17-64`; `README.md:190-194`
- Residue category: remote/backend remnants
- Concrete evidence:
  - `docs/security/oauth-client-hardening.md:17-37` records a historical iOS OAuth client ID and provider-console cleanup steps.
  - `docs/security/oauth-client-hardening.md:53-64` keeps a reintroduction gate for any future OAuth return.
  - `README.md:190-194` points readers to that record from the top-level readme even though the app does not ship with OAuth.
- Why this qualifies as residue: it is preserved identity-provider residue from a removed sign-in path, even though it also serves as a security decision log.
- Risk if left in place: readers may infer a live OAuth dependency or outstanding cloud setup requirement when the current build has no OAuth runtime.
- Recommended disposition: document only
- Follow-up lane suggestion: backend/OAuth history framing lane to keep the record while isolating it from current-behavior docs

### Dependency/tooling residue

#### LR-06 - Package manifest still includes unimported runtime/tooling candidates

- Bucket: dead or suspicious residue
- File / Path: `package.json:20-28`; `package.json:53`; repo import scan performed for this audit
- Residue category: dependency/tooling residue
- Concrete evidence:
  - `package.json` still lists `@react-native/new-app-screen`, `axios`, `expo`, `expo-linear-gradient`, `expo-modules-core`, and `redux-promise`.
  - This audit's exact `import` / `require` scan across `src`, `ios`, `android`, `scripts`, `__tests__`, `App.js`, and `index.js` found no direct import matches for those packages.
  - `docs_release_signoff_2026-03-28.md:64-66` separately notes no active `fetch(` or `axios` call sites in current local-only code paths.
- Why this qualifies as residue: these dependencies remain in the manifest even though current in-repo code does not directly import them, which is a classic transition-era tooling footprint.
- Risk if left in place: larger install/audit surface, noisier security/license review, and misleading signals about Expo/network/new-app-screen usage.
- Recommended disposition: remove after dependent lane
- Follow-up lane suggestion: dependency residue verification and prune lane that confirms no hidden native/build reliance before removal

#### LR-07 - Partial TypeScript/tooling adoption remains unresolved

- Bucket: document-only transition residue
- File / Path: `package.json:68-80`; `src/utils/storageUtils.ts:1-10`
- Residue category: dependency/tooling residue
- Concrete evidence:
  - `package.json:68-80` includes `@typescript-eslint/parser` and `typescript`.
  - The current repo has one tracked TypeScript source file, `src/utils/storageUtils.ts:1-10`.
  - That helper is still live: it is imported by `src/storage/mmkv/hydration.js`, `src/redux/actions/recreation.js`, and is mocked in `__tests__/localDataValidation.test.js`.
- Why this qualifies as residue: the repo exposes TypeScript tooling and one typed utility without broader TypeScript adoption, which looks transitional rather than settled.
- Risk if left in place: contributors cannot tell whether the project is actively migrating to TypeScript or simply carrying leftover tooling.
- Recommended disposition: document only
- Follow-up lane suggestion: JS/TS strategy clarification lane before any parser or compiler cleanup is attempted

### Storage/persistence residue

#### LR-08 - Persistence contract is split across Redux Persist, direct AsyncStorage, and MMKV

- Bucket: dead or suspicious residue
- File / Path: `README.md:85-117`; `docs/architecture/app-structure-inventory.md:187-245`; `src/navigation/RootNavigation.js:85-93`
- Residue category: storage/persistence residue
- Concrete evidence:
  - `README.md:89-117` documents a storage map that spans Redux Persist, direct AsyncStorage keys, and MMKV.
  - `docs/architecture/app-structure-inventory.md:189-226` records direct AsyncStorage use in Redux actions, UI pages, and navigation, alongside Redux Persist and MMKV.
  - `src/navigation/RootNavigation.js:87-93` reads `user_profile` directly from AsyncStorage to choose the initial route.
- Why this qualifies as residue: this is not a single current persistence boundary; it is a layered carry-over from multiple architecture eras.
- Risk if left in place: higher maintenance cost, harder cleanup planning, and more confusion around what reset/export/delete semantics actually cover.
- Recommended disposition: remove after dependent lane
- Follow-up lane suggestion: local persistence boundary cleanup lane

#### LR-09 - "Delete account" is implemented as local reset plus bundled-plan rehydration

- Bucket: dead or suspicious residue
- File / Path: `src/screens/setting/pages/MyProfile/DeleteAccount.js:43-65`; `src/redux/actions/auth.js:120-146`; `src/storage/mmkv/hydration.js:7-16`; `src/storage/mmkv/keys.js:1-5`
- Residue category: storage/persistence residue
- Concrete evidence:
  - `DeleteAccount.js:43-47` shows the success message `"User deleted successfully."`.
  - `auth.js:138-145` dispatches `RESET_APP`, clears AsyncStorage, clears MMKV, and immediately re-runs `hydrateWorkoutPlans()`.
  - `hydration.js:7-16` then writes bundled `plans_brunch_body` back into MMKV when `is_initialized` is absent.
- Why this qualifies as residue: the user-facing label still reflects an account-deletion model, while the underlying behavior is a device-local reset that intentionally restores bundled plan data.
- Risk if left in place: high trust/disclosure ambiguity about what is actually deleted, what remains after reset, and whether the action is account-based or device-local.
- Recommended disposition: remove after dependent lane
- Follow-up lane suggestion: delete/reset semantics alignment lane covering naming, disclosures, and retained bundled-data behavior

### Docs/copy/repo naming residue

#### LR-10 - Export surface still says CSV while implementation writes XLSX files

- Bucket: dead or suspicious residue
- File / Path: `src/screens/setting/pages/Export To CSV/ExportToCSV.js:104-139`; `src/screens/setting/pages/Setting/Setting.js:102-105`; `README.md:12`; `docs/release/RELEASE_NOTES_1.0.3-rc.2.md:12-17`
- Residue category: docs/copy/repo naming residue
- Concrete evidence:
  - `Setting.js:102-105` labels the settings entry `"Export Journal to Files"` and routes to `ExportToCSV`.
  - `ExportToCSV.js:105-128` creates a workbook with `bookType: 'xlsx'`, names the output `*.xlsx`, and uses `react-native-scoped-storage` / `react-native-fs` to write a local file.
  - `README.md:12` and `RELEASE_NOTES_1.0.3-rc.2.md:17` still describe the feature as "Export to CSV" or exported journal data without matching the actual file type.
- Why this qualifies as residue: feature naming reflects an earlier export concept that no longer matches the concrete implementation.
- Risk if left in place: users and reviewers may misunderstand export format, portability expectations, and support/disclosure wording.
- Recommended disposition: remove after dependent lane
- Follow-up lane suggestion: export naming and disclosure alignment lane

#### LR-11 - Repo/product naming drift and persisted spelling errors remain visible

- Bucket: dead or suspicious residue
- File / Path: `README.md:1`; `package.json:2`; `src/screens/setting/pages/Setting/Setting.js:127-129`; `src/navigation/RootNavigation.js:140-144`; `docs/architecture/app-structure-inventory.md:256-259`
- Residue category: docs/copy/repo naming residue
- Concrete evidence:
  - `README.md:1` titles the repo `Brunch-Body-Fitness-Legacy-Codebase`, while `package.json:2` names the app `BrunchBody`, and project planning uses `Brunch Body`.
  - `Setting.js:127-129` and `RootNavigation.js:140-144` still expose `Abbrevations` as the route/screen name.
  - `docs/architecture/app-structure-inventory.md:256-259` already flags the `Abbrevations` spelling and naming drift as structural risk.
- Why this qualifies as residue: these are earlier naming/rebrand artifacts and persisted misspellings rather than intentional current-state terminology.
- Risk if left in place: credibility loss, search/grep friction, and avoidable reviewer confusion about canonical project naming.
- Recommended disposition: remove after dependent lane
- Follow-up lane suggestion: naming normalization lane that updates canonical names and spelling after routing/file impacts are scoped

### Release/readiness residue

#### LR-12 - Duplicate release sign-off documents exist for the same date and purpose

- Bucket: dead or suspicious residue
- File / Path: `docs_release_signoff_2026-03-28.md:1-76`; `docs/release-signoff-2026-03-28.md:1-66`
- Residue category: release/readiness residue
- Concrete evidence:
  - Both files are titled `Release Sign-off - 2026-03-28`.
  - The repo-root version records a version bump from `1.0.1` to `1.0.2` and notes lint failure plus missing toolchains.
  - The `docs/` version targets release candidate `1.0.1 (4)` and records a different blocker checklist/output framing.
- Why this qualifies as residue: these are overlapping release records with partially different framing and details, which indicates duplicated transition-era documentation rather than one clean audit trail.
- Risk if left in place: release reviewers can cite the wrong artifact, and traceability of signed-release gating becomes less trustworthy.
- Recommended disposition: remove now
- Follow-up lane suggestion: release evidence consolidation lane that preserves one canonical archived sign-off record per candidate/date

#### LR-13 - Older public release gate file remains beside the newer RC2 source of truth

- Bucket: dead or suspicious residue
- File / Path: `docs/release/public-repo-release-go-no-go-2026-03-28.md:1-22`; `docs/release/public-repo-release-go-no-go-2026-03-29-rc2.md:1-30`; `docs/release/public-repository-visibility-2026-03-29.md:24-37`
- Residue category: release/readiness residue
- Concrete evidence:
  - `public-repository-visibility-2026-03-29.md:24-30` explicitly says to keep `public-repo-release-go-no-go-2026-03-29-rc2.md` as the source of truth for signed app/public-release tagging.
  - The older `public-repo-release-go-no-go-2026-03-28.md:1-22` remains in the same active release-docs namespace with a similar "NO-GO / NOT READY FOR PUBLIC RELEASE" role.
  - The newer RC2 file carries the expanded evidence set and approval requirements for the current candidate.
- Why this qualifies as residue: a superseded release gate record remains in the live namespace after a newer file is declared canonical.
- Risk if left in place: reviewers may follow an outdated gate file, especially because both are similarly named and both end in a no-go decision.
- Recommended disposition: remove now
- Follow-up lane suggestion: release source-of-truth cleanup lane

#### LR-14 - Privacy disclosure document version label lags the current release candidate

- Bucket: dead or suspicious residue
- File / Path: `docs/privacy/PLATFORM_PRIVACY_DISCLOSURES.md:1-3`; `docs/release/RELEASE_NOTES_1.0.3-rc.2.md:28-31`; `package.json:2-3`
- Residue category: release/readiness residue
- Concrete evidence:
  - `PLATFORM_PRIVACY_DISCLOSURES.md:1-3` is still titled `Release Candidate 1.0.0-rc2`.
  - `RELEASE_NOTES_1.0.3-rc.2.md:28-31` and `package.json:2-3` show the current candidate/version is `1.0.3-rc.2`.
  - The privacy doc content is still current in substance, but its heading/version framing lags the candidate now referenced by release gating docs.
- Why this qualifies as residue: it preserves earlier release-candidate framing inside a doc that can be read as current release evidence.
- Risk if left in place: stale release/readiness signals in privacy evidence, especially for reviewers cross-checking release docs quickly.
- Recommended disposition: remove after dependent lane
- Follow-up lane suggestion: release doc version alignment lane

## Follow-on Lane Suggestions

1. Runtime mode shim cleanup
   - Re-check `src/config/mode.js`, `LOCAL_ONLY`, and other compatibility exports for real consumers, then remove orphaned shims while preserving active local-only fail-fast protections.
2. Future-path docs trim
   - Move speculative backend reintroduction guidance and decommission-history framing out of top-level current-behavior docs while preserving decision logs.
3. Dependency residue verification and prune
   - Verify whether unimported manifest packages have any hidden native/build role, then remove confirmed residue from `package.json`.
4. Local persistence semantics alignment
   - Define one clear contract for delete/reset/export behavior and reconcile storage-layer wording with actual local data retention and rehydration behavior.
5. Release evidence consolidation and version alignment
   - Collapse duplicate release gate/sign-off records into one canonical artifact per candidate and align stale version labels in supporting release/privacy docs.
