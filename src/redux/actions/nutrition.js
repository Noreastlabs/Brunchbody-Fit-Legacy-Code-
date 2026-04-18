import { assertLocalOnlyMode } from '../../config/appMode';
import {
  ADD_MEAL,
  ADD_MEAL_ITEMS,
  ADD_SUPPLEMENT,
  ADD_SUPPLEMENT_ITEMS,
  DELETE_MEAL,
  DELETE_MEAL_ITEMS,
  DELETE_SUPPLEMENT,
  DELETE_SUPPLEMENT_ITEMS,
  EDIT_MEAL_ITEMS,
  EDIT_SUPPLEMENT_ITEMS,
  GET_MEALS,
  GET_MEALS_DIRECTORY,
  GET_MEAL_CATEGORIES,
  GET_MEAL_ITEMS,
  GET_SUPPLEMENTS,
  GET_SUPPLEMENT_ITEMS,
  SET_MEAL_ITEMS,
  SET_SUPPLEMENT_ITEMS,
} from '../constants';
import {
  readStoredMealCategories,
  readStoredMeals,
  readStoredMealsDirectory,
  readStoredSupplements,
} from './nutritionStorage';

assertLocalOnlyMode('nutrition actions');

export const getMeals = () => async dispatch => {
  const meals = await readStoredMeals();
  dispatch({type: GET_MEALS, payload: meals});
  return true;
};

export const addMeal = data => async dispatch => {
  await dispatch({type: ADD_MEAL, payload: data});
  return true;
};

export const deleteMeal = id => async dispatch => {
  await dispatch({type: DELETE_MEAL, payload: {id}});
  return true;
};

export const getMealItems = id => async dispatch => {
  await dispatch({type: GET_MEAL_ITEMS, payload: {id}});
  return true;
};

export const setMealItems = data => async dispatch => {
  await dispatch({type: SET_MEAL_ITEMS, payload: data});
  return true;
};

export const addMealItems = (id, data) => async dispatch => {
  await dispatch({type: ADD_MEAL_ITEMS, payload: {id, data}});
  return true;
};

export const editMealItem = data => async dispatch => {
  await dispatch({type: EDIT_MEAL_ITEMS, payload: data});
  return true;
};

export const deleteMealItem = data => async dispatch => {
  await dispatch({type: DELETE_MEAL_ITEMS, payload: data});
  return true;
};

export const setSupplementItems = data => async dispatch => {
  await dispatch({type: SET_SUPPLEMENT_ITEMS, payload: data});
  return true;
};

export const getSupplements = () => async dispatch => {
  const supplements = await readStoredSupplements();
  dispatch({type: GET_SUPPLEMENTS, payload: supplements});
  return true;
};

export const addSupplement = data => async dispatch => {
  await dispatch({type: ADD_SUPPLEMENT, payload: data});
  return true;
};

export const deleteSupplement = id => async dispatch => {
  await dispatch({type: DELETE_SUPPLEMENT, payload: {id}});
  return true;
};

export const getSupplementItems = id => async dispatch => {
  await dispatch({type: GET_SUPPLEMENT_ITEMS, payload: {id}});
  return true;
};

export const addSupplementItems = (id, data) => async dispatch => {
  await dispatch({type: ADD_SUPPLEMENT_ITEMS, payload: {id, data}});
  return true;
};

export const editSupplementItem = data => async dispatch => {
  await dispatch({type: EDIT_SUPPLEMENT_ITEMS, payload: data});
  return true;
};

export const deleteSupplementItem = data => async dispatch => {
  await dispatch({type: DELETE_SUPPLEMENT_ITEMS, payload: data});
  return true;
};

export const getMealCategories = () => async dispatch => {
  const categories = await readStoredMealCategories();
  dispatch({type: GET_MEAL_CATEGORIES, payload: categories});
  return true;
};

export const getMealsDirectory = () => async dispatch => {
  const directory = await readStoredMealsDirectory();
  dispatch({type: GET_MEALS_DIRECTORY, payload: directory});
  return true;
};
