import AsyncStorage from '@react-native-async-storage/async-storage';

const EXERCISES_STORAGE_KEY = 'exercises';
const EXERCISE_DIRECTORY_STORAGE_KEY = 'exercise_directory';

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

export const readStoredExercises = () => readStoredArray(EXERCISES_STORAGE_KEY);

export const readStoredExerciseDirectory = () =>
  readStoredArray(EXERCISE_DIRECTORY_STORAGE_KEY);
