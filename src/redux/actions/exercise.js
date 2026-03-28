import AsyncStorage from '@react-native-async-storage/async-storage';
import { assertLocalOnlyMode } from '../../config/appMode';
import {
  ADD_EXERCISE,
  DELETE_EXERCISE,
  EDIT_EXERCISE,
  GET_EXERCISES,
  GET_EXERCISE_DIRECTORY,
  MERGE_EXERCISES,
} from '../constants';

assertLocalOnlyMode('exercise actions');


export const getExercises = () => async dispatch => {
  const exercisesString = await AsyncStorage.getItem('exercises');
  const exercises = exercisesString ? JSON.parse(exercisesString) : [];
  dispatch({type: GET_EXERCISES, payload: exercises});
  return true;
};

export const addExercise = data => async dispatch => {
  await dispatch({type: ADD_EXERCISE, payload: data});
  return true;
};

export const editExercise = (id, data) => async dispatch => {
  await dispatch({type: EDIT_EXERCISE, payload: {id, data}});
  return true;
};

export const deleteExercise = id => async dispatch => {
  await dispatch({type: DELETE_EXERCISE, payload: {id}});
  await dispatch({type: MERGE_EXERCISES});
  return true;
};

export const getExerciseDirectory = () => async dispatch => {
  const directoryString = await AsyncStorage.getItem('exercise_directory');
  const directory = directoryString ? JSON.parse(directoryString) : [];
  dispatch({type: GET_EXERCISE_DIRECTORY, payload: directory});
  return true;
};

export const mergeExercises = () => async dispatch => {
  dispatch({type: MERGE_EXERCISES});
};
