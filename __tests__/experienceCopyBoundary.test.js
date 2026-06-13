import {
  completeProfileTutorialCopy,
  completeProfileValueCopy,
  dashboardTodayCopy,
  feedbackCaptureCopy,
  settingsIntroCopy,
  settingsSectionHelp,
} from '../src/resources';

describe('experience copy boundaries', () => {
  test('profile and dashboard guidance stays local-first', () => {
    expect(completeProfileValueCopy).toMatch(/stays on this device/i);
    expect(dashboardTodayCopy).toMatch(/without syncing/i);
    expect(dashboardTodayCopy).toMatch(/cloud account/i);
  });

  test('settings guidance keeps user-controlled data actions discoverable', () => {
    expect(settingsIntroCopy).toMatch(/export user-managed copies/i);
    expect(settingsIntroCopy).toMatch(/revisit tutorials/i);
    expect(settingsSectionHelp['Export data']).toMatch(/user-managed files/i);
    expect(settingsSectionHelp['Delete local data']).toMatch(
      /external copies are not removed/i,
    );
  });

  test('help and feedback copy directs issues through Help and Support', () => {
    expect(completeProfileTutorialCopy).toMatch(/Settings/i);
    expect(feedbackCaptureCopy).toMatch(/Help & Support/i);
    expect(feedbackCaptureCopy).toMatch(/privacy wording/i);
  });
});
