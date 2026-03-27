import todoReducer from '../src/redux/reducer/todo';
import nutritionReducer from '../src/redux/reducer/nutrition';
import recreationReducer from '../src/redux/reducer/recreation';
import calendarReducer from '../src/redux/reducer/calendar';
import authReducer from '../src/redux/reducer/auth';
import {
  ADD_MEAL,
  ADD_MEAL_ITEMS,
  ADD_ROUTINE,
  ADD_ROUTINE_ITEMS,
  ADD_SUPPLEMENT,
  ADD_SUPPLEMENT_ITEMS,
  ADD_THEME,
  ADD_TODO_TASK,
  ADD_WORKOUT,
  DELETE_MEAL,
  DELETE_MEAL_ITEMS,
  DELETE_ROUTINE,
  DELETE_ROUTINE_ITEMS,
  DELETE_SUPPLEMENT,
  DELETE_SUPPLEMENT_ITEMS,
  DELETE_THEME,
  DELETE_TODO_TASK,
  DELETE_WORKOUT,
  EDIT_MEAL_ITEMS,
  EDIT_ROUTINE_ITEMS,
  EDIT_SUPPLEMENT_ITEMS,
  EDIT_THEME,
  EDIT_TODO_TASK,
  EDIT_WORKOUT,
  GET_THEMES,
  GET_TODO_TASKS,
  SET_USER,
} from '../src/redux/constants';

jest.mock('../src/storage/mmkv/index', () => ({
  storage: {
    getBoolean: jest.fn(),
    set: jest.fn(),
    getString: jest.fn(),
  },
}));

jest.mock('../src/utils/storageUtils', () => ({
  setJSON: jest.fn(),
}));

import { hydrateWorkoutPlans } from '../src/storage/mmkv/hydration';
import { STORAGE_KEYS } from '../src/storage/mmkv/keys';
import { storage } from '../src/storage/mmkv/index';
import { setJSON } from '../src/utils/storageUtils';

describe('Local data validation - CRUD', () => {
  test('todo reducer supports add/edit/delete lifecycle', () => {
    let state = todoReducer(undefined, { type: '@@INIT' });
    state = todoReducer(state, {
      type: ADD_TODO_TASK,
      payload: { title: 'Buy eggs', checked: false },
    });

    const task = state.todoTasks[0];
    expect(task.title).toBe('Buy eggs');

    state = todoReducer(state, {
      type: EDIT_TODO_TASK,
      payload: { id: task.id, data: { checked: true } },
    });
    expect(state.todoTasks[0].checked).toBe(true);

    state = todoReducer(state, {
      type: DELETE_TODO_TASK,
      payload: { id: task.id },
    });
    expect(state.todoTasks).toHaveLength(0);
  });

  test('nutrition reducer supports meal and supplement CRUD', () => {
    let state = nutritionReducer(undefined, { type: '@@INIT' });

    state = nutritionReducer(state, {
      type: ADD_MEAL,
      payload: { name: 'Meal A' },
    });
    const mealId = state.meals[0].id;

    state = nutritionReducer(state, {
      type: ADD_MEAL_ITEMS,
      payload: { id: mealId, data: { name: 'Chicken' } },
    });
    const mealItemId = state.mealItems[0].id;

    state = nutritionReducer(state, {
      type: EDIT_MEAL_ITEMS,
      payload: {
        meal_id: mealId,
        item_id: mealItemId,
        data: { id: mealItemId, name: 'Chicken Breast' },
      },
    });
    expect(state.mealItems[0].name).toBe('Chicken Breast');

    state = nutritionReducer(state, {
      type: DELETE_MEAL_ITEMS,
      payload: { meal_id: mealId, item_id: mealItemId },
    });
    expect(state.mealItems).toHaveLength(0);

    state = nutritionReducer(state, {
      type: ADD_SUPPLEMENT,
      payload: { name: 'Supp A' },
    });
    const supplementId = state.supplements[0].id;

    state = nutritionReducer(state, {
      type: ADD_SUPPLEMENT_ITEMS,
      payload: { id: supplementId, data: { name: 'Magnesium' } },
    });
    const supplementItemId = state.supplementItems[0].id;

    state = nutritionReducer(state, {
      type: EDIT_SUPPLEMENT_ITEMS,
      payload: {
        supplement_id: supplementId,
        item_id: supplementItemId,
        data: { id: supplementItemId, name: 'Magnesium 200mg' },
      },
    });
    expect(state.supplementItems[0].name).toBe('Magnesium 200mg');

    state = nutritionReducer(state, {
      type: DELETE_SUPPLEMENT_ITEMS,
      payload: { supplement_id: supplementId, item_id: supplementItemId },
    });
    expect(state.supplementItems).toHaveLength(0);

    state = nutritionReducer(state, { type: DELETE_MEAL, payload: { id: mealId } });
    state = nutritionReducer(state, {
      type: DELETE_SUPPLEMENT,
      payload: { id: supplementId },
    });

    expect(state.meals).toHaveLength(0);
    expect(state.supplements).toHaveLength(0);
  });

  test('recreation reducer supports workout and routine CRUD', () => {
    let state = recreationReducer(undefined, { type: '@@INIT' });

    state = recreationReducer(state, {
      type: ADD_ROUTINE,
      payload: { name: 'Morning Routine' },
    });
    const routineId = state.routines[0].id;

    state = recreationReducer(state, {
      type: ADD_ROUTINE_ITEMS,
      payload: { id: routineId, data: { task: 'Stretching' } },
    });
    const routineTaskId = state.routineTasks[0].id;

    state = recreationReducer(state, {
      type: EDIT_ROUTINE_ITEMS,
      payload: {
        routine_id: routineId,
        task_id: routineTaskId,
        data: { id: routineTaskId, task: 'Stretching 15m' },
      },
    });
    expect(state.routineTasks[0].task).toBe('Stretching 15m');

    state = recreationReducer(state, {
      type: DELETE_ROUTINE_ITEMS,
      payload: { routine_id: routineId, task_id: routineTaskId },
    });
    expect(state.routineTasks).toHaveLength(0);

    state = recreationReducer(state, {
      type: ADD_WORKOUT,
      payload: { data: { name: 'Upper Body' } },
    });
    const workoutId = state.workouts[0].id;

    state = recreationReducer(state, {
      type: EDIT_WORKOUT,
      payload: { id: workoutId, name: 'Upper Body A' },
    });
    expect(state.workouts[0].name).toBe('Upper Body A');

    state = recreationReducer(state, { type: DELETE_WORKOUT, payload: { id: workoutId } });
    state = recreationReducer(state, { type: DELETE_ROUTINE, payload: { id: routineId } });

    expect(state.workouts).toHaveLength(0);
    expect(state.routines).toHaveLength(0);
  });

  test('calendar reducer supports theme CRUD', () => {
    let state = calendarReducer(undefined, { type: '@@INIT' });

    state = calendarReducer(state, {
      type: ADD_THEME,
      payload: { name: 'Focus', color: '#fff' },
    });

    const themeId = state.themes[0].id;
    state = calendarReducer(state, {
      type: EDIT_THEME,
      payload: { id: themeId, data: { name: 'Deep Focus' } },
    });
    expect(state.themes[0].name).toBe('Deep Focus');

    state = calendarReducer(state, {
      type: DELETE_THEME,
      payload: { id: themeId },
    });
    expect(state.themes).toHaveLength(0);
  });
});

describe('Persistence and hydration validation', () => {
  test('redux state can be reloaded through GET actions (simulated app restart/update)', () => {
    const persistedState = {
      todos: [{ id: 't1', title: 'Persisted' }],
      themes: [{ id: 'th1', name: 'Persisted Theme' }],
    };

    const todoReloaded = todoReducer(undefined, {
      type: GET_THEMES, // irrelevant action should not mutate todo
      payload: [],
    });
    expect(todoReloaded.todoTasks).toEqual([]);

    const todoAfterLoad = todoReducer(undefined, {
      type: GET_TODO_TASKS,
      payload: persistedState.todos,
    });
    expect(todoAfterLoad.todoTasks).toEqual(persistedState.todos);

    const calendarAfterLoad = calendarReducer(undefined, {
      type: GET_THEMES,
      payload: persistedState.themes,
    });
    expect(calendarAfterLoad.themes).toEqual(persistedState.themes);
  });

  test('MMKV hydration writes seed plans only once', () => {
    storage.getBoolean.mockReturnValueOnce(false);
    hydrateWorkoutPlans();
    expect(setJSON).toHaveBeenCalledWith(
      STORAGE_KEYS.PLANS.BRUNCH_BODY,
      expect.any(Array),
    );
    expect(storage.set).toHaveBeenCalledWith(STORAGE_KEYS.IS_INITIALIZED, true);

    jest.clearAllMocks();
    storage.getBoolean.mockReturnValueOnce(true);
    hydrateWorkoutPlans();
    expect(setJSON).not.toHaveBeenCalled();
    expect(storage.set).not.toHaveBeenCalled();
  });
});

describe('Edge-case validation', () => {
  test('auth reducer produces NaN for malformed profile values (defect characterization)', () => {
    const state = authReducer(undefined, {
      type: SET_USER,
      payload: {
        height: 'bad-input',
        weight: 'bad-input',
        dob: 'not/a/date',
        gender: 'male',
      },
    });

    expect(state.user.bmi).toBe('NaN');
    expect(state.user.bmr).toBe('NaN');
  });

  test('reducers are safe with empty datasets and unknown delete ids', () => {
    const todoState = todoReducer(undefined, {
      type: DELETE_TODO_TASK,
      payload: { id: 'missing' },
    });
    expect(todoState.todoTasks).toEqual([]);

    const nutritionState = nutritionReducer(undefined, {
      type: DELETE_MEAL,
      payload: { id: 'missing' },
    });
    expect(nutritionState.meals).toEqual([]);

    const recreationState = recreationReducer(undefined, {
      type: DELETE_WORKOUT,
      payload: { id: 'missing' },
    });
    expect(recreationState.workouts).toEqual([]);
  });
});
