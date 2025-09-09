import React from 'react';
// import {Picker} from 'react-native-wheel-datepicker';
import PropTypes from 'prop-types';
import { View } from 'react-native';

const Dropdown = ({data, initialValue, value}) => (
  <View/>
  // <Picker
  //   selectedValue={initialValue}
  //   textColor={colors.white}
  //   style={style.heightPicker}
  //   pickerData={data}
  //   onValueChange={val => value(val)}
  // />
);

Dropdown.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  initialValue: PropTypes.number.isRequired,
  value: PropTypes.func.isRequired,
};
export default Dropdown;
