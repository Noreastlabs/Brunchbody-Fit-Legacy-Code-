import React from 'react';
import Label from './Label';
import {strings} from '../../../resources';

// eslint-disable-next-line consistent-return
const ChooseLabel = ({currentScreen}) => {
  if (currentScreen === 'Name') {
    return <Label text={strings.completeProfile.labels.name} />;
  }
  if (currentScreen === 'DateOfBirth') {
    return <Label text={strings.completeProfile.labels.DOB} />;
  }
  if (currentScreen === 'Height') {
    return <Label text={strings.completeProfile.labels.height} />;
  }
  if (currentScreen === 'Weight') {
    return <Label text={strings.completeProfile.labels.weight} />;
  }
  if (currentScreen === 'Gender') {
    return <Label text={strings.completeProfile.labels.gender} />;
  }
  if (currentScreen === 'DataSelection') {
    return <Label text={strings.completeProfile.labels.dataSelection} />;
  }
  if (currentScreen === 'Welcome') {
    return <Label text={strings.completeProfile.labels.welcome} />;
  }
};

export default ChooseLabel;
