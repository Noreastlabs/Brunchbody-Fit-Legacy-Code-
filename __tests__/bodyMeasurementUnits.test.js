import {
  centimetersToFeetInches,
  feetInchesToCentimeters,
  formatHeight,
  formatWeight,
  getBodyHeightCentimeters,
  getBodyWeightKilograms,
  isBodyUnitPreference,
  kilogramsToPounds,
  parseLegacyHeightToCentimeters,
  parseWeightToKilograms,
  poundsToKilograms,
} from '../src/utils/bodyMeasurementUnits';

describe('body measurement unit utilities', () => {
  describe('preference validation', () => {
    test('accepts only explicit body unit preferences', () => {
      expect(isBodyUnitPreference('standard')).toBe(true);
      expect(isBodyUnitPreference('metric')).toBe(true);
      expect(isBodyUnitPreference('STANDARD')).toBe(false);
      expect(isBodyUnitPreference('imperial')).toBe(false);
      expect(isBodyUnitPreference('')).toBe(false);
      expect(isBodyUnitPreference(null)).toBe(false);
    });
  });

  describe('height conversion', () => {
    test('converts feet and inches to canonical centimeters without display rounding', () => {
      expect(feetInchesToCentimeters(5, 6)).toBeCloseTo(167.64);
      expect(feetInchesToCentimeters(6, 0)).toBeCloseTo(182.88);
    });

    test('converts canonical centimeters to rounded feet and inches', () => {
      expect(centimetersToFeetInches(167.64)).toEqual({feet: 5, inches: 6});
      expect(centimetersToFeetInches(168)).toEqual({feet: 5, inches: 6});
      expect(centimetersToFeetInches(182.88)).toEqual({feet: 6, inches: 0});
    });

    test('parses legacy height dot notation as feet and inches text', () => {
      expect(parseLegacyHeightToCentimeters('5.06')).toBeCloseTo(167.64);
      expect(parseLegacyHeightToCentimeters('5.6')).toBeCloseTo(167.64);
      expect(parseLegacyHeightToCentimeters('6.00')).toBeCloseTo(182.88);
    });

    test('rejects malformed legacy height and invalid standard height components', () => {
      ['', ' ', 'bad-input', '5', '-5.06', '5.-1', '5.6.1'].forEach(
        value => {
          expect(parseLegacyHeightToCentimeters(value)).toBeNull();
        },
      );

      expect(parseLegacyHeightToCentimeters('0.10')).toBeNull();
      expect(parseLegacyHeightToCentimeters('5.12')).toBeNull();
      expect(parseLegacyHeightToCentimeters('5.13')).toBeNull();
      expect(parseLegacyHeightToCentimeters(NaN)).toBeNull();
      expect(parseLegacyHeightToCentimeters(null)).toBeNull();
      expect(parseLegacyHeightToCentimeters(undefined)).toBeNull();
      expect(feetInchesToCentimeters(0, 10)).toBeNull();
      expect(feetInchesToCentimeters(5, 12)).toBeNull();
      expect(feetInchesToCentimeters(5, -1)).toBeNull();
      expect(centimetersToFeetInches(0)).toBeNull();
      expect(centimetersToFeetInches(10)).toBeNull();
    });

    test('formats valid canonical height for standard and metric display', () => {
      expect(formatHeight(167.64, 'standard')).toBe('5 ft 6 in');
      expect(formatHeight(167.64, 'metric')).toBe('168 cm');
      expect(formatHeight(182.88, 'standard')).toBe('6 ft 0 in');
    });

    test('selects canonical height before legacy compatibility height', () => {
      expect(
        getBodyHeightCentimeters({
          heightCentimeters: 180,
          height: '5.06',
        }),
      ).toBe(180);
      expect(getBodyHeightCentimeters({height: '5.06'})).toBeCloseTo(167.64);
    });

    test('returns null when height formatting inputs are invalid', () => {
      expect(formatHeight(167.64, 'imperial')).toBeNull();
      expect(formatHeight(0, 'metric')).toBeNull();
      expect(formatHeight(-1, 'standard')).toBeNull();
      expect(formatHeight(NaN, 'standard')).toBeNull();
    });
  });

  describe('weight conversion', () => {
    test('converts pounds and kilograms without display rounding', () => {
      expect(poundsToKilograms(135)).toBeCloseTo(61.23496995);
      expect(kilogramsToPounds(61.23496995)).toBeCloseTo(135);
    });

    test('parses weight into canonical kilograms only with explicit preferences', () => {
      expect(parseWeightToKilograms('135', 'standard')).toBeCloseTo(
        61.23496995,
      );
      expect(parseWeightToKilograms('61.2', 'metric')).toBe(61.2);
      expect(parseWeightToKilograms('135', 'metric')).toBe(135);
      expect(parseWeightToKilograms('135', 'imperial')).toBeNull();
    });

    test('formats valid canonical weight for standard and metric display', () => {
      expect(formatWeight(61.23496995, 'standard')).toBe('135.0 lb');
      expect(formatWeight(61.23496995, 'metric')).toBe('61.2 kg');
      expect(formatWeight(61.26, 'metric')).toBe('61.3 kg');
    });

    test('selects canonical weight before legacy compatibility weight', () => {
      expect(
        getBodyWeightKilograms({
          weightKilograms: 70,
          weight: '135',
        }),
      ).toBe(70);
      expect(getBodyWeightKilograms({weight: '135'})).toBeCloseTo(
        61.23496995,
      );
    });

    test('returns null for invalid weight inputs', () => {
      ['', ' ', 'bad-input', '-1'].forEach(value => {
        expect(parseWeightToKilograms(value, 'standard')).toBeNull();
      });

      expect(parseWeightToKilograms(0, 'standard')).toBeNull();
      expect(parseWeightToKilograms(NaN, 'standard')).toBeNull();
      expect(parseWeightToKilograms(Infinity, 'metric')).toBeNull();
      expect(parseWeightToKilograms(null, 'metric')).toBeNull();
      expect(parseWeightToKilograms(undefined, 'metric')).toBeNull();
      expect(poundsToKilograms(0)).toBeNull();
      expect(kilogramsToPounds(0)).toBeNull();
      expect(formatWeight(0, 'metric')).toBeNull();
      expect(formatWeight(61.2, 'unsupported')).toBeNull();
    });
  });
});
