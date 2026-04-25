import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/AntDesign', () => 'AntDesign');

jest.mock('../src/components', () => {
  const ReactLocal = require('react');

  return {
    Button: props => ReactLocal.createElement('mock-button', props),
    CustomHeader: props =>
      ReactLocal.createElement('mock-custom-header', props),
    CustomModal: props =>
      ReactLocal.createElement('mock-custom-modal', props),
    DatePickerModal: props =>
      ReactLocal.createElement('mock-date-picker-modal', props),
    HeightPickerModal: props =>
      ReactLocal.createElement('mock-height-picker-modal', props),
    PermissionModal: props =>
      ReactLocal.createElement('mock-permission-modal', props),
    SafeAreaWrapper: ({children}) =>
      ReactLocal.createElement('mock-safe-area-wrapper', null, children),
  };
});

import MyProfile from '../src/screens/setting/components/My Profile/MyProfile';
import MyVitals from '../src/screens/setting/components/My Profile/MyVitals';

const PROFILE_VITALS_HELPER =
  'Saved on this device only and used for in-app calculations and display.';
const GENDER_HELPER = 'Used for local BMI and BMR calculations.';
const FORBIDDEN_COPY = [
  'medical advice',
  'diagnosis',
  'treatment',
  'HIPAA',
  'clinical',
  'guaranteed accurate',
  'health record',
  'medical record',
  'cloud backup',
  'sync',
  'stored in your account',
  'Delete account',
];

const collectRenderedText = value => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(collectRenderedText).join(' ');
  }

  return collectRenderedText(value.children);
};

const renderInAct = async element => {
  let renderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(element);
  });

  return renderer;
};

const defaultVitalsProps = {
  datePickerModal: false,
  heightPickerModal: false,
  tempDate: 1,
  setTempDate: jest.fn(),
  tempMonth: 1,
  setTempMonth: jest.fn(),
  tempYear: 1990,
  setTempYear: jest.fn(),
  tempFeet: 5,
  setTempFeet: jest.fn(),
  tempInches: 6,
  setTempInches: jest.fn(),
  draftDobText: '1/1/1990',
  draftHeightText: '5 ft 6 in',
  draftName: 'Lane',
  setDraftName: jest.fn(),
  draftGender: 'female',
  onSelectGender: jest.fn(),
  onOpenDatePicker: jest.fn(),
  onConfirmDatePicker: jest.fn(),
  onCancelDatePicker: jest.fn(),
  onOpenHeightPicker: jest.fn(),
  onConfirmHeightPicker: jest.fn(),
  onCancelHeightPicker: jest.fn(),
  dobErrorText: '',
  heightErrorText: '',
  formErrorText: '',
  onUpdateHandler: jest.fn(),
  loader: false,
  isPermissionModal: false,
  closePermissionModal: jest.fn(),
  alertHeading: '',
  alertText: '',
};

describe('Profile and vitals transparency helper copy', () => {
  test('Profile renders the approved local in-app use helper copy', async () => {
    const renderer = await renderInAct(
      <MyProfile
        navigation={{navigate: jest.fn()}}
        listData={[
          {
            id: 1,
            title: 'Profile',
            options: [{id: 1, displayValue: 'Lane', screen: ''}],
          },
        ]}
      />,
    );

    const renderedText = collectRenderedText(renderer.toJSON());

    expect(renderedText).toContain('Profile');
    expect(renderedText).toContain(PROFILE_VITALS_HELPER);
    FORBIDDEN_COPY.forEach(copy => {
      expect(renderedText).not.toContain(copy);
    });
  });

  test('My Vitals renders local storage, in-app use, and local BMI/BMR context copy', async () => {
    const renderer = await renderInAct(<MyVitals {...defaultVitalsProps} />);

    const renderedText = collectRenderedText(renderer.toJSON());

    expect(renderedText).toContain('Profile details');
    expect(renderedText).toContain(PROFILE_VITALS_HELPER);
    expect(renderedText).toContain(GENDER_HELPER);
    FORBIDDEN_COPY.forEach(copy => {
      expect(renderedText).not.toContain(copy);
    });
  });
});
