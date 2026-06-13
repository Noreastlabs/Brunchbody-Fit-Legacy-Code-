import {
  convertMeasurement,
  MEASUREMENT_CATEGORIES,
  MEASUREMENT_CONVERSION_ERROR_CODES,
  MEASUREMENT_UNITS,
} from '../src/utils/measurementConversions';

const expectConversion = conversion => {
  expect(conversion.ok).toBe(true);

  return conversion.value;
};

const expectFailureCode = (conversion, code) => {
  expect(conversion).toEqual({
    ok: false,
    error: {code},
  });
};

describe('measurement conversion engine', () => {
  describe('known conversion anchors', () => {
    test('converts body weight between pounds and kilograms', () => {
      expect(
        expectConversion(
          convertMeasurement({
            value: 1,
            category: MEASUREMENT_CATEGORIES.BODY_WEIGHT,
            fromUnit: MEASUREMENT_UNITS.POUND,
            toUnit: MEASUREMENT_UNITS.KILOGRAM,
          }),
        ),
      ).toBeCloseTo(0.45359237);
      expect(
        expectConversion(
          convertMeasurement({
            value: 0.45359237,
            category: MEASUREMENT_CATEGORIES.BODY_WEIGHT,
            fromUnit: MEASUREMENT_UNITS.KILOGRAM,
            toUnit: MEASUREMENT_UNITS.POUND,
          }),
        ),
      ).toBeCloseTo(1);
    });

    test('converts length between inches and centimeters', () => {
      expect(
        expectConversion(
          convertMeasurement({
            value: 1,
            category: MEASUREMENT_CATEGORIES.LENGTH,
            fromUnit: MEASUREMENT_UNITS.INCH,
            toUnit: MEASUREMENT_UNITS.CENTIMETER,
          }),
        ),
      ).toBeCloseTo(2.54);
      expect(
        expectConversion(
          convertMeasurement({
            value: 2.54,
            category: MEASUREMENT_CATEGORIES.LENGTH,
            fromUnit: MEASUREMENT_UNITS.CENTIMETER,
            toUnit: MEASUREMENT_UNITS.INCH,
          }),
        ),
      ).toBeCloseTo(1);
    });

    test('converts distance between miles and kilometers', () => {
      expect(
        expectConversion(
          convertMeasurement({
            value: 1,
            category: MEASUREMENT_CATEGORIES.DISTANCE,
            fromUnit: MEASUREMENT_UNITS.MILE,
            toUnit: MEASUREMENT_UNITS.KILOMETER,
          }),
        ),
      ).toBeCloseTo(1.609344);
      expect(
        expectConversion(
          convertMeasurement({
            value: 1.609344,
            category: MEASUREMENT_CATEGORIES.DISTANCE,
            fromUnit: MEASUREMENT_UNITS.KILOMETER,
            toUnit: MEASUREMENT_UNITS.MILE,
          }),
        ),
      ).toBeCloseTo(1);
    });

    test('converts mass between ounces and grams', () => {
      expect(
        expectConversion(
          convertMeasurement({
            value: 1,
            category: MEASUREMENT_CATEGORIES.MASS,
            fromUnit: MEASUREMENT_UNITS.OUNCE,
            toUnit: MEASUREMENT_UNITS.GRAM,
          }),
        ),
      ).toBeCloseTo(28.349523125);
      expect(
        expectConversion(
          convertMeasurement({
            value: 28.349523125,
            category: MEASUREMENT_CATEGORIES.MASS,
            fromUnit: MEASUREMENT_UNITS.GRAM,
            toUnit: MEASUREMENT_UNITS.OUNCE,
          }),
        ),
      ).toBeCloseTo(1);
    });
  });

  test('round trips supported conversions within tolerance', () => {
    [
      {
        value: 135,
        category: MEASUREMENT_CATEGORIES.BODY_WEIGHT,
        fromUnit: MEASUREMENT_UNITS.POUND,
        toUnit: MEASUREMENT_UNITS.KILOGRAM,
      },
      {
        value: 167.64,
        category: MEASUREMENT_CATEGORIES.LENGTH,
        fromUnit: MEASUREMENT_UNITS.CENTIMETER,
        toUnit: MEASUREMENT_UNITS.INCH,
      },
      {
        value: 10,
        category: MEASUREMENT_CATEGORIES.DISTANCE,
        fromUnit: MEASUREMENT_UNITS.KILOMETER,
        toUnit: MEASUREMENT_UNITS.MILE,
      },
      {
        value: 250,
        category: MEASUREMENT_CATEGORIES.MASS,
        fromUnit: MEASUREMENT_UNITS.GRAM,
        toUnit: MEASUREMENT_UNITS.OUNCE,
      },
    ].forEach(({value, category, fromUnit, toUnit}) => {
      const converted = expectConversion(
        convertMeasurement({value, category, fromUnit, toUnit}),
      );
      const roundTripped = expectConversion(
        convertMeasurement({
          value: converted,
          category,
          fromUnit: toUnit,
          toUnit: fromUnit,
        }),
      );

      expect(roundTripped).toBeCloseTo(value, 10);
    });
  });

  test('returns the original value for same-unit conversions', () => {
    const value = -12.5;

    expect(
      convertMeasurement({
        value,
        category: MEASUREMENT_CATEGORIES.BODY_WEIGHT,
        fromUnit: MEASUREMENT_UNITS.POUND,
        toUnit: 'lbs',
      }),
    ).toEqual({
      ok: true,
      value,
    });
  });

  test('converts finite negative values mathematically', () => {
    expect(
      expectConversion(
        convertMeasurement({
          value: -1,
          category: MEASUREMENT_CATEGORIES.BODY_WEIGHT,
          fromUnit: MEASUREMENT_UNITS.POUND,
          toUnit: MEASUREMENT_UNITS.KILOGRAM,
        }),
      ),
    ).toBeCloseTo(-0.45359237);
  });

  test('rejects non-finite numeric inputs with a stable error code', () => {
    [NaN, Infinity, -Infinity].forEach(value => {
      expectFailureCode(
        convertMeasurement({
          value,
          category: MEASUREMENT_CATEGORIES.LENGTH,
          fromUnit: MEASUREMENT_UNITS.INCH,
          toUnit: MEASUREMENT_UNITS.CENTIMETER,
        }),
        MEASUREMENT_CONVERSION_ERROR_CODES.NON_FINITE_VALUE,
      );
    });
  });

  test('returns stable failure codes for unsupported conversions', () => {
    expectFailureCode(
      convertMeasurement({
        value: 1,
        category: 'volume',
        fromUnit: MEASUREMENT_UNITS.OUNCE,
        toUnit: MEASUREMENT_UNITS.GRAM,
      }),
      MEASUREMENT_CONVERSION_ERROR_CODES.UNSUPPORTED_CATEGORY,
    );
    expectFailureCode(
      convertMeasurement({
        value: 1,
        category: MEASUREMENT_CATEGORIES.BODY_WEIGHT,
        fromUnit: 'stone',
        toUnit: MEASUREMENT_UNITS.KILOGRAM,
      }),
      MEASUREMENT_CONVERSION_ERROR_CODES.UNSUPPORTED_UNIT,
    );
    expectFailureCode(
      convertMeasurement({
        value: 1,
        category: MEASUREMENT_CATEGORIES.LENGTH,
        fromUnit: MEASUREMENT_UNITS.KILOGRAM,
        toUnit: MEASUREMENT_UNITS.POUND,
      }),
      MEASUREMENT_CONVERSION_ERROR_CODES.UNSUPPORTED_UNIT_PAIR,
    );
  });

  test('treats aliases as exact input normalization, not display labels', () => {
    expect(
      expectConversion(
        convertMeasurement({
          value: 10,
          category: MEASUREMENT_CATEGORIES.BODY_WEIGHT,
          fromUnit: 'lbs',
          toUnit: MEASUREMENT_UNITS.KILOGRAM,
        }),
      ),
    ).toBeCloseTo(4.5359237);
    expectFailureCode(
      convertMeasurement({
        value: 10,
        category: MEASUREMENT_CATEGORIES.BODY_WEIGHT,
        fromUnit: 'LB',
        toUnit: MEASUREMENT_UNITS.KILOGRAM,
      }),
      MEASUREMENT_CONVERSION_ERROR_CODES.UNSUPPORTED_UNIT,
    );
  });

  test('keeps category boundaries strict when units are individually supported', () => {
    expectFailureCode(
      convertMeasurement({
        value: 5,
        category: MEASUREMENT_CATEGORIES.DISTANCE,
        fromUnit: MEASUREMENT_UNITS.POUND,
        toUnit: MEASUREMENT_UNITS.KILOGRAM,
      }),
      MEASUREMENT_CONVERSION_ERROR_CODES.UNSUPPORTED_UNIT_PAIR,
    );
  });
});
