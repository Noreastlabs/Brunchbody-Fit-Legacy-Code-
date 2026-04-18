import AsyncStorage from '@react-native-async-storage/async-storage';
import * as recreationActions from '../src/redux/actions/recreation';
import {
  readStoredBrunchBodyPlans,
  readStoredRoutines,
  readStoredWorkouts,
} from '../src/redux/actions/recreationStorage';
import {
  GET_BRUNCH_BODY_PLANS,
  GET_BRUNCH_BODY_WEEK_PLAN,
  GET_ROUTINES,
  GET_WORKOUTS,
} from '../src/redux/constants';
import {STORAGE_KEYS} from '../src/storage/mmkv/keys';

jest.mock('../src/utils/storageUtils', () => ({
  getJSON: jest.fn(),
}));

import {getJSON} from '../src/utils/storageUtils';

describe('recreation storage boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('readStoredRoutines reads routines and returns an empty array when storage is empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await expect(readStoredRoutines()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('routines');
  });

  test('readStoredRoutines parses stored routines unchanged', async () => {
    const storedRoutines = [{id: 'routine-1', name: 'Morning', items: []}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedRoutines));

    await expect(readStoredRoutines()).resolves.toEqual(storedRoutines);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('routines');
  });

  test('readStoredWorkouts reads workouts and returns an empty array when storage is empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await expect(readStoredWorkouts()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('workouts');
  });

  test('readStoredWorkouts parses stored workouts unchanged', async () => {
    const storedWorkouts = [{id: 'workout-1', name: 'Upper Body'}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedWorkouts));

    await expect(readStoredWorkouts()).resolves.toEqual(storedWorkouts);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('workouts');
  });

  test('readStoredBrunchBodyPlans reads bundled plans through MMKV JSON helper', () => {
    const storedPlans = [{id: 'bb-1', name: 'Starter', weeksData: []}];

    getJSON.mockReturnValueOnce(storedPlans);

    expect(readStoredBrunchBodyPlans()).toEqual(storedPlans);
    expect(getJSON).toHaveBeenCalledWith(STORAGE_KEYS.PLANS.BRUNCH_BODY);
  });

  test('readStoredBrunchBodyPlans falls back to an empty array when MMKV returns nothing', () => {
    getJSON.mockReturnValueOnce(undefined);

    expect(readStoredBrunchBodyPlans()).toEqual([]);
    expect(getJSON).toHaveBeenCalledWith(STORAGE_KEYS.PLANS.BRUNCH_BODY);
  });

  test('getRoutines preserves its dispatch contract and returns true', async () => {
    const dispatch = jest.fn();
    const storedRoutines = [{id: 'routine-1', name: 'Morning', items: []}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedRoutines));

    await expect(recreationActions.getRoutines()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('routines');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_ROUTINES,
      payload: storedRoutines,
    });
  });

  test('getWorkouts preserves its dispatch contract and returns true', async () => {
    const dispatch = jest.fn();
    const storedWorkouts = [{id: 'workout-1', name: 'Upper Body'}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedWorkouts));

    await expect(recreationActions.getWorkouts()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('workouts');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_WORKOUTS,
      payload: storedWorkouts,
    });
  });

  test('getBrunchBodyPlans preserves its dispatch contract and returns true', async () => {
    const dispatch = jest.fn();
    const storedPlans = [{id: 'bb-1', name: 'Starter', weeksData: []}];

    getJSON.mockReturnValueOnce(storedPlans);

    await expect(recreationActions.getBrunchBodyPlans()(dispatch)).resolves.toBe(
      true,
    );
    expect(getJSON).toHaveBeenCalledWith(STORAGE_KEYS.PLANS.BRUNCH_BODY);
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_BRUNCH_BODY_PLANS,
      payload: storedPlans,
    });
  });

  test('getBrunchBodyWeekPlan dispatches the matched legacy week payload when found', async () => {
    const dispatch = jest.fn();
    const selectedWeek = {
      week: 2,
      weekDays: {day1: ['Push'], day2: ['Pull']},
    };
    const storedPlans = [
      {
        id: 'bb-1',
        name: 'Starter',
        weeksData: [{week: 1, weekDays: {day1: ['Warmup']}}, selectedWeek],
      },
    ];

    getJSON.mockReturnValueOnce(storedPlans);

    await expect(
      recreationActions.getBrunchBodyWeekPlan('Starter', '2')(dispatch),
    ).resolves.toEqual(selectedWeek);
    expect(getJSON).toHaveBeenCalledWith(STORAGE_KEYS.PLANS.BRUNCH_BODY);
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_BRUNCH_BODY_WEEK_PLAN,
      payload: selectedWeek,
    });
  });

  test('getBrunchBodyWeekPlan warns and returns null when the plan is missing', async () => {
    const dispatch = jest.fn();
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    getJSON.mockReturnValueOnce([{id: 'bb-1', name: 'Starter', weeksData: []}]);

    try {
      await expect(
        recreationActions.getBrunchBodyWeekPlan('Missing Plan', 2)(dispatch),
      ).resolves.toBeNull();
      expect(getJSON).toHaveBeenCalledWith(STORAGE_KEYS.PLANS.BRUNCH_BODY);
      expect(warnSpy).toHaveBeenCalledWith(
        'Plan with id/name "Missing Plan" not found',
      );
      expect(dispatch).not.toHaveBeenCalled();
    } finally {
      warnSpy.mockRestore();
    }
  });
});
