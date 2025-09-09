import React from 'react';
import NextButton from './NextButton';
import {strings} from '../../../resources';

// eslint-disable-next-line consistent-return
const ChooseButton = ({currentScreen}) => {
  if (currentScreen === 'Name') {
    return (
      <NextButton nextScreen="DateOfBirth" currentScreen={currentScreen} />
    );
  }
  if (currentScreen === 'DateOfBirth') {
    return (
      <NextButton
        nextScreen={strings.completeProfile.nextScreen.Height}
        currentScreen={currentScreen}
      />
    );
  }
  if (currentScreen === 'Height') {
    return (
      <NextButton
        nextScreen={strings.completeProfile.nextScreen.Weight}
        currentScreen={currentScreen}
      />
    );
  }
  if (currentScreen === 'Weight') {
    return (
      <NextButton
        nextScreen={strings.completeProfile.nextScreen.Gender}
        currentScreen={currentScreen}
      />
    );
  }
  if (currentScreen === 'Gender') {
    return (
      <NextButton
        nextScreen={strings.completeProfile.nextScreen.DataSelection}
        currentScreen={currentScreen}
      />
    );
  }
  if (currentScreen === 'DataSelection') {
    return (
      <NextButton
        nextScreen={strings.completeProfile.nextScreen.Welcome}
        currentScreen={currentScreen}
      />
    );
  }
  if (currentScreen === 'Welcome') {
    return (
      <NextButton
        nextScreen={strings.completeProfile.nextScreen.Name}
        currentScreen={currentScreen}
      /> // just for now testing
    );
  }
};

export default ChooseButton;
