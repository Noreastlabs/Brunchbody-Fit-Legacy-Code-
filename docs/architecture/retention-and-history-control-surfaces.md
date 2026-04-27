# Retention and History Control Surfaces

## Status and Scope

This is an internal architecture inventory only.

This document is a present-state inventory only. It records current retention and history control surfaces without approving behavior, copy, privacy, store, export/import, restore, archive, or deletion changes.

This artifact does not change app behavior, Settings copy, README content, public docs, privacy policy language, store language, platform disclosures, export behavior, import/restore behavior, deletion behavior, or storage semantics. It does not approve new deletion, reset, export, import, restore, archive, backend, cloud, sync, or account-deletion behavior.

The scope is limited to current app-managed local data, sidecar/reference local data, compatibility read seams, exported-copy boundaries, and repo-observed lifecycle controls. It inventories what the current repo shows so later lanes can align Settings copy, README/public docs, privacy language, store/disclosure language, export/import strategy, portability guidance, and tests without guessing.

## Vocabulary Baseline

This inventory follows the approved `1.2.3.4.1 Retention and History Semantics Decision` vocabulary contract:

- Use `Delete local data` as the preferred user-facing phrase for the strongest current destructive app-local control.
- Treat `delete account` as forbidden for current user-facing claims unless a real backend account deletion flow exists.
- Treat `reset` as restricted and control-specific; internal `RESET_APP` naming is not a user-facing product claim.
- Treat `archive` as not current behavior.
- Use `exported copy` for files written outside app-managed storage.
- Restrict `backup` unless paired with a clear user-managed/export limitation and no restore guarantee.
- Require public or user-facing retention claims to describe current behavior only.
- Keep `history` domain-qualified, such as journal history, nutrition history, exercise history, calendar history, recreation history, or todo history.

## Evidence Basis

Evidence sources inspected for this inventory:

- `docs/architecture/delete-reset-archive-semantics-decision.md`
- `docs/architecture/persistence-inventory.md`
- `docs/architecture/storage-contract-matrix.md`
- `docs/architecture/store-and-middleware-review.md`
- `README.md`
- `src/bootstrap/AppBootstrap.js`
- `src/root-container/RootContainer.js`
- `src/redux/store/store.js`
- `src/redux/actions/auth.js`
- `src/redux/actions/profileStorage.js`
- `src/redux/actions/onboardingStorage.js`
- `src/redux/actions/calendar.js`
- `src/redux/actions/calendarThemeStorage.js`
- `src/redux/actions/journal.js`
- `src/redux/actions/journalTraitsStorage.js`
- `src/redux/actions/nutrition.js`
- `src/redux/actions/nutritionStorage.js`
- `src/redux/actions/recreation.js`
- `src/redux/actions/recreationStorage.js`
- `src/redux/actions/todo.js`
- `src/redux/actions/todoStorage.js`
- `src/redux/actions/exercise.js`
- `src/redux/actions/exerciseStorage.js`
- `src/redux/reducer/auth.js`
- `src/redux/reducer/calendar.js`
- `src/redux/reducer/journal.js`
- `src/redux/reducer/nutrition.js`
- `src/redux/reducer/recreation.js`
- `src/redux/reducer/todo.js`
- `src/redux/reducer/exercise.js`
- `src/storage/asyncStorageJson.js`
- `src/storage/mmkv/index.js`
- `src/storage/mmkv/hydration.js`
- `src/storage/mmkv/keys.js`
- `src/utils/storageUtils.ts`
- `src/screens/setting/pages/Setting/Setting.js`
- `src/screens/setting/pages/Export To CSV/ExportToCSV.js`
- `src/screens/setting/components/Export To CSV/ExportToCSV.js`
- `src/screens/setting/pages/MyProfile/MyAccount.js`
- `src/screens/setting/pages/MyProfile/DeleteAccount.js`
- `src/screens/setting/components/My Profile/DeleteAccount.js`

Live code wins over older docs. The requested historical seed path `src/redux/actions/authStorage.js` is not present in the current repo; live auth/profile storage helpers are split across `profileStorage.js` and `onboardingStorage.js`.

Absence claims in this document mean "no repo-observed path found," not runtime impossibility. Inferred rows are labeled as `inferred`. Unknowns are labeled as `unknown`. Public and user-facing claims are not updated in this lane.

## Surface Classification Model

Storage category labels:

- `app-managed local data`: current app-local data stored in the app lifecycle, including Redux Persist backed by AsyncStorage and direct app-owned AsyncStorage keys.
- `sidecar/reference local data`: local adjacent reference data outside the Redux Persist boundary, such as MMKV bundled-plan hydration data.
- `exported copy`: a file produced by the app export flow outside app-managed storage.
- `external/user-managed copy`: a copy outside the app lifecycle after export, copy, move, share, upload, backup, or OS/platform action.
- `not repo-observed`: no current repo-observed implementation path was found.

Control category labels:

- `scoped logout clear`: scoped auth/profile/onboarding/password-related direct-key removal plus Redux auth clearing.
- `in-memory reset`: reducer reset through `RESET_APP` without storage clearing by itself.
- `full local clear`: broad local storage clear across the observed app-managed backend.
- `full local clear plus bundled re-seed`: broad local storage clear followed by MMKV bundled starter-plan hydration.
- `user-managed outside app lifecycle`: exported or external copies after the app hands off file control.
- `no repo-observed control`: no current repo-observed control path was found.

Evidence category labels:

- `repo-observed`: directly supported by current repo code.
- `inferred`: supported by current repo evidence plus framework/library convention or overlapping ownership analysis.
- `unknown`: included because it is relevant, but current code does not prove the full claim.

## Current Retention Surface Inventory

| Surface | Storage engine / backend | Key or namespace | Current owner / flow | Data class | Current write path | Current read path | Current remove / clear path | Lifecycle trigger | App-managed local data? | User-managed after export? | Logout interaction | RESET_APP interaction | Delete local data interaction | Export/import relevance | Retention/history language note | Evidence status | Follow-on lane relevance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Redux persisted root | Redux Persist backed by AsyncStorage | Repo-authored key `root`; runtime entry commonly inferred as `persist:root` | Store bootstrap in `store.js`; mounted through `PersistGate` in `RootContainer.js` | Persisted whitelisted slices: `auth`, `recreation`, `journal`, `nutrition`, `calendar`, `exercise`, `todo` | Reducer mutations write through `persistReducer(...)` and `persistStore(...)` | Rehydration through `PersistGate` | No targeted purge observed; `AsyncStorage.clear()` clears it as part of the full local clear | App startup and any persisted slice mutation | yes | no | `logout()` only dispatches `CLEAR_USER`, affecting persisted auth state after Redux Persist writes | `RESET_APP` resets in-memory slice state only; persistence clearing is separate | Current `deleteAccount()` dispatches `RESET_APP`, clears AsyncStorage, clears MMKV, and rehydrates bundled plans | Main local data body; not directly exported as a full app backup | Root persisted state is the app-managed local data boundary, not one undifferentiated history | repo-observed, with runtime key name inferred | Storage contract normalization; delete/export semantics; tests |
| `user_profile` | Direct AsyncStorage plus overlapping persisted `auth` slice | `user_profile` | Profile storage helpers, auth actions, app bootstrap route gate, profile/settings flows | Local profile fields such as name, DOB, height, weight, gender, and email | `saveStoredProfile(...)` from profile and email update flows | `hasStoredProfile(...)`, `loadStoredProfile(...)`, `loggedIn(...)`, and bootstrap route resolution | Scoped logout removes it; full local clear removes it | Onboarding completion, profile update, email update, bootstrap, auth checks | yes | no | Removed by scoped logout key set, then Redux auth clears | In-memory auth slice resets when `RESET_APP` is dispatched | Removed by `AsyncStorage.clear()` in current `deleteAccount()` flow | Not exported by current export flow | Profile retention is local/device-scoped; ownership overlaps direct key and persisted auth slice | inferred | Auth/profile contract cleanup; copy alignment |
| Onboarding draft keys | Direct AsyncStorage | `name`, `dob`, `height`, `weight`, `gender` | Onboarding draft storage helpers and complete-profile screens | Partial onboarding profile/vitals answers | `setOnboardingDraftValue(...)` and screen-specific draft writes | `getOnboardingDraftValue(...)` during onboarding | Successful profile completion clears `dob`, `height`, and `gender`; logout removes all draft keys; full local clear removes all | Onboarding step progression and completion | yes | no | Removed by scoped logout key set | No direct storage effect; in-memory auth state may reset only through reducers | Removed by `AsyncStorage.clear()` | Not exported by current export flow | Draft retention is not profile history; it is incomplete-onboarding local data | repo-observed | Onboarding cleanup and delete-copy validation |
| `local_password` | Direct AsyncStorage | `local_password` | Local password/change/reset flows in auth actions | Sensitive local credential value | `changePassword(...)` writes the new value | `changePassword(...)` reads for validation | `resetPassword(...)` removes it; logout removes it; full local clear removes it | Password change, password reset, logout, Delete local data validation context | yes | no | Removed by scoped logout key set | No direct storage effect | Removed by `AsyncStorage.clear()` | Not exportable; should stay outside portability outputs | Do not describe as history or exported data | repo-observed | Credential storage hardening; privacy/copy guardrails |
| `local_password_reset_requested_at` | Direct AsyncStorage | `local_password_reset_requested_at` | Local password reset sentinel in auth actions | Local timestamp sentinel | `resetPassword(...)` writes an ISO timestamp | No current repo-observed read gate | `changePassword(...)` removes it; logout removes it; full local clear removes it | Password reset request and later password change/logout/clear | yes | no | Removed by scoped logout key set | No direct storage effect | Removed by `AsyncStorage.clear()` | Not exportable | Reset-password sentinel is not app reset, account deletion, or history | repo-observed | Password UX/copy accuracy |
| Journal state | Redux Persist backed by AsyncStorage | `root` / `journal` slice | Journal actions and reducer | Journal entries, selected entry projections, trait state in persisted slice | `SET_JOURNAL_ENTRY`, `EDIT_JOURNAL_ENTRY`, and `GET_TRAITS` mutate persisted journal state | Journal screens/selectors read Redux journal state; export reads `state.journal.allJournalEntriesList` | No journal-specific storage clear observed; `RESET_APP` resets in memory; full local clear removes persisted root | Journal create/edit/load/export | yes | no | Not cleared by logout except if Redux auth changes only | `RESET_APP` resets in-memory journal state | Removed from AsyncStorage by full local clear in current `deleteAccount()` flow | Current export writes selected journal rows to workbook files; no import/restore observed | Journal history is a current domain-specific history surface | repo-observed | Journal export visibility; history language alignment |
| `traits` | Direct AsyncStorage compatibility read plus persisted `journal` slice | `traits` | Journal traits storage helper and `getTraits()` action | Trait directory override or custom trait list | No repo-observed direct write path under `src`; persisted journal slice updates after `GET_TRAITS` | `readStoredTraits()` and `getTraits()` read direct key into journal state | Malformed direct key can be removed by repair helper; full local clear removes it | Journal trait loading | yes, as compatibility read seam | no | Not touched by logout | `RESET_APP` resets in-memory journal state only | Removed by `AsyncStorage.clear()` | Not exported by current export flow | Compatibility read seam should not be described as independent user-facing trait history | inferred | Journal storage normalization |
| Nutrition keys | Direct AsyncStorage compatibility reads plus persisted `nutrition` slice | `meals`, `supplements`, `meal_categories`, `meals_directory` | Nutrition storage helpers and nutrition actions | Meals, supplements, categories, directory data | No repo-observed direct writes for these keys in current code; reducer mutations persist through Redux root | `readStoredMeals()`, `readStoredSupplements()`, `readStoredMealCategories()`, `readStoredMealsDirectory()` | Malformed direct values can be removed by repair helpers; full local clear removes them | Nutrition list/directory loading | yes, as compatibility read seams | no | Not touched by logout | `RESET_APP` resets in-memory nutrition state only | Removed by `AsyncStorage.clear()` | Not exported by current export flow | Nutrition history must not be generalized from journal history; direct reads are compatibility seams | inferred | Nutrition portability and storage normalization |
| Calendar themes | Direct AsyncStorage compatibility read plus persisted `calendar` slice | `themes`; persisted calendar state includes `themes`, repeated-theme state, cleared-day state, and derived theme projections | Calendar theme storage helper, calendar actions, calendar reducer | Themes, repeated-theme state, current theme, cleared theme days, derived calendar date projections | No repo-observed direct write for `themes`; calendar reducer mutations persist through Redux root | `readStoredThemes()` and `getThemes()` read direct key, then recompute repeated themes | Malformed direct key can be removed by repair helper; full local clear removes it | Calendar/theme loading and theme updates | yes, as compatibility read seam plus persisted slice | no | Not touched by logout | `RESET_APP` resets in-memory calendar state only | Removed by `AsyncStorage.clear()` | Not exported by current export flow | Calendar history must be domain-qualified; repeated-theme state is not archive behavior | inferred | Calendar theme semantics; archive-like follow-on review |
| Exercise keys | Direct AsyncStorage compatibility reads plus persisted `exercise` slice | `exercises`, `exercise_directory` | Exercise storage helper and exercise actions | User exercise list and exercise directory override data | No repo-observed direct writes for these keys in current code; reducer mutations persist through Redux root | `readStoredExercises()` and `readStoredExerciseDirectory()` | Malformed direct values can be removed by repair helpers; full local clear removes them | Exercise load and merge flows | yes, as compatibility read seams | no | Not touched by logout | `RESET_APP` resets in-memory exercise state only | Removed by `AsyncStorage.clear()` | Not exported by current export flow | Exercise history must be domain-qualified and not inferred from direct read seams | inferred | Exercise storage normalization; portability |
| Recreation keys | Direct AsyncStorage compatibility reads plus persisted `recreation` slice | `routines`, `workouts`; persisted recreation state also includes `customPlans`, `weekPlan`, `completedWorkouts`, and MMKV-loaded bundled plan projections | Recreation storage helper and recreation actions | User routines, workouts, custom plans, week plans, completed workouts, and selected bundled plan projections | No repo-observed direct writes for `routines` or `workouts`; reducer mutations persist through Redux root | `readStoredRoutines()` and `readStoredWorkouts()`; Redux recreation state reads after rehydration | Full local clear removes direct keys and persisted root; no targeted direct-key removal observed | Recreation load and mutation flows | yes, as compatibility read seams plus persisted slice | no | Not touched by logout | `RESET_APP` resets in-memory recreation state only | Removed from AsyncStorage by full local clear; MMKV bundled catalog is then re-seeded | Not exported by current export flow | Recreation history must be domain-qualified; bundled starter content is not retained user history | inferred | Recreation storage split; bundled-plan semantics |
| MMKV `is_initialized` | MMKV sidecar/reference local data | `workout-storage` / `is_initialized` | MMKV hydration helper | Bundled-plan hydration sentinel | `hydrateWorkoutPlans()` sets it after seeding bundled plans | `hydrateWorkoutPlans()` reads boolean sentinel | No targeted clear observed; `storage.clearAll()` clears it before rehydration recreates it | App bootstrap and post-clear rehydration | sidecar/reference local data | no | Not touched by logout | Not affected by `RESET_APP` alone | Cleared by `storage.clearAll()` and recreated by bundled-plan re-seed | Not exported | Sentinel is starter-content metadata, not user retention or history | repo-observed | MMKV hydration and delete semantics |
| MMKV `plans_brunch_body` | MMKV sidecar/reference local data | `workout-storage` / `plans_brunch_body` | MMKV hydration helper and recreation bundled-plan reads | Bundled Brunch Body plan catalog and `weeksData` | `hydrateWorkoutPlans()` writes bundled plan payload through `setJSON(...)` | Recreation reads through `getJSON(...)` in bundled-plan actions | No targeted clear observed; `storage.clearAll()` clears it before rehydration writes it again | First launch, app bootstrap, post-clear rehydration, bundled-plan access | sidecar/reference local data | no | Not touched by logout | Not affected by `RESET_APP` alone | Cleared by MMKV clear and immediately re-seeded by current `deleteAccount()` flow | Not exported | Bundled starter content may appear again; it is not restored user history | repo-observed | Starter-content copy and delete-local-data validation |
| Todo key | Direct AsyncStorage compatibility read plus persisted `todo` slice | `todos` | Todo storage helper, legacy todo actions, calendar re-export surface | Todo task list | No repo-observed direct write for `todos`; reducer mutations persist through Redux root | `readStoredTodos()` and `getTodo()`; calendar-facing actions re-export todo thunks | Malformed direct key can be removed by repair helper; full local clear removes it | Calendar/todo loading and task mutation | yes, as compatibility read seam plus persisted slice | no | Not touched by logout | `RESET_APP` resets in-memory todo state only | Removed by `AsyncStorage.clear()` | Not exported by current export flow | Todo history must be domain-qualified and not collapsed into calendar or journal history | repo-observed for compatibility read; ownership overlap inferred | Calendar/todo ownership cleanup |
| Exported workbook files | Local file export through `xlsx`, scoped storage, and RNFS | User-selected document tree or path; filename pattern like `{entryType}-{hhmmss}.xlsx` | Settings export journal data flow | Selected journal rows written into workbook file | `XLSX.write(...)`, `RNFS.writeFile(...)`, or `ScopedStorage.writeFile(...)` | No repo-observed app import or re-read path after export | No in-app delete path for exported files observed | User selects journal entry type, permission/storage location, and export action | no, after export | yes | Not removed by logout | Not removed by `RESET_APP` | Not removed by Delete local data/current `deleteAccount()` flow | Only current export surface; not a generalized full-app backup and no import/restore complement observed | Use exported copy; do not call restorable backup | repo-observed | Export copy, sensitivity, portability guidance |
| Import/restore | Not repo-observed | none found | none found | none found | none found | none found | none found | none found | not repo-observed | not repo-observed | No current interaction | No current interaction | No current interaction | No repo-observed import/restore flow complements export | Do not claim restore or import support | unknown | Future portability/import strategy only |
| Logout clearing flow | Scoped AsyncStorage removal plus Redux auth clearing | `user_profile`, `local_password`, `local_password_reset_requested_at`, `name`, `dob`, `height`, `weight`, `gender`; Redux `auth` slice | Auth `logout()` flow, triggered from Settings | Scoped auth/profile/onboarding/password-related data | Not a write path; storage clear plus `CLEAR_USER` dispatch | `getScopedLogoutKeys()` defines scope | `AsyncStorage.multiRemove(...)` and `CLEAR_USER` | Logout action | yes, for scoped keys only | no | This row is the logout interaction | Does not dispatch `RESET_APP` | Not a full local data wipe | Does not remove exported copies | Logout is not Delete local data and not a full local history clear | repo-observed | Settings copy/test separation |
| `RESET_APP` reducer seam | Redux root reducer wrapper | `RESET_APP` action | Root reducer in `store.js`; dispatched by current `deleteAccount()` action | In-memory Redux slice state | Not a storage write path | Reducer sees action and returns `appReducer(undefined, action)` | In-memory reset only; no storage wipe by itself | Current Delete local data flow dispatches it before storage clears | in-memory only | no | Not part of logout | This row is the `RESET_APP` interaction | Becomes part of full local clear only when paired with explicit AsyncStorage/MMKV clearing | Does not remove exported copies | Internal reset seam is not user-facing reset language | repo-observed | Reset/delete semantics and tests |
| Delete local data / current `deleteAccount()` clearing flow | Redux action plus AsyncStorage and MMKV clearing | All AsyncStorage keys; all MMKV entries before bundled re-seed | Internal `deleteAccount()` action and Delete local data screen route | Broad local app-managed data plus starter-content rehydration | Not a write path except bundled re-seed after clear | Reads are not required in current action body; earlier UI flow confirms user intent | Dispatches `RESET_APP`, calls `AsyncStorage.clear()`, calls `storage.clearAll()`, then `hydrateWorkoutPlans()` | User confirms Delete local data/current internal delete route | yes, for app-managed local data | no | Distinct from logout; broader than scoped auth clear | Dispatches `RESET_APP` first | This row is the Delete local data interaction | Does not delete exported copies; does not import or restore | Local-only clear, not backend account deletion; bundled plans may appear again | repo-observed | User-facing copy, public docs, disclosure alignment |

## Clearing and Lifecycle Control Matrix

| Control | Required interpretation | Storage/control category | Exported copy effect | Evidence status | Follow-on note |
| --- | --- | --- | --- | --- | --- |
| Logout | Scoped removal of auth/profile/onboarding/password-related direct keys plus Redux auth clearing. Not a full local data wipe. | `scoped logout clear` | Does not delete exported copies. | repo-observed | Keep separate from Delete local data and `RESET_APP`. |
| `RESET_APP` | In-memory Redux reset seam. Not a storage wipe by itself. | `in-memory reset` | Does not delete exported copies. | repo-observed | Avoid user-facing broad reset language unless tied to a verified control. |
| Delete local data / current `deleteAccount()` flow | Full AsyncStorage clear plus MMKV clear, followed by bundled plan rehydration. | `full local clear plus bundled re-seed` | Does not delete exported copies or external/user-managed copies. | repo-observed | Use local-only language; do not claim backend account deletion. |
| Export | Writes an exported copy outside app-managed storage. | `user-managed outside app lifecycle` | Creates a user-managed exported copy. | repo-observed | Do not call the workbook a full-app backup or restore system. |
| Import/restore | No repo-observed current control. | `no repo-observed control` | No current import/restore effect. | unknown | Future portability lane only. |
| Archive | Not current behavior. | `no repo-observed control` | No current archive effect. | unknown | Future archive language requires a separate scoped lane. |

## Exported Copy Boundary

Exported files are outside app-managed storage after export. Current implementation writes selected journal rows to workbook files through `XLSX`, `ScopedStorage`, and `RNFS`; it does not write a generalized full-app backup.

Delete local data language must not imply that exported files are deleted. Once a file is exported, the user manages where it is saved, copied, shared, uploaded, backed up, moved, retained, restored, or deleted. The current app has no repo-observed in-app delete path for already exported files.

Exported files must not be called restorable backups unless restore/import behavior is implemented and verified. The current repo shows one-way journal workbook export only, with no repo-observed import or restore complement.

## History Language Boundaries

`History` must be domain-qualified. Journal history is not the same as nutrition history, exercise history, calendar history, recreation history, or todo history.

The current journal slice is the clearest current history surface because `allJournalEntriesList` persists journal entries and the export flow reads selected journal entry rows. Nutrition, exercise, calendar, recreation, and todo may store past or user-created domain records, but their history language must be verified per domain before public or user-facing claims generalize across the app.

Direct compatibility reads should not be described as independent user-facing histories unless verified. Keys such as `traits`, `meals`, `themes`, `exercises`, `routines`, `workouts`, and `todos` are current read seams that overlap persisted Redux slices; they are not proof of separate user-facing history products.

Archive is not current behavior. Domain behaviors that look like deletion, clearing, hiding, repaired reads, derived repeated-theme projection, or starter-content rehydration must not be promoted into an archive claim in this lane.

## Current Mismatches and Follow-On Notes

- Current Settings now exposes `Delete local data` in the main Settings surface and delete screen, but My Account still contains `Delete Account` wording and internal route/component/action names such as `DeleteAccount` and `deleteAccount`. This lane records that mismatch candidate only and does not fix it.
- Export surface naming still carries `ExportToCSV` implementation/path residue, while current implementation writes Excel workbook files (`.xlsx`) rather than CSV. This lane records the mismatch only.
- README storage wording is directionally useful but insufficiently precise about compatibility read seams versus persisted Redux write ownership. This lane does not edit README.
- No repo-observed import/restore complement exists for the current export flow.
- Future lanes should handle Settings copy, My Account copy, README/public docs alignment, privacy/store/disclosure review, tests, and any implementation cleanup separately.
- Bundled plan re-seed after Delete local data should be described as app-provided starter content appearing again, not retained user history and not restored user data.

## Non-Claims

This lane does not claim:

- backend account deletion
- cloud deletion
- cloud backup
- automatic restore
- import support
- archive support
- deletion of exported files
- deletion of OS backups
- deletion of cloud-folder copies
- deletion of shared/uploaded files
- deletion of copied or moved files outside app-managed storage
- generalized full-app backup behavior
- new privacy or store disclosure readiness
- launch readiness
- legal privacy-policy approval
- App Store or Google Play disclosure approval
- any storage migration, key rename, reducer change, action change, or export/import behavior change

## Validation

Required validation for this artifact:

```sh
git diff --check
```

Focused text check:

```sh
rg -n "Delete local data|exported copy|archive|restore|import|logout|RESET_APP|deleteAccount|retention_surface_inventory_recorded" docs/architecture/retention-and-history-control-surfaces.md
```

Scope validation:

- Confirm exactly one new file is created: `docs/architecture/retention-and-history-control-surfaces.md`.
- Confirm no existing files are modified.
- Confirm the required heading order is present.
- Confirm the exact present-state scope sentence is present.
- Confirm the inventory distinguishes app-managed local data, sidecar/reference local data, compatibility read seams, exported copies, and not repo-observed import/restore behavior.
- Confirm the artifact does not collapse logout, `RESET_APP`, and Delete local data/current `deleteAccount()` into one behavior.
- Confirm the artifact ends with the sentinel below.

retention_surface_inventory_recorded
