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

const createGeneratedId = () => Math.random().toString(36).slice(2);

const createRoutine = data => ({
  ...data,
  id: createGeneratedId(),
  items: [],
});

const createRoutineTask = data => ({
  ...data,
  id: createGeneratedId(),
});

const createCustomPlan = data => ({
  ...data,
  id: createGeneratedId(),
  week: [],
});

const createWeekPlanEntry = data => ({
  ...data,
  id: createGeneratedId(),
});

const createWorkout = data => ({
  ...data,
  id: createGeneratedId(),
});

const copyItems = items => Array.from(items);

const findItemIndexById = (items, id) => items.findIndex(item => item.id === id);

const getRoutineById = (routines, id) => routines.find(routine => routine.id === id);

const getCustomPlanById = (customPlans, id) =>
  customPlans.find(customPlan => customPlan.id === id);

const replaceItemAtIndex = (items, index, nextItem) => {
  const nextItems = copyItems(items);
  nextItems[index] = nextItem;
  return nextItems;
};

const mergeItemAtIndex = (items, index, data) => {
  const nextItems = copyItems(items);
  nextItems[index] = {...nextItems[index], ...data};
  return nextItems;
};

const removeItemAtIndex = (items, index) => {
  const nextItems = copyItems(items);
  nextItems.splice(index, 1);
  return nextItems;
};

const appendGeneratedItem = (items, data, createItem) => {
  const nextItems = copyItems(items);
  nextItems.push(createItem(data));
  return nextItems;
};

const updateRoutineItems = (routines, routineId, updateItems) => {
  const nextRoutines = copyItems(routines);
  const routineIndex = findItemIndexById(nextRoutines, routineId);
  const nextRoutineItems = updateItems(nextRoutines[routineIndex].items);

  nextRoutines[routineIndex].items = nextRoutineItems;

  return {nextRoutines, nextRoutineItems};
};

const updateCustomPlanWeeks = (customPlans, customPlanId, updateWeeks) => {
  const nextCustomPlans = copyItems(customPlans);
  const customPlanIndex = findItemIndexById(nextCustomPlans, customPlanId);
  const nextWeeks = updateWeeks(nextCustomPlans[customPlanIndex].week);

  nextCustomPlans[customPlanIndex].week = nextWeeks;

  return {nextCustomPlans, nextWeeks};
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
        routines: [...state.routines, createRoutine(action.payload)],
      };
    }
    case DELETE_ROUTINE: {
      const index = findItemIndexById(state.routines, action.payload.id);
      const nextRoutines = removeItemAtIndex(state.routines, index);

      return {
        ...state,
        routines: nextRoutines,
      };
    }
    case GET_ROUTINE_ITEMS: {
      const routine = getRoutineById(state.routines, action.payload.id);

      return {
        ...state,
        // routineTasks: action.payload.sort((a, b) => a.createdOn - b.createdOn),
        routineTasks: routine.items,
      };
    }
    case ADD_ROUTINE_ITEMS: {
      const {nextRoutines, nextRoutineItems} = updateRoutineItems(
        state.routines,
        action.payload.id,
        routineItems =>
          appendGeneratedItem(
            routineItems,
            action.payload.data,
            createRoutineTask,
          ),
      );

      return {
        ...state,
        routines: nextRoutines,
        routineTasks: nextRoutineItems,
      };
    }
    case EDIT_ROUTINE_ITEMS: {
      const {nextRoutines, nextRoutineItems} = updateRoutineItems(
        state.routines,
        action.payload.routine_id,
        routineItems => {
          const itemIndex = findItemIndexById(
            routineItems,
            action.payload.task_id,
          );
          return replaceItemAtIndex(routineItems, itemIndex, action.payload.data);
        },
      );

      return {
        ...state,
        routines: nextRoutines,
        routineTasks: nextRoutineItems,
      };
    }
    case DELETE_ROUTINE_ITEMS: {
      const {nextRoutines, nextRoutineItems} = updateRoutineItems(
        state.routines,
        action.payload.routine_id,
        routineItems => {
          const itemIndex = findItemIndexById(
            routineItems,
            action.payload.task_id,
          );
          return removeItemAtIndex(routineItems, itemIndex);
        },
      );

      return {
        ...state,
        routines: nextRoutines,
        routineTasks: nextRoutineItems,
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
        customPlans: [...state.customPlans, createCustomPlan(action.payload)],
      };
    }
    case DELETE_CUSTOM_PLANS: {
      const index = findItemIndexById(state.customPlans, action.payload.id);
      const nextCustomPlans = removeItemAtIndex(state.customPlans, index);

      return {
        ...state,
        customPlans: nextCustomPlans,
      };
    }
    case GET_BRUNCH_BODY_WEEK_PLAN: {
      return {
        ...state,
        weekPlan: action.payload,
      };
    }
    case GET_WEEK_PLAN: {
      const customPlan = getCustomPlanById(state.customPlans, action.payload.id);
      const plan = customPlan.week.find(i => i.week == action.payload.week);

      return {
        ...state,
        weekPlan: plan || {},
      };
    }
    case ADD_WEEK_PLAN: {
      const {nextCustomPlans, nextWeeks} = updateCustomPlanWeeks(
        state.customPlans,
        action.payload.id,
        weekPlans =>
          appendGeneratedItem(
            weekPlans,
            action.payload.data,
            createWeekPlanEntry,
          ),
      );

      return {
        ...state,
        customPlans: nextCustomPlans,
        weekPlan: nextWeeks,
      };
    }
    case EDIT_WEEK_PLAN: {
      const {nextCustomPlans, nextWeeks} = updateCustomPlanWeeks(
        state.customPlans,
        action.payload.id,
        weekPlans => {
          const itemIndex = findItemIndexById(weekPlans, action.payload.weekId);
          return mergeItemAtIndex(weekPlans, itemIndex, action.payload.data);
        },
      );

      return {
        ...state,
        customPlans: nextCustomPlans,
        weekPlan: nextWeeks,
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
        workouts: appendGeneratedItem(
          state.workouts,
          action.payload.data,
          createWorkout,
        ),
      };
    }
    case EDIT_WORKOUT: {
      const index = findItemIndexById(state.workouts, action.payload.id);
      const nextWorkouts = mergeItemAtIndex(
        state.workouts,
        index,
        action.payload,
      );

      return {
        ...state,
        workouts: nextWorkouts,
      };
    }
    case DELETE_WORKOUT: {
      const index = findItemIndexById(state.workouts, action.payload.id);
      const nextWorkouts = removeItemAtIndex(state.workouts, index);

      return {
        ...state,
        workouts: nextWorkouts,
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
