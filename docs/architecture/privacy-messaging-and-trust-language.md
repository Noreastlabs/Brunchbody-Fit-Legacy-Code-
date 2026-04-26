# Privacy Messaging And Trust Language

This is internal Brunch Body guidance for privacy, trust, and data-handling language. It is not a legal privacy policy, not legal advice, not a store submission, not a behavior change, and not a substitute for verifying live app behavior in the build being described.

Use this document to keep future app copy, public docs, onboarding text, settings text, backup/export/delete wording, and store/disclosure work truthful, calm, local-first, and aligned with observed behavior.

## Purpose

Brunch Body handles personal fitness, nutrition, journal, profile, calendar, planning, and reflection information. Future language should help users understand the current app posture without overstating privacy, backup, deletion, medical, cloud, account, analytics, or platform behavior.

The goal is to make trust-sensitive wording:

- grounded in repo-observed behavior and current docs
- clear about what is current behavior, what is guidance, and what needs future verification
- careful with sensitive personal data
- conservative about backup, restore, deletion, export, and device-change expectations
- aligned across app copy, public docs, onboarding, support, and future store/disclosure work

## Scope

This guidance applies to future lanes that touch:

- in-app privacy, data, settings, onboarding, help, delete/reset, backup, export, import, or restore copy
- public user guides, onboarding guides, privacy/data explainers, support docs, or release-facing docs
- store descriptions, platform privacy disclosures, review notes, or data-safety answers
- internal docs that describe current user-visible behavior or data handling

This document does not authorize changes to app behavior, storage behavior, deletion behavior, backup/export behavior, privacy posture, privacy policy text, store submissions, legal terms, medical claims, AI behavior, analytics behavior, cloud sync, backend accounts, or platform integrations.

## Source of Truth

Use this source-of-truth order for trust-sensitive claims:

1. Live app behavior in the build being described.
2. Current source code and tests.
3. Architecture docs and storage inventories.
4. Current public docs.
5. Roadmap or future intent.

Current grounding from the repo and docs:

- The current runtime mode enables local-only storage paths.
- The current app uses local storage surfaces including redux-persist backed by AsyncStorage, direct AsyncStorage keys, and an MMKV sidecar for bundled workout-plan data.
- Current docs describe the app as local-first and device-local in cautious language.
- Current public docs and in-app privacy/data copy say the app does not automatically sync data to a Brunch Body cloud account.
- The current observed export flow is selected journal data exported as an Excel workbook file (`.xlsx`), not a full backup, import, or restore system.
- Delete/reset language must distinguish local app-managed data from exported files, copied files, shared files, operating-system backups, device-transfer behavior, and storage locations outside the app.

If a future lane cannot verify behavior, write it as `Needs verification` or future disclosure work, not as a product claim.

## Core Trust Principles

- Be specific about evidence. Say "current observed behavior" or "based on current project evidence" when language depends on the current repo/build.
- Keep local-first language calm and bounded. Do not turn a current local-first posture into a permanent guarantee.
- Treat fitness, nutrition, profile, journal, body, routine, calendar, planning, and reflection data as sensitive.
- Do not imply that local data is risk-free. Device access, exported files, shared files, platform backups, and external storage locations can matter.
- Separate current behavior from future disclosure work. Store/privacy wording must be verified against the shipped build before public use.
- Prefer plain English over legal-style drafting. This guidance should help product and docs lanes stay accurate; it is not legal policy language.

## Approved Language Patterns

Use these patterns when they match verified behavior:

| Situation | Acceptable pattern |
| --- | --- |
| Current local-first posture | "Based on current observed behavior, Brunch Body appears to store working app data in local app storage on the device." |
| No verified cloud sync | "The current app does not automatically sync Brunch Body app data to a Brunch Body cloud account." |
| Sensitive data | "Fitness, nutrition, journal, profile, and planning information can be sensitive, even when stored locally." |
| Export responsibility | "After export, the file is outside Brunch Body's normal app-managed storage, so the user is responsible for where it is saved, copied, shared, uploaded, or deleted." |
| Backup limitation | "The current export flow is not a full backup or restore system." |
| Unknown platform backup behavior | "Needs verification: confirm how operating-system backup or device-transfer tools handle app data for the release build." |
| Future disclosure alignment | "Before public privacy, support, or store language is finalized, verify the shipped app behavior and align all disclosure surfaces." |

Good examples:

- "Brunch Body is local-first in the current app."
- "Your working app data appears to live in local app storage on this device."
- "Selected journal data can be exported as an Excel workbook file (`.xlsx`)."
- "Delete local data does not remove files already exported, copied, shared, uploaded, or saved outside the app."
- "If behavior changes in a future release, privacy, support, and store language must be reviewed again."

## Language to Avoid

Avoid wording that sounds broader, more permanent, or more certified than the evidence supports.

Do not say:

- "Your data never leaves your device."
- "Your data is always private."
- "Everything is encrypted."
- "Brunch Body is HIPAA compliant."
- "Brunch Body provides secure cloud backup."
- "Your data is automatically backed up and restored."
- "Delete removes all copies of your data everywhere."
- "Export creates a full backup."
- "Exported files can be restored into the app."
- "Brunch Body syncs across devices."
- "Brunch Body stores your data anonymously."
- "Brunch Body does not use analytics or telemetry" unless the shipped build and disclosures have been verified.
- "Brunch Body uses AI to coach you" unless a future AI lane implements and discloses that behavior.
- "Brunch Body integrates with Apple Health or Google Fit" unless the shipped build and platform disclosures verify that integration.
- "Brunch Body gives medical, nutrition, diagnosis, treatment, or clinical advice."

If stronger wording is desired, stop and create a verification or disclosure lane rather than making the claim.

## Sensitive Data Wording

Describe user-entered and app-generated data as personal and potentially sensitive. Avoid alarmist wording, but do not minimize the data.

Acceptable wording:

- "Fitness, nutrition, journal, profile, body, calendar, planning, and reflection information can reveal personal routines, habits, goals, or health-related patterns."
- "Use test data if you are testing and do not want to enter real personal details."
- "Exported files may contain sensitive personal information depending on what the user chooses to export."

Avoid wording:

- "This data is harmless because it stays local."
- "This is not sensitive information."
- "Users do not need to think about privacy unless they sync or share."

## Local-First / On-Device Wording

Local-first language should describe current observed behavior, not future guarantees.

Acceptable wording:

- "Brunch Body is local-first in the current app."
- "Based on current project evidence, the app's working data appears to be stored in app-managed storage on the device."
- "Current repo evidence shows local storage surfaces such as AsyncStorage, redux-persist, and MMKV-backed bundled-plan data."
- "The current app does not automatically sync Brunch Body app data to a Brunch Body cloud account."

Avoid wording:

- "All data stays on device forever."
- "No data can ever leave the device."
- "There is no third-party access risk."
- "Local-first means no backup, export, platform, file, or device-transfer risk."

When writing for public or store-facing use, verify the live build first. Permissions, exported files, platform backups, system file pickers, third-party libraries, analytics, platform disclosures, and future integrations may change the correct wording.

## Delete / Reset / Backup / Export / Restore Wording

Use narrow terms for each behavior. Do not collapse delete, reset, logout, uninstall, backup, export, import, restore, and device transfer into one broad promise.

Current guidance:

- "Delete local data" should mean saved Brunch Body data removed from the current device's app-managed storage only when that matches the current build.
- Do not describe delete/reset as secure deletion, forensic deletion, deletion from OS backups, deletion from device-transfer tools, or deletion of exported files.
- Exported files should be described as outside normal app-managed storage after export.
- Current export wording should say selected journal data and Excel workbook file (`.xlsx`) when describing the observed flow.
- Current export wording should not call export a full backup.
- Current wording should not claim import, restore, automatic cloud backup, account recovery, or cross-device recovery unless a future lane implements and verifies those features.
- Bundled starter or workout-plan data may be re-seeded after local clear if that remains the observed build behavior; describe that as bundled app content, not retained user data.

Acceptable wording:

- "The current export flow creates an `.xlsx` file for selected journal data."
- "The current app does not provide a verified full backup, import, or restore flow."
- "If app storage is cleared, the app is uninstalled, the device is lost, or the user changes devices, local app data may not follow automatically."
- "Operating-system backups and device-transfer tools may have their own behavior; verify this for the release build before making public claims."

Avoid wording:

- "Delete removes every copy."
- "Reset is the same as account deletion."
- "Logout, reset, delete, and uninstall all have the same privacy effect."
- "Export backs up all Brunch Body data."
- "The app can restore exported files."
- "Cloud backup protects your data."

## Non-Medical Wording

Brunch Body may be described as a personal organization, tracking, journaling, planning, fitness, and nutrition support tool when supported by current behavior. Do not describe it as medical, clinical, diagnostic, treatment, prevention, or professional advice.

Acceptable wording:

- "Brunch Body helps users record and organize personal fitness, nutrition, journal, profile, calendar, and planning information."
- "Recorded information and calculated values should not be treated as medical advice."
- "Users should consult qualified professionals before making decisions that could affect their health."

Avoid wording:

- "Brunch Body diagnoses health conditions."
- "Brunch Body provides clinical recommendations."
- "Brunch Body is medically reviewed."
- "Brunch Body provides medical-grade calculations."
- "Brunch Body replaces a doctor, dietitian, trainer, therapist, or other qualified professional."

Do not add HIPAA, medical-device, clinical-compliance, or regulated-health-data language unless a future qualified lane explicitly verifies and authorizes it.

## Store and Disclosure Alignment Notes

Store and disclosure language must match the shipped build, public docs, in-app copy, privacy/data guidance, and platform disclosure answers.

Future store or disclosure lanes should:

- verify live app behavior before relying on current docs
- confirm storage, export, delete/reset, permissions, analytics, telemetry, AI, backend, cloud, account, platform, and integration behavior
- align app copy, public docs, support wording, privacy policy work, store listings, App Store privacy details, Google Play Data safety answers, and release notes
- treat this document as language governance, not final store text or legal disclosure text
- preserve `Needs verification` wording until release-specific evidence supports stronger language

Do not claim launch readiness, store readiness, privacy-policy completeness, disclosure completeness, or legal approval from this document.

## Future Lane Review Checklist

Before changing privacy, data, trust, onboarding, settings, public docs, support, store, backup, export, delete, or restore language, confirm:

- The lane is allowed to edit the target surface.
- The wording is grounded in live behavior, current source, tests, or current architecture docs.
- Current behavior, guidance, future intent, and unknown behavior are clearly separated.
- Local-first wording does not imply "never leaves device" or a permanent guarantee.
- Sensitive fitness, nutrition, profile, journal, calendar, planning, and reflection data is treated with care.
- Delete/reset language is limited to app-managed local data unless broader deletion is verified.
- Export language says selected journal `.xlsx` export when describing the current observed flow.
- Backup, import, restore, cloud sync, account recovery, and device-transfer behavior are not claimed unless verified.
- No encryption, anonymization, HIPAA, legal compliance, medical, clinical, AI, analytics, telemetry, Apple Health, Google Fit, backend, cloud, account, or sync claim is introduced without direct verification and disclosure review.
- Public docs, app copy, release docs, and store/disclosure language remain aligned.
- Any uncertainty is marked as `Needs verification` or captured as follow-on work.

## Non-Claims

This document does not claim that Brunch Body:

- is launch-ready, store-ready, privacy-certified, legally approved, medically reviewed, or clinically validated
- is a legal privacy policy, legal disclosure, app store submission, or medical privacy notice
- provides backend accounts, cloud sync, cloud backup, automatic restore, import, or cross-device recovery
- guarantees encryption, anonymization, secure deletion, forensic deletion, or deletion from operating-system backups
- deletes exported files, copied files, shared files, uploaded files, or files saved outside app-managed storage
- provides AI features, AI coaching, analytics behavior, telemetry behavior, advertising behavior, or off-device processing guarantees
- integrates with Apple Health, Google Fit, wearables, or other platform health services
- provides medical advice, diagnosis, treatment, prevention, clinical recommendations, or professional nutrition/training advice

Future lanes may change app behavior or disclosures only when those lanes explicitly include that work and verify the shipped behavior.
