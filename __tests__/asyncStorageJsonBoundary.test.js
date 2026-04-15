import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getJsonItem,
  removeJsonItem,
  setJsonItem,
} from '../src/storage/asyncStorageJson';

describe('Shared AsyncStorage JSON helper boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getJsonItem returns parsed JSON when a stored value exists', async () => {
    const storedValue = [{id: 'meal-1', name: 'Lunch'}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedValue));

    await expect(getJsonItem('meals')).resolves.toEqual(storedValue);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('meals');
  });

  test('getJsonItem returns the provided fallback when storage is empty', async () => {
    const fallbackValue = [];

    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await expect(getJsonItem('meals', fallbackValue)).resolves.toBe(
      fallbackValue,
    );
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('meals');
  });

  test('setJsonItem writes the key with JSON.stringify(value)', async () => {
    const storedValue = [{id: 'supp-1', name: 'Omega 3'}];

    await setJsonItem('supplements', storedValue);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'supplements',
      JSON.stringify(storedValue),
    );
  });

  test('removeJsonItem delegates to AsyncStorage.removeItem', async () => {
    await removeJsonItem('meal_categories');

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('meal_categories');
  });
});
