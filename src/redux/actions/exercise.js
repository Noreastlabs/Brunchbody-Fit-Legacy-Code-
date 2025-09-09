import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ADD_EXERCISE,
  DELETE_EXERCISE,
  EDIT_EXERCISE,
  GET_EXERCISES,
  GET_EXERCISE_DIRECTORY,
  MERGE_EXERCISES,
} from '../constants';

export const getExercises = () => async dispatch => {
  const exercisesString = await AsyncStorage.getItem('exercises');
  const exercises = exercisesString ? JSON.parse(exercisesString) : [];
  dispatch({ type: GET_EXERCISES, payload: exercises });
  return true;
};

export const addExercise = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  //   method: 'POST',
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

  //   method: 'POST',
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

  //   method: 'POST',
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
  const directoryString = await AsyncStorage.getItem('exercise_directory');
  const directory = directoryString ? JSON.parse(directoryString) : [];
  dispatch({ type: GET_EXERCISE_DIRECTORY, payload: directory });
  return true;
};

export const mergeExercises = () => async dispatch => {
  dispatch({type: MERGE_EXERCISES});
};
