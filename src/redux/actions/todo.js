import { assertLocalOnlyMode } from '../../config/appMode';
import {
  ADD_TODO_TASK,
  DELETE_TODO_TASK,
  EDIT_TODO_TASK,
  GET_TODO_TASKS,
} from '../constants';
import { readStoredTodos } from './todoStorage';

assertLocalOnlyMode('todo actions');

export const getTodo = () => async dispatch => {
  const todos = await readStoredTodos();
  dispatch({type: GET_TODO_TASKS, payload: todos});
  return true;
};

export const addTodo = data => async dispatch => {
  dispatch({type: ADD_TODO_TASK, payload: data});
  return true;
};

export const editTodo = (id, data) => async dispatch => {
  dispatch({type: EDIT_TODO_TASK, payload: {id, data}});
  return true;
};

export const deleteTodo = id => async dispatch => {
  dispatch({type: DELETE_TODO_TASK, payload: {id}});
  return true;
};
