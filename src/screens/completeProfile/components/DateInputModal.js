import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {RFValue} from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';
import style from './style';
import {colors} from '../../../resources';

const InputModal = ({toggleDatePicker, placeholder}) => (
  <View style={style.dropdownInput}>
    <TouchableOpacity onPress={toggleDatePicker}>
      <TextInput
        style={style.input}
        placeholder={placeholder}
        placeholderTextColor={colors.grey}
        underlineColorAndroid="transparent"
        editable={false}
      />
    </TouchableOpacity>

    <TouchableOpacity onPress={toggleDatePicker}>
      <Icon
        style={style.arrowIcon}
        name="caretdown"
        size={RFValue(10)}
        color={colors.white}
      />
    </TouchableOpacity>
  </View>
);

InputModal.propTypes = {
  toggleDatePicker: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default InputModal;
