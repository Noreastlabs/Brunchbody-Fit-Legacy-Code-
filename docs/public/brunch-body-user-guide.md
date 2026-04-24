# Brunch Body User Guide

## Plain-English summary

This is a plain-English user guide for testers and future Brunch Body users. It is not a privacy policy, legal terms, medical guidance, or an app store listing.

Brunch Body is a mobile-first app for organizing personal fitness, nutrition, journaling, calendar, and planning information. It appears to be designed around a local-first approach, meaning the current app behavior and project documentation point to data being saved on the user's device rather than sent to a Brunch Body cloud account.

Some behavior still needs release-level review. Where this guide cannot safely make a strong claim, it uses `Needs verification`.

## What Brunch Body helps you do

Brunch Body helps you keep everyday wellness planning in one place. Based on the current app surfaces and project documentation, users may be able to:

- Create a local profile used by the app.
- View dashboard-style summaries such as weight, BMI, BMR, and target totals.
- Track workouts, routines, exercises, and Brunch Body starter plans.
- Track meals, meal items, supplements, calories, and macro-style nutrition fields.
- Keep journal entries, reviews, weight logs, calorie logs, supplement logs, and trait-related notes.
- Use calendar, theme, writing, and todo-style planning features.
- Edit profile details in settings.
- Export selected journal data as an Excel workbook file.
- Delete saved Brunch Body data from the current device.

## What information you may enter

Depending on which features you use, Brunch Body may ask you to enter or save information such as:

- Nickname.
- Date of birth.
- Height.
- Weight.
- Gender.
- Meals, meal items, supplements, calories, fat, protein, carbohydrates, and related nutrition details.
- Workouts, routines, exercises, completed workouts, and plan-related information.
- Journal entries, daily notes, weekly and quarterly reflections, weight logs, calorie logs, supplement logs, and traits.
- Calendar themes, repeated themes, todos, writing entries, event times, and planning notes.
- Settings choices, such as clock or alert-style preferences.

Some values, such as BMI, BMR, and target totals, appear to be calculated locally from profile information entered into the app.

## Where your information appears to live

Current project documentation describes Brunch Body as local-first and device-local in the current build. In plain English, this means the app appears to save its working data in app storage on the device you are using.

Internal project notes mention local mobile storage tools such as AsyncStorage and MMKV. These are app storage areas on the device, not a Brunch Body cloud account.

The current project evidence does not show backend account storage, automatic cloud sync, or developer-server collection for user app data in the local-only build. This guide does not promise that future versions will always work the same way.

Exported journal files are different from in-app data. When you export journal data, the file is saved outside the normal app data area in a location chosen through the device file picker or storage flow. Brunch Body does not appear to manage those exported copies after export.

Needs verification: Final release behavior should be checked on each supported platform and build before public privacy, store, or support language relies on this section.

## Fitness, nutrition, calendar, journal, and planning features

Fitness and workout features appear to include routines, workouts, exercises, completed workouts, custom plans, and bundled Brunch Body starter plans.

Nutrition features appear to include meals, meal items, meal directories, supplements, supplement items, calories, and macro-style fields such as fat, protein, and carbohydrates.

Journal features appear to include daily entries, weekly reviews, quarterly reviews, weight logs, calorie entries, supplement logs, and trait-related tracking.

Calendar and planning features appear to include themes, repeated themes, cleared theme days, todos, writing entries, and time-based planning.

These features are intended to help with personal tracking and organization. They should not be treated as professional medical, nutrition, or training advice.

## Local-first and privacy-forward expectations

Current project evidence supports these cautious expectations:

- Brunch Body is designed to work with local app data on the user's device in the current build.
- The current local-only app path does not show automatic cloud sync or backend persistence for user-generated data.
- The app can operate with locally stored data.
- Exported journal files are controlled by the user after export.
- Public privacy, support, and store language should stay aligned with the real app behavior in the release being shipped.

Needs verification: Device operating systems may offer their own backup, restore, file, or device-transfer behavior outside Brunch Body. This guide does not promise whether OS-level backup or transfer will preserve Brunch Body data.

## Delete, reset, export, backup, and device-change notes

The current settings surface includes a `Delete local data` action. Current app wording and project documentation say this removes saved Brunch Body data from the current device.

The delete action does not appear to delete files that the user already exported to another app, folder, drive, or storage location. Those files are outside Brunch Body's normal app data area after export.

Starter plans included with Brunch Body may appear again after setup, even after local data is deleted. This is because bundled starter plan data is part of the app experience and may be re-seeded locally.

The current export feature is journal-only. It lets the user export selected journal entry types, such as daily journal, weight log, calories in/out, supplement log, weekly review, and quarterly review. The current implementation exports an Excel workbook file (`.xlsx`), not a full backup of all Brunch Body data.

The current project evidence does not show an import or restore feature that brings exported data back into the app.

There is no verified Brunch Body cloud backup or cross-device sync behavior in the current local-only build. If app storage is cleared, the app is uninstalled, the device is lost, or the user changes devices, local app data may not follow automatically.

Needs verification: Confirm exact delete, reset, export, uninstall, device-transfer, and OS backup behavior in the final release build before using this guide as public support or store-review language.

## What Brunch Body does not do

Based on current repo evidence, this guide does not claim that Brunch Body:

- Stores user data in a Brunch Body cloud account.
- Automatically syncs data across devices.
- Provides guaranteed backup or restore.
- Imports exported journal files back into the app.
- Exports all app data.
- Deletes exported files saved outside the app.
- Provides AI assistance or automated coaching.
- Supports desktop use.
- Provides medical advice, diagnosis, treatment, or clinical recommendations.
- Replaces a qualified medical, nutrition, mental health, or fitness professional.

Needs verification: Any future release that adds backend accounts, sync, AI, import, broader export, desktop support, or medical-style features would need updated user documentation and disclosures.

## Health and safety note

Brunch Body is not a medical device and is not a clinical product. It does not diagnose, treat, cure, or prevent medical conditions.

The app may help users record fitness, nutrition, weight, journal, and planning information, but recorded information and calculated values should not be treated as medical advice. Users should consult qualified health, medical, nutrition, or fitness professionals before making decisions that could affect their health, especially if they have medical conditions, injuries, dietary restrictions, pregnancy-related concerns, or other health risks.

If a user feels chest pain, trouble breathing, faintness, severe pain, or any urgent health symptom, they should stop activity and seek appropriate medical help.

## Known limitations / Needs verification

- Needs verification: Exact release-build behavior for local storage, export, delete, reset, uninstall, backup, and device-change scenarios.
- Needs verification: Whether OS-level backup or device-transfer tools preserve any Brunch Body app data.
- Needs verification: Final privacy policy, platform privacy labels, and store data-safety answers must match the shipped app.
- Needs verification: Public support wording should explain that current export is journal-only and produces `.xlsx` files.
- Needs verification: Any release that changes backend, sync, AI, import, export, delete, or account behavior needs a new disclosure review.
- Needs verification: Any medical, nutrition, training, or wellness wording in public materials should be reviewed so it does not imply clinical advice or treatment.

## Before public release, verify

Before this guide is used for public release, review the shipped build and confirm:

- The app still uses the expected local-first, device-local data behavior.
- No backend account storage, cloud sync, analytics, advertising tracking, or AI feature has been added without updated disclosure.
- Profile, fitness, nutrition, journal, calendar, todo, and planning features match the descriptions above.
- Delete local data behavior matches the app copy, privacy language, and support language.
- Export behavior is accurately described as selected journal data exported to an Excel workbook file.
- There is still no verified import or full backup/restore feature unless the app has been updated to add one.
- Store listing copy, privacy policy, platform privacy disclosures, support scripts, and in-app wording all describe the same behavior.
- Health and safety language makes clear that Brunch Body is not a medical device, clinical product, diagnostic tool, or treatment tool.
