# Body Measurement Summary Surface Audit

## Status And Scope

This is the docs-only audit artifact for `Lane 1.3.5.2.1 Body Measurement Summary Surface Audit`.

This lane defines "analytics and summaries" as local body-measurement summaries only. It does not approve product analytics, usage telemetry, backend analytics, cloud analytics, AI summaries, medical advice, trend coaching, goals/progress narratives, or broad dashboard work.

What changed: one internal architecture artifact only, `docs/architecture/body-measurement-summary-surface-audit.md`.

What users experience: no app behavior change.

This lane changes no app source, tests, reducers, storage behavior, calculation behavior, Weight Log behavior, Dashboard behavior, Journal Calories behavior, export output, public docs, privacy/disclosure files, routes, navigation, package files, lockfiles, CI, release notes, backend behavior, sync behavior, cloud behavior, AI behavior, telemetry behavior, or medical/training/nutrition advice posture.

## Evidence Method

Current source and tests are the primary evidence. Architecture docs and public docs are audit targets, but current live source wins where older docs are stale.

Required evidence searches run for this lane:

```sh
rg -n "BMI|BMR|bmi|bmr|Obese|Danger|height|weight|bodyUnitPreference|weightKilograms|heightCentimeters" src __tests__ docs README.md
rg -n "summary|summaries|analytics|calculation|advice|local-only|saved on this device" src docs README.md
rg -n "Weight Log|weight log|Journal Calories|calorie|dashboard|chart|MyVitals|MyProfile|CompleteProfile" src __tests__ docs README.md
```

Focused source and test inspection covered:

- `src/redux/reducer/auth.js`
- `src/utils/bodyMetrics.js`
- `src/utils/bodyMeasurementUnits.js`
- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
- `src/screens/completeProfile/components/Name.js`
- `src/screens/completeProfile/components/Height.js`
- `src/screens/completeProfile/components/Weight.js`
- `src/screens/setting/pages/MyProfile/MyProfile.js`
- `src/screens/setting/components/My Profile/MyProfile.js`
- `src/screens/setting/pages/MyProfile/MyVitals.js`
- `src/screens/setting/components/My Profile/MyVitals.js`
- `src/screens/journal/pages/Calories/Calories.js`
- `src/screens/journal/components/Calories.js`
- `src/screens/journal/pages/WeightLog/WeightLog.js`
- `src/screens/journal/components/WeightLog.js`
- `src/screens/dashboard/readModel.js`
- `src/screens/dashboard/components/Carousel.js`
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js`
- `src/screens/setting/components/Export To CSV/ExportToCSV.js`
- `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js`
- `src/screens/setting/components/HelpAndSupport/HelpAndSupport.js`
- `docs/public/brunch-body-user-guide.md`
- `docs/public/brunch-body-privacy-and-data.md`
- `docs/public/brunch-body-non-coder-onboarding.md`
- related boundary tests for profile summaries, transparency copy, dashboard weight display, export unit context, and onboarding copy

## Current Source Truth Notes

- BMI and BMR are derived runtime values. The current auth reducer strips incoming `bmi` and `bmr`, then derives local values from a valid canonical height/weight pair first, otherwise a valid legacy pair.
- Current local body summary surfaces are spread across Profile, Profile details, Complete Profile, Weight Log, Journal Calories, Dashboard weight charting, export-adjacent selected-journal behavior, in-app trust copy, public docs, and tests.
- Profile BMI category labels currently include `Underweight`, `Normal`, `Overweight`, `Obese`, and `Danger`. This audit treats those labels as current evidence and trust-copy risk, not approved future copy.
- Target totals, calorie totals, calories differential, nutrition macros, completed workouts, goals, trends, and progress language are not body-measurement summary values for this lane unless a direct BMI/BMR/height/weight dependency is being classified.
- Public/privacy docs are read-only audit targets in this lane. Any wording change belongs in a later docs/copy lane.

## Evidence Matrix

| Surface / path | Current wording or behavior observed | Classification | Risk level | Recommended follow-on lane type | Implementation allowed now |
| --- | --- | --- | --- | --- | --- |
| Auth reducer BMI/BMR derivation: `src/redux/reducer/auth.js:16-207` | Strips incoming `bmi`/`bmr`; derives BMI/BMR from complete positive canonical `heightCentimeters` plus `weightKilograms` first, otherwise valid legacy `height` plus `weight`; no durable trust in derived fields. | in-scope | Medium | Calculation-source closeout or stale-doc reconciliation only if docs disagree with live source. | No |
| Body metric helpers: `src/utils/bodyMetrics.js:42-127` | Provides BMI/BMR calculation helpers for imperial and metric inputs; BMR metric path converts kg/cm to the current imperial formula boundary. | in-scope | Low | Calculation helper documentation or parity test lane only if behavior changes later. | No |
| Body measurement unit helpers: `src/utils/bodyMeasurementUnits.js:62-263` | Resolves standard/metric body preference, parses/normalizes height and weight, formats height and weight with units, and prefers canonical weight/height where valid. | in-scope | Low | Shared utility contract lane only if future summary behavior needs a public helper contract. | No |
| Complete Profile body field capture: `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js:69-91`, `385-469` | Produces profile payload with `bodyUnitPreference`, legacy `height`/`weight`, canonical `heightCentimeters`, and canonical `weightKilograms`; also initializes default target calories. | in-scope | Medium | Onboarding/profile body-summary audit or target-total separation lane. | No |
| Complete Profile local-data notice: `src/screens/completeProfile/components/Name.js:20-28`; `src/resources/strings.js:36-44` | Name step shows that profile details are saved on this device and used for in-app calculations/display; gender helper says it is used for local BMI/BMR calculations. | in-scope | Low | Copy cleanup lane only if neutral wording needs tightening. | No |
| Complete Profile height/weight unit inputs: `src/screens/completeProfile/components/Height.js:80-114`; `src/screens/completeProfile/components/Weight.js:71-106` | Height and weight screens expose body unit preference and unit-specific helper copy; these are input/capture surfaces, not summary/analytics surfaces. | in-scope | Low | Existing-surface copy/UX lane only if input wording changes later. | No |
| My Vitals profile detail editor: `src/screens/setting/pages/MyProfile/MyVitals.js:106-119`, `372-400`; `src/screens/setting/components/My Profile/MyVitals.js:108-112`, `130-265` | Edits nickname, DOB, gender, height, and body unit preference; does not edit weight; visible copy says saved on this device only and used for in-app calculations/display. | in-scope | Low | Existing-surface copy/UX lane if neutral copy or unavailable states change. | No |
| My Profile current weight summary: `src/screens/setting/pages/MyProfile/MyProfile.js:24-42`, `116-120` | Displays current weight from valid canonical kg first, otherwise valid legacy weight, formatted by body preference; falls back to `Not set`. | in-scope | Low | Narrow profile summary behavior lane if standardizing missing states or units. | No |
| My Profile BMI summary and badges: `src/screens/setting/pages/MyProfile/MyProfile.js:44-62`, `89-135`; `src/screens/setting/components/My Profile/MyProfile.js:15-20`, `65-79` | Displays BMI value or `--`; current badge labels include `Underweight`, `Normal`, `Overweight`, `Obese`, and `Danger`, with badge colors. | in-scope | High | Profile BMI copy-risk cleanup lane with privacy/trust review. Current labels are evidence, not approved future copy. | No |
| My Profile BMR summary: `src/screens/setting/pages/MyProfile/MyProfile.js:86-88`, `137-141` | Displays BMR as `<value> CALORIES`; falls back to `Not set`. | in-scope | Medium | Profile summary copy lane if BMR needs neutral explanation or unavailable-state copy. | No |
| My Profile target totals: `src/screens/setting/pages/MyProfile/MyProfile.js:13-18`, `64-77`, `143-157` | Displays current target totals for FAT/PRT/CHO/CAL or `--`; target totals are profile/nutrition adjacent, not body-measurement summary values. | out-of-scope | Medium | Separate nutrition/target-total lane if product wants to clarify or remove from body-summary framing. | No |
| Profile summary fallback tests: `__tests__/settingsFormUxBoundary.test.js:374-504` | Tests MyProfile fallbacks for current weight, BMI, BMR, target totals, preference formatting, canonical-first weight, legacy fallback, and invalid missing states. | test-only | Low | Use as regression reference for any later profile summary lane. | No |
| Profile/vitals transparency tests: `__tests__/profileVitalsTransparencyCopy.test.js:29-50`, `118-153` | Asserts local in-app calculation/display copy and forbids account/cloud/medical-style copy in Profile and My Vitals. | test-only | Low | Copy cleanup lane should update these tests only if copy changes are approved. | No |
| Complete Profile transparency test: `__tests__/completeProfileOnboardingTransparencyCopy.test.js:17-84` | Asserts onboarding local-data notice and forbids cloud/account/medical/study/data-sharing claims on the Name step. | test-only | Low | Onboarding copy lane should preserve this boundary. | No |
| Weight Log entry surface: `src/screens/journal/pages/WeightLog/WeightLog.js:28-192`, `207-210`, `300-337`, `357-386`; `src/screens/journal/components/WeightLog.js:48-79` | Weight Log displays weight input as `kg` or `lbs` by body preference, stores legacy/source `weight` and canonical `weightKilograms`, and updates profile weight after successful journal save. | in-scope | Medium | Weight Log display/storage behavior lane if summary changes touch logged weights. | No |
| Journal Calories BMR dependency: `src/screens/journal/pages/Calories/Calories.js:141`, `487-512`; `src/screens/journal/components/Calories.js:190-274` | Initializes BMR from entry/user, saves `user.bmr`, and uses BMR plus exercise calories in total calories out and calories differential display. Calorie math and nutrition totals are broader than body summaries. | future-work | Medium | Journal Calories BMR dependency audit or calculation downstream lane. Do not change calorie math here. | No |
| Dashboard weight read model: `src/screens/dashboard/readModel.js:63-88`, `96-121`, `162-233` | Builds seven-point weight chart data from Weight Log entries, preferring canonical `WeightLog.weightKilograms` and falling back to legacy `WeightLog.weight` or `0`. | in-scope | Medium | Dashboard weight display lane if current chart summaries are standardized. No dashboard redesign. | No |
| Dashboard chart display: `src/screens/dashboard/components/Carousel.js:24-65`; `src/screens/dashboard/components/Weight.js:21-31` | Converts pound chart values to kg for metric preference and labels legend as `Weight (kg)` or `Weight (lbs)`; renders the chart only. | in-scope | Medium | Dashboard weight label/unit lane if needed; no new chart or progress narrative under this lane. | No |
| Dashboard weight display tests: `__tests__/dashboardWeightBoundary.test.js:65-109` | Tests standard/missing/unsupported preferences as pounds, metric preference as kg, and confirms Outlook/Calorie Differential chart data is not converted. | test-only | Low | Use as regression reference for later dashboard weight summary work. | No |
| Dashboard calorie differential chart: `src/screens/dashboard/readModel.js:93-94`; `src/screens/dashboard/components/Carousel.js:68-77` | Reads saved `CaloriesEntry.caloriesDifferential` into a chart labeled `Calorie Differential`; it is BMR-adjacent through Journal Calories, not a body-measurement summary value. | future-work | Medium | Separate calorie/nutrition/dashboard lane if product wants to audit non-body chart summaries. | No |
| Selected Weight Log export: `src/screens/setting/pages/Export To CSV/ExportToCSV.js:54-101`, `170-205`; `__tests__/exportToCsvBoundary.test.js:102-258` | Weight Log export adds source/display/canonical weight context fields and unit labels while preserving raw fields. Export remains a selected-journal output, not a summary implementation. | export-adjacent | Medium | Export semantics lane only if export behavior or wording changes. | No |
| Non-WeightLog export rows: `src/screens/setting/pages/Export To CSV/ExportToCSV.js:187-205`; `__tests__/exportToCsvBoundary.test.js:343-370` | Non-WeightLog selected rows are spread unchanged; tests assert body unit export logic is not added to CaloriesEntry rows. | export-adjacent | Low | Keep export-specific changes separate from body summary work. | No |
| Export UI trust copy: `src/screens/setting/components/Export To CSV/ExportToCSV.js:39-53` | Says selected journal entries export as `.xlsx`; exported files may contain personal fitness/journal/nutrition/profile-related info and are user-managed copies after export. | export-adjacent | Low | Export copy lane only if public or in-app export wording changes. | No |
| In-app Privacy & Data copy: `src/screens/setting/components/PrivacyAndData/PrivacyAndData.js:6-13` | Says current app is local-first, does not automatically sync to cloud, and profile/vitals values are stored locally for in-app calculations/display. | in-scope | Low | In-app trust copy lane if local summary wording changes. | No |
| In-app Help & Support copy: `src/screens/setting/components/HelpAndSupport/HelpAndSupport.js:6-29` | Says profile details are saved on this device and used for calculations/display; says the app does not automatically monitor behavior; directs health/training/nutrition decisions to qualified professionals. | in-scope | Low | Help/support copy lane if summary or analytics terms are introduced. | No |
| Public user guide: `docs/public/brunch-body-user-guide.md:15-40`, `64-76`, `96-141` | Mentions dashboard-style summaries such as weight, BMI, BMR, and target totals; says BMI/BMR/target totals appear calculated locally; includes no medical advice and no analytics/cloud/AI without updated disclosure language. | future-work | Medium | Public-doc copy alignment lane. Target totals should not be approved as body-measurement summaries from this audit alone. | No |
| Public privacy/data guide: `docs/public/brunch-body-privacy-and-data.md:19-30`, `42-57`, `86-90` | Lists profile/body info including BMI/BMR; says no claim that app sends data to server/cloud/AI/analytics; says no AI/coaching/off-device processing promise. | future-work | Low | Public privacy copy lane only after behavior/copy changes are approved. | No |
| Public non-coder guide: `docs/public/brunch-body-non-coder-onboarding.md:37-43`, `58-67`, `117-130` | Uses broad `dashboard-style summaries`, `summary-style information`, and `current progress views` language; also says app is not a medical product, clinical calculator, cloud account system, or AI assistant. | future-work | Medium | Public-doc copy alignment lane to keep "summary/progress" wording from implying broader analytics. | No |
| README local-first context: `README.md:3-14`, `86-118`, `174-181` | Describes charting, journaling, device-local profile/data management, local-only guardrails, and no backend/cloud sync in current behavior. | future-work | Low | README copy lane only if summary or analytics posture changes. | No |
| Older architecture docs with stale body-measurement statements: examples include `docs/architecture/unit-system-evidence-audit-and-model-contract.md:30-49` and `docs/architecture/body-measurement-calculation-parity-and-source-selection.md:19-79` | Some older docs describe Profile weight as hard-coded pounds or BMI/BMR as legacy-only current behavior. Live source now shows unit-aware Profile weight display and canonical-first BMI/BMR derivation. | future-work | Medium | Stale architecture doc reconciliation lane. Live source controls implementation planning. | No |

## Follow-on Lane Recommendations

Recommended next lanes should remain small and independent:

1. Profile BMI copy-risk cleanup: decide whether to remove, replace, or neutralize current BMI badge category labels such as `Obese` and `Danger`.
2. Profile summary behavior lane: standardize current weight, BMI, BMR, and unavailable-state display on existing Profile surfaces only.
3. Dashboard weight display lane: audit or standardize only the existing weight chart label/data behavior, with no new dashboard concept or progress narrative.
4. Journal Calories BMR dependency lane: classify BMR-dependent calorie output behavior without changing nutrition targets, calorie math, or goal language.
5. Public-doc copy alignment lane: reconcile public docs that mention `dashboard-style summaries`, target totals, progress views, analytics, AI, and medical-advice boundaries.
6. Stale architecture doc reconciliation lane: update older internal docs that no longer match live source for Profile weight display or BMI/BMR canonical source selection.

## Acceptance And Verification

Acceptance for this lane:

- Exactly one new artifact exists: `docs/architecture/body-measurement-summary-surface-audit.md`.
- The artifact records the required evidence searches.
- The artifact includes an evidence matrix with surface/path, observed wording or behavior, classification, risk level, recommended follow-on lane type, and implementation allowed now.
- Every matrix row has implementation allowed now set to `No`.
- Current risky copy is recorded as evidence only. This lane does not approve labels such as `Obese`, `Danger`, or similar category language as future copy.
- Public/privacy docs are audit targets only and are not edited.
- No source, test, public-doc, disclosure, route, storage, calculation, export, package, lockfile, or CI behavior is changed.

Verification commands for this docs-only lane:

```sh
git diff --check
git status --short --untracked-files=all
```

No app tests are required because this lane is docs-only.

## Non-Claims

This artifact does not claim or approve:

- product usage analytics or telemetry;
- analytics SDKs, tracking, ads, crash reporting, or off-device analysis;
- backend sync, cloud processing, account recovery, backup, import, restore, or cross-device behavior;
- AI-generated summaries, coaching, recommendations, goals, streaks, trends, or habit insights;
- medical, clinical, diagnostic, treatment, risk, metabolism-improvement, or precision claims;
- export schema or export-copy changes;
- dashboard redesign, new chart types, or app-wide progress analytics;
- nutrition target, calorie math, or macro-summary changes.
