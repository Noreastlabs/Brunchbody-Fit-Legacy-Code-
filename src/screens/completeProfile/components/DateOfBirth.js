/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CustomModal,
  LogoHeader,
  DatePickerModal,
  PermissionModal,
} from '../../../components';
import {strings} from '../../../resources';
import NextButton from './NextButton';
import BackButton from './BackButton';
import Label from './Label';
import style from './style';
import InputModal from './DateInputModal';

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
    setIsDateSelected,
    permissionModal,
    setPermissionModal,
    alertText,
    alertHeading,
    onDonePermissionModal,
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
              placeholder={
                isDateSelected ? `${month}/${date}/${year}` : 'MM/DD/YYYY'
              }
              isDatePickerVisible={isDatePickerVisible}
              toggleDatePicker={toggleDatePicker}
            />
          </View>
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
            onConfirm={() => {
              setIsDateSelected(true);
              setDatePickerVisibility(false);
              AsyncStorage.setItem('dob', `${date}/${month}/${year}`);
            }}
            onCancel={() => {
              // setIsDateSelected(false);
              setDatePickerVisibility(false);
              // AsyncStorage.removeItem('dob');
            }}
          />
        }
      />

      <CustomModal
        isVisible={permissionModal}
        onDismiss={() => setPermissionModal(false)}
        content={
          <PermissionModal
            heading={alertHeading}
            text={alertText}
            onDone={onDonePermissionModal}
            onCancel={() => setPermissionModal(false)}
          />
        }
      />
    </SafeAreaView>
  );
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
  setIsDateSelected: PropTypes.func.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  alertText: PropTypes.string.isRequired,
  alertHeading: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
};

export default DateOfBirth;
