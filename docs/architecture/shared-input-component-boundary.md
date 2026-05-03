# Shared Input Component Boundary

## Summary

This artifact defines the current boundary between shared input-like components and domain-owned form behavior in Brunch Body.

The default rule is caller ownership. Shared input components may render fields, expose callbacks, hold local display or pending-picker state, and show caller-supplied helper/error text, but validation, submit/save behavior, persistence, Redux dispatch, storage writes, route behavior, and trust-sensitive copy remain owned by the caller/domain unless active source proves otherwise.

This is a docs-only boundary artifact. It does not refactor components, change form behavior, update tests, change accessibility behavior, alter validation, rename props, standardize UI, change storage, change navigation, reinterpret deletion/export/import/privacy behavior, or promote dormant account/auth/password residue to reachable UX.

## Scope Boundary

In scope:

- Classify current shared input-like components, modal contents, picker/select components, search/filter inputs, settings confirmation/control surfaces, and residue/test-only references.
- Record ownership boundaries for display state, validation, submit/save, persistence/action, route/navigation, and trust copy where source evidence supports it.
- Use `docs/architecture/domain-form-inventory-and-ownership-map.md`, `docs/architecture/domain-form-contract-baseline.md`, and active source as baseline evidence.
- Mark unknown ownership as `unknown/not verified`.
- Seed follow-on implementation lanes without approving any implementation work.

Out of scope:

- Production source changes, test changes, package/config/lockfile changes, public-doc/privacy/disclosure changes, route/navigation changes, storage changes, export/import changes, deletion/reset semantics changes, measurement conversion changes, accessibility remediation, UI redesign, shared design-system implementation, backend/cloud/sync/account/login/password behavior, or any runtime behavior change.

## Source-of-Truth Rule

Active source is authoritative. The completed inventory and contract baseline are used as starting references and terminology guardrails. When docs and active source conflict, this boundary follows active source.

Shared inputs are caller-owned by default:

- Caller-owned means the parent screen/domain owns validation, submit/save behavior, persistence, Redux actions, storage writes, route behavior, and trust-sensitive copy.
- Component-owned means the component itself directly owns one or more of those behaviors.
- Local component display state, such as a pending wheel-picker value before confirm, is not persistence ownership.
- Search/filter inputs are not submitted forms unless source proves they persist or submit domain data.
- Modal content components are not generic primitives merely because their source lives under `src/components`.
- Trust-sensitive settings controls are not generic form primitives.
- Dormant account/auth/password residue is not reachable UX without navigation evidence.

## Boundary Classification Legend

| Classification | Meaning |
| --- | --- |
| `pure_reusable_primitive` | Generic reusable display/control primitive with no proven domain validation, submit, persistence, dispatch, storage, or navigation ownership. |
| `caller_owned_input_wrapper` | Wrapper that renders input UI and delegates state/handlers to the caller. |
| `domain_specific_input_wrapper` | Reusable-looking component whose meaning and behavior are owned by one domain or flow. |
| `modal_content_component` | Modal body/content surface that may collect values but delegates submit/save and persistence to callers. |
| `picker_or_selector_component` | Picker/select/date/time/color/height control; may own temporary selection state but not domain persistence. |
| `search_or_filter_component` | Search/filter input used for list filtering or selection, not submitted domain data. |
| `settings_control_surface` | Settings-owned control or selector surface that is not a generic form primitive. |
| `trust_sensitive_confirmation_surface` | Confirmation surface involving deletion, export, privacy, or similar user-trust semantics. |
| `dormant_or_residue_component` | Source, route constant, or helper not proven reachable in current live navigation. |
| `test_only_reference` | Jest mock, assertion, or fixture evidence only. |
| `docs_only_or_future_work_reference` | Existing architecture note or future lane seed only. |
| `unknown_requires_followup` | Boundary could not be verified from bounded evidence. |

## Evidence Basis

Baseline dependencies:

- `docs/architecture/domain-form-inventory-and-ownership-map.md`
- `docs/architecture/domain-form-contract-baseline.md`

Required searches run before creating this artifact:

```sh
rg -n "TextInput|Input|SearchBar|CreateItemContent|CustomTextArea|PermissionModal" src/components src/screens __tests__ docs/architecture
rg -n "DateInput|HeightInput|Picker|Wheel|Select|Dropdown|Color|Time" src/components src/screens __tests__ docs/architecture
rg -n "AddWorkoutModal|AddCardioExercise|CreateTraitModal|AddRemoveTheme|Modal" src/components src/screens __tests__ docs/architecture
rg -n "onChangeText|onSubmit|handleSubmit|onSave|save|dispatch\\(|AsyncStorage|setItem|storage\\.set|navigate\\(" src/components src/screens __tests__
rg -n "domain-form-inventory-and-ownership-map|domain-form-contract-baseline" docs/architecture
```

Additional bounded source reads verified:

- Shared primitives and wrappers: `src/components/TextInput/TextInput.js`, `src/components/SearchBar/SearchBar.js`, `src/components/CustomTextArea/CustomTextArea.js`, `src/components/SelectComp/SelectComp.js`, `src/screens/completeProfile/components/Input.js`, `Name.js`, `Height.js`, `Weight.js`.
- Modal shell/content components: `src/components/CustomModal/CustomModal.js`, `ModalContent.js`, `CreateItemContent.js`, `SelectModalContent.js`, `WheelPickerContent.js`, `ColorPickerContent.js`, `PermissionModal.js`.
- Picker/date/height/time components: `src/components/CustomModal/DatePickerModal.js`, `HeightPickerModal.js`, `TimePickerModal.js`.
- Domain modal contents: `AddWorkoutModal.js`, `AddSingleExercise.js`, `AddCardioExercise.js`, `SupersetModal.js`, `AddExerciseModal.js`, `CreateTraitModal.js`, `AddRemoveTheme.js`, `ClearTheme.js`, `CalculationContent.js`, `ProgramDetailModal.js`, `NurtitionItems.js`, `ItineraryDetail.js`, `src/components/SupersetExeComp/SupersetExeComp.js`.
- Settings controls and reachability: `src/navigation/SettingsNavigation.js`, `src/navigation/routeNames.js`, settings Delete local data, Export to CSV, MyEmail, and MyPassword source files.
- Boundary tests: `__tests__/primitiveFamilySurfaceBoundary.test.js`, `__tests__/modalShellSurfaceBoundary.test.js`, `__tests__/journalCalendarModalRepatriationBoundary.test.js`, `__tests__/nutritionModalRepatriationBoundary.test.js`, `__tests__/recreationModalRepatriationBoundary.test.js`, plus relevant domain boundary tests referenced below.

Bounded ownership search result:

- `rg -n "dispatch\\(|AsyncStorage|setItem|storage\\.set|navigate\\(" src/components` returned no matches.
- Therefore no shared component under `src/components` was verified as directly owning Redux dispatch, AsyncStorage/MMKV writes, `storage.set`, `setItem`, or navigation. Domain screens/pages and Redux/storage helpers remain the verified owners for those behaviors.

## Shared Component Inventory

| Component/family | Source path | Classification | Known callers | Caller domains | Visible props/state shape | Display-state owner | Validation owner | Submit/save owner | Persistence/action owner | Route/navigation owner | Trust-copy owner | Safe for later reuse | Broad shared refactor risky | Test coverage reference | Confidence | Recommended follow-on lane |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Shared `Input` / `TextInput` primitive | `src/components/TextInput/TextInput.js`; `src/components/TextInput/index.js`; `src/components/primitives/index.js` | `pure_reusable_primitive` | Shared primitive imports through `src/components` | Cross-domain where imported | `title`, `text`, `textStyle`, `titleStyle`; renders a value-only text input | Caller supplies displayed value | Caller-owned; no validation in primitive | None in primitive | None in primitive | None in primitive | Caller-owned if label/copy is meaningful | Yes, as display primitive only | Medium, because name overlaps complete-profile local `Input` and primitive does not expose a full input contract | `__tests__/primitiveFamilySurfaceBoundary.test.js` | verified | Shared TextInput/Input primitive audit |
| Complete-profile local `Input` | `src/screens/completeProfile/components/Input.js` | `domain_specific_input_wrapper` | Complete-profile step components | Profile/onboarding | `text`, `placeholder`, `onChangeText`, `keyboardType`, `maxLength` | Caller/screen state | `CompleteProfilePage` | `CompleteProfilePage` | `profile()` action and onboarding draft/profile storage via caller | Complete-profile flow | Complete-profile strings/caller | No, keep onboarding-owned | High, because behavior belongs to onboarding profile flow | Complete-profile boundary tests | verified | Profile/onboarding form parity |
| Complete-profile step wrappers | `src/screens/completeProfile/components/Name.js`; `DateOfBirth.js`; `Height.js`; `Weight.js`; `Gender.js` | `domain_specific_input_wrapper` | `CompleteProfilePage` | Profile/onboarding | Step values, picker visibility, unit preference, next/back callbacks, helper/error text | Mixed: caller owns domain values; some modal visibility is caller-passed | `CompleteProfilePage` | `CompleteProfilePage` | `profile()` and onboarding draft/profile storage via caller | Complete-profile flow | Complete-profile strings/caller | No, keep onboarding-owned | High, because wrappers look reusable but encode onboarding semantics | Complete-profile boundary tests | verified | Profile/onboarding form parity |
| Shared `SearchBar` | `src/components/SearchBar/SearchBar.js` | `search_or_filter_component` | Trait directory, meal directory/list, other list screens where imported | Journal, nutrition, list/filter domains | `value`, `onChangeText`; clear button calls `onChangeText('')` | Caller local state | None in component | None; no submit | None | Caller if selection navigates | Caller-owned | Yes, as search/filter only | Low for search-only styling; high if treated as submitted form input | `__tests__/journalFormUxBoundary.test.js`; `__tests__/navigationSmokeFlows.test.js`; shared-component docs/tests | verified | Search/filter input boundary cleanup |
| `CustomTextArea` | `src/components/CustomTextArea/CustomTextArea.js` | `caller_owned_input_wrapper` | Journal reflection forms | Journal | `title`, `isTextArea`, `placeholder`, `checked`, `setChecked`, `onChangeText`, `value` | Caller; component only renders text/rating controls | Caller-owned | Caller-owned | Caller-owned | None in component | Caller-owned | Yes, for text/rating display with caller contract | Medium, because rating scale is behaviorally specific | `__tests__/journalFormUxBoundary.test.js`; `__tests__/primitiveFamilySurfaceBoundary.test.js` excludes from primitive barrel | verified | Text-area/rating contract lane |
| `SelectComp` | `src/components/SelectComp/SelectComp.js` | `picker_or_selector_component` | Modal contents and domain forms | Journal, nutrition, calendar, recreation, settings-adjacent selectors | `title`, `type`, `onPress`, styles | Caller; component displays current `type` | Caller-owned | Caller-owned | Caller-owned | Caller if `onPress` opens navigation/modal | Caller-owned | Yes, as display trigger only | Medium, because dropdown meaning varies by domain | `__tests__/primitiveFamilySurfaceBoundary.test.js` excludes from primitive barrel | verified | Picker/select component review |
| `CustomModal` shell | `src/components/CustomModal/CustomModal.js` | `modal_content_component` | Many modal hosts | Cross-domain | Visibility, dismiss, content slot | Caller | Caller-owned | Caller-owned | Caller-owned | Caller-owned | Caller/content-owned | Yes, as shell only | Medium, because shell hosts trust-sensitive content | `__tests__/modalShellSurfaceBoundary.test.js` | verified | Modal shell ownership lane |
| `ModalContent` | `src/components/CustomModal/ModalContent.js` | `modal_content_component` | Journal/calendar/recreation modal callers | Cross-domain | `heading`, `subText`, `btnTitle`, `hideModal`, `onBtnPress`, optional delete props | Caller | Caller-owned | Caller-owned button callbacks | Caller-owned | Caller-owned | Caller-owned | Yes, for generic modal copy/action only | Medium, because delete button can be trust-sensitive depending on caller | `__tests__/modalShellSurfaceBoundary.test.js` | verified | Modal input family review |
| `CreateItemContent` | `src/components/CustomModal/CreateItemContent.js` | `modal_content_component` | Nutrition, recreation, journal/supplement/calorie flows | Nutrition, recreation, journal | `createItemFields`, `value`, `onChangeText`, `selectedPickerItem`, `onDropdownSelect`, color, helper/error text, submit/delete callbacks | Caller; component renders fields and caller-supplied errors | Caller-owned; component only renders `formErrorText`/field errors | Caller-owned `onBtnPress`/delete callback | Caller-owned | Caller-owned | Caller/domain | Reuse with strict caller-owned contract | High if treated as a central form system | `__tests__/modalShellSurfaceBoundary.test.js`; nutrition/recreation/journal boundary tests | verified | Shared modal field contract lane |
| `SelectModalContent` | `src/components/CustomModal/SelectModalContent.js` | `picker_or_selector_component` | Journal trait select, calorie/nutrition selectors, recreation exercise/select flows | Journal, nutrition, recreation | Options, selected value, `onOptionSelect`, `onBtnPress`, `formErrorText`, loader/disabled flags | Caller; component renders selected/options | Caller-owned; component renders error text | Caller-owned | Caller-owned | Caller-owned if selection navigates | Caller-owned | Yes, as selector content only | High if selection semantics are centralized | `__tests__/modalShellSurfaceBoundary.test.js`; domain boundary tests | verified | Picker/select component review |
| `WheelPickerContent` | `src/components/CustomModal/WheelPickerContent.js` | `picker_or_selector_component` | Recreation, journal, nutrition, calendar selectors | Cross-domain picker callers | `pickerItems`, local `selectedValue`, `onValueChange`, confirm/cancel | Component owns temporary selected wheel value before confirm; caller owns confirmed value | Caller-owned | Caller-owned confirm callback | Caller-owned | Caller-owned | Caller-owned | Yes, for picker UI only | Medium, because caller expects 1-based index behavior | `__tests__/modalShellSurfaceBoundary.test.js`; domain tests | verified | Picker/select component review |
| `ColorPickerContent` | `src/components/CustomModal/ColorPickerContent.js` | `picker_or_selector_component` | Theme/trait/color modal callers | Calendar, journal, nutrition/recreation where used | Local `selectedColor`, `onChangeColor`, `onBtnPress` | Component owns temporary selected color and calls caller change callback | Caller-owned | Caller-owned | Caller-owned | None in component | Caller-owned | Yes, for color picking only | Medium, because color meaning is domain-owned | `__tests__/modalShellSurfaceBoundary.test.js` | verified | Picker/select component review |
| `DatePickerModal` | `src/components/CustomModal/DatePickerModal.js` | `picker_or_selector_component` | Complete profile, settings, journal, calendar, recreation date selectors | Profile, settings, journal, calendar, recreation | Local selected date; setter props for day/month/year; confirm/cancel | Component owns pending selected date; caller owns committed date | Caller-owned | Caller-owned confirm callback | Caller-owned | Caller-owned | Caller-owned | Yes, as date picker only | Medium, because date semantics vary by form | `__tests__/modalShellSurfaceBoundary.test.js`; calendar/journal tests | verified | Picker/select component review |
| `HeightPickerModal` | `src/components/CustomModal/HeightPickerModal.js` | `picker_or_selector_component` | Complete profile and settings profile height flows | Profile/onboarding, settings/profile | Feet/inches values and setter props; confirm/cancel | Caller-passed state, changed through setters | Caller-owned | Caller-owned | Caller-owned profile submit path | Caller-owned | Caller-owned | Reuse only inside body-measurement/profile contexts | High, because body measurement behavior is domain-sensitive | Complete-profile/settings boundary tests | verified | Body measurement input forms |
| `TimePickerModal` | `src/components/CustomModal/TimePickerModal.js` | `picker_or_selector_component` | Writing itinerary editors | Writing/calendar | Local selected hour/minute/format until confirm; setter props | Component owns pending time values; caller owns committed itinerary value | Writing page owns validation | Writing page owns save/update | Calendar theme/action owner via writing caller | Caller/calendar navigation | Caller-owned | Reuse only as picker UI | Medium, because itinerary overlap validation is caller-specific | `__tests__/writingFormUxBoundary.test.js`; navigation smoke tests | verified | Picker/select component review |
| `PermissionModal` | `src/components/PermissionModal/PermissionModal.js` | `trust_sensitive_confirmation_surface` | Many domains; optional input in dormant password reset source | Cross-domain status/confirmation; settings trust surfaces | `heading`, `text`, optional `isInput`, `value`, `onChangeText`, `onDone`, `onCancel`, loader | Caller; optional input value is caller-owned | Caller-owned | Caller-owned button callbacks | Caller-owned | Caller-owned | Caller/domain owns trust copy | Reuse as shell only, not as trust policy | High, because used for deletion/export/error/success copy | `__tests__/modalShellSurfaceBoundary.test.js` excludes from modal-shell barrel; domain tests | verified | Modal shell ownership lane |

## Caller-Owned Primitive Contracts

| Component/family | Source path | Classification | Known callers | Caller domains | Visible props/state shape | Display-state owner | Validation owner | Submit/save owner | Persistence/action owner | Route/navigation owner | Trust-copy owner | Safe for later reuse | Broad shared refactor risky | Test coverage reference | Confidence | Recommended follow-on lane |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Primitive barrel subset | `src/components/primitives/index.js` | `pure_reusable_primitive` | Root `src/components/index.js` | Cross-domain | Exports `Button`, `AddButton`, `TextButton`, `CloseButton`, `CustomText`, `Input`, `TextVal` | Component/caller depending on primitive | Caller/domain | Caller/domain | Caller/domain | Caller/domain | Caller/domain | Yes, within existing barrel contract | Medium if unrelated helpers are pulled into primitives | `__tests__/primitiveFamilySurfaceBoundary.test.js` | verified | Shared TextInput/Input primitive audit |
| Modal shell barrel subset | `src/components/modalShells/index.js` | `modal_content_component` | Root `src/components/index.js` | Cross-domain | Exports `CustomModal`, `ModalContent`, `SelectModalContent`, `CreateItemContent`, `WheelPickerContent`, `ColorPickerContent` | Component may own pending picker/color display state only | Caller/domain | Caller/domain | Caller/domain | Caller/domain | Caller/domain | Yes, within shell-only contract | High if shell is treated as validation/persistence owner | `__tests__/modalShellSurfaceBoundary.test.js` | verified | Modal shell ownership lane |
| Root mixed component barrel | `src/components/index.js` | `unknown_requires_followup` | App-wide imports | Cross-domain | Mixed primitive, shell, picker, table, helper, modal-detail exports | Varies by component | Varies; caller-owned by default | Varies; caller-owned by default | Varies; caller-owned by default | Varies; caller-owned by default | Varies | Some exports are safe; not as a whole | High, because barrel mixes unrelated ownership families | Primitive/modal/repatriation boundary tests | partially verified | Shared UI adoption wave follow-up |

## Modal Content Boundary Map

| Component/family | Source path | Classification | Known callers | Caller domains | Visible props/state shape | Display-state owner | Validation owner | Submit/save owner | Persistence/action owner | Route/navigation owner | Trust-copy owner | Safe for later reuse | Broad shared refactor risky | Test coverage reference | Confidence | Recommended follow-on lane |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `AddWorkoutModal` | `src/components/CustomModal/AddWorkoutModal.js`; re-exported through `src/screens/recreation/components/modals/index.js` | `domain_specific_input_wrapper` | Recreation screen/components | Recreation | Program/week/day/sequence controls, selected workout, loader, callbacks | Caller | Recreation page | Recreation page | Redux recreation action/slice via caller | Recreation caller | Recreation caller | No, keep recreation-owned | High | `__tests__/recreationModalRepatriationBoundary.test.js`; `__tests__/recreationFormUxBoundary.test.js` | verified | Workout scheduling ownership lane |
| `AddSingleExercise` | `src/components/CustomModal/AddSingleExercise.js`; recreation local modal barrel | `domain_specific_input_wrapper` | `EditProgram` | Recreation | Exercise, sets, amount, unit, field/form errors, submit/delete callbacks | Caller | `EditProgram` page | `EditProgram` page | Redux recreation action/slice via caller | Recreation caller | Recreation caller | No, keep recreation-owned | High | `__tests__/recreationModalRepatriationBoundary.test.js`; `__tests__/recreationFormUxBoundary.test.js` | verified | Edit-program decomposition lane |
| `AddCardioExercise` | `src/components/CustomModal/AddCardioExercise.js`; recreation local modal barrel | `domain_specific_input_wrapper` | `EditProgram` | Recreation | Cardio/sport exercise, amount, unit, errors, submit/delete callbacks | Caller | `EditProgram` page | `EditProgram` page | Redux recreation action/slice via caller | Recreation caller | Recreation caller | No, keep recreation-owned | High | `__tests__/recreationModalRepatriationBoundary.test.js`; `__tests__/recreationFormUxBoundary.test.js` | verified | Edit-program decomposition lane |
| `SupersetModal` | `src/components/CustomModal/SupersetModal.js`; recreation local modal barrel | `domain_specific_input_wrapper` | `EditProgram` | Recreation | Superset count/set selectors, errors, submit callback | Caller | `EditProgram` page | `EditProgram` page | Redux recreation action/slice via caller | Recreation caller | Recreation caller | No, keep recreation-owned | High | `__tests__/recreationModalRepatriationBoundary.test.js`; `__tests__/recreationFormUxBoundary.test.js` | verified | Superset form contract lane |
| `AddExerciseModal` and `SupersetExeComp` | `src/components/CustomModal/AddExerciseModal.js`; `src/components/SupersetExeComp/SupersetExeComp.js`; recreation local modal barrel | `domain_specific_input_wrapper` | `EditProgram` | Recreation | Per-superset exercise rows, amount/unit values, row errors, submit/delete callbacks | Caller | `EditProgram` page | `EditProgram` page | Redux recreation action/slice via caller | Recreation caller | Recreation caller | No, keep recreation-owned | High | `__tests__/recreationModalRepatriationBoundary.test.js`; recreation form tests | verified | Superset form contract lane |
| `CreateTraitModal` | `src/components/CustomModal/CreateTraitModal.js`; `src/screens/journal/components/modals/index.js` | `domain_specific_input_wrapper` | Daily Entry/Trait flows | Journal | Trait name, color, favorite, error text, directory link, submit callback | Caller | Daily Entry/journal caller | Journal caller | Journal/trait storage path via caller where proven | Journal caller | Journal caller | No, keep journal-owned | High | `__tests__/journalCalendarModalRepatriationBoundary.test.js`; journal trait tests | verified | Trait ownership lane |
| `AddRemoveTheme` | `src/components/CustomModal/AddRemoveTheme.js`; `src/screens/calendar/pages/calendar/modals/index.js` | `domain_specific_input_wrapper` | Calendar theme/repeated theme flow | Calendar | Selected day/theme/frequency/duration, current theme, clear controls | Caller except numeric-only duration input gate in component | Calendar page/caller | Calendar page/caller | Redux calendar action/slice via caller | Calendar caller | Calendar caller | No, keep calendar-owned | High | `__tests__/journalCalendarModalRepatriationBoundary.test.js`; calendar theme tests | verified | Repeated theme form lane |
| `ClearTheme` | `src/components/CustomModal/ClearTheme.js`; calendar local modal barrel | `trust_sensitive_confirmation_surface` | Calendar clear theme flow | Calendar | Clear range selector, delete/done callbacks | Caller | Calendar page/caller | Calendar page/caller | Redux calendar action/slice via caller | Calendar caller | Calendar caller | No, keep calendar-owned | High | `__tests__/journalCalendarModalRepatriationBoundary.test.js`; calendar theme tests | verified | Repeated theme form lane |
| `CalculationContent` | `src/components/CustomModal/CalculationContent.js`; `src/screens/nutrition/components/modals/index.js` | `domain_specific_input_wrapper` | Nutrition target calories/macros flow | Nutrition/profile-adjacent | Target calories/macros props, calculated display, `onCreateTargetCalories` | Component calculates display totals from caller values | Nutrition/profile caller | Nutrition/profile caller | Profile update through caller where used | Caller | Nutrition/profile caller | No, keep nutrition/profile-owned | High, because calculation and profile write are domain-sensitive | `__tests__/nutritionModalRepatriationBoundary.test.js`; nutrition tests | verified | Nutrition target-calorie/profile ownership lane |
| `ProgramDetailModal` | `src/components/CustomModal/ProgramDetailModal.js` | `modal_content_component` | Recreation program manager; Journal calories view | Recreation, journal | Program table/detail display, optional action/delete callbacks | Caller/component display only | Caller-owned | Caller-owned callbacks | Caller-owned | Caller-owned | Caller-owned | Reuse as display/action shell only | Medium, because program meaning differs by caller | `__tests__/recreationModalRepatriationBoundary.test.js` | verified | Modal display/action review |
| `NutritionItems` | `src/components/CustomModal/NurtitionItems.js` | `modal_content_component` | Nutrition and journal calories flows | Nutrition, journal | Macro/quantity display tables, edit/delete callbacks | Component computes display totals; caller owns values/actions | Caller-owned | Caller-owned callbacks | Caller-owned | Caller-owned | Caller-owned | Reuse as display content only | Medium, because nutrition semantics are domain-owned | `__tests__/nutritionModalRepatriationBoundary.test.js` | verified | Nutrition modal family review |
| `ItineraryDetail` | `src/components/CustomModal/ItineraryDetail.js` | `modal_content_component` | Writing/calendar itinerary detail callers | Writing/calendar | Itinerary item display, close callback | Component display only | None | None | None | Caller-owned | Caller-owned | Reuse as display detail only | Low to medium | Navigation/writing tests | partially verified | Writing itinerary editor lane |

## Picker / Select / Date / Height / Time Boundary Map

| Component/family | Source path | Classification | Known callers | Caller domains | Visible props/state shape | Display-state owner | Validation owner | Submit/save owner | Persistence/action owner | Route/navigation owner | Trust-copy owner | Safe for later reuse | Broad shared refactor risky | Test coverage reference | Confidence | Recommended follow-on lane |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Date picker family | `src/components/CustomModal/DatePickerModal.js`; domain modal hosts | `picker_or_selector_component` | Complete profile, settings MyVitals, journal landing/forms, calendar todo/theme, recreation workout date selectors | Profile, settings, journal, calendar, recreation | Day/month/year setter props, local pending selected date, confirm/cancel | Component pending date; caller committed date | Caller/domain | Caller/domain | Caller/domain | Caller/domain | Caller/domain | Yes as picker UI | Medium | Domain form and calendar selector tests | verified | Picker/select component review |
| Height picker family | `src/components/CustomModal/HeightPickerModal.js`; complete-profile/settings height wrappers | `picker_or_selector_component` | Complete profile, MyVitals | Profile/onboarding, settings/profile | Feet/inches values and setters, confirm/cancel | Caller-passed picker state | Profile/settings caller | Profile/settings caller | `profile()` via caller | Caller | Caller strings/helper text | Reuse only for body-measurement profile flows | High | Complete-profile/settings/profile tests | verified | Body measurement input forms |
| Time picker family | `src/components/CustomModal/TimePickerModal.js`; writing screens | `picker_or_selector_component` | Writing itinerary create/edit | Writing/calendar | Pending hour/minute/format state and setter props | Component pending state; caller committed value | Writing caller | Writing caller | Calendar theme/action via writing caller | Calendar/writing navigation caller | Caller | Reuse only as picker UI | Medium | `__tests__/writingFormUxBoundary.test.js` | verified | Picker/select component review |
| Wheel picker family | `src/components/CustomModal/WheelPickerContent.js`; `src/resources/WheelPickerItems.js` | `picker_or_selector_component` | Journal, nutrition, calendar, recreation | Cross-domain | Picker list, local selected value, 1-based index callback | Component pending selected value | Caller/domain | Caller/domain | Caller/domain | Caller/domain | Caller/domain | Yes as generic wheel UI | Medium, because data/value interpretation differs by caller | Modal shell and domain tests | verified | Picker/select component review |
| Select/dropdown trigger family | `src/components/SelectComp/SelectComp.js`; `SelectModalContent.js` | `picker_or_selector_component` | Modal contents and screen forms | Cross-domain | Display label/type, onPress/open modal, selected/options callbacks | Caller | Caller/domain | Caller/domain | Caller/domain | Caller/domain | Caller/domain | Yes as trigger/selector only | Medium | Primitive/modal tests | verified | Picker/select component review |
| Color picker family | `src/components/CustomModal/ColorPickerContent.js`; `src/screens/calendar/components/ColorPicker.js` | `picker_or_selector_component` | Calendar themes, journal traits, writing itinerary color | Calendar, journal, writing | Local color selection and caller change/save callbacks | Component pending color and caller selected color depending on implementation | Caller/domain | Caller/domain | Caller/domain | Caller/domain | Caller/domain | Yes as color UI only | Medium | Modal shell and domain tests | partially verified | Picker/select component review |
| Complete-profile date/height helper residue | `src/screens/completeProfile/components/ChooseInput.js`; `ChooseLabel.js`; `ChooseButton.js`; `HeightInputModal.js`; `src/screens/completeProfile/pages/completeProfile/InputModal.js` | `dormant_or_residue_component` | Not proven reachable in live complete-profile branch | Profile/onboarding residue | Older choose/input helpers; unknown live props | Unknown/not verified | Unknown/not verified for live UX | Unknown/not verified | Unknown/not verified | Unknown/not verified | Unknown/not verified | No | High | Existing inventory/contract docs | verified as dormant/residue | Onboarding residue cleanup lane |

## Search and Filter Boundary Map

| Component/family | Source path | Classification | Known callers | Caller domains | Visible props/state shape | Display-state owner | Validation owner | Submit/save owner | Persistence/action owner | Route/navigation owner | Trust-copy owner | Safe for later reuse | Broad shared refactor risky | Test coverage reference | Confidence | Recommended follow-on lane |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Trait directory search | `src/screens/journal/components/TraitDirectory.js`; `src/screens/journal/pages/TraitDirectory/TraitDirectory.js`; `src/components/SearchBar/SearchBar.js` | `search_or_filter_component` | Trait Directory | Journal | Search text, filter list, selection navigation | Journal caller/local state | None for search text | None for search text | Trait data read path is separate; search text not persisted | Journal caller on selection | Caller | Yes as search pattern only | Medium if merged with Daily Entry form semantics | Journal/navigation tests | verified | Search/filter input boundary cleanup |
| Meal directory search | `src/screens/nutrition/components/MealDirectory.js`; `src/components/SearchBar/SearchBar.js` | `search_or_filter_component` | Meal Directory | Nutrition | Search text and list filter | Nutrition caller/local state | None | None | Nutrition directory data ownership is separate; search text not persisted | Nutrition caller on selection | Caller | Yes as search pattern only | Medium | Nutrition/navigation tests partial | verified | Search/filter input boundary cleanup |
| Meals list search | `src/screens/nutrition/components/MealsList.js`; `src/components/SearchBar/SearchBar.js` | `search_or_filter_component` | Meals List | Nutrition | Search text and list filter | Nutrition caller/local state | None | None | Nutrition meal stack data ownership is separate; search text not persisted | Nutrition caller on selection | Caller | Yes as search pattern only | Medium | Nutrition/navigation tests partial | verified | Search/filter input boundary cleanup |
| Journal/calendar/recreation list/date selectors | `src/screens/journal/pages/Journal/Journal.js`; `src/screens/calendar/pages/calendar/Calendar.js`; `src/screens/recreation/pages/*`; `src/screens/recreation/components/*` | `search_or_filter_component` | Domain list/date/manager screens | Journal, calendar, recreation | Date/list/selection values | Caller/local state | Caller/domain where selector feeds submitted modal | Caller/domain only when submitted through a form | Caller/domain only when submitted through a form | Caller/domain | Caller/domain | Only as selector patterns | High if treated as submitted forms | Calendar selector, navigation, recreation tests | partially verified | Domain selector audit |

## Settings Control / Confirmation Boundary Map

| Component/family | Source path | Classification | Known callers | Caller domains | Visible props/state shape | Display-state owner | Validation owner | Submit/save owner | Persistence/action owner | Route/navigation owner | Trust-copy owner | Safe for later reuse | Broad shared refactor risky | Test coverage reference | Confidence | Recommended follow-on lane |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Delete local data confirmation/control | `src/screens/setting/pages/MyProfile/DeleteAccount.js`; `src/screens/setting/components/My Profile/DeleteAccount.js`; `src/redux/actions/auth.js` | `trust_sensitive_confirmation_surface` | Mounted Settings stack as `DELETE_ACCOUNT` | Settings | Confirmation boolean, loader, permission modal, alert copy | Settings page/component | Settings page/component requires explicit confirmation before destructive action | Settings page dispatches internal `deleteAccount()` | Internal auth action clears app-managed local data and rehydrates bundled plans, per baseline docs/source | Settings navigation and reset flow via caller/action | Settings owns all deletion trust copy | No | Very high; deletion semantics must remain settings-owned | `__tests__/accountFlows.test.js`; deletion docs/tests | verified | Delete/reset boundary lane only |
| Export to CSV selector/control | `src/screens/setting/pages/Export To CSV/ExportToCSV.js`; `src/screens/setting/components/Export To CSV/ExportToCSV.js` | `settings_control_surface` | Mounted Settings stack as `EXPORT_TO_CSV` | Settings/export | Entry type selector/toggle, export button, permission modal | Settings export page/component | Export page/caller | Export page/caller | Export implementation owner is settings/export-specific; not mapped as generic input | Settings navigation/caller | Settings owns export trust copy | No | Very high; export/import/privacy semantics are out of shared input scope | Existing export-related docs/tests; not exhaustively mapped here | partially verified | Export-specific lane only |
| MyAccount/MyEmail/MyPassword source residue | `src/navigation/routeNames.js`; `src/screens/setting/pages/MyProfile/MyAccount.js`; `MyEmail.js`; `MyPassword.js`; matching component files | `dormant_or_residue_component` | Route constants and files exist; not mounted in `SettingsNavigation.js` | Settings residue | Email/password/reset fields in source | Dormant source local state | Dormant page source only; not reachable UX | Dormant page/action source only | Internal auth helpers where source calls them; not reachable UX | Not mounted in live Settings stack | Dormant source copy only | No | Very high; must not promote account/auth/password behavior | `__tests__/accountFlows.test.js` covers internal action behavior, not route reachability | verified as dormant/residue | Account/auth residue cleanup lane |
| `PermissionModal` in settings controls | `src/components/PermissionModal/PermissionModal.js`; settings caller files | `trust_sensitive_confirmation_surface` | Delete local data, Export to CSV, dormant password reset, other settings status modals | Settings | Caller-supplied heading/text/buttons/input state | Caller | Caller | Caller | Caller | Caller | Settings/domain caller | Shell reuse only | Very high if trust copy is centralized without domain review | Account/settings/export tests | verified | Modal shell ownership lane |

## Domain-Owned Behavior Map

| Behavior | Current owner | Evidence | Boundary statement |
| --- | --- | --- | --- |
| Field validation | Domain screens/pages and form callers | Baseline docs and source handlers in complete profile, MyVitals, journal, nutrition, calendar, recreation, writing, settings | Shared inputs may render errors but do not define validation policy unless this artifact says otherwise. |
| Submit/save behavior | Domain screens/pages and modal callers | `onSaveHandler`, `onBtnPress`, page-level submit handlers, Redux dispatch mappings in screens | Modal content components delegate submit/save through callbacks. |
| Redux dispatch | Screen/page connector mappings and action helpers | Required ownership search; no direct `dispatch(` matches under `src/components` | Shared component source is not a Redux action owner. |
| AsyncStorage writes | Redux/storage helpers and domain action paths | Baseline docs; source/tests around `user_profile`, domain storage helpers, account flows | Shared inputs do not write AsyncStorage directly in verified source. |
| MMKV writes/clear | Storage helpers/internal deletion flow | Baseline docs and account flow tests | Shared inputs do not write or clear MMKV directly. |
| Route/navigation | Navigation stacks and domain callers | `SettingsNavigation.js`, route names, domain components with caller navigation | Shared inputs do not own route reachability. |
| Trust-sensitive copy | Settings/domain surfaces | Delete local data and export source copy; PermissionModal receives caller text | Shared modal shells must not own deletion/export/privacy/account semantics. |
| Display/pending picker state | Component or caller depending on component | `DatePickerModal`, `TimePickerModal`, `WheelPickerContent`, `ColorPickerContent` | Pending UI state is allowed in reusable components and is distinct from persistence ownership. |

## Safe Reuse Candidates

Safe candidates for later reuse only within their current boundary:

- `SearchBar` as a search/filter component, not as a submitted form field.
- Shared `Input` / `TextInput` as a display/value primitive after a focused primitive audit.
- `SelectComp` as a dropdown trigger, with selection semantics owned by callers.
- `CustomModal` and modal-shell components as visual shells and renderers only.
- `CreateItemContent` as a caller-owned field renderer, not as a central form model.
- `WheelPickerContent`, `DatePickerModal`, `TimePickerModal`, and `ColorPickerContent` as picker UI with caller-owned committed values.
- `CustomTextArea` as a caller-owned text/rating wrapper after a text-area/rating contract review.

## Not Safe for Broad Shared Refactor

Do not include these in a broad shared-input refactor without a separate domain-specific lane:

- Complete-profile step wrappers and local `Input`, because they are onboarding/profile-owned.
- `HeightPickerModal` and height/weight wrappers, because body measurement behavior is profile/settings/journal sensitive.
- Recreation modal contents: `AddWorkoutModal`, `AddSingleExercise`, `AddCardioExercise`, `SupersetModal`, `AddExerciseModal`, `SupersetExeComp`.
- Journal/calendar local modal contents: `CreateTraitModal`, `AddRemoveTheme`, `ClearTheme`.
- Nutrition/profile calculation content: `CalculationContent`.
- Display/action detail modals with domain semantics: `ProgramDetailModal`, `NutritionItems`, `ItineraryDetail`.
- Delete local data and Export to CSV settings surfaces.
- Dormant account/auth/password source residue.

## Risks and Ambiguities

- The main risk is mistaking source location under `src/components` for shared behavior ownership. Several components live in shared folders while tests and barrels already classify them as domain-owned or repatriated.
- Some components own local pending display state. That must not be confused with persisted domain state.
- `CreateItemContent` is high leverage but caller-defined field lists, errors, submit handlers, and persistence make it unsafe to treat as one central form.
- Picker components share visual mechanics while their value meaning varies by domain.
- `PermissionModal` is a reusable shell, but caller-supplied deletion/export/privacy/account copy is trust-sensitive.
- Complete-profile wrappers look reusable but remain onboarding-owned.
- Account/email/password files and route constants exist, but live `SettingsNavigation.js` does not mount them. They remain dormant/residue.
- Export behavior was not exhaustively remapped here and must remain out of shared input scope.
- Unknown or partially verified list/search controls should be handled in a narrow selector/search lane rather than folded into a form cleanup pass.

## Follow-on Lane Seeds

- `1.3.3.2.4` Profile/onboarding form parity.
- `1.3.3.2.5` Settings profile-edit form parity.
- `1.3.3.2.6` Body measurement input forms.
- `1.3.3.2.x` Search/filter input boundary cleanup.
- `1.3.3.2.x` Modal input family review.
- `1.3.3.2.x` Picker/select component review.
- `1.3.3.2.x` Shared TextInput/Input primitive audit.
- `1.3.3.2.x` Domain-specific validation ownership review.
- `1.3.3.2.x` Recreation workout modal contract review.
- `1.3.3.2.x` Calendar repeated-theme modal contract review.
- `1.3.3.2.x` Journal trait modal ownership review.
- `1.3.3.2.x` Settings trust-sensitive control review.
- `1.3.3.2.x` Account/auth/password residue cleanup.

## Non-Claims

This artifact does not claim that any component was refactored, standardized, made accessible, privacy-reviewed, renamed, extracted, deleted, made safer, or behaviorally changed.

This artifact does not change validation, persistence, Redux action ownership, AsyncStorage/MMKV behavior, route ownership, user-facing copy, deletion semantics, export/import semantics, privacy/disclosure language, body measurement conversion, profile semantics, account/login/password behavior, backend/cloud/sync behavior, or public documentation.

This artifact does not approve broad shared-component cleanup. Later implementation lanes should be scoped by one component family or one domain at a time.

## Validation

Implementation validation for this docs-only lane:

```sh
git diff --check
git status --short --untracked-files=all
```

Expected lane-owned status:

```text
?? docs/architecture/shared-input-component-boundary.md
```

No Jest run is required because this artifact does not change runtime behavior.
