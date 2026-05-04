import {
  calculateBmiFromImperial,
  calculateBmiFromMetric,
  calculateBmrFromImperial,
  calculateBmrFromMetric,
  legacyHeightToInches,
  legacyWeightToPounds,
  normalizeGenderForBmr,
} from '../src/utils/bodyMetrics';

const STANDARD_HEIGHT_INCHES = 66;
const STANDARD_WEIGHT_POUNDS = 135;
const STANDARD_HEIGHT_CENTIMETERS = 167.64;
const STANDARD_WEIGHT_KILOGRAMS = 61.23496995;
const STANDARD_AGE = 31;

describe('body metrics helpers', () => {
  describe('legacy height parsing', () => {
    test('parses legacy dot notation into total inches', () => {
      expect(legacyHeightToInches('5.06')).toBe(STANDARD_HEIGHT_INCHES);
      expect(legacyHeightToInches('5.6')).toBe(STANDARD_HEIGHT_INCHES);
      expect(legacyHeightToInches('6.00')).toBe(72);
    });

    test('returns null for malformed or invalid legacy heights', () => {
      ['', ' ', 'bad-input', '5', '-5.06', '5.-1', '5.6.1'].forEach(
        height => {
          expect(legacyHeightToInches(height)).toBeNull();
        },
      );

      expect(legacyHeightToInches('0.10')).toBeNull();
      expect(legacyHeightToInches('5.12')).toBeNull();
      expect(legacyHeightToInches('5.13')).toBeNull();
      expect(legacyHeightToInches(null)).toBeNull();
      expect(legacyHeightToInches(undefined)).toBeNull();
    });
  });

  describe('legacy weight parsing', () => {
    test('parses valid legacy pounds without display rounding', () => {
      expect(legacyWeightToPounds('135')).toBe(135);
      expect(legacyWeightToPounds(' 135.5 ')).toBe(135.5);
      expect(legacyWeightToPounds(135)).toBe(135);
    });

    test('returns null for malformed or placeholder legacy weights', () => {
      [
        '',
        ' ',
        '135lbs',
        '135 lb',
        'NaN',
        'Infinity',
        'undefined',
        'null',
        'bad-input',
        '-1',
      ].forEach(weight => {
        expect(legacyWeightToPounds(weight)).toBeNull();
      });

      expect(legacyWeightToPounds(0)).toBeNull();
      expect(legacyWeightToPounds(-1)).toBeNull();
      expect(legacyWeightToPounds(NaN)).toBeNull();
      expect(legacyWeightToPounds(Infinity)).toBeNull();
      expect(legacyWeightToPounds(null)).toBeNull();
      expect(legacyWeightToPounds(undefined)).toBeNull();
    });
  });

  describe('BMI', () => {
    test('calculates legacy imperial BMI without display rounding', () => {
      const bmi = calculateBmiFromImperial({
        heightInches: STANDARD_HEIGHT_INCHES,
        weightPounds: STANDARD_WEIGHT_POUNDS,
      });

      expect(typeof bmi).toBe('number');
      expect(bmi).toBeCloseTo(21.787190082645);
      expect(bmi.toFixed(2)).toBe('21.79');
    });

    test('calculates canonical metric BMI without display rounding', () => {
      const bmi = calculateBmiFromMetric({
        heightCentimeters: STANDARD_HEIGHT_CENTIMETERS,
        weightKilograms: STANDARD_WEIGHT_KILOGRAMS,
      });

      expect(typeof bmi).toBe('number');
      expect(bmi).toBeCloseTo(21.78934647642);
      expect(bmi.toFixed(2)).toBe('21.79');
    });

    test('keeps imperial and metric BMI parity for equivalent values', () => {
      const imperialBmi = calculateBmiFromImperial({
        heightInches: STANDARD_HEIGHT_INCHES,
        weightPounds: STANDARD_WEIGHT_POUNDS,
      });
      const metricBmi = calculateBmiFromMetric({
        heightCentimeters: STANDARD_HEIGHT_CENTIMETERS,
        weightKilograms: STANDARD_WEIGHT_KILOGRAMS,
      });

      expect(metricBmi).toBeCloseTo(imperialBmi, 2);
      expect(metricBmi.toFixed(2)).toBe(imperialBmi.toFixed(2));
    });

    test('returns null for invalid BMI inputs', () => {
      expect(calculateBmiFromImperial()).toBeNull();
      expect(
        calculateBmiFromImperial({
          heightInches: '',
          weightPounds: STANDARD_WEIGHT_POUNDS,
        }),
      ).toBeNull();
      expect(
        calculateBmiFromImperial({
          heightInches: 0,
          weightPounds: STANDARD_WEIGHT_POUNDS,
        }),
      ).toBeNull();
      expect(
        calculateBmiFromImperial({
          heightInches: STANDARD_HEIGHT_INCHES,
          weightPounds: '135lbs',
        }),
      ).toBeNull();
      expect(
        calculateBmiFromImperial({
          heightInches: STANDARD_HEIGHT_INCHES,
          weightPounds: ' ',
        }),
      ).toBeNull();
      expect(
        calculateBmiFromImperial({
          heightInches: STANDARD_HEIGHT_INCHES,
          weightPounds: -1,
        }),
      ).toBeNull();
      expect(
        calculateBmiFromMetric({
          heightCentimeters: NaN,
          weightKilograms: STANDARD_WEIGHT_KILOGRAMS,
        }),
      ).toBeNull();
      expect(
        calculateBmiFromMetric({
          heightCentimeters: 'bad-input',
          weightKilograms: STANDARD_WEIGHT_KILOGRAMS,
        }),
      ).toBeNull();
      expect(
        calculateBmiFromMetric({
          heightCentimeters: STANDARD_HEIGHT_CENTIMETERS,
          weightKilograms: Infinity,
        }),
      ).toBeNull();
    });
  });

  describe('BMR', () => {
    test('normalizes gender using the reducer-compatible fallback', () => {
      expect(normalizeGenderForBmr('female')).toBe('female');
      expect(normalizeGenderForBmr('male')).toBe('male');
      expect(normalizeGenderForBmr('unsupported')).toBe('male');
      expect(normalizeGenderForBmr(undefined)).toBe('male');
    });

    test('calculates legacy imperial female BMR without display rounding', () => {
      const bmr = calculateBmrFromImperial({
        heightInches: STANDARD_HEIGHT_INCHES,
        weightPounds: STANDARD_WEIGHT_POUNDS,
        age: STANDARD_AGE,
        gender: 'female',
      });

      expect(typeof bmr).toBe('number');
      expect(bmr).toBeCloseTo(1406.75);
      expect(bmr.toFixed(2)).toBe('1406.75');
    });

    test('calculates legacy imperial male BMR without display rounding', () => {
      const bmr = calculateBmrFromImperial({
        heightInches: 70,
        weightPounds: 171,
        age: STANDARD_AGE,
        gender: 'male',
      });

      expect(typeof bmr).toBe('number');
      expect(bmr).toBeCloseTo(1809.53);
      expect(bmr.toFixed(2)).toBe('1809.53');
    });

    test('calculates canonical metric BMR through legacy formula parity', () => {
      const bmr = calculateBmrFromMetric({
        heightCentimeters: STANDARD_HEIGHT_CENTIMETERS,
        weightKilograms: STANDARD_WEIGHT_KILOGRAMS,
        age: STANDARD_AGE,
        gender: 'female',
      });

      expect(typeof bmr).toBe('number');
      expect(bmr).toBeCloseTo(1406.75);
      expect(bmr.toFixed(2)).toBe('1406.75');
    });

    test('keeps imperial and metric BMR parity for equivalent values', () => {
      const imperialBmr = calculateBmrFromImperial({
        heightInches: STANDARD_HEIGHT_INCHES,
        weightPounds: STANDARD_WEIGHT_POUNDS,
        age: STANDARD_AGE,
        gender: 'female',
      });
      const metricBmr = calculateBmrFromMetric({
        heightCentimeters: STANDARD_HEIGHT_CENTIMETERS,
        weightKilograms: STANDARD_WEIGHT_KILOGRAMS,
        age: STANDARD_AGE,
        gender: 'female',
      });

      expect(metricBmr).toBeCloseTo(imperialBmr);
      expect(metricBmr.toFixed(2)).toBe(imperialBmr.toFixed(2));
    });

    test('falls through to the male formula for missing and unsupported gender', () => {
      const maleBmr = calculateBmrFromImperial({
        heightInches: 70,
        weightPounds: 171,
        age: STANDARD_AGE,
        gender: 'male',
      });

      expect(
        calculateBmrFromImperial({
          heightInches: 70,
          weightPounds: 171,
          age: STANDARD_AGE,
        }),
      ).toBeCloseTo(maleBmr);
      expect(
        calculateBmrFromImperial({
          heightInches: 70,
          weightPounds: 171,
          age: STANDARD_AGE,
          gender: 'unsupported',
        }),
      ).toBeCloseTo(maleBmr);
    });

    test('returns null for invalid BMR numeric inputs', () => {
      expect(calculateBmrFromImperial()).toBeNull();
      expect(
        calculateBmrFromImperial({
          heightInches: '66in',
          weightPounds: STANDARD_WEIGHT_POUNDS,
          age: STANDARD_AGE,
          gender: 'female',
        }),
      ).toBeNull();
      expect(
        calculateBmrFromImperial({
          heightInches: 0,
          weightPounds: STANDARD_WEIGHT_POUNDS,
          age: STANDARD_AGE,
          gender: 'female',
        }),
      ).toBeNull();
      expect(
        calculateBmrFromImperial({
          heightInches: STANDARD_HEIGHT_INCHES,
          weightPounds: '135lbs',
          age: STANDARD_AGE,
          gender: 'female',
        }),
      ).toBeNull();
      expect(
        calculateBmrFromImperial({
          heightInches: STANDARD_HEIGHT_INCHES,
          weightPounds: 0,
          age: STANDARD_AGE,
          gender: 'female',
        }),
      ).toBeNull();
      expect(
        calculateBmrFromImperial({
          heightInches: STANDARD_HEIGHT_INCHES,
          weightPounds: STANDARD_WEIGHT_POUNDS,
          age: '31 years',
          gender: 'female',
        }),
      ).toBeNull();
      expect(
        calculateBmrFromImperial({
          heightInches: STANDARD_HEIGHT_INCHES,
          weightPounds: STANDARD_WEIGHT_POUNDS,
          age: -1,
          gender: 'female',
        }),
      ).toBeNull();
      expect(
        calculateBmrFromMetric({
          heightCentimeters: STANDARD_HEIGHT_CENTIMETERS,
          weightKilograms: STANDARD_WEIGHT_KILOGRAMS,
          age: Infinity,
          gender: 'female',
        }),
      ).toBeNull();
    });
  });
});
