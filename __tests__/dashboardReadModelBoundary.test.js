import {
  GET_ALL_JOURNAL_ENTRIES,
  GET_JOURNAL_ENTRIES,
} from '../src/redux/constants';
import journalReducer from '../src/redux/reducer/journal';
import { buildDashboardReadModel } from '../src/screens/dashboard/readModel';

const now = new Date('2026-04-15T12:00:00.000Z');
const dashboardPeriods = ['day', 'week', 'month', 'year'];
const dashboardSeries = ['weightData', 'outlookData', 'calDiffData'];

const createEntry = (
  date,
  {
    weight,
    weightKilograms,
    feelingRate,
    caloriesDifferential,
    includeWeightLog = true,
    includeDailyEntry = true,
    includeCaloriesEntry = true,
  } = {},
) => ({
  id: `${date}-${weight}-${feelingRate}`,
  createdOn: new Date(date).getTime(),
  ...(includeWeightLog
    ? {
        WeightLog: {
          weight,
          ...(weightKilograms === undefined ? {} : { weightKilograms }),
        },
      }
    : {}),
  ...(includeDailyEntry ? { DailyEntry: { feelingRate } } : {}),
  ...(includeCaloriesEntry
    ? { CaloriesEntry: { caloriesDifferential } }
    : {}),
});

const expectSafeSevenPointDashboardData = readModel => {
  dashboardPeriods.forEach(period => {
    dashboardSeries.forEach(series => {
      const values = readModel[period][series];

      expect(values).toHaveLength(7);
      values.forEach(value => {
        expect(typeof value).toBe('number');
        expect(Number.isFinite(value)).toBe(true);
      });
    });
  });
};

describe('dashboard read-model boundary', () => {
  test('buildDashboardReadModel preserves the dashboard output contract with finite numeric chart values', () => {
    const entries = [
      createEntry('2026-04-15T12:00:00.000Z', {
        weight: '180',
        feelingRate: '4',
        caloriesDifferential: '100',
      }),
      createEntry('2026-04-14T12:00:00.000Z', {
        weight: '179',
        feelingRate: '3',
        caloriesDifferential: '-50',
      }),
      createEntry('2026-04-07T12:00:00.000Z', {
        weight: '178',
        feelingRate: '2',
        caloriesDifferential: '25',
      }),
      createEntry('2026-03-10T12:00:00.000Z', {
        weight: '177',
        feelingRate: '5',
        caloriesDifferential: '200',
      }),
      createEntry('2025-12-31T12:00:00.000Z', {
        weight: '176',
        feelingRate: '1',
        caloriesDifferential: '0',
      }),
    ];

    const readModel = buildDashboardReadModel(entries, now);

    expect(readModel).toEqual({
      day: {
        weightData: [180, 179, 178, 177, 176, 0, 0],
        outlookData: [4, 3, 2, 5, 1, 0, 0],
        calDiffData: [100, -50, 25, 200, 0, 0, 0],
      },
      week: {
        weightData: [51.29, 25.43, 25.29, 0, 0, 0, 0],
        outlookData: [1, 0.29, 0.71, 0, 0, 0, 0],
        calDiffData: [7.14, 3.57, 28.57, 0, 0, 0, 0],
      },
      month: {
        weightData: [17.9, 5.9, 0, 0, 0, 0, 0],
        outlookData: [0.3, 0.17, 0, 0, 0, 0, 0],
        calDiffData: [2.5, 6.67, 0, 0, 0, 0, 0],
      },
      year: {
        weightData: [1.95, 0, 0, 0, 0, 0, 0],
        outlookData: [0.04, 0, 0, 0, 0, 0, 0],
        calDiffData: [0.75, 0, 0, 0, 0, 0, 0],
      },
    });

    expectSafeSevenPointDashboardData(readModel);
  });

  test('buildDashboardReadModel returns safe seven-point arrays for empty journal input', () => {
    const readModel = buildDashboardReadModel([], now);
    const emptySeries = Array(7).fill(0);

    dashboardPeriods.forEach(period => {
      dashboardSeries.forEach(series => {
        expect(readModel[period][series]).toEqual(emptySeries);
      });
    });
    expectSafeSevenPointDashboardData(readModel);
  });

  test('buildDashboardReadModel safely fills sparse entries with missing sections', () => {
    const readModel = buildDashboardReadModel(
      [
        createEntry('2026-04-15T12:00:00.000Z', {
          weight: '180',
          includeDailyEntry: false,
          includeCaloriesEntry: false,
        }),
        createEntry('2026-04-14T12:00:00.000Z', {
          feelingRate: '3',
          includeWeightLog: false,
          includeCaloriesEntry: false,
        }),
        createEntry('2026-04-13T12:00:00.000Z', {
          caloriesDifferential: '-50',
          includeWeightLog: false,
          includeDailyEntry: false,
        }),
      ],
      now,
    );

    expect(readModel.day.weightData).toEqual([180, 0, 0, 0, 0, 0, 0]);
    expect(readModel.day.outlookData).toEqual([0, 3, 0, 0, 0, 0, 0]);
    expect(readModel.day.calDiffData).toEqual([0, 0, -50, 0, 0, 0, 0]);
    expect(readModel.week.calDiffData[0]).toBe(-7.14);
    expectSafeSevenPointDashboardData(readModel);
  });

  test('buildDashboardReadModel sanitizes malformed and non-finite chart inputs', () => {
    const readModel = buildDashboardReadModel(
      [
        createEntry('2026-04-15T12:00:00.000Z', {
          weight: 'bad-input',
          weightKilograms: 'bad-input',
          feelingRate: 'bad-input',
          caloriesDifferential: 'bad-input',
        }),
        createEntry('2026-04-14T12:00:00.000Z', {
          weight: '0',
          weightKilograms: 0,
          feelingRate: undefined,
          caloriesDifferential: undefined,
        }),
        createEntry('2026-04-13T12:00:00.000Z', {
          weight: '-10',
          weightKilograms: Infinity,
          feelingRate: Infinity,
          caloriesDifferential: -Infinity,
        }),
        createEntry('2026-04-12T12:00:00.000Z', {
          weight: null,
          weightKilograms: NaN,
          feelingRate: null,
          caloriesDifferential: null,
        }),
      ],
      now,
    );

    expect(readModel.day.weightData).toEqual([0, 0, 0, 0, 0, 0, 0]);
    expect(readModel.day.outlookData).toEqual([0, 0, 0, 0, 0, 0, 0]);
    expect(readModel.day.calDiffData).toEqual([0, 0, 0, 0, 0, 0, 0]);
    expectSafeSevenPointDashboardData(readModel);
  });

  test('buildDashboardReadModel prefers canonical WeightLog kilograms over conflicting legacy pounds', () => {
    const readModel = buildDashboardReadModel(
      [
        createEntry('2026-04-15T12:00:00.000Z', {
          weight: '999',
          weightKilograms: 61.2,
          feelingRate: '4',
          caloriesDifferential: '100',
        }),
      ],
      now,
    );

    expect(readModel.day.weightData).toEqual([134.92, 0, 0, 0, 0, 0, 0]);
    expect(readModel.day.weightData[0]).toBe(134.92);
    expect(readModel.week.weightData[0]).toBe(19.27);
  });

  test('buildDashboardReadModel falls back to legacy WeightLog pounds when canonical kilograms are absent', () => {
    const readModel = buildDashboardReadModel(
      [
        createEntry('2026-04-15T12:00:00.000Z', {
          weight: '181',
          feelingRate: '4',
          caloriesDifferential: '100',
        }),
      ],
      now,
    );

    expect(readModel.day.weightData).toEqual([181, 0, 0, 0, 0, 0, 0]);
    expect(readModel.week.weightData[0]).toBe(25.86);
    expectSafeSevenPointDashboardData(readModel);
  });

  test('buildDashboardReadModel falls back to legacy WeightLog pounds when canonical kilograms are invalid', () => {
    const readModel = buildDashboardReadModel(
      [
        createEntry('2026-04-15T12:00:00.000Z', {
          weight: '181',
          weightKilograms: 'bad-input',
          feelingRate: '4',
          caloriesDifferential: '100',
        }),
        createEntry('2026-04-14T12:00:00.000Z', {
          weight: '',
          weightKilograms: 0,
          feelingRate: '3',
          caloriesDifferential: '-50',
        }),
      ],
      now,
    );

    expect(readModel.day.weightData).toEqual([181, 0, 0, 0, 0, 0, 0]);
    expect(readModel.week.weightData[0]).toBe(25.86);
    expectSafeSevenPointDashboardData(readModel);
  });

  test('buildDashboardReadModel does not mutate source journal entries', () => {
    const entries = [
      createEntry('2026-04-15T12:00:00.000Z', {
        weight: '999',
        weightKilograms: 61.2,
        feelingRate: '4',
        caloriesDifferential: '100',
      }),
      createEntry('2026-04-14T12:00:00.000Z', {
        weight: '181',
        weightKilograms: 'bad-input',
        feelingRate: '3',
        caloriesDifferential: '-50',
      }),
    ];
    const sourceSnapshot = JSON.parse(JSON.stringify(entries));

    buildDashboardReadModel(entries, now);

    expect(entries).toEqual(sourceSnapshot);
  });

  test('journal reducer keeps journal lookup behavior and drops dashboard aggregate ownership', () => {
    const initialState = journalReducer(undefined, { type: '@@INIT' });

    expect(initialState).not.toHaveProperty('dailyWeightList');
    expect(initialState).not.toHaveProperty('dailyOutlookList');
    expect(initialState).not.toHaveProperty('dailyCaloriesDiffList');
    expect(initialState).not.toHaveProperty('weeklyWeightList');
    expect(initialState).not.toHaveProperty('weeklyOutlookList');
    expect(initialState).not.toHaveProperty('weeklyCaloriesDiffList');
    expect(initialState).not.toHaveProperty('monthlyWeightList');
    expect(initialState).not.toHaveProperty('monthlyOutlookList');
    expect(initialState).not.toHaveProperty('monthlyCaloriesDiffList');
    expect(initialState).not.toHaveProperty('yearlyWeightList');
    expect(initialState).not.toHaveProperty('yearlyOutlookList');
    expect(initialState).not.toHaveProperty('yearlyCaloriesDiffList');

    const stateWithEntries = {
      ...initialState,
      allJournalEntriesList: [
        createEntry('2026-04-15T12:00:00.000Z', {
          weight: '180',
          feelingRate: '4',
          caloriesDifferential: '100',
        }),
      ],
    };

    const lookupState = journalReducer(stateWithEntries, {
      type: GET_JOURNAL_ENTRIES,
      payload: { date: new Date('2026-04-15T18:30:00.000Z').getTime() },
    });

    expect(lookupState.allEntries).toEqual(
      stateWithEntries.allJournalEntriesList[0],
    );

    const unchangedState = journalReducer(stateWithEntries, {
      type: GET_ALL_JOURNAL_ENTRIES,
    });

    expect(unchangedState).toBe(stateWithEntries);
    expect(unchangedState).not.toHaveProperty('dailyWeightList');
    expect(unchangedState).not.toHaveProperty('weeklyWeightList');
    expect(unchangedState).not.toHaveProperty('monthlyWeightList');
    expect(unchangedState).not.toHaveProperty('yearlyWeightList');
  });
});
