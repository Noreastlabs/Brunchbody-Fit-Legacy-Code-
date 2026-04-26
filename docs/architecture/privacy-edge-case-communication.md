# Privacy Edge-Case Communication

This document is internal communication guidance only. It is not a legal privacy policy, store disclosure, user agreement, or behavior change. It must not be used to claim behavior that has not been verified in the app.

## Status and Scope

This is an internal Brunch Body guidance artifact for privacy-sensitive edge-case communication. It is meant for future copy-writing lanes, support reviewers, testers, documentation reviewers, and store/disclosure preparation work.

This lane changes no app behavior, privacy posture, permissions, prompts, onboarding, settings UX, storage behavior, export/import behavior, delete/reset behavior, public docs, legal policy, privacy policy, store copy, or platform disclosures.

Use this document to help explain limits clearly when users might misunderstand what a local-first app can and cannot control. Do not use it as final public copy, legal copy, store copy, privacy-policy language, or proof that a behavior exists.

## Evidence Basis

This guidance is based on existing Brunch Body trust and documentation artifacts when present in the working tree, including privacy messaging, permission transparency, documentation governance, public privacy/data guidance, and transparency copy guidance.

Current project evidence supports cautious language such as:

- Brunch Body is local-first in the current app.
- Working app data appears to live in local app-managed storage on the current device.
- The current app does not automatically sync Brunch Body app data to a Brunch Body cloud account.
- The observed export flow is selected journal export to an Excel workbook file (`.xlsx`), not a verified full backup, import, or restore system.
- Delete/reset language must distinguish local app-managed data from exported files, copied files, screenshots, shared files, operating-system backups, device-transfer behavior, and other storage outside the app's control.

If future behavior is unclear, mark it as `Needs verification` or seed follow-on work. Do not fill gaps with stronger privacy, backup, deletion, recovery, sync, or disclosure claims.

## Communication Principles

- Explain limits without panic. Use plain wording that helps users make good choices without making local-first storage sound unsafe by default.
- Separate app behavior from operating-system behavior. Brunch Body can describe app-managed local storage only when verified; it should not claim control over OS backups, screenshots, screen recording, notification previews, shared devices, or user-managed files.
- Avoid absolute guarantees. Do not say "never leaves your device" unless the exact feature, platform, build, export path, permission path, and disclosure context have been verified.
- Use bounded local-first language. Prefer wording such as "Brunch Body is designed around local app storage unless a specific feature or user action exports or shares data."
- Treat exported and visible information as sensitive. Fitness, nutrition, journal, profile, body, calendar, planning, and reflection information may reveal personal routines, habits, goals, or health-related patterns.
- Preserve delete/reset truthfulness. Deletion wording should say what app-controlled local data the app can remove and what may remain outside app control.
- Keep support, tester, public-doc, and store language aligned. No response should promise more than verified app behavior, docs, privacy language, or disclosures can support.

## Edge Cases to Explain Carefully

- App deletion, reset, device loss, device damage, or device replacement: because Brunch Body is local-first, local app data may not follow the user automatically if the app is deleted, app storage is cleared, the device is lost, or the user changes devices.
- OS backup and restore ambiguity: operating-system backups, device-transfer tools, cloud device backups, and restore behavior may vary by platform, settings, build, and user action. Brunch Body should not promise whether those systems include, exclude, restore, or delete app data unless verified for the release context.
- Exported files: exported files may contain sensitive personal information. After export, files are outside normal app-managed storage, so the user is responsible for where they are saved, copied, shared, uploaded, retained, or deleted.
- Screenshots, shared devices, and screen recording: people with access to the unlocked device, screen recordings, screenshots, shared-device profiles, mirrored screens, or other viewing paths may see visible Brunch Body information. Brunch Body should not claim it can control those device-level or user-created copies.
- Notification previews and lock-screen visibility: notification content, preview visibility, lock-screen settings, focus modes, and device-level notification privacy are controlled by the operating system and user settings. Only describe notification behavior that has been verified in the app.
- Permissions: when a permission is optional or feature-specific in verified behavior, explain it near the feature that needs it. Do not imply a permission is required for the whole app if it is only tied to a specific action.
- Delete/reset limitations: app-level delete or reset wording should be limited to app-managed local data on the current device when that is verified. It should not imply secure deletion, deletion from OS backups, deletion from exported files, deletion from screenshots, or deletion from copied/shared/uploaded files.
- Support and testing conversations: testers and support reviewers should answer narrowly, use test data when appropriate, and avoid privacy guarantees broader than the app, docs, privacy language, or store disclosures can support.
- Store and disclosure copy: store, platform, and disclosure wording must match the shipped build and must not exceed verified behavior.

## User-Facing Language Rules

Use direct, calm wording when a future lane is allowed to create user-facing copy and the behavior has been verified for that release.

Acceptable patterns:

- "Because Brunch Body is local-first, keeping a copy of exported data is the user's responsibility."
- "The current app does not automatically sync your Brunch Body data to a Brunch Body cloud account."
- "If the app is deleted, app storage is cleared, or the device is lost, local app data may not be recoverable through Brunch Body."
- "Operating-system backups and device-transfer tools have their own behavior. Review your device settings if you rely on them."
- "Exported files may contain personal fitness, nutrition, journal, profile, or planning information."
- "After export, the file is outside Brunch Body's normal app-managed storage."
- "Delete local data does not remove files you exported, copied, shared, uploaded, or saved outside the app."
- "Screenshots, screen recordings, notification previews, and shared-device access are controlled by your device settings and your actions."

Avoid broad or alarming wording. The goal is to help users understand responsibility and limits without suggesting unverified risk, legal conclusions, or new product behavior.

## Forbidden Claims

Do not claim:

- guaranteed cloud recovery, cloud backup, account recovery, sync, or multi-device continuity unless that behavior is implemented, verified, and disclosure-reviewed
- guaranteed permanent deletion outside app-controlled local storage
- secure deletion, forensic deletion, deletion from OS backups, or deletion from device-transfer tools unless verified for the exact release context
- absolute "never leaves your device" behavior unless verified for the exact feature, platform, export path, permission path, build, and disclosure context
- that Brunch Body controls OS backups, cloud device backups, screenshots, screen recording, lock-screen notification previews, shared-device access, device-transfer tools, or exported files after the user saves or shares them
- that exported files are encrypted, anonymized, protected from other apps, or automatically deleted unless verified
- that the current export flow is a full backup, all-data export, import system, restore system, or device-transfer feature
- that Brunch Body has legal, privacy-policy, compliance, HIPAA, medical-record, store-readiness, App Store, Google Play, or platform-disclosure approval from this guidance
- that support, tester, or internal guidance creates privacy-policy obligations or final public disclosure language

If stronger wording is needed, create a verification, legal/privacy, disclosure, or product-behavior lane instead of expanding the claim.

## Support and Tester Guidance

Support and tester communication should be narrow, practical, and aligned with verified behavior.

- Use test data when a tester is not comfortable entering real personal details.
- Say that fitness, nutrition, journal, profile, calendar, planning, and reflection data can be sensitive, even when stored locally.
- Explain that local-first behavior means the app is designed around local app storage, not guaranteed recovery after app deletion, device loss, or device replacement.
- Remind users that exported files become user-managed once saved outside the app.
- Explain delete/reset limits without implying that the app can remove exported files, screenshots, OS backups, copied files, shared files, or uploaded files.
- Avoid improvising privacy guarantees in support replies. If a question depends on platform backup, notification previews, device-transfer tools, app-store disclosures, or future behavior, mark it for review.
- Do not use support conversations to make legal, compliance, store, or privacy-policy conclusions.

## Store and Disclosure Alignment

Store, platform, privacy, and disclosure language must match the shipped app behavior and the approved disclosure surface for that release.

Future store or disclosure lanes should verify:

- current storage behavior and whether local-first wording still matches the shipped build
- export, import, backup, restore, delete/reset, and device-transfer behavior
- permissions, notification behavior, file access, network behavior, analytics, telemetry, AI, backend, cloud, account, and sync behavior
- public docs, in-app copy, support wording, privacy policy, release notes, App Store privacy details, Google Play Data safety answers, and store listing copy for alignment

This artifact may be used as an internal review input. It must not be pasted into store copy, privacy-policy text, user agreements, platform disclosure answers, or public docs as final wording.

## Review Checklist

Before adding user-facing privacy, backup, delete/reset, export/import, support, onboarding, settings, public-doc, or store/disclosure copy, confirm:

- The lane is allowed to edit the target surface.
- The wording is grounded in shipped app behavior, current source, current tests, or current architecture docs.
- Any unverified behavior is marked as `Needs verification` or captured as follow-on work.
- Local-first wording is bounded and does not become an absolute "never leaves device" claim.
- Exported files and visible fitness, nutrition, journal, profile, calendar, planning, and reflection data are treated as sensitive.
- App delete/reset wording is distinguished from OS backups, exported files, screenshots, screen recordings, shared devices, copied files, shared files, uploaded files, and device-transfer tools.
- Permission wording is feature-specific where verified and does not imply broader access or broader restriction than the platform actually provides.
- Notification preview and lock-screen wording does not imply Brunch Body controls device-level privacy settings unless verified.
- Support and tester wording does not exceed verified app behavior, current docs, privacy language, or store disclosures.
- Store/disclosure language is checked against the shipped build before public use.
- The lane does not accidentally change app behavior, privacy posture, public docs, legal policy, store copy, permissions, storage, delete/reset, export/import, backup, sync, AI, or disclosure semantics.

## Follow-on Lane Seeds

- Verify operating-system backup and device-transfer behavior for each release platform before making public claims.
- Review notification preview, lock-screen, and device-level privacy copy if future notification surfaces are added or changed.
- Create release-specific export/import/backup guidance if Brunch Body adds full backup, import, restore, device-transfer, cloud backup, or account recovery behavior.
- Review delete/reset public copy if storage locations, bundled data behavior, or deletion semantics change.
- Align store disclosures, privacy policy, public docs, support scripts, and in-app copy after any future change to permissions, storage, export/import, backup, delete/reset, sync, backend, analytics, telemetry, AI, or platform integrations.
