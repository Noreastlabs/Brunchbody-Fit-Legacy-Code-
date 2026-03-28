# Local Data Validation Report

## Scope

Validation targets requested for local-first data behaviors:
- Platform matrix: Android / iOS
- Install state: fresh install / update install
- Network state: offline / online
- Local entities: profile, calendar themes, routines/workouts, meals/supplements, todos, exercises
- Persistence mechanisms: redux-persist + AsyncStorage + MMKV hydration
- Edge areas: malformed profile values, empty datasets, deletion flows, migration boundaries

Date executed: 2026-03-27 (UTC).

## Test Matrix

| ID | Platform | Install State | Network | Focus | Status | Notes |
|---|---|---|---|---|---|---|
| M1 | Android | Fresh install | Offline | CRUD + persistence + hydration | ⚠️ Blocked (device runtime not available) | Covered reducer/hydration logic via Jest simulation. |
| M2 | Android | Fresh install | Online | CRUD + persistence + hydration | ⚠️ Blocked (device runtime not available) | Covered reducer/hydration logic via Jest simulation. |
| M3 | Android | Update install | Offline | Migration boundary + persistence | ⚠️ Blocked (device runtime not available) | No explicit redux-persist migration/version config found. |
| M4 | Android | Update install | Online | Migration boundary + persistence | ⚠️ Blocked (device runtime not available) | No explicit redux-persist migration/version config found. |
| M5 | iOS | Fresh install | Offline | CRUD + persistence + hydration | ⚠️ Blocked (device runtime not available) | Covered reducer/hydration logic via Jest simulation. |
| M6 | iOS | Fresh install | Online | CRUD + persistence + hydration | ⚠️ Blocked (device runtime not available) | Covered reducer/hydration logic via Jest simulation. |
| M7 | iOS | Update install | Offline | Migration boundary + persistence | ⚠️ Blocked (device runtime not available) | No explicit redux-persist migration/version config found. |
| M8 | iOS | Update install | Online | Migration boundary + persistence | ⚠️ Blocked (device runtime not available) | No explicit redux-persist migration/version config found. |

## Automated Validation Coverage (Executed)

`__tests__/localDataValidation.test.js` validates:
1. CRUD workflows for profile, calendar themes, routines/workouts, meals/supplements, todos, exercises.
2. Profile reducer behavior for valid-shape action and malformed inputs.
3. Simulated persistence reload behavior through GET actions (redux state repopulation model).
4. MMKV hydration idempotence: seed only on first initialize.
5. Upgrade-readability simulation: legacy persisted payloads remain readable after candidate reducer replay.
6. Empty dataset and deletion-with-missing-id edge behavior.

## Defect Log and Release Classification

| Defect ID | Area | Severity | Release Class | Evidence |
|---|---|---|---|---|
| D-001 | Profile parsing | High | **Release blocker** | Malformed profile fields can lead to `bmi: "NaN"` and `bmr: "NaN"`, which can propagate to UI and calculations. |
| D-002 | Update migration boundary | High | **Release blocker** | No explicit redux-persist migration/versioning strategy in store config; schema evolution may silently drop or mismatch state on app updates. |
| D-003 | Device-matrix runtime validation gap | Medium | Post-release (must complete before GA if mobile QA policy requires it) | Android/iOS runtime matrix (offline/online + fresh/update) not executable in this CI container. |

## Recommended Exit Criteria Before Release

1. Add profile input sanitization and numeric guards before BMI/BMR calculations.
2. Introduce `persistConfig.version` + migration map and test at least N-1 to N update path.
3. Execute full matrix M1..M8 on physical or emulated devices and attach evidence (video/logs).
4. Keep automated reducer/hydration tests as a release gate.
