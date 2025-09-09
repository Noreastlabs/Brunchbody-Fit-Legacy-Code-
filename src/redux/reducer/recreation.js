/* eslint-disable eqeqeq */
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

const initialState = {
  routines: [],
  routineTasks: [],
  customPlans: [],
  weekPlan: {},
  brunchBodyPlans: [],
  workouts: [],
  completedWorkouts: [],
};

const recreationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ROUTINES: {
      return {
        ...state,
        routines: action.payload,
      };
    }
    case ADD_ROUTINE: {
      return {
        ...state,
        routines: [
          ...state.routines,
          {
            ...action.payload,
            id: Math.random().toString(36).slice(2),
            items: [],
          },
        ],
      };
    }
    case DELETE_ROUTINE: {
      const temp = Array.from(state.routines);
      const index = temp.findIndex(i => i.id === action.payload.id);
      temp.splice(index, 1);

      return {
        ...state,
        routines: temp,
      };
    }
    case GET_ROUTINE_ITEMS: {
      const routine = state.routines.find(i => i.id === action.payload.id);

      return {
        ...state,
        // routineTasks: action.payload.sort((a, b) => a.createdOn - b.createdOn),
        routineTasks: routine.items,
      };
    }
    case ADD_ROUTINE_ITEMS: {
      const temp = Array.from(state.routines);
      const index = temp.findIndex(i => i.id === action.payload.id);
      const copyItems = Array.from(temp[index].items);
      copyItems.push({
        ...action.payload.data,
        id: Math.random().toString(36).slice(2),
      });
      temp[index].items = copyItems;

      return {
        ...state,
        routines: temp,
        routineTasks: copyItems,
      };
    }
    case EDIT_ROUTINE_ITEMS: {
      const temp = Array.from(state.routines);
      const routineIndex = temp.findIndex(
        i => i.id === action.payload.routine_id,
      );
      const copyItems = Array.from(temp[routineIndex].items);
      const itemIndex = copyItems.findIndex(
        i => i.id === action.payload.task_id,
      );
      copyItems[itemIndex] = action.payload.data;
      temp[routineIndex].items = copyItems;

      return {
        ...state,
        routines: temp,
        routineTasks: copyItems,
      };
    }
    case DELETE_ROUTINE_ITEMS: {
      const temp = Array.from(state.routines);
      const routineIndex = temp.findIndex(
        i => i.id === action.payload.routine_id,
      );
      const copyItems = Array.from(temp[routineIndex].items);
      const itemIndex = copyItems.findIndex(
        i => i.id === action.payload.task_id,
      );
      copyItems.splice(itemIndex, 1);
      temp[routineIndex].items = copyItems;

      return {
        ...state,
        routines: temp,
        routineTasks: copyItems,
      };
    }
    case GET_BRUNCH_BODY_PLANS: {
      return {
        ...state,
        brunchBodyPlans: action.payload,
      };
    }
    case GET_CUSTOM_PLANS: {
      return {
        ...state,
        customPlans: action.payload,
      };
    }
    case ADD_CUSTOM_PLANS: {
      return {
        ...state,
        customPlans: [
          ...state.customPlans,
          {
            ...action.payload,
            id: Math.random().toString(36).slice(2),
            week: [],
          },
        ],
      };
    }
    case DELETE_CUSTOM_PLANS: {
      const temp = Array.from(state.customPlans);
      const index = temp.findIndex(i => i.id === action.payload.id);
      temp.splice(index, 1);

      return {
        ...state,
        customPlans: temp,
      };
    }
    case GET_BRUNCH_BODY_WEEK_PLAN: {
      return {
        ...state,
        weekPlan: action.payload,
      };
    }
    case GET_WEEK_PLAN: {
      const temp = state.customPlans.find(i => i.id === action.payload.id);
      const plan = temp.week.find(i => i.week == action.payload.week);

      return {
        ...state,
        weekPlan: plan || {},
      };
    }
    case ADD_WEEK_PLAN: {
      const temp = Array.from(state.customPlans);
      const index = temp.findIndex(i => i.id === action.payload.id);
      const copyItems = Array.from(temp[index].week);
      copyItems.push({
        ...action.payload.data,
        id: Math.random().toString(36).slice(2),
      });
      temp[index].week = copyItems;

      return {
        ...state,
        customPlans: temp,
        weekPlan: copyItems,
      };
    }
    case EDIT_WEEK_PLAN: {
      const temp = Array.from(state.customPlans);
      const programIndex = temp.findIndex(i => i.id === action.payload.id);
      const copyItems = Array.from(temp[programIndex].week);
      const itemIndex = copyItems.findIndex(
        i => i.id === action.payload.weekId,
      );
      copyItems[itemIndex] = {...copyItems[itemIndex], ...action.payload.data};
      temp[programIndex].week = copyItems;

      return {
        ...state,
        customPlans: temp,
        weekPlan: copyItems,
      };
    }
    case GET_WORKOUTS: {
      return {
        ...state,
        workouts: action.payload,
      };
    }
    case ADD_WORKOUT: {
      return {
        ...state,
        workouts: [
          ...state.workouts,
          {
            ...action.payload.data,
            id: Math.random().toString(36).slice(2),
          },
        ],
      };
    }
    case EDIT_WORKOUT: {
      const temp = Array.from(state.workouts);
      const index = temp.findIndex(i => i.id === action.payload.id);
      temp[index] = {...temp[index], ...action.payload};

      return {
        ...state,
        workouts: temp,
      };
    }
    case DELETE_WORKOUT: {
      const temp = Array.from(state.workouts);
      const index = temp.findIndex(i => i.id === action.payload.id);
      temp.splice(index, 1);

      return {
        ...state,
        workouts: temp,
      };
    }
    case ADD_COMPLETED_WORKOUT: {
      return {
        ...state,
        completedWorkouts: [...state.completedWorkouts, action.payload],
      };
    }
    default:
      return state;
  }
};

export default recreationReducer;
