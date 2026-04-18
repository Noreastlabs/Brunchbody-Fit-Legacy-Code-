import AsyncStorage from '@react-native-async-storage/async-storage';

export const readStoredExercises = async () => {
  const storedValue = await AsyncStorage.getItem('exercises');
  return storedValue ? JSON.parse(storedValue) : [];
};
