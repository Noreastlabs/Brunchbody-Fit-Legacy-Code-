# Lane: 1.1.5.1 Shared Component Audit

This document audits the current shared UI/component surface of the Brunch Body mobile app as inspected on April 19, 2026. It is present-state, docs-only, and audit-only. It does not change runtime behavior, component contracts, developer-facing APIs, or any repo-tracked code outside this new artifact.

## 1. Purpose and lane boundary

This lane exists to map the current shared-component reality of the mobile app so later cleanup can be split into small, reviewable lanes instead of a broad "clean up the shared components" effort.

Boundary for this lane:

- Audit-only.
- Mobile-first, local-first, and scope-bounded.
- No component extraction, renaming, moves, standardization, redesign, style-system work, or behavior change.
- No navigation, Redux, storage, persistence, business-logic, or test changes.
- Recommendations in this document are advisory follow-on seeds only.

Public interfaces: none. This lane changes no runtime interface, user-facing behavior, or developer-facing component contract.

## 2. Method / evidence standard

Primary evidence for this audit is the live current branch, not prior prose. The main evidence surfaces inspected were:

- `src/components/` and `src/components/index.js`
- `src/components/CustomModal/`
- `src/screens/*/components/`
- `src/screens/*/pages/`
- local import relationships between screen domains, especially calendar and writing

Evidence labels used throughout this document:

- `repo-observed`: directly supported by current-branch file locations, imports, exports, or visible implementation shape
- `inferred`: supported by repeated structure or naming, but shared intent is not fully established by the current branch alone
- `unknown / needs follow-on`: the current branch shows ambiguity that this audit should not resolve by guesswork

Audit rules used here:

- Named example families were treated as verification targets, not guaranteed findings.
- If the current branch supported an example clearly, it is recorded at the proper evidence level.
- If support was partial or ambiguous, the claim was downgraded to `inferred` or `unknown / needs follow-on`, or omitted.
- Visual similarity alone is not enough to call something duplicated or merge-ready.
- Qualitative frequency language is preferred unless a hard count materially improves the finding.
- Older architecture docs may support wording, but they are not authoritative over current code.

## 3. Shared component inventory

| surface | current owner / location | observed reuse | classification | evidence label | notes |
| --- | --- | --- | --- | --- | --- |
| Shared component barrel | `src/components/index.js` | Imported across calendar, completeProfile, dashboard, journal, nutrition, recreation, setting, welcome, and writing surfaces | truly shared surface | `repo-observed` | The barrel is the clearest formal shared entrypoint in the repo. It is broad, but not every export appears equally reused. |
| Screen shell helpers | `src/components/CustomHeader`, `SafeAreaWrapper`, `CustomModal`, `PermissionModal` | Reused across multiple feature domains and both page-level and component-level hosts | truly shared surface | `repo-observed` | These components form the most visible shared shell layer in the current branch. |
| Shared interaction helpers | `src/components/Button`, `TextButton`, `AddButton`, `SearchBar`, `CustomOptions` | Reused across multiple domains, especially list, detail, and modal flows | truly shared surface | `repo-observed` | Reuse exists, but the call sites do not yet show one fully normalized interaction contract. |
| Shared-but-mixed modal subtree | `src/components/CustomModal/` | Exported through the root shared barrel and used in many flows | wrapper/helper that looks shared structurally | `repo-observed` | The subtree mixes generic modal shell pieces with domain-named content such as `AddWorkoutModal`, `CreateTraitModal`, `NutritionItems`, `AddRemoveTheme`, and `ItineraryDetail`. Shared location does not equal clean shared ownership. |
| Domain component barrels | `src/screens/setting/components/index.js`, `journal/components/index.js`, `nutrition/components/index.js`, `recreation/components/index.js`, `writing/components/index.js` | Page wrappers regularly import from same-domain component barrels | domain-owned reusable surface | `repo-observed` | These barrels create reuse within a feature area, but not necessarily across the app. |
| Complete-profile step primitives | `src/screens/completeProfile/components/` | Reused within one multi-step onboarding flow | domain-owned reusable surface | `repo-observed` | `Input`, `Label`, `NextButton`, `BackButton`, `ChooseInput`, `ChooseButton`, and related step pieces read as a local component kit for one domain. |
| Calendar-owned leaves reused by writing | `src/screens/calendar/components/ColorPicker`, `CloseIcon`, `ModalButton`, calendar styles | Imported by writing pages/components in addition to calendar usage | domain-owned reusable surface | `repo-observed` | This is real reuse, but ownership still reads as calendar-first rather than shared-first. |
| Dashboard tab shell | `src/components/CustomTopTabs` plus dashboard-local `Day`, `Week`, `Month`, `Year` | Shared tab primitive paired with dashboard-local views | wrapper/helper that looks shared structurally | `repo-observed` | The primitive is shared, while the read-model views remain dashboard-owned. |

Current inventory conclusion:

- `repo-observed`: the repo has a real shared surface in `src/components`.
- `repo-observed`: the repo also has several domain-local reusable surfaces that are shared within a feature but not yet formalized as app-wide primitives.
- `repo-observed`: some shared-looking folders already mix generic wrapper responsibilities with domain-specific content, which makes location alone an unreliable ownership signal.

## 4. Pseudo-shared and duplicated pattern inventory

| pattern | evidence | current owner | why it only acts shared | evidence label |
| --- | --- | --- | --- | --- |
| Same-name `pages/*` to `components/*` mirrors | Setting, journal, nutrition, recreation, and writing page files commonly import a same-name component from a local components barrel or leaf path | each feature domain | The structure repeats across domains, but many wrappers still serve routing or container roles and do not yet prove one reusable app-wide abstraction | `repo-observed` |
| Calendar to writing cross-domain imports | Writing imports calendar `ColorPicker` in more than one place and also imports calendar `CloseIcon`, `ModalButton`, and calendar styles | calendar components, reused by writing | The reuse is real, but it is still calendar-owned. Converting it directly into a shared package would hide unresolved ownership decisions | `repo-observed` |
| Searchable alphabetical directory screens | Journal `TraitDirectory` and nutrition `MealDirectory` both use `SearchBar`, alphabetical grouping, and plus-icon rows | journal and nutrition | The structure is similar, but filter criteria, navigation targets, and domain meaning differ | `inferred` |
| Detail-screen shell with header, scroll, heading, and local modal cluster | Repeated across setting, journal, nutrition, recreation, and parts of writing | multiple domains | The shell repeats, but wrapper choice, spacing, and modal composition vary enough that the current branch does not yet show one stable shared frame | `repo-observed` |
| Complete-profile step screens | Name, date-of-birth, height, weight, and related onboarding steps repeat logo, label, input, navigation buttons, and permission-modal composition | completeProfile | This is strong reuse, but it is domain-local rather than app-wide | `repo-observed` |
| Modal confirmation/alert composition | Many flows compose `CustomModal` with `PermissionModal` for confirm, error, success, or delete flows | shared shell components plus page-local state | The composition is repeated enough to look shareable, but local state and action handling still live at the screen/page layer | `repo-observed` |

Pattern inventory conclusion:

- `repo-observed`: repeated structure exists in several places without a matching formal shared API.
- `inferred`: some pairs look close enough to seed later cleanup, but current-branch evidence is not strong enough to call them intentionally unified today.

## 5. Observed drift categories

### Naming drift

- `repo-observed`: `src/components/CustomModal/index.js` exports `NutritionItems` from `NurtitionItems.js`. The exported symbol and backing filename do not match in spelling.
- `repo-observed`: `src/components/TextInput/TextInput.js` defines a shared component named `Input`, while `src/screens/completeProfile/components/Input.js` defines a different local `Input`. The current branch therefore has overlapping input names with different responsibilities.
- `repo-observed`: `TopTabs` and `CustomTopTabs` use adjacent names but different behaviors. `TopTabs` is a thin pressable child wrapper, while `CustomTopTabs` renders a horizontal labeled tab list.
- `repo-observed`: `Text` and `CustomText` also use adjacent names but different behaviors. `Text` is a pressable text surface, while `CustomText` is a one-line display container. The current branch supports "naming drift" wording here, not a merge-ready duplication claim.

### Styling drift

- `repo-observed`: similar detail screens alternate between `SafeAreaWrapper` and raw `SafeAreaView` usage. For example, nutrition `MealDirectory` uses `SafeAreaWrapper`, while journal `TraitDirectory`, setting `TermsOfUse`, and setting `PrivacyPolicy` use raw `SafeAreaView`.
- `repo-observed`: repeated detail-screen shells often use `CustomHeader` plus a scroll container and heading block, but the surrounding safe-area wrapper, spacing, and container composition vary by domain.
- `unknown / needs follow-on`: the current branch does not establish whether all of those wrapper differences are intentional visual choices or accumulated drift.

### Import-location drift

- `repo-observed`: most app-wide shared UI is imported through the root `src/components` barrel, but domain pages often import local leaves directly from sibling `components/` folders.
- `repo-observed`: the pattern is mixed even inside one domain. Calendar page hosts import several direct leaves from `src/screens/calendar/components/`, while many other features use a local components barrel.
- `repo-observed`: writing imports calendar-owned leaves directly instead of consuming a neutral shared surface.

### Obvious prop/API inconsistency

- `repo-observed`: `CustomOptions` accepts heterogeneous option shapes by reading `item.name || item.title` and `item.color || item.bgColor`. That means current call sites already depend on more than one option data contract.
- `repo-observed`: the shared `src/components/TextInput` surface is not a drop-in replacement for the complete-profile `Input`. The shared version expects `title` and `text`, while the complete-profile version centers on placeholder-driven input with `onChangeText`.
- `inferred`: any later extraction around option chips or input primitives will likely need contract narrowing first, because current callers already encode multiple data or prop shapes.

### Shared by repeated structure but not formalized

- `repo-observed`: the repo repeats a confirm/alert modal composition built from existing shared pieces without exposing that composition as a dedicated shared wrapper.
- `repo-observed`: the repo repeats a header-plus-scroll detail frame across multiple domains without a dedicated frame component.
- `inferred`: the repo has at least one searchable directory/list pattern that could become a later bounded lane, but current domain ownership still matters enough to keep the finding conservative.

## 6. Priority-ranked extraction candidates

This is a bounded candidate list for future seams, not a sequencing roadmap for repo-wide shared-component standardization.

| candidate seam | current evidence | current owner | readiness | primary risk | follow-on lane seed |
| --- | --- | --- | --- | --- | --- |
| Confirm/alert modal wrapper built from `CustomModal` plus `PermissionModal` | `repo-observed:` repeated composition appears across calendar, completeProfile, journal, nutrition, recreation, setting, and writing flows | shared shell pieces plus page-local state/action handlers | low-risk extraction candidate | absorbing every current variant could widen the wrapper props beyond one focused confirm/alert contract | `1.1.5.2.x` extract one shared confirm/alert modal wrapper |
| Complete-profile step frame and input shell | `repo-observed:` one domain repeatedly combines local `Input`, `Label`, logo/header elements, step navigation buttons, and permission-modal composition | completeProfile domain | low-risk extraction candidate | the extraction should stay inside completeProfile and avoid turning one onboarding flow into an app-wide form system | `1.1.5.2.x` extract one complete-profile-local step/frame primitive |
| Header plus scroll detail-screen frame | `repo-observed:` setting, journal, nutrition, recreation, and writing all repeat a similar frame with heading, back affordance, and local modal stack | multiple domains | medium-risk candidate needing interface definition | wrapper differences and back-navigation variants could widen the frame contract too quickly | `1.1.5.2.x` normalize one detail-screen frame in a bounded slice |
| Searchable directory/list shell | `inferred:` journal `TraitDirectory` and nutrition `MealDirectory` share search, alphabetical grouping, and plus-row structure | journal and nutrition | medium-risk candidate needing interface definition | item filtering, route targets, and domain vocabulary differ enough that a generic list shell could hide real behavior differences | `1.1.5.2.x` normalize one searchable directory/list row pattern |
| Mixed generic and domain-specific modal content under `src/components/CustomModal/` | `repo-observed:` the shared directory holds both generic modal primitives and domain-named content exports | shared directory with mixed domain ownership | not yet safe due mixed styling/logic/domain ownership | broad extraction or reshuffling here could mix domains, drag business logic into shared UI, and create false standardization | `1.1.5.2.x` clarify one modal-content ownership seam before extraction |

## 7. Do-not-merge-yet areas

- `repo-observed`: `src/components/CustomModal/` should not be treated as one clean shared component family yet. The current branch mixes generic modal shell pieces with clearly domain-specific content, so a broad merge would mix domains and inflate shared ownership.
- `repo-observed`: calendar and writing should not be normalized into a generic shared package just because writing imports calendar leaves. That coupling is real, but current ownership is still mixed and a fast merge would hide the boundary issue instead of resolving it.
- `repo-observed`: same-name page/component pairs are not safe merge targets by default. Many of the page hosts still own navigation, local state, Redux wiring, or side effects, so collapsing them too early would drag business logic into shared UI.
- `repo-observed`: option and input surfaces should not be standardized in one pass. Current data and prop shapes are already heterogeneous, so a broad extraction would widen contracts rather than narrow them.
- `repo-observed`: similarly named primitives such as `TopTabs` versus `CustomTopTabs` and `Text` versus `CustomText` should not be merged based on naming alone. The current branch supports a naming-drift finding, not evidence of one false split.

## 8. Follow-on lane seeds

- `1.1.5.2.x` Extract one focused confirm/alert modal wrapper around the existing `CustomModal` plus `PermissionModal` composition without absorbing unrelated modal content.
- `1.1.5.2.x` Extract one complete-profile-local step/frame primitive and keep it explicitly domain-bounded.
- `1.1.5.2.x` Normalize one repeated detail-screen frame in a single domain or tightly related pair of domains rather than across the whole app.
- `1.1.5.2.x` Clarify one ownership seam inside `src/components/CustomModal/` before any broader modal-content cleanup.
- `1.1.5.3.x` Run an accessibility baseline pass on high-touch shared surfaces flagged by this audit, especially `CustomHeader`, `CloseButton`, `PermissionModal`, and `SearchBar`.
- `1.1.5.4.x` Normalize one repeated raw `TextInput` flow cluster as a form UX lane rather than treating input cleanup as shared-component extraction.
