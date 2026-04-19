import AsyncStorage from '@react-native-async-storage/async-storage';

const TRAITS_STORAGE_KEY = 'traits';

const discardStoredTraits = async () => {
  await AsyncStorage.removeItem(TRAITS_STORAGE_KEY);
  return [];
};

export const readStoredTraits = async () => {
  const traitsString = await AsyncStorage.getItem(TRAITS_STORAGE_KEY);

  if (traitsString == null) {
    return [];
  }

  let parsedTraits;

  try {
    parsedTraits = JSON.parse(traitsString);
  } catch (error) {
    return discardStoredTraits();
  }

  if (!Array.isArray(parsedTraits)) {
    return discardStoredTraits();
  }

  return parsedTraits;
};
