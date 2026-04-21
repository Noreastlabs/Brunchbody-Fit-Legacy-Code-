import React from 'react';
import {SafeAreaView, View, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import style from './style';
import {LogoHeader} from '../../../components';
import {strings} from '../../../resources';
import Label from './Label';
import RadioButtons from './RadioButtons';
import NextButton from './NextButton';
import BackButton from './BackButton';
import SupportingText from './SupportingText';

const Gender = ({currentScreen, loader, value, onChange, disabled, errorText}) => (
  <SafeAreaView style={style.nameContainer}>
    <BackButton
      previousScreen={strings.completeProfile.screen.Weight}
      currentScreen={currentScreen}
      disabled={disabled}
    />
    <ScrollView contentContainerStyle={style.scrollView}>
      <View style={style.logoContainer}>
        <LogoHeader />
      </View>
      <View style={style.nameInputContainer}>
        <Label text={strings.completeProfile.labels.gender} />
        <RadioButtons
          option1={strings.completeProfile.radioButtons.M}
          option2={strings.completeProfile.radioButtons.F}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        <SupportingText text={strings.completeProfile.helperText.gender} />
        <SupportingText text={errorText} tone="error" />
      </View>
      <NextButton
        loader={loader}
        disabled={disabled}
        nextScreen={strings.completeProfile.screen.Welcome}
        currentScreen={currentScreen}
      />
    </ScrollView>
  </SafeAreaView>
);

Gender.defaultProps = {
  disabled: false,
  errorText: '',
};

Gender.propTypes = {
  loader: PropTypes.bool.isRequired,
  currentScreen: PropTypes.func.isRequired,
  value: PropTypes.oneOf(['male', 'female']).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  errorText: PropTypes.string,
};

export default Gender;
