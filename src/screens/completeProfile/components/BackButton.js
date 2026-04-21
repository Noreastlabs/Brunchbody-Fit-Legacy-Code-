import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';
import {images} from '../../../resources';
import styles from './style';

const BackButton = ({previousScreen, currentScreen, disabled}) => (
  <View style={styles.headerStyle}>
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={disabled}
      style={disabled ? styles.disabledBackButton : null}
      onPress={() => {
        currentScreen(previousScreen);
      }}>
      <Image style={styles.backIcon} source={images.arrow} />
    </TouchableOpacity>
  </View>
);

BackButton.defaultProps = {
  disabled: false,
};

BackButton.propTypes = {
  previousScreen: PropTypes.string.isRequired,
  currentScreen: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default BackButton;
