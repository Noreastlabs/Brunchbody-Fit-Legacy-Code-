/* eslint-disable eqeqeq */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DatePicker } from 'react-native-wheel-pick';
import { colors } from '../../resources';
import styles from './style';

export default function DatePickerModal(props) {
  const { onConfirm, onCancel, setDate, setMonth, setYear } = props;

  const [selectedDateStr, setSelectedDateStr] = useState(new Date());

  const handleConfirm = () => {
    if (selectedDateStr) {
      const parsedDate = new Date(selectedDateStr);
      setDate(parsedDate.getDate());
      setMonth(parsedDate.getMonth() + 1);
      setYear(parsedDate.getFullYear());
      console.log(parsedDate.toString(), 'duyatsduyatsduatsd');
      onConfirm(parsedDate);
    } else {
      onConfirm();
    }
  };

  return (
    <>
      <View style={styles.wheelPickerContainer}>
        <View style={styles.wheelPickerView2}>
          <DatePicker
            style={styles.wheelPickerStyle}
            date={selectedDateStr}
            onDateChange={date => {
              console.log(date.getDate(), 'selectedDate');
              setSelectedDateStr(date);
            }}
            selectTextColor={colors.brightGreen}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.pickerBtnsView}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.wheelPickerContainer, { marginTop: 0 }]}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.pickerBtnsView}
          onPress={onCancel}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

DatePickerModal.defaultProps = {
  onConfirm: () => {},
};

DatePickerModal.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  setDate: PropTypes.func.isRequired,
  setMonth: PropTypes.func.isRequired,
  setYear: PropTypes.func.isRequired,
};
