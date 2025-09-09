import React from 'react';
import {Image, View} from 'react-native';
import {images} from '../../../resources';
import styles from './style';

const SplashScreen = () => (
  <View style={styles.container}>
    <Image style={styles.image} resizeMode="contain" source={images.logo} />
  </View>
);

export default SplashScreen;
