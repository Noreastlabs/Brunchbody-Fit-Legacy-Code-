import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { CompleteProfilePage } from '../src/screens/completeProfile/pages/completeProfile/CompleteProfile';

const mockDispatch = jest.fn();
const mockNavigation = {
  navigate: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock('../src/redux/actions/onboardingStorage', () => ({
  clearCompletedOnboardingDraft: jest.fn(),
  getOnboardingDraftValue: jest.fn(async key => {
    if (key === 'dob') {
      return '01/01/1995';
    }

    if (key === 'height') {
      return '5.06';
    }

    if (key === 'gender') {
      return 'female';
    }

    return '';
  }),
  setOnboardingDraftValue: jest.fn(),
}));

jest.mock('../src/redux/actions/auth', () => ({
  profile: jest.fn(() => ({ type: 'PROFILE' })),
}));

jest.mock('../src/screens/completeProfile/components', () => {
  const MockReact = require('react');

  return {
    Name: props => MockReact.createElement('mock-name', props),
    Gender: props => MockReact.createElement('mock-gender', props),
    Welcome: props => MockReact.createElement('mock-welcome', props),
    Weight: props => MockReact.createElement('mock-weight', props),
  };
});

jest.mock(
  '../src/screens/completeProfile/pages/completeProfile/DateOfBirth',
  () => ({
    DateOfBirthWrapper: props =>
      require('react').createElement('mock-date-of-birth', props),
  }),
);

jest.mock('../src/screens/completeProfile/pages/completeProfile/Height', () => ({
  HeightWrapper: props =>
    require('react').createElement('mock-height', props),
}));

describe('Complete profile nickname flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('allows continuing to date of birth without entering a nickname', async () => {
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<CompleteProfilePage />);
    });

    await ReactTestRenderer.act(async () => {
      await renderer.root.findByType('mock-name').props.currentScreen('DateOfBirth');
    });

    expect(renderer.root.findByType('mock-date-of-birth')).toBeTruthy();
  });
});
