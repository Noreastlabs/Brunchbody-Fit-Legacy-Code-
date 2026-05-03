import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '../../storage/mmkv';
import { hydrateWorkoutPlans } from '../../storage/mmkv/hydration';
import { CLEAR_USER, RESET_APP, SET_USER } from '../constants';
import {
  getStoredProfileKeys,
  loadStoredProfile,
  saveStoredProfile,
} from './profileStorage';
import { getOnboardingDraftKeys } from './onboardingStorage';
import {
  getBodyHeightCentimeters,
  getBodyWeightKilograms,
  parseHeightToCentimeters,
  parseMetricHeightToCentimeters,
  parseWeightToKilograms,
} from '../../utils/bodyMeasurementUnits';
import { strings } from '../../resources';

const LOCAL_PASSWORD_KEY = 'local_password';
const LOCAL_PASSWORD_RESET_REQUEST_KEY = 'local_password_reset_requested_at';

const setUser = payload => ({
  type: SET_USER,
  payload,
});

const hasOwn = (value, key) =>
  Object.prototype.hasOwnProperty.call(value || {}, key);

const STANDARD_UNIT_PREFERENCE = 'standard';
const METRIC_UNIT_PREFERENCE = 'metric';

const getIncomingBodyMeasurementValidationError = data => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return null;
  }

  if (
    hasOwn(data, 'height') &&
    parseHeightToCentimeters(data.height, STANDARD_UNIT_PREFERENCE) === null
  ) {
    return strings.completeProfile.errors.heightInvalid;
  }

  if (
    hasOwn(data, 'heightCentimeters') &&
    parseMetricHeightToCentimeters(data.heightCentimeters) === null
  ) {
    return strings.completeProfile.errors.heightInvalid;
  }

  if (
    hasOwn(data, 'weight') &&
    parseWeightToKilograms(data.weight, STANDARD_UNIT_PREFERENCE) === null
  ) {
    return strings.completeProfile.errors.weightMetricInvalid;
  }

  if (
    hasOwn(data, 'weightKilograms') &&
    parseWeightToKilograms(data.weightKilograms, METRIC_UNIT_PREFERENCE) ===
      null
  ) {
    return strings.completeProfile.errors.weightMetricInvalid;
  }

  return null;
};

const getCanonicalProfileMeasurements = data => {
  const nextData =
    data && typeof data === 'object' && !Array.isArray(data)
      ? { ...data }
      : {};

  if (hasOwn(nextData, 'height')) {
    const heightCentimeters = getBodyHeightCentimeters({
      heightCentimeters: nextData.heightCentimeters,
      height: nextData.height,
    });

    if (heightCentimeters !== null) {
      nextData.heightCentimeters = heightCentimeters;
    }
  }

  if (hasOwn(nextData, 'weight')) {
    const weightKilograms = getBodyWeightKilograms({
      weightKilograms: nextData.weightKilograms,
      weight: nextData.weight,
    });

    if (weightKilograms !== null) {
      nextData.weightKilograms = weightKilograms;
    }
  }

  return nextData;
};

const mergeProfileWithStoredProfile = async data => {
  const storedProfile = (await loadStoredProfile()) || {};
  return { ...storedProfile, ...getCanonicalProfileMeasurements(data) };
};

const persistProfileAndDispatch = async (dispatch, user) => {
  await saveStoredProfile(user);
  dispatch(setUser(user));
};

const getScopedLogoutKeys = () => [
  ...getStoredProfileKeys(),
  LOCAL_PASSWORD_KEY,
  LOCAL_PASSWORD_RESET_REQUEST_KEY,
  ...getOnboardingDraftKeys(),
];

const clearScopedLocalAuthData = () =>
  AsyncStorage.multiRemove(getScopedLogoutKeys());

const clearAllLocalAppData = async () => {
  await AsyncStorage.clear();
  storage.clearAll();
  hydrateWorkoutPlans();
};

export const loggedIn = () => async dispatch => {
  const user = await loadStoredProfile();

  if (user) {
    dispatch(setUser(user));
    return true;
  }

  return 'goToCompleteProfile';
};

export const profile = data => async dispatch => {
  const validationError = getIncomingBodyMeasurementValidationError(data);

  if (validationError) {
    return validationError;
  }

  const updatedProfile = await mergeProfileWithStoredProfile(data);
  await persistProfileAndDispatch(dispatch, updatedProfile);
  return true;
};

export const logout = () => async dispatch => {
  await clearScopedLocalAuthData();

  dispatch({
    type: CLEAR_USER,
  });

  return true;
};

export const changeEmail = ({ email }) => async dispatch => {
  const existingProfile = await loadStoredProfile();

  if (!existingProfile) {
    return 'Complete your profile before updating the local email.';
  }

  const updatedProfile = { ...existingProfile, email };
  await persistProfileAndDispatch(dispatch, updatedProfile);
  return true;
};

export const changePassword =
  ({ email, password, newPassword }) =>
  async () => {
    const existingProfile = await loadStoredProfile();

    if (!existingProfile) {
      return 'Complete your profile before changing the local password.';
    }

    if (existingProfile.email && existingProfile.email !== email) {
      return 'Enter the email saved on this device.';
    }

    const storedPassword = await AsyncStorage.getItem(LOCAL_PASSWORD_KEY);
    if (storedPassword && storedPassword !== password) {
      return 'Current password is incorrect.';
    }

    await AsyncStorage.setItem(LOCAL_PASSWORD_KEY, newPassword);
    await AsyncStorage.removeItem(LOCAL_PASSWORD_RESET_REQUEST_KEY);
    return true;
  };

export const resetPassword = ({ email }) => async () => {
  const existingProfile = await loadStoredProfile();

  if (!existingProfile) {
    return 'Complete your profile before resetting the local password.';
  }

  if (!existingProfile.email) {
    return 'Save a local email on this device before resetting the password.';
  }

  if (existingProfile.email !== email) {
    return 'Enter the email saved on this device.';
  }

  await AsyncStorage.removeItem(LOCAL_PASSWORD_KEY);
  await AsyncStorage.setItem(
    LOCAL_PASSWORD_RESET_REQUEST_KEY,
    new Date().toISOString(),
  );

  return true;
};

export const deleteAccount = () => async dispatch => {
  dispatch({
    type: RESET_APP,
  });

  await clearAllLocalAppData();

  return true;
};
