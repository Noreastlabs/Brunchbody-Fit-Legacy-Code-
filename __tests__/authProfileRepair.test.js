import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loadStoredProfile,
  saveStoredProfile,
} from '../src/redux/actions/profileStorage';
import { profile } from '../src/redux/actions/auth';
import authReducer from '../src/redux/reducer/auth';
import { SET_USER } from '../src/redux/constants';

const reduceProfileWithReferenceDate = payload => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-04-16T12:00:00.000Z'));

  try {
    return authReducer(undefined, {
      type: SET_USER,
      payload,
    }).user;
  } finally {
    jest.useRealTimers();
  }
};

describe('Auth/profile repair boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loadStoredProfile removes unusable derived-only direct profile payloads', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({
        bmi: '21.79',
        bmr: '1406.75',
      }),
    );

    await expect(loadStoredProfile()).resolves.toBeNull();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user_profile');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('loadStoredProfile strips stale derived fields and rewrites the stored profile', async () => {
    const storedProfile = {
      dob: '01/01/1995',
      gender: 'female',
      height: '5.06',
      weight: '135',
    };

    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({
        ...storedProfile,
        bmi: '1.00',
        bmr: '2.00',
      }),
    );

    await expect(loadStoredProfile()).resolves.toEqual(storedProfile);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user_profile',
      JSON.stringify(storedProfile),
    );
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });

  test('loadStoredProfile preserves body shape while repairing derived residue', async () => {
    const storedProfile = {
      dob: '01/01/1995',
      gender: 'female',
      height: '5.06',
      weight: '135',
      heightCentimeters: 200,
      weightKilograms: 200,
      bodyUnitPreference: 'metric',
    };

    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({
        ...storedProfile,
        bmi: '1.00',
        bmr: '2.00',
      }),
    );

    await expect(loadStoredProfile()).resolves.toEqual(storedProfile);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user_profile',
      JSON.stringify(storedProfile),
    );
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });

  test('loadStoredProfile does not generate missing canonical fields', async () => {
    const storedProfile = {
      dob: '01/01/1995',
      gender: 'female',
      height: '5.06',
      weight: '135',
      bodyUnitPreference: 'standard',
    };

    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({
        ...storedProfile,
        bmi: '1.00',
        bmr: '2.00',
      }),
    );

    const loadedProfile = await loadStoredProfile();

    expect(loadedProfile).toEqual(storedProfile);
    expect(loadedProfile).not.toHaveProperty('heightCentimeters');
    expect(loadedProfile).not.toHaveProperty('weightKilograms');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user_profile',
      JSON.stringify(storedProfile),
    );
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });

  test('loadStoredProfile strips NaN derived fields before durable restore', async () => {
    const canonicalProfile = {
      dob: '01/01/1995',
      gender: 'female',
      height: '5.06',
      weight: '135',
    };

    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({
        ...canonicalProfile,
        bmi: 'NaN',
        bmr: 'NaN',
      }),
    );

    await expect(loadStoredProfile()).resolves.toEqual(canonicalProfile);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user_profile',
      JSON.stringify(canonicalProfile),
    );
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });

  test('saveStoredProfile persists only non-derived direct profile fields', async () => {
    const storedProfile = {
      dob: '01/01/1995',
      gender: 'female',
      height: '5.06',
      weight: '135',
      heightCentimeters: 200,
      weightKilograms: 200,
      bodyUnitPreference: 'metric',
    };

    await saveStoredProfile({
      ...storedProfile,
      bmi: '1.00',
      bmr: '2.00',
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user_profile',
      JSON.stringify(storedProfile),
    );
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });

  test('saveStoredProfile does not generate missing canonical fields', async () => {
    const storedProfile = {
      dob: '01/01/1995',
      gender: 'female',
      height: '5.06',
      weight: '135',
      bodyUnitPreference: 'standard',
    };

    await saveStoredProfile({
      ...storedProfile,
      bmi: '1.00',
      bmr: '2.00',
    });

    const savedProfile = JSON.parse(AsyncStorage.setItem.mock.calls.at(-1)[1]);
    expect(savedProfile).toEqual(storedProfile);
    expect(savedProfile).not.toHaveProperty('heightCentimeters');
    expect(savedProfile).not.toHaveProperty('weightKilograms');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });

  test('profile save preserves stored body shape on non-body partial updates', async () => {
    const dispatch = jest.fn();
    const storedProfile = {
      name: 'Taylor',
      dob: '01/01/1995',
      gender: 'female',
      height: '5.06',
      weight: '135',
      heightCentimeters: 200,
      weightKilograms: 200,
      bodyUnitPreference: 'metric',
    };

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedProfile));

    await profile({ name: 'Taylor Rae' })(dispatch);

    const savedProfile = JSON.parse(AsyncStorage.setItem.mock.calls.at(-1)[1]);
    expect(savedProfile).toEqual({
      ...storedProfile,
      name: 'Taylor Rae',
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: SET_USER,
      payload: savedProfile,
    });
  });

  test('profile save keeps canonical refresh limited to incoming legacy body fields', async () => {
    const dispatch = jest.fn();
    const storedProfile = {
      name: 'Taylor',
      dob: '01/01/1995',
      gender: 'female',
      height: '5.06',
      weight: '135',
      heightCentimeters: 200,
      weightKilograms: 200,
      bodyUnitPreference: 'metric',
    };

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedProfile));

    await profile({ weight: '140' })(dispatch);

    const savedProfile = JSON.parse(AsyncStorage.setItem.mock.calls.at(-1)[1]);
    expect(savedProfile).toEqual(
      expect.objectContaining({
        name: 'Taylor',
        dob: '01/01/1995',
        gender: 'female',
        height: '5.06',
        weight: '140',
        heightCentimeters: 200,
        bodyUnitPreference: 'metric',
      }),
    );
    expect(savedProfile.weightKilograms).toBeCloseTo(63.5029318);
    expect(dispatch).toHaveBeenCalledWith({
      type: SET_USER,
      payload: savedProfile,
    });
  });

  test('auth reducer recomputes derived metrics instead of trusting stale incoming fields', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-16T12:00:00.000Z'));

    try {
      const state = authReducer(undefined, {
        type: SET_USER,
        payload: {
          height: '5.06',
          weight: '135',
          dob: '01/01/1995',
          gender: 'female',
          bmi: '0.00',
          bmr: '0.00',
        },
      });

      expect(state.user.bmi).toBe('21.79');
      expect(state.user.bmr).toBe('1406.75');
    } finally {
      jest.useRealTimers();
    }
  });

  test('auth reducer preserves valid male legacy BMI and BMR outputs', () => {
    const user = reduceProfileWithReferenceDate({
      height: '5.10',
      weight: '171',
      dob: '01/01/1995',
      gender: 'male',
    });

    expect(user.bmi).toBe('24.53');
    expect(user.bmr).toBe('1809.53');
  });

  test('auth reducer preserves valid female legacy BMI and BMR outputs', () => {
    const user = reduceProfileWithReferenceDate({
      height: '5.06',
      weight: '135',
      dob: '01/01/1995',
      gender: 'female',
    });

    expect(user.bmi).toBe('21.79');
    expect(user.bmr).toBe('1406.75');
  });

  test('auth reducer preserves male BMR fallback for unsupported and missing gender', () => {
    const unsupportedGenderUser = reduceProfileWithReferenceDate({
      height: '5.10',
      weight: '171',
      dob: '01/01/1995',
      gender: 'unsupported',
    });
    const missingGenderUser = reduceProfileWithReferenceDate({
      height: '5.10',
      weight: '171',
      dob: '01/01/1995',
    });

    expect(unsupportedGenderUser.bmi).toBe('24.53');
    expect(unsupportedGenderUser.bmr).toBe('1809.53');
    expect(missingGenderUser.bmi).toBe('24.53');
    expect(missingGenderUser.bmr).toBe('1809.53');
  });

  test('auth reducer preserves compact legacy height dot notation', () => {
    const paddedHeightUser = reduceProfileWithReferenceDate({
      height: '5.06',
      weight: '135',
      dob: '01/01/1995',
      gender: 'female',
    });
    const compactHeightUser = reduceProfileWithReferenceDate({
      height: '5.6',
      weight: '135',
      dob: '01/01/1995',
      gender: 'female',
    });

    expect(compactHeightUser.bmi).toBe('21.79');
    expect(compactHeightUser.bmr).toBe('1406.75');
    expect(compactHeightUser.bmi).toBe(paddedHeightUser.bmi);
    expect(compactHeightUser.bmr).toBe(paddedHeightUser.bmr);
  });

  test('auth reducer derives BMI and BMR from valid canonical fields as fixed strings', () => {
    const user = reduceProfileWithReferenceDate({
      height: 'bad-input',
      weight: 'bad-input',
      heightCentimeters: 168,
      weightKilograms: 61.2,
      bodyUnitPreference: 'standard',
      dob: '01/01/1995',
      gender: 'female',
    });

    expect(user.bmi).toBe('21.68');
    expect(user.bmr).toBe('1407.08');
    expect(typeof user.bmi).toBe('string');
    expect(typeof user.bmr).toBe('string');
  });

  test('auth reducer prefers valid canonical fields over disagreeing legacy fields', () => {
    const user = reduceProfileWithReferenceDate({
      height: '5.06',
      weight: '135',
      heightCentimeters: 200,
      weightKilograms: 200,
      bodyUnitPreference: 'standard',
      dob: '01/01/1995',
      gender: 'female',
    });

    expect(user.bmi).toBe('50.00');
    expect(user.bmr).toBe('2797.40');
    expect(user.height).toBe('5.06');
    expect(user.weight).toBe('135');
    expect(user.heightCentimeters).toBe(200);
    expect(user.weightKilograms).toBe(200);
  });

  test('auth reducer falls back to legacy fields when canonical fields are missing', () => {
    const user = reduceProfileWithReferenceDate({
      height: '5.06',
      weight: '135',
      dob: '01/01/1995',
      gender: 'female',
    });

    expect(user.bmi).toBe('21.79');
    expect(user.bmr).toBe('1406.75');
  });

  test('auth reducer falls back to legacy fields when canonical fields are partial', () => {
    [
      { heightCentimeters: 200 },
      { weightKilograms: 200 },
    ].forEach(canonicalFields => {
      const user = reduceProfileWithReferenceDate({
        height: '5.06',
        weight: '135',
        dob: '01/01/1995',
        gender: 'female',
        ...canonicalFields,
      });

      expect(user.bmi).toBe('21.79');
      expect(user.bmr).toBe('1406.75');
    });
  });

  test('auth reducer falls back to legacy fields when canonical fields are invalid', () => {
    [
      { heightCentimeters: 0, weightKilograms: 200 },
      { heightCentimeters: -1, weightKilograms: 200 },
      { heightCentimeters: 200, weightKilograms: 0 },
      { heightCentimeters: 200, weightKilograms: -1 },
      { heightCentimeters: NaN, weightKilograms: 200 },
      { heightCentimeters: 200, weightKilograms: Infinity },
      { heightCentimeters: '200', weightKilograms: 200 },
      { heightCentimeters: 200, weightKilograms: '200' },
    ].forEach(canonicalFields => {
      const user = reduceProfileWithReferenceDate({
        height: '5.06',
        weight: '135',
        dob: '01/01/1995',
        gender: 'female',
        ...canonicalFields,
      });

      expect(user.bmi).toBe('21.79');
      expect(user.bmr).toBe('1406.75');
    });
  });

  test('auth reducer preserves male BMR fallback on the canonical path', () => {
    const unsupportedGenderUser = reduceProfileWithReferenceDate({
      height: '5.06',
      weight: '135',
      heightCentimeters: 200,
      weightKilograms: 200,
      dob: '01/01/1995',
      gender: 'unsupported',
    });
    const missingGenderUser = reduceProfileWithReferenceDate({
      height: '5.06',
      weight: '135',
      heightCentimeters: 200,
      weightKilograms: 200,
      dob: '01/01/1995',
    });

    expect(unsupportedGenderUser.bmi).toBe('50.00');
    expect(unsupportedGenderUser.bmr).toBe('3602.16');
    expect(missingGenderUser.bmi).toBe('50.00');
    expect(missingGenderUser.bmr).toBe('3602.16');
  });

  test('auth reducer omits derived metrics when source inputs are unusable', () => {
    const state = authReducer(undefined, {
      type: SET_USER,
      payload: {
        height: 'bad-input',
        weight: 'bad-input',
        heightCentimeters: 0,
        weightKilograms: Infinity,
        dob: 'not/a/date',
        gender: 'male',
        bmi: 'NaN',
        bmr: 'NaN',
      },
    });

    expect(state.user).not.toHaveProperty('bmi');
    expect(state.user).not.toHaveProperty('bmr');
  });
});
