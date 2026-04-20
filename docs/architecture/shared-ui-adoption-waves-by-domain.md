# Lane 1.1.5.2.9: Shared UI Adoption Waves by Domain

## Summary

This artifact is a docs-only parent scoping lane. It is present-state only and evidence-first. It does not move components, rewrite barrels, rename files, or approve one broad implementation pass across the remaining shared UI seam.

No single repo-wide adoption wave is approved by this lane.

The current post-cleanup remainder in `src/components/index.js` is still mixed. The root barrel still exports helper-like surfaces such as `TopTabs`, `CustomTopTabs`, `SearchBar`, `CustomOptions`, `SelectComp`, `CustomSlider`, and `Dashed`; domain-shaped tables such as `CustomTable`, `WeeklyTable`, and `ProgramTable`; and still-shared cross-domain content such as `ProgramDetailModal`, `DatePickerModal`, `HeightPickerModal`, `TimePickerModal`, `NutritionItems`, and `ItineraryDetail`. This parent lane freezes that mixed remainder into bounded child-wave seeds rather than treating it as one implementation pass.

Earlier primitive, chrome, modal-shell, and repatriation lanes remain closed and are referenced here only as context. This artifact does not reopen those families.

## Method / Evidence

Primary inventory surface:

- `src/components/index.js`

File-body reads:

- `src/components/TopTabs/TopTabs.js`
- `src/components/CustomTopTabs/CustomTopTabs.js`
- `src/components/SearchBar/SearchBar.js`
- `src/components/CustomOptions/CustomOptions.js`
- `src/components/SelectComp/SelectComp.js`
- `src/components/CustomSlider/CustomSlider.js`
- `src/components/Dashed/Dashed.js`
- `src/components/CustomTable/CustomTable.js`
- `src/components/WeeklyTable/WeeklyTable.js`
- `src/components/ProgramTable/ProgramTable.js`
- `src/components/CustomTextArea/CustomTextArea.js`
- `src/components/CustomModal/DatePickerModal.js`
- `src/components/CustomModal/HeightPickerModal.js`
- `src/components/CustomModal/TimePickerModal.js`
- `src/components/CustomModal/ProgramDetailModal.js`
- `src/components/CustomModal/NurtitionItems.js`
- `src/components/CustomModal/ItineraryDetail.js`

Bounded consumer reads only:

- `src/screens/dashboard/components/Dashboard.js`
- `src/screens/calendar/pages/calendar/Calendar.js`
- `src/screens/journal/components/Journal.js`
- `src/screens/journal/components/Calories.js`
- `src/screens/journal/components/SupplementLog.js`

Current repo code is authoritative for this lane. Older docs are context only and do not override current file bodies or current import patterns.

## Matrix Rules

- Readiness values are planning baselines, not approval to widen scope. If a row still mixes stronger candidates with ambiguity-sensitive helper surfaces, prefer `needs more subtasks`.
- Already-closed family surfaces such as `WheelPickerContent` and `SafeAreaWrapper` may be cited only in rationale as surrounding seam context. They do not belong in the `Surfaces` cell as open ownership targets in this lane.
- Holdback labels must stay inside the bounded consumer evidence radius named above. If a likely domain label would require broader consumer reads, use a neutral holdback label instead.
- File-body semantics are the primary signal. Bounded consumer reads are used only to explain why a broad adoption wave is unsafe or to justify a neutral holdback label.

## Adoption-Wave Matrix

| Wave / category | Surfaces | Observed consumer pattern | Readiness | Why broad adoption is unsafe now |
| --- | --- | --- | --- | --- |
| `shared helper/tab split candidate` | `TopTabs`, `CustomTopTabs`, `SearchBar`, `CustomOptions`, `SelectComp`, `Dashed` | `CustomTopTabs` is spot-checked in dashboard; `TopTabs` remains a helper-like wrapper in the root barrel; `SearchBar` appears in journal and nutrition flows; `CustomOptions` appears in journal flows and nutrition-shaped flows; `SelectComp` and `Dashed` remain helper-like in file bodies and still participate in mixed shared usage patterns. | `needs more subtasks` | This parent lane does not approve one combined helper/tab implementation wave. The remainder still mixes stronger shared-helper candidates such as `SearchBar`, `CustomOptions`, `SelectComp`, and `Dashed` with more ambiguity-sensitive tab wrappers such as `TopTabs` and `CustomTopTabs`. |
| `nutrition-table ownership/adoption decision` | `CustomTable` | `CustomTable` still appears in nutrition-shaped usage and in journal `SupplementLog`, and its file body hard-codes nutrition-style macro or qty/unit table contracts. | `needs more subtasks` | The current table body is already domain-shaped, but the remaining consumer pattern is not a clean single-owner adoption story from this lane alone. |
| `recreation-table ownership/adoption decision` | `WeeklyTable`, `ProgramTable` | File bodies remain recreation-shaped. `ProgramTable` is consumed by `ProgramDetailModal`, and `ProgramDetailModal` is still visible in journal `Calories` as well as recreation flows. | `needs more subtasks` | The table surfaces read as recreation-owned by contract, but the remaining seam is still entangled with a cross-domain content modal, so this parent lane freezes the split rather than approving implementation. |
| `calendar/journal shared picker holdback` | `DatePickerModal` | `DatePickerModal` is still spot-checked in calendar and journal consumers. | `blocked / shared seam` | The remaining seam is not just the date picker body. Calendar and journal still rely on surrounding shared modal and shell context. `WheelPickerContent`, `CustomModal`, `PermissionModal`, and `SafeAreaWrapper` help explain that shared seam, but those already-closed family surfaces are context only and are not open ownership targets in this lane. |
| `mixed nutrition/journal content holdback` | `NutritionItems` | `NutritionItems` remains in nutrition-shaped content and is also consumed in journal `Calories` and journal `SupplementLog`. | `blocked / shared seam` | The file body is nutrition-shaped, but the bounded consumer reads still show journal dependence, so ownership cannot be flattened into one adoption wave from this parent lane. |
| `journal cross-domain content holdback` | `ProgramDetailModal` | `ProgramDetailModal` is still consumed in journal `Calories`, while its file body remains recreation-program shaped through `ProgramTable`. | `blocked / shared seam` | The current seam crosses a journal flow and a recreation-shaped content contract, so this lane preserves it as a holdback rather than approving adoption work. |
| `custom-textarea/helper holdback` | `CustomTextArea`, `CustomSlider` | `CustomTextArea` is spot-checked in journal entry flows. `CustomSlider` remains helper-like by structure but still hard-codes a 1 to 100 percent-style interaction in its file body. | `needs more subtasks` | These surfaces are not a clean shared-helper wave yet. One is journal-shaped by current consumer evidence, and the other is still semi-generic but behaviorally specialized. |
| `additional picker holdback outside bounded reads` | `HeightPickerModal`, `TimePickerModal` | Present in the root barrel and still shared-looking by file body, but this lane did not expand bounded consumer checks beyond dashboard, calendar, journal, calories, and supplement log. | `needs more subtasks` | A more specific domain label would outrun the stated evidence radius. This parent lane keeps the row neutral until a later follow-on lane reads those consumers directly. |
| `additional content holdback outside bounded reads` | `ItineraryDetail` | Present in the root barrel and content-shaped by file body, but this lane did not expand bounded consumer checks beyond the named spot-check set. | `needs more subtasks` | The file body suggests a narrower owner, but a more specific holdback label would outrun the bounded evidence plan, so the row stays neutral here. |

## Child Lane Seeds

- `shared search/select/helper adoption`
- `tab/helper decision`
- `nutrition table ownership adoption`
- `recreation table ownership adoption`
- `calendar/journal date-picker holdback`
- `mixed nutrition/journal content holdback`
- `journal cross-domain content holdback`
- `custom-textarea/helper holdback`
- `additional picker holdback follow-on`
- `additional content holdback follow-on`
