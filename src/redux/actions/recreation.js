import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ADD_COMPLETED_WORKOUT,
  ADD_CUSTOM_PLANS,
  ADD_ROUTINE,
  ADD_ROUTINE_ITEMS,
  ADD_WEEK_PLAN,
  ADD_WORKOUT,
  DELETE_CUSTOM_PLANS,
  DELETE_ROUTINE,
  DELETE_ROUTINE_ITEMS,
  DELETE_WORKOUT,
  EDIT_ROUTINE_ITEMS,
  EDIT_WEEK_PLAN,
  EDIT_WORKOUT,
  GET_BRUNCH_BODY_PLANS,
  GET_BRUNCH_BODY_WEEK_PLAN,
  GET_CUSTOM_PLANS,
  GET_ROUTINES,
  GET_ROUTINE_ITEMS,
  GET_WEEK_PLAN,
  GET_WORKOUTS,
} from '../constants';
import { serverUrl } from '../../config';
import { getJSON } from '../../utils/storageUtils';
import { STORAGE_KEYS } from '../../storage/mmkv/keys';

export const getRoutines = () => async dispatch => {
  const idToken = await AsyncStorage.getItem('auth_token');
  const refreshToken = await AsyncStorage.getItem('refresh_token');

  const request = await axios({
    method: 'GET',
    baseURL: serverUrl,
    url: `api/user/getRoutines`,
    headers: {
      auth_token: idToken,
      refresh_token: refreshToken,
    },
  })
    .then(res => res.data)
    .catch(err => err.response.data);

  if (request.success) {
    dispatch({ type: GET_ROUTINES, payload: request.result });
    return true;
  }

  return request.result || 'Something went wrong.';
};

export const addRoutine = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: 'api/user/addRoutines',
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  await dispatch({ type: ADD_ROUTINE, payload: data });
  return true;
  // }

  // return request.result || 'Something went wrong.';
};

export const deleteRoutine = id => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: `api/user/deleteRoutine/${id}`,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  await dispatch({ type: DELETE_ROUTINE, payload: { id } });
  return true;
  // }

  // return 'Something went wrong.';
};

export const getRoutineTasks = id => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'GET',
  //   baseURL: serverUrl,
  //   url: `api/user/getRoutineTasks/${id}`,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   dispatch({type: GET_ROUTINE_ITEMS, payload: request.result});
  await dispatch({ type: GET_ROUTINE_ITEMS, payload: { id } });
  return true;
  // }

  // return request.result || 'Something went wrong.';
};

export const addRoutineTask = (id, data) => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: `api/user/addRoutineTask/${id}`,
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   await dispatch(getRoutineTasks(id));
  await dispatch({ type: ADD_ROUTINE_ITEMS, payload: { id, data } });
  return true;
  // }

  // return request.result || 'Something went wrong.';
};

export const editRoutineTask = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: `api/user/editRoutineTask`,
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   await dispatch(getRoutineTasks(data.routine_id));
  await dispatch({ type: EDIT_ROUTINE_ITEMS, payload: data });
  return true;
  // }

  // return request.result || 'Something went wrong.';
};

export const deleteRoutineTask = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: `api/user/deleteRoutineTask`,
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   await dispatch(getRoutineTasks(data.routine_id));
  await dispatch({ type: DELETE_ROUTINE_ITEMS, payload: data });
  return true;
  // }

  // return 'Something went wrong.';
};

export const getCustomPlans = () => async dispatch => {
  dispatch({ type: GET_CUSTOM_PLANS, payload: [] });
  return true;
};

export const addCustomPlan = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: 'api/user/addCustomPlan',
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   await dispatch(getCustomPlans());
  await dispatch({ type: ADD_CUSTOM_PLANS, payload: data });
  return true;
  // }

  // return request.result || 'Something went wrong.';
};

export const deleteCustomPlan = id => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: `api/user/deleteCustomPlan/${id}`,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   await dispatch(getCustomPlans());
  await dispatch({ type: DELETE_CUSTOM_PLANS, payload: { id } });
  return true;
  // }

  // return 'Something went wrong.';
};

export const getWeekPlans = (id, week) => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'GET',
  //   baseURL: serverUrl,
  //   url: `api/user/getWeekPlans/${id}/${week}`,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  await dispatch({ type: GET_WEEK_PLAN, payload: { id, week } });
  // if (Object.keys(request.result).length > 0) return true;
  return true;
  // }

  // return request.result || 'Something went wrong.';
};

export const addWeekPlan = (id, data) => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: `api/user/addWeekPlan/${id}`,
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  await dispatch({ type: ADD_WEEK_PLAN, payload: { id, data } });
  await dispatch({ type: GET_WEEK_PLAN, payload: { id, week: data.week } });
  return true;
  // }

  // return request.result || 'Something went wrong.';
};

export const editWeekPlan = (id, weekId, data) => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: `api/user/editWeekPlan/${id}/${weekID}`,
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   dispatch(getWeekPlans(id, data.week));
  await dispatch({ type: EDIT_WEEK_PLAN, payload: { id, weekId, data } });
  await dispatch({ type: GET_WEEK_PLAN, payload: { id, week: data.week } });
  return true;
  // }

  // return request.result || 'Something went wrong.';
};

export const getBrunchBodyPlans = () => async dispatch => {
  const idToken = await AsyncStorage.getItem('auth_token');
  const refreshToken = await AsyncStorage.getItem('refresh_token');

  const request = await axios({
    method: 'GET',
    baseURL: serverUrl,
    url: `api/user/getBrunchBodyPlans`,
    headers: {
      auth_token: idToken,
      refresh_token: refreshToken,
    },
  })
    .then(res => res.data)
    .catch(err => err.response.data);

  if (request.success) {
    dispatch({ type: GET_BRUNCH_BODY_PLANS, payload: request.result });
    return true;
  }

  return request.result || 'Something went wrong.';
};

export const getBrunchBodyWeekPlan = (id, week) => async dispatch => {
  const brunchPlans = getJSON(STORAGE_KEYS.PLANS.BRUNCH_BODY) || [];

  const weekPlan = brunchPlans.find(item => item.name === id || item.id === id);

  if (!weekPlan) {
    console.warn(`Plan with id/name "${id}" not found`);
    return null;
  }

  const filteredWeeksData = weekPlan.weeksData.find(
    w => Number(w.week) == week,
  );

  // const filteredPlan = {
  //   ...weekPlan,
  //   weeksData: filteredWeeksData,
  // };

  dispatch({ type: GET_BRUNCH_BODY_WEEK_PLAN, payload: filteredWeeksData });
  return filteredWeeksData;
};

export const getWorkouts = () => async dispatch => {
  const idToken = await AsyncStorage.getItem('auth_token');
  const refreshToken = await AsyncStorage.getItem('refresh_token');
  const lastUpdatedTime = await AsyncStorage.getItem('last_updated_time');
  const lastFetchedTimeWorkouts = await AsyncStorage.getItem(
    'last_fetched_time_workouts',
  );
  if (
    lastFetchedTimeWorkouts == null ||
    (lastUpdatedTime !== null &&
      parseInt(lastUpdatedTime, 10) - parseInt(lastFetchedTimeWorkouts, 10) > 0)
  ) {
    console.log(
      'Inside getWorkouts',
      lastFetchedTimeWorkouts - lastUpdatedTime,
    );

    const request = await axios({
      method: 'GET',
      baseURL: serverUrl,
      url: `api/user/getMyWorkouts`,
      headers: {
        auth_token: idToken,
        refresh_token: refreshToken,
      },
    })
      .then(res => res.data)
      .catch(err => err.response.data);

    if (request.success) {
      dispatch({ type: GET_WORKOUTS, payload: request.result });
      return true;
    }

    return request.result || 'Something went wrong.';
  }
  console.log('No new Data Found getWorkouts');
  return 'No new Data Found';
};

export const addMyWorkout = data => async dispatch => {
  console.log(data, 'data');
  dispatch({ type: ADD_WORKOUT, payload: { data } });
  return true;
};

export const editMyWorkout = (id, data) => async dispatch => {
  const idToken = await AsyncStorage.getItem('auth_token');
  const refreshToken = await AsyncStorage.getItem('refresh_token');

  const request = await axios({
    method: 'POST',
    baseURL: serverUrl,
    url: `api/user/editMyWorkout/${id}`,
    data,
    headers: {
      auth_token: idToken,
      refresh_token: refreshToken,
    },
  })
    .then(res => res.data)
    .catch(err => err.response.data);
  console.log('request: ', request);
  if (request.success) {
    dispatch({ type: EDIT_WORKOUT, payload: request.result });
    return true;
  }

  return request.result || 'Something went wrong.';
};

export const deleteMyWorkout = id => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: `api/user/deleteWorkout/${id}`,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  dispatch({ type: DELETE_WORKOUT, payload: { id } });
  return true;
  // }

  // return 'Something went wrong.';
};

export const addCompletedWorkout = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: 'api/user/addCustomPlan',
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  //   await dispatch(getCustomPlans());
  await dispatch({ type: ADD_COMPLETED_WORKOUT, payload: data });
  return true;
  // }

  // return request.result || 'Something went wrong.';
};
