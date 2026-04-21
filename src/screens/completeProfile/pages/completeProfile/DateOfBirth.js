import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {DateOfBirth} from '../../components';

const DEFAULT_DOB = {
  date: new Date().getDate(),
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
};

export const DateOfBirthPage = ({
  selectedDate,
  isDateConfirmed,
  onConfirmDate: persistConfirmedDate,
  ...props
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(selectedDate?.date || DEFAULT_DOB.date);
  const [month, setMonth] = useState(selectedDate?.month || DEFAULT_DOB.month);
  const [year, setYear] = useState(selectedDate?.year || DEFAULT_DOB.year);

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    setDate(selectedDate.date);
    setMonth(selectedDate.month);
    setYear(selectedDate.year);
  }, [selectedDate]);

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
      isDateSelected={isDateConfirmed}
      onConfirmDate={confirmedDate => {
        const nextValue = confirmedDate
          ? {
              date: confirmedDate.getDate(),
              month: confirmedDate.getMonth() + 1,
              year: confirmedDate.getFullYear(),
            }
          : {date, month, year};

        setDate(nextValue.date);
        setMonth(nextValue.month);
        setYear(nextValue.year);
        persistConfirmedDate(nextValue);
      }}
    />
  );
};

DateOfBirthPage.defaultProps = {
  selectedDate: null,
  errorText: '',
};

DateOfBirthPage.propTypes = {
  currentScreen: PropTypes.func.isRequired,
  selectedDate: PropTypes.shape({
    date: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  }),
  isDateConfirmed: PropTypes.bool.isRequired,
  onConfirmDate: PropTypes.func.isRequired,
  errorText: PropTypes.string,
};

export const DateOfBirthWrapper = connect(null, null)(DateOfBirthPage);
