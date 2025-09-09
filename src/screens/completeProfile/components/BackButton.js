import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';
import {images} from '../../../resources';
import styles from './style';

const BackButton = ({previousScreen, currentScreen}) => (
  <View style={styles.headerStyle}>
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        currentScreen(previousScreen);
      }}>
      <Image style={{tintColor: 'white'}} source={images.arrow} />
    </TouchableOpacity>
  </View>
);

BackButton.propTypes = {
  previousScreen: PropTypes.string.isRequired,
  currentScreen: PropTypes.func.isRequired,
};

export default BackButton;
