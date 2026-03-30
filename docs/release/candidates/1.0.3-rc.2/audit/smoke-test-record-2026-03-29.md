# RC2 Smoke Test Record — 2026-03-29 (UTC)

Environment: local automated test runner on macOS workstation  
Runtime limitation: no Android release toolchain (`java` missing) and no full Xcode install selected for archive builds

## Evidence source

- Command: `yarn test --watch=false`
- Result: **PASS** (`22/22`)
- Archived log: `docs/release/candidates/1.0.3-rc.2/audit/scan-outputs/yarn-test-2026-03-29.txt`

## Scenario record

| Scenario | Evidence | Status | Notes |
| --- | --- | --- | --- |
| Fresh install launches to `CompleteProfile` | `loggedIn` returns `goToCompleteProfile` when no persisted `user_profile` exists (`__tests__/localDataValidation.test.js`) | PASS | Automated state/routing validation |
| Existing profile launches to `Home` path | `profile` + `loggedIn` persisted-user flow (`__tests__/localDataValidation.test.js`) | PASS | Automated persistence/routing validation |
| Logout returns to `CompleteProfile` | `__tests__/accountFlows.test.js` | PASS | Root navigator reset asserted |
| Local email change persists across relaunch | `__tests__/accountFlows.test.js` | PASS | `changeEmail` + `loggedIn` relaunch path asserted |
| Local password change behaves device-locally | `__tests__/accountFlows.test.js` | PASS | Stores `local_password` only |
| Local password reset behaves device-locally | `__tests__/accountFlows.test.js` | PASS | Clears `local_password` and stores reset marker only |
| Delete-account clears local state and returns to `CompleteProfile` | `__tests__/accountFlows.test.js` | PASS | `RESET_APP`, storage clear, and navigator reset asserted |
| Export-to-CSV entry remains available in Settings | `__tests__/accountFlows.test.js` | PASS | `ExportToCSV` route exposure asserted |

## Residual runtime gap

- Android signed-install smoke: **BLOCKED** in this environment
- iOS signed-install smoke: **BLOCKED** in this environment

Reason: signed build toolchains are not available on this machine. Device/simulator install smoke must still be executed on signing-capable Android and macOS/Xcode environments before final public release approval.
