import {
  ADD_TODO_TASK,
  DELETE_TODO_TASK,
  EDIT_TODO_TASK,
  GET_TODO_TASKS,
} from '../constants';

const initialState = {
  todoTasks: [],
};

const createTodoTask = todoTask => ({
  ...todoTask,
  id: Math.random().toString(36).slice(2),
});

const editTodoTasks = (todoTasks, {id, data}) => {
  const nextTodoTasks = Array.from(todoTasks);
  const index = nextTodoTasks.findIndex(item => item.id === id);
  nextTodoTasks[index] = {...nextTodoTasks[index], ...data};
  return nextTodoTasks;
};

const deleteTodoTaskById = (todoTasks, id) => {
  const nextTodoTasks = Array.from(todoTasks);
  const index = nextTodoTasks.findIndex(item => item.id === id);
  nextTodoTasks.splice(index, 1);
  return nextTodoTasks;
};

const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TODO_TASKS: {
      return {
        ...state,
        todoTasks: action.payload,
      };
    }
    case ADD_TODO_TASK: {
      return {
        ...state,
        todoTasks: [...state.todoTasks, createTodoTask(action.payload)],
      };
    }
    case EDIT_TODO_TASK: {
      return {
        ...state,
        todoTasks: editTodoTasks(state.todoTasks, action.payload),
      };
    }
    case DELETE_TODO_TASK: {
      return {
        ...state,
        todoTasks: deleteTodoTaskById(state.todoTasks, action.payload.id),
      };
    }
    default:
      return state;
  }
};

export default todoReducer;
