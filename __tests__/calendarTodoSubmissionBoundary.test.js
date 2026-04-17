import moment from 'moment';
import { buildCalendarTodoSubmission } from '../src/screens/calendar/todoSubmission';

describe('calendar todo submission boundary', () => {
  test('buildCalendarTodoSubmission returns the current picked-date payload shape', () => {
    expect(
      buildCalendarTodoSubmission({
        taskName: 'Hydrate',
        taskNotes: '8 cups',
        taskDay: '4/15/2026',
        year: 2026,
        month: 4,
        date: 15,
      }),
    ).toEqual({
      name: 'Hydrate',
      notes: '8 cups',
      day: moment('2026/4/15', 'YYYY/MM/DD').format(),
    });
  });

  test('buildCalendarTodoSubmission returns null for empty or absent required inputs', () => {
    expect(
      buildCalendarTodoSubmission({
        taskName: '   ',
        taskNotes: '8 cups',
        taskDay: 'Someday',
        year: 2026,
        month: 4,
        date: 15,
      }),
    ).toBeNull();

    expect(
      buildCalendarTodoSubmission({
        taskName: 'Hydrate',
        taskNotes: '8 cups',
        taskDay: undefined,
        year: 2026,
        month: 4,
        date: 15,
      }),
    ).toBeNull();
  });

  test('buildCalendarTodoSubmission preserves the Someday sentinel', () => {
    expect(
      buildCalendarTodoSubmission({
        taskName: 'Hydrate',
        taskNotes: '8 cups',
        taskDay: 'Someday',
        year: 2026,
        month: 4,
        date: 15,
      }),
    ).toEqual({
      name: 'Hydrate',
      notes: '8 cups',
      day: 'Someday',
    });
  });

  test('buildCalendarTodoSubmission uses trimming only for validation', () => {
    expect(
      buildCalendarTodoSubmission({
        taskName: '  Hydrate  ',
        taskNotes: '  8 cups  ',
        taskDay: '  Someday  ',
        year: 2026,
        month: 4,
        date: 15,
      }),
    ).toEqual({
      name: '  Hydrate  ',
      notes: '  8 cups  ',
      day: moment('2026/4/15', 'YYYY/MM/DD').format(),
    });
  });
});
