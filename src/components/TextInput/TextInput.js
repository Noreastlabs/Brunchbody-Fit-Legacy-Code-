/* eslint-disable react/forbid-prop-types */
import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native';
import PropTypes from 'prop-types';
import {colors} from '../../resources';
import styles from './style';

export default class Input extends Component {
  render() {
    const {title, text, textStyle, titleStyle} = this.props;

    return (
      <View style={styles.col}>
        <Text style={[styles.text, titleStyle]}>{title}</Text>
        <TextInput
          style={[styles.TextInput, textStyle]}
          value={text}
          underlineColor="transparent"
          theme={{colors: {text: colors.mainFont}}}
        />
      </View>
    );
  }
}

Input.defaultProps = {
  titleStyle: {} || [],
  textStyle: {} || [],
};

Input.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  titleStyle: PropTypes.objectOf(PropTypes.any),
  textStyle: PropTypes.objectOf(PropTypes.any),
};
