/* eslint-disable no-use-before-define */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ADD_REPEATED_THEME,
  ADD_THEME,
  CLEAR_CURRENT_THEME,
  CLEAR_THEME_DAYS,
  DELETE_THEME,
  EDIT_REPEATED_THEME,
  EDIT_THEME,
  GET_THEMES,
  SET_REPEATED_THEME,
  SET_THEME,
  SET_THEME_WITH_FREQUENCY,
} from '../constants';
import {serverUrl} from '../../config';

export const setTheme = data => async dispatch => {
  dispatch({type: SET_THEME, payload: data});
  return true;
};

export const changeRepeatedTheme = data => async dispatch => {
  dispatch({type: SET_REPEATED_THEME, payload: data});
  return true;
};

export const clearCurrentTheme = () => async dispatch => {
  dispatch({type: CLEAR_CURRENT_THEME});
  return true;
};

export const updateThemesWithFrequency = val => async dispatch => {
  dispatch({type: SET_THEME_WITH_FREQUENCY, daysInCurrentMonth: val});
  return true;
};

export const clearThemeDays = data => async dispatch => {
  dispatch({type: CLEAR_THEME_DAYS, payload: data});
  return true;
};

export const getThemes = () => async dispatch => {
  const idToken = await AsyncStorage.getItem('auth_token');
  const refreshToken = await AsyncStorage.getItem('refresh_token');
  const lastUpdatedTime = await AsyncStorage.getItem('last_updated_time');
  const lastFetchedTimeThemes = await AsyncStorage.getItem(
    'last_fetched_time_themes',
  );

  if (
    lastFetchedTimeThemes == null ||
    (lastUpdatedTime !== null &&
      parseInt(lastUpdatedTime, 10) - parseInt(lastFetchedTimeThemes, 10) > 0)
  ) {
    console.log('Inside getThemes', lastFetchedTimeThemes - lastUpdatedTime);
    const request = await axios({
      method: 'GET',
      baseURL: serverUrl,
      url: `api/user/getThemes`,
      headers: {
        auth_token: idToken,
        refresh_token: refreshToken,
      },
    })
      .then(res => res.data)
      .catch(err => err.response.data);

    if (request.success) {
      AsyncStorage.setItem(
        'last_fetched_time_themes',
        new Date().getTime().toString(),
      );
      dispatch({type: GET_THEMES, payload: request.result});
      dispatch(getRepeatedThemes());
      return true;
    }

    return request.result || 'Something went wrong.';
  }

  console.log('No new Data Found getThemes');
  return 'No new Data Found';
};

export const addTheme = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: 'api/user/addTheme',
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  dispatch({type: ADD_THEME, payload: data});
  return true;
  // }

  // return request.result || 'Something went wrong.';
};

export const editTheme = (id, data) => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: `api/user/editTheme/${id}`,
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  dispatch({type: EDIT_THEME, payload: {id, data}});
  return true;
  // }

  // return request.result || 'Something went wrong.';
};

export const deleteTheme = id => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: `api/user/deleteTheme/${id}`,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  dispatch({type: DELETE_THEME, payload: {id}});
  return true;
  // }

  // return 'Something went wrong.';
};

export const getRepeatedThemes = () => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');
  // const lastUpdatedTime = await AsyncStorage.getItem('last_updated_time');
  // const lastFetchedTimeRepeatedThemes = await AsyncStorage.getItem(
  //   'last_fetched_time_repeated_themes',
  // );
  // console.log('Inside getRepeatedThemes');
  // if (
  //   lastFetchedTimeRepeatedThemes == null ||
  //   (lastUpdatedTime !== null &&
  //     parseInt(lastUpdatedTime, 10) -
  //       parseInt(lastFetchedTimeRepeatedThemes, 10) >
  //       0)
  // ) {
  //   console.log(
  //     'Inside getRepeatedThemes',
  //     lastFetchedTimeRepeatedThemes - lastUpdatedTime,
  //   );

  //   const request = await axios({
  //     method: 'GET',
  //     baseURL: serverUrl,
  //     url: `api/user/getRepeatedThemes`,
  //     headers: {
  //       auth_token: idToken,
  //       refresh_token: refreshToken,
  //     },
  //   })
  //     .then(res => res.data)
  //     .catch(err => err.response.data);

  //   if (request.success) {
  dispatch({type: SET_THEME_WITH_FREQUENCY, payload: null});
  return true;
  //   }

  //   return request.result || 'Something went wrong.';
  // }
  // console.log('No new Data Found getRepeatedThemes');
  // return 'No new Data Found';
};

export const addRepeatedTheme = data => async dispatch => {
  await dispatch({type: ADD_REPEATED_THEME, payload: data});
  await dispatch({type: SET_THEME_WITH_FREQUENCY, payload: null});
  return true;
};

export const editRepeatedTheme = (id, data) => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: `api/user/editRepeatedTheme/${id}`,
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  // dispatch(getRepeatedThemes());
  await dispatch({type: EDIT_REPEATED_THEME, payload: {id, data}});
  await dispatch({type: SET_THEME_WITH_FREQUENCY, payload: null});
  return true;
  // }

  // return request.result || 'Something went wrong.';
};
