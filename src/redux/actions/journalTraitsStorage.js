import AsyncStorage from '@react-native-async-storage/async-storage';

const TRAITS_STORAGE_KEY = 'traits';

export const readStoredTraits = async () => {
  const traitsString = await AsyncStorage.getItem(TRAITS_STORAGE_KEY);

  return traitsString ? JSON.parse(traitsString) : [];
};
