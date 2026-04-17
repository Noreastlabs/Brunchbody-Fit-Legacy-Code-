import AsyncStorage from '@react-native-async-storage/async-storage';
import { assertLocalOnlyMode } from '../../config/appMode';
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
import {getJSON} from '../../utils/storageUtils';
import {STORAGE_KEYS} from '../../storage/mmkv/keys';

assertLocalOnlyMode('recreation actions');

const ROUTINES_STORAGE_KEY = 'routines';
const WORKOUTS_STORAGE_KEY = 'workouts';

const readStoredRoutines = async () => {
  const routinesString = await AsyncStorage.getItem(ROUTINES_STORAGE_KEY);
  return routinesString ? JSON.parse(routinesString) : [];
};

const readStoredBrunchBodyPlans = () =>
  getJSON(STORAGE_KEYS.PLANS.BRUNCH_BODY) || [];

const findBrunchBodyPlan = (plans, id) =>
  plans.find(item => item.name === id || item.id === id);

// Preserve the legacy loose-equality week match for mixed string/number data.
// eslint-disable-next-line eqeqeq
const findBrunchBodyWeek = (plan, week) =>
  plan.weeksData.find(w => Number(w.week) == week);

const readStoredWorkouts = async () => {
  const workoutsString = await AsyncStorage.getItem(WORKOUTS_STORAGE_KEY);
  return workoutsString ? JSON.parse(workoutsString) : [];
};

const dispatchWeekPlanSelection = (dispatch, id, week) =>
  dispatch({type: GET_WEEK_PLAN, payload: {id, week}});

// Routines and routine tasks
export const getRoutines = () => async dispatch => {
  const routines = await readStoredRoutines();
  dispatch({type: GET_ROUTINES, payload: routines});
  return true;
};

export const addRoutine = data => async dispatch => {
  await dispatch({type: ADD_ROUTINE, payload: data});
  return true;
};

export const deleteRoutine = id => async dispatch => {
  await dispatch({type: DELETE_ROUTINE, payload: {id}});
  return true;
};

export const getRoutineTasks = id => async dispatch => {
  await dispatch({type: GET_ROUTINE_ITEMS, payload: {id}});
  return true;
};

export const addRoutineTask = (id, data) => async dispatch => {
  await dispatch({type: ADD_ROUTINE_ITEMS, payload: {id, data}});
  return true;
};

export const editRoutineTask = data => async dispatch => {
  await dispatch({type: EDIT_ROUTINE_ITEMS, payload: data});
  return true;
};

export const deleteRoutineTask = data => async dispatch => {
  await dispatch({type: DELETE_ROUTINE_ITEMS, payload: data});
  return true;
};

// Custom plans and week plans
export const getCustomPlans = () => async dispatch => {
  dispatch({type: GET_CUSTOM_PLANS, payload: []});
  return true;
};

export const addCustomPlan = data => async dispatch => {
  await dispatch({type: ADD_CUSTOM_PLANS, payload: data});
  return true;
};

export const deleteCustomPlan = id => async dispatch => {
  await dispatch({type: DELETE_CUSTOM_PLANS, payload: {id}});
  return true;
};

export const getWeekPlans = (id, week) => async dispatch => {
  await dispatchWeekPlanSelection(dispatch, id, week);
  return true;
};

export const addWeekPlan = (id, data) => async dispatch => {
  await dispatch({type: ADD_WEEK_PLAN, payload: {id, data}});
  await dispatchWeekPlanSelection(dispatch, id, data.week);
  return true;
};

export const editWeekPlan = (id, weekId, data) => async dispatch => {
  await dispatch({type: EDIT_WEEK_PLAN, payload: {id, weekId, data}});
  await dispatchWeekPlanSelection(dispatch, id, data.week);
  return true;
};

// Frozen adjacent legacy branches
export const getBrunchBodyPlans = () => async dispatch => {
  const brunchPlans = readStoredBrunchBodyPlans();
  dispatch({type: GET_BRUNCH_BODY_PLANS, payload: brunchPlans});
  return true;
};

export const getBrunchBodyWeekPlan = (id, week) => async dispatch => {
  const brunchPlans = readStoredBrunchBodyPlans();
  const weekPlan = findBrunchBodyPlan(brunchPlans, id);

  if (!weekPlan) {
    console.warn(`Plan with id/name "${id}" not found`);
    return null;
  }

  const filteredWeeksData = findBrunchBodyWeek(weekPlan, week);
  dispatch({type: GET_BRUNCH_BODY_WEEK_PLAN, payload: filteredWeeksData});
  return filteredWeeksData;
};

export const getWorkouts = () => async dispatch => {
  const workouts = await readStoredWorkouts();
  dispatch({type: GET_WORKOUTS, payload: workouts});
  return true;
};

export const addMyWorkout = data => async dispatch => {
  dispatch({type: ADD_WORKOUT, payload: {data}});
  return true;
};

export const editMyWorkout = (id, data) => async dispatch => {
  dispatch({type: EDIT_WORKOUT, payload: {id, ...data}});
  return true;
};

export const deleteMyWorkout = id => async dispatch => {
  dispatch({type: DELETE_WORKOUT, payload: {id}});
  return true;
};

export const addCompletedWorkout = data => async dispatch => {
  await dispatch({type: ADD_COMPLETED_WORKOUT, payload: data});
  return true;
};
