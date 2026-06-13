import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {RFValue} from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';
import style from './style';
import {colors} from '../../../resources';

const InputModal = ({accessibilityLabel, toggleDatePicker, placeholder, value}) => (
  <View style={style.dropdownInput}>
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel || placeholder}
      accessibilityRole="button"
      onPress={toggleDatePicker}>
      <TextInput
        style={style.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.grey}
        underlineColorAndroid="transparent"
        editable={false}
      />
    </TouchableOpacity>

    <TouchableOpacity
      accessibilityLabel={accessibilityLabel || placeholder}
      accessibilityRole="button"
      onPress={toggleDatePicker}>
      <Icon
        style={style.arrowIcon}
        name="caretdown"
        size={RFValue(10)}
        color={colors.white}
      />
    </TouchableOpacity>
  </View>
);

InputModal.defaultProps = {
  accessibilityLabel: '',
};

InputModal.propTypes = {
  accessibilityLabel: PropTypes.string,
  toggleDatePicker: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default InputModal;
