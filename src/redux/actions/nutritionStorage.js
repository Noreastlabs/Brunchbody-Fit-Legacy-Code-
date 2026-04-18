import {getJsonItem} from '../../storage/asyncStorageJson';

export const readStoredMeals = () => getJsonItem('meals', []);

export const readStoredSupplements = () => getJsonItem('supplements', []);

export const readStoredMealCategories = () =>
  getJsonItem('meal_categories', []);

export const readStoredMealsDirectory = () =>
  getJsonItem('meals_directory', []);
