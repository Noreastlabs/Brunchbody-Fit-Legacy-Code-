import React from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {LogoHeader} from '../../../components';
import Input from './Input';
import Label from './Label';
import NextButton from './NextButton';
import BackButton from './BackButton';
import SupportingText from './SupportingText';
import style from './style';
import {strings} from '../../../resources';

const STANDARD_UNIT_PREFERENCE = 'standard';
const METRIC_UNIT_PREFERENCE = 'metric';

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

const Weight = ({
  currentScreen,
  text,
  onChangeText,
  bodyUnitPreference,
  onChangeBodyUnitPreference,
  errorText,
}) => {
  const isMetric = bodyUnitPreference === METRIC_UNIT_PREFERENCE;

  return (
    <SafeAreaView style={style.nameContainer}>
      <BackButton
        previousScreen={strings.completeProfile.screen.Height}
        currentScreen={currentScreen}
      />
      <ScrollView contentContainerStyle={style.scrollView}>
        <View style={style.logoContainer}>
          <LogoHeader />
        </View>
        <View style={style.nameInputContainer}>
          <Label
            text={
              isMetric
                ? strings.completeProfile.labels.weightMetric
                : strings.completeProfile.labels.weight
            }
          />
          <UnitPreferenceSelector
            value={bodyUnitPreference}
            onChange={onChangeBodyUnitPreference}
          />
          <Input
            text={text}
            maxLength={8}
            keyboardType={
              Platform.OS === 'ios'
                ? isMetric
                  ? 'decimal-pad'
                  : 'number-pad'
                : 'numeric'
            }
            onChangeText={onChangeText}
            placeholder={
              isMetric
                ? strings.completeProfile.placeholders.weightMetric
                : strings.completeProfile.placeholders.weight
            }
          />
          <SupportingText
            text={
              isMetric
                ? strings.completeProfile.helperText.weightMetric
                : strings.completeProfile.helperText.weight
            }
          />
          <SupportingText text={errorText} tone="error" />
        </View>
        <NextButton
          nextScreen={strings.completeProfile.screen.Gender}
          currentScreen={currentScreen}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

UnitPreferenceSelector.propTypes = {
  value: PropTypes.oneOf([STANDARD_UNIT_PREFERENCE, METRIC_UNIT_PREFERENCE])
    .isRequired,
  onChange: PropTypes.func.isRequired,
};

Weight.defaultProps = {
  errorText: '',
  bodyUnitPreference: STANDARD_UNIT_PREFERENCE,
};

Weight.propTypes = {
  currentScreen: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  bodyUnitPreference: PropTypes.oneOf([
    STANDARD_UNIT_PREFERENCE,
    METRIC_UNIT_PREFERENCE,
  ]),
  onChangeBodyUnitPreference: PropTypes.func.isRequired,
  errorText: PropTypes.string,
};

export default Weight;
