import AsyncStorage from '@react-native-async-storage/async-storage';

const THEMES_STORAGE_KEY = 'themes';

export const readStoredThemes = async () => {
  const themesString = await AsyncStorage.getItem(THEMES_STORAGE_KEY);
  return themesString ? JSON.parse(themesString) : [];
};
