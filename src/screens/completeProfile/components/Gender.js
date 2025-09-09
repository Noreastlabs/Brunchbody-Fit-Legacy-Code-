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

const Gender = ({currentScreen, loader}) => (
  <SafeAreaView style={style.nameContainer}>
    <BackButton
      previousScreen={strings.completeProfile.screen.Weight}
      currentScreen={currentScreen}
    />
    <ScrollView contentContainerStyle={style.scrollView}>
      <View style={style.logoContainer}>
        <LogoHeader />
      </View>
      <View style={style.nameInputContainer}>
        <Label text={strings.completeProfile.labels.gender} />
        <Label text="(For BMI/BMR purposes)" />
        <RadioButtons
          option1={strings.completeProfile.radioButtons.M}
          option2={strings.completeProfile.radioButtons.F}
        />
      </View>
      <NextButton
        loader={loader}
        nextScreen={strings.completeProfile.screen.Welcome}
        currentScreen={currentScreen}
      />
    </ScrollView>
  </SafeAreaView>
);

Gender.propTypes = {
  loader: PropTypes.bool.isRequired,
  currentScreen: PropTypes.func.isRequired,
};

export default Gender;
