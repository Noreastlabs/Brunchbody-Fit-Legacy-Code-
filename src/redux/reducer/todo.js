import {
  ADD_TODO_TASK,
  DELETE_TODO_TASK,
  EDIT_TODO_TASK,
  GET_TODO_TASKS,
} from '../constants';

const initialState = {
  todoTasks: [],
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
        todoTasks: [
          ...state.todoTasks,
          { ...action.payload, id: Math.random().toString(36).slice(2) },
        ],
      };
    }
    case EDIT_TODO_TASK: {
      const temp = Array.from(state.todoTasks);
      const index = temp.findIndex(i => i.id === action.payload.id);
      temp[index] = { ...temp[index], ...action.payload.data };

      return {
        ...state,
        todoTasks: temp,
      };
    }
    case DELETE_TODO_TASK: {
      const temp = Array.from(state.todoTasks);
      const index = temp.findIndex(i => i.id === action.payload.id);
      temp.splice(index, 1);

      return {
        ...state,
        todoTasks: temp,
      };
    }
    default:
      return state;
  }
};

export default todoReducer;
