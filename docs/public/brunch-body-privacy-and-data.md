# Brunch Body Privacy and Data Guide

## What this guide is

This is a plain-English guide for Brunch Body users, testers, and non-coders who want to understand how the app appears to handle data today.

This guide is not a legal privacy policy, legal advice, app store disclosure, or medical privacy notice.

This guide is based on current observed app behavior and existing project documentation. It should be updated if Brunch Body later adds cloud sync, backend accounts, AI features, import/export changes, platform integrations, or different delete/reset behavior.

## Short version

Brunch Body currently appears to be local-first. Based on observed app behavior and project docs, the app's working data appears to live in app storage on the device you are using, not in a Brunch Body cloud account.

Fitness, nutrition, journal, profile, and planning data can be sensitive. Treat Brunch Body data the way you would treat other personal health, routine, food, body, calendar, or reflection information.

This guide does not promise cloud sync, secure cloud backup, multi-device restore, clinical privacy compliance, HIPAA compliance, AI processing, or medical record handling.

## What kinds of information Brunch Body may store

Depending on which features you use, Brunch Body may store information such as:

- Profile and body-related information, such as nickname, email, date of birth, height, weight, gender, BMI, BMR, or related profile details.
- Fitness and workout information, such as exercises, routines, workouts, completed workouts, custom plans, and Brunch Body starter plans.
- Nutrition information, such as meals, meal items, supplements, calories, macros, food categories, and meal directories.
- Journal or reflection information, such as daily entries, weight logs, calorie logs, supplement logs, weekly reviews, quarterly reviews, traits, and notes.
- Calendar, planning, and todo-style information, such as themes, repeated themes, cleared days, todos, writing entries, event times, and planning notes.
- Settings, preferences, and theme-style information used to make the app behave the way you choose.

Some of this information may reveal personal routines, health-related patterns, habits, goals, reflections, or other details you may not want other people to see.

## Where your data appears to live today

Based on current repo-observed behavior, Brunch Body appears to save its working data in local app/device storage.

The observed storage surfaces include persisted Redux app state backed by AsyncStorage, direct AsyncStorage keys for profile, onboarding, auth-related data, and legacy domain reads, plus an MMKV sidecar used for bundled workout-plan data.

The current project evidence does not show a Brunch Body backend account, automatic Brunch Body cloud sync, or guaranteed multi-device restore for user app data.

Some app data appears to stay inside the app's managed storage area. Exported files are different: when selected journal data is exported, the app writes an Excel workbook file (`.xlsx`) outside normal app-managed storage in a user-selected device location.

## What Brunch Body does not currently promise

Based on current observed behavior and existing project docs, this guide does not claim that Brunch Body:

- Diagnoses, treats, cures, or prevents any medical condition.
- Replaces a qualified medical, nutrition, fitness, or mental health professional.
- Provides a secure clinical record system.
- Provides HIPAA compliance or other clinical privacy compliance.
- Stores your app data in a Brunch Body cloud account.
- Automatically syncs your app data across devices.
- Guarantees cloud backup, device backup, import, restore, or multi-device recovery.
- Exports all app data.
- Imports exported files back into the app.
- Deletes files you copied, shared, uploaded, or exported outside the app.
- Provides AI features, automated coaching, or off-device processing of user data.

## Deleting, resetting, and removing data

The current app includes local delete/reset behavior that appears to remove saved Brunch Body data from the current device's app storage.

That is an app-level reset/delete statement, not a secure deletion guarantee. This guide does not promise forensic deletion, deletion from operating-system backups, deletion from device-transfer tools, or deletion from storage locations outside Brunch Body's app-managed data.

Files that you exported, copied, shared, uploaded, or saved to another app or folder are outside Brunch Body's normal app storage after export. You are responsible for managing those copies.

Starter plans included with Brunch Body may appear again after setup because the observed app behavior can rehydrate bundled workout-plan data after local app data is cleared.

## Backups, exports, and device changes

Device access matters. Someone who can unlock your device, access app data through the operating system, or view exported files may be able to see sensitive Brunch Body information.

Operating-system backups, device-transfer tools, and platform storage behavior may carry app data depending on the device and platform. This guide does not promise whether a platform backup will include, exclude, restore, or delete Brunch Body data.

The observed export feature is for selected journal data and creates an Excel workbook file (`.xlsx`). It should be treated as sensitive. The current observed export behavior is not a full backup of every Brunch Body feature and is not an import or restore system.

If you change devices, uninstall the app, clear app storage, or lose the device, local app data may not follow automatically unless a supported platform or future Brunch Body feature handles that separately.

## Permissions and off-device sharing

Based on observed app behavior, the journal export flow may use device storage permission and a device file picker or storage location so you can save selected journal data as a file.

This guide does not claim that Brunch Body sends user app data to a Brunch Body server, cloud account, AI service, analytics service, or third-party platform. It also does not guarantee that future versions will behave the same way.

If you choose to save, copy, share, upload, email, message, or move exported data outside the app, that destination may have its own privacy, backup, retention, and sharing behavior.

## Questions to ask before sharing/exporting data

- Would I be comfortable if someone with access to this device saw this information?
- Am I exporting journal data, profile-related information, health-related patterns, or private reflections?
- Where am I saving the file, and who can access that folder, app, drive, or account?
- Could the destination make its own backups or sync copies to other devices?
- Do I know how to delete the exported copy if I no longer want it there?

## For testers

If you are testing Brunch Body and are not comfortable entering real personal details, use test data instead.

Avoid entering highly sensitive real data unless you are comfortable with that data being stored locally on the test device and possibly included in device backups or exported files depending on your actions and platform behavior.

Please report any privacy, data, export, delete, backup, or reset wording that feels confusing, too broad, or inconsistent with the app behavior you observe.

## Future changes

This guide must be updated if Brunch Body later adds or changes cloud sync, backend accounts, AI features, export/import behavior, platform integrations, app permissions, deletion/reset semantics, backup/restore behavior, or third-party data handling.

Public privacy language, support language, platform privacy disclosures, and store-submission answers should stay aligned with the actual shipped app behavior.
