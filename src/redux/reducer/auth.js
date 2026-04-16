/* eslint-disable no-restricted-properties */
import { CLEAR_USER, SET_USER } from '../constants';

const initialState = {
  user: {},
};

const getUserHeight = userData =>
  parseInt(
    userData?.height?.slice(0, userData?.height?.search('\\.')) * 12,
    10,
  ) +
  parseInt(
    userData?.height?.slice(userData?.height?.search('\\.') + 1),
    10,
  );

const getCurrentDateArr = (date = new Date()) => [
  `${date.getDate()}`.slice(-2),
  `${date.getMonth() + 1}`.slice(-2),
  date.getFullYear(),
];

const getActualAge = userdob => {
  const currentDateArr = getCurrentDateArr();
  const userdobArr = userdob?.split('/');
  const dobDay = parseInt(userdobArr[0], 10);
  const dobMonth = parseInt(userdobArr[1], 10);
  const dobYear = parseInt(userdobArr[2], 10);
  const currentDay = parseInt(currentDateArr[0], 10);
  const currentMonth = parseInt(currentDateArr[1], 10);
  const currentYear = parseInt(currentDateArr[2], 10);

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

const getBmi = (weight, userHeight) =>
  (703 * (parseInt(weight, 10) / Math.pow(userHeight, 2))).toFixed(2);

const getBmr = (userData, userHeight, actualAge) => {
  const bmrMale = (
    66 +
    6.23 * userData?.weight +
    12.7 * userHeight -
    6.8 * actualAge
  ).toFixed(2);

  const bmrFemale = (
    655 +
    4.35 * userData?.weight +
    4.7 * userHeight -
    4.7 * actualAge
  ).toFixed(2);

  return userData?.gender === 'female' ? bmrFemale : bmrMale;
};

const deriveUserMetrics = userData => {
  const userHeight = getUserHeight(userData);
  const actualAge = getActualAge(userData?.dob);

  return {
    bmi: getBmi(userData?.weight, userHeight),
    bmr: getBmr(userData, userHeight, actualAge),
  };
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER: {
      const userData = { ...action.payload };
      const { bmi, bmr } = deriveUserMetrics(userData);

      return {
        ...state,
        user: { ...userData, bmi, bmr },
      };
    }
    case CLEAR_USER:
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
