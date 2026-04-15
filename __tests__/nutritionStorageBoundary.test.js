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

describe('Nutrition storage boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    await expect(getMeals()(dispatch)).resolves.toBe(true);
    await expect(getSupplements()(dispatch)).resolves.toBe(true);
    await expect(getMealCategories()(dispatch)).resolves.toBe(true);
    await expect(getMealsDirectory()(dispatch)).resolves.toBe(true);

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: GET_MEALS,
      payload: [],
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: GET_SUPPLEMENTS,
      payload: [],
    });
    expect(dispatch).toHaveBeenNthCalledWith(3, {
      type: GET_MEAL_CATEGORIES,
      payload: [],
    });
    expect(dispatch).toHaveBeenNthCalledWith(4, {
      type: GET_MEALS_DIRECTORY,
      payload: [],
    });
  });
});
