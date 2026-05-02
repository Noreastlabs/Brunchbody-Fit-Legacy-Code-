import {
  calculateCaloriesBurnedFromKilograms,
  calculateCaloriesBurnedFromPounds,
  legacyWeightPoundsToKilograms,
  selectProfileWeightForCalorieBurn,
} from '../src/utils/calorieBurnMetrics';

const STANDARD_WEIGHT_POUNDS = 135;
const STANDARD_MET = 7.5;
const STANDARD_DURATION_MINUTES = 30;

const calculateCurrentScreenFormula = ({
  weightPounds,
  met,
  durationMinutes,
}) => {
  const weightKilograms = weightPounds / 2.205;
  const caloriesPerMinute = (met * 3.5 * weightKilograms) / 200;

  return caloriesPerMinute * durationMinutes;
};

describe('calorie burn metric helpers', () => {
  test('selects canonical profile kilograms for calorie burn input', () => {
    expect(
      selectProfileWeightForCalorieBurn({
        weight: '999',
        weightKilograms: 10,
      }),
    ).toEqual({weightKilograms: 10});
  });

  test('falls back to legacy profile pounds when canonical kilograms are missing', () => {
    expect(
      selectProfileWeightForCalorieBurn({
        weight: '180',
      }),
    ).toEqual({weightPounds: '180'});
  });

  test.each([
    ['numeric string canonical field', '10'],
    ['zero canonical field', 0],
    ['negative canonical field', -10],
    ['NaN canonical field', NaN],
    ['Infinity canonical field', Infinity],
  ])('falls back to legacy profile pounds for %s', (_label, weightKilograms) => {
    expect(
      selectProfileWeightForCalorieBurn({
        weight: '180',
        weightKilograms,
      }),
    ).toEqual({weightPounds: '180'});
  });

  test('keeps canonical kilograms first when profile weights conflict', () => {
    const selectedWeight = selectProfileWeightForCalorieBurn({
      weight: '999',
      weightKilograms: 10,
    });

    expect(selectedWeight).toEqual({weightKilograms: 10});
    expect(selectedWeight).not.toHaveProperty('weightPounds');
  });

  test('converts legacy pounds using the Recreation/EditProgram divisor', () => {
    expect(legacyWeightPoundsToKilograms(STANDARD_WEIGHT_POUNDS)).toBeCloseTo(
      STANDARD_WEIGHT_POUNDS / 2.205,
    );
  });

  test('calculates legacy pounds calorie burn using the current screen formula', () => {
    const calories = calculateCaloriesBurnedFromPounds({
      weightPounds: STANDARD_WEIGHT_POUNDS,
      met: STANDARD_MET,
      durationMinutes: STANDARD_DURATION_MINUTES,
    });

    expect(typeof calories).toBe('number');
    expect(calories).toBeCloseTo(
      calculateCurrentScreenFormula({
        weightPounds: STANDARD_WEIGHT_POUNDS,
        met: STANDARD_MET,
        durationMinutes: STANDARD_DURATION_MINUTES,
      }),
    );
  });

  test('calculates canonical kilogram calorie burn from normalized minutes', () => {
    const weightKilograms = legacyWeightPoundsToKilograms(
      STANDARD_WEIGHT_POUNDS,
    );
    const calories = calculateCaloriesBurnedFromKilograms({
      weightKilograms,
      met: STANDARD_MET,
      durationMinutes: STANDARD_DURATION_MINUTES,
    });

    expect(typeof calories).toBe('number');
    expect(calories).toBeCloseTo(
      ((STANDARD_MET * 3.5 * weightKilograms) / 200) *
        STANDARD_DURATION_MINUTES,
    );
  });

  test('keeps pounds and kilograms calorie burn in parity for equivalent weights', () => {
    const weightKilograms = legacyWeightPoundsToKilograms(
      STANDARD_WEIGHT_POUNDS,
    );
    const legacyCalories = calculateCaloriesBurnedFromPounds({
      weightPounds: STANDARD_WEIGHT_POUNDS,
      met: STANDARD_MET,
      durationMinutes: STANDARD_DURATION_MINUTES,
    });
    const metricCalories = calculateCaloriesBurnedFromKilograms({
      weightKilograms,
      met: STANDARD_MET,
      durationMinutes: STANDARD_DURATION_MINUTES,
    });

    expect(metricCalories).toBeCloseTo(legacyCalories);
  });

  test('accepts fully numeric string inputs after trimming', () => {
    expect(
      calculateCaloriesBurnedFromPounds({
        weightPounds: ' 135 ',
        met: '7.5',
        durationMinutes: '30',
      }),
    ).toBeCloseTo(
      calculateCurrentScreenFormula({
        weightPounds: STANDARD_WEIGHT_POUNDS,
        met: STANDARD_MET,
        durationMinutes: STANDARD_DURATION_MINUTES,
      }),
    );
  });

  test('returns null for invalid weight inputs', () => {
    ['', ' ', '135lb', '10abc', 0, -1, NaN, Infinity, null, undefined].forEach(
      weightPounds => {
        expect(
          calculateCaloriesBurnedFromPounds({
            weightPounds,
            met: STANDARD_MET,
            durationMinutes: STANDARD_DURATION_MINUTES,
          }),
        ).toBeNull();
      },
    );

    expect(legacyWeightPoundsToKilograms('135lb')).toBeNull();
    expect(
      calculateCaloriesBurnedFromKilograms({
        weightKilograms: '61kg',
        met: STANDARD_MET,
        durationMinutes: STANDARD_DURATION_MINUTES,
      }),
    ).toBeNull();
  });

  test('returns null for invalid MET inputs', () => {
    ['', ' ', '7met', '10abc', 0, -1, NaN, Infinity, null, undefined].forEach(
      met => {
        expect(
          calculateCaloriesBurnedFromPounds({
            weightPounds: STANDARD_WEIGHT_POUNDS,
            met,
            durationMinutes: STANDARD_DURATION_MINUTES,
          }),
        ).toBeNull();
      },
    );
  });

  test('returns null for invalid duration inputs', () => {
    [
      '',
      ' ',
      '30minutes',
      '10abc',
      0,
      -1,
      NaN,
      Infinity,
      null,
      undefined,
    ].forEach(durationMinutes => {
      expect(
        calculateCaloriesBurnedFromPounds({
          weightPounds: STANDARD_WEIGHT_POUNDS,
          met: STANDARD_MET,
          durationMinutes,
        }),
      ).toBeNull();
    });
  });

  test('returns raw numbers without display formatting', () => {
    const calories = calculateCaloriesBurnedFromPounds({
      weightPounds: STANDARD_WEIGHT_POUNDS,
      met: STANDARD_MET,
      durationMinutes: STANDARD_DURATION_MINUTES,
    });

    expect(typeof calories).toBe('number');
    expect(Number.isInteger(calories)).toBe(false);
    expect(calories.toFixed(2)).toBe('241.07');
  });
});
