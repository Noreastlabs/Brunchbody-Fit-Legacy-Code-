import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getBodyWeightKilograms,
  isBodyUnitPreference,
  parseLegacyHeightToCentimeters,
} from '../../utils/bodyMeasurementUnits';

export const USER_PROFILE_KEY = 'user_profile';

export const getStoredProfileKeys = () => [USER_PROFILE_KEY];

const DERIVED_PROFILE_FIELDS = ['bmi', 'bmr'];

const isPlainObject = value =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasOwn = (value, key) =>
  Object.prototype.hasOwnProperty.call(value || {}, key);

const backfillCanonicalBodyMeasurements = sanitizedProfile => {
  if (!isBodyUnitPreference(sanitizedProfile.bodyUnitPreference)) {
    return false;
  }

  let backfilledCanonicalField = false;

  if (!hasOwn(sanitizedProfile, 'heightCentimeters')) {
    const heightCentimeters = parseLegacyHeightToCentimeters(
      sanitizedProfile.height,
    );

    if (heightCentimeters !== null) {
      sanitizedProfile.heightCentimeters = heightCentimeters;
      backfilledCanonicalField = true;
    }
  }

  if (!hasOwn(sanitizedProfile, 'weightKilograms')) {
    const weightKilograms = getBodyWeightKilograms({
      weight: sanitizedProfile.weight,
    });

    if (weightKilograms !== null) {
      sanitizedProfile.weightKilograms = weightKilograms;
      backfilledCanonicalField = true;
    }
  }

  return backfilledCanonicalField;
};

// Storage normalization is shape-preserving except for explicit lazy repair.
const normalizeProfileStorageShape = profileData => {
  if (!isPlainObject(profileData)) {
    return null;
  }

  const sanitizedProfile = { ...profileData };
  let changedStorageShape = false;

  DERIVED_PROFILE_FIELDS.forEach(field => {
    if (hasOwn(sanitizedProfile, field)) {
      delete sanitizedProfile[field];
      changedStorageShape = true;
    }
  });

  if (backfillCanonicalBodyMeasurements(sanitizedProfile)) {
    changedStorageShape = true;
  }

  return {
    sanitizedProfile,
    changedStorageShape,
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

  const sanitizedResult = normalizeProfileStorageShape(parsedProfile);

  if (!sanitizedResult) {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
    return null;
  }

  const { sanitizedProfile, changedStorageShape } = sanitizedResult;

  if (Object.keys(sanitizedProfile).length === 0) {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
    return null;
  }

  if (changedStorageShape) {
    await AsyncStorage.setItem(
      USER_PROFILE_KEY,
      JSON.stringify(sanitizedProfile),
    );
  }

  return sanitizedProfile;
};

export const hasStoredProfile = async () => Boolean(await loadStoredProfile());

export const saveStoredProfile = async profileData => {
  const sanitizedResult = normalizeProfileStorageShape(profileData);
  const sanitizedProfile = sanitizedResult?.sanitizedProfile;

  if (!sanitizedProfile || Object.keys(sanitizedProfile).length === 0) {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
    return;
  }

  await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(sanitizedProfile));
};
