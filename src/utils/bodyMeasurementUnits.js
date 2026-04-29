const CENTIMETERS_PER_INCH = 2.54;
const KILOGRAMS_PER_POUND = 0.45359237;

const STANDARD_UNIT_PREFERENCE = 'standard';
const METRIC_UNIT_PREFERENCE = 'metric';

const NUMERIC_TEXT_PATTERN = /^(?:\d+|\d*\.\d+)$/;
const LEGACY_HEIGHT_PATTERN = /^(\d+)\.(\d{1,2})$/;

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

const toInteger = value => {
  const parsedValue = toFiniteNumber(value);

  return Number.isInteger(parsedValue) ? parsedValue : null;
};

const getStandardHeightParts = (feetValue, inchesValue) => {
  const feet = toInteger(feetValue);
  const inches = toInteger(inchesValue);

  if (
    feet === null ||
    inches === null ||
    feet <= 0 ||
    inches < 0 ||
    inches > 11
  ) {
    return null;
  }

  return {feet, inches};
};

export const isBodyUnitPreference = value =>
  value === STANDARD_UNIT_PREFERENCE || value === METRIC_UNIT_PREFERENCE;

export const feetInchesToCentimeters = (feetValue, inchesValue) => {
  const height = getStandardHeightParts(feetValue, inchesValue);

  if (!height) {
    return null;
  }

  return (height.feet * 12 + height.inches) * CENTIMETERS_PER_INCH;
};

export const centimetersToFeetInches = centimeters => {
  const parsedCentimeters = toPositiveNumber(centimeters);

  if (parsedCentimeters === null) {
    return null;
  }

  const totalInches = Math.round(parsedCentimeters / CENTIMETERS_PER_INCH);

  if (totalInches <= 0) {
    return null;
  }

  const feet = Math.floor(totalInches / 12);

  if (feet <= 0) {
    return null;
  }

  return {
    feet,
    inches: totalInches % 12,
  };
};

export const parseLegacyHeightToCentimeters = value => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return null;
  }

  const heightText = `${value}`.trim();
  const heightMatch = heightText.match(LEGACY_HEIGHT_PATTERN);

  if (!heightMatch) {
    return null;
  }

  const [, feetText, inchesText] = heightMatch;

  return feetInchesToCentimeters(feetText, inchesText);
};

export const formatHeight = (centimeters, unitPreference) => {
  if (!isBodyUnitPreference(unitPreference)) {
    return null;
  }

  const parsedCentimeters = toPositiveNumber(centimeters);

  if (parsedCentimeters === null) {
    return null;
  }

  if (unitPreference === METRIC_UNIT_PREFERENCE) {
    return `${Math.round(parsedCentimeters)} cm`;
  }

  const height = centimetersToFeetInches(parsedCentimeters);

  return height ? `${height.feet} ft ${height.inches} in` : null;
};

export const poundsToKilograms = pounds => {
  const parsedPounds = toPositiveNumber(pounds);

  return parsedPounds === null ? null : parsedPounds * KILOGRAMS_PER_POUND;
};

export const kilogramsToPounds = kilograms => {
  const parsedKilograms = toPositiveNumber(kilograms);

  return parsedKilograms === null
    ? null
    : parsedKilograms / KILOGRAMS_PER_POUND;
};

export const parseWeightToKilograms = (value, unitPreference) => {
  if (!isBodyUnitPreference(unitPreference)) {
    return null;
  }

  const parsedWeight = toPositiveNumber(value);

  if (parsedWeight === null) {
    return null;
  }

  return unitPreference === STANDARD_UNIT_PREFERENCE
    ? poundsToKilograms(parsedWeight)
    : parsedWeight;
};

export const formatWeight = (kilograms, unitPreference) => {
  if (!isBodyUnitPreference(unitPreference)) {
    return null;
  }

  const parsedKilograms = toPositiveNumber(kilograms);

  if (parsedKilograms === null) {
    return null;
  }

  if (unitPreference === METRIC_UNIT_PREFERENCE) {
    return `${parsedKilograms.toFixed(1)} kg`;
  }

  const pounds = kilogramsToPounds(parsedKilograms);

  return pounds === null ? null : `${pounds.toFixed(1)} lb`;
};
