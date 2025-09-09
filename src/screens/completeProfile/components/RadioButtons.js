import React from 'react';
import {View, Text} from 'react-native';
import {RadioButton} from 'react-native-paper';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from './style';
import {colors} from '../../../resources';

const RadioButtons = ({option1, option2}) => {
  const [checked, setChecked] = React.useState('first');
  return (
    <View style={style.radioBtnContainer}>
      <RadioButton.Android
        uncheckedColor={colors.grey}
        value="first"
        status={checked === 'first' ? 'checked' : 'unchecked'}
        onPress={() => {
          setChecked('first');
          AsyncStorage.setItem('gender', 'male');
        }}
      />
      <Text style={style.genderText}>{option1}</Text>
      <RadioButton.Android
        uncheckedColor={colors.grey}
        value="second"
        status={checked === 'second' ? 'checked' : 'unchecked'}
        onPress={() => {
          setChecked('second');
          AsyncStorage.setItem('gender', 'female');
        }}
      />
      <Text style={style.genderText}>{option2}</Text>
    </View>
  );
};

RadioButtons.propTypes = {
  option1: PropTypes.string.isRequired,
  option2: PropTypes.string.isRequired,
};

export default RadioButtons;
