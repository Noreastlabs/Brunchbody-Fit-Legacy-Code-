# Journal History and Exported File Retention Truth Check
## Status and Scope

This is an internal architecture truth-check only.

It verifies current journal history and exported file retention behavior for the current repo.

This document is a journal history and exported file retention truth check only. It records current behavior without approving behavior, copy, privacy, store, export/import, restore, archive, deletion, journal, backup, backend, or cloud changes.

This document does not change app behavior.

This document does not change Settings copy.

This document does not change export screen copy.

This document does not change README/public docs.

This document does not change privacy policy, store language, or disclosures.

This document does not approve new deletion/reset/export/import/restore/archive behavior.

This document does not approve backup, cloud, sync, or account-deletion claims.

## Source of Truth

`1.2.3.4.1` approved the retention/history vocabulary in `docs/architecture/delete-reset-archive-semantics-decision.md`.

`1.2.3.4.2` inventoried present-state retention/control surfaces in `docs/architecture/retention-and-history-control-surfaces.md`.

`1.2.3.4.3` defined language rules in `docs/architecture/history-archive-delete-language-rules.md`.

`1.2.3.4.4` established the same docs-only truth-check pattern for profile/auth/onboarding in `docs/architecture/profile-auth-onboarding-retention-truth-check.md`.

Live code wins over older docs.

If docs and code disagree, record the mismatch and use live code for the truth check.

Absence claims mean "no repo-observed path found," not runtime impossibility.

Inferred rows must be explicitly labeled.

## Vocabulary Baseline

| Term | Required treatment |
| --- | --- |
| Journal history | Allowed only as domain-qualified journal history, not universal app history. |
| Journal entry | Allowed if repo-observed as journal domain data. |
| Traits | Treat as journal direct/compatibility read seam if verified. |
| Delete local data | Preferred user-facing phrase for clearing app-managed local data on this device. |
| `deleteAccount()` | Internal implementation identifier only; may be cited as evidence. |
| `RESET_APP` | In-memory Redux reset seam unless paired with storage clearing. |
| exported copy | Preferred phrase for exported workbook files outside app-managed lifecycle after export. |
| CSV | Mismatch candidate if visible copy/docs say CSV while implementation writes workbook files. |
| workbook / `.xlsx` | Allowed if live implementation verifies workbook output. |
| backup | Restricted; do not describe export as full backup or restore-capable backup. |
| restore/import | Restricted; do not imply current support unless implemented and verified. |
| archive | Not current behavior. |
| cloud backup/sync | Forbidden current-state claim unless implemented and verified. |

## Evidence Inputs

| Evidence input | Contribution |
| --- | --- |
| `docs/architecture/delete-reset-archive-semantics-decision.md` | Vocabulary baseline for `Delete local data`, domain-qualified history, exported copies, backup restrictions, restore/import restrictions, archive restrictions, and cloud/sync restrictions. |
| `docs/architecture/retention-and-history-control-surfaces.md` | Present-state inventory for persisted journal state, traits compatibility read seam, exported workbook files, logout, `RESET_APP`, Delete local data/current `deleteAccount()`, and import/restore/archive absence. |
| `docs/architecture/history-archive-delete-language-rules.md` | Language rules for domain history, exported copies, CSV/workbook mismatch candidates, backup/restore/import restrictions, archive non-claims, and follow-on lane routing. |
| `docs/architecture/profile-auth-onboarding-retention-truth-check.md` | Docs-only truth-check structure and scope pattern for current-state retention behavior without behavior/copy/privacy changes. |
| `docs/architecture/persistence-inventory.md` | Prior persistence register for Redux Persist root, direct `traits` key, exported journal workbook files, logout, `RESET_APP`, Delete local data/current `deleteAccount()`, and no repo-observed import/restore flow. |
| `docs/architecture/storage-contract-matrix.md` | Storage-contract context for Redux Persist root and direct `traits` compatibility read; some older references are context only when live helper names differ. |
| `docs/architecture/store-and-middleware-review.md` | Store context for persisted root whitelist, `journal` slice persistence, `RESET_APP`, and current logout/delete-account behavior. |
| `README.md` | Public/contextual local-first and storage wording; useful for mismatch awareness but not stronger than live code. |
| `package.json` | Confirms current workbook dependency `xlsx` and file/storage dependencies `react-native-fs` and `react-native-scoped-storage`. |
| `src/redux/store/store.js` | Persisted Redux store evidence: `journal` is whitelisted in the `root` persisted store and `RESET_APP` resets in-memory reducer state. |
| `src/redux/actions/journal.js` | Journal action evidence: `getJournalEntries()`, `addJournalEntry()`, `editJournalEntry()`, and `getTraits()` dispatch journal-domain actions and read traits through the storage helper. |
| `src/redux/reducer/journal.js` | Journal reducer evidence: `allJournalEntriesList`, `allEntries`, `allTraits`, `SET_JOURNAL_ENTRY`, `EDIT_JOURNAL_ENTRY`, `GET_JOURNAL_ENTRIES`, and `GET_TRAITS` behavior. |
| `src/redux/actions/auth.js` | Logout and Delete local data/current `deleteAccount()` evidence: scoped logout keys, `CLEAR_USER`, `RESET_APP`, `AsyncStorage.clear()`, `storage.clearAll()`, and bundled-plan rehydration. |
| `src/redux/actions/journalTraitsStorage.js` | Traits direct AsyncStorage evidence: `TRAITS_STORAGE_KEY = 'traits'`, read path, malformed JSON repair, non-array repair, and no direct write path. |
| `src/storage/asyncStorageJson.js` | Context for direct AsyncStorage JSON helper patterns; no journal export/import behavior is introduced here. |
| `src/screens/setting/pages/Export To CSV/ExportToCSV.js` | Export flow evidence: reads `state.journal.allJournalEntriesList`, filters selected journal entry type, builds `.xlsx` workbook with `XLSX`, opens document tree, and writes through `RNFS` or `ScopedStorage`. |
| `src/screens/setting/components/Export To CSV/ExportToCSV.js` | Export screen evidence: current visible screen describes selected journal entries as an Excel workbook and states exported files are user-managed outside Delete local data. |
| `src/screens/setting/pages/Setting/Setting.js` | Settings navigation evidence: current Settings row is `Export journal data`, route remains `SETTINGS_ROUTES.EXPORT_TO_CSV`, and Delete local data is a separate settings surface. |
| `src/screens/setting/pages/MyProfile/DeleteAccount.js` | Delete local data page evidence: confirmation gates current internal `deleteAccount()` and success copy says exported/copied/shared/moved/backed-up/uploaded/external files are not deleted. |
| `src/screens/setting/components/My Profile/DeleteAccount.js` | Delete local data component evidence: local-data boundary copy lists journal entries as deleted app-local data and external files as not deleted. |

Minimum evidence classes covered: persisted journal slice/store evidence; journal action/reducer evidence; traits storage helper evidence; export screen/flow evidence; workbook dependency/output evidence; delete-local-data/current `deleteAccount()` clearing evidence; prior architecture docs evidence; README wording evidence.

## Surface Classification Model

Storage category labels:

- `app-managed local data`
- `persisted Redux state`
- `direct AsyncStorage key`
- `exported copy`
- `external/user-managed copy`
- `not repo-observed`

Control category labels:

- `domain write/read`
- `compatibility read`
- `scoped logout clear`
- `in-memory reset`
- `full local clear`
- `user-managed outside app lifecycle`
- `not exported`
- `no repo-observed import`
- `no repo-observed restore`
- `no repo-observed archive`

Evidence category labels:

- `repo-observed`
- `inferred`
- `unknown`

## Journal History Retention Surfaces

Journal history in this document means journal-domain history only. It does not mean universal app history.

| Surface name | Storage engine or file boundary | Key / namespace / output type | Current owner/helper/flow | Current read path | Current write path | Current clear/delete path | Lifecycle trigger | App-managed local data? | User-managed after export? | Logout interaction | `RESET_APP` interaction | Delete local data/current `deleteAccount()` interaction | Export/import relevance | Evidence status | Mismatch or follow-on notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Persisted Redux journal state | Redux Persist backed by AsyncStorage | `root` / `journal` slice; runtime storage entry name is library-conventional if stated beyond repo-authored `root` | `src/redux/store/store.js`; `src/redux/reducer/journal.js`; journal actions | Rehydrated through Redux Persist; journal screens read `state.journal`; export reads `state.journal.allJournalEntriesList` | Reducer mutations from `SET_JOURNAL_ENTRY`, `EDIT_JOURNAL_ENTRY`, `GET_TRAITS`, and selected-entry reads | No journal-specific storage wipe repo-observed; `RESET_APP` resets in memory; current full local clear removes AsyncStorage | Journal create/edit/load/export and app rehydration | yes | no | Not cleared by logout; logout only scopes auth/profile/onboarding/password keys and `CLEAR_USER` | Resets in-memory journal state through root reducer only | Removed from persisted AsyncStorage by current `AsyncStorage.clear()` in `deleteAccount()` | Export reads selected rows; no repo-observed import/restore complement | repo-observed for slice, actions, and clear interaction; runtime persisted entry name inferred | Do not describe as backend or cloud journal history. |
| Journal entries/history list | Persisted Redux state | `state.journal.allJournalEntriesList`; entry objects include `createdOn`, `id`, and entry-type payloads | Journal reducer and journal entry screens | `getJournalEntries(date)` dispatches `GET_JOURNAL_ENTRIES`; reducer finds a matching date and writes selected projection to `allEntries`; dashboard reads list for charts | Entry screens dispatch `addJournalEntry(date, data)` or `editJournalEntry(id, data)` | No storage purge per entry repo-observed; delete UI edits a selected entry type to `isDeleted: true`; full local clear removes persisted storage | Saving daily, weight, calories, supplement, weekly, or quarterly journal entries; deleting an entry type from journal landing | yes | no | Not touched by logout | Reset in memory only | Cleared from AsyncStorage by current full local clear | Export can include selected journal entry-type rows; no repo-observed import/restore | repo-observed | `isDeleted` is a journal-domain hide/delete marker in entry payloads, not archive behavior. |
| Selected journal date projection | Persisted Redux state | `state.journal.allEntries` | `GET_JOURNAL_ENTRIES` reducer path | `findEntryForDate(...)` compares normalized `createdOn` values to selected date | Updated by reducer after `GET_JOURNAL_ENTRIES`; not a direct storage write by itself | Reset with in-memory journal state; full local clear removes persisted journal state | Opening or changing the journal date | yes, as persisted projection if Redux Persist writes it | no | Not touched by logout | Reset in memory only | Cleared from AsyncStorage by current full local clear | Not separately exported; export uses `allJournalEntriesList` | repo-observed | Projection is not independent journal history. |
| Journal entry-type delete marker | Persisted Redux state | Entry subfield such as `DailyEntry.isDeleted` | Journal landing `onDeleteJournalEntry()` plus `editJournalEntry()` | Journal component hides rows whose selected entry type has `isDeleted` truthy | `EDIT_JOURNAL_ENTRY` merges edited entry payload by `id` | No purge repo-observed for the full entry object; current delete path edits entry subfield to `isDeleted: true` | User deletes an entry type from current journal date UI | yes | no | Not touched by logout | Reset in memory only | Cleared from AsyncStorage by current full local clear | Export filter checks `item[name]`, deletes the `isDeleted` property from selected export row object, and writes row data if present | repo-observed | This is not archive, restore, or external deletion. Follow-on tests should verify export behavior around deleted entry-type payloads if needed. |
| Backend/cloud journal history | not repo-observed | not repo-observed | not repo-observed | no repo-observed path found | no repo-observed path found | no repo-observed path found | none found | no | no | no current interaction | no current interaction | no current interaction | no repo-observed backend/cloud journal export/import/restore | unknown absence claim | Do not claim backend journal history, backend journal deletion, cloud backup, cloud sync, or cloud restore. |

Current journal write/read/delete paths are repo-observed in the Redux journal action/reducer flow and journal screens. Current journal history is app-managed local data before export. It is exported only through the selected journal entry workbook flow. No repo-observed journal import, journal restore, journal archive, backend journal history, cloud journal history, backend journal deletion, cloud backup, or sync control was found.

## Journal Traits Retention Surface

Traits are treated here as a journal direct/compatibility read seam, not as an independent user-facing history surface.

| Surface name | Storage engine or file boundary | Key / namespace / output type | Current owner/helper/flow | Current read path | Current write path | Current clear/delete path | Lifecycle trigger | App-managed local data? | User-managed after export? | Logout interaction | `RESET_APP` interaction | Delete local data/current `deleteAccount()` interaction | Export/import relevance | Evidence status | Mismatch or follow-on notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traits direct/compatibility read seam | Direct AsyncStorage key plus persisted journal state overlap | `traits`; projected into `state.journal.allTraits` | `src/redux/actions/journalTraitsStorage.js`; `getTraits()` in `src/redux/actions/journal.js`; journal reducer `GET_TRAITS` | `readStoredTraits()` calls `AsyncStorage.getItem('traits')`, parses JSON, requires an array, then `getTraits()` dispatches `GET_TRAITS` | No direct `AsyncStorage.setItem('traits', ...)` repo-observed under `src`; `GET_TRAITS` updates persisted `journal.allTraits` after read | Malformed JSON or non-array direct values are removed by `AsyncStorage.removeItem('traits')`; current full local clear removes the key | Journal trait loading, if `getTraits()` is invoked | yes, as compatibility/direct read seam | no | Not touched by logout | Resets in-memory journal state only; direct key remains unless storage is separately cleared | Removed by current `AsyncStorage.clear()` in `deleteAccount()` | Direct `traits` key is not exported as its own surface; saved DailyEntry `traits` can appear inside selected DailyEntry export rows when present | repo-observed for direct read/repair and no direct write found; compatibility-owner label inferred | Do not treat direct traits key as independent trait history. Export inclusion of saved DailyEntry `traits` should be documented as entry-field behavior, not direct-key export. |
| Trait directory initial fallback | In-memory reducer initial state plus persisted journal slice | `state.journal.allTraits`; default from `traitsDirectory.traits` | `src/redux/reducer/journal.js`; `src/resources/traits.js` | Initial reducer state uses bundled `traitsDirectory.traits`; `TraitDirectory` reads `state.journal.allTraits` | No direct storage write by fallback itself; persisted Redux may store slice state after mutations | Reset with journal reducer initial state; full local clear removes persisted root | Initial app state and journal trait directory display | yes, while in app state | no | Not touched by logout | Resets to reducer initial state in memory | Persisted projection removed by AsyncStorage clear | Not exported as direct trait directory; DailyEntry selected traits may export as part of DailyEntry row data | repo-observed | Fallback is not restore/import/archive behavior. |
| Traits import/restore/archive | not repo-observed | not repo-observed | not repo-observed | no repo-observed path found | no repo-observed path found | no repo-observed path found | none found | no | no | no current interaction | no current interaction | no current interaction | no repo-observed direct traits import/restore/archive support | unknown absence claim | Route any uncertainty to follow-on tests/docs, not behavior change in this lane. |

## Export Flow and Workbook Boundary

Exported files are exported copies.

Exported files are user-managed once saved outside app-controlled storage.

Delete local data does not imply deletion of exported files.

Current export must not be described as full backup, automatic backup, cloud backup, or restore-capable backup unless live code proves that behavior.

| Surface name | Storage engine or file boundary | Key / namespace / output type | Current owner/helper/flow | Current read path | Current write path | Current clear/delete path | Lifecycle trigger | App-managed local data? | User-managed after export? | Logout interaction | `RESET_APP` interaction | Delete local data/current `deleteAccount()` interaction | Export/import relevance | Evidence status | Mismatch or follow-on notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Export screen and route | Settings screen flow | Route `SETTINGS_ROUTES.EXPORT_TO_CSV`; page/component path includes `Export To CSV`; visible Settings row is `Export journal data`; screen heading is `Export Journal Data` | Settings export journal data flow | Settings navigation opens `ExportToCSVWrapper`; component receives list data and current selected entry type | No app data write by route itself | No exported-file clear path | User opens Settings export journal data | no, route/control surface only | no | No effect | No effect | No effect by itself | Starts current one-way export flow | repo-observed | `ExportToCSV` and `Export To CSV` naming are CSV mismatch candidates because live implementation writes workbook files. |
| Workbook generation | Local file export outside app-managed storage | `.xlsx` workbook; MIME `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`; filename pattern includes `{entryType}-{hhmmss}.xlsx` when writing by path | `src/screens/setting/pages/Export To CSV/ExportToCSV.js` | Reads `state.journal.allJournalEntriesList`; filters one selected entry type; sorts by `createdOn`; builds rows with `Dated` and selected entry payload | `XLSX.utils.book_new()`, `XLSX.utils.json_to_sheet(entryData)`, `XLSX.utils.book_append_sheet(...)`, `XLSX.write(..., { bookType: 'xlsx' })` | No in-app delete path for exported workbook files repo-observed | User selects one entry type, grants storage permission if needed, chooses document tree, and taps export | no, after the exported copy is saved outside app-managed storage | yes | Not removed by logout | Not removed by `RESET_APP` | Not removed by current Delete local data/current `deleteAccount()` | Current export creates selected journal workbook output only; no repo-observed import/restore complement | repo-observed | Worksheet name is `Users`; that naming is implementation detail, not a full user/profile export claim. |
| File write boundary | User-selected document tree/path | External path or URI from `ScopedStorage.openDocumentTree(true)` | `RNFS.writeFile(...)` when `dir.path` exists; otherwise `ScopedStorage.writeFile(...)` | App does not repo-observe re-reading exported workbook after write | Writes workbook payload to selected external/user-managed destination | No in-app delete path for exported files found | Export action after destination selection | no, once outside app-managed storage | yes | Not removed by logout | Not removed by `RESET_APP` | Not removed by current full local clear; app clears AsyncStorage/MMKV, not exported file destinations | Exported copy is one-way current output | repo-observed | Destination may be copied, shared, uploaded, backed up, moved, retained, restored, or deleted by user/platform outside app lifecycle. |
| Exported journal rows | Exported workbook file content | Selected entry type only: `DailyEntry`, `WeightLog`, `CaloriesEntry`, `SupplementLog`, `WeeklyEntry`, or `QuarterlyEntry` | Export flow row filtering | Reads each item in `allJournalEntriesList`; if `item[entryType]` exists, adds `Dated` and that selected payload | Writes workbook rows for one selected entry type at a time | No app-managed clear/delete after export | User selection of entry type | Source data is app-managed before export; workbook copy is not app-managed after export | yes after export | Source data not touched by logout; exported copy not removed | Source in-memory data resets with `RESET_APP`; exported copy not removed | Source app-managed data cleared by full local clear; exported copy not removed | Exports selected journal rows only, not full app data | repo-observed | Direct `traits` key is not exported independently; saved DailyEntry `traits` may appear inside DailyEntry row payload when present. |
| Import/restore of exported files | not repo-observed | not repo-observed | not repo-observed | no repo-observed path found | no repo-observed path found | no repo-observed path found | none found | no | no current app ownership | no current interaction | no current interaction | no current interaction | No repo-observed import/restore support for exported workbook files | unknown absence claim | Do not describe current export as restore-capable backup. |

The current export output type is workbook / `.xlsx`. The current export includes selected journal entry-type rows from `allJournalEntriesList`; it does not repo-observe exporting all app data. Exported workbook files remain outside app-managed deletion after export. Delete local data/current `deleteAccount()` clears app-managed local data and does not delete exported workbook files. The app has no repo-observed import/restore path for those exported files.

## Clearing and Lifecycle Matrix

| Control | Required interpretation |
| --- | --- |
| Journal write/read | Current journal-domain lifecycle, repo-observed through `SET_JOURNAL_ENTRY`, `EDIT_JOURNAL_ENTRY`, `GET_JOURNAL_ENTRIES`, persisted `state.journal.allJournalEntriesList`, and selected `state.journal.allEntries`. |
| Traits read/repair | Compatibility/direct read lifecycle, repo-observed through `readStoredTraits()` reading `traits`, removing malformed/non-array values, and `GET_TRAITS` projecting into `journal.allTraits`. |
| Export | Creates an exported copy outside app-managed storage. |
| Logout | Scoped clear only if verified; current repo evidence shows scoped auth/profile/onboarding/password key removal plus `CLEAR_USER`, not full local data deletion and not exported-file deletion. |
| `RESET_APP` | In-memory Redux reset seam; not storage wipe by itself. |
| Delete local data/current `deleteAccount()` | Full local clear path for AsyncStorage plus MMKV clear/reseed as verified by live code: dispatches `RESET_APP`, calls `AsyncStorage.clear()`, calls `storage.clearAll()`, then calls `hydrateWorkoutPlans()`. |
| Import/restore | No repo-observed current journal import/restore control. |
| Archive | Not current behavior. |
| Backend/cloud/sync | No repo-observed current control. |

## Import, Restore, Backup, and Archive Boundary

Journal data is app-managed local data unless exported.

Exported files are external/user-managed copies after export.

No journal import/restore support should be claimed unless verified.

No archive behavior should be claimed.

No cloud backup/sync/deletion should be claimed.

No backend journal deletion should be claimed.

`backup` remains restricted and must not be used for current export unless paired with explicit limitation and approved in a later public-doc/copy lane.

The current export flow can create a sensitive exported copy of selected journal rows. It is not a full-app backup, automatic backup, cloud backup, device-transfer feature, account recovery feature, import system, restore system, or guaranteed recovery path.

## Current Mismatches and Follow-On Notes

- Visible `Export To CSV` / CSV wording is a mismatch candidate if live implementation writes workbook files. Live implementation writes `.xlsx` workbook files, while the route/component/path residue remains `ExportToCSV` / `Export To CSV` and older docs or release wording may mention CSV.
- Current export screen copy inspected says selected journal entries are exported as an Excel workbook (`.xlsx`); this truth check does not change any export screen copy.
- Exported-copy wording should replace backup-like wording in later copy/docs lanes, not this lane.
- Any uncertainty about whether traits are exported should be labeled and routed to follow-on tests/docs. Current evidence says the direct `traits` key is not exported independently; saved DailyEntry `traits` may appear as DailyEntry row data when present.
- No repo-observed import/restore complement belongs in future backup/export/import planning, not this lane.
- The journal delete marker `isDeleted` should not be promoted into archive behavior.
- Future Settings/export copy alignment belongs to `1.2.3.4.7`.
- Future regression tests belong to `1.2.3.4.8`.
- Public docs/README alignment belongs to `1.2.3.4.9`.
- This lane records mismatch candidates and follow-on notes only; it does not fix or approve them.

## Non-Claims

This lane does not claim:

- full-app backup
- automatic backup
- cloud backup
- cloud sync
- cloud deletion
- backend journal deletion
- journal import support
- journal restore support
- archive support
- deletion of exported files
- deletion of OS backups
- deletion of cloud-folder copies
- deletion of shared/uploaded files
- guaranteed recovery
- privacy policy readiness
- store disclosure readiness
- launch readiness
- legal review completion

This lane also does not approve source, test, copy, README/public doc, privacy, store, disclosure, storage, journal, export/import, restore, archive, deletion, backend, cloud, sync, backup, legal, or launch-readiness changes.

## Validation

Required validation:

```bash
git diff --check
```

Focused text checks:

```bash
rg -n "journal|traits|Export To CSV|CSV|xlsx|XLSX|exported copy|backup|restore|import|archive|journal_history_export_retention_truth_checked" docs/architecture/journal-history-export-retention-truth-check.md
```

Final status check:

```bash
git status --short --untracked-files=all
```

journal_history_export_retention_truth_checked
