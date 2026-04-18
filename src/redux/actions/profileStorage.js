import AsyncStorage from '@react-native-async-storage/async-storage';

export const USER_PROFILE_KEY = 'user_profile';

export const getStoredProfileKeys = () => [USER_PROFILE_KEY];

export const hasStoredProfile = async () => {
  const profileData = await AsyncStorage.getItem(USER_PROFILE_KEY);
  return Boolean(profileData);
};

export const loadStoredProfile = async () => {
  const profileData = await AsyncStorage.getItem(USER_PROFILE_KEY);
  return profileData ? JSON.parse(profileData) : null;
};

export const saveStoredProfile = async profileData => {
  await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileData));
};
