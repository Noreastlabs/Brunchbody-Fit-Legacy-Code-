/* eslint-disable react/forbid-prop-types */
import React, {Component} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';

export default class TextVal extends Component {
  render() {
    const {title, onPress, style} = this.props;

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onPress}
        style={styles.container}>
        <Text style={[styles.textStyle1, style]}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

TextVal.defaultProps = {
  title: '',
  style: {} || [],
};

TextVal.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any,
};
