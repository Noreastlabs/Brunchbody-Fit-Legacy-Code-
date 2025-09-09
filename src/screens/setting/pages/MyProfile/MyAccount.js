/* eslint-disable react/jsx-props-no-spreading */
import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {MyAccount} from '../../components';

const listData = [
  {
    id: 1,
    title: 'Email',
    options: [{id: 1, name: 'My Email', type: '', screen: 'MyEmail'}],
  },
  {
    id: 2,
    title: 'Password',
    options: [{id: 1, name: 'My Password', type: '', screen: 'MyPassword'}],
    screen: '',
  },
  {
    id: 3,
    title: 'Delete Account',
    options: [{id: 1, name: 'Delete Account', screen: 'DeleteAccount'}],
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
