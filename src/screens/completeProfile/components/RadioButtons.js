import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {RadioButton} from 'react-native-paper';
import PropTypes from 'prop-types';
import style from './style';
import {colors} from '../../../resources';

const RadioButtons = ({option1, option2, value, onChange, disabled}) => (
  <View style={style.radioBtnContainer}>
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={style.radioOption}
      onPress={() => onChange('male')}>
      <RadioButton.Android
        disabled={disabled}
        uncheckedColor={colors.grey}
        value="male"
        status={value === 'male' ? 'checked' : 'unchecked'}
        onPress={() => onChange('male')}
      />
      <Text style={style.genderText}>{option1}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={style.radioOption}
      onPress={() => onChange('female')}>
      <RadioButton.Android
        disabled={disabled}
        uncheckedColor={colors.grey}
        value="female"
        status={value === 'female' ? 'checked' : 'unchecked'}
        onPress={() => onChange('female')}
      />
      <Text style={style.genderText}>{option2}</Text>
    </TouchableOpacity>
  </View>
);

RadioButtons.defaultProps = {
  disabled: false,
};

RadioButtons.propTypes = {
  option1: PropTypes.string.isRequired,
  option2: PropTypes.string.isRequired,
  value: PropTypes.oneOf(['male', 'female']).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default RadioButtons;
