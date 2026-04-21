import React from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import style from './style';
import {LogoHeader, CustomHeader} from '../../../components';
import Input from './Input';
import Label from './Label';
import NextButton from './NextButton';
import {strings} from '../../../resources';

const Name = ({currentScreen, onChangeText, text}) => (
  <SafeAreaView style={style.nameContainer}>
    <CustomHeader />
    <ScrollView contentContainerStyle={style.scrollView}>
      <View style={style.logoContainer}>
        <LogoHeader />
      </View>
      <View style={style.nameInputContainer}>
        <Label text={strings.completeProfile.labels.name} />
        <Input
          text={text}
          placeholder={strings.completeProfile.placeholders.name}
          onChangeText={onChangeText}
        />
        {/* <Text style={{color: 'white'}}>{text}</Text> */}
      </View>
      <NextButton
        nextScreen={strings.completeProfile.screen.DOB}
        currentScreen={currentScreen}
      />
    </ScrollView>
  </SafeAreaView>
);

Name.propTypes = {
  currentScreen: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default Name;
