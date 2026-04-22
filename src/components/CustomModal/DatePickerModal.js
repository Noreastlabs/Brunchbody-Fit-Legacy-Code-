/* eslint-disable eqeqeq */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DatePicker } from 'react-native-wheel-pick';
import { colors } from '../../resources';
import styles from './style';

export default function DatePickerModal(props) {
  const { onConfirm, onCancel, setDate, setMonth, setYear, date, month, year } =
    props;

  const [selectedDateStr, setSelectedDateStr] = useState(
    () => new Date(year, month - 1, date),
  );

  useEffect(() => {
    setSelectedDateStr(new Date(year, month - 1, date));
  }, [date, month, year]);

  const handleConfirm = () => {
    if (selectedDateStr) {
      const parsedDate = new Date(selectedDateStr);
      setDate(parsedDate.getDate());
      setMonth(parsedDate.getMonth() + 1);
      setYear(parsedDate.getFullYear());
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
  date: new Date().getDate(),
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
};

DatePickerModal.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  date: PropTypes.number,
  month: PropTypes.number,
  setDate: PropTypes.func.isRequired,
  setMonth: PropTypes.func.isRequired,
  setYear: PropTypes.func.isRequired,
  year: PropTypes.number,
};
