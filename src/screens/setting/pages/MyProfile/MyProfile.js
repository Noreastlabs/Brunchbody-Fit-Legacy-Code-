/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SETTINGS_ROUTES } from '../../../../navigation/routeNames';
import { MyProfile } from '../../components';

const DEFAULT_TARGET_TOTALS = [
  { id: 1, name: 'FAT', value: '--' },
  { id: 2, name: 'PRT', value: '--' },
  { id: 3, name: 'CHO', value: '--' },
  { id: 4, name: 'CAL', value: '--' },
];

const hasDisplayValue = value =>
  value !== null && value !== undefined && `${value}`.trim() !== '';

const getTrimmedDisplayValue = value => `${value}`.trim();

const getBmiBadgeTone = bmi => {
  if (bmi < 18.5) {
    return { badgeText: 'Underweight', badgeTone: 'underweight' };
  }

  if (bmi <= 24.9) {
    return { badgeText: 'Normal', badgeTone: 'normal' };
  }

  if (bmi <= 29.9) {
    return { badgeText: 'Overweight', badgeTone: 'overweight' };
  }

  if (bmi <= 34.9) {
    return { badgeText: 'Obese', badgeTone: 'obese' };
  }

  return { badgeText: 'Danger', badgeTone: 'danger' };
};

const getTargetTotals = user => {
  if (!Array.isArray(user?.targetCalories) || user.targetCalories.length !== 4) {
    return DEFAULT_TARGET_TOTALS;
  }

  return user.targetCalories.map((item, index) => ({
    id: item?.id || DEFAULT_TARGET_TOTALS[index].id,
    name: hasDisplayValue(item?.name)
      ? getTrimmedDisplayValue(item.name).toUpperCase()
      : DEFAULT_TARGET_TOTALS[index].name,
    value: hasDisplayValue(item?.value)
      ? getTrimmedDisplayValue(item.value)
      : '--',
  }));
};

export default function MyProfilePage(props) {
  const { navigation, user } = props;
  const nickname = hasDisplayValue(user?.name)
    ? getTrimmedDisplayValue(user.name)
    : 'No nickname set';
  const weightText = hasDisplayValue(user?.weight)
    ? `${getTrimmedDisplayValue(user.weight)} LBS`
    : 'Not set';
  const bmrText = hasDisplayValue(user?.bmr)
    ? `${getTrimmedDisplayValue(user.bmr)} CALORIES`
    : 'Not set';
  const parsedBmi = Number(user?.bmi);
  const bmiSummary = Number.isFinite(parsedBmi)
    ? {
        displayValue: hasDisplayValue(user?.bmi)
          ? getTrimmedDisplayValue(user.bmi)
          : parsedBmi.toFixed(2),
        ...getBmiBadgeTone(parsedBmi),
      }
    : {
        displayValue: '--',
        badgeText: '',
        badgeTone: '',
      };
  const listData = [
    {
      id: 1,
      title: 'Profile',
      options: [
        {
          id: 1,
          name: 'Edit nickname and vitals',
          displayValue: nickname,
          type: '',
          screen: SETTINGS_ROUTES.MY_VITALS,
        },
      ],
    },
    {
      id: 2,
      title: 'Current Weight',
      options: [{ id: 1, displayValue: weightText, screen: '' }],
      screen: '',
    },
    {
      id: 3,
      title: 'BMI',
      options: [
        {
          id: 1,
          displayValue: bmiSummary.displayValue,
          badgeText: bmiSummary.badgeText,
          badgeTone: bmiSummary.badgeTone,
          type: '',
          screen: '',
        },
      ],
      screen: '',
    },
    {
      id: 4,
      title: 'BMR',
      options: [{ id: 1, displayValue: bmrText, type: '', screen: '' }],
      screen: '',
    },
    {
      id: 5,
      title: 'Current Target Totals',
      options: [
        {
          id: 1,
          name: '',
          value: '',
          type: '',
          screen: '',
          list: getTargetTotals(user),
        },
      ],
      screen: '',
    },
  ];

  return (
    <MyProfile
      {...props}
      navigation={navigation}
      listData={listData}
    />
  );
}

MyProfilePage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any),
};

MyProfilePage.defaultProps = {
  user: {},
};

const mapStateToProps = state => ({
  user: state.auth?.user || {},
});

export const MyProfileWrapper = connect(mapStateToProps, null)(MyProfilePage);
