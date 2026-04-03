# Lane: 1.1.2.2.8 Settings/account stack extraction

## Summary

This lane defines a bounded cleanup of `SettingsNavigation` so settings, account, legal, and export routes are intentionally owned by the settings-domain nested stack under the authenticated tab shell.

`Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane. Live code is authoritative for current-state facts. Nearby approved lane docs and the supplied lane brief may inform cadence and phrasing only.

Startup behavior, authenticated-shell entry, current settings route names, and screen-internal behavior must be preserved exactly. The intent is to clarify settings-stack ownership without changing bootstrap semantics, tab purpose, route names, or settings screen behavior.

## Classification

Ready for codex

## Scope

### In Scope

- settings/account stack extraction and boundary cleanup in `SettingsNavigation`
- preserve the relationship where `BottomTabNavigation` mounts `SettingsNavigation` behind the `Settings` tab
- preserve the current settings/account/legal/export stack route set unless a narrowly scoped extraction cleanup requires a smaller ownership adjustment:
  - `Settings`
  - `MyProfile`
  - `MyVitals`
  - `MyAccount`
  - `MyEmail`
  - `MyPassword`
  - `DeleteAccount`
  - `ExportToCSV`
  - `TermsOfUse`
  - `PrivacyPolicy`
  - `Abbrevations`
- clarify what belongs inside the settings nested stack versus what belongs in the tab shell or root stack
- keep the change set minimal, bounded, and reviewable
- make later settings/account cleanup lanes smaller and safer

### Out of Scope

- no startup-rule changes
- no onboarding rewrite
- no tab redesign
- no route renames
- no screen-internal behavior changes
- no broader settings UX redesign
- no journal, nutrition, recreation, or dashboard extraction
- no root-stack redesign
- no privacy or disclosure rewrite beyond documenting current ownership
- no dependency or tooling changes
- no unrelated UX cleanup

## Files / Surfaces

Primary implementation evidence for this lane:

- `src/navigation/SettingsNavigation.js`
- `src/navigation/BottomTabNavigation.js`
- `src/navigation/RootNavigation.js`
- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`
- `src/screens/setting/index.js`
- `src/screens/setting/pages/Setting/Setting.js`
- `src/screens/completeProfile/components/Welcome.js`
- `src/screens/setting/pages/Tutorials/Tutorials.js`
- `README.md`

Current-state baseline and companion references only:

- `docs/architecture/navigation-tree-and-route-ownership.md`
- `docs/architecture/root-stack-boundary-cleanup.md`
- `docs/architecture/bottom-tab-shell-cleanup.md`
- `docs/architecture/calendar-stack-boundary-cleanup.md`
- `docs/architecture/journal-stack-extraction.md`
- `docs/architecture/nutrition-stack-extraction.md`
- `docs/architecture/recreation-stack-extraction.md`

These repo docs may inform context and section rhythm, but active code is authoritative if older prose still reflects pre-extraction root ownership. In particular, `docs/architecture/navigation-tree-and-route-ownership.md` still reflects older root-level settings ownership and should be treated as baseline context only for this lane.

`README.md` is a consistency check only for the local-first and device-local posture plus the current startup truthfulness. It does not override live code.

## Current State

Active code shows the current startup path as:

1. `AppBootstrap` resolves `Home` when local `user_profile` exists and `CompleteProfile` when it does not.
2. `RootContainer` receives `initialRouteName` and passes it into `RootNavigation`.
3. `RootNavigation` mounts `BottomTabNavigation` under `Home`.
4. `BottomTabNavigation` mounts `SettingsNavigation` behind the `Settings` tab.

`BottomTabNavigation` still initializes the authenticated tab shell to `Calendar`. That is current-state evidence only and is not a redesign target in this lane.

Active code also shows that `SettingsNavigation` currently owns a nested stack with `initialRouteName="Settings"` and the following eleven registered routes:

- `Settings`
- `MyProfile`
- `MyVitals`
- `MyAccount`
- `MyEmail`
- `MyPassword`
- `DeleteAccount`
- `ExportToCSV`
- `TermsOfUse`
- `PrivacyPolicy`
- `Abbrevations`

The current settings export surface in `src/screens/setting/index.js` provides the wrappers used by that nested stack.

Live settings flow evidence also supports keeping these routes together for this lane:

- the settings landing page launches `MyProfile`
- the settings landing page launches `ExportToCSV`
- the settings landing page launches `Abbrevations`
- `MyProfile` launches `MyVitals` and `MyAccount`
- `MyAccount` launches `MyEmail`, `MyPassword`, and `DeleteAccount`

The current settings landing uses a mix of in-stack routes and external links. In current code, the landing points `Terms of Use` and `Privacy Policy` to external URLs even though `TermsOfUse` and `PrivacyPolicy` remain registered in `SettingsNavigation`. This is present-state evidence only and is not a redesign target in this lane.

Active code also shows an intentional boundary exception: `Tutorials` lives under the settings module, is linked from the settings landing, and is linked from complete-profile onboarding, but it remains root-owned because `RootNavigation` still registers `Tutorials` directly. The tutorial flow currently exits by navigating through `Home` into `Dashboard`.

This is current-state evidence only. It supports preserving the current settings-stack ownership and the current root-owned `Tutorials` exception for this lane, but does not by itself settle broader long-term settings-domain architecture.

## Objective

Make `SettingsNavigation` a clearer, thinner settings/account-domain boundary under the `Settings` tab.

Ensure settings/account/legal/export routes are intentionally owned by the settings stack rather than remaining ambiguous across broader navigation layers. This cleanup should make later settings cleanup, naming cleanup, and smoke-test lanes safer and smaller without redesigning settings behavior.

## Boundary Rule for This Lane

After this cleanup, the settings nested stack should own only:

- the settings-domain entry route mounted by the `Settings` tab
- the minimum nested routes that clearly belong to the same settings/account/legal/export flow
- the minimal stack configuration needed to support that flow

The settings nested stack should not:

- become a catch-all host for unrelated detail routes
- duplicate root-stack responsibilities
- duplicate tab-shell responsibilities
- reopen broader domain-boundary decisions for journal, calendar, nutrition, recreation, dashboard, or settings UX redesign
- absorb the current root-owned `Tutorials` route without a separate lane that reopens that ownership decision
- alter the startup contract that routes returning users into `Home` and no-profile users into `CompleteProfile`

Operational deferral rule:

- if clarifying the settings boundary would require deciding that `Tutorials` or another route belongs to a different domain navigator rather than the settings/account/legal/export flow, stop and defer that decision to a later lane instead of widening this one

## Proposed Implementation Shape

This lane is bounded cleanup guidance, not a navigator redesign.

- preserve `Home` in `RootNavigation` as the authenticated shell entry
- preserve `Settings` in `BottomTabNavigation` as the tab that mounts `SettingsNavigation`
- preserve the current settings-stack routing behavior unless a smaller extraction cleanup requires a narrowly scoped ownership adjustment
- narrow `SettingsNavigation` to settings-stack concerns only: settings-domain entry, nested flow ownership, and stack-level defaults
- preserve the current eleven settings/account/legal/export route names and current nested-flow behavior unless a minimal wiring fix is strictly required
- preserve the current root-owned `Tutorials` exception for this lane even though the settings landing links to it and the tutorial screen still lives under the settings module
- record the current mix of in-stack routes and external links on the settings landing without treating that split as a redesign target
- avoid moving unrelated detail routes into `SettingsNavigation`
- avoid renaming routes in this lane unless strictly required to keep the nested stack functioning
- if a cleanup idea requires broader settings redesign, root-stack cleanup, tab-shell cleanup, naming cleanup, or a cross-domain ownership decision rather than settings-stack extraction, defer that work to a later lane instead of widening scope here

## Public Interfaces

This artifact changes no public APIs, route names, types, providers, dependencies, or runtime behavior.

The current contracts in `src/bootstrap/AppBootstrap.js`, `src/root-container/RootContainer.js`, `src/navigation/RootNavigation.js`, `src/navigation/BottomTabNavigation.js`, and `src/navigation/SettingsNavigation.js` are preserved invariants for this lane:

- local `user_profile` decides `Home` versus `CompleteProfile`
- `initialRouteName` passes through unchanged from bootstrap to root navigation
- `Home` remains the authenticated shell entry
- `Settings` remains the tab route that enters the settings stack
- `SettingsNavigation` remains the owner of the current settings/account/legal/export nested-stack routes unless a minimal wiring fix is strictly required
- `Tutorials` remains root-owned in current code unless a later lane explicitly reopens that ownership decision

## Dependencies

- `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` remain authoritative for this lane even when supplied outside the current repo snapshot or current chat file state
- nearby approved lane docs and the supplied lane brief may inform cadence and phrasing only, but they do not replace the governing Brunch Body project template and scope for this lane
- bootstrap semantics must remain unchanged
- `RootNavigation` must continue to mount the authenticated shell through `Home`
- `RootNavigation` must continue to own the current `Tutorials` registration for this lane
- `BottomTabNavigation` must continue to mount `SettingsNavigation` through the `Settings` tab
- `src/screens/setting/index.js` should be treated as the current settings export surface for the mounted wrappers
- `docs/architecture/navigation-tree-and-route-ownership.md` should be treated as a baseline evidence map only, with active code taking precedence because that artifact still reflects older root-level settings ownership
- `docs/architecture/root-stack-boundary-cleanup.md`, `docs/architecture/bottom-tab-shell-cleanup.md`, `docs/architecture/calendar-stack-boundary-cleanup.md`, `docs/architecture/journal-stack-extraction.md`, `docs/architecture/nutrition-stack-extraction.md`, and `docs/architecture/recreation-stack-extraction.md` should remain separate companion boundaries so this lane does not absorb their responsibilities
- active code is the source of truth if repo docs differ

## Acceptance Criteria

- `AppBootstrap` still resolves `Home` for saved `user_profile` data and `CompleteProfile` otherwise
- `RootNavigation` still mounts `BottomTabNavigation` under `Home`
- `RootNavigation` still keeps `Tutorials` as a root-owned route
- `BottomTabNavigation` still mounts `SettingsNavigation` under the `Settings` tab
- `SettingsNavigation` still uses `initialRouteName="Settings"`
- `SettingsNavigation` remains limited to the existing settings/account/legal/export route registrations needed for the current nested flow, stack-level options, and existing nested-flow entry points, with no new non-settings detail-route registrations introduced in this lane
- the current settings stack route set remains:
  - `Settings`
  - `MyProfile`
  - `MyVitals`
  - `MyAccount`
  - `MyEmail`
  - `MyPassword`
  - `DeleteAccount`
  - `ExportToCSV`
  - `TermsOfUse`
  - `PrivacyPolicy`
  - `Abbrevations`
- the current settings nested flow still works for representative navigation into:
  - `Settings`
  - `MyProfile`
  - `MyVitals`
  - `MyAccount`
  - `MyEmail`
  - `MyPassword`
  - `DeleteAccount`
  - `ExportToCSV`
  - `TermsOfUse`
  - `PrivacyPolicy`
  - `Abbrevations`
- the current root-owned `Tutorials` exception is preserved and this lane does not turn into root cleanup, tab-shell cleanup, naming cleanup, or settings UX redesign
- navigation into and back out of representative settings-stack routes still works
- no startup behavior changes occur
- no route renames, copy changes, privacy changes, or dependency changes are introduced unless strictly required for safe stack wiring

## Validation

- static review that the startup-path statements in this artifact match live code in `AppBootstrap`, `RootContainer`, and `RootNavigation`
- static review that `RootNavigation` still mounts `BottomTabNavigation` under `Home`
- static review that `RootNavigation` still owns `Tutorials`
- static review that `BottomTabNavigation` still mounts `SettingsNavigation` under `Settings`
- static review that `SettingsNavigation` remains the owner of the current settings/account/legal/export stack routes
- static review that the route list in this artifact matches the settings exports and current settings-stack registrations
- static review that this artifact reflects live settings ownership rather than the older root-level settings map in `docs/architecture/navigation-tree-and-route-ownership.md`
- static review that the current settings landing behavior is described truthfully as a mix of in-stack routes and external links
- static review that the final diff adds only `docs/architecture/settings-account-stack-extraction.md`
- manual smoke coverage for returning-user path to `Home`
- manual smoke coverage for tab-shell render
- manual smoke coverage for entering `Settings`
- manual smoke coverage for representative navigation from `Settings` into `MyProfile`, `ExportToCSV`, and `Abbrevations`
- manual smoke coverage for representative navigation from `MyProfile` into `MyVitals` and `MyAccount`
- manual smoke coverage for representative navigation from `MyAccount` into `MyEmail`, `MyPassword`, and `DeleteAccount`
- manual smoke coverage for representative access to `TermsOfUse` and `PrivacyPolicy`
- manual smoke coverage for representative back navigation from nested settings-stack screens

## Risks / Notes

- main risk is accidental boundary drift, where settings extraction starts reopening root-stack, tab-shell, or cross-domain decisions that belong to other lanes
- another risk is conflating route naming cleanup with extraction work
- another risk is conflating route ownership with current entry-path behavior on the settings landing
- current code-backed names such as `Abbrevations`, `MyProfile`, and `ExportToCSV` should be recorded and tolerated here unless a minimal wiring fix is strictly required
- the current settings landing uses a mix of in-stack routes and external links; this lane records that present-state ownership and entry-path split without treating it as a redesign target
- this should remain a minimal-diff settings/account stack extraction, not a broader settings redesign
- preserve local-first truthfulness and the current `Home` startup contract

## Follow-on Lane Seeds

- settings route naming/constants cleanup
- dead-route audit
- settings/account flow smoke tests
- delete/reset/export semantics review
- tutorials ownership clarification
- settings-domain UX clarification lane

## Assumptions

- the requested artifact should follow the same reviewable cadence as the approved `1.1.2.2.1` through `1.1.2.2.7` lane docs while still treating `Brunch Body Project Template.md` and `Brunch Body Project Scope.md` as the governing inputs
- active code is authoritative over repo prose for startup facts, navigator ownership, route registrations, route names, and the current `Tutorials` ownership exception
- this lane is about extraction and boundary clarity, not feature redesign
- if a cleaner settings boundary would require deciding that `Tutorials` or another route belongs to another domain navigator, that decision should be deferred rather than absorbed here

## Constraints

- docs-only
- create exactly one new file: `docs/architecture/settings-account-stack-extraction.md`
- no production code changes
- no config changes
- no tests changed
- no dependency or package changes
- no route renames
- no behavior changes
- keep the lane present-state aware and cleanup-bounded
- use active code as the source of truth if repo docs differ

## Acceptance

- exactly one new docs file is added at `docs/architecture/settings-account-stack-extraction.md`
- the artifact is in Brunch Body Project Template style
- the artifact defines a bounded, Codex-ready settings/account stack extraction lane
- the artifact preserves current bootstrap and shell semantics in its contract
- the artifact clearly distinguishes in-scope settings/account stack extraction from out-of-scope root-stack work, tab-shell work, naming cleanup, and broader settings redesign
- the artifact provides binary, reviewable acceptance criteria
- the artifact does not implement cleanup or propose unrelated product changes

## Do not

- implement the refactor
- change `SettingsNavigation.js`
- change `BottomTabNavigation.js`
- change `RootNavigation.js`
- change `AppBootstrap.js`
- change `RootContainer.js`
- rename routes
- redesign tabs
- widen into settings feature redesign or cross-domain extraction
- mix this lane with root cleanup, tab-shell cleanup, naming cleanup, privacy work, or UX redesign

## Review standard

- keep scope narrow
- do not expand beyond stated files or surfaces
- do not introduce backend or cloud behavior unless explicitly requested
- do not change disclosures, privacy claims, or deletion semantics unless this lane explicitly includes them
- prefer minimal diffs
- add tests only for touched logic or required acceptance
- if the task is broader than stated, stop and leave a note rather than widening scope
