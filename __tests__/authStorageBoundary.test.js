import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  hasStoredProfile,
  loadStoredProfile,
  saveStoredProfile,
} from '../src/redux/actions/profileStorage';
import {
  clearCompletedOnboardingDraft,
  clearOnboardingDraft,
  getOnboardingDraftValue,
  setOnboardingDraftValue,
} from '../src/redux/actions/onboardingStorage';

describe('Auth/onboarding storage boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('hasStoredProfile preserves the bootstrap user_profile presence check', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('{"weight":"135"}');
    await expect(hasStoredProfile()).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_profile');

    AsyncStorage.getItem.mockResolvedValueOnce(null);
    await expect(hasStoredProfile()).resolves.toBe(false);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_profile');
  });

  test('loadStoredProfile and saveStoredProfile round-trip the existing profile JSON shape', async () => {
    const storedProfile = {
      name: 'Taylor',
      dob: '01/01/1995',
      height: '5.06',
      weight: '135',
      gender: 'female',
    };

    await saveStoredProfile(storedProfile);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user_profile',
      JSON.stringify(storedProfile),
    );

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedProfile));
    await expect(loadStoredProfile()).resolves.toEqual(storedProfile);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_profile');
  });

  test('onboarding draft helpers use the current transient key names', async () => {
    await setOnboardingDraftValue('name', 'Taylor');
    await setOnboardingDraftValue('dob', '01/01/1995');
    await setOnboardingDraftValue('height', '5.06');
    await setOnboardingDraftValue('weight', '135');
    await setOnboardingDraftValue('gender', 'female');

    expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(1, 'name', 'Taylor');
    expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(
      2,
      'dob',
      '01/01/1995',
    );
    expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(3, 'height', '5.06');
    expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(4, 'weight', '135');
    expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(
      5,
      'gender',
      'female',
    );

    AsyncStorage.getItem.mockResolvedValueOnce('01/01/1995');
    await expect(getOnboardingDraftValue('dob')).resolves.toBe('01/01/1995');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('dob');

    await clearOnboardingDraft();
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
      'name',
      'dob',
      'height',
      'weight',
      'gender',
    ]);
  });

  test('completed onboarding clear preserves the current partial draft cleanup', async () => {
    await clearCompletedOnboardingDraft();
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
      'dob',
      'height',
      'gender',
    ]);
  });
});
