import AsyncStorage from '@react-native-async-storage/async-storage';

export const getJsonItem = async (key, fallbackValue = null) => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : fallbackValue;
};

export const setJsonItem = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const removeJsonItem = async key => {
  await AsyncStorage.removeItem(key);
};
