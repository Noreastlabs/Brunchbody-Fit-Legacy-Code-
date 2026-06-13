import React from 'react';
import {TextInput, View} from 'react-native';
import PropTypes from 'prop-types';
import {colors} from '../../../resources';
import style from './style';

const Input = ({
  accessibilityLabel,
  autoCapitalize,
  keyboardType,
  maxLength,
  onChangeText,
  placeholder,
  returnKeyType,
  text,
}) => (
  <View style={style.dropdownInput}>
    <TextInput
      value={text}
      maxLength={maxLength}
      placeholder={placeholder}
      placeholderTextColor={colors.grey}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
      accessibilityLabel={accessibilityLabel || placeholder}
      style={style.input}
    />
  </View>
);

Input.defaultProps = {
  accessibilityLabel: '',
  autoCapitalize: 'none',
  keyboardType: 'default',
  maxLength: undefined,
  returnKeyType: 'next',
};

Input.propTypes = {
  text: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  accessibilityLabel: PropTypes.string,
  autoCapitalize: PropTypes.string,
  keyboardType: PropTypes.string,
  maxLength: PropTypes.number,
  returnKeyType: PropTypes.string,
};
export default Input;
