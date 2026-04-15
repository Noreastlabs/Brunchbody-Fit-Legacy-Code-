import {
  GET_ALL_JOURNAL_ENTRIES,
  GET_JOURNAL_ENTRIES,
} from '../src/redux/constants';
import journalReducer from '../src/redux/reducer/journal';
import { buildDashboardReadModel } from '../src/screens/dashboard/readModel';

const now = new Date('2026-04-15T12:00:00.000Z');

const createEntry = (date, { weight, feelingRate, caloriesDifferential }) => ({
  id: `${date}-${weight}-${feelingRate}`,
  createdOn: new Date(date).getTime(),
  WeightLog: { weight },
  DailyEntry: { feelingRate },
  CaloriesEntry: { caloriesDifferential },
});

describe('dashboard read-model boundary', () => {
  test('buildDashboardReadModel preserves the current dashboard output contract', () => {
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
        weightData: ['180', '179', '178', '177', '176', 0, 0],
        outlookData: ['4', '3', '2', '5', '1', 0, 0],
        calDiffData: ['100', '-50', '25', '200', '0', 0, 0],
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

    expect(readModel.day.weightData).toHaveLength(7);
    expect(readModel.week.outlookData).toHaveLength(7);
    expect(readModel.month.calDiffData).toHaveLength(7);
    expect(readModel.year.weightData).toHaveLength(7);
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
