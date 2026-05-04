/* eslint-disable no-restricted-properties */
import { CLEAR_USER, SET_USER } from '../constants';
import {
  calculateBmiFromImperial,
  calculateBmiFromMetric,
  calculateBmrFromImperial,
  calculateBmrFromMetric,
  legacyHeightToInches,
  legacyWeightToPounds,
} from '../../utils/bodyMetrics';

const initialState = {
  user: {},
};

const DERIVED_PROFILE_FIELDS = ['bmi', 'bmr'];

const stripDerivedProfileFields = userData => {
  const sanitizedUserData =
    userData && typeof userData === 'object' && !Array.isArray(userData)
      ? { ...userData }
      : {};

  DERIVED_PROFILE_FIELDS.forEach(field => {
    delete sanitizedUserData[field];
  });

  return sanitizedUserData;
};

const getCurrentDateArr = (date = new Date()) => [
  `${date.getDate()}`.slice(-2),
  `${date.getMonth() + 1}`.slice(-2),
  date.getFullYear(),
];

const getActualAge = userdob => {
  const currentDateArr = getCurrentDateArr();
  const userdobArr = userdob?.split('/');

  if (!Array.isArray(userdobArr) || userdobArr.length !== 3) {
    return null;
  }

  const dobDay = parseInt(userdobArr[0], 10);
  const dobMonth = parseInt(userdobArr[1], 10);
  const dobYear = parseInt(userdobArr[2], 10);
  const currentDay = parseInt(currentDateArr[0], 10);
  const currentMonth = parseInt(currentDateArr[1], 10);
  const currentYear = parseInt(currentDateArr[2], 10);

  if (
    !Number.isFinite(dobDay) ||
    !Number.isFinite(dobMonth) ||
    !Number.isFinite(dobYear)
  ) {
    return null;
  }

  if (dobMonth === currentMonth) {
    if (dobDay > currentDay) {
      return currentYear - dobYear - 1;
    }

    return currentYear - dobYear;
  }

  if (dobMonth > currentMonth) {
    return currentYear - dobYear - 1;
  }

  return currentYear - dobYear;
};

const isPositiveFiniteNumber = value =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const getCanonicalBodyMetricInputs = userData => {
  if (
    !isPositiveFiniteNumber(userData?.heightCentimeters) ||
    !isPositiveFiniteNumber(userData?.weightKilograms)
  ) {
    return null;
  }

  return {
    heightCentimeters: userData.heightCentimeters,
    weightKilograms: userData.weightKilograms,
  };
};

const getLegacyBodyMetricInputs = userData => {
  const heightInches = legacyHeightToInches(userData?.height);
  const weightPounds = legacyWeightToPounds(userData?.weight);

  if (heightInches === null || weightPounds === null) {
    return null;
  }

  return {
    heightInches,
    weightPounds,
  };
};

const getBodyMetricInputs = userData => {
  const canonicalInputs = getCanonicalBodyMetricInputs(userData);

  if (canonicalInputs) {
    return {
      source: 'canonical',
      values: canonicalInputs,
    };
  }

  const legacyInputs = getLegacyBodyMetricInputs(userData);

  if (legacyInputs) {
    return {
      source: 'legacy',
      values: legacyInputs,
    };
  }

  return null;
};

const formatDerivedMetric = calculatedMetric => {
  if (!Number.isFinite(calculatedMetric)) {
    return null;
  }

  return calculatedMetric.toFixed(2);
};

const getLegacyBmi = legacyInputs =>
  formatDerivedMetric(calculateBmiFromImperial(legacyInputs));

const getCanonicalBmi = canonicalInputs =>
  formatDerivedMetric(calculateBmiFromMetric(canonicalInputs));

const getBmi = bodyMetricInputs => {
  if (!bodyMetricInputs) {
    return null;
  }

  return bodyMetricInputs.source === 'canonical'
    ? getCanonicalBmi(bodyMetricInputs.values)
    : getLegacyBmi(bodyMetricInputs.values);
};

const getLegacyBmr = ({legacyInputs, age, gender}) =>
  formatDerivedMetric(
    calculateBmrFromImperial({
      ...legacyInputs,
      age,
      gender,
    }),
  );

const getCanonicalBmr = ({canonicalInputs, age, gender}) =>
  formatDerivedMetric(
    calculateBmrFromMetric({
      ...canonicalInputs,
      age,
      gender,
    }),
  );

const getBmr = ({bodyMetricInputs, age, gender}) => {
  if (!bodyMetricInputs) {
    return null;
  }

  if (bodyMetricInputs.source === 'canonical') {
    return getCanonicalBmr({
      canonicalInputs: bodyMetricInputs.values,
      age,
      gender,
    });
  }

  return getLegacyBmr({
    legacyInputs: bodyMetricInputs.values,
    age,
    gender,
  });
};

const deriveUserMetrics = userData => {
  const bodyMetricInputs = getBodyMetricInputs(userData);
  const age = getActualAge(userData?.dob);
  const gender = userData?.gender;
  const bmi = getBmi(bodyMetricInputs);
  const bmr = getBmr({bodyMetricInputs, age, gender});

  return {
    ...(bmi ? { bmi } : {}),
    ...(bmr ? { bmr } : {}),
  };
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER: {
      const userData = stripDerivedProfileFields(action.payload || {});
      const derivedMetrics = deriveUserMetrics(userData);

      return {
        ...state,
        user: { ...userData, ...derivedMetrics },
      };
    }
    case CLEAR_USER:
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
