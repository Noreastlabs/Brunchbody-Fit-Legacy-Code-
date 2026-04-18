import todoReducer from '../src/redux/reducer/todo';
import nutritionReducer from '../src/redux/reducer/nutrition';
import recreationReducer from '../src/redux/reducer/recreation';
import calendarReducer from '../src/redux/reducer/calendar';
import exerciseReducer from '../src/redux/reducer/exercise';
import authReducer from '../src/redux/reducer/auth';
import journalReducer from '../src/redux/reducer/journal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loggedIn, profile } from '../src/redux/actions/auth';
import {
  ADD_EXERCISE,
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
  DELETE_EXERCISE,
  EDIT_MEAL_ITEMS,
  EDIT_ROUTINE_ITEMS,
  EDIT_SUPPLEMENT_ITEMS,
  EDIT_THEME,
  EDIT_TODO_TASK,
  EDIT_WORKOUT,
  EDIT_EXERCISE,
  EDIT_JOURNAL_ENTRY,
  GET_EXERCISES,
  GET_MEALS,
  GET_MEAL_ITEMS,
  GET_ROUTINES,
  GET_SUPPLEMENTS,
  GET_THEMES,
  GET_TODO_TASKS,
  GET_WORKOUTS,
  MERGE_EXERCISES,
  SET_MEAL_ITEMS,
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

  test('nutrition reducer keeps the legacy initial shape', () => {
    const state = nutritionReducer(undefined, {type: '@@INIT'});

    expect(Object.keys(state).sort()).toEqual([
      'mealCategories',
      'mealItems',
      'meals',
      'mealsDirectory',
      'supplementItems',
      'supplements',
    ]);
    expect(state).toEqual(
      expect.objectContaining({
        meals: [],
        mealItems: [],
        supplements: [],
        supplementItems: [],
        mealCategories: expect.any(Array),
        mealsDirectory: expect.any(Array),
      }),
    );
  });

  test('nutrition reducer preserves the legacy meal and meal-item contract', () => {
    let state = nutritionReducer(undefined, {type: '@@INIT'});

    state = nutritionReducer(state, {
      type: ADD_MEAL,
      payload: {
        name: 'Meal A',
        category: 'Lunch',
        items: [{id: 'ignored-item', name: 'Should not persist'}],
      },
    });

    const meal = state.meals[0];
    expect(state.meals).toHaveLength(1);
    expect(meal).toEqual(
      expect.objectContaining({
        name: 'Meal A',
        category: 'Lunch',
        items: [],
      }),
    );
    expect(meal.id).toEqual(expect.any(String));
    expect(meal.id).not.toBe('');

    const mealId = meal.id;

    state = nutritionReducer(state, {
      type: ADD_MEAL_ITEMS,
      payload: {
        id: mealId,
        data: {name: 'Chicken', calories: 200, servings: 1},
      },
    });

    const mealItem = state.mealItems[0];
    expect(state.mealItems).toHaveLength(1);
    expect(mealItem).toEqual(
      expect.objectContaining({
        name: 'Chicken',
        calories: 200,
        servings: 1,
      }),
    );
    expect(mealItem.id).toEqual(expect.any(String));
    expect(state.meals[0].items).toEqual(state.mealItems);

    state = nutritionReducer(state, {
      type: SET_MEAL_ITEMS,
      payload: [{id: 'manual-item', name: 'Manual Override'}],
    });
    expect(state.mealItems).toEqual([{id: 'manual-item', name: 'Manual Override'}]);
    expect(state.meals[0].items).toHaveLength(1);

    state = nutritionReducer(state, {
      type: GET_MEAL_ITEMS,
      payload: {id: mealId},
    });
    expect(state.mealItems).toEqual(state.meals[0].items);

    const mealItemId = state.mealItems[0].id;

    state = nutritionReducer(state, {
      type: EDIT_MEAL_ITEMS,
      payload: {
        meal_id: mealId,
        item_id: mealItemId,
        data: {id: mealItemId, name: 'Chicken Breast'},
      },
    });
    expect(state.mealItems).toEqual([{id: mealItemId, name: 'Chicken Breast'}]);
    expect(state.meals[0].items).toEqual(state.mealItems);
    expect(state.mealItems[0].calories).toBeUndefined();
    expect(state.mealItems[0].servings).toBeUndefined();

    state = nutritionReducer(state, {
      type: DELETE_MEAL_ITEMS,
      payload: {meal_id: mealId, item_id: mealItemId},
    });
    expect(state.mealItems).toEqual([]);
    expect(state.meals[0].items).toEqual([]);

    state = nutritionReducer(state, {
      type: DELETE_MEAL,
      payload: {id: mealId},
    });
    expect(state.meals).toHaveLength(0);
  });

  test('nutrition reducer keeps the supplement branch readable after meal-only cleanup', () => {
    let state = nutritionReducer(undefined, {type: '@@INIT'});

    state = nutritionReducer(state, {
      type: ADD_SUPPLEMENT,
      payload: {name: 'Supp A'},
    });

    expect(state.supplements).toHaveLength(1);
    expect(state.supplements[0]).toEqual(
      expect.objectContaining({
        name: 'Supp A',
        items: [],
      }),
    );
    expect(state.supplements[0].id).toEqual(expect.any(String));
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

  test('exercise reducer supports exercise CRUD', () => {
    let state = exerciseReducer(undefined, { type: '@@INIT' });
    state = exerciseReducer(state, { type: MERGE_EXERCISES });

    state = exerciseReducer(state, {
      type: ADD_EXERCISE,
      payload: { name: 'My Custom Row', type: 'Back' },
    });
    const exerciseId = state.exercises[0].id;
    expect(state.exercises[0].name).toBe('My Custom Row');

    state = exerciseReducer(state, {
      type: EDIT_EXERCISE,
      payload: { id: exerciseId, data: { name: 'My Custom Row v2' } },
    });
    expect(state.exercises[0].name).toBe('My Custom Row v2');

    state = exerciseReducer(state, {
      type: DELETE_EXERCISE,
      payload: { id: exerciseId },
    });
    expect(state.exercises).toHaveLength(0);
  });
});

describe('Persistence and hydration validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  test('MMKV hydration seeds when uninitialized and preserves a usable payload', () => {
    storage.getBoolean.mockReturnValueOnce(false);
    hydrateWorkoutPlans();
    expect(setJSON).toHaveBeenCalledWith(
      STORAGE_KEYS.PLANS.BRUNCH_BODY,
      expect.any(Array),
    );
    expect(storage.set).toHaveBeenCalledWith(STORAGE_KEYS.IS_INITIALIZED, true);

    jest.clearAllMocks();
    storage.getBoolean.mockReturnValueOnce(true);
    storage.getString.mockReturnValueOnce(
      JSON.stringify([{id: 'bb-1', name: 'Starter', weeksData: []}]),
    );
    hydrateWorkoutPlans();
    expect(setJSON).not.toHaveBeenCalled();
    expect(storage.set).not.toHaveBeenCalled();
  });

  test('profile action persists and merges profile data across launches', async () => {
    const dispatch = jest.fn();

    await profile({
      dob: '01/01/1995',
      gender: 'female',
      height: '5.06',
      weight: '135',
      activity: 'Lightly Active',
    })(dispatch);

    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      'user_profile',
      JSON.stringify({
        dob: '01/01/1995',
        gender: 'female',
        height: '5.06',
        weight: '135',
        activity: 'Lightly Active',
      }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SET_USER,
        payload: expect.objectContaining({ height: '5.06', weight: '135' }),
      }),
    );

    dispatch.mockClear();
    await profile({ weight: '140' })(dispatch);
    expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      'user_profile',
      JSON.stringify({
        dob: '01/01/1995',
        gender: 'female',
        height: '5.06',
        weight: '140',
        activity: 'Lightly Active',
      }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SET_USER,
        payload: expect.objectContaining({
          height: '5.06',
          weight: '140',
          gender: 'female',
        }),
      }),
    );

    const loginResult = await loggedIn()(dispatch);
    expect(loginResult).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SET_USER,
        payload: expect.objectContaining({ height: '5.06', weight: '140' }),
      }),
    );
  });

  test('upgrade scenario keeps persisted entities readable after relaunch', () => {
    const oldBuildPersisted = {
      auth: {
        user: {
          dob: '01/01/1995',
          gender: 'male',
          height: '5.10',
          weight: '171',
          activity: 'Moderately Active',
        },
      },
      todo: [{ id: 't-1', title: 'legacy todo', checked: false }],
      calendarThemes: [{ id: 'th-1', name: 'Legacy Theme', color: '#111' }],
      workouts: [{ id: 'w-1', name: 'Legacy Push Day' }],
      routines: [{ id: 'r-1', name: 'Legacy Mobility', items: [] }],
      meals: [{ id: 'm-1', name: 'Legacy Lunch', items: [] }],
      supplements: [{ id: 's-1', name: 'Legacy Supp', items: [] }],
      exercises: [{ id: 'e-1', name: 'Legacy Squat', type: 'Legs' }],
    };

    const authAfterUpgrade = authReducer(undefined, {
      type: SET_USER,
      payload: oldBuildPersisted.auth.user,
    });
    const todoAfterUpgrade = todoReducer(undefined, {
      type: GET_TODO_TASKS,
      payload: oldBuildPersisted.todo,
    });
    const calendarAfterUpgrade = calendarReducer(undefined, {
      type: GET_THEMES,
      payload: oldBuildPersisted.calendarThemes,
    });
    const workoutAfterUpgrade = recreationReducer(undefined, {
      type: GET_WORKOUTS,
      payload: oldBuildPersisted.workouts,
    });
    const routinesAfterUpgrade = recreationReducer(workoutAfterUpgrade, {
      type: GET_ROUTINES,
      payload: oldBuildPersisted.routines,
    });
    const mealsAfterUpgrade = nutritionReducer(undefined, {
      type: GET_MEALS,
      payload: oldBuildPersisted.meals,
    });
    const supplementsAfterUpgrade = nutritionReducer(mealsAfterUpgrade, {
      type: GET_SUPPLEMENTS,
      payload: oldBuildPersisted.supplements,
    });
    const exercisesAfterUpgrade = exerciseReducer(undefined, {
      type: GET_EXERCISES,
      payload: oldBuildPersisted.exercises,
    });

    expect(authAfterUpgrade.user).toMatchObject(oldBuildPersisted.auth.user);
    expect(todoAfterUpgrade.todoTasks).toEqual(oldBuildPersisted.todo);
    expect(calendarAfterUpgrade.themes).toEqual(oldBuildPersisted.calendarThemes);
    expect(routinesAfterUpgrade.workouts).toEqual(oldBuildPersisted.workouts);
    expect(routinesAfterUpgrade.routines).toEqual(oldBuildPersisted.routines);
    expect(supplementsAfterUpgrade.meals).toEqual(oldBuildPersisted.meals);
    expect(supplementsAfterUpgrade.supplements).toEqual(
      oldBuildPersisted.supplements,
    );
    expect(exercisesAfterUpgrade.exercises).toEqual(oldBuildPersisted.exercises);
  });

  test('loggedIn signals complete-profile flow when no persisted user exists', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const dispatch = jest.fn();

    const loginResult = await loggedIn()(dispatch);
    expect(loginResult).toBe('goToCompleteProfile');
    expect(dispatch).not.toHaveBeenCalled();
  });
});

describe('Edge-case validation', () => {
  test('auth reducer keeps the current BMI and BMR derivation for valid profiles', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-16T12:00:00.000Z'));

    try {
      const state = authReducer(undefined, {
        type: SET_USER,
        payload: {
          height: '5.06',
          weight: '135',
          dob: '01/01/1995',
          gender: 'female',
        },
      });

      expect(state.user.bmi).toBe('21.79');
      expect(state.user.bmr).toBe('1406.75');
    } finally {
      jest.useRealTimers();
    }
  });

  test('journal reducer ignores edits for non-existent entry ids without mutation', () => {
    const initialEntry = {
      id: 'journal-1',
      createdOn: Date.now(),
      DailyEntry: { feelingRate: '4' },
    };

    const state = {
      ...journalReducer(undefined, { type: '@@INIT' }),
      allJournalEntriesList: [initialEntry],
    };

    const nextState = journalReducer(state, {
      type: EDIT_JOURNAL_ENTRY,
      payload: {
        id: 'missing-id',
        data: { DailyEntry: { feelingRate: '1' } },
      },
    });

    expect(nextState).toBe(state);
    expect(nextState.allJournalEntriesList).toBe(state.allJournalEntriesList);
    expect(nextState.allJournalEntriesList[0]).toBe(initialEntry);
    expect(nextState.allJournalEntriesList[0].DailyEntry.feelingRate).toBe('4');
  });
  test('auth reducer omits derived metrics for malformed profile values', () => {
    const state = authReducer(undefined, {
      type: SET_USER,
      payload: {
        height: 'bad-input',
        weight: 'bad-input',
        dob: 'not/a/date',
        gender: 'male',
      },
    });

    expect(state.user).not.toHaveProperty('bmi');
    expect(state.user).not.toHaveProperty('bmr');
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
