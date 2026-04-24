# Lane: 1.1.8.1 Refactor Guardrails

## Scope Lock

Lane `1.1.8.1` is docs-only and approves no source, test, package, lockfile, dependency, CI, privacy, disclosure, route, storage, reducer, selector, UX, AI, backend, desktop, or monetization changes.

This artifact defines guardrails for later Brunch Body Phase 1 cleanup and refactor lanes. It is present-state and process-focused only. It does not create enforcement automation, does not encode lane governance into runtime code, and does not authorize a broad rewrite.

Future refactor lanes must remain mobile-first, local-first/privacy-forward, bounded for Codex review, and minimal-diff unless a later lane explicitly reopens those assumptions.

## Refactor Classification Model

Use the narrowest classification that fits the proposed lane.

| Classification | Acceptable shape | Required posture |
| --- | --- | --- |
| Safe mechanical cleanup | Local edits such as removing unused imports, tightening naming, moving comments, or deleting unreachable code after evidence proves no behavior contract is affected. | Behavior-preserving, single surface, easy to review. |
| Boundary cleanup | Clarifies ownership between routes, screens, reducers, selectors, storage helpers, or shared components without changing the contract users or callers observe. | Must name the boundary, the owning domain, and the tests or evidence preserving the current contract. |
| Behavior-preserving extraction | Moves logic into a helper, selector, read model, component, or module while keeping inputs, outputs, persistence, navigation, and user-visible behavior the same. | Must include characterization coverage or an explicit reason existing coverage is sufficient. |
| Behavior-changing refactor | Changes runtime behavior, navigation behavior, persistence semantics, reset/delete/export behavior, user-facing copy, or UX flow while also cleaning structure. | Not a cleanup-only lane. It needs explicit product scope, tests, and acceptance criteria for the behavior change. |
| Policy/trust-affecting change | Touches privacy posture, disclosure language, local-first claims, store-facing claims, backup/deletion language, auth/account semantics, AI, backend, sync, monetization, or data handling. | Must be split into a trust/privacy lane unless the later lane explicitly reopens privacy and disclosure together. |
| Oversized refactor requiring split | Touches multiple domains, broad folders, multiple architectural boundaries, tooling, dependencies, or unclear acceptance criteria. | Stop before implementation and split into smaller lanes with separate validation. |

## Lane Sizing Rules

- Prefer one lane per domain, boundary, route family, reducer family, storage contract, or documentation artifact.
- State the allowed files or surfaces before implementation and treat every other surface as forbidden.
- Keep cleanup lanes behavior-preserving unless the lane is explicitly classified as behavior-changing.
- Do not bundle cleanup with feature work, UX redesign, dependency updates, CI changes, privacy edits, disclosure edits, AI work, backend work, desktop work, or monetization decisions.
- Keep diffs small enough that a reviewer can understand the current contract, the exact transformation, and the validation evidence in one pass.
- If the lane needs new assumptions after implementation starts, stop and document the assumption instead of widening the scope silently.

## Allowed And Forbidden Refactor Shapes

Allowed shapes for future refactor lanes, when explicitly scoped:

- Mechanical cleanup inside one named surface.
- Single-domain helper, selector, read-model, or component extraction that preserves current inputs, outputs, and side effects.
- Boundary clarification that makes current ownership easier to see without moving ownership.
- Test or documentation updates that characterize current behavior before a later implementation lane.
- Deletion of proven-dead code when the lane identifies the evidence and confirms no route, storage, privacy, or user-facing behavior depends on it.

Forbidden shapes for cleanup-only lanes:

- Repo-wide rewrites, broad folder rewrites, or opportunistic modernization.
- Route renames, route ownership moves, navigation behavior changes, or startup behavior changes.
- Reducer-key, selector-contract, thunk, persistence, hydration, reset, logout, delete, export, import, or storage-key semantic changes.
- Dependency, package, lockfile, build, lint, formatter, CI, or tooling changes.
- Privacy-policy, platform disclosure, store listing, backup/deletion language, local-first claim, AI, backend, cloud sync, desktop, or monetization changes.
- Hardcoded lane governance inside production app code.
- New enforcement scripts or automation unless a later lane explicitly approves that work.

## Route, State, And Storage Boundaries

Future refactor lanes must name any route, state, or storage boundary they touch and preserve the current contract unless the lane explicitly reopens it.

- Route work must preserve current route names, stack ownership, tab ownership, back behavior, startup behavior, and deep entry assumptions unless the lane is behavior-changing and scoped that way.
- State work must preserve reducer mount keys, public Redux entrypoints, selector outputs, action/thunk semantics, reset semantics, and screen-facing read contracts unless explicitly reopened.
- Storage work must preserve AsyncStorage/MMKV keys, persistence whitelist behavior, hydration behavior, logout behavior, delete/reset behavior, export/import semantics, and local-only assumptions unless explicitly reopened.
- Boundary cleanup should move toward clearer ownership without changing who owns persisted data, navigation paths, or trust-sensitive behavior.

## Privacy And Local-First Checks

Future refactor lanes must preserve local-first behavior unless a later lane explicitly reopens privacy and data handling.

Before claiming a refactor is safe, check whether it could affect:

- device-local data storage or offline operation
- auth/account language or behavior
- delete/reset/export/import behavior
- backup, sync, cloud, backend, or AI implications
- user-facing trust copy
- privacy policy, platform disclosure, or store-facing claims
- secret handling or local-only guardrails

Future lanes must not claim launch-readiness or disclosure alignment unless app behavior, docs, privacy language, backup/deletion language, and store/disclosure language are checked together.

## Testing And Validation Expectations

For source, test, config, package, CI, route, storage, reducer, selector, or UX lanes:

- Identify the existing characterization tests that protect the touched contract.
- Add focused tests when the current contract is not already covered.
- Prefer the existing project validation commands when relevant:
  - `yarn test`
  - `yarn lint`
  - `yarn run check:local-only`
  - `yarn run check:secrets`
- Explain any skipped command and why it is not relevant to the changed surface.

For docs-only lanes:

- Run `git diff --check`.
- Run `git status --short`.
- No tests are required unless source, test, package, config, CI, or executable files are changed.

## Decision-Log Expectations

Every future refactor lane should leave enough evidence for a reviewer to see why the work stayed bounded.

Include or preserve:

- the lane classification
- in-scope and out-of-scope surfaces
- the current behavior or contract being preserved
- validation commands and outcomes
- any known pre-existing worktree noise
- explicit follow-up lanes when work is deferred or split
- a short reason when a tempting cleanup is intentionally not included

Decision logs must not turn into product expansion, privacy reinterpretation, or launch-readiness claims. They should record what was decided, what was not decided, and what evidence supports the boundary.

## Stop And Split Triggers

Stop before implementation and split the lane if any of these appear:

- More than one product domain, route family, reducer family, or storage owner is touched.
- Route behavior, startup behavior, back behavior, or mounted navigation ownership would change.
- Persistence semantics, storage keys, hydration, reset, logout, delete, export, or import behavior would change.
- User-facing copy, trust language, privacy posture, disclosure language, or store-facing claims would change.
- AI, backend, cloud sync, desktop, monetization, account, or auth semantics enter the lane.
- Dependency, package, lockfile, build, lint, formatter, CI, or tooling changes are needed.
- A broad folder rewrite or repo-wide modernization becomes attractive.
- Tests are unclear, missing, too broad, or not tied to the touched contract.
- Acceptance criteria cannot be verified with a small, named validation set.
- The implementation needs new assumptions that were not in the lane scope.

## Reviewer Checklist

Reviewers should confirm:

- The lane classification is accurate and no narrower classification fits.
- The diff touches only the approved surfaces.
- The work is behavior-preserving unless the lane explicitly scopes behavior change.
- Route, state, storage, reset, delete, export/import, and persistence contracts are unchanged or explicitly reopened.
- Local-first behavior and privacy-forward posture are preserved.
- No hidden disclosure, launch-readiness, backend, AI, desktop, or monetization claim was introduced.
- Tests or validation match the changed surface.
- Skipped tests are justified.
- Any oversized or trust-sensitive work was stopped and split instead of absorbed.
- The final status is understood, including any pre-existing unrelated worktree noise.

## Codex Instruction Checklist

Codex should confirm before editing:

- This lane has one clear classification and one bounded goal.
- The allowed and forbidden surfaces are explicit.
- Existing repo evidence has been inspected before asking the user questions.
- Pre-existing user changes are preserved.
- No forbidden file or behavior surface is changed.
- The implementation stays minimal and reviewable.
- Validation is run according to the changed surface.
- The final response reports changed files, validation results, and any pre-existing status entries.
