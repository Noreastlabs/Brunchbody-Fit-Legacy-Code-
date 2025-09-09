import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ADD_EXERCISE,
  DELETE_EXERCISE,
  EDIT_EXERCISE,
  GET_EXERCISES,
  GET_EXERCISE_DIRECTORY,
  MERGE_EXERCISES,
} from '../constants';
import {serverUrl} from '../../config';

export const getExercises = () => async dispatch => {
  const idToken = await AsyncStorage.getItem('auth_token');
  const refreshToken = await AsyncStorage.getItem('refresh_token');
  const lastUpdatedTime = await AsyncStorage.getItem('last_updated_time');
  const lastFetchedTimeExercises = await AsyncStorage.getItem(
    'last_fetched_time_exercises',
  );
  if (
    lastFetchedTimeExercises == null ||
    (lastUpdatedTime !== null &&
      parseInt(lastUpdatedTime, 10) - parseInt(lastFetchedTimeExercises, 10) >
        0)
  ) {
    console.log(
      'Inside getExercises',
      lastFetchedTimeExercises - lastUpdatedTime,
    );

    const request = await axios({
      method: 'GET',
      baseURL: serverUrl,
      url: `api/user/getExercises`,
      headers: {
        auth_token: idToken,
        refresh_token: refreshToken,
      },
    })
      .then(res => res.data)
      .catch(err => err.response.data);

    if (request.success) {
      dispatch({type: GET_EXERCISES, payload: request.result});
      return true;
    }

    return request.result || 'Something went wrong.';
  }

  console.log('No new Data Found getExercises');
  return 'No new Data Found';
};

export const addExercise = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: 'api/user/addExercise',
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  await dispatch({type: ADD_EXERCISE, payload: data});
  // return true;
  // }

  return true;
};

export const editExercise = (id, data) => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: `api/user/editExercise/${id}`,
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  await dispatch({type: EDIT_EXERCISE, payload: {id, data}});
  // return true;
  // }

  return true;
};

export const deleteExercise = id => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: `api/user/deleteExercise/${id}`,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  await dispatch({type: DELETE_EXERCISE, payload: {id}});
  await dispatch({type: MERGE_EXERCISES});
  // return true;
  // }

  return true;
};

export const getExerciseDirectory = () => async dispatch => {
  const idToken = await AsyncStorage.getItem('auth_token');
  const refreshToken = await AsyncStorage.getItem('refresh_token');

  const request = await axios({
    method: 'GET',
    baseURL: serverUrl,
    url: `api/user/getExerciseDirectory`,
    headers: {
      auth_token: idToken,
      refresh_token: refreshToken,
    },
  })
    .then(res => res.data)
    .catch(err => err.response.data);

  if (request.success) {
    dispatch({type: GET_EXERCISE_DIRECTORY, payload: request.result});
    return true;
  }

  return request.result || 'Something went wrong.';
};

export const mergeExercises = () => async dispatch => {
  dispatch({type: MERGE_EXERCISES});
};
