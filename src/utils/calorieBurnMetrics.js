const LEGACY_POUNDS_PER_KILOGRAM = 2.205;
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

const hasCanonicalProfileWeightKilograms = weightKilograms =>
  typeof weightKilograms === 'number' &&
  Number.isFinite(weightKilograms) &&
  weightKilograms > 0;

export const selectProfileWeightForCalorieBurn = profile =>
  hasCanonicalProfileWeightKilograms(profile?.weightKilograms)
    ? {weightKilograms: profile.weightKilograms}
    : {weightPounds: profile?.weight};

export const legacyWeightPoundsToKilograms = weightPounds => {
  const parsedWeightPounds = toPositiveNumber(weightPounds);

  return parsedWeightPounds === null
    ? null
    : parsedWeightPounds / LEGACY_POUNDS_PER_KILOGRAM;
};

export const calculateCaloriesBurnedFromKilograms = values => {
  const {weightKilograms, met, durationMinutes} = values || {};
  const parsedWeightKilograms = toPositiveNumber(weightKilograms);
  const parsedMet = toPositiveNumber(met);
  const parsedDurationMinutes = toPositiveNumber(durationMinutes);

  if (
    parsedWeightKilograms === null ||
    parsedMet === null ||
    parsedDurationMinutes === null
  ) {
    return null;
  }

  const caloriesPerMinute = (parsedMet * 3.5 * parsedWeightKilograms) / 200;

  return caloriesPerMinute * parsedDurationMinutes;
};

export const calculateCaloriesBurnedFromPounds = values => {
  const {weightPounds, met, durationMinutes} = values || {};
  const weightKilograms = legacyWeightPoundsToKilograms(weightPounds);

  if (weightKilograms === null) {
    return null;
  }

  return calculateCaloriesBurnedFromKilograms({
    weightKilograms,
    met,
    durationMinutes,
  });
};
