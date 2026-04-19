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

const LOCAL_PASSWORD_KEY = 'local_password';
const LOCAL_PASSWORD_RESET_REQUEST_KEY = 'local_password_reset_requested_at';

const setUser = payload => ({
  type: SET_USER,
  payload,
});

const mergeProfileWithStoredProfile = async data => {
  const storedProfile = (await loadStoredProfile()) || {};
  return { ...storedProfile, ...data };
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
