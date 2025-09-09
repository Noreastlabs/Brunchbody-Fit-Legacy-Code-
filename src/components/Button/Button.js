/* eslint-disable react/forbid-prop-types */
import React, {Component} from 'react';
import {Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import {colors} from '../../resources';

export default class Button extends Component {
  render() {
    const {title, onPress, style, titleStyle, disabled, loader, opacity} =
      this.props;

    return (
      <>
        {disabled ? (
          <TouchableOpacity
            activeOpacity={opacity}
            disabled={disabled}
            onPress={onPress}
            style={[
              styles.container,
              style,
              {
                backgroundColor: disabled
                  ? colors.nonEditableOverlays
                  : colors.secondary,
              },
            ]}>
            <Text style={[styles.textStyle1, titleStyle]}>{title}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={opacity}
            disabled={loader}
            onPress={onPress}
            style={[styles.container, style]}>
            {loader ? (
              <ActivityIndicator size="large" color={colors.white} />
            ) : (
              <Text style={[styles.textStyle1, titleStyle]}>{title}</Text>
            )}
          </TouchableOpacity>
        )}
      </>
    );
  }
}

Button.defaultProps = {
  title: '',
  style: {} || [],
  titleStyle: {},
  disabled: false,
  loader: false,
  opacity: 0.5,
};

Button.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any,
  titleStyle: PropTypes.objectOf(PropTypes.any),
  disabled: PropTypes.bool,
  loader: PropTypes.bool,
  opacity: PropTypes.number,
};
