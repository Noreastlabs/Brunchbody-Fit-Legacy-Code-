/* eslint-disable react/forbid-prop-types */
import React from 'react';
import {ActivityIndicator, TouchableOpacity, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {colors} from '../../../resources';
import styles from './style';

const ModalButton = ({label, onPress, loader, style}) => (
  <TouchableOpacity
    activeOpacity={0.5}
    disabled={loader}
    onPress={onPress}
    style={[styles.submitButton, style]}>
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
};

ModalButton.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  loader: PropTypes.bool,
  style: PropTypes.any,
};

export default ModalButton;
