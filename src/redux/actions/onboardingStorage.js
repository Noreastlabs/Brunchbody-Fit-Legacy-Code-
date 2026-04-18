import AsyncStorage from '@react-native-async-storage/async-storage';

export const ONBOARDING_DRAFT_KEYS = [
  'name',
  'dob',
  'height',
  'weight',
  'gender',
];

export const COMPLETED_ONBOARDING_DRAFT_KEYS = ['dob', 'height', 'gender'];

export const getOnboardingDraftKeys = () => [...ONBOARDING_DRAFT_KEYS];

export const getOnboardingDraftValue = async key => AsyncStorage.getItem(key);

export const setOnboardingDraftValue = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

export const clearOnboardingDraft = async (keys = ONBOARDING_DRAFT_KEYS) => {
  const keysToRemove = Array.isArray(keys) ? keys : [keys];
  await AsyncStorage.multiRemove(keysToRemove);
};

export const clearCompletedOnboardingDraft = async () =>
  clearOnboardingDraft(COMPLETED_ONBOARDING_DRAFT_KEYS);
