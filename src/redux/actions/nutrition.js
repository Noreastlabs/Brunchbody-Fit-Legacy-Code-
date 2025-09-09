import AsyncStorage from '@react-native-async-storage/async-storage';
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

export const getMeals = () => async dispatch => {
  const mealsString = await AsyncStorage.getItem('meals');
  const meals = mealsString ? JSON.parse(mealsString) : [];
  dispatch({ type: GET_MEALS, payload: meals });
  return true;
};

export const addMeal = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  //   method: 'POST',
  //   url: 'api/user/addMeals',
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  // await dispatch(getMeals());
  await dispatch({type: ADD_MEAL, payload: data});
  return true;
  // }

  // return request.result ? request.result : 'Something went wrong.';
};

export const deleteMeal = id => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  //   method: 'POST',
  //   url: `api/user/deleteMeal/${id}`,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  // await dispatch(getMeals());
  await dispatch({type: DELETE_MEAL, payload: {id}});
  return true;
  // }

  // return 'Something went wrong.';
};

export const getMealItems = id => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  //   method: 'GET',
  //   url: `api/user/getMealItems/${id}`,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   dispatch({type: GET_MEAL_ITEMS, payload: request.result});
  //   return request.result;
  // }
  await dispatch({type: GET_MEAL_ITEMS, payload: {id}});
  return true;

  // return request.result ? request.result : 'Something went wrong.';
};

export const setMealItems = data => async dispatch => {
  await dispatch({type: SET_MEAL_ITEMS, payload: data});
  return true;
};

export const addMealItems = (id, data) => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  //   method: 'POST',
  //   url: `api/user/addMealItems/${id}`,
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   await dispatch(getMealItems(id));
  await dispatch({type: ADD_MEAL_ITEMS, payload: {id, data}});
  return true;
  // }

  // return request.result ? request.result : 'Something went wrong.';
};

export const editMealItem = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  //   method: 'POST',
  //   url: `api/user/editMealItem`,
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   await dispatch(getMealItems(data.meal_id));
  //   return true;
  // }

  await dispatch({type: EDIT_MEAL_ITEMS, payload: data});
  return true;

  // return request.result ? request.result : 'Something went wrong.';
};

export const deleteMealItem = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  //   method: 'POST',
  //   url: `api/user/deleteMealItem`,
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   await dispatch(getMealItems(data.meal_id));
  //   return true;
  // }

  await dispatch({type: DELETE_MEAL_ITEMS, payload: data});
  return true;

  // return 'Something went wrong.';
};

export const setSupplementItems = data => async dispatch => {
  await dispatch({type: SET_SUPPLEMENT_ITEMS, payload: data});
  return true;
};

export const getSupplements = () => async dispatch => {
  const supplementsString = await AsyncStorage.getItem('supplements');
  const supplements = supplementsString ? JSON.parse(supplementsString) : [];
  dispatch({ type: GET_SUPPLEMENTS, payload: supplements });
  return true;
};

export const addSupplement = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  //   method: 'POST',
  //   url: 'api/user/addSupplements',
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  // await dispatch(getSupplements());
  await dispatch({type: ADD_SUPPLEMENT, payload: data});
  return true;
  // }

  // return request.result ? request.result : 'Something went wrong.';
};

export const deleteSupplement = id => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  //   method: 'POST',
  //   url: `api/user/deleteSupplement/${id}`,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   await dispatch(getSupplements());
  await dispatch({type: DELETE_SUPPLEMENT, payload: {id}});
  return true;
  // }

  // return 'Something went wrong.';
};

export const getSupplementItems = id => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');
  // const lastUpdatedTime = await AsyncStorage.getItem('last_updated_time');
  // const lastFetchedTimeSupplementsItem = await AsyncStorage.getItem(
  //   'last_fetched_time_supplements_item',
  // );
  // if (
  //   lastFetchedTimeSupplementsItem == null ||
  //   (lastUpdatedTime !== null &&
  //     parseInt(lastUpdatedTime, 10) -
  //       parseInt(lastFetchedTimeSupplementsItem, 10) >
  //       0)
  // ) {
  //   console.log(
  //     'Inside getSupplementItems',
  //     lastFetchedTimeSupplementsItem - lastUpdatedTime,
  //   );

  //     method: 'GET',
  //     url: `api/user/getSupplementItems/${id}`,
  //     headers: {
  //       auth_token: idToken,
  //       refresh_token: refreshToken,
  //     },
  //   })
  //     .then(res => res.data)
  //     .catch(err => err.response.data);

  //   if (request.success) {
  //     dispatch({type: GET_SUPPLEMENT_ITEMS, payload: request.result});
  //     return request.result;
  //   }
  await dispatch({type: GET_SUPPLEMENT_ITEMS, payload: {id}});
  return true;

  //   return request.result ? request.result : false;
  // }
  // console.log('No new Data Found getSupplementItems');
  // return 'No new Data Found';
};

export const addSupplementItems = (id, data) => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  //   method: 'POST',
  //   url: `api/user/addSupplementItems/${id}`,
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   await dispatch(getSupplementItems(id));
  //   return true;
  // }

  await dispatch({type: ADD_SUPPLEMENT_ITEMS, payload: {id, data}});
  return true;

  // return request.result ? request.result : 'Something went wrong.';
};

export const editSupplementItem = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  //   method: 'POST',
  //   url: `api/user/editSupplementItem`,
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   await dispatch(getSupplementItems(data.supplement_id));
  //   return true;
  // }

  await dispatch({type: EDIT_SUPPLEMENT_ITEMS, payload: data});
  return true;

  // return request.result ? request.result : 'Something went wrong.';
};

export const deleteSupplementItem = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  //   method: 'POST',
  //   url: `api/user/deleteSupplementItem`,
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   await dispatch(getSupplementItems(data.supplement_id));
  //   return true;
  // }

  await dispatch({type: DELETE_SUPPLEMENT_ITEMS, payload: data});
  return true;

  // return 'Something went wrong.';
};

export const getMealCategories = () => async dispatch => {
  const categoriesString = await AsyncStorage.getItem('meal_categories');
  const categories = categoriesString ? JSON.parse(categoriesString) : [];
  dispatch({ type: GET_MEAL_CATEGORIES, payload: categories });
  return true;
};

export const getMealsDirectory = () => async dispatch => {
  const directoryString = await AsyncStorage.getItem('meals_directory');
  const directory = directoryString ? JSON.parse(directoryString) : [];
  dispatch({ type: GET_MEALS_DIRECTORY, payload: directory });
  return true;
};
