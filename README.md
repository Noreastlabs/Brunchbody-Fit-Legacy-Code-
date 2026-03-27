# brunch-body-clone

A React Native application for tracking and visualizing brunch-related fitness data. This clone is streamlined: authentication and local onboarding have been removed for a smoother developer experience.

## Project Overview

The project demonstrates a mobile interface with charts, scheduling tools, and state management using Redux. Without authentication or onboarding flows, developers can jump directly into exploring features and adding new ones.

## App Mode

The app now has a central runtime mode config at `src/config/appMode.js`.

- `LOCAL_ONLY` (default): all Redux actions operate only on local state/storage paths.
- `REMOTE_SYNC`: reserved for future backend reintroduction.

Current status: all previously commented `api/user/...` request blocks in `src/redux/actions/*` were removed permanently and **not** re-enabled in this branch. Remote sync is intentionally deferred until a complete backend contract is reintroduced.

## Local Data Architecture

The app is local-first and persists domain data in two places:

### 1) Redux Persist (`AsyncStorage`, key = `root`)

Redux slices are persisted via `redux-persist` in `src/redux/store/store.js`.

| Domain | Slice | Typical Data |
| --- | --- | --- |
| Profile / user | `auth` | `user_profile`-derived user object |
| Recreation | `recreation` | routines, routine items, custom plans, workouts, completed workouts |
| Journal | `journal` | day entries, derived dashboard values |
| Nutrition | `nutrition` | meals, meal items, supplements, supplement items, directories |
| Calendar | `calendar` | themes, repeated themes, calendar frequency state |
| Exercise | `exercise` | exercises and merged exercise data |
| Todo | `todo` | todo tasks |

### 2) Direct local storage reads

Some actions also read bootstrap data directly from local storage:

- `AsyncStorage`: `todos`, `themes`, `meals`, `supplements`, `meal_categories`, `meals_directory`, `exercise_directory`, `routines`, `workouts`, `traits`, `user_profile`.
- `MMKV`: `plans_brunch_body` via `STORAGE_KEYS.PLANS.BRUNCH_BODY` for Brunch Body plans.

## Migration Notes (future backend reintroduction)

To preserve compatibility with existing local users when backend sync returns:

1. **Keep local schema stable first**
   - Treat current persisted shapes as canonical v1.
   - Introduce explicit schema versioning before changing any object structure.

2. **Add non-destructive hydration/migration**
   - On first backend-enabled launch, import local Redux/AsyncStorage/MMKV data into memory.
   - Merge server data by deterministic keys (`id` where available) without deleting local-only entries.

3. **Stage sync behind `APP_MODE`**
   - Add API clients only under `REMOTE_SYNC` code paths.
   - Keep `LOCAL_ONLY` logic as a guaranteed fallback until parity is proven.

4. **Dual-write transition window**
   - Temporarily write to both local store and backend when remote mode is enabled.
   - Mark records with sync metadata (`syncedAt`, `source`, conflict marker) to aid reconciliation.

5. **Conflict resolution policy**
   - Define per-domain strategy (e.g., last-write-wins for simple fields, merge lists by stable item id for meals/workouts/routines).
   - Never overwrite unknown local fields from server payloads.

6. **Rollback safety**
   - If backend fails, continue reading/writing local data with no data loss.
   - Keep migration idempotent so retries are safe.

## Setup

### Requirements

- Node.js >= 18
- Yarn package manager

### Installation

1. Install dependencies:
   ```bash
   yarn install
   ```
2. Start the Metro bundler:
   ```bash
   yarn start
   ```
3. Run on a platform of your choice:
   ```bash
   yarn android # or yarn ios
   ```

No authentication or local onboarding steps are required; the application launches directly to the main interface.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our process. Note that the project intentionally omits authentication and local onboarding features, so new contributions should respect this simplified setup.

## License

This project is licensed under the [MIT License](LICENSE).
