import {
  kilogramsToPounds,
  parseLegacyHeightToCentimeters,
} from './bodyMeasurementUnits';
import {MEASUREMENT_CONVERSION_FACTORS} from './measurementConversions';

const {CENTIMETERS_PER_INCH} = MEASUREMENT_CONVERSION_FACTORS;
const NUMERIC_TEXT_PATTERN = /^(?:\d+|\d*\.\d+)$/;

const toFiniteNumber = value => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();

  if (!NUMERIC_TEXT_PATTERN.test(trimmedValue)) {
    return null;
  }

  const parsedValue = Number(trimmedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const toPositiveNumber = value => {
  const parsedValue = toFiniteNumber(value);

  return parsedValue > 0 ? parsedValue : null;
};

const toNonNegativeNumber = value => {
  const parsedValue = toFiniteNumber(value);

  return parsedValue >= 0 ? parsedValue : null;
};

export const normalizeGenderForBmr = gender =>
  gender === 'female' ? 'female' : 'male';

export const legacyHeightToInches = height => {
  const heightCentimeters = parseLegacyHeightToCentimeters(height);

  return heightCentimeters === null
    ? null
    : heightCentimeters / CENTIMETERS_PER_INCH;
};

export const legacyWeightToPounds = weight => toPositiveNumber(weight);

export const calculateBmiFromImperial = values => {
  const {heightInches, weightPounds} = values || {};
  const parsedHeightInches = toPositiveNumber(heightInches);
  const parsedWeightPounds = toPositiveNumber(weightPounds);

  if (parsedHeightInches === null || parsedWeightPounds === null) {
    return null;
  }

  return 703 * (parsedWeightPounds / parsedHeightInches ** 2);
};

export const calculateBmiFromMetric = values => {
  const {heightCentimeters, weightKilograms} = values || {};
  const parsedHeightCentimeters = toPositiveNumber(heightCentimeters);
  const parsedWeightKilograms = toPositiveNumber(weightKilograms);

  if (parsedHeightCentimeters === null || parsedWeightKilograms === null) {
    return null;
  }

  const heightMeters = parsedHeightCentimeters / 100;

  return parsedWeightKilograms / heightMeters ** 2;
};

export const calculateBmrFromImperial = values => {
  const {heightInches, weightPounds, age, gender} = values || {};
  const parsedHeightInches = toPositiveNumber(heightInches);
  const parsedWeightPounds = toPositiveNumber(weightPounds);
  const parsedAge = toNonNegativeNumber(age);

  if (
    parsedHeightInches === null ||
    parsedWeightPounds === null ||
    parsedAge === null
  ) {
    return null;
  }

  if (normalizeGenderForBmr(gender) === 'female') {
    return (
      655 +
      4.35 * parsedWeightPounds +
      4.7 * parsedHeightInches -
      4.7 * parsedAge
    );
  }

  return (
    66 +
    6.23 * parsedWeightPounds +
    12.7 * parsedHeightInches -
    6.8 * parsedAge
  );
};

export const calculateBmrFromMetric = values => {
  const {heightCentimeters, weightKilograms, age, gender} = values || {};
  const parsedHeightCentimeters = toPositiveNumber(heightCentimeters);
  const weightPounds = kilogramsToPounds(weightKilograms);

  if (parsedHeightCentimeters === null || weightPounds === null) {
    return null;
  }

  return calculateBmrFromImperial({
    heightInches: parsedHeightCentimeters / CENTIMETERS_PER_INCH,
    weightPounds,
    age,
    gender,
  });
};
