/* eslint-disable no-restricted-properties */
import { CLEAR_USER, SET_USER } from '../constants';
import {
  calculateBmiFromImperial,
  calculateBmrFromImperial,
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

const getUserHeight = userData => {
  if (typeof userData?.height !== 'string') {
    return null;
  }

  const [feetValue, inchesValue] = userData.height.split('.');
  const feet = parseInt(feetValue, 10);
  const inches = parseInt(inchesValue, 10);

  if (!Number.isFinite(feet) || !Number.isFinite(inches)) {
    return null;
  }

  return feet * 12 + inches;
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

const getParsedWeight = weight => {
  const parsedWeight = parseInt(weight, 10);

  return Number.isFinite(parsedWeight) ? parsedWeight : null;
};

const getBmi = (weight, userHeight) => {
  const parsedWeight = getParsedWeight(weight);

  const bmi = calculateBmiFromImperial({
    heightInches: userHeight,
    weightPounds: parsedWeight,
  });

  if (!Number.isFinite(bmi)) {
    return null;
  }

  return bmi.toFixed(2);
};

const getBmr = (userData, userHeight, actualAge) => {
  const parsedWeight = getParsedWeight(userData?.weight);

  const bmr = calculateBmrFromImperial({
    heightInches: userHeight,
    weightPounds: parsedWeight,
    age: actualAge,
    gender: userData?.gender,
  });

  if (!Number.isFinite(bmr)) {
    return null;
  }

  return bmr.toFixed(2);
};

const deriveUserMetrics = userData => {
  const userHeight = getUserHeight(userData);
  const actualAge = getActualAge(userData?.dob);
  const bmi = getBmi(userData?.weight, userHeight);
  const bmr = getBmr(userData, userHeight, actualAge);

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
