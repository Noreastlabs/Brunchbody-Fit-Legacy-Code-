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
import { readStoredThemes } from './calendarThemeStorage';

assertLocalOnlyMode('calendar actions');

const recomputeRepeatedThemes = dispatch =>
  dispatch({type: SET_THEME_WITH_FREQUENCY, payload: null});

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
  const themes = await readStoredThemes();
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
  recomputeRepeatedThemes(dispatch);
  return true;
};

export const addRepeatedTheme = data => async dispatch => {
  await dispatch({type: ADD_REPEATED_THEME, payload: data});
  await recomputeRepeatedThemes(dispatch);
  return true;
};

export const editRepeatedTheme = (id, data) => async dispatch => {
  await dispatch({type: EDIT_REPEATED_THEME, payload: {id, data}});
  await recomputeRepeatedThemes(dispatch);
  return true;
};

// Re-export calendar-facing todo names while the legacy todo domain keeps
// owning the thunk implementation, storage key, and persisted reducer slice.
export {
  addTodo as addCalendarTodoTask,
  deleteTodo as deleteCalendarTodoTask,
  editTodo as editCalendarTodoTask,
  getTodo as getCalendarTodoTasks,
} from './todo';
