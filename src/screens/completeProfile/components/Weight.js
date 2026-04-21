import React from 'react';
import {View, SafeAreaView, ScrollView, Platform} from 'react-native';
import PropTypes from 'prop-types';
import {LogoHeader} from '../../../components';
import Input from './Input';
import Label from './Label';
import NextButton from './NextButton';
import BackButton from './BackButton';
import SupportingText from './SupportingText';
import style from './style';
import {strings} from '../../../resources';

const Weight = ({currentScreen, text, onChangeText, errorText}) => (
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
        <Label text={strings.completeProfile.labels.weight} />
        <Input
          text={text}
          maxLength={8}
          keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
          onChangeText={onChangeText}
          placeholder={strings.completeProfile.placeholders.weight}
        />
        <SupportingText text={strings.completeProfile.helperText.weight} />
        <SupportingText text={errorText} tone="error" />
      </View>
      <NextButton
        nextScreen={strings.completeProfile.screen.Gender}
        currentScreen={currentScreen}
      />
    </ScrollView>
  </SafeAreaView>
);

Weight.defaultProps = {
  errorText: '',
};

Weight.propTypes = {
  currentScreen: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  errorText: PropTypes.string,
};

export default Weight;
