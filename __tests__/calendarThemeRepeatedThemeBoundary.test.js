import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import * as calendarActions from '../src/redux/actions/calendar';
import {
  ADD_REPEATED_THEME,
  ADD_THEME,
  CLEAR_CURRENT_THEME,
  CLEAR_THEME_DAYS,
  DELETE_THEME,
  EDIT_REPEATED_THEME,
  EDIT_THEME,
  GET_THEMES,
  SET_REPEATED_THEME,
  SET_THEME,
  SET_THEME_WITH_FREQUENCY,
} from '../src/redux/constants';
import calendarReducer from '../src/redux/reducer/calendar';

const FIXED_NOW = '2026-04-16T16:00:00.000Z';

const runThunk = async thunk => {
  const dispatch = jest.fn(action => {
    if (typeof action === 'function') {
      return action(dispatch);
    }

    return action;
  });

  const result = await thunk(dispatch);

  return {dispatch, result};
};

const createRepeatedTheme = overrides => ({
  id: 'theme-1',
  name: 'Evening Reset',
  color: '#123456',
  themeDay: FIXED_NOW,
  daysToFollow: '1',
  frequency: 'Never',
  createdOn: 1,
  deletedThemes: [],
  ...overrides,
});

describe('calendar theme and repeated-theme boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('getThemes loads stored themes, dispatches GET_THEMES, then triggers repeated-theme recompute', async () => {
    const storedThemes = [{id: 'theme-1', name: 'Morning', color: '#fff'}];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedThemes));

    const {dispatch, result} = await runThunk(calendarActions.getThemes());

    expect(result).toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('themes');
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: GET_THEMES,
      payload: storedThemes,
    });
    expect(typeof dispatch.mock.calls[1][0]).toBe('function');
    expect(dispatch.mock.calls[2][0]).toEqual({
      type: SET_THEME_WITH_FREQUENCY,
      payload: null,
    });
  });

  test('getThemes falls back to an empty array when themes storage is empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const {dispatch, result} = await runThunk(calendarActions.getThemes());

    expect(result).toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('themes');
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: GET_THEMES,
      payload: [],
    });
    expect(typeof dispatch.mock.calls[1][0]).toBe('function');
    expect(dispatch.mock.calls[2][0]).toEqual({
      type: SET_THEME_WITH_FREQUENCY,
      payload: null,
    });
  });

  test('simple calendar theme thunks keep their action contracts and return true', async () => {
    const cases = [
      {
        thunk: calendarActions.setTheme({id: 'theme-1', color: '#fff'}),
        action: {type: SET_THEME, payload: {id: 'theme-1', color: '#fff'}},
      },
      {
        thunk: calendarActions.changeRepeatedTheme({id: 'repeat-1'}),
        action: {type: SET_REPEATED_THEME, payload: {id: 'repeat-1'}},
      },
      {
        thunk: calendarActions.clearCurrentTheme(),
        action: {type: CLEAR_CURRENT_THEME},
      },
      {
        thunk: calendarActions.updateThemesWithFrequency(30),
        action: {type: SET_THEME_WITH_FREQUENCY, daysInCurrentMonth: 30},
      },
      {
        thunk: calendarActions.clearThemeDays({Friday: 10}),
        action: {type: CLEAR_THEME_DAYS, payload: {Friday: 10}},
      },
      {
        thunk: calendarActions.addTheme({name: 'Focus'}),
        action: {type: ADD_THEME, payload: {name: 'Focus'}},
      },
      {
        thunk: calendarActions.editTheme('theme-1', {name: 'Reset'}),
        action: {type: EDIT_THEME, payload: {id: 'theme-1', data: {name: 'Reset'}}},
      },
      {
        thunk: calendarActions.deleteTheme('theme-1'),
        action: {type: DELETE_THEME, payload: {id: 'theme-1'}},
      },
    ];

    for (const {thunk, action} of cases) {
      const dispatch = jest.fn();

      await expect(thunk(dispatch)).resolves.toBe(true);
      expect(dispatch).toHaveBeenCalledWith(action);
    }
  });

  test('getRepeatedThemes dispatches SET_THEME_WITH_FREQUENCY with a null payload and returns true', async () => {
    const dispatch = jest.fn();

    await expect(calendarActions.getRepeatedThemes()(dispatch)).resolves.toBe(true);
    expect(dispatch).toHaveBeenCalledWith({
      type: SET_THEME_WITH_FREQUENCY,
      payload: null,
    });
  });

  test('addRepeatedTheme dispatches the mutation action before recomputing frequency output', async () => {
    const dispatch = jest.fn();
    const repeatedTheme = createRepeatedTheme();

    await expect(
      calendarActions.addRepeatedTheme(repeatedTheme)(dispatch),
    ).resolves.toBe(true);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: ADD_REPEATED_THEME,
      payload: repeatedTheme,
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: SET_THEME_WITH_FREQUENCY,
      payload: null,
    });
  });

  test('editRepeatedTheme dispatches the mutation action before recomputing frequency output', async () => {
    const dispatch = jest.fn();
    const repeatedThemePatch = {color: '#abcdef'};

    await expect(
      calendarActions.editRepeatedTheme('theme-1', repeatedThemePatch)(dispatch),
    ).resolves.toBe(true);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: EDIT_REPEATED_THEME,
      payload: {id: 'theme-1', data: repeatedThemePatch},
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: SET_THEME_WITH_FREQUENCY,
      payload: null,
    });
  });

  test('initial state preserves the calendar theme slice shape', () => {
    expect(calendarReducer(undefined, {type: '@@INIT'})).toEqual({
      theme: {},
      themes: [],
      currentTheme: {},
      themesWithFrequency: {},
      repeatedTheme: {},
      userRepeatedThemes: [],
      clearedThemeDays: {},
    });
  });

  test('theme reducer add, edit, and delete operations preserve the current theme contract', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

    try {
      const addedState = calendarReducer(undefined, {
        type: ADD_THEME,
        payload: {name: 'Reset', color: '#111111'},
      });

      expect(addedState.theme).toEqual({
        id: '4fzzzxjylrx',
        name: 'Reset',
        color: '#111111',
      });
      expect(addedState.themes).toEqual([addedState.theme]);

      const editedBaseState = {
        ...calendarReducer(undefined, {type: '@@INIT'}),
        theme: {id: 'theme-1', name: 'Reset', color: '#111111'},
        themes: [
          {id: 'theme-1', name: 'Reset', color: '#111111'},
          {id: 'theme-2', name: 'Recover', color: '#222222'},
        ],
        currentTheme: {id: 'theme-1', name: 'Reset', color: '#111111'},
        userRepeatedThemes: [
          {
            id: 'theme-1',
            name: 'Reset',
            color: '#111111',
            themeDay: FIXED_NOW,
            daysToFollow: '7',
            frequency: 'Weekly',
            createdOn: 1,
          },
        ],
      };
      const editedState = calendarReducer(editedBaseState, {
        type: EDIT_THEME,
        payload: {
          id: 'theme-1',
          data: {name: 'Reset Updated', color: '#333333'},
        },
      });

      expect(editedState.theme).toEqual({
        id: 'theme-1',
        name: 'Reset Updated',
        color: '#333333',
      });
      expect(editedState.currentTheme).toEqual({
        id: 'theme-1',
        name: 'Reset Updated',
        color: '#333333',
      });
      expect(editedState.themes).toEqual([
        {id: 'theme-1', name: 'Reset Updated', color: '#333333'},
        {id: 'theme-2', name: 'Recover', color: '#222222'},
      ]);
      expect(editedState.userRepeatedThemes[0]).toEqual({
        id: 'theme-1',
        name: 'Reset Updated',
        color: '#333333',
        themeDay: FIXED_NOW,
        daysToFollow: '7',
        frequency: 'Weekly',
        createdOn: 1,
      });

      const deletedState = calendarReducer(editedState, {
        type: DELETE_THEME,
        payload: {id: 'theme-1'},
      });

      expect(deletedState.themes).toEqual([
        {id: 'theme-2', name: 'Recover', color: '#222222'},
      ]);
    } finally {
      randomSpy.mockRestore();
    }
  });

  test('clearCurrentTheme only clears currentTheme and repeatedTheme, and clearThemeDays replaces the payload', () => {
    const state = {
      ...calendarReducer(undefined, {type: '@@INIT'}),
      theme: {id: 'theme-1'},
      currentTheme: {id: 'theme-1'},
      repeatedTheme: {id: 'repeat-1'},
      clearedThemeDays: {Monday: 10},
    };

    const clearedCurrentState = calendarReducer(state, {
      type: CLEAR_CURRENT_THEME,
    });
    expect(clearedCurrentState).toEqual({
      ...state,
      currentTheme: {},
      repeatedTheme: {},
    });

    const clearedDaysState = calendarReducer(clearedCurrentState, {
      type: CLEAR_THEME_DAYS,
      payload: {Friday: 20},
    });
    expect(clearedDaysState.clearedThemeDays).toEqual({Friday: 20});
    expect(clearedDaysState.theme).toEqual({id: 'theme-1'});
  });

  test('SET_THEME_WITH_FREQUENCY sorts repeated themes by createdOn and lets later overlaps win', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(FIXED_NOW));

    const earlierTheme = createRepeatedTheme({
      id: 'theme-early',
      color: '#111111',
      createdOn: 1,
    });
    const laterTheme = createRepeatedTheme({
      id: 'theme-late',
      color: '#222222',
      createdOn: 2,
    });

    const nextState = calendarReducer(undefined, {
      type: SET_THEME_WITH_FREQUENCY,
      payload: [laterTheme, earlierTheme],
    });

    const todayKey = moment().format('YYYY-MM-DD');
    expect(nextState.userRepeatedThemes).toEqual([earlierTheme, laterTheme]);
    expect(nextState.currentTheme).toEqual(laterTheme);
    expect(nextState.repeatedTheme).toEqual(laterTheme);
    expect(nextState.themesWithFrequency[todayKey].theme).toEqual(laterTheme);
  });

  test.each([
    {
      frequency: 'Daily',
      theme: createRepeatedTheme({
        themeDay: '2026-04-15T16:00:00.000Z',
        daysToFollow: '4',
        frequency: 'Daily',
        deletedThemes: ['2026-04-16T16:00:00.000Z'],
      }),
      action: {type: SET_THEME_WITH_FREQUENCY, payload: null},
      expectedDates: ['2026-04-15', '2026-04-17', '2026-04-18'],
      missingDates: ['2026-04-16'],
      expectedCurrentTheme: {},
      expectedRepeatedTheme: {},
      fallbackToday: true,
    },
    {
      frequency: 'Weekly',
      theme: createRepeatedTheme({
        themeDay: '2026-04-02T16:00:00.000Z',
        daysToFollow: '21',
        frequency: 'Weekly',
      }),
      action: {type: SET_THEME_WITH_FREQUENCY, payload: null},
      expectedDates: ['2026-04-02', '2026-04-09', '2026-04-16'],
      missingDates: ['2026-04-23'],
    },
    {
      frequency: 'BiWeekly',
      theme: createRepeatedTheme({
        themeDay: '2026-04-02T16:00:00.000Z',
        daysToFollow: '30',
        frequency: 'BiWeekly',
      }),
      action: {type: SET_THEME_WITH_FREQUENCY, payload: null},
      expectedDates: ['2026-04-02', '2026-04-16', '2026-04-30'],
      missingDates: ['2026-05-14'],
    },
    {
      frequency: 'Monthly',
      theme: createRepeatedTheme({
        themeDay: '2026-03-17T16:00:00.000Z',
        daysToFollow: '40',
        frequency: 'Monthly',
      }),
      action: {
        type: SET_THEME_WITH_FREQUENCY,
        payload: null,
        daysInCurrentMonth: 30,
      },
      expectedDates: ['2026-04-16'],
      missingDates: ['2026-03-17'],
    },
    {
      frequency: 'Never',
      theme: createRepeatedTheme({
        themeDay: FIXED_NOW,
        daysToFollow: '1',
        frequency: 'Never',
      }),
      action: {type: SET_THEME_WITH_FREQUENCY, payload: null},
      expectedDates: ['2026-04-16'],
      missingDates: ['2026-04-17'],
    },
  ])(
    'SET_THEME_WITH_FREQUENCY preserves the $frequency recurrence output contract',
    ({
      theme,
      action,
      expectedDates,
      missingDates,
      expectedCurrentTheme,
      expectedRepeatedTheme,
      fallbackToday,
    }) => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(FIXED_NOW));

      const state = {
        ...calendarReducer(undefined, {type: '@@INIT'}),
        userRepeatedThemes: [theme],
      };

      const nextState = calendarReducer(state, action);
      const todayKey = moment().format('YYYY-MM-DD');

      expectedDates.forEach(dateKey => {
        expect(nextState.themesWithFrequency[dateKey]).toEqual({
          selected: true,
          customStyles: {
            container: {
              borderWidth: 2,
              borderColor: theme.color,
              backgroundColor:
                dateKey === todayKey ? theme.color : 'transparent',
            },
          },
          theme,
        });
      });

      missingDates.forEach(dateKey => {
        if (dateKey === todayKey && fallbackToday) {
          expect(nextState.themesWithFrequency[dateKey]).toEqual(
            expect.objectContaining({
              selected: true,
              customStyles: expect.objectContaining({
                container: expect.objectContaining({
                  borderWidth: 2,
                }),
              }),
            }),
          );
          expect(nextState.themesWithFrequency[dateKey].theme).toBeUndefined();
        } else {
          expect(nextState.themesWithFrequency[dateKey]).toBeUndefined();
        }
      });

      if (expectedCurrentTheme) {
        expect(nextState.currentTheme).toEqual(expectedCurrentTheme);
        expect(nextState.repeatedTheme).toEqual(expectedRepeatedTheme);
      } else {
        expect(nextState.currentTheme).toEqual(theme);
        expect(nextState.repeatedTheme).toEqual(theme);
      }
      expect(nextState.userRepeatedThemes).toEqual([theme]);
    },
  );
});
