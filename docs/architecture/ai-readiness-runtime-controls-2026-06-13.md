# AI Readiness Runtime Controls - 2026-06-13

## Current Position

Brunch Body has no enabled AI runtime in the current build. The readiness baseline in `src/config/aiReadiness.js` is intentionally disabled, has no provider, and does not allow hidden network transmission of local app data.

## Pipeline Baseline

Any future AI prompt and response flow must pass through these gates before implementation:

- User-initiated request.
- Local context selection review.
- Safety and privacy filter.
- Draft response review.
- User-visible disclosure.

## Runtime Resilience

The runtime must fail closed while local-only mode is active. If a provider becomes configured, network transmission becomes allowed, or hidden data sharing becomes possible, `assertAiRuntimeDisabled` must fail before release.

## Response Controls

Current controls require explicit user action, block hidden data sharing, block medical diagnosis positioning, and keep provider configuration off. User feedback is allowed only as user-managed feedback through existing support paths.

## Transparency UX

User-facing copy must say AI assistance is not enabled unless owner approval, disclosure updates, evaluation coverage, and release gates all change. Copy must not imply medical, nutrition, training, diagnosis, treatment, emergency, cloud, or automated coaching behavior.

## Prompt Change Management

Any prompt or response-control change requires a change ID, summary, reviewer, disclosure review, and evaluation refresh. Prompt text should not be added to runtime code until the owner gate approves a live AI surface.

## Evaluation and Red-Team Set

The initial evaluation set covers local-data boundaries, medical diagnosis boundaries, and medical nutrition-plan boundaries. Red-team cases cover hidden upload pressure, professional-advice pressure, and provider-toggle drift.

## Verification

- `__tests__/aiReadinessConfig.test.js`
- `node scripts/check-local-only-mode.js`
