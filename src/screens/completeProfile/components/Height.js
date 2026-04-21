import React from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {CustomModal, LogoHeader, HeightPickerModal} from '../../../components';
import InputModal from './DateInputModal';
import NextButton from './NextButton';
import BackButton from './BackButton';
import Label from './Label';
import SupportingText from './SupportingText';
import {strings} from '../../../resources';
import style from './style';

const formatVisibleHeight = ({feet, inches}) => `${feet} ft ${inches} in`;

const Height = props => {
  const {
    currentScreen,
    modalVisible,
    setModalVisible,
    feet,
    inches,
    isHeightSelected,
    onConfirmHeight,
    errorText,
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
              value={isHeightSelected ? formatVisibleHeight({feet, inches}) : ''}
              placeholder={strings.completeProfile.placeholders.height}
              toggleDatePicker={() => setModalVisible(true)}
            />
          </View>
          <SupportingText text={strings.completeProfile.helperText.height} />
          <SupportingText text={errorText} tone="error" />
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
              onConfirmHeight();
              setModalVisible(false);
            }}
            onCancel={() => {
              setModalVisible(false);
            }}
          />
        }
      />
    </SafeAreaView>
  );
};

Height.defaultProps = {
  errorText: '',
};

Height.propTypes = {
  currentScreen: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
  feet: PropTypes.number.isRequired,
  inches: PropTypes.number.isRequired,
  isHeightSelected: PropTypes.bool.isRequired,
  onConfirmHeight: PropTypes.func.isRequired,
  errorText: PropTypes.string,
};

export default Height;
