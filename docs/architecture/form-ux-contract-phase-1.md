# Lane 1.1.5.4.1: Form UX Contract Phase 1

## 1. Title and lane framing

This artifact is a docs-only parent scoping lane for the Brunch Body Phase 1 form UX contract.

Lane `1.1.5.4.1` is a parent scoping lane only.

No repo-wide form UX cleanup sweep is approved by this lane.

This lane does not approve a shared form-system extraction, a broad redesign pass, or a single cross-repo implementation sweep across every form-owning screen.

Current repo code and current live product surfaces are the source of truth for this lane. Older prose and earlier docs may support context, but they do not override repo-observed behavior.

Named repo examples in this lane are inventory anchors and routing evidence, not claims that every listed surface has equal Phase 1 remediation priority.

## 2. Purpose

Form UX work belongs in Phase 1 because the current project scope already includes core product experience improvements, onboarding and first-run improvements, empty/loading/error states, form UX and accessibility work, and navigation or discoverability improvements. For this lane, those project-level goals are interpreted through current repo evidence rather than through older planning prose alone.

Current repo reads confirm that the app does not expose one central form system. Instead, form-owning behavior is distributed across onboarding/profile, settings-owned profile editing, nutrition entry and editing, recreation editors, journal entry surfaces, calendar submission flows, and writing editors. Current repo reads also confirm recurring interaction patterns through `TextInput`, `CustomModal`, `PermissionModal`, `DatePickerModal`, `HeightPickerModal`, `TimePickerModal`, button loader states, and screen-level `showMessage(...)` helpers, but those repeated ingredients do not amount to a clean shared form architecture today.

This lane therefore exists to define a bounded shared UX contract for touched implementation lanes without pretending that current domain ownership has already been unified.

## 3. Why this is a parent scoping lane

This lane exists to define the bounded Phase 1 form UX baseline and to route narrower child lanes. It does not implement form fixes, does not approve one broad remediation pass, and does not treat every routed or repo-present form surface as one implementation seam.

That parent-scoping posture is necessary because current repo evidence shows multiple domain-owned form families with different data shapes, validation rules, modal flows, and trust-sensitive behaviors. A single "clean up all forms" lane would widen too quickly, obscure domain-specific business rules, and make review harder.

The safest Phase 1 posture is to set shared expectations at the UX-contract level, then keep domain rules, trust-sensitive semantics, and implementation choices inside smaller follow-on lanes.

## 4. Repo-evidence inventory of current form-owning surface families

The inventory below is based on current repo structure, mounted navigation seams, and current export surfaces. It is meant to identify present ownership boundaries, not to imply that every listed surface should receive the same follow-on priority.

- `onboarding / complete-profile forms`
  `src/navigation/RootNavigation.js` mounts `CompleteProfile` as a root-stack entry surface. Current repo reads confirm step-owned onboarding/profile form surfaces under `src/screens/completeProfile/pages/completeProfile/*` and `src/screens/completeProfile/components/*`, including name, date of birth, height, weight, gender, welcome, and related picker or modal helpers.
- `settings-owned profile and adjacent account surfaces`
  `src/navigation/SettingsNavigation.js` mounts `Setting`, `MyProfile`, `MyVitals`, `DeleteAccount`, and related legal/export surfaces through the settings stack. For this lane, `src/screens/setting/pages/MyProfile/*` is the main evidence family, with `MyProfile` and `MyVitals` treated as the primary mounted settings form surfaces. `DeleteAccount` should be recorded only as a mounted adjacent trust-sensitive settings route and not as a shared-contract form target. `MyEmail` and `MyPassword` exist as repo-present adjacent account forms under the same folder family, but current export and navigation evidence in this lane is not treated as sufficient to call them confirmed live-mounted settings routes.
- `nutrition entry and edit surfaces`
  `src/navigation/NutritionNavigation.js` mounts nutrition-owned routes through `src/screens/nutrition/pages/{Nutrition,Supplement,Meal,MealsList,MealDirectory,MealDetail}`. Current repo reads confirm nutrition-specific item entry, supplement editing, macro or quantity inputs, directory-based selection flows, modal entry patterns, and save/delete paths owned within the nutrition family.
- `recreation editors`
  `src/navigation/RecreationNavigation.js` mounts recreation-owned routes through `src/screens/recreation/pages/{Recreation,RoutineManager,ProgramManager,EditProgram,EditRoutine,MyExercises}`. Current repo reads confirm editor-style form behavior for program, routine, task, and exercise creation or editing, along with local modal and confirmation flows that remain recreation-owned.
- `journal entry and logging surfaces`
  `src/navigation/JournalNavigation.js` mounts journal-owned routes through `src/screens/journal/pages/{Journal,WeightLog,QuarterlyEntry,DailyEntry,WeeklyEntry,SupplementLog,Calories,TraitDirectory}`. Current repo reads confirm repeated journal entry patterns such as date-bound submission, numeric logging, trait selection, modal-assisted entry, and success/error messaging across the journal family.
- `calendar-owned submission surfaces`
  `src/navigation/CalendarNavigation.js` mounts the calendar stack through `Calendar`, `Writing`, `EditWriting`, and `NewDay`. For the calendar-owned submission family in this lane, the primary evidence surfaces are `src/screens/calendar/pages/calendar/*`, `src/screens/calendar/components/EditTodo.js`, and `src/screens/calendar/todoSubmission.js`, which together show todo entry, edit, date-picking, radio-choice submission, delete confirmation, and the current payload-building seam.
- `writing entry and edit surfaces`
  Current repo reads confirm writing page implementations under `src/screens/writing/pages/{writing,editWriting,newDay}`. Current routing also shows that `src/screens/calendar/pages/{writing,editWriting,newDay}` re-export those wrappers into the calendar stack. For this lane, that wrapper seam should be recorded as routing truth only. Writing remains its own child-lane family even where current mounting happens through calendar-owned wrapper re-exports.

## 5. Phase 1 Form UX Contract

For this lane, the Phase 1 form UX contract means the minimum shared UX expectations that any touched form implementation lane should satisfy without reopening domain-specific business rules or inventing a cross-repo form framework.

Touched child lanes should apply the following baseline requirements:

- `field labeling and required / optional clarity`
  Touched fields should expose understandable visible labels, field titles, or directly adjacent prompts. When omission is allowed, optional status should be made clear. When completion is required, the user should not have to infer that requirement only from a later failure message.
- `numeric-entry expectations and input-mode consistency`
  Numeric or measurement-oriented fields should use an appropriate input mode for the data being requested and should present unit or format expectations near the control. Touched lanes should not leave number-only expectations implicit when the surface already communicates a specific metric, amount, or date format.
- `validation timing and error-message placement`
  Validation should occur no later than submit or next-step attempts, and earlier inline validation may be added when it clearly helps completion. Field-specific problems should appear at the field or immediately adjacent to the primary action when practical. Modal or global error messaging should be reserved for form-level failures, cross-field failures, confirmations, or async outcomes rather than acting as the only source of basic field requirements everywhere.
- `submit / save disabled and loading states`
  Submit or save actions should prevent duplicate execution, expose a visible loading state on the initiating action, and avoid opaque disabled states. If a primary action is disabled, the reason should be understandable from surrounding form state, visible copy, or clearly incomplete requirements.
- `cancel / back / destructive-confirm patterns`
  Clean exits may dismiss directly. Dirty exits, destructive deletes, or irreversible edits should use explicit confirmation patterns appropriate to the touched surface. This contract governs the presence and consistency of confirmation behavior, not the underlying business semantics of deletion, reset, export, or privacy-sensitive actions.
- `empty / error / success-state expectations`
  Touched lanes should make async outcomes understandable. Empty states should tell the user what is missing or what action is available next. Error states should say what failed and preserve recoverability where practical. Success states should make completion understandable without forcing users to guess whether data was saved.
- `keyboard / focus / accessibility expectations for touched controls`
  Touched controls should preserve reasonable keyboard flow, focus order, and accessibility clarity for primary task completion. Labels, helper text, validation, and critical status messaging should not rely on color alone. This lane sets a form-baseline expectation only; it does not replace the broader accessibility baseline or approve a repo-wide accessibility sweep.
- `copy tone for trust-sensitive forms`
  Copy on trust-sensitive surfaces should stay plain, local-first, and non-alarmist. Touched lanes should not invent cloud/account promises, reframe privacy posture, or drift into delete/reset/export/storage semantics that belong to separate trust and data lanes.

For settings-owned surfaces specifically, trust-sensitive mounted routes may be recorded as adjacent context without being pulled into the shared form contract.

## 6. Domain-local items that stay with child lanes

This parent lane does not normalize the following items across domains. They should stay local to follow-on child lanes:

- `onboarding / complete-profile local rules`
  step order, age gate behavior, height and weight representation, nickname rules, and first-run progression
- `settings / account local rules`
  routing truth for adjacent account screens plus delete/reset/export wording, privacy language, and storage semantics
- `nutrition local rules`
  macro math, supplement item shape, meal-item behavior, directory-read semantics, and nutrition-specific field composition
- `recreation local rules`
  program/routine/exercise hierarchy, task structure, and recreation-specific editor rules
- `journal local rules`
  entry caps, trait or favorite behavior, date-entry restrictions, and journal-specific validation thresholds
- `calendar local rules`
  todo payload shape, picked-date handling, and the `Someday` sentinel contract
- `writing local rules`
  itinerary overlap resolution, time-block behavior, theme-edit semantics, and writing-specific time or note handling

## 7. Explicit non-goals

This lane is planning-only. It does not include:

- runtime code changes
- tests
- config or dependency changes
- reducer, navigation, storage, or backend changes
- shared form framework extraction
- repo-wide accessibility remediation
- redesign of unrelated screens or non-form UI
- delete/reset/export semantics work
- privacy/disclosure/storage-contract changes
- forced unification of domain-specific business rules across onboarding, settings, nutrition, recreation, journal, calendar, and writing

This lane also does not authorize a broad "improve all forms" rewrite, a shared-component migration wave, or a repo-wide sweep across every screen with a `TextInput`.

## 8. Follow-on child lane routing

The correct follow-on shape for this work is bounded domain or flow lanes rather than one implementation sweep:

- `1.1.5.4.2 Onboarding / complete-profile form UX baseline`
  Apply the contract to the step-based onboarding and profile-completion family.
- `1.1.5.4.3 Settings profile and adjacent account-edit form UX baseline`
  Apply the contract to settings-owned profile editing and adjacent account-edit surfaces while keeping delete/reset/export/privacy/storage semantics out of scope even where adjacent trust-sensitive settings routes are inventoried.
- `1.1.5.4.4 Nutrition meal and supplement entry/edit form UX baseline`
  Apply the contract to nutrition-owned meal, supplement, and related entry/edit flows.
- `1.1.5.4.5 Recreation editor form UX baseline`
  Apply the contract to recreation-owned program, routine, and exercise editor flows.
- `1.1.5.4.6 Journal logging and trait-entry form UX baseline`
  Apply the contract to journal-owned logging and entry surfaces.
- `1.1.5.4.7 Calendar todo submission form UX baseline`
  Apply the contract to calendar-owned todo submission and edit flows.
- `1.1.5.4.8 Writing itinerary/day editor form UX baseline`
  Apply the contract to writing-owned itinerary and day editor surfaces, even though current wrappers are mounted through the calendar stack.

## 9. Acceptance / validation notes

Acceptance for this parent lane is document quality and scoping completeness only. It is not implementation completion and it is not a sign-off that the entire app already meets a consistent form UX baseline.

Validation notes for this lane:

- exactly one new file should exist: `docs/architecture/form-ux-contract-phase-1.md`
- the artifact should explicitly say that `1.1.5.4.1` is a docs-only parent scoping lane and that no repo-wide form UX implementation sweep is approved
- the inventory should be grounded in current repo structure, current routing seams, and current export surfaces rather than older prose alone
- the artifact should clearly separate shared Phase 1 baseline requirements, domain-local rules, and explicit non-goals
- `DeleteAccount` should be recorded only as adjacent mounted trust-sensitive context, not as a shared-contract remediation target
- future child lanes should gather direct surface evidence before making stronger claims about implementation quality or remediation priority

Existing narrow-regression tests may be cited only as supporting context for a bounded follow-on posture, not as authority over live code. Relevant examples include:

- `__tests__/completeProfileNicknameBoundary.test.js`
- `__tests__/calendarTodoSubmissionBoundary.test.js`
- `__tests__/nutritionSupplementContract.test.js`
- `__tests__/modalShellSurfaceBoundary.test.js`

## 10. Risks / notes

- the largest scope risk is false normalization: current repo evidence shows multiple domain-owned form families rather than one shared implementation seam
- a second risk is letting the inventory read like a hidden remediation backlog instead of a routing and ownership map
- settings is the most sensitive boundary in this lane because mounted settings routes sit next to trust-sensitive delete/reset/export/privacy concerns that this contract must not reopen
- writing should remain its own implementation family even though current mounted routing passes through calendar-owned wrapper re-exports
- older docs may help with framing, but letting them override present repo evidence would weaken the evidence-first posture of this lane
