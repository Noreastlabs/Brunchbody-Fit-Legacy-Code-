# AI Prompt Inventory

Status date: 2026-06-13

WBS lane: 1.7.7.1.1.1 Prompt inventory

## Scope

This is an audit-only inventory for the AI planning WBS track. It changes no runtime behavior.

## Current Finding

No confirmed AI runtime surface, model provider integration, prompt execution pipeline, context assembly code, or AI response UI was found in the current repo scan. Existing docs describe Brunch Body as local-first and public user docs explicitly avoid promising AI features or automated coaching.

## Searched Anchors

- `README.md`
- `docs/public/brunch-body-non-coder-onboarding.md`
- `docs/public/brunch-body-privacy-and-data.md`
- `docs/public/brunch-body-user-guide.md`
- `docs/architecture`
- `src/config`

## Current Prompt Inventory

| Area | Status | Notes |
| --- | --- | --- |
| Runtime prompt templates | Not present | No app-owned prompt execution code found. |
| Provider/model abstraction | Not present | No provider client or model config found in `src/config`. |
| Context assembly rules | Not present | No AI context builder found. |
| Response controls | Not present | No AI response UI or moderation gate found. |
| Evaluation fixtures | Not present | No AI eval fixture set found. |

## Required Future Gates

Before any AI implementation, create approved docs for role, use-case priority, data boundaries, consent, model/provider abstraction, safety policy, user controls, evaluation, and release gating.

## Acceptance

This lane is complete as an audit artifact. It supports the decision registry answer that AI remains planning-only until explicit owner approval.
