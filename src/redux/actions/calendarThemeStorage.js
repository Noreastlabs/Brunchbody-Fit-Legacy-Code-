import AsyncStorage from '@react-native-async-storage/async-storage';

const THEMES_STORAGE_KEY = 'themes';

const discardStoredThemes = async () => {
  await AsyncStorage.removeItem(THEMES_STORAGE_KEY);
  return [];
};

export const readStoredThemes = async () => {
  const themesString = await AsyncStorage.getItem(THEMES_STORAGE_KEY);

  if (themesString == null) {
    return [];
  }

  let parsedThemes;

  try {
    parsedThemes = JSON.parse(themesString);
  } catch (error) {
    return discardStoredThemes();
  }

  if (!Array.isArray(parsedThemes)) {
    return discardStoredThemes();
  }

  return parsedThemes;
};
