/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SETTINGS_ROUTES } from '../../../../navigation/routeNames';
import { MyProfile } from '../../components';

const listData = [
  {
    id: 1,
    title: 'Profile',
    options: [
      {
        id: 1,
        name: 'Edit nickname and vitals',
        type: '',
        screen: SETTINGS_ROUTES.MY_VITALS,
      },
    ],
  },
  {
    id: 2,
    title: 'Current Weight',
    options: [{ id: 1, name: '215 LBS', screen: '' }],
    screen: '',
  },
  {
    id: 3,
    title: 'BMI',
    options: [{ id: 1, name: '29.2', type: '', screen: '' }],
    screen: '',
  },
  {
    id: 4,
    title: 'BMR',
    options: [{ id: 1, name: '1850 CALORIES', type: '', screen: '' }],
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
        list: [
          { id: 1, name: 'FAT', value: '0' },
          { id: 2, name: 'PRT', value: '0' },
          { id: 3, name: 'CHO', value: '0' },
          { id: 4, name: 'CAL', value: '0' },
        ],
      },
    ],
    screen: '',
  },
];

export default function MyProfilePage(props) {
  const { navigation } = props;

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
};

const mapStateToProps = state => ({
  user: state.auth?.user,
});

export const MyProfileWrapper = connect(mapStateToProps, null)(MyProfilePage);
