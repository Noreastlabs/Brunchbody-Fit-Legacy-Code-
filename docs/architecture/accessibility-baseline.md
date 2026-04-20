# Lane 1.1.5.3: Accessibility Baseline

## 1. Title and lane framing

This artifact is a docs-only parent scoping lane for the Brunch Body Phase 1 mobile accessibility baseline.

Lane `1.1.5.3` is a parent scoping lane only.

No single repo-wide accessibility sweep is approved by this lane.

This lane is bounded to Phase 1 mobile launch-readiness planning for a local-first product. It does not approve a repo-wide accessibility rewrite, does not claim certification, and does not authorize broad UX redesign.

Current repo code and current live product surfaces are the source of truth for this lane. Older prose and earlier docs may support context, but they do not override repo-observed behavior.

## 2. Purpose

Accessibility baseline work is in scope for Phase 1 because the Brunch Body project scope already includes core product experience improvements, form UX and accessibility work, empty/loading/error states, onboarding improvements, dashboard or home clarity, and navigation or discoverability improvements. For this lane, those project-level goals are interpreted through current repo evidence rather than through older planning prose alone.

Current repo reads confirm that the app is organized around mobile navigation entry surfaces in `src/navigation/RootNavigation.js` and `src/navigation/BottomTabNavigation.js`, with primary flows mounted through onboarding or complete-profile entry, dashboard or home, journal, calendar, nutrition, recreation, settings, and tutorials surfaces. Current repo reads also confirm shared control and modal-heavy interaction patterns through components such as `Button`, `TextInput`, `CloseButton`, `PermissionModal`, `CustomModal`, `DatePickerModal`, `HeightPickerModal`, `TimePickerModal`, and screen-level `showMessage(...)` patterns. A targeted string scan used for this lane did not surface matches for common React Native accessibility props inside `src`, but that scan result is treated as bounded evidence for this lane only, not as a substitute for screen-by-screen audit or runtime assistive-technology validation.

Named repo examples in this lane are verification targets, not guaranteed findings. Any partially confirmed example should be recorded conservatively as `repo-observed`, `inferred`, or `unknown / needs audit`.

## 3. Why this is a parent scoping lane

This lane exists to define the bounded Phase 1 accessibility baseline and to seed narrower follow-on child lanes. It does not implement accessibility fixes, does not approve a single broad remediation pass, and does not treat all UI surfaces as equally urgent.

That parent-scoping posture is important because current repo evidence shows mixed ownership across shared controls, navigation shells, modals, form surfaces, and domain screens. A broad "improve accessibility everywhere" mandate would outrun the present evidence radius, widen scope, and make it easier to overstate readiness. This lane therefore freezes the baseline into reviewable categories and future child lanes rather than treating accessibility as one monolithic implementation task.

## 4. Phase 1 accessibility baseline definition

For this lane, the Phase 1 accessibility baseline means the minimum practical usability threshold for primary Brunch Body mobile flows at launch-readiness time. It is practical and launch-oriented rather than legalistic.

The Phase 1 baseline means:

- critical controls on primary flows are understandable and actionable
- key forms can be completed with understandable labels, helper text, and feedback
- critical states are not communicated by color alone
- primary navigation and modal flows are understandable and operable
- key flows remain reasonably usable under larger text settings
- critical actions are not unreasonably hard to tap on a mobile device
- loading, empty, error, and success states remain readable enough to support task completion on primary flows

This baseline is not a WCAG compliance claim, not a certification claim, and not a store-readiness certification claim. It is a bounded Phase 1 mobile baseline for a local-first product.

## 5. Baseline categories

Bucket placement in this section is a planning baseline for follow-on work, not a claim that each underlying issue has already been fully audited across all screens.

Absolute absence or presence claims should be made only when directly confirmed by the implementation scan used for this lane. Where evidence is partial, mixed, or not yet re-checked on live surfaces, the row should remain conservative.

### Must-fix baseline items

- `actionable control naming / understandable labels`
  Critical actions on primary flows should expose understandable visible text or equivalent understandable naming before Phase 1 launch sign-off. This is especially important where shared controls and navigation actions act as the user's primary task entry points.
- `icon-only action clarity`
  Icon-only or icon-led actions on critical flows should not depend on guesswork. `CloseButton` is a verified current example of an icon-only shared control, and similar actions should be treated as verification targets for child-lane work rather than assumed solved.
- `form labeling and helper text`
  High-frequency form entry surfaces should provide understandable field labels and enough helper context for completion. Current repo reads confirm form-heavy profile, nutrition, calendar, and journal entry flows, so these surfaces belong in the Phase 1 baseline.
- `validation and error-state clarity`
  Validation and error messages on key flows should be understandable and not require prior product knowledge to interpret. Current repo reads confirm `PermissionModal` and `showMessage(...)` usage across onboarding, calendar, journal, nutrition, recreation, and settings-related flows, which makes message clarity part of the baseline.
- `non-color-only communication for critical states`
  Critical success, error, destructive, and confirmation states should not rely only on color or border styling to communicate meaning.
- `readable loading / empty / error / success states`
  Primary flows should expose readable loading, empty, error, and success states that let the user understand what happened and what to do next.
- `navigation and modal usability expectations on primary flows`
  Primary navigation and modal entry surfaces should remain understandable and operable. Current repo reads confirm bottom-tab navigation, stack entry flow, and recurring modal usage, so navigation and modal usability are baseline items rather than optional polish.

### Should-fix but deferrable items

- `text scaling / dynamic type resilience on key flows`
  Text scaling resilience matters for Phase 1, but broader hardening beyond the most critical flows can remain sequenced after the first baseline audit. Current repo reads confirm responsive font sizing decisions such as the bottom-tab label size in `BottomTabNavigation.js`, but cross-surface resilience still needs more bounded evidence before stronger conclusions are made.
- `touch target / tappability concerns on critical actions`
  Critical tappability concerns should be addressed on main actions first, while broader touch-target polish across secondary surfaces may remain follow-on work if the baseline audit shows those issues are not blocking launch-critical flows.
- `secondary control consistency`
  Shared controls that are important but not on the highest-risk launch paths may be deferred into narrower child lanes once the critical flows are closed.
- `non-critical readability polish`
  Lower-priority contrast, spacing, or readability issues outside primary flows may be deferred if they do not block the Phase 1 launch baseline.

### Unknown / needs audit items

- `screen-by-screen assistive-technology behavior`
  This lane does not claim full runtime behavior for VoiceOver, TalkBack, focus order, or announcement behavior across the app. Those remain audit work.
- `exact modal focus and dismissal behavior`
  Current repo reads confirm recurring modal shells and modal content patterns, but they do not by themselves establish acceptable runtime focus handling or assistive-technology announcements.
- `full dynamic-type breakpoints across all domains`
  The current evidence radius confirms some sizing choices, but not the full behavior of every critical flow under large text or system scaling changes.
- `all icon-only and icon-led controls outside sampled shared surfaces`
  Verified examples such as `CloseButton` support the baseline concern, but the repo should not be treated as fully inventoried from this parent lane alone.
- `lower-frequency or secondary domain surfaces outside bounded reads`
  Priority flows are named below, but this parent lane does not claim every secondary or edge surface has already been audited.

## 6. Priority surfaces

The following surfaces are the conservative priority set for follow-on accessibility work because current repo structure or bounded reads already place them on launch-critical mobile paths:

- `onboarding / complete profile flows`
  `RootNavigation` mounts `CompleteProfile`, and bounded reads confirm step-based onboarding screens such as name, date of birth, height, weight, gender, and welcome flows.
- `settings and local-data-management surfaces`
  `BottomTabNavigation` mounts settings as a primary tab, and bounded reads confirm local-data-facing profile and settings surfaces such as `MyVitals`, export-related flows, and settings warning or confirmation modals.
- `home / dashboard / primary daily-use entry points`
  `BottomTabNavigation` mounts dashboard or home as a primary tab entry, making that surface part of the Phase 1 accessibility baseline even where deeper audit work remains follow-on.
- `navigation shell and modal entry points`
  Current repo reads confirm bottom tabs, root stack flow, and recurring `CustomModal`-based entry points across multiple domains. Those shells shape basic usability and should be prioritized.
- `shared controls like buttons, inputs, toggles, cards, and icon actions`
  Shared control reads confirm reusable surfaces such as `Button`, `TextInput`, `CloseButton`, and control-like touch targets used across primary flows. These are high-leverage audit and remediation targets.
- `form-heavy flows such as calendar, nutrition, and journal entry surfaces`
  Bounded screen reads confirm calendar, nutrition, and journal flows with repeated field entry, validation, modal selection, and status messaging patterns.

Where a priority surface is only partially confirmed by current lane evidence, it should remain a conservative planning target rather than a stronger claim about current implementation quality.

## 7. Out-of-scope / non-goals

This lane is planning-only. It does not include:

- runtime code changes
- tests
- config or dependency changes
- asset changes
- broad design-system migration
- tablet or desktop accessibility expansion
- backend, cloud, or sync work
- AI work
- disclosure or privacy posture changes
- legal or compliance claims
- broad visual redesign unrelated to the accessibility baseline

This lane also does not reopen privacy, deletion or reset, export or import, or disclosure semantics. It does not authorize a shared-UI migration wave, a cross-repo cleanup pass, or a general "improve accessibility everywhere" rewrite.

## 8. Delivery shape for follow-on child lanes

- `1.1.5.3.1 Accessibility audit rubric and evidence capture`
  Define the bounded audit checklist, evidence labels, and screen-sampling method for the Phase 1 baseline.
- `1.1.5.3.2 Shared control semantics and icon-action labeling`
  Focus on shared buttons, inputs, close actions, and other reusable control surfaces that influence multiple primary flows.
- `1.1.5.3.3 Form labeling, helper text, and validation baseline`
  Tighten the baseline for high-frequency form flows across onboarding, calendar, nutrition, journal, and settings-related entry.
- `1.1.5.3.4 Navigation, modal, and state-surface accessibility baseline`
  Address primary navigation shells, recurring modal entry patterns, and readable loading, empty, success, and error states.
- `1.1.5.3.5 Text scaling, contrast, and tappability follow-up`
  Validate and remediate larger-text resilience, critical tappability issues, and priority readability gaps that remain after the baseline audit.
- `1.1.5.3.6 Accessibility regression tests and closeout audit`
  Add the narrow regression and closeout validation needed after the bounded remediation lanes are complete.

## 9. Acceptance / validation notes

Acceptance for this parent lane is document quality and scoping completeness only. It is not implementation completion and it is not an accessibility sign-off for the full app.

Validation notes for this lane:

- current repo code and current live product surfaces are the source of truth
- older docs may support framing, but they do not override repo-observed behavior
- named repo examples in this lane are verification targets unless directly confirmed in the bounded evidence pass
- future child lanes should gather direct surface evidence before making stronger claims about implementation quality or runtime behavior
- this parent lane is complete when the scoping artifact is clear, bounded, and reviewable without widening into remediation work

## 10. Risks / notes

- the biggest scope risk is widening this lane into a repo-wide accessibility rewrite instead of keeping it as a parent scoping artifact
- the biggest truthfulness risk is overstating partial evidence as if the whole app has already been audited
- another risk is reading planning buckets as implemented fixes rather than as prioritization guidance for later lanes
- this lane should not reopen privacy, disclosure, deletion, export, import, or unrelated design questions
- older docs may be useful context, but letting them override present repo evidence would weaken the lane's evidence-first contract
