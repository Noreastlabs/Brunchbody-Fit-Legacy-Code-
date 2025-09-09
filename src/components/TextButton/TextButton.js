/* eslint-disable react/forbid-prop-types */
import React, {Component} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';

export default class TextButton extends Component {
  render() {
    const {title, onPress, style, titleStyle, disabled} = this.props;

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onPress}
        disabled={disabled}
        style={[styles.container, style]}>
        <Text style={[styles.textStyle1, titleStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

TextButton.defaultProps = {
  title: '',
  style: {} || [],
  titleStyle: {},
  disabled: false,
};

TextButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any,
  titleStyle: PropTypes.objectOf(PropTypes.any),
  disabled: PropTypes.bool,
};
