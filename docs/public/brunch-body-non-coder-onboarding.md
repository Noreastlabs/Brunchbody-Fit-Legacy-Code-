# Brunch Body Non-coder Onboarding Guide

## What this guide is

This is a plain-English starting guide for people who want to understand Brunch Body without reading the source code.

This guide is based on current observed app behavior and existing project documentation. It should be updated if Brunch Body changes its onboarding, storage, export, delete, backup, platform, privacy, AI, or account behavior.

This guide is not a legal privacy policy. It is also not medical, nutrition, or training advice.

## What this guide is not

This guide is not a full support manual, app store listing, privacy policy, legal disclosure, product roadmap, or launch-readiness statement.

It does not promise that every feature is finished, store-ready, backed up, synced, cloud-connected, medically reviewed, professionally coached, or available on every device type.

It also does not describe future features unless they already appear in current project documentation as part of the broader modernization scope.

## Who this is for

This guide is for:

- Non-coders who want a low-jargon overview.
- Testers who need to explore the app and report issues.
- Early users who want to know what to expect before entering personal information.
- Project collaborators who need a shared plain-language starting point.
- Reviewers who need a public-safe summary of the current app posture.

## Before you start

Treat Brunch Body as a mobile-first app that is still being modernized and launch-hardened.

If you are testing and do not want to enter real personal details, use test data. Fitness, nutrition, journal, calendar, profile, and reflection information can be sensitive even when it is stored locally.

Do not assume that deleting, uninstalling, changing devices, or exporting information works like a complete backup and restore system. Based on current project documentation, Brunch Body currently appears local-first and does not appear to provide Brunch Body cloud sync or automatic cross-device backup.

## What Brunch Body is, in plain English

Brunch Body appears to be a mobile-first app for organizing personal fitness, nutrition, journaling, calendar/planning, and profile-tracking information in one place.

Based on current project documentation, it currently appears to support local profile setup, dashboard-style summaries, workout and routine planning, meal and supplement tracking, journal entries and reviews, calendar and writing tools, todo-style planning, settings, local delete/reset behavior, and selected journal export.

The app should be understood as a personal organization and tracking tool. It should not be treated as a medical product, a professional coaching replacement, a clinical calculator, a cloud account system, or an AI assistant.

## First-run checklist

When opening Brunch Body for the first time, expect to start with profile setup if no local profile is saved on the device.

As a non-coder or tester:

- Move through the first-run profile flow using test information if preferred.
- Notice whether the app explains each step clearly.
- After setup, explore the main tab areas at a high level.
- Try a small number of simple actions before entering larger amounts of personal data.
- Check Settings for profile, export, delete-local-data, legal/help, or tutorial-style surfaces.
- Write down anything confusing, surprising, inconsistent, broken, or too broad in its wording.

## Main areas you may see in the app

Based on current project documentation, these are the main areas you may see:

- Home or dashboard: summary-style information and current progress views.
- Journal: daily entries, reviews, weight logs, calorie logs, supplement logs, and trait-style tracking.
- Calendar and Writing: planning, calendar themes, todos, writing entries, and time-based notes.
- Nutrition: meals, meal items, supplements, calories, and macro-style fields.
- Recreation: workouts, routines, exercises, custom plans, completed workouts, and Brunch Body starter plans.
- Settings and Profile: local profile details, vitals, export, delete-local-data, help, tutorials, and legal or privacy links.

Exact labels and routes may change as the project continues to be cleaned up. Use the app you are testing as the source of truth for screenshots, bug reports, and review notes.

## Local-first and data expectations

Based on current observed behavior and project documentation, Brunch Body currently appears to be local-first. In plain English, that means the app's working data appears to live in app storage on the device being used, rather than in a Brunch Body cloud account.

This guide does not claim that Brunch Body sends user app data to a Brunch Body server, automatically syncs across devices, provides AI processing, or stores user information in a backend account.

Local-first does not mean risk-free. Someone with access to the unlocked device, app storage, device backups, exported files, or shared files may be able to see sensitive information.

## Backup and device-change expectations

Do not treat Brunch Body's current export behavior as a full backup of the app.

Based on current public documentation, the observed export feature is for selected journal data and creates an Excel workbook file. Exported files live outside normal app-managed storage after export, so the user is responsible for where those files are saved, copied, shared, uploaded, or deleted.

Current project documentation does not verify a Brunch Body cloud backup, automatic restore, full import, or automatic device-to-device sync feature. If app storage is cleared, the app is uninstalled, the device is lost, or the user changes devices, local app data may not follow automatically.

Operating-system backups or device-transfer tools may have their own behavior, but this guide does not promise whether those tools will include, exclude, restore, or delete Brunch Body data.

## How to test without being a developer

You do not need to understand the codebase to test Brunch Body usefully.

Good non-coder testing is practical and observant:

- Start with a fresh install or a cleared local app state when possible.
- Use test data unless real data is needed and you are comfortable entering it.
- Try common paths such as first-run profile setup, opening each main tab, adding a small entry, editing it if possible, deleting or resetting local data if that is part of the test, and exporting selected journal data if asked.
- Compare what the app says with what it appears to do.
- Watch for unclear wording around privacy, backup, export, delete, health, training, nutrition, calculations, or device changes.
- Record the device, platform, app build if known, and the steps that led to the issue.

## What to report

When reporting an issue, include:

- What you were trying to do.
- The steps you took.
- What you expected to happen.
- What actually happened.
- Whether the issue repeated when you tried again.
- Any visible error message or confusing wording.
- Whether you used test data or real data.
- The device and platform you tested on, if known.

Also report wording that feels too strong or unclear, especially if it seems to imply cloud sync, automatic backup, medical advice, professional coaching, AI behavior, store readiness, or guaranteed restore behavior.

## What not to assume

Do not assume that Brunch Body currently:

- Stores app data in a Brunch Body cloud account.
- Automatically syncs across devices.
- Automatically backs up all app data.
- Restores exported files back into the app.
- Exports every kind of app data.
- Deletes exported files saved outside the app.
- Provides AI features or automated coaching.
- Provides medical, nutrition, training, diagnosis, treatment, or clinical advice.
- Produces medical-grade calculations.
- Is already store-ready.
- Is a desktop or tablet platform beyond evaluation scope.
- Replaces qualified medical, nutrition, fitness, or mental health professionals.

If current behavior is unclear, report what you observed rather than filling in the gap with assumptions.

## Helpful next reads

These public docs may help if they are available in the same documentation folder:

- [Brunch Body User Guide](./brunch-body-user-guide.md)
- [Brunch Body Privacy and Data Guide](./brunch-body-privacy-and-data.md)

The user guide gives a broader feature overview. The privacy and data guide gives more detail about current local-first, export, delete/reset, backup, and device-change expectations.

## Glossary

Local-first: A cautious way to describe the current project posture where working app data appears to live mainly on the user's device instead of in a Brunch Body cloud account.

App storage: Storage managed by the app on the device. It is different from files a user exports, copies, uploads, or shares elsewhere.

Export: Creating a file outside normal app-managed storage. Based on current public documentation, Brunch Body's observed export behavior is for selected journal data, not a full app backup.

Backup: A separate copy of data that can help recovery later. This guide does not claim that Brunch Body currently provides automatic backup or full restore.

Device change: Moving from one phone or device to another. Current public documentation does not verify automatic Brunch Body data transfer across devices.

Delete local data: A current app/settings concept that appears to remove saved Brunch Body data from the current device's app storage. It should not be treated as a promise to delete exported files, operating-system backups, or files saved outside the app.

Medical advice: Professional guidance about diagnosis, treatment, prevention, nutrition, training, or health decisions. Brunch Body should not be treated as providing medical advice.
