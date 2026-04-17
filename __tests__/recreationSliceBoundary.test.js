import AsyncStorage from '@react-native-async-storage/async-storage';
import * as recreationActions from '../src/redux/actions/recreation';
import {
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
  GET_CUSTOM_PLANS,
  GET_ROUTINES,
  GET_ROUTINE_ITEMS,
  GET_WEEK_PLAN,
} from '../src/redux/constants';
import recreationReducer from '../src/redux/reducer/recreation';
import {STORAGE_KEYS} from '../src/storage/mmkv/keys';

jest.mock('../src/utils/storageUtils', () => ({
  getJSON: jest.fn(),
}));

import {getJSON} from '../src/utils/storageUtils';

const GENERATED_ID = '4fzzzxjylrx';

describe('recreation slice boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initial state preserves the legacy recreation slice shape', () => {
    expect(recreationReducer(undefined, {type: '@@INIT'})).toEqual({
      routines: [],
      routineTasks: [],
      customPlans: [],
      weekPlan: {},
      brunchBodyPlans: [],
      workouts: [],
      completedWorkouts: [],
    });
  });

  test('getRoutines dispatches parsed stored routines and returns true', async () => {
    const storedRoutines = [{id: 'routine-1', name: 'Morning', items: []}];
    const dispatch = jest.fn();

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedRoutines));

    await expect(recreationActions.getRoutines()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('routines');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_ROUTINES,
      payload: storedRoutines,
    });
  });

  test('getRoutines falls back to an empty array when routines storage is empty', async () => {
    const dispatch = jest.fn();

    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await expect(recreationActions.getRoutines()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('routines');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_ROUTINES,
      payload: [],
    });
  });

  test('scoped simple thunks keep their current action contracts and return true', async () => {
    const cases = [
      {
        thunk: recreationActions.addRoutine({name: 'Morning Routine'}),
        action: {type: ADD_ROUTINE, payload: {name: 'Morning Routine'}},
      },
      {
        thunk: recreationActions.deleteRoutine('routine-1'),
        action: {type: DELETE_ROUTINE, payload: {id: 'routine-1'}},
      },
      {
        thunk: recreationActions.getRoutineTasks('routine-1'),
        action: {type: GET_ROUTINE_ITEMS, payload: {id: 'routine-1'}},
      },
      {
        thunk: recreationActions.addRoutineTask('routine-1', {task: 'Stretch'}),
        action: {
          type: ADD_ROUTINE_ITEMS,
          payload: {id: 'routine-1', data: {task: 'Stretch'}},
        },
      },
      {
        thunk: recreationActions.editRoutineTask({
          routine_id: 'routine-1',
          task_id: 'task-1',
          data: {id: 'task-1', task: 'Stretch Longer'},
        }),
        action: {
          type: EDIT_ROUTINE_ITEMS,
          payload: {
            routine_id: 'routine-1',
            task_id: 'task-1',
            data: {id: 'task-1', task: 'Stretch Longer'},
          },
        },
      },
      {
        thunk: recreationActions.deleteRoutineTask({
          routine_id: 'routine-1',
          task_id: 'task-1',
        }),
        action: {
          type: DELETE_ROUTINE_ITEMS,
          payload: {routine_id: 'routine-1', task_id: 'task-1'},
        },
      },
      {
        thunk: recreationActions.addCustomPlan({name: 'Strength Block'}),
        action: {type: ADD_CUSTOM_PLANS, payload: {name: 'Strength Block'}},
      },
      {
        thunk: recreationActions.deleteCustomPlan('plan-1'),
        action: {type: DELETE_CUSTOM_PLANS, payload: {id: 'plan-1'}},
      },
      {
        thunk: recreationActions.getWeekPlans('plan-1', 2),
        action: {type: GET_WEEK_PLAN, payload: {id: 'plan-1', week: 2}},
      },
    ];

    for (const {thunk, action} of cases) {
      const dispatch = jest.fn();

      await expect(thunk(dispatch)).resolves.toBe(true);
      expect(dispatch).toHaveBeenCalledWith(action);
    }
  });

  test('getCustomPlans dispatches an empty array without adding a storage read', async () => {
    const dispatch = jest.fn();

    await expect(recreationActions.getCustomPlans()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_CUSTOM_PLANS,
      payload: [],
    });
  });

  test('addWeekPlan dispatches the mutation first and then re-selects the requested week', async () => {
    const dispatch = jest.fn();
    const weekData = {week: 2, weekDays: {monday: []}};

    await expect(
      recreationActions.addWeekPlan('plan-1', weekData)(dispatch),
    ).resolves.toBe(true);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: ADD_WEEK_PLAN,
      payload: {id: 'plan-1', data: weekData},
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: GET_WEEK_PLAN,
      payload: {id: 'plan-1', week: 2},
    });
  });

  test('editWeekPlan dispatches the mutation first and then re-selects the requested week', async () => {
    const dispatch = jest.fn();
    const weekPatch = {week: '3', weekDays: {tuesday: ['Run']}};

    await expect(
      recreationActions.editWeekPlan('plan-1', 'week-1', weekPatch)(dispatch),
    ).resolves.toBe(true);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: EDIT_WEEK_PLAN,
      payload: {id: 'plan-1', weekId: 'week-1', data: weekPatch},
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: GET_WEEK_PLAN,
      payload: {id: 'plan-1', week: '3'},
    });
  });

  test('routine reducer flow preserves add/get/add-item/delete-item/delete-routine behavior', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

    try {
      let state = recreationReducer(undefined, {
        type: ADD_ROUTINE,
        payload: {name: 'Morning Routine'},
      });

      expect(state.routines).toEqual([
        {id: GENERATED_ID, name: 'Morning Routine', items: []},
      ]);

      state = recreationReducer(state, {
        type: GET_ROUTINE_ITEMS,
        payload: {id: GENERATED_ID},
      });
      expect(state.routineTasks).toEqual([]);

      state = recreationReducer(state, {
        type: ADD_ROUTINE_ITEMS,
        payload: {
          id: GENERATED_ID,
          data: {task: 'Stretching', notes: 'Keep this'},
        },
      });
      expect(state.routineTasks).toEqual([
        {id: GENERATED_ID, task: 'Stretching', notes: 'Keep this'},
      ]);

      state = recreationReducer(state, {
        type: DELETE_ROUTINE_ITEMS,
        payload: {routine_id: GENERATED_ID, task_id: GENERATED_ID},
      });
      expect(state.routineTasks).toEqual([]);
      expect(state.routines[0].items).toEqual([]);

      state = recreationReducer(state, {
        type: DELETE_ROUTINE,
        payload: {id: GENERATED_ID},
      });
      expect(state.routines).toEqual([]);
    } finally {
      randomSpy.mockRestore();
    }
  });

  test('routine-item edits replace the matching item instead of shallow-merging', () => {
    const state = {
      ...recreationReducer(undefined, {type: '@@INIT'}),
      routines: [
        {
          id: 'routine-1',
          name: 'Morning Routine',
          items: [
            {
              id: 'task-1',
              task: 'Stretching',
              notes: 'remove me',
              duration: '10m',
            },
          ],
        },
      ],
    };

    const nextState = recreationReducer(state, {
      type: EDIT_ROUTINE_ITEMS,
      payload: {
        routine_id: 'routine-1',
        task_id: 'task-1',
        data: {id: 'task-1', task: 'Stretching 15m'},
      },
    });

    expect(nextState.routineTasks).toEqual([
      {id: 'task-1', task: 'Stretching 15m'},
    ]);
    expect(nextState.routines[0].items[0]).toEqual({
      id: 'task-1',
      task: 'Stretching 15m',
    });
  });

  test('custom plans preserve generated ids, empty week arrays, and delete behavior', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

    try {
      let state = recreationReducer(undefined, {
        type: ADD_CUSTOM_PLANS,
        payload: {name: 'Strength Block'},
      });

      expect(state.customPlans).toEqual([
        {id: GENERATED_ID, name: 'Strength Block', week: []},
      ]);

      state = recreationReducer(state, {
        type: DELETE_CUSTOM_PLANS,
        payload: {id: GENERATED_ID},
      });
      expect(state.customPlans).toEqual([]);
    } finally {
      randomSpy.mockRestore();
    }
  });

  test('week-plan reducer preserves legacy get/add/edit semantics and intermediate array state', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

    try {
      let state = recreationReducer(undefined, {
        type: ADD_CUSTOM_PLANS,
        payload: {name: 'Strength Block'},
      });

      state = recreationReducer(state, {
        type: GET_WEEK_PLAN,
        payload: {id: GENERATED_ID, week: 1},
      });
      expect(state.weekPlan).toEqual({});

      state = recreationReducer(state, {
        type: ADD_WEEK_PLAN,
        payload: {
          id: GENERATED_ID,
          data: {week: '1', weekDays: {day1: ['Push']}},
        },
      });
      expect(state.customPlans[0].week).toEqual([
        {id: GENERATED_ID, week: '1', weekDays: {day1: ['Push']}},
      ]);
      expect(state.weekPlan).toEqual([
        {id: GENERATED_ID, week: '1', weekDays: {day1: ['Push']}},
      ]);

      state = recreationReducer(state, {
        type: GET_WEEK_PLAN,
        payload: {id: GENERATED_ID, week: 1},
      });
      expect(state.weekPlan).toEqual({
        id: GENERATED_ID,
        week: '1',
        weekDays: {day1: ['Push']},
      });

      state = recreationReducer(state, {
        type: EDIT_WEEK_PLAN,
        payload: {
          id: GENERATED_ID,
          weekId: GENERATED_ID,
          data: {week: '1', weekDays: {day2: ['Pull']}, notes: 'Updated'},
        },
      });
      expect(state.weekPlan).toEqual([
        {
          id: GENERATED_ID,
          week: '1',
          weekDays: {day2: ['Pull']},
          notes: 'Updated',
        },
      ]);
      expect(state.customPlans[0].week).toEqual(state.weekPlan);

      state = recreationReducer(state, {
        type: GET_WEEK_PLAN,
        payload: {id: GENERATED_ID, week: 1},
      });
      expect(state.weekPlan).toEqual({
        id: GENERATED_ID,
        week: '1',
        weekDays: {day2: ['Pull']},
        notes: 'Updated',
      });
    } finally {
      randomSpy.mockRestore();
    }
  });

  test('frozen brunch-body and workout branches keep their current behavior', async () => {
    const brunchBodyPlans = [{id: 'bb-1', name: 'Starter'}];
    const dispatch = jest.fn();

    getJSON.mockReturnValueOnce(brunchBodyPlans);

    await expect(recreationActions.getBrunchBodyPlans()(dispatch)).resolves.toBe(
      true,
    );
    expect(getJSON).toHaveBeenCalledWith(STORAGE_KEYS.PLANS.BRUNCH_BODY);
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_BRUNCH_BODY_PLANS,
      payload: brunchBodyPlans,
    });

    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

    try {
      let state = recreationReducer(undefined, {
        type: ADD_WORKOUT,
        payload: {data: {name: 'Upper Body'}},
      });
      expect(state.workouts).toEqual([{id: GENERATED_ID, name: 'Upper Body'}]);

      state = recreationReducer(state, {
        type: EDIT_WORKOUT,
        payload: {id: GENERATED_ID, name: 'Upper Body A'},
      });
      expect(state.workouts).toEqual([{id: GENERATED_ID, name: 'Upper Body A'}]);

      state = recreationReducer(state, {
        type: DELETE_WORKOUT,
        payload: {id: GENERATED_ID},
      });
      expect(state.workouts).toEqual([]);
    } finally {
      randomSpy.mockRestore();
    }
  });
});
