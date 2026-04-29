import React from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import {CustomModal, LogoHeader, HeightPickerModal} from '../../../components';
import InputModal from './DateInputModal';
import Input from './Input';
import NextButton from './NextButton';
import BackButton from './BackButton';
import Label from './Label';
import SupportingText from './SupportingText';
import {strings} from '../../../resources';
import style from './style';

const STANDARD_UNIT_PREFERENCE = 'standard';
const METRIC_UNIT_PREFERENCE = 'metric';

const formatVisibleHeight = ({feet, inches}) => `${feet} ft ${inches} in`;

const UnitPreferenceSelector = ({value, onChange}) => (
  <View style={style.unitPreferenceContainer}>
    {[STANDARD_UNIT_PREFERENCE, METRIC_UNIT_PREFERENCE].map(unitPreference => {
      const isSelected = value === unitPreference;

      return (
        <TouchableOpacity
          key={unitPreference}
          activeOpacity={0.7}
          onPress={() => onChange(unitPreference)}
          style={[
            style.unitPreferenceOption,
            isSelected && style.unitPreferenceOptionSelected,
          ]}>
          <Text
            style={[
              style.unitPreferenceText,
              isSelected && style.unitPreferenceTextSelected,
            ]}>
            {strings.completeProfile.bodyUnitPreference[unitPreference]}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const Height = props => {
  const {
    currentScreen,
    modalVisible,
    setModalVisible,
    feet,
    inches,
    isHeightSelected,
    onConfirmHeight,
    bodyUnitPreference,
    onChangeBodyUnitPreference,
    metricHeightText,
    onChangeMetricHeight,
    errorText,
  } = props;
  const isMetric = bodyUnitPreference === METRIC_UNIT_PREFERENCE;

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
          <UnitPreferenceSelector
            value={bodyUnitPreference}
            onChange={onChangeBodyUnitPreference}
          />
          <View style={style.dropdownContainer}>
            {isMetric ? (
              <Input
                text={metricHeightText}
                maxLength={6}
                keyboardType={
                  Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'
                }
                onChangeText={onChangeMetricHeight}
                placeholder={strings.completeProfile.placeholders.heightMetric}
              />
            ) : (
              <InputModal
                value={
                  isHeightSelected ? formatVisibleHeight({feet, inches}) : ''
                }
                placeholder={strings.completeProfile.placeholders.height}
                toggleDatePicker={() => setModalVisible(true)}
              />
            )}
          </View>
          <SupportingText
            text={
              isMetric
                ? strings.completeProfile.helperText.heightMetric
                : strings.completeProfile.helperText.height
            }
          />
          <SupportingText text={errorText} tone="error" />
        </View>
        <NextButton
          nextScreen={strings.completeProfile.screen.Weight}
          currentScreen={currentScreen}
        />
      </ScrollView>

      {!isMetric ? (
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
      ) : null}
    </SafeAreaView>
  );
};

Height.defaultProps = {
  errorText: '',
  metricHeightText: '',
  bodyUnitPreference: STANDARD_UNIT_PREFERENCE,
};

Height.propTypes = {
  currentScreen: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
  feet: PropTypes.number.isRequired,
  inches: PropTypes.number.isRequired,
  isHeightSelected: PropTypes.bool.isRequired,
  onConfirmHeight: PropTypes.func.isRequired,
  bodyUnitPreference: PropTypes.oneOf([
    STANDARD_UNIT_PREFERENCE,
    METRIC_UNIT_PREFERENCE,
  ]),
  onChangeBodyUnitPreference: PropTypes.func.isRequired,
  metricHeightText: PropTypes.string,
  onChangeMetricHeight: PropTypes.func.isRequired,
  errorText: PropTypes.string,
};

UnitPreferenceSelector.propTypes = {
  value: PropTypes.oneOf([STANDARD_UNIT_PREFERENCE, METRIC_UNIT_PREFERENCE])
    .isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Height;
