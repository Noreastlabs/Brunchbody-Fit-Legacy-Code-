# Body Measurement Preference And Defaults Scope

## Classification

This is an internal architecture and product-policy scoping artifact for `Lane 1.3.1.2 Preference And Defaults`.

Classification: ready for scoping, not ready for relay.

This lane is documentation/product-policy scoping only. It must not implement behavior, migrate data, refactor code, verify runtime behavior, edit tests, or include a Codex relay marker. Completion is based only on whether the body measurement preference policy is documented and scoped clearly.

What changed: one internal architecture artifact only.

What users experience: no user-facing change.

Docs/disclosures required: no public docs, store disclosures, privacy policy text, release notes, or support copy are changed by this lane. Future implementation lanes that affect visible behavior, exports, storage, calculations, or disclosures must trigger their own review.

## Summary

Brunch Body will use one local, profile-level body measurement preference with two valid values:

- `standard`
- `metric`

The preference applies only to body/profile measurements. It does not create a global app unit enum and does not control nutrition units, supplement units, exercise-domain unit selectors, cloud sync, import, restore, backup, account continuity, or portability semantics.

## Ratified Product Policy

First relevant body measurement surfaces should use a visible inline Standard/Metric selector.

When no valid body measurement preference exists, any future implementation lane must resolve missing, invalid, or unsupported values locally to visible Standard behavior. Standard should appear selected wherever the body measurement preference control appears.

No locale inference, backend lookup, cloud lookup, account-continuity assumption, or off-device preference inference is approved by this lane.

Changing the preference affects body measurement display and future/default body input context only. It must not reinterpret saved historical values. Saved history keeps its original meaning.

Settings/Profile copy should concisely explain:

```text
This preference controls body measurement display and default input units. Saved history keeps its original meaning.
```

The copy must remain local-first and must not imply import, restore, backup, sync, account continuity, cloud storage, or portability support.

## In Scope

This scoping lane documents that the body measurement preference policy covers:

- height
- weight
- Weight Log display/input context
- dashboard body-weight display
- body-measurement calculation context
- body-measurement export context as a dependency only

This lane also documents the expected downstream policy:

- `standard` means feet/inches and pounds for body measurements.
- `metric` means centimeters and kilograms for body measurements.
- Missing, invalid, or unsupported body measurement preferences must resolve locally to visible Standard behavior in future implementation work.
- Metric affects body measurement display and future/default body input context only.
- Historical body measurement values must not be reinterpreted by a preference change.

## Out Of Scope

This lane does not approve or perform:

- source code or test changes
- runtime behavior verification
- canonical storage or conversion implementation
- profile migration or historical data rewrite
- nutrition, supplement, or exercise unit-model changes
- broad app-wide unit behavior
- locale-based defaults
- backend or cloud preference inference
- export formatting implementation
- import, restore, backup, sync, account continuity, cloud storage, or portability support

## Files And Surfaces

This lane may create or update this internal architecture artifact only.

Evidence references:

- `docs/architecture/unit-system-evidence-audit-and-model-contract.md`
- `src/screens/completeProfile/pages/completeProfile/CompleteProfile.js`
- `src/screens/setting/pages/MyProfile/MyVitals.js`
- `docs/architecture/body-measurement-export-unit-semantics.md`

These files are supporting context only. They are not edit targets for this lane.

Future implementation surfaces may include:

- onboarding/profile body inputs
- Weight Log
- dashboard weight display
- body calculations
- Settings/Profile copy
- body-measurement export labeling

Those surfaces require later scoped implementation lanes before any code, test, export, calculation, storage, or user-facing copy changes.

## Export Dependency Boundary

Body-measurement export labeling is a dependency, not an implementation task in this lane.

Future body-measurement export work should avoid unlabeled body measurement values and preserve unit clarity. This lane does not define export formatting, workbook schema, import support, restore behavior, backup behavior, sync behavior, account continuity, cloud storage, or portability support.

Export wording must stay aligned with the project product-truthfulness rule: app behavior, docs, privacy language, and disclosure language must not imply capabilities that do not exist.

## Acceptance Criteria

This scoping lane is complete when this artifact:

- records the ratified `standard` / `metric` body-only preference policy;
- states that missing, invalid, or unsupported body preferences resolve locally to visible Standard behavior in future implementation work;
- states that preference changes affect body display and future/default body input context, not saved historical meaning;
- explicitly lists nutrition units, supplement units, and exercise-domain unit selectors as out of scope;
- identifies body-measurement export labeling as a dependency;
- states that this lane does not define or imply import, restore, backup, sync, account continuity, cloud storage, or portability support;
- includes explicit non-goals and does not include a Codex relay.

This lane's acceptance is documentation-scoped. It does not require runtime validation or test execution.

## Future Review Expectations

Later implementation lanes should verify:

- visible Standard fallback for missing or unsupported preferences;
- metric display and future/default input behavior;
- saved-history protection after preference changes;
- body-only boundaries that do not affect nutrition, supplement, or exercise-specific unit selectors;
- local-first Settings/Profile copy;
- export unit clarity without portability overclaims.

Those checks belong to future implementation or review lanes, not this scoping lane.

## Risks And Notes

Primary risk: expanding body measurement preference into a global unit system. Guardrail: `standard` and `metric` are body-measurement preference values only.

Secondary risk: export wording implying portability features. Guardrail: export remains dependency-linked and must not imply import, restore, backup, sync, account continuity, cloud storage, or portability.

This lane does not reopen canonical storage/conversion details, detailed preference-change edge cases, export formatting, import/restore semantics, backup behavior, portability behavior, nutrition unit models, supplement unit models, or exercise-domain unit models.

## Non-Claims

This artifact does not claim or approve:

- implementation readiness
- source code changes
- test changes
- data migration
- runtime behavior verification
- canonical storage or conversion behavior
- app-wide unit settings
- per-field body unit preferences
- nutrition, supplement, or exercise-domain unit changes
- export formatting changes
- import, restore, backup, sync, account continuity, cloud storage, or portability behavior
- medical, clinical, diagnostic, treatment, prevention, or medical-grade precision claims
