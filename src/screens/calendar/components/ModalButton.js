/* eslint-disable react/forbid-prop-types */
import React from 'react';
import {ActivityIndicator, TouchableOpacity, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {colors} from '../../../resources';
import styles from './style';

const ModalButton = ({label, onPress, loader, style, disabled}) => (
  <TouchableOpacity
    activeOpacity={0.5}
    disabled={loader || disabled}
    onPress={onPress}
    style={[
      styles.submitButton,
      style,
      disabled && !loader ? {opacity: 0.6} : null,
    ]}>
    {loader ? (
      <View style={styles.loaderView}>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    ) : (
      <Text style={styles.submitButtonLabel}>{label}</Text>
    )}
  </TouchableOpacity>
);

ModalButton.defaultProps = {
  style: {} || [],
  loader: false,
  disabled: false,
};

ModalButton.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  loader: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.any,
};

export default ModalButton;
