# Archive Control Discovery and Deferral Rule

## Status and Scope

This is an internal architecture guidance artifact for Brunch Body archive-control discovery and deferral.

This lane changes no app behavior, no source code, no tests, no user-facing copy, no README content, no public docs, no privacy language, no store disclosure language, no storage behavior, no export behavior, no import behavior, no delete behavior, no reset behavior, no archive implementation, no route behavior, no navigation behavior, no reducer behavior, and no action behavior.

What changed: one internal architecture artifact only.

What users experience: no user-facing change.

This artifact does not create any user-facing archive claim. It records that global Archive is not an approved Phase 1 user control and prevents current domain delete, remove, clear, hide, deleted, or restore-like behavior from being treated as product-wide Archive semantics by accident.

## Evidence Basis

This artifact uses two completed internal architecture artifacts as evidence inputs:

- `docs/architecture/delete-reset-archive-semantics-decision.md`
- `docs/architecture/delete-reset-archive-current-state-audit.md`

The decision record says `Archive` is not a global Phase 1 control and is not implementation-ready until audited. It also says archive must not be treated as one cross-app feature until a future lane defines the domain, data class, visibility, recoverability, deletion relationship, and related boundaries.

The current-state audit found no global user-facing `Archive` control, route, action, reducer case, or storage key in the inspected app code. It found domain-specific behavior that can look archive-like, especially journal `isDeleted` behavior and calendar `deletedThemes` / `clearedThemeDays` behavior. It also found ordinary delete, remove, clear, logout, reset-password, and storage-repair behavior that must not be collapsed into an Archive product claim.

This artifact is evidence-bound. It does not re-approve, widen, or reinterpret the prior decision or audit artifacts.

## Archive Vocabulary

| Label | Meaning |
| --- | --- |
| `global_archive_not_current` | No approved app-wide Archive control exists. |
| `domain_archive_like_behavior` | A domain has behavior that resembles archive, soft-delete, hide, or restore, but it is not global archive semantics. |
| `delete_remove_clear_behavior` | A domain has destructive or clearing behavior, not archive. |
| `ambiguous_archive_candidate` | Evidence is insufficient or terminology is unclear. |
| `future_domain_follow_on` | A future scoped lane may decide whether archive belongs in that domain. |

Working vocabulary:

- Global archive control means an app-wide user control that intentionally stores records as archived, defines visibility and recovery semantics, and applies across domains or Settings.
- Domain delete, remove, or clear behavior means scoped user or internal behavior that deletes, removes, clears, or resets records in a specific domain without establishing Archive semantics.
- Soft-delete-like behavior means records appear to remain in state while being marked deleted or hidden from normal lists.
- Visibility or hide behavior means a record or occurrence is suppressed from display without proving archive status.
- Restore or recovery behavior means a record can be intentionally brought back after being hidden, deleted, or archived; no global restore behavior is approved here.
- Cleared state markers means stored state that records clearing or suppression decisions, such as calendar cleared days, without establishing an Archive feature.

## Current Global Archive Status

Archive status: `global_archive_not_current`.

No global Archive control is approved for Phase 1. The current evidence does not show a global user-facing Archive label, route, navigation entry, action, reducer case, storage contract, export/import contract, test suite, public-doc claim, privacy-language claim, or store-disclosure claim.

Current domain-specific delete, remove, clear, hidden, deleted, and restore-like terms remain descriptive implementation or domain behavior only. They are not product-wide Archive semantics.

## Archive-Like Behavior Inventory

| Domain / surface | Current behavior | Archive classification | User-facing archive label? | Storage / state touched | Evidence path | Trust risk | Follow-on needed |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Global archive control | No global user-facing Archive control, route, action, reducer case, storage key, or storage contract was found. | `global_archive_not_current` | no | unknown | `docs/architecture/delete-reset-archive-current-state-audit.md`; `docs/architecture/delete-reset-archive-semantics-decision.md` | medium | yes - global Archive remains deferred unless a future lane proves scope |
| Journal entries | Deleting a selected entry subtype marks it `isDeleted: true`; normal journal rendering hides subtype entries marked deleted; export removes the `isDeleted` field from selected row data. | `domain_archive_like_behavior` | no | Redux journal state | `src/screens/journal/pages/Journal/Journal.js`; `src/screens/journal/components/Journal.js`; `src/redux/reducer/journal.js`; `src/screens/setting/pages/Export To CSV/ExportToCSV.js` | medium | yes - journal domain delete/archive split and export visibility lane seed |
| Journal form clearing | `Clear Entry` resets form fields and local modal state; saved state changes only if the user later saves changed form data. | `delete_remove_clear_behavior` | no | Local component state; Redux if later saved | `src/screens/journal/pages/DailyEntry/DailyEntry.js`; `src/screens/journal/pages/WeightLog/WeightLog.js`; `src/screens/journal/pages/Calories/Calories.js`; `src/screens/journal/pages/SupplementLog/SupplementLog.js`; `src/screens/journal/pages/WeeklyEntry/WeeklyEntry.js`; `src/screens/journal/pages/QuarterlyEntry/QuarterlyEntry.js` | medium | yes - journal clear-vs-delete wording lane only if needed |
| Calendar themes | Theme management supports delete, clear current theme state, stored cleared theme days, and repeated-theme date suppression through `deletedThemes`. | `domain_archive_like_behavior` | no | Redux calendar state, including `clearedThemeDays` and theme `deletedThemes` | `src/screens/calendar/pages/calendar/Calendar.js`; `src/redux/actions/calendar.js`; `src/redux/reducer/calendar.js`; `src/redux/selectors/calendar.js`; `__tests__/calendarThemeRepeatedThemeBoundary.test.js`; `__tests__/calendarTodoFormUxBoundary.test.js` | medium | yes - calendar theme hide/clear/recovery semantics lane seed |
| Calendar todo | Todo deletion removes a task by id from the todo slice; calendar re-exports the todo deletion action for calendar ownership. | `delete_remove_clear_behavior` | no | Redux todo state | `src/screens/calendar/pages/calendar/Calendar.js`; `src/screens/calendar/components/EditTodo.js`; `src/redux/actions/todo.js`; `src/redux/reducer/todo.js`; `__tests__/calendarTodoFormUxBoundary.test.js`; `__tests__/calendarTodoOwnershipBoundary.test.js` | low | no - no Archive follow-on seed |
| Nutrition meals and supplements | Nutrition reducers remove meals, meal items, supplements, and supplement items from persisted Redux slice state. | `delete_remove_clear_behavior` | no | Redux nutrition state | `src/redux/actions/nutrition.js`; `src/redux/reducer/nutrition.js`; `src/screens/nutrition/components/Meal.js`; `src/screens/nutrition/components/Supplement.js`; `__tests__/nutritionFormUxBoundary.test.js`; `__tests__/nutritionSupplementContract.test.js` | low | no - no Archive follow-on seed |
| Recreation routines, workouts, and custom plans | Recreation reducers remove routines, routine tasks, custom plans, and workouts from matching arrays by id or index. | `delete_remove_clear_behavior` | no | Redux recreation state | `src/redux/actions/recreation.js`; `src/redux/reducer/recreation.js`; `src/screens/recreation/pages/EditRoutine/EditRoutine.js`; `src/screens/recreation/pages/Recreation/Recreation.js`; `__tests__/recreationFormUxBoundary.test.js`; `__tests__/recreationSliceBoundary.test.js` | low | no - no Archive follow-on seed |
| Exercise custom exercises | Exercise deletion removes a custom exercise and dispatches merge behavior so the visible exercise list reflects directory plus custom data. | `delete_remove_clear_behavior` | no | Redux exercise state | `src/redux/actions/exercise.js`; `src/redux/reducer/exercise.js`; `src/screens/recreation/pages/MyExercises/MyExercises.js`; `__tests__/exerciseMergeDirectoryBoundary.test.js` | low | no - no Archive follow-on seed |
| Settings Delete local data | Current Settings exposes Delete local data. It dispatches internal `deleteAccount()`, resets Redux through `RESET_APP`, clears AsyncStorage, clears MMKV, and rehydrates bundled starter plans. | `delete_remove_clear_behavior` | no | AsyncStorage, MMKV, Redux | `src/screens/setting/pages/Setting/Setting.js`; `src/screens/setting/components/My Profile/DeleteAccount.js`; `src/screens/setting/pages/MyProfile/DeleteAccount.js`; `src/redux/actions/auth.js`; `__tests__/accountFlows.test.js` | high | no - no Archive follow-on seed |
| Reset, password, and logout-adjacent controls | `RESET_APP` is internal Redux reset behavior; logout is scoped auth/profile/onboarding cleanup; reset password is credential-related and live reachability is ambiguous in the audit. | `delete_remove_clear_behavior` | no | Redux; AsyncStorage for scoped auth/password keys | `src/redux/actions/auth.js`; `src/redux/store/store.js`; `src/navigation/SettingsNavigation.js`; `src/screens/setting/pages/MyProfile/MyPassword.js`; `__tests__/accountFlows.test.js` | high | no - no Archive follow-on seed |
| Storage repair cleanup | Direct storage readers remove malformed or invalid specific keys during repair paths. | `delete_remove_clear_behavior` | no | AsyncStorage direct keys | `src/redux/actions/profileStorage.js`; `src/redux/actions/nutritionStorage.js`; `src/redux/actions/exerciseStorage.js`; `src/redux/actions/calendarThemeStorage.js`; `src/redux/actions/todoStorage.js`; storage-boundary tests cited by the audit | medium | no - no Archive follow-on seed |
| Domain archive decision backlog | Journal and calendar evidence suggests future domain questions, but archive terminology, recovery behavior, storage semantics, export/import effects, tests, and disclosures are not proven. | `future_domain_follow_on` | unknown | unknown until scoped by domain | `docs/architecture/delete-reset-archive-current-state-audit.md`; `docs/architecture/delete-reset-archive-semantics-decision.md` | medium | yes - only domain-specific lane seeds |
| Restore or recovery semantics | No approved global restore or recovery semantics were found for Archive. Some current behavior may be reversible through ordinary edit or recreate flows, but that is not verified as archive recovery. | `ambiguous_archive_candidate` | unknown | unknown | `docs/architecture/delete-reset-archive-current-state-audit.md`; current repo search summarized there | medium | yes - only if a future domain lane proposes recovery |

## Domain-Specific Findings

Journal has the strongest archive-like signal because deleted entry subtypes can remain represented in Redux state with `isDeleted: true` while the normal journal list hides them. This is still not Archive. It has no approved Archive label, recovery contract, export/import policy, privacy-language impact, or tests for archive semantics.

Calendar themes have archive-like visibility and cleared-state signals because repeated theme dates can be suppressed through `deletedThemes`, and `clearedThemeDays` records clearing decisions. This is still not Archive. It is calendar-specific theme behavior until a future lane defines whether any hide, restore, or recovery model belongs there.

Todo, nutrition, recreation, and exercise behavior is delete/remove behavior. Current evidence shows records removed from domain Redux state, not archived.

Settings Delete local data is destructive local-data control behavior. It is not Archive and must stay separate from domain-level hide, soft-delete, restore, or recovery questions.

Logout, `RESET_APP`, reset-password, storage repair, export, and starter-plan hydration are not Archive. They may affect trust language and deletion/reset boundaries, but they do not create archive semantics.

## Deferral Rule

Archive is not approved as a global Phase 1 user control. Existing domain delete, remove, clear, hidden, deleted, or restore-like behavior must not be described as Archive unless a future domain-specific lane verifies the user-facing label, storage semantics, recovery behavior, export/import impact, tests, and disclosure implications.

Future archive work must be domain-specific before it is implementation-ready. A future lane must define at least:

- the affected domain and record type
- the exact user-facing label, if any
- whether archived records remain stored locally
- whether archived records are hidden, read-only, searchable, recoverable, exported, imported, or included in summaries
- whether archive changes delete, reset, backup, export, import, privacy, support, or store-disclosure language
- what tests prove the behavior

Without that evidence, current archive-like behavior remains descriptive only and must not be promoted into a global product claim.

## Follow-On Lane Seeds

- `future_domain_follow_on`: Journal domain delete/archive split. Decide whether journal `isDeleted` is a soft-delete implementation detail, a delete behavior, or a candidate for a user-facing archive/recovery model. Include export/import and recovery behavior before any copy or tests use Archive vocabulary.
- `future_domain_follow_on`: Calendar theme hide/clear/recovery semantics. Decide whether `deletedThemes` and `clearedThemeDays` remain calendar-specific suppression state or need a user-facing recovery model.
- `future_domain_follow_on`: Domain-level delete/archive split plan. Use only if journal and calendar questions justify a scoped lane; do not include global Archive implementation.

No follow-on seed approves implementation. Each seed requires a separate domain-specific scope, evidence pass, user-facing label decision, storage semantics, recovery behavior, export/import impact review, tests, and disclosure review before Archive can be named or built.

## Non-Approvals

This artifact does not approve:

- app behavior changes
- source-code changes
- test changes
- route or navigation changes
- storage changes
- reducer or action changes
- user-facing copy changes
- README changes
- public-doc changes
- privacy-language changes
- store-disclosure changes
- export behavior changes
- import behavior changes
- delete behavior changes
- reset behavior changes
- restore or undo implementation
- global Archive implementation
- domain-level Archive implementation
- global Archive copy
- domain Archive copy
- legal, medical, clinical, HIPAA, launch-readiness, or store-readiness claims
