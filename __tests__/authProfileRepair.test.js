import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loadStoredProfile,
  saveStoredProfile,
} from '../src/redux/actions/profileStorage';
import authReducer from '../src/redux/reducer/auth';
import { SET_USER } from '../src/redux/constants';

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

  test('loadStoredProfile strips stale derived fields and rewrites the canonical profile', async () => {
    const canonicalProfile = {
      dob: '01/01/1995',
      gender: 'female',
      height: '5.06',
      weight: '135',
    };

    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({
        ...canonicalProfile,
        bmi: '1.00',
        bmr: '2.00',
      }),
    );

    await expect(loadStoredProfile()).resolves.toEqual(canonicalProfile);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user_profile',
      JSON.stringify(canonicalProfile),
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
    const canonicalProfile = {
      dob: '01/01/1995',
      gender: 'female',
      height: '5.06',
      weight: '135',
    };

    await saveStoredProfile({
      ...canonicalProfile,
      bmi: '1.00',
      bmr: '2.00',
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user_profile',
      JSON.stringify(canonicalProfile),
    );
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
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

  test('auth reducer omits derived metrics when source inputs are unusable', () => {
    const state = authReducer(undefined, {
      type: SET_USER,
      payload: {
        height: 'bad-input',
        weight: 'bad-input',
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
