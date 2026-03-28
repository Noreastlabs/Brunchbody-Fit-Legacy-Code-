/* eslint-disable no-use-before-define */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { assertLocalOnlyMode } from '../../config/appMode';
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

assertLocalOnlyMode('calendar actions');


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
  const themesString = await AsyncStorage.getItem('themes');
  const themes = themesString ? JSON.parse(themesString) : [];
  dispatch({type: GET_THEMES, payload: themes});
  dispatch(getRepeatedThemes());
  return true;
};

export const addTheme = data => async dispatch => {
  dispatch({type: ADD_THEME, payload: data});
  return true;
};

export const editTheme = (id, data) => async dispatch => {
  dispatch({type: EDIT_THEME, payload: {id, data}});
  return true;
};

export const deleteTheme = id => async dispatch => {
  dispatch({type: DELETE_THEME, payload: {id}});
  return true;
};

export const getRepeatedThemes = () => async dispatch => {
  dispatch({type: SET_THEME_WITH_FREQUENCY, payload: null});
  return true;
};

export const addRepeatedTheme = data => async dispatch => {
  await dispatch({type: ADD_REPEATED_THEME, payload: data});
  await dispatch({type: SET_THEME_WITH_FREQUENCY, payload: null});
  return true;
};

export const editRepeatedTheme = (id, data) => async dispatch => {
  await dispatch({type: EDIT_REPEATED_THEME, payload: {id, data}});
  await dispatch({type: SET_THEME_WITH_FREQUENCY, payload: null});
  return true;
};
