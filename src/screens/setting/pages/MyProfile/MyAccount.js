/* eslint-disable react/jsx-props-no-spreading */
import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { SETTINGS_ROUTES } from '../../../../navigation/routeNames';
import MyAccount from '../../components/My Profile/MyAccount';

const listData = [
  {
    id: 1,
    title: 'Email',
    options: [
      {
        id: 1,
        name: 'My Email',
        type: '',
        screen: SETTINGS_ROUTES.MY_EMAIL,
      },
    ],
  },
  {
    id: 2,
    title: 'Password',
    options: [
      {
        id: 1,
        name: 'My Password',
        type: '',
        screen: SETTINGS_ROUTES.MY_PASSWORD,
      },
    ],
    screen: '',
  },
  {
    id: 3,
    title: 'Delete Account',
    options: [
      {
        id: 1,
        name: 'Delete Account',
        screen: SETTINGS_ROUTES.DELETE_ACCOUNT,
      },
    ],
    screen: '',
  },
];

export default function MyAccountPage(props) {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };

  const {navigation} = props;
  return (
    <MyAccount
      isEnabled={isEnabled}
      setIsEnabled={setIsEnabled}
      toggleSwitch={toggleSwitch}
      navigation={navigation}
      listData={listData}
    />
  );
}

MyAccountPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export const MyAccountWrapper = connect(null, null)(MyAccountPage);
