import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ADD_TODO_TASK,
  DELETE_TODO_TASK,
  EDIT_TODO_TASK,
  GET_TODO_TASKS,
} from '../constants';

export const getTodo = () => async dispatch => {
  const todosString = await AsyncStorage.getItem('todos');
  const todos = todosString ? JSON.parse(todosString) : [];
  dispatch({ type: GET_TODO_TASKS, payload: todos });
  return true;
};

export const addTodo = data => async dispatch => {
  // const idToken = await AsyncStorage.getItem('auth_token');
  // const refreshToken = await AsyncStorage.getItem('refresh_token');

  //   method: 'POST',
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

  //   method: 'POST',
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

  //   method: 'POST',
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
