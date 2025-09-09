import PropTypes from 'prop-types';
import React from 'react';
import { Calendar } from 'react-native-calendars';
import { colors } from '../../../resources';

export default function CalendarUI(props) {
  const {frequencyThemes, onMonthChange, setTodoListDate} = props;
  return (
    <Calendar
      current={new Date()}
      markingType="custom"
      markedDates={frequencyThemes}
      onMonthChange={month => onMonthChange(month)}
      onDayPress={day => setTodoListDate(day.dateString)}
      theme={{
        backgroundColor: colors.secondary,
        calendarBackground: '#000000',
        textSectionTitleColor: colors.nonEditableOverlays,
        dayTextColor: colors.white,
        textDisabledColor: colors.nonEditableOverlays,
        arrowColor: colors.white,
        disabledArrowColor: colors.nonEditableOverlays,
        monthTextColor: colors.secondary,
        textDayFontWeight: '300',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '300',
        textDayFontSize: 16,
        textMonthFontSize: 30,
        textDayHeaderFontSize: 16,
      }}
    />
  );
}

CalendarUI.propTypes = {
  frequencyThemes: PropTypes.objectOf(PropTypes.any).isRequired,
  onMonthChange: PropTypes.func.isRequired,
  setTodoListDate: PropTypes.func.isRequired,
};
