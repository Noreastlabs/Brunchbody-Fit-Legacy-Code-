/* eslint-disable no-restricted-properties */
import { SET_USER } from '../constants';

const initialState = {
  user: {},
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER: {
      const userData = { ...action.payload };
      const userHeight =
        parseInt(
          userData?.height?.slice(0, userData?.height?.search('\\.')) * 12,
          10,
        ) +
        parseInt(
          userData?.height?.slice(userData?.height?.search('\\.') + 1),
          10,
        );
      const date = new Date();
      const currentDateArr = [
        `${date.getDate()}`.slice(-2),
        `${date.getMonth() + 1}`.slice(-2),
        date.getFullYear(),
      ];
      const userdobArr = userData?.dob?.split('/');
      const dobDay = parseInt(userdobArr[0], 10);
      const dobMonth = parseInt(userdobArr[1], 10);
      const dobYear = parseInt(userdobArr[2], 10);
      const currentDay = parseInt(currentDateArr[0], 10);
      const currentMonth = parseInt(currentDateArr[1], 10);
      const currentYear = parseInt(currentDateArr[2], 10);
      let actualAge = 0;

      if (dobMonth === currentMonth) {
        if (dobDay > currentDay) {
          actualAge = currentYear - dobYear - 1;
        } else {
          actualAge = currentYear - dobYear;
        }
      } else if (dobMonth > currentMonth) {
        actualAge = currentYear - dobYear - 1;
      } else {
        actualAge = currentYear - dobYear;
      }

      const bmi = (
        703 *
        (parseInt(userData?.weight, 10) / Math.pow(userHeight, 2))
      ).toFixed(2);

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

      const bmr = userData?.gender === 'female' ? bmrFemale : bmrMale;

      return {
        ...state,
        user: { ...userData, bmi, bmr },
      };
    }
    default:
      return state;
  }
};

export default authReducer;
