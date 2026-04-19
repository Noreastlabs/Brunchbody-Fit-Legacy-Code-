import AsyncStorage from '@react-native-async-storage/async-storage';

const TODO_STORAGE_KEY = 'todos';

const discardStoredTodos = async () => {
  await AsyncStorage.removeItem(TODO_STORAGE_KEY);
  return [];
};

export const readStoredTodos = async () => {
  const todosString = await AsyncStorage.getItem(TODO_STORAGE_KEY);

  if (todosString == null) {
    return [];
  }

  let parsedTodos;

  try {
    parsedTodos = JSON.parse(todosString);
  } catch (error) {
    return discardStoredTodos();
  }

  if (!Array.isArray(parsedTodos)) {
    return discardStoredTodos();
  }

  return parsedTodos;
};
