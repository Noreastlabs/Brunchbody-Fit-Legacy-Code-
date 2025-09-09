/* eslint-disable react/jsx-props-no-spreading */
import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DateOfBirth} from '../../components';

let yearsList = [];

export const DateOfBirthPage = props => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(true);
  const [date, setDate] = useState(new Date().getDate());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setInitialDate();
    yearsList = [];

    for (let i = 0; i <= new Date().getFullYear() - 1900; i += 1) {
      yearsList.push({id: i, value: `${1900 + i}`});
    }
  }, []);

  const setInitialDate = async () => {
    const dob = await AsyncStorage.getItem('dob');

    if (dob) {
      const temp = dob.split('/');
      setDate(parseInt(temp[0], 10));
      setMonth(parseInt(temp[1], 10));
      setYear(parseInt(temp[2], 10));
    } else {
      AsyncStorage.setItem('dob', `${date}/${month}/${year}`);
    }
  };

  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  return (
    <DateOfBirth
      {...props}
      toggleDatePicker={toggleDatePicker}
      isDatePickerVisible={isDatePickerVisible}
      setDatePickerVisibility={setDatePickerVisibility}
      date={date}
      setDate={setDate}
      month={month}
      setMonth={setMonth}
      year={year}
      setYear={setYear}
      yearsList={yearsList}
      isDateSelected={isDateSelected}
      setIsDateSelected={setIsDateSelected}
    />
  );
};

DateOfBirthPage.propTypes = {
  currentScreen: PropTypes.func.isRequired,
};

export const DateOfBirthWrapper = connect(null, null)(DateOfBirthPage);
