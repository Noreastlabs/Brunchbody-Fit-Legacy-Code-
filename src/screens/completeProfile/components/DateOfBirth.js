import React from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {CustomModal, LogoHeader, DatePickerModal} from '../../../components';
import {strings} from '../../../resources';
import NextButton from './NextButton';
import BackButton from './BackButton';
import Label from './Label';
import SupportingText from './SupportingText';
import style from './style';
import InputModal from './DateInputModal';

const formatVisibleDob = ({date, month, year}) =>
  `${month}/${date}/${year}`;

const DateOfBirth = props => {
  const {
    currentScreen,
    isDatePickerVisible,
    date,
    month,
    year,
    toggleDatePicker,
    setDatePickerVisibility,
    isDateSelected,
    onConfirmDate,
    errorText,
  } = props;

  return (
    <SafeAreaView style={style.nameContainer}>
      <BackButton
        previousScreen={strings.completeProfile.screen.Name}
        currentScreen={currentScreen}
      />
      <ScrollView contentContainerStyle={style.scrollView}>
        <View style={style.logoContainer}>
          <LogoHeader />
        </View>
        <View style={style.nameInputContainer}>
          <Label text={strings.completeProfile.labels.DOB} />
          <View style={style.dropdownContainer}>
            <InputModal
              value={isDateSelected ? formatVisibleDob({date, month, year}) : ''}
              placeholder={strings.completeProfile.placeholders.dob}
              toggleDatePicker={toggleDatePicker}
            />
          </View>
          <SupportingText text={strings.completeProfile.helperText.dob} />
          <SupportingText text={errorText} tone="error" />
        </View>

        <NextButton
          nextScreen={strings.completeProfile.screen.Height}
          currentScreen={currentScreen}
        />
      </ScrollView>

      <CustomModal
        isVisible={isDatePickerVisible}
        onDismiss={() => setDatePickerVisibility(false)}
        content={
          <DatePickerModal
            {...props}
            onConfirm={selectedDate => {
              onConfirmDate(selectedDate);
              setDatePickerVisibility(false);
            }}
            onCancel={() => {
              setDatePickerVisibility(false);
            }}
          />
        }
      />
    </SafeAreaView>
  );
};

DateOfBirth.defaultProps = {
  errorText: '',
};

DateOfBirth.propTypes = {
  currentScreen: PropTypes.func.isRequired,
  isDatePickerVisible: PropTypes.bool.isRequired,
  date: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  toggleDatePicker: PropTypes.func.isRequired,
  setDatePickerVisibility: PropTypes.func.isRequired,
  isDateSelected: PropTypes.bool.isRequired,
  onConfirmDate: PropTypes.func.isRequired,
  errorText: PropTypes.string,
};

export default DateOfBirth;
