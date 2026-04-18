import AsyncStorage from '@react-native-async-storage/async-storage';

export const USER_PROFILE_KEY = 'user_profile';

export const getStoredProfileKeys = () => [USER_PROFILE_KEY];

const DERIVED_PROFILE_FIELDS = ['bmi', 'bmr'];

const isPlainObject = value =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const stripDerivedProfileFields = profileData => {
  if (!isPlainObject(profileData)) {
    return null;
  }

  const sanitizedProfile = { ...profileData };
  let removedDerivedField = false;

  DERIVED_PROFILE_FIELDS.forEach(field => {
    if (Object.prototype.hasOwnProperty.call(sanitizedProfile, field)) {
      delete sanitizedProfile[field];
      removedDerivedField = true;
    }
  });

  return {
    sanitizedProfile,
    removedDerivedField,
  };
};

export const loadStoredProfile = async () => {
  const profileData = await AsyncStorage.getItem(USER_PROFILE_KEY);

  if (!profileData) {
    return null;
  }

  let parsedProfile;

  try {
    parsedProfile = JSON.parse(profileData);
  } catch (error) {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
    return null;
  }

  const sanitizedResult = stripDerivedProfileFields(parsedProfile);

  if (!sanitizedResult) {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
    return null;
  }

  const { sanitizedProfile, removedDerivedField } = sanitizedResult;

  if (Object.keys(sanitizedProfile).length === 0) {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
    return null;
  }

  if (removedDerivedField) {
    await AsyncStorage.setItem(
      USER_PROFILE_KEY,
      JSON.stringify(sanitizedProfile),
    );
  }

  return sanitizedProfile;
};

export const hasStoredProfile = async () => Boolean(await loadStoredProfile());

export const saveStoredProfile = async profileData => {
  const sanitizedResult = stripDerivedProfileFields(profileData);
  const sanitizedProfile = sanitizedResult?.sanitizedProfile;

  if (!sanitizedProfile || Object.keys(sanitizedProfile).length === 0) {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
    return;
  }

  await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(sanitizedProfile));
};
