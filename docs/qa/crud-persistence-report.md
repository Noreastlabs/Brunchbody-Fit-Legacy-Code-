# CRUD + Persistence QA Report

Date: 2026-03-28
Scope: profile, calendar themes, routines/workouts, exercises, meals/supplements, todos, MMKV hydration (`src/storage/mmkv/hydration.js`), and offline safety.

## Test execution
- Command: `yarn test __tests__/localDataValidation.test.js --runInBand`
  - Result: PASS (12/12)
- Command: `HTTP_PROXY=http://127.0.0.1:9 HTTPS_PROXY=http://127.0.0.1:9 ALL_PROXY=socks5://127.0.0.1:9 yarn test __tests__/localDataValidation.test.js --runInBand`
  - Result: PASS (12/12) with outbound network paths effectively blocked via invalid proxy endpoints.
- Command: `yarn check:local-only`
  - Result: PASS (no Firebase/AWS imports or `api/user/` references in `src/` while LOCAL_ONLY mode is enabled).

## Pass/Fail Matrix

| Area | First launch | Relaunch / restart persistence | Network disabled | Status | Blocking? |
|---|---|---|---|---|---|
| Profile CRUD + persisted reload | PASS (`profile` + `loggedIn` path) | PASS (merged profile remains after relaunch simulation) | PASS | PASS | No |
| Calendar themes CRUD + reload | N/A | PASS (`GET_THEMES`) | PASS | PASS | No |
| Routines/workouts CRUD + reload | N/A | PASS (`GET_WORKOUTS`, `GET_ROUTINES`) | PASS | PASS | No |
| Exercises CRUD + reload | N/A | PASS (`GET_EXERCISES`) | PASS | PASS | No |
| Meals/supplements CRUD + reload | N/A | PASS (`GET_MEALS`, `GET_SUPPLEMENTS`) | PASS | PASS | No |
| Todos CRUD + reload | N/A | PASS (`GET_TODO_TASKS`) | PASS | PASS | No |
| MMKV hydration (`src/storage/mmkv/hydration.js`) | PASS (`IS_INITIALIZED=false` seeds + sets init flag) | PASS (`IS_INITIALIZED=true` skips seed writes) | PASS | PASS | No |
| Hidden backend dependency check | N/A | N/A | PASS (`check:local-only` scan + offline test pass) | PASS | No |

## MMKV hydration verification details
- **First launch path**: with `storage.getBoolean(STORAGE_KEYS.IS_INITIALIZED)` mocked to `false`, `hydrateWorkoutPlans()` writes seed plans and sets `IS_INITIALIZED=true`.
- **Relaunch path**: with the same key mocked `true`, `hydrateWorkoutPlans()` performs no writes.

## Defect log

### Non-blocking issue observed
1. **AUTH-001: malformed profile input produces `NaN` BMI/BMR values**
   - Area: Profile calculations (`authReducer` / `SET_USER`).
   - Repro: provide malformed `height`, `weight`, or `dob` values.
   - Current behavior: user object stores `'NaN'` for `bmi` and `bmr`.
   - Impact: degraded profile metric quality; no crash observed in this scope.
   - Recommendation: add input validation + fallback defaults before BMI/BMR computation.

## Release gate decision
- **Release-blocking defects (data-loss or crash): NONE detected in this test scope.**
- **Gate result: PASS.**
- Policy used: any data-loss or crash defect would set gate result to **BLOCKED**.


## Blocker policy note
- Critical-defect gate is enforced via `docs/qa/blocker-report-2026-03-28.md`.
- Release promotion must remain blocked whenever any P0/P1 defect is open.
