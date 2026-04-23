import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GET_MEALS,
  GET_MEALS_DIRECTORY,
  GET_MEAL_CATEGORIES,
  GET_SUPPLEMENTS,
} from '../src/redux/constants';
import {
  getMealCategories,
  getMeals,
  getMealsDirectory,
  getSupplements,
} from '../src/redux/actions/nutrition';
import {
  readStoredMealCategories,
  readStoredMeals,
  readStoredMealsDirectory,
  readStoredSupplements,
} from '../src/redux/actions/nutritionStorage';

const storageReaders = [
  {
    label: 'meals',
    key: 'meals',
    read: readStoredMeals,
    thunk: getMeals,
    actionType: GET_MEALS,
    storedValue: [{id: 'meal-1', name: 'Lunch', items: []}],
  },
  {
    label: 'supplements',
    key: 'supplements',
    read: readStoredSupplements,
    thunk: getSupplements,
    actionType: GET_SUPPLEMENTS,
    storedValue: [{id: 'supp-1', name: 'Omega 3', items: []}],
  },
  {
    label: 'meal categories',
    key: 'meal_categories',
    read: readStoredMealCategories,
    thunk: getMealCategories,
    actionType: GET_MEAL_CATEGORIES,
    storedValue: [{id: 'cat-1', title: 'Protein'}],
  },
  {
    label: 'meals directory',
    key: 'meals_directory',
    read: readStoredMealsDirectory,
    thunk: getMealsDirectory,
    actionType: GET_MEALS_DIRECTORY,
    storedValue: [{id: 'dir-1', name: 'Chicken Breast'}],
  },
];

describe('Nutrition storage boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each(storageReaders)(
    '$label reader uses the expected key and returns stored JSON unchanged',
    async ({key, read, storedValue}) => {
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedValue));

      await expect(read()).resolves.toEqual(storedValue);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
      expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    },
  );

  test.each(storageReaders)(
    '$label reader falls back to an empty array when storage is missing',
    async ({key, read}) => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      await expect(read()).resolves.toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
      expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    },
  );

  test.each(storageReaders)(
    '$label reader removes malformed JSON and falls back to an empty array',
    async ({key, read}) => {
      AsyncStorage.getItem.mockResolvedValueOnce('not-json');

      await expect(read()).resolves.toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
      expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(key);
    },
  );

  test.each(storageReaders)(
    '$label reader removes non-array payloads and falls back to an empty array',
    async ({key, read}) => {
      AsyncStorage.getItem.mockResolvedValueOnce(
        JSON.stringify({id: `${key}-invalid`}),
      );

      await expect(read()).resolves.toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
      expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(key);
    },
  );

  test('malformed meals repair is key-scoped and does not wipe unrelated local data', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('not-json');

    await expect(readStoredMeals()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('meals');
    expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('meals');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalledWith('supplements');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalledWith('meal_categories');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalledWith('meals_directory');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalledWith('user_profile');
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['meals'], undefined);
    expect(AsyncStorage.multiRemove).not.toHaveBeenCalledWith(
      expect.arrayContaining(['supplements']),
      expect.anything(),
    );
    expect(AsyncStorage.multiRemove).not.toHaveBeenCalledWith(
      expect.arrayContaining(['meal_categories']),
      expect.anything(),
    );
    expect(AsyncStorage.multiRemove).not.toHaveBeenCalledWith(
      expect.arrayContaining(['meals_directory']),
      expect.anything(),
    );
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(AsyncStorage.clear).not.toHaveBeenCalled();
  });

  test('getMeals reads meals and dispatches the legacy Redux contract', async () => {
    const dispatch = jest.fn();
    const savedMeals = [{id: 'meal-1', name: 'Lunch', items: []}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(savedMeals));

    await expect(getMeals()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('meals');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_MEALS,
      payload: savedMeals,
    });
  });

  test('getMeals falls back to an empty array when meals storage is missing', async () => {
    const dispatch = jest.fn();

    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await expect(getMeals()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('meals');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_MEALS,
      payload: [],
    });
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });

  test('getSupplements reads supplements and dispatches the legacy Redux contract', async () => {
    const dispatch = jest.fn();
    const savedSupplements = [{id: 'supp-1', name: 'Omega 3', items: []}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(savedSupplements));

    await expect(getSupplements()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('supplements');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_SUPPLEMENTS,
      payload: savedSupplements,
    });
  });

  test('getMealCategories reads meal_categories and dispatches the legacy Redux contract', async () => {
    const dispatch = jest.fn();
    const savedCategories = [{id: 'cat-1', title: 'Protein'}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(savedCategories));

    await expect(getMealCategories()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('meal_categories');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_MEAL_CATEGORIES,
      payload: savedCategories,
    });
  });

  test('getMealsDirectory reads meals_directory and dispatches the legacy Redux contract', async () => {
    const dispatch = jest.fn();
    const savedDirectory = [{id: 'dir-1', name: 'Chicken Breast'}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(savedDirectory));

    await expect(getMealsDirectory()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('meals_directory');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_MEALS_DIRECTORY,
      payload: savedDirectory,
    });
  });

  test('nutrition storage readers fall back to empty arrays when keys are missing', async () => {
    const dispatch = jest.fn();

    AsyncStorage.getItem
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    await expect(getSupplements()(dispatch)).resolves.toBe(true);
    await expect(getMealCategories()(dispatch)).resolves.toBe(true);
    await expect(getMealsDirectory()(dispatch)).resolves.toBe(true);

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: GET_SUPPLEMENTS,
      payload: [],
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: GET_MEAL_CATEGORIES,
      payload: [],
    });
    expect(dispatch).toHaveBeenNthCalledWith(3, {
      type: GET_MEALS_DIRECTORY,
      payload: [],
    });
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });

  test.each(storageReaders)(
    '$label thunk repairs malformed JSON and preserves the legacy Redux contract',
    async ({key, thunk, actionType}) => {
      const dispatch = jest.fn();

      AsyncStorage.getItem.mockResolvedValueOnce('not-json');

      await expect(thunk()(dispatch)).resolves.toBe(true);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
      expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(key);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionType,
        payload: [],
      });
    },
  );

  test.each(storageReaders)(
    '$label thunk repairs non-array payloads and preserves the legacy Redux contract',
    async ({key, thunk, actionType}) => {
      const dispatch = jest.fn();

      AsyncStorage.getItem.mockResolvedValueOnce(
        JSON.stringify({id: `${key}-invalid`}),
      );

      await expect(thunk()(dispatch)).resolves.toBe(true);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
      expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(key);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionType,
        payload: [],
      });
    },
  );
});
