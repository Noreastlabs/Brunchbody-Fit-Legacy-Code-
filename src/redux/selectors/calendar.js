const EMPTY_ARRAY = Object.freeze([]);
const EMPTY_OBJECT = Object.freeze({});

const selectAuthState = state => state?.auth || EMPTY_OBJECT;
const selectTodoState = state => state?.todo || EMPTY_OBJECT;
const selectCalendarState = state => state?.calendar || EMPTY_OBJECT;

export const selectCalendarUser = state =>
  selectAuthState(state).user || EMPTY_OBJECT;

// Preserve the legacy calendar/todo ownership seam under the `todo` slice.
export const selectCalendarTodoTasks = state =>
  selectTodoState(state).todoTasks || EMPTY_ARRAY;

export const selectCalendarMyThemes = state =>
  selectCalendarState(state).themes || EMPTY_ARRAY;

export const selectCalendarCurrentTheme = state =>
  selectCalendarState(state).currentTheme || EMPTY_OBJECT;

export const selectCalendarRepeatedTheme = state =>
  selectCalendarState(state).repeatedTheme || EMPTY_OBJECT;

export const selectCalendarThemesWithFrequency = state =>
  selectCalendarState(state).themesWithFrequency || EMPTY_OBJECT;

export const selectCalendarClearedThemeDays = state =>
  selectCalendarState(state).clearedThemeDays || EMPTY_OBJECT;
