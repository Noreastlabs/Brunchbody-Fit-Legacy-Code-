import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ADD_TODO_TASK,
  DELETE_TODO_TASK,
  EDIT_TODO_TASK,
  GET_TODO_TASKS,
} from '../constants';
import {serverUrl} from '../../config';

export const getTodo = () => async dispatch => {
  const idToken = await AsyncStorage.getItem('auth_token');
  const refreshToken = await AsyncStorage.getItem('refresh_token');
  const lastUpdatedTime = await AsyncStorage.getItem('last_updated_time');
  const lastFetchedTimeTodo = await AsyncStorage.getItem(
    'last_fetched_time_todo',
  );

  if (
    lastFetchedTimeTodo == null ||
    (lastUpdatedTime !== null &&
      parseInt(lastUpdatedTime, 10) - parseInt(lastFetchedTimeTodo, 10) > 0)
  ) {
    console.log('Inside getTodo', lastFetchedTimeTodo - lastUpdatedTime);
    const request = await axios({
      method: 'GET',
      baseURL: serverUrl,
      url: `api/user/getTodo`,
      headers: {
        auth_token: idToken,
        refresh_token: refreshToken,
      },
    })
      .then(res => res.data)
      .catch(err => err.response.data);

    if (request.success) {
      AsyncStorage.setItem(
        'last_fetched_time_todo',
        new Date().getTime().toString(),
      );
      dispatch({type: GET_TODO_TASKS, payload: request.result});
      return true;
    }

    return request.result ? request.result : 'Something went wrong.';
  }
  console.log('No new Data Found Todo');
  return 'No new Data Found';
};

export const addTodo = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: 'api/user/addTodo',
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  dispatch({type: ADD_TODO_TASK, payload: data});
  return true;
  // }

  // return request.result ? request.result : 'Something went wrong.';
};

export const editTodo = (id, data) => async dispatch => {
  console.log('id, data: ', id, data);
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: `api/user/updateTodo/${id}`,
  //   data,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  dispatch({type: EDIT_TODO_TASK, payload: {id, data}});
  return true;
  // }

  // return request.result ? request.result : 'Something went wrong.';
};

export const deleteTodo = id => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  // const request = await axios({
  //   method: 'POST',
  //   baseURL: serverUrl,
  //   url: `api/user/deleteTodo/${id}`,
  //   headers: {
  //     auth_token: idToken,
  //     refresh_token: refreshToken,
  //   },
  // })
  //   .then(res => res.data)
  //   .catch(err => err.response.data);

  // if (request.success) {
  dispatch({type: DELETE_TODO_TASK, payload: {id}});
  return true;
  // }

  // return 'Something went wrong.';
};
