import AsyncStorage from '@react-native-async-storage/async-storage';

const MEALS_STORAGE_KEY = 'meals';
const SUPPLEMENTS_STORAGE_KEY = 'supplements';
const MEAL_CATEGORIES_STORAGE_KEY = 'meal_categories';
const MEALS_DIRECTORY_STORAGE_KEY = 'meals_directory';

const discardStoredArray = async storageKey => {
  await AsyncStorage.removeItem(storageKey);
  return [];
};

const readStoredArray = async storageKey => {
  const storedValue = await AsyncStorage.getItem(storageKey);

  if (storedValue == null) {
    return [];
  }

  let parsedValue;

  try {
    parsedValue = JSON.parse(storedValue);
  } catch (error) {
    return discardStoredArray(storageKey);
  }

  if (!Array.isArray(parsedValue)) {
    return discardStoredArray(storageKey);
  }

  return parsedValue;
};

export const readStoredMeals = () => readStoredArray(MEALS_STORAGE_KEY);

export const readStoredSupplements = () =>
  readStoredArray(SUPPLEMENTS_STORAGE_KEY);

export const readStoredMealCategories = () =>
  readStoredArray(MEAL_CATEGORIES_STORAGE_KEY);

export const readStoredMealsDirectory = () =>
  readStoredArray(MEALS_DIRECTORY_STORAGE_KEY);
