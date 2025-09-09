import React from 'react';
import {TextInput, View} from 'react-native';
import PropTypes from 'prop-types';
import {colors} from '../../../resources';
import style from './style';

const Input = ({placeholder, onChangeText, keyboardType, maxLength, text}) => (
  <View style={style.dropdownInput}>
    <TextInput
      value={text}
      maxLength={maxLength}
      placeholder={placeholder}
      placeholderTextColor={colors.grey}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      style={style.input}
    />
  </View>
);

Input.defaultProps = {
  keyboardType: 'default',
  maxLength: undefined,
};

Input.propTypes = {
  placeholder: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  keyboardType: PropTypes.string,
  maxLength: PropTypes.number,
};
export default Input;
