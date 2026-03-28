# CRUD + Persistence QA Report

Date: 2026-03-28
Scope: profile, calendar themes, workouts/routines, meals/supplements, todos, exercises, MMKV hydration, upgrade persistence.

## Test execution
- Command: `yarn test __tests__/localDataValidation.test.js --runInBand`
- Result: PASS (12/12)

## Coverage mapping

### 1) CRUD + restart persistence for core domains
- **Profile**
  - `profile` action persists user data, merges updates, and `loggedIn` reloads saved data on relaunch.
  - `loggedIn` no-data flow returns `goToCompleteProfile`.
- **Calendar themes**
  - add/edit/delete lifecycle validated in reducer.
  - reload path validated via `GET_THEMES`.
- **Workouts / routines**
  - add/edit/delete workflow validated for workout and routine item chains.
  - reload path validated via `GET_WORKOUTS` and `GET_ROUTINES`.
- **Meals / supplements**
  - add/edit/delete workflow validated for meals + meal items and supplements + supplement items.
  - reload path validated via `GET_MEALS` and `GET_SUPPLEMENTS`.
- **Todos**
  - add/edit/delete lifecycle validated.
  - reload path validated via `GET_TODO_TASKS`.
- **Exercises**
  - merge/add/edit/delete lifecycle validated.
  - reload path validated via `GET_EXERCISES`.

### 2) MMKV hydration behavior from `src/storage/mmkv/hydration.js`
- First launch (`IS_INITIALIZED=false`): seed plans are written and initialization flag is set.
- Subsequent launch (`IS_INITIALIZED=true`): seeding is skipped and no writes occur.

### 3) Update path (old build → update → existing data intact)
- Simulated upgrade payload from an "old build" was reloaded into all domains using current reducer/action ingestion paths.
- Existing persisted entities remain readable after "update + relaunch" simulation.

## Defect log

### Post-release items
1. **AUTH-001: malformed profile input produces `NaN` BMI/BMR values**
   - Area: Profile calculations (`authReducer` / `SET_USER`).
   - Repro: provide malformed `height`, `weight`, or `dob` values.
   - Current behavior: user object stores `'NaN'` for `bmi` and `bmr`.
   - Impact: degraded profile metric quality; no crash observed.
   - Recommendation: add input validation + fallback defaults before BMI/BMR computation.

### Release blockers
- **None identified** from this automated reducer/action persistence test scope.
