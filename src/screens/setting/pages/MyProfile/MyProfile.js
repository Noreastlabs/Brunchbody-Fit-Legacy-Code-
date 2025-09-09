/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MyProfile } from '../../components';

const listData = [
  {
    id: 1,
    title: 'My Vitals',
    options: [{ id: 1, name: 'My Vitals', type: '', screen: 'MyVitals' }],
  },
  {
    id: 2,
    title: 'My Account',
    options: [{ id: 1, name: 'My Accounts', type: '', screen: 'MyAccount' }],
    screen: '',
  },
  {
    id: 3,
    title: 'Current Weight',
    options: [{ id: 1, name: '215 LBS', screen: '' }],
    screen: '',
  },
  {
    id: 4,
    title: 'BMI',
    options: [{ id: 1, name: '29.2', type: '', screen: '' }],
    screen: '',
  },
  {
    id: 5,
    title: 'BMR',
    options: [{ id: 1, name: '1850 CALORIES', type: '', screen: '' }],
    screen: '',
  },
  {
    id: 6,
    title: 'My Current Target Totals',
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
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <MyProfile
      {...props}
      isEnabled={isEnabled}
      setIsEnabled={setIsEnabled}
      toggleSwitch={toggleSwitch}
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
