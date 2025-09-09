import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import SplashScreen from '../../components';
import {loggedIn} from '../../../../redux/actions';

export default function SplashScreenPage(props) {
  const {navigation, onLoggedIn} = props;

  const checkToken = async () => {
    const response = await onLoggedIn();
    if (response === 'goToCompleteProfile') {
      navigation.navigate('CompleteProfile');
    } else if (response) {
      navigation.replace('Home');
    } else {
      navigation.replace('SignIn');
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return <SplashScreen />;
}

SplashScreenPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  onLoggedIn: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onLoggedIn: () => dispatch(loggedIn()),
});

export const SplashScreenWrapper = connect(
  null,
  mapDispatchToProps,
)(SplashScreenPage);
