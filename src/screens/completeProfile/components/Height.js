/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CustomModal,
  LogoHeader,
  HeightPickerModal,
  PermissionModal,
} from '../../../components';
import InputModal from './DateInputModal';
import NextButton from './NextButton';
import BackButton from './BackButton';
import Label from './Label';
import {strings} from '../../../resources';
import style from './style';

const Height = props => {
  const {
    currentScreen,
    modalVisible,
    setModalVisible,
    feet,
    inches,
    isHeightSelected,
    setIsHeightSelected,
    permissionModal,
    setPermissionModal,
    alertText,
    alertHeading,
    onDonePermissionModal,
  } = props;

  return (
    <SafeAreaView style={style.nameContainer}>
      <BackButton
        previousScreen={strings.completeProfile.screen.DOB}
        currentScreen={currentScreen}
      />
      <ScrollView contentContainerStyle={style.scrollView}>
        <View style={style.logoContainer}>
          <LogoHeader />
        </View>
        <View style={style.nameInputContainer}>
          <Label text={strings.completeProfile.labels.height} />
          <View style={style.dropdownContainer}>
            <InputModal
              placeholder={isHeightSelected ? `${feet}'${inches}''` : 'Height'}
              isDatePickerVisible={modalVisible}
              toggleDatePicker={() => setModalVisible(true)}
            />
          </View>
        </View>
        <NextButton
          nextScreen={strings.completeProfile.screen.Weight}
          currentScreen={currentScreen}
        />
      </ScrollView>

      <CustomModal
        isVisible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        content={
          <HeightPickerModal
            {...props}
            onConfirm={() => {
              setIsHeightSelected(true);
              setModalVisible(false);
              AsyncStorage.setItem('height', `${feet}.${inches}`);
            }}
            onCancel={() => {
              // setIsHeightSelected(false);
              setModalVisible(false);
              // AsyncStorage.removeItem('height');
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

Height.propTypes = {
  currentScreen: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
  feet: PropTypes.number.isRequired,
  inches: PropTypes.number.isRequired,
  isHeightSelected: PropTypes.bool.isRequired,
  setIsHeightSelected: PropTypes.func.isRequired,
  permissionModal: PropTypes.bool.isRequired,
  setPermissionModal: PropTypes.func.isRequired,
  alertText: PropTypes.string.isRequired,
  alertHeading: PropTypes.string.isRequired,
  onDonePermissionModal: PropTypes.func.isRequired,
};

export default Height;
