# Shared UI Ownership Audit

## Summary

This artifact audits the current shared UI ownership surface exposed through `src/components/index.js`. It is current-state only, docs-only, and descriptive-first. It does not move components, rewrite imports, rename files, or prescribe a shared-UI redesign.

The current shared barrel mixes clearly shared primitives and shells with domain-shaped content and a few ambiguous leftovers. The purpose of this audit is to record that present state conservatively so later cleanup lanes can stay narrow and evidence-first.

## Scope and method

- Primary inventory surface: `src/components/index.js`
- Required secondary inventory surfaces: `src/components/CustomModal/index.js` and `src/components/CustomModal/*`
- Bounded spot-check surfaces: `src/screens/*` only when a row's ownership call would otherwise overclaim from naming alone
- Current repo code is the source of truth for this audit; existing docs are not authoritative over current implementation

Audit rules used here:

- Every current export from `src/components/index.js` is accounted for in the main register.
- Every current export from `src/components/CustomModal/index.js` is accounted for in the separate family audit.
- Ownership classification, evidence label, and disposition are determined row by row from current file content plus bounded consumer checks when needed.
- `repo-observed` is used only where current code clearly supports the ownership call.
- When current code is mixed, weak, or name-driven, the row is downgraded to `inferred` or `unknown / needs follow-on`.
- Disposition stays `unknown / needs follow-on` when the current barrel and file body do not clearly justify either `keep shared` or `likely repatriate`.

## Closed vocabularies

Ownership classification:

- `shared primitive`
- `shared app-shell chrome`
- `shared modal shell / picker shell`
- `shared data-display helper`
- `domain-coupled UI content`
- `unknown / needs follow-on`

Evidence label:

- `repo-observed`
- `inferred`
- `unknown / needs follow-on`

Disposition:

- `keep shared`
- `likely repatriate`
- `unknown / needs follow-on`

## Current shared UI export register

| Component | Current export surface | Ownership classification | Evidence label | Short rationale | Disposition |
| --- | --- | --- | --- | --- | --- |
| LogoHeader | `src/components/index.js -> ./LogoHeader` | `shared app-shell chrome` | `inferred` | Renders a simple branded header image, but verified use is limited to welcome and complete-profile flows. | `unknown / needs follow-on` |
| Button | `src/components/index.js -> ./Button` | `shared primitive` | `repo-observed` | Generic pressable button with loading and disabled states; used across multiple domains. | `keep shared` |
| CustomTextArea | `src/components/index.js -> ./CustomTextArea` | `domain-coupled UI content` | `repo-observed` | The component bundles either a textarea or a fixed 1-10 rating control, and bounded checks found it in journal entry flows. | `likely repatriate` |
| AddButton | `src/components/index.js -> ./AddButton` | `shared primitive` | `repo-observed` | Small plus-action button with no domain semantics in its body; used in several feature areas. | `keep shared` |
| CustomHeader | `src/components/index.js -> ./CustomHeader` | `shared app-shell chrome` | `repo-observed` | Shared back/edit header wrapper built around navigation and reused broadly across screen shells. | `keep shared` |
| TopTabs | `src/components/index.js -> ./TopTabs` | `shared primitive` | `inferred` | The file is only a touchable wrapper around supplied tab content, but bounded checks verified current use only in nutrition and recreation. | `unknown / needs follow-on` |
| CustomSlider | `src/components/index.js -> ./CustomSlider` | `domain-coupled UI content` | `inferred` | The body is slider-like, but it hard-codes a 1-100 percent interaction and bounded checks found it in nutrition calorie calculation only. | `likely repatriate` |
| CustomOptions | `src/components/index.js -> ./CustomOptions` | `shared primitive` | `repo-observed` | Generic selectable option chips with optional remove affordance; reused directly and inside shared modal content. | `keep shared` |
| CustomTable | `src/components/index.js -> ./CustomTable` | `domain-coupled UI content` | `repo-observed` | Hard-codes nutrition-style FAT/PRT/CHO/CAL and qty/unit table modes, even though it is consumed from more than one domain. | `likely repatriate` |
| CustomText | `src/components/index.js -> ./CustomText` | `unknown / needs follow-on` | `inferred` | The file is a generic one-line text pill, but bounded checks only verified recreation consumers. | `unknown / needs follow-on` |
| SelectComp | `src/components/index.js -> ./SelectComp` | `shared primitive` | `repo-observed` | Generic labeled picker trigger used across multiple shared and domain-local flows. | `keep shared` |
| WeeklyTable | `src/components/index.js -> ./WeeklyTable` | `domain-coupled UI content` | `repo-observed` | The body is recreation/workout-specific, including week/day plan handling and calories-out totals. | `likely repatriate` |
| ProgramTable | `src/components/index.js -> ./ProgramTable` | `domain-coupled UI content` | `repo-observed` | Renders exercise, sets, RTD, calories, supersets, and notes; current semantics are workout-specific. | `likely repatriate` |
| CloseButton | `src/components/index.js -> ./CloseButton` | `shared primitive` | `repo-observed` | Generic close affordance reused across modal shells and screens. | `keep shared` |
| CustomModal | `src/components/index.js -> ./CustomModal -> CustomModal` | `shared modal shell / picker shell` | `repo-observed` | The file is the common modal container wrapper and is reused across many domains. | `keep shared` |
| ModalContent | `src/components/index.js -> ./CustomModal -> ModalContent` | `shared modal shell / picker shell` | `repo-observed` | Generic heading/subtext/button modal content with optional delete action; bounded checks found cross-domain use. | `keep shared` |
| SelectModalContent | `src/components/index.js -> ./CustomModal -> SelectModalContent` | `shared modal shell / picker shell` | `repo-observed` | Shared selection-shell content that composes generic options, radio choices, and footer button behavior across several domains. | `keep shared` |
| CreateItemContent | `src/components/index.js -> ./CustomModal -> CreateItemContent` | `shared modal shell / picker shell` | `repo-observed` | Schema-driven create/edit form shell used by multiple domains for item creation and editing. | `keep shared` |
| WheelPickerContent | `src/components/index.js -> ./CustomModal -> WheelPickerContent` | `shared modal shell / picker shell` | `repo-observed` | Reusable picker-shell content with confirm/cancel handling and no domain-specific labels baked in. | `keep shared` |
| ColorPickerContent | `src/components/index.js -> ./CustomModal -> ColorPickerContent` | `shared modal shell / picker shell` | `repo-observed` | Reusable color-picker shell used by more than one domain. | `keep shared` |
| PermissionModal | `src/components/index.js -> ./PermissionModal` | `shared modal shell / picker shell` | `repo-observed` | Shared confirm/alert-style modal content reused widely across feature flows. | `keep shared` |
| TextButton | `src/components/index.js -> ./TextButton` | `shared primitive` | `repo-observed` | Simple text-only pressable reused across settings, calendar, journal, and modal content. | `keep shared` |
| AddExerciseModal | `src/components/index.js -> ./CustomModal -> AddExerciseModal` | `domain-coupled UI content` | `repo-observed` | The body is recreation-program specific, including superset exercise entry composition. | `likely repatriate` |
| Dashed | `src/components/index.js -> ./Dashed` | `shared data-display helper` | `repo-observed` | Thin dashed-line display helper with no domain semantics. | `keep shared` |
| Input | `src/components/index.js -> ./TextInput (exported as Input)` | `unknown / needs follow-on` | `unknown / needs follow-on` | The shared barrel exports a labeled text input, but bounded checks did not verify a shared consumer and a separate complete-profile-local `Input` overlaps by role and name. | `unknown / needs follow-on` |
| TextVal | `src/components/index.js -> ./Text (exported as TextVal)` | `unknown / needs follow-on` | `unknown / needs follow-on` | The shared barrel exports a pressable text surface, but bounded checks did not verify active screen consumers from the shared barrel. | `unknown / needs follow-on` |
| ProgramDetailModal | `src/components/index.js -> ./CustomModal -> ProgramDetailModal` | `domain-coupled UI content` | `repo-observed` | The file renders workout program details and program tables; bounded checks found recreation and journal workout-calorie contexts. | `likely repatriate` |
| AddWorkoutModal | `src/components/index.js -> ./CustomModal -> AddWorkoutModal` | `domain-coupled UI content` | `repo-observed` | The body is recreation-sequencing specific, including week, day, and workout sequence selection. | `likely repatriate` |
| CreateTraitModal | `src/components/index.js -> ./CustomModal -> CreateTraitModal` | `domain-coupled UI content` | `repo-observed` | The file is centered on journal trait creation, favorites, and trait directory selection. | `likely repatriate` |
| SearchBar | `src/components/index.js -> ./SearchBar` | `shared primitive` | `repo-observed` | Generic search field with clear affordance reused across directory-style screens. | `keep shared` |
| DatePickerModal | `src/components/index.js -> ./CustomModal -> DatePickerModal` | `shared modal shell / picker shell` | `repo-observed` | Generic date picker content reused across calendar, profile, journal, recreation, and settings flows. | `keep shared` |
| HeightPickerModal | `src/components/index.js -> ./CustomModal -> HeightPickerModal` | `shared modal shell / picker shell` | `repo-observed` | Generic two-column height picker reused across complete-profile and settings/profile flows. | `keep shared` |
| TimePickerModal | `src/components/index.js -> ./CustomModal -> TimePickerModal` | `shared modal shell / picker shell` | `repo-observed` | Generic time picker content reused across writing and settings flows. | `keep shared` |
| NutritionItems | `src/components/index.js -> ./CustomModal -> NutritionItems` | `domain-coupled UI content` | `repo-observed` | The file renders nutrition macro and qty/unit tables and keeps nutrition-specific naming despite cross-domain consumption. | `likely repatriate` |
| ItineraryDetail | `src/components/index.js -> ./CustomModal -> ItineraryDetail` | `domain-coupled UI content` | `repo-observed` | The body is writing itinerary specific, including task name, start/end times, and notes. | `likely repatriate` |
| CalculationContent | `src/components/index.js -> ./CustomModal -> CalculationContent` | `domain-coupled UI content` | `repo-observed` | The file calculates and renders nutrition target calories and meal macro splits. | `likely repatriate` |
| AddSingleExercise | `src/components/index.js -> ./CustomModal -> AddSingleExercise` | `domain-coupled UI content` | `repo-observed` | The body is recreation exercise-entry specific, including sets, units, and exercise selection. | `likely repatriate` |
| SupersetModal | `src/components/index.js -> ./CustomModal -> SupersetModal` | `domain-coupled UI content` | `repo-observed` | The file is recreation superset setup content with workout-specific fields. | `likely repatriate` |
| AddRemoveTheme | `src/components/index.js -> ./CustomModal -> AddRemoveTheme` | `domain-coupled UI content` | `repo-observed` | The body is calendar theme scheduling content with date, frequency, and current-theme semantics. | `likely repatriate` |
| ClearTheme | `src/components/index.js -> ./CustomModal -> ClearTheme` | `domain-coupled UI content` | `repo-observed` | The file is calendar theme-clear content with range selection and delete flow. | `likely repatriate` |
| AddCardioExercise | `src/components/index.js -> ./CustomModal -> AddCardioExercise` | `domain-coupled UI content` | `repo-observed` | The body is recreation cardio-exercise entry content with exercise, amount, and unit semantics. | `likely repatriate` |
| CustomTopTabs | `src/components/index.js -> ./CustomTopTabs` | `shared app-shell chrome` | `inferred` | The file is a scrollable tab-strip chrome component, but bounded checks only verified dashboard consumers. | `unknown / needs follow-on` |
| SafeAreaWrapper | `src/components/index.js -> ./SafeAreaWrapper` | `shared app-shell chrome` | `repo-observed` | Shared safe-area screen wrapper reused across multiple app sections. | `keep shared` |

## CustomModal family audit

`PermissionModal` is intentionally excluded from this section because it is exported from `src/components/PermissionModal`, not from `src/components/CustomModal/index.js`.

| Component | Current export surface | Ownership classification | Evidence label | Short rationale | Disposition | Observed consumer domains |
| --- | --- | --- | --- | --- | --- | --- |
| CustomModal | `src/components/CustomModal/index.js -> ./CustomModal` | `shared modal shell / picker shell` | `repo-observed` | Shared modal container wrapper that hosts many distinct content bodies. | `keep shared` | `calendar`, `completeProfile`, `journal`, `nutrition`, `recreation`, `setting`, `writing` |
| ModalContent | `src/components/CustomModal/index.js -> ./ModalContent` | `shared modal shell / picker shell` | `repo-observed` | Generic confirm/info content shell with heading, subtext, and button. | `keep shared` | `journal`, `recreation` |
| SelectModalContent | `src/components/CustomModal/index.js -> ./SelectModalContent` | `shared modal shell / picker shell` | `repo-observed` | Generic selection-shell content reused for multi-option and single-select flows. | `keep shared` | `calendar`, `journal`, `nutrition`, `recreation` |
| CreateItemContent | `src/components/CustomModal/index.js -> ./CreateItemContent` | `shared modal shell / picker shell` | `repo-observed` | Reused schema-driven create/edit content shell. | `keep shared` | `journal`, `nutrition`, `recreation` |
| WheelPickerContent | `src/components/CustomModal/index.js -> ./WheelPickerContent` | `shared modal shell / picker shell` | `repo-observed` | Reused picker-shell content with confirm/cancel behavior. | `keep shared` | `calendar`, `journal`, `nutrition`, `recreation` |
| ColorPickerContent | `src/components/CustomModal/index.js -> ./ColorPickerContent` | `shared modal shell / picker shell` | `repo-observed` | Reused color-picker shell with no domain labels baked into the file body. | `keep shared` | `journal`, `nutrition` |
| NutritionItems | `src/components/CustomModal/index.js -> ./NurtitionItems.js (exported as NutritionItems)` | `domain-coupled UI content` | `repo-observed` | Nutrition macro and qty/unit table semantics remain embedded in the file body. The filename/export spelling mismatch is a present-state note only. | `likely repatriate` | `journal`, `nutrition` |
| AddExerciseModal | `src/components/CustomModal/index.js -> ./AddExerciseModal` | `domain-coupled UI content` | `repo-observed` | Recreation-specific exercise/superset content. | `likely repatriate` | `recreation` |
| ProgramDetailModal | `src/components/CustomModal/index.js -> ./ProgramDetailModal` | `domain-coupled UI content` | `repo-observed` | Workout-program detail content tied to exercise/program data. | `likely repatriate` | `journal`, `recreation` |
| AddWorkoutModal | `src/components/CustomModal/index.js -> ./AddWorkoutModal` | `domain-coupled UI content` | `repo-observed` | Recreation-specific sequencing and scheduling content. | `likely repatriate` | `recreation` |
| CreateTraitModal | `src/components/CustomModal/index.js -> ./CreateTraitModal` | `domain-coupled UI content` | `repo-observed` | Journal trait creation content with domain-specific naming and flows. | `likely repatriate` | `journal` |
| DatePickerModal | `src/components/CustomModal/index.js -> ./DatePickerModal` | `shared modal shell / picker shell` | `repo-observed` | Reused date-picker content across several app sections. | `keep shared` | `calendar`, `completeProfile`, `journal`, `recreation`, `setting` |
| HeightPickerModal | `src/components/CustomModal/index.js -> ./HeightPickerModal` | `shared modal shell / picker shell` | `repo-observed` | Reused height-picker content across profile-related flows. | `keep shared` | `completeProfile`, `setting` |
| TimePickerModal | `src/components/CustomModal/index.js -> ./TimePickerModal` | `shared modal shell / picker shell` | `repo-observed` | Reused time-picker content across writing and settings flows. | `keep shared` | `setting`, `writing` |
| ItineraryDetail | `src/components/CustomModal/index.js -> ./ItineraryDetail` | `domain-coupled UI content` | `repo-observed` | Writing itinerary detail content with task/time/note semantics in the component body. | `likely repatriate` | `writing` |
| CalculationContent | `src/components/CustomModal/index.js -> ./CalculationContent` | `domain-coupled UI content` | `repo-observed` | Nutrition calorie and macro calculation content. | `likely repatriate` | `nutrition` |
| AddSingleExercise | `src/components/CustomModal/index.js -> ./AddSingleExercise` | `domain-coupled UI content` | `repo-observed` | Recreation-specific single-exercise entry content. | `likely repatriate` | `recreation` |
| SupersetModal | `src/components/CustomModal/index.js -> ./SupersetModal` | `domain-coupled UI content` | `repo-observed` | Recreation-specific superset setup content. | `likely repatriate` | `recreation` |
| AddRemoveTheme | `src/components/CustomModal/index.js -> ./AddRemoveTheme` | `domain-coupled UI content` | `repo-observed` | Calendar theme management content with date/frequency/current-theme semantics. | `likely repatriate` | `calendar` |
| ClearTheme | `src/components/CustomModal/index.js -> ./ClearTheme` | `domain-coupled UI content` | `repo-observed` | Calendar-specific theme-clear content. | `likely repatriate` | `calendar` |
| AddCardioExercise | `src/components/CustomModal/index.js -> ./AddCardioExercise` | `domain-coupled UI content` | `repo-observed` | Recreation-specific cardio exercise entry content. | `likely repatriate` | `recreation` |

## Ownership findings by family

### Shared primitives

- `Button`, `AddButton`, `CloseButton`, `SelectComp`, `CustomOptions`, `TextButton`, `SearchBar`, and `Dashed` read as the clearest current shared primitives/helpers because their file bodies stay generic and bounded checks verified reuse across domains where applicable.
- `TopTabs` is lighter-weight and more weakly evidenced than the other primitive-like entries. Its file body is generic, but bounded checks only verified nutrition and recreation consumers, so its current shared ownership remains cautious rather than fully settled.

### Shared app-shell chrome

- `CustomHeader` and `SafeAreaWrapper` are the strongest current shared screen-shell entries. Both are broadly reused and their implementations are not tied to a single feature domain.
- `LogoHeader` and `CustomTopTabs` look chrome-like by implementation, but bounded checks found narrower current ownership surfaces. They remain in the shared barrel today, but the audit does not overclaim that they are established app-wide chrome.

### Shared modal shells and picker shells

- `CustomModal` plus `ModalContent`, `SelectModalContent`, `CreateItemContent`, `WheelPickerContent`, `ColorPickerContent`, `DatePickerModal`, `HeightPickerModal`, `TimePickerModal`, and `PermissionModal` form a real current shared shell layer.
- These entries are the clearest evidence that the repo already has reusable modal and picker infrastructure, even though the same export surface also carries domain-heavy modal content.

### Domain-coupled content currently exported as shared

- The current shared barrel includes domain-shaped content whose file bodies embed feature semantics directly:
  - nutrition/journal-shaped table and macro surfaces such as `CustomTable`, `NutritionItems`, and `CalculationContent`
  - recreation/workout surfaces such as `WeeklyTable`, `ProgramTable`, `ProgramDetailModal`, `AddWorkoutModal`, `AddExerciseModal`, `AddSingleExercise`, `SupersetModal`, and `AddCardioExercise`
  - journal/calendar/writing surfaces such as `CustomTextArea`, `CreateTraitModal`, `AddRemoveTheme`, `ClearTheme`, and `ItineraryDetail`
- This is a present-state finding only: current shared export location does not, by itself, prove clean shared ownership.

### Ambiguous leftovers

- `Input`, `TextVal`, and `CustomText` are not strong enough to classify as established shared ownership from current evidence alone.
- For `Input`, bounded checks did not verify a shared consumer and a separate complete-profile-local `Input` overlaps by role and name.
- For `TextVal`, bounded checks did not verify active screen consumers from the shared barrel.
- For `CustomText`, the file body is generic, but bounded checks only verified recreation consumers.

## Follow-on lane seeds

- `primitive family cleanup`
- `app-shell chrome cleanup`
- `generic modal shell extraction`
- `recreation-owned modal repatriation`
- `journal/calendar-owned modal repatriation`
- `nutrition-owned modal repatriation`
- `mixed helper follow-on audit`

## Validation

- Exactly one new file should exist for this lane: `docs/architecture/shared-ui-ownership-audit.md`.
- No code, config, test, dependency, or existing-doc files should be modified.
- The main register above covers every current export from `src/components/index.js`.
- The `CustomModal family audit` above separately covers every current export from `src/components/CustomModal/index.js`.
- Every audited row includes ownership classification, evidence label, short rationale, and disposition.
- Validation is diff-only:
  - `git status --short` should show exactly `?? docs/architecture/shared-ui-ownership-audit.md`
  - no tests are required because this lane is docs-only
