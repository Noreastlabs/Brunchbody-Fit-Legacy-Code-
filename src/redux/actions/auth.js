import AsyncStorage from '@react-native-async-storage/async-storage';
import { SET_USER } from '../constants';

export const loggedIn = () => async dispatch => {
  const profileData = await AsyncStorage.getItem('user_profile');

  if (profileData) {
    const user = JSON.parse(profileData);
    dispatch({
      type: SET_USER,
      payload: user,
    });
    return true;
  }

  return 'goToCompleteProfile';
};

export const profile = data => async dispatch => {
  const existingProfile = await AsyncStorage.getItem('user_profile');
  const parsedProfile = existingProfile ? JSON.parse(existingProfile) : {};
  const updatedProfile = { ...parsedProfile, ...data };

  await AsyncStorage.setItem('user_profile', JSON.stringify(updatedProfile));
  dispatch({
    type: SET_USER,
    payload: updatedProfile,
  });
  return true;
};

