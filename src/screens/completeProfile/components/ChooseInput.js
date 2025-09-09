import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Input from './Input';
import {strings} from '../../../resources';
import RadioButtons from './RadioButtons';
import style from './style';

// eslint-disable-next-line consistent-return
const ChooseInput = ({currentScreen}) => {
  if (currentScreen === 'Name') {
    return <Input placeholder={strings.completeProfile.placeholders.name} />;
  }
  if (currentScreen === 'DateOfBirth') {
    return <Input placeholder={strings.completeProfile.placeholders.dob} />;
  }
  if (currentScreen === 'Height') {
    return <Input placeholder={strings.completeProfile.placeholders.height} />;
  }
  if (currentScreen === 'Weight') {
    return <Input placeholder={strings.completeProfile.placeholders.weight} />;
  }
  if (currentScreen === 'Gender') {
    return (
      <RadioButtons
        option1={strings.completeProfile.radioButtons.M}
        option2={strings.completeProfile.radioButtons.F}
      />
    );
  }
  if (currentScreen === 'DataSelection') {
    return (
      <>
        <RadioButtons
          option1={strings.completeProfile.radioButtons.yes}
          option2={strings.completeProfile.radioButtons.no}
        />
        <Text style={style.dataSelectionNote}>
          {strings.completeProfile.dataSelectionNote}
        </Text>
      </>
    );
  }
  if (currentScreen === 'Welcome') {
    return (
      <View style={style.welcomeText}>
        <Text style={style.tutorial}>
          {strings.completeProfile.labels.tutorial}
        </Text>
        <TouchableOpacity>
          <Text style={style.click}>
            {strings.completeProfile.buttons.click}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default ChooseInput;
