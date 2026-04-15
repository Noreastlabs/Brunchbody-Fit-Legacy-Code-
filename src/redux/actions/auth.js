import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '../../storage/mmkv';
import { hydrateWorkoutPlans } from '../../storage/mmkv/hydration';
import { CLEAR_USER, RESET_APP, SET_USER } from '../constants';
import {
  loadStoredProfile,
  ONBOARDING_DRAFT_KEYS,
  saveStoredProfile,
  USER_PROFILE_KEY,
} from './authStorage';

const LOCAL_PASSWORD_KEY = 'local_password';
const LOCAL_PASSWORD_RESET_REQUEST_KEY = 'local_password_reset_requested_at';

export const loggedIn = () => async dispatch => {
  const user = await loadStoredProfile();

  if (user) {
    dispatch({
      type: SET_USER,
      payload: user,
    });
    return true;
  }

  return 'goToCompleteProfile';
};

export const profile = data => async dispatch => {
  const parsedProfile = (await loadStoredProfile()) || {};
  const updatedProfile = { ...parsedProfile, ...data };

  await saveStoredProfile(updatedProfile);
  dispatch({
    type: SET_USER,
    payload: updatedProfile,
  });
  return true;
};

export const logout = () => async dispatch => {
  await AsyncStorage.multiRemove([
    USER_PROFILE_KEY,
    LOCAL_PASSWORD_KEY,
    LOCAL_PASSWORD_RESET_REQUEST_KEY,
    ...ONBOARDING_DRAFT_KEYS,
  ]);

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
  await saveStoredProfile(updatedProfile);
  dispatch({
    type: SET_USER,
    payload: updatedProfile,
  });
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

export const deleteAccount =
  ({ email, password }) =>
  async dispatch => {
    const existingProfile = await loadStoredProfile();

    if (!existingProfile) {
      return 'No local profile was found on this device.';
    }

    if (existingProfile.email && existingProfile.email !== email) {
      return 'Enter the email saved on this device.';
    }

    const storedPassword = await AsyncStorage.getItem(LOCAL_PASSWORD_KEY);
    if (storedPassword && storedPassword !== password) {
      return 'Password is incorrect.';
    }

    dispatch({
      type: RESET_APP,
    });

    await AsyncStorage.clear();
    storage.clearAll();
    hydrateWorkoutPlans();

    return true;
  };
