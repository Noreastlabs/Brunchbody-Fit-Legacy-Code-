# Lane: 1.1.5.2.8 Tables / Tabs / Helper Ownership Audit

## Summary

This artifact audits the current ownership state of the remaining tables, tabs, and helper surfaces still exported through `src/components/index.js`. It is present-state, docs-only, and descriptive-first. It does not move components, rewrite imports, change barrels, or prescribe implementation work.

The current shared barrel holds a genuinely mixed cluster: several helper-like surfaces remain prop-driven and structurally generic, while the three table surfaces already encode domain data contracts directly. The purpose of this audit is to record that current state conservatively so later cleanup can stay bounded and evidence-first.

## Scope and method

- Fixed inventory surface: `src/components/index.js`
- Target evidence surfaces: `src/components/TopTabs/TopTabs.js`, `src/components/CustomTopTabs/CustomTopTabs.js`, `src/components/SearchBar/SearchBar.js`, `src/components/CustomOptions/CustomOptions.js`, `src/components/SelectComp/SelectComp.js`, `src/components/CustomSlider/CustomSlider.js`, `src/components/Dashed/Dashed.js`, `src/components/CustomTable/CustomTable.js`, `src/components/WeeklyTable/WeeklyTable.js`, and `src/components/ProgramTable/ProgramTable.js`
- Bounded consumer spot-check surface: `src/screens/**` only when the file body alone would otherwise overclaim ownership
- Current repo code is authoritative for this audit; older docs are not

Audit rules used here:

- The fixed 10-row inventory from `src/components/index.js` is mandatory and is covered exactly once.
- File-body semantics are the primary ownership signal.
- Bounded consumer spot-checks are used to confirm or downgrade a row, not to prove shared ownership by export location alone.
- If evidence is mixed or thin, the row is downgraded to `inferred` or `unknown / needs follow-on` rather than forced into a stronger claim.
- Helper-like structure is not enough, by itself, to prove settled shared ownership.
- Table rows can be classified as domain-coupled when their current file bodies already encode domain-specific data shapes directly.

## Closed vocabularies

Ownership classification:

- `shared tab/helper surface`
- `shared helper surface`
- `domain-coupled table surface`
- `unknown / needs follow-on`

Evidence label:

- `repo-observed`
- `inferred`
- `unknown / needs follow-on`

Disposition:

- `keep shared`
- `likely repatriate`
- `unknown / needs follow-on`

## Current ownership register

| Component | Current export surface | Ownership classification | Evidence label | Short rationale | Disposition |
| --- | --- | --- | --- | --- | --- |
| TopTabs | `src/components/index.js -> ./TopTabs` | `shared tab/helper surface` | `inferred` | The file is only a pressable child wrapper around supplied content, but bounded screen checks currently confirm recreation and nutrition consumers rather than a broader shared footprint. | `unknown / needs follow-on` |
| CustomTopTabs | `src/components/index.js -> ./CustomTopTabs` | `shared tab/helper surface` | `inferred` | The file is a generic horizontal tab strip driven by `data`, `selectedTab`, and `setSelectedTab`, but bounded screen checks currently confirm dashboard usage only. | `unknown / needs follow-on` |
| SearchBar | `src/components/index.js -> ./SearchBar` | `shared helper surface` | `repo-observed` | The component is a generic search input with a clear affordance, and bounded screen checks confirm reuse in both journal and nutrition list or directory flows. | `keep shared` |
| CustomOptions | `src/components/index.js -> ./CustomOptions` | `shared helper surface` | `repo-observed` | The file renders generic selectable option chips with an optional remove affordance, and bounded screen checks confirm journal and nutrition consumers. | `keep shared` |
| SelectComp | `src/components/index.js -> ./SelectComp` | `shared helper surface` | `repo-observed` | The component is a generic labeled picker trigger, and bounded screen checks confirm current nutrition and recreation consumers. | `keep shared` |
| CustomSlider | `src/components/index.js -> ./CustomSlider` | `shared helper surface` | `inferred` | The file is prop-driven, but it hard-codes a 1-100 percent slider contract and the bounded screen check only confirmed a nutrition macro-ratio consumer. | `unknown / needs follow-on` |
| Dashed | `src/components/index.js -> ./Dashed` | `shared helper surface` | `repo-observed` | The file is a thin dashed divider helper with no domain labels, and bounded screen checks confirm use across writing, nutrition, and journal surfaces. | `keep shared` |
| CustomTable | `src/components/index.js -> ./CustomTable` | `domain-coupled table surface` | `repo-observed` | The file hard-codes FAT, PRT, CHO, and CAL columns plus an alternate qty and unit mode, so its present contract remains nutrition-shaped even when reused outside nutrition. | `likely repatriate` |
| WeeklyTable | `src/components/index.js -> ./WeeklyTable` | `domain-coupled table surface` | `repo-observed` | The file renders a week and day workout-plan summary, inspects `plan` data per day, and computes a `Cals Out` total from exercise and superset entries. | `likely repatriate` |
| ProgramTable | `src/components/index.js -> ./ProgramTable` | `domain-coupled table surface` | `repo-observed` | The file renders exercise, set, RTD, and calorie rows, handles superset option groups, and includes an editable note surface, which makes the contract workout-program specific. | `likely repatriate` |

## Ownership findings

- The strongest current shared-helper rows are `SearchBar`, `CustomOptions`, `SelectComp`, and `Dashed`. Their file bodies stay generic, and bounded screen checks confirmed reuse across more than one feature domain.
- `TopTabs`, `CustomTopTabs`, and `CustomSlider` remain helper-like by structure, but the audit should not overstate their ownership. Their current file bodies are generic or semi-generic, while the observed screen consumers remain comparatively narrow, so the conservative outcome is to leave them unresolved for now.
- `CustomTable`, `WeeklyTable`, and `ProgramTable` are not just shared-looking display helpers. Their current file bodies already encode nutrition or recreation data contracts directly, so the root shared barrel location does not establish clean shared ownership.
- The remaining cluster is therefore mixed in a meaningful way: helper-like surfaces still need a narrower shared-helper decision, while the table surfaces need domain-ownership decisions rather than another broad shared-components cleanup pass.

## Follow-on lane seeds

- `shared tab/helper cleanup`
- `shared search/select/helper cleanup`
- `nutrition-table ownership decision`
- `recreation-table ownership decision`
- `custom textarea/helper follow-on audit`
