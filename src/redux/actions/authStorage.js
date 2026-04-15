import AsyncStorage from '@react-native-async-storage/async-storage';

export const USER_PROFILE_KEY = 'user_profile';
export const ONBOARDING_DRAFT_KEYS = [
  'name',
  'dob',
  'height',
  'weight',
  'gender',
];

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

export const getOnboardingDraftValue = async key => AsyncStorage.getItem(key);

export const setOnboardingDraftValue = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

export const clearOnboardingDraft = async (keys = ONBOARDING_DRAFT_KEYS) => {
  const keysToRemove = Array.isArray(keys) ? keys : [keys];
  await AsyncStorage.multiRemove(keysToRemove);
};
