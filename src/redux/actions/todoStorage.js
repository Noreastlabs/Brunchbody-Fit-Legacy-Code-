import AsyncStorage from '@react-native-async-storage/async-storage';

const TODO_STORAGE_KEY = 'todos';

export const readStoredTodos = async () => {
  const todosString = await AsyncStorage.getItem(TODO_STORAGE_KEY);
  return todosString ? JSON.parse(todosString) : [];
};
