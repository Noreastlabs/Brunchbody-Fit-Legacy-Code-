import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import SplashScreen from '../../components';

export default function SplashScreenPage({ navigation }) {
  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        navigation.replace('Home');
      } else {
        navigation.replace('Welcome');
      }
    };
    checkUser();
  }, [navigation]);

  return <SplashScreen />;
}

SplashScreenPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export const SplashScreenWrapper = SplashScreenPage;
