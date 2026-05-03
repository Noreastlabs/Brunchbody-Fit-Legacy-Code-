# Domain Form Contract Baseline

## Summary

This artifact converts `docs/architecture/domain-form-inventory-and-ownership-map.md` into a current-state contract baseline for Brunch Body form and input behavior.

It records current contracts by domain: field names or grouped field families, expected value shapes, required/optional status, validation owner, submit/save owner, persistence/action owner, caller-owned primitive boundaries, and test coverage references.

This artifact is docs-only. It does not standardize forms, refactor components, change validation, change storage, add tests, update copy, change routes, change export/import behavior, change disclosure/privacy posture, change measurement conversion, or alter runtime behavior.

## Scope Boundary

In scope:

- Define current contracts for reachable submitted forms and grouped form families already inventoried.
- Separate profile/onboarding forms, settings forms, journal and writing forms, nutrition forms, calendar forms, recreation/exercise forms, shared primitives and modal contents, search/filter inputs, dormant residue, and test-only references.
- Use the completed inventory as the primary discovery baseline.
- Use active source as the tie-breaker when any existing doc conflicts with code.
- Mark unsupported or unverified facts as `unknown/not verified`.
- Seed follow-on implementation lanes without doing them.

Out of scope:

- Production source changes.
- Test changes.
- Validation behavior changes.
- Form UX redesign.
- Shared component refactors.
- Route/navigation changes.
- Storage key changes.
- Schema changes.
- Export/import changes.
- Privacy, disclosure, public-doc, or legal-policy changes.
- Accessibility remediation.
- Measurement conversion, canonical persistence, export, or display changes.
- Backend, cloud, sync, account, login, password, or delete-account UX changes.
- Cleanup/removal of dormant residue.

## Source-of-Truth Rule

Active source remains the source of truth. `docs/architecture/domain-form-inventory-and-ownership-map.md` is the baseline for this artifact's classification and ownership discipline. Context-only architecture docs provide guardrails but do not create runtime behavior.

If source and docs conflict, future lanes should follow source and update docs separately. If this artifact cannot prove validation, persistence, action ownership, reachability, or field shape from inventory or bounded source evidence, the contract says `unknown/not verified`.

## Contract Field Legend

| Field | Meaning |
| --- | --- |
| Domain | Product/domain area that owns the UX surface. |
| Surface/component | Route, page, component, modal, or grouped form family. |
| Source path | Evidence path for current behavior. |
| Classification | Inventory classification copied from the completed inventory. |
| Field/group | Field name, payload key, or grouped field family. |
| Label/copy | User-facing label, placeholder, or visible meaning where relevant and verified. |
| Current value shape | Current source/value shape, not desired future schema. |
| Required/optional | Current required/optional behavior where proven. |
| Validation owner/behavior | Current code owner and behavior for validation. |
| Submit/save owner | Current caller, screen, or action that initiates save/submit. |
| Persistence/action owner | Current storage/action owner proven by source or inventory. |
| Cancel/back/dismiss | Current cancel, back, modal close, or dismissal behavior. |
| Test coverage | Current test evidence or `unknown/not verified`. |
| Confidence | `verified`, `partially verified`, or `unknown/not verified`. |
| Follow-on lane | Recommended future lane without implementing it here. |

## Contract Classification Rules

1. Baseline current behavior only. This artifact does not define target or desired behavior as implemented fact.
2. No inferred ownership. Naming alone is not proof of validation, submit, action, or persistence ownership.
3. Reusable primitives are caller-owned unless source proves direct validation or persistence ownership.
4. Search/filter inputs are not submitted forms unless they persist or submit domain data.
5. Dormant account/auth/password files and route constants stay dormant/internal residue unless live navigation proves reachability.
6. Delete local data remains a settings control surface only. This artifact does not reinterpret, rename, weaken, or expand deletion semantics.
7. Height, weight, body unit preference, and Weight Log body fields remain inside approved body-measurement boundaries. This artifact does not change conversion, canonical persistence, export semantics, or display behavior.

## Evidence Basis

Primary baseline:

- `docs/architecture/domain-form-inventory-and-ownership-map.md`

Required searches were run before creating this artifact:

```sh
rg -n "domain-form-inventory-and-ownership-map|Classification Legend|Ownership Map|Test Coverage Map|Follow-on Lane Seeds" docs/architecture/domain-form-inventory-and-ownership-map.md
rg -n "CompleteProfile|MyVitals|WeightLog|DailyEntry|WeeklyEntry|QuarterlyEntry|SupplementLog|Calories|CreateTheme|AddWorkoutModal|EditProgram|MyExercises|MealDetail|MealDirectory" src __tests__ docs/architecture
rg -n "TextInput|SearchBar|CreateItemContent|CustomTextArea|DateInput|HeightInput|Wheel|Picker|Select|Color" src/components src/screens __tests__
rg -n "profile\\(|dispatch\\(|AsyncStorage|setItem|storage\\.set|redux-persist|persistReducer|user_profile|bodyUnitPreference|weightKilograms|heightCentimeters" src __tests__ docs/architecture
```

Context-only guardrails:

- `docs/architecture/Brunch Body Project Scope.md`
- `docs/architecture/body-measurement-preference-and-defaults-scope.md`
- `docs/architecture/body-measurement-export-unit-semantics.md`
- `docs/architecture/in-app-transparency-surfaces.md`
- `docs/architecture/accessibility-baseline.md`
- `docs/architecture/shared-component-audit.md`

## Profile and Onboarding Contracts

| Domain | Surface/component | Source path | Classification | Field/group | Label/copy | Current value shape | Required/optional | Validation owner/behavior | Submit/save owner | Persistence/action owner | Cancel/back/dismiss | Test coverage | Confidence | Follow-on lane |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Profile/onboarding | Complete profile flow | `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js` | `reachable_profile_or_onboarding_form` | Nickname/name | Nickname/name onboarding copy | String draft and final profile field | Required before final profile save | `CompleteProfilePage`; required/trim validation and loader guard | `CompleteProfilePage` dispatches `profile({...})` | Redux `auth` action `profile`; direct `user_profile`; onboarding draft key `name` | Step back/next controls; no route-level cancel verified | `__tests__/completeProfileFlowBoundary.test.js`; `__tests__/completeProfileNicknameBoundary.test.js`; `__tests__/completeProfileOnboardingTransparencyCopy.test.js`; `__tests__/AppBootstrap.test.js` | verified | Profile/onboarding form baseline |
| Profile/onboarding | Complete profile flow | Same as above | `reachable_profile_or_onboarding_form` | DOB | Date of birth/local calculation helper text | Date/month/year derived value | Required; adult validation | `CompleteProfilePage`; required and adult checks | Same as above | Same as above; onboarding draft key `dob` cleared after completed profile | Date picker cancel/dismiss is caller-owned; step back returns previous step | Same as above | verified | Profile/onboarding form baseline |
| Profile/onboarding | Complete profile flow | Same as above; `src/screens/completeProfile/components/Height.js` | `reachable_profile_or_onboarding_form` | `bodyUnitPreference` | Body measurement units | `standard` or `metric` | Required current profile control | `CompleteProfilePage`; unsupported fallback behavior is governed by body-measurement utilities, not redefined here | Same as above | Same as above; onboarding draft key `bodyUnitPreference`; profile field `bodyUnitPreference` | Unit selector state is caller-owned | Same as above plus measurement boundary tests where present | verified | Body measurement preference implementation lanes only if approved |
| Profile/onboarding | Complete profile flow | Same as above | `reachable_profile_or_onboarding_form` | Height | Height body measurement input | Standard: feet/inches picker and legacy dot-separated profile height; metric: centimeters text; canonical `heightCentimeters` where built | Required | `CompleteProfilePage`; standard height requires picker confirmation; metric height must parse as valid positive numeric height | Same as above | Same as above; onboarding draft key `height`; profile fields include legacy `height` and canonical `heightCentimeters` when built | Height picker/modal cancel/dismiss is caller-owned | Same as above | verified | Profile/body measurement contract lane |
| Profile/onboarding | Complete profile flow | Same as above; `src/screens/completeProfile/components/Weight.js` | `reachable_profile_or_onboarding_form` | Weight | Weight body measurement input | Standard: pounds text; metric: kilograms text; final payload may include legacy `weight` and canonical `weightKilograms` | Required | `CompleteProfilePage`; required, parseable; standard whole-number current behavior; metric numeric | Same as above | Same as above; onboarding draft key `weight`; profile fields include legacy `weight` and canonical `weightKilograms` when built | Step controls and picker state are caller-owned | Same as above | verified | Profile/body measurement contract lane |
| Profile/onboarding | Complete profile flow | Same as above; `src/screens/completeProfile/components/Gender.js` | `reachable_profile_or_onboarding_form` | Gender | Gender/local BMI and BMR helper context | Radio/select value | Required | `CompleteProfilePage`; required selection | Same as above | Same as above; onboarding draft key `gender` | Step back/next controls | Same as above | verified | Profile/onboarding form baseline |
| Profile/onboarding | Complete profile flow | Same as above | `reachable_profile_or_onboarding_form` | Default target calories | Not directly user-entered in this flow | Default target calories array | Auto-created, not user-entered here | `CompleteProfilePage`; default creation only | Same as above | Profile `targetCalories` through `profile()` | Not user-dismissable as separate form | Same as above | partially verified | Profile/nutrition ownership lane |
| Profile/onboarding | Complete profile step components | `src/screens/completeProfile/components/*` | `reusable_input_component` | Step-local inputs and controls | Name, DOB, height, weight, gender step UI | Caller-provided props/state | Caller-owned | Components do not own persistence; validation remains in `CompleteProfilePage` | Caller-owned through `CompleteProfilePage` | Caller-owned | Step back/next callbacks supplied by caller | Covered indirectly by complete-profile tests | verified | Primitive ownership/naming lane |
| Profile/onboarding | Older complete-profile helper residue | `src/screens/completeProfile/components/ChooseInput.js`; `ChooseLabel.js`; `ChooseButton.js`; `HeightInputModal.js`; `src/screens/completeProfile/pages/completeProfile/InputModal.js` | `dormant_route_or_source_residue` | Older choose/input helpers | Older data-sharing/study/helper residue | Unknown/not verified for live UX | Unknown/not verified | Not treated as reachable validation | Unknown/not verified | Unknown/not verified | Unknown/not verified | Existing docs only; no live form coverage proven | verified as dormant | Residue cleanup lane |

## Settings Contracts

| Domain | Surface/component | Source path | Classification | Field/group | Label/copy | Current value shape | Required/optional | Validation owner/behavior | Submit/save owner | Persistence/action owner | Cancel/back/dismiss | Test coverage | Confidence | Follow-on lane |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Settings/profile | Profile details / vitals edit | `src/screens/setting/pages/MyProfile/MyVitals.js`; `src/screens/setting/components/My Profile/MyVitals.js` | `reachable_settings_form` | Nickname | Edit nickname and vitals | String | Required/not required split is not fully isolated from source in this lane; current form validates required vitals broadly | `MyVitalsPage`; inline form errors and duplicate submit lock | `MyVitalsPage` dispatches `profile(profileUpdatePayload)` then `loggedIn()` | Redux `auth` action `profile`; direct `user_profile`; persisted `auth` slice also exists | Back navigation returns previous screen | `__tests__/settingsFormUxBoundary.test.js`; `__tests__/profileVitalsTransparencyCopy.test.js`; navigation smoke coverage | partially verified | Settings profile form baseline |
| Settings/profile | Profile details / vitals edit | Same as above | `reachable_settings_form` | DOB | Date of birth | Date picker value | Required; adult validation | `MyVitalsPage`; required/adult inline validation | Same as above | Same as above | Date picker cancel discards pending picker edits; back navigation leaves screen | Same as above | verified | Settings profile form baseline |
| Settings/profile | Profile details / vitals edit | Same as above | `reachable_settings_form` | `bodyUnitPreference` | Body measurement units | `standard` or `metric` | Required control | `MyVitalsPage`; resolves preference locally and manages preference switch | Same as above | Same as above; profile field `bodyUnitPreference` | Selector state is caller-owned | Same as above | verified | Body measurement preference lanes only if approved |
| Settings/profile | Profile details / vitals edit | Same as above | `reachable_settings_form` | Height | Height | Standard: picker/legacy height value; metric: centimeters text; canonical `heightCentimeters` in payload | Required | `MyVitalsPage`; required, metric numeric/valid, standard picker flow | Same as above | Same as above; profile fields include `height` and `heightCentimeters` | Height picker cancel discards pending edits; modal dismiss local | Same as above | verified | Settings/body measurement contract lane |
| Settings/profile | Profile details / vitals edit | Same as above | `reachable_settings_form` | Gender | Gender/local BMI and BMR context | Radio/select value | Required by current profile validation | `MyVitalsPage`; current required vitals checks | Same as above | Same as above | Back navigation and local selector state | Same as above | verified | Settings profile form baseline |
| Settings/control | Delete local data confirmation/control | `src/screens/setting/pages/MyProfile/DeleteAccount.js`; `src/screens/setting/components/My Profile/DeleteAccount.js`; `src/redux/actions/auth.js` | `reachable_settings_form` | Confirmation state | User-facing Delete local data control | Boolean confirmation/toggle/check state and confirmation modal controls | Explicit confirmation required before action | `DeleteAccount` page/component; blocks destructive action until confirmed | `DeleteAccount` dispatches internal `deleteAccount()` | Internal auth action dispatches reset, clears AsyncStorage, clears MMKV, rehydrates bundled plans, returns to `CompleteProfile` after success confirmation | Back navigation and modal close/dismiss return without action | `__tests__/accountFlows.test.js`; deletion-semantics docs/tests | verified | Delete/reset boundary lane only |
| Settings/control | Export selector controls | `src/screens/setting/pages/Export To CSV/ExportToCSV.js` | `reachable_settings_form` | Journal type/date selectors | Export journal data | Entry type selector and date/date-range controls where present | Export validation not fully inventoried here | Export screen/page owns export action; details are out of this lane | Export implementation owner unknown/not verified here | Export owner unknown/not verified in this artifact; do not reinterpret export semantics | Back/dismiss through settings/navigation and modals | Existing export-related tests/docs; not exhaustively mapped here | partially verified | Export-specific contract lane |
| Settings/residue | Account/email/password source residue | `src/navigation/routeNames.js`; `src/screens/setting/pages/MyProfile/MyAccount.js`; `MyEmail.js`; `MyPassword.js`; matching component files | `dormant_route_or_source_residue` | Email/password/reset fields | Dormant account/auth source only | Email text, confirmation text, current/new/confirm password, reset modal input where source exists | Dormant validation exists in source but is not live UX | Dormant page/action wiring only | Internal auth helpers where source calls them; not reachable UX | Dormant local modal/back behavior where source exists | `__tests__/accountFlows.test.js` covers internal action behavior; not route reachability | verified as dormant | Account/auth residue cleanup lane |

## Journal and Writing Contracts

| Domain | Surface/component | Source path | Classification | Field/group | Label/copy | Current value shape | Required/optional | Validation owner/behavior | Submit/save owner | Persistence/action owner | Cancel/back/dismiss | Test coverage | Confidence | Follow-on lane |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Journal | Journal landing date/navigation controls | `src/screens/journal/pages/Journal/Journal.js` | `search_or_filter_input` | Date and entry route selectors | Journal date/navigation controls | Date picker state and entry route selection | Selector-only | Journal page owns date/navigation guards; not a submitted form | Fetch/read and navigation only | Redux `journal` read actions; no direct entry persistence from landing controls | Date picker/modal dismiss local | Navigation smoke coverage; downstream journal tests | verified | Journal selector audit if needed |
| Journal | Weight Log | `src/screens/journal/pages/WeightLog/WeightLog.js`; `src/screens/journal/components/WeightLog.js` | `reachable_domain_form` | Entry date/name | Date/name entry context | Date/string entry context | Future-date blocked | `WeightLogPage`; future-date and duplicate save guard | `WeightLogPage` dispatches `addJournalEntry` or `editJournalEntry` | Redux `journal` persisted slice | Back navigation; delete/clear confirmation where applicable | `__tests__/journalFormUxBoundary.test.js`; `__tests__/journalSliceBoundary.test.js`; measurement boundary tests | verified | Journal form baseline |
| Journal | Weight Log | Same as above | `reachable_domain_form` | Weight | Enter weight/body measurement | Text input; legacy stored `WeightLog.weight`; canonical/provenance fields may be built by page | Required | `WeightLogPage`; required, parse/measurement validation, duplicate save guard | Same as above; after successful journal save also dispatches profile update | Redux `journal`; profile update through `profile({weight, weightKilograms})` to `user_profile` | Back and confirmation modal behavior as above | Same as above | verified | Journal/profile weight ownership lane |
| Journal | Weight Log | Same as above | `reachable_domain_form` | Note | Note | Text | Optional/not strictly validated in inventory | `WeightLogPage` owns current text state | Same as above | Redux `journal` persisted slice | Back/clear/delete modal state | Same as above | partially verified | Journal form baseline |
| Journal | Daily Entry | `src/screens/journal/pages/DailyEntry/DailyEntry.js`; `src/screens/journal/components/DailyEntry.js` | `reachable_domain_form` | Entry date/name | Daily entry date/name | Date/string entry context | Future-date blocked | `DailyEntryPage`; future-date and duplicate guards | `DailyEntryPage` dispatches `addJournalEntry` or `editJournalEntry` | Redux `journal` persisted slice | Back navigation; confirmation modal state | `__tests__/journalFormUxBoundary.test.js`; `__tests__/journalTraitsStorageBoundary.test.js`; navigation smoke coverage | verified | Journal form baseline |
| Journal | Daily Entry | Same as above; `src/components/CustomModal/CreateTraitModal.js` | `reachable_domain_form` | Feeling, task, thought, selected traits, create-trait draft | Daily reflection and trait selection | Rating number, text fields, selected traits array, trait name string, color, favorite boolean | At least one trait required; trait create requires name; max selected/favorite constraints | `DailyEntryPage`; create/select/remove validation and duplicate guards | Same as above | Redux `journal` for entry; trait read storage through `getTraits()`; trait create persistence as standalone write is not fully proven here | Create-trait/select/color modals dismiss locally | Same as above | partially verified | Trait ownership lane |
| Journal | Weekly Entry | `src/screens/journal/pages/WeeklyEntry/WeeklyEntry.js`; `src/screens/journal/components/WeeklyEntry.js` | `reachable_domain_form` | Weekly reflection fields | Weekly reflection content | Date/name string, effectiveness rating, communication/focus/new-situation text fields, focus rating/actions | Future-date blocked; no stricter required text validation proven beyond screen guards | `WeeklyEntryPage`; duplicate save guard | Dispatches `addJournalEntry` or `editJournalEntry` | Redux `journal` persisted slice | Back navigation; clear/delete confirmation modal state | `__tests__/journalFormUxBoundary.test.js` | partially verified | Journal form baseline |
| Journal | Quarterly Entry | `src/screens/journal/pages/QuarterlyEntry/QuarterlyEntry.js`; `src/screens/journal/components/QuarterlyEntry.js` | `reachable_domain_form` | Quarterly reflection fields | Quarterly reflection content | Date/name string and long text reflection fields | Future-date blocked; no stricter required text validation proven beyond screen guards | `QuarterlyEntryPage`; duplicate save guard | Dispatches `addJournalEntry` or `editJournalEntry` | Redux `journal` persisted slice | Back navigation; clear/delete confirmation modal state | `__tests__/journalFormUxBoundary.test.js` | partially verified | Journal form baseline |
| Journal | Supplement Log | `src/screens/journal/pages/SupplementLog/SupplementLog.js`; `src/screens/journal/components/SupplementLog.js` | `reachable_domain_form` | Entry date/name/note | Supplement intake entry context | Date/name string, note text | Future-date blocked; note optional/not strictly verified | `SupplementLogPage`; future-date and duplicate save guards | Dispatches `addJournalEntry` or `editJournalEntry` | Redux `journal` persisted slice | Back navigation and confirmation modal state | Journal/nutrition coverage partial | partially verified | Journal/nutrition supplement lane |
| Journal | Supplement Log | Same as above | `reachable_domain_form` | Selected supplements and single supplement modal | Select stack/supplement; amount/unit | Selected supplements array; modal name string, amount string, unit picker value | At least one supplement required; single supplement requires name/amount/unit; no stricter numeric amount validation proven | `SupplementLogPage`; modal state and selection guards | Same as above; reads nutrition supplement items through action | Redux `journal`; nutrition read action for stack items; modal draft local | Select/create/detail/wheel modals dismiss locally | `__tests__/journalFormUxBoundary.test.js` adjacent; `__tests__/nutritionSupplementContract.test.js` adjacent | partially verified | Journal/nutrition supplement lane |
| Journal | Calories Entry | `src/screens/journal/pages/Calories/Calories.js`; `src/screens/journal/components/Calories.js` | `reachable_domain_form` | Entry date/name/note | Calories In / Out entry | Date/name string; note text | Future-date blocked; note optional/not strictly verified | `CaloriesPage`; future-date and duplicate save guards | Dispatches `addJournalEntry` or `editJournalEntry` | Redux `journal` persisted slice | Back navigation; confirmation modal state | Navigation smoke; journal/nutrition tests adjacent | partially verified | Calories entry ownership lane |
| Journal | Calories Entry | Same as above | `reachable_domain_form` | Target calories/macros, selected meals/workouts, single item modal, additional calories out | Calories In / Out; Add Calories; Additional Calories Out | Profile target calories/macros read state; selected meal/workout arrays; modal name/fat/protein/carbs strings; additional calories string | Single item/additional calorie fields require nonempty values; arithmetic conversions used; full numeric validation not centrally proven | `CaloriesPage`; modal state and calculations | Same as above; reads nutrition meals and recreation completed workouts | Redux `journal`; reads profile, nutrition, recreation state | Meal/item/calories-out modals dismiss locally | Same as above | partially verified | Calories cross-domain validation lane |
| Journal | Trait directory search | `src/screens/journal/pages/TraitDirectory/TraitDirectory.js`; `src/screens/journal/components/TraitDirectory.js`; `src/components/SearchBar/SearchBar.js` | `search_or_filter_input` | Search text | Trait search/filter | String | Not submitted | Caller/local filter state | No domain data submit; selection navigates/merges back to Daily Entry | Local component state; trait data from journal state/storage read path | Back/search clear | `__tests__/journalFormUxBoundary.test.js`; navigation smoke | verified | Search/filter lane |
| Calendar/writing | Writing itinerary editor | `src/screens/writing/pages/newDay/NewDay.js`; `src/screens/writing/pages/editWriting/EditWriting.js`; `src/screens/writing/components/EditEvent.js` | `reachable_domain_form` | Task, note, color, from/to time | Calendar itinerary task editor | Text fields, color value, time picker values | Task required; complete time state required; overlap confirmation can override conflicts; stale selection guarded | Writing pages mounted through Calendar wrappers | Dispatches `editTheme(theme.id, {itinerary: ...})`; delete also edits theme itinerary | Redux `calendar` persisted slice | Back navigation; modal close; time/color picker dismiss; overlap confirmation | `__tests__/writingFormUxBoundary.test.js` | verified | Calendar/writing ownership naming lane |

## Nutrition Contracts

| Domain | Surface/component | Source path | Classification | Field/group | Label/copy | Current value shape | Required/optional | Validation owner/behavior | Submit/save owner | Persistence/action owner | Cancel/back/dismiss | Test coverage | Confidence | Follow-on lane |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nutrition/profile | Target calories/macros | `src/screens/nutrition/pages/Nutrition/Nutrition.js`; `src/screens/nutrition/components/Nutrition.js`; `src/screens/nutrition/components/CalorieCalculation.js` | `reachable_domain_form` | Target calories | Target Calories | Text/string numeric context | Required | Nutrition page/component flow; target calories required | `onCreateTargetCalories` path dispatches `profile({targetCalories: [...]})` | Profile `user_profile` through Redux `auth` action `profile`; persisted `auth` slice also exists | Modal/section controls caller-owned; route back via navigation | `__tests__/nutritionFormUxBoundary.test.js`; profile storage tests indirectly | verified | Profile/nutrition ownership lane |
| Nutrition/profile | Target calories/macros | Same as above | `reachable_domain_form` | Fat/protein/carbohydrates | Macro percentages | Slider/number values | Must total 100 | Nutrition page/component flow; sum validation | Same as above | Same as above | Same as above | Same as above | verified | Nutrition macro validation lane |
| Nutrition | Meal/supplement stack creation | `src/screens/nutrition/pages/Nutrition/Nutrition.js`; `src/screens/nutrition/components/Nutrition.js`; `src/components/CustomModal/CreateItemContent.js` | `reachable_modal_form` | Title/name, color, stack type | Create meal or supplement stack | Name/title string, color value, selected stack type from screen state | Title required; duplicate submit/form error behavior where present | Nutrition page owns validation; `CreateItemContent` is caller-owned renderer | Dispatches `addMeal` or `addSupplement` | Redux `nutrition` persisted slice; storage helpers read legacy arrays for hydration | Modal close/dismiss resets caller state | `__tests__/nutritionFormUxBoundary.test.js`; `__tests__/nutritionStorageBoundary.test.js` | verified | Nutrition modal standardization lane |
| Nutrition | Meal item create/edit | `src/screens/nutrition/pages/Meal/Meal.js`; `src/screens/nutrition/components/Meal.js`; `src/components/CustomModal/CreateItemContent.js` | `reachable_domain_form` | Item name | Meal item name | String | Required | `Meal` page owns form error/duplicate guards | Dispatches `addMealItems`, `editMealItem`, or `deleteMealItem` | Redux `nutrition` persisted slice; storage helper reads `meals` | Modal close/dismiss and delete confirmation controlled by screen | `__tests__/nutritionFormUxBoundary.test.js`; `__tests__/nutritionStorageBoundary.test.js` | verified | Nutrition item validation lane |
| Nutrition | Meal item create/edit | Same as above | `reachable_domain_form` | Fat/protein/carbohydrates | Macro fields | String inputs parsed as finite decimal; calories computed | Required | `Meal` page owns finite decimal validation | Same as above | Same as above | Same as above | Same as above | verified | Nutrition item validation lane |
| Nutrition | Supplement item create/edit | `src/screens/nutrition/pages/Supplement/Supplement.js`; `src/screens/nutrition/components/Supplement.js`; `src/components/CustomModal/CreateItemContent.js` | `reachable_domain_form` | Item name | Supplement item name | String | Required | `Supplement` page owns form error/duplicate guards | Dispatches `addSupplementItems`, `editSupplementItem`, or `deleteSupplementItem` | Redux `nutrition` persisted slice; storage helper reads `supplements` | Modal close/dismiss and delete confirmation controlled by screen | `__tests__/nutritionFormUxBoundary.test.js`; `__tests__/nutritionSupplementContract.test.js` | verified | Supplement item validation lane |
| Nutrition | Supplement item create/edit | Same as above | `reachable_domain_form` | Amount and unit | Amount/unit picker | Amount string parsed finite decimal; unit picker value | Required | `Supplement` page owns amount/unit validation | Same as above | Same as above | Wheel picker/modal dismiss controlled by screen | Same as above | verified | Supplement item validation lane |
| Nutrition | Meal detail add-to-meal | `src/screens/nutrition/pages/MealDetail/MealDetail.js`; `src/screens/nutrition/components/MealDetail.js` | `reachable_domain_form` | Amount and unit | Meal-directory amount/unit | Amount text; unit picker value; calculated nutrition display | Amount required numeric; unit required; stale calculation must be recalculated before add | `MealDetailPage` owns calculation and stale state validation | Dispatches `addMealItems(targetMealId, calculatedData)` | Redux `nutrition` persisted slice | Back navigation; picker dismiss owned by screen | `__tests__/navigationSmokeFlows.test.js`; `__tests__/nutritionFormUxBoundary.test.js` adjacent | partially verified | Meal-directory handoff lane |
| Nutrition | Meal list and directory search | `src/screens/nutrition/components/MealsList.js`; `src/screens/nutrition/components/MealDirectory.js`; `src/components/SearchBar/SearchBar.js` | `search_or_filter_input` | Search text | Meal stack/directory search | String | Not submitted | Caller/local filter state | No domain data submit; selection navigates | Local component state; data from nutrition state/storage read path | Back/search clear | Navigation smoke and nutrition tests partial | verified | Search/filter lane |

## Calendar Contracts

| Domain | Surface/component | Source path | Classification | Field/group | Label/copy | Current value shape | Required/optional | Validation owner/behavior | Submit/save owner | Persistence/action owner | Cancel/back/dismiss | Test coverage | Confidence | Follow-on lane |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Calendar/todo | Calendar todo create/edit | `src/screens/calendar/pages/calendar/Calendar.js`; `src/screens/calendar/components/EditTodo.js` | `reachable_domain_form` | Task name | Todo task | String | Required | Calendar page/EditTodo flow; task required | Calendar page builds submission and dispatches calendar-facing todo action | Calendar UI; legacy `todo` slice/action/storage owner; persisted `todo` slice; storage helper reads `todos` | Todo modal dismiss; delete confirmation modal | `__tests__/calendarTodoFormUxBoundary.test.js`; `__tests__/calendarTodoSubmissionBoundary.test.js`; `__tests__/calendarTodoOwnershipBoundary.test.js`; `__tests__/todoStorageBoundary.test.js` | verified | Calendar/todo ownership naming lane |
| Calendar/todo | Calendar todo create/edit | Same as above | `reachable_domain_form` | Notes, day mode, picked date | Todo details | Notes string, day mode value, date picker values | Either Someday or confirmed picked day required | Calendar page/EditTodo flow; stale selected todo and duplicate submit/delete guards | Dispatches `addCalendarTodoTask`, `editCalendarTodoTask`, or `deleteCalendarTodoTask` | Same as above | Date picker dismiss and modal close local | Same as above | verified | Calendar/todo ownership naming lane |
| Calendar | Theme creation | `src/screens/calendar/pages/calendar/Calendar.js`; `src/screens/calendar/components/CreateTheme.js` | `reachable_modal_form` | Theme name | Create theme | String | Required; duplicate theme name checked | Calendar page owns duplicate/name validation; `CreateTheme` receives handlers | Dispatches `addTheme({name, itinerary: [], color, deletedThemes: []})` | Redux `calendar` persisted slice; storage helper reads `themes` for hydration | Create-theme modal close/dismiss | `__tests__/calendarThemeRepeatedThemeBoundary.test.js`; `__tests__/calendarThemeStorageBoundary.test.js` | verified | Calendar theme storage contract lane |
| Calendar | Theme creation | Same as above plus color picker component | `reachable_modal_form` | Color | Theme color | Color value | Required/not independently verified; current default/color picker state used | Caller-owned color picker state | Same as above | Same as above | Color picker/modal dismiss caller-owned | Same as above | partially verified | Calendar theme storage contract lane |
| Calendar | Add/remove repeated theme | `src/screens/calendar/pages/calendar/Calendar.js`; `src/components/CustomModal/AddRemoveTheme.js` | `reachable_modal_form` | Date/day/theme/frequency/duration | Assign, repeat, or clear theme days | Date picker/day selection, selected theme, frequency picker, duration/days text | Duration required when frequency is not Never; frequency required; duration input numeric-only in current handler | Calendar page/modal caller owns validation | Dispatches `addRepeatedTheme` or `editRepeatedTheme`; clear path edits repeated theme data | Redux `calendar` persisted slice | Modal close/dismiss; date picker dismiss | `__tests__/calendarThemeRepeatedThemeBoundary.test.js` | verified | Repeated theme form lane |
| Calendar | Calendar date/theme selectors | `src/screens/calendar/pages/calendar/Calendar.js`; `src/screens/calendar/pages/calendar/modals/index.js`; shared picker components | `search_or_filter_input` | Selector state | Date/theme/frequency selectors | Date, theme, wheel/select values | Selector-only unless used by submitting modal above | Caller-owned | Local state/navigation unless submitted by todo/theme/repeated-theme flow | Local component state unless submitted | Picker/modal dismiss local | `__tests__/calendarSelectorBoundary.test.js`; navigation tests partial | verified | Calendar selector audit |

## Recreation and Exercise Contracts

| Domain | Surface/component | Source path | Classification | Field/group | Label/copy | Current value shape | Required/optional | Validation owner/behavior | Submit/save owner | Persistence/action owner | Cancel/back/dismiss | Test coverage | Confidence | Follow-on lane |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Recreation | Routine/custom program creation | `src/screens/recreation/pages/Recreation/Recreation.js`; `src/screens/recreation/components/Recreation.js`; `src/components/CustomModal/CreateItemContent.js` | `reachable_modal_form` | Title/name | Create routine or custom program | String | Required | Recreation page owns title validation and duplicate submit guard | Dispatches `addRoutine` or `addCustomPlan` | Redux `recreation` persisted slice; storage helper reads `routines`; custom plans through recreation slice/root | Modal close/dismiss resets caller state | `__tests__/recreationFormUxBoundary.test.js`; `__tests__/recreationStorageBoundary.test.js`; `__tests__/recreationSliceBoundary.test.js` | verified | Recreation creation modal lane |
| Recreation | Routine/custom program creation | Same as above | `reachable_modal_form` | Week count | Select number of weeks for custom program | Picker value | Required for custom program | Recreation page owns picker/form validation | Dispatches `addCustomPlan` | Redux `recreation` persisted slice | Wheel/modal dismiss caller-owned | Same as above | verified | Recreation creation modal lane |
| Recreation | Add workout modal | `src/screens/recreation/pages/Recreation/Recreation.js`; `src/screens/recreation/components/Recreation.js`; `src/components/CustomModal/AddWorkoutModal.js` | `reachable_modal_form` | Program/week/day/sequence/date | Schedule workout from a plan | Program selection, week picker, day picker, sequence radio, date metadata | Week/day required; past date blocked; duplicate workout same day blocked | Recreation page owns validation; `AddWorkoutModal` is caller-owned content | Dispatches `addMyWorkout` | Redux `recreation` persisted slice; storage helper reads `workouts`; bundled plans read from MMKV `plans_brunch_body` | Modal close/dismiss; picker dismiss | `__tests__/recreationFormUxBoundary.test.js`; `__tests__/recreationStorageBoundary.test.js` | verified | Workout scheduling ownership lane |
| Recreation | Edit routine task create/edit | `src/screens/recreation/pages/EditRoutine/EditRoutine.js`; `src/screens/recreation/components/EditRoutine.js`; `src/components/CustomModal/CreateItemContent.js` | `reachable_domain_form` | Task/item name | Routine task name | String | Required | `EditRoutine` page owns form error and duplicate submit/delete guards | Dispatches `addRoutineTask`, `editRoutineTask`, or `deleteRoutineTask` | Redux `recreation` persisted slice | Modal close/dismiss; delete confirmation modal | `__tests__/recreationFormUxBoundary.test.js`; `__tests__/recreationSliceBoundary.test.js` | verified | Routine-task validation lane |
| Recreation/exercise | Exercise create/edit | `src/screens/recreation/pages/MyExercises/MyExercises.js`; `src/screens/recreation/components/MyExercises.js` | `reachable_domain_form` | Exercise type, name, equivalent exercise | Custom exercise form | Type selection, name string, equivalent exercise picker value | Name required; equivalent exercise required | `MyExercisesPage` owns validation and duplicate add/edit/delete guards | Dispatches `addExercise`, `editExercise`, or `deleteExercise`; delete also merges exercise directory through action path | Redux `exercise` persisted slice; storage helper reads `exercises` and `exercise_directory` | Modal close/dismiss; picker dismiss; delete confirmation modal | `__tests__/recreationFormUxBoundary.test.js`; `__tests__/exerciseStorageBoundary.test.js`; `__tests__/exerciseMergeDirectoryBoundary.test.js` | verified | Recreation/exercise boundary lane |
| Recreation | Edit program note/exercise/cardio/superset forms | `src/screens/recreation/pages/EditProgram/EditProgram.js`; `src/screens/recreation/components/EditProgram.js` | `reachable_domain_form` | Note | Workout day note | Text | No stricter validation proven | `EditProgramPage`; duplicate/pending guards where applicable | Dispatches `addWeekPlan` or `editWeekPlan`; delete also edits week plan | Redux `recreation` persisted slice; bundled plans read path through MMKV for Brunch Body references | Modal close/dismiss; delete confirmation modal | `__tests__/recreationFormUxBoundary.test.js`; recreation slice/storage tests adjacent | partially verified | Edit-program decomposition lane |
| Recreation | Edit program note/exercise/cardio/superset forms | Same as above; `src/components/CustomModal/AddSingleExercise.js`; `AddCardioExercise.js`; `SupersetModal.js`; `AddExerciseModal.js`; `src/components/SupersetExeComp/SupersetExeComp.js` | `reachable_domain_form` | Exercise/cardio/superset entry fields | Add exercise/cardio/superset entries | Exercise picker, set count picker, amount text, unit picker, cardio/sport picker, superset count/set pickers, per-row amount/unit values | Exercise/cardio/superset flows require selected exercise/count/amount/unit as applicable; amount must parse finite decimal; unit compatibility/calorie calculation guarded | `EditProgramPage` owns validation; modal children are caller-owned | Dispatches `addWeekPlan` or `editWeekPlan` | Redux `recreation` persisted slice; body-weight calculations stay within current measurement behavior | Modal close/dismiss; picker dismiss; pending lock guards | Same as above | verified | Edit-program decomposition lane |
| Recreation | Recreation manager list/search controls | `src/screens/recreation/pages/*`; `src/screens/recreation/components/*` | `search_or_filter_input` | List/selector state | Routine/program/workout selection | Selection/list values; search input not verified everywhere | Selector-only unless routed into forms above | Caller-owned navigation/list selection | Navigation or local state update | Redux recreation/exercise read state | Back navigation | Navigation smoke/recreation tests partial | partially verified | Recreation selector audit |

## Shared Primitive and Modal Caller-Owned Contracts

| Component | Source path | Caller-owned props/state | Owns validation? | Owns persistence? | Known callers | Contract boundary statement |
| --- | --- | --- | --- | --- | --- | --- |
| Shared `Input` / `TextInput` primitive | `src/components/TextInput/TextInput.js`; `src/components/TextInput/index.js`; `src/components/primitives/index.js` | Label/title, text value, text input props supplied by callers | No proven validation ownership | No | Shared primitive consumers; complete-profile has a separate local `Input` | Generic labeled input only. Validation and persistence are caller-owned. |
| Complete-profile step components | `src/screens/completeProfile/components/*` | Step values, callbacks, picker state, unit preference, next/back handlers | No direct persistence; validation owned by `CompleteProfilePage` | No | `CompleteProfilePage` | Domain-local onboarding kit, not a shared app form contract. |
| `CreateItemContent` | `src/components/CustomModal/CreateItemContent.js` | `createItemFields`, selected picker item, color, text values, submit/dismiss handlers | No; renders caller-supplied error text and delegates updates | No | Nutrition, recreation, journal flows | Rendering primitive for caller-specified modal fields. Do not treat as one central form. |
| `CustomTextArea` | `src/components/CustomTextArea/CustomTextArea.js` | Value, `onChangeText`, rating props where configured | No | No | Journal reflection forms | Text/rating UI primitive; caller owns validation and submit. |
| `SearchBar` | `src/components/SearchBar/SearchBar.js` | Search text, set/clear callbacks | No | No | Trait directory, meal directory/list screens | Search/filter primitive; not a submitted domain form. |
| Picker/modal primitives | `src/components/CustomModal/DatePickerModal.js`; `HeightPickerModal.js`; `TimePickerModal.js`; `WheelPickerContent.js`; `SelectModalContent.js`; `ColorPickerContent.js`; related domain picker components | Current value, selected value, confirm/cancel handlers, modal visibility | No, except local picker selection state before caller confirm | No | Profile, settings, journal, nutrition, calendar, recreation, writing | Picker values are caller-owned once confirmed. Persistence belongs to caller submit path. |
| `PermissionModal` | `src/components/PermissionModal/PermissionModal.js` | Status text, optional input state, button callbacks, close/dismiss handlers | No | No | Multiple domains; dormant reset input source where present | Confirmation/status shell. Optional input does not make it a domain form without a caller submit path. |
| Workout modal contents | `src/components/CustomModal/AddWorkoutModal.js`; `AddSingleExercise.js`; `AddCardioExercise.js`; `SupersetModal.js`; `AddExerciseModal.js`; `src/components/SupersetExeComp/SupersetExeComp.js` | Selected plan/exercise values, picker items/type, amount/unit fields, error text, pending flags, submit/dismiss handlers | No; caller supplies validation/error/pending behavior | No | Recreation and `EditProgram` | Caller-owned modal content. Current save paths are recreation screen/page actions, not modal-local persistence. |

## Search and Filter Input Contracts

| Search/filter owner | Source path | Persisted or local-only | Submits domain data? | Contract boundary statement |
| --- | --- | --- | --- | --- |
| Trait directory | `src/screens/journal/pages/TraitDirectory/TraitDirectory.js`; `src/screens/journal/components/TraitDirectory.js`; `src/components/SearchBar/SearchBar.js` | Local component state; trait data read from journal state/storage path | No | Filters traits before selection/navigation. The search string is not a Daily Entry payload field. |
| Meal directory | `src/screens/nutrition/components/MealDirectory.js`; `src/components/SearchBar/SearchBar.js` | Local component state; directory data from nutrition state/storage path | No | Filters directory entries before navigation to `MealDetail`. |
| Meals list | `src/screens/nutrition/components/MealsList.js`; `src/components/SearchBar/SearchBar.js` | Local component state; meal stack data from nutrition state/storage path | No | Filters saved meal stacks. Selection/navigation is separate from search text. |
| Calendar selectors | `src/screens/calendar/pages/calendar/Calendar.js`; calendar modal/picker components | Local/caller state unless submitted through todo/theme forms | No as standalone selectors | Date/theme/frequency selectors can feed a submitted calendar modal, but selector state alone is not a domain submission. |
| Recreation selectors | `src/screens/recreation/pages/*`; `src/screens/recreation/components/*` | Local/caller state unless submitted through recreation forms | No as standalone selectors | Routine/program/workout selectors navigate or feed later forms; list selection alone is not persistence. |
| Journal landing date selector | `src/screens/journal/pages/Journal/Journal.js` | Local/caller state plus journal read actions | No | Date selection drives read/navigation behavior, not direct entry persistence. |

## Dormant / Residue / Test-Only Contract Boundaries

| Reference | Classification | Why it is not reachable UX | Cleanup recommendation |
| --- | --- | --- | --- |
| Settings account/auth/password files and route constants | `dormant_route_or_source_residue` | `MyAccount`, `MyEmail`, and `MyPassword` source and route constants exist, but live Settings navigation does not mount them as current UX. | Future account/auth residue cleanup lane only. |
| Internal `DeleteAccount` naming | Reachable settings control surface with residue-sensitive internal naming | User-facing behavior is Delete local data; internal route/action/file names remain evidence, not a broadened account model. | Future naming/residue lane only; do not reopen deletion semantics here. |
| Older complete-profile study/data-sharing helpers | `dormant_route_or_source_residue` | Older helper strings/components are not part of the observed live `CompleteProfile` branch. | Future onboarding residue cleanup lane only. |
| Jest mocks and boundary references | `test_only_reference` | Test mocks and assertions are evidence for behavior, not production UX. | Keep as evidence only. |
| Existing architecture docs | `docs_only_or_future_work_reference` | Docs can lag source and do not create runtime behavior. | Use as context only unless a future docs reconciliation lane is approved. |

## Cross-Domain Ownership Notes

- Profile storage is split between direct `user_profile` ownership through profile storage/action helpers and the persisted `auth` slice. This artifact records the overlap; it does not resolve it.
- CompleteProfile, MyVitals, WeightLog, and Nutrition target calories all write profile-adjacent data through `profile()`.
- WeightLog is a journal form that also updates Profile weight after a successful journal save.
- Calories reads profile target calories, nutrition meals, and recreation completed workouts before saving a journal entry.
- Calendar todo UX is calendar-owned, while persistence/action ownership remains in the legacy `todo` slice/key path.
- Writing source lives under `src/screens/writing` but is mounted through Calendar navigation and persists by editing calendar themes.
- Recreation includes recreation-owned flows and exercise-owned flows; `MyExercises` is reachable through Recreation but persists through the `exercise` slice.
- Shared modal and picker components are rendering/control primitives. Their validation and persistence belong to the caller unless explicitly proven otherwise.
- Search/filter inputs may feed navigation or selection but do not submit domain data themselves.

## Test Coverage References

| Area | Current coverage evidence | Coverage status |
| --- | --- | --- |
| CompleteProfile onboarding/profile creation | `__tests__/completeProfileFlowBoundary.test.js`; `__tests__/completeProfileNicknameBoundary.test.js`; `__tests__/completeProfileOnboardingTransparencyCopy.test.js`; `__tests__/AppBootstrap.test.js` | Direct form UX and bootstrap coverage |
| Settings profile details | `__tests__/settingsFormUxBoundary.test.js`; `__tests__/profileVitalsTransparencyCopy.test.js` | Direct form UX coverage |
| Local data deletion/internal auth behavior | `__tests__/accountFlows.test.js` | Direct internal action/surface coverage; terminology remains residue-sensitive |
| Journal entries | `__tests__/journalFormUxBoundary.test.js`; `__tests__/journalSliceBoundary.test.js`; `__tests__/journalTraitsStorageBoundary.test.js`; navigation smoke tests | Direct and slice/storage coverage, with entry-specific gaps marked partial where needed |
| Nutrition | `__tests__/nutritionFormUxBoundary.test.js`; `__tests__/nutritionStorageBoundary.test.js`; `__tests__/nutritionSupplementContract.test.js`; `__tests__/nutritionModalRepatriationBoundary.test.js`; navigation smoke tests | Direct form UX, storage, and modal boundary coverage |
| Calendar todo/theme | `__tests__/calendarTodoFormUxBoundary.test.js`; `__tests__/calendarTodoSubmissionBoundary.test.js`; `__tests__/calendarTodoOwnershipBoundary.test.js`; `__tests__/calendarThemeRepeatedThemeBoundary.test.js`; `__tests__/calendarThemeStorageBoundary.test.js`; `__tests__/calendarSelectorBoundary.test.js`; `__tests__/todoStorageBoundary.test.js` | Direct todo/theme/storage coverage |
| Recreation/exercise | `__tests__/recreationFormUxBoundary.test.js`; `__tests__/recreationStorageBoundary.test.js`; `__tests__/recreationSliceBoundary.test.js`; `__tests__/exerciseStorageBoundary.test.js`; `__tests__/exerciseMergeDirectoryBoundary.test.js` | Direct form UX plus storage/slice coverage |
| Writing itinerary editors | `__tests__/writingFormUxBoundary.test.js` | Direct form UX coverage |
| Shared primitives/modals/search | `__tests__/primitiveFamilySurfaceBoundary.test.js`; `__tests__/modalShellSurfaceBoundary.test.js`; `__tests__/journalCalendarModalRepatriationBoundary.test.js`; `__tests__/recreationModalRepatriationBoundary.test.js`; `__tests__/nutritionModalRepatriationBoundary.test.js`; `__tests__/navigationSmokeNavigators.test.js`; `__tests__/navigationSmokeFlows.test.js` | Primitive/modal boundary and smoke coverage |
| Dormant/docs-only references | `__tests__/*` mocks and architecture docs | Evidence-only; not live UX coverage |

## Risks and Ambiguities

- The main risk is treating this baseline as a desired future form standard. It is only current behavior.
- Shared primitives and modal contents are easy to overcount as domain forms. This artifact keeps them caller-owned unless source proves otherwise.
- Profile data has direct `user_profile` storage and persisted `auth` slice overlap.
- WeightLog/Profile, Nutrition/Profile, Calories cross-domain reads, Calendar/Todo, Calendar/Writing, and Recreation/Exercise remain ownership seams.
- Search/filter inputs appear near submitted forms but are not submitted domain fields.
- Dormant account/auth/password source residue is terminology-sensitive and must not be treated as reachable Phase 1 UX.
- Delete local data, export/import, privacy/disclosure, and body-measurement semantics remain governed by their existing lanes and are not reopened here.
- Some field required/optional status remains grouped or partial because source evidence does not isolate every text field into a strict validation contract.

## Follow-on Lane Seeds

- Profile/onboarding form baseline: refine current profile field validation and local profile storage ownership.
- Settings profile form baseline: review `MyVitals` separately from dormant account/auth residue.
- Journal form baseline: split WeightLog/Profile cross-write, DailyEntry trait ownership, Calories cross-domain reads, and text-heavy reflection forms.
- Nutrition form baseline: separate target-calorie Profile writes, meal item validation, supplement item validation, and meal-directory add-to-meal handoff.
- Calendar form baseline: separate todo ownership, theme creation, repeated-theme assignment, and writing itinerary editors.
- Recreation/exercise form baseline: split routine/program creation, workout scheduling, `MyExercises`, and `EditProgram` high-density modal flows.
- Shared primitive/modal ownership lane: define what stays caller-owned versus any future shared form contract.
- Search/filter lane: inventory and standardize search/filter affordances separately from submitted forms.
- Residue cleanup lane: classify or remove dormant complete-profile and settings account/auth source residue after dedicated approval.

## Non-Claims

This artifact does not claim that any form has been fixed, standardized, refactored, made accessible, privacy-reviewed, disclosure-reviewed, measurement-normalized, route-normalized, storage-normalized, export-normalized, import-ready, or test-expanded.

This artifact does not introduce backend sync, cloud accounts, account recovery, passwords, login, delete-account UX, reminders, notifications, AI behavior, medical advice, nutrition advice, export/import changes, public disclosure changes, or any new Phase 1 user-facing account model.

This artifact does not approve cleanup/removal of dormant source, storage key changes, schema changes, canonical measurement migrations, public docs changes, or behavior changes.

## Validation

Required validation for this docs-only lane:

```sh
git diff --check
git status --short --untracked-files=all
```

Expected lane-owned final status:

```text
?? docs/architecture/domain-form-contract-baseline.md
```

No Jest run is required because this artifact changes documentation only and does not change runtime behavior.
