export const EXPORT_SUCCESS_COPY =
  'Journal data was exported as an Excel workbook (.xlsx).\n\nExported files are user-managed copies after export. Brunch Body does not automatically import, restore, sync, or delete exported files.';

export const exportIntroCopy = [
  'Exports selected journal entries as an Excel workbook (.xlsx).',
  'Exported files may contain personal fitness, journal, nutrition, supplement, reflection, or profile-related information depending on what you export.',
  'Exported files are user-managed copies after export. Brunch Body does not currently provide app-managed import or restore for exported files. Files saved outside the app are not removed by Delete local data.',
  'Android and iOS device backups, file apps, cloud folders, and device-transfer tools are outside Brunch Body app-managed storage.',
];

export const privacyDataCopy = [
  'Brunch Body is local-first in the current app. Your Brunch Body data is stored on this device in local app storage.',
  'The current app does not automatically sync your data to a Brunch Body cloud service.',
  'Brunch Body does not currently provide automatic Brunch Body cloud backup for device-local app data.',
  'Profile and vitals values are stored locally and used for in-app calculations and display.',
  'Exported files may contain personal fitness, journal, nutrition, supplement, reflection, or profile-related information depending on what you export. Once exported, you are responsible for where the file is saved, copied, shared, uploaded, or deleted.',
  'Android and iOS backups, device-transfer tools, cloud folders, and file apps can create or keep copies outside Brunch Body app-managed storage.',
  'Delete local data removes saved Brunch Body data from this device. It does not remove files you exported, copied, shared, uploaded, backed up, transferred, or saved outside the app.',
  'This screen is a plain-English explanation of current app behavior. It is not the legal Privacy Policy or Terms of Use.',
];

export const portabilityReadinessCopy = {
  android:
    'Android export uses a user-selected storage destination. Files saved there are user-managed copies outside Brunch Body app-managed storage.',
  ios:
    'iOS device backups, file providers, and device-transfer tools are outside Brunch Body app-managed storage unless a future lane explicitly implements and verifies an app-managed restore flow.',
  release:
    'Release readiness for portability requires Android and iOS smoke verification that export copy, Delete local data copy, and public docs still match shipped behavior.',
};
