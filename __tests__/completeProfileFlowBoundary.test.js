import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {CompleteProfilePage} from '../src/screens/completeProfile/pages/completeProfile/CompleteProfile';
import {AUTH_TAB_ROUTES, ROOT_ROUTES} from '../src/navigation/routeNames';
import {strings} from '../src/resources';

const mockDispatch = jest.fn();
const mockNavigation = {
  navigate: jest.fn(),
};
const mockGetOnboardingDraftValue = jest.fn();
const mockSetOnboardingDraftValue = jest.fn();
const mockClearCompletedOnboardingDraft = jest.fn();
const mockProfile = jest.fn(data => ({type: 'PROFILE', payload: data}));
const draftValues = {};

const flushEffects = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const getDraftWriteCalls = key =>
  mockSetOnboardingDraftValue.mock.calls.filter(([draftKey]) => draftKey === key);

const createDeferred = () => {
  let resolve;
  let reject;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {promise, resolve, reject};
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  connect: () => Component => Component,
}));

jest.mock('../src/redux/actions/onboardingStorage', () => ({
  clearCompletedOnboardingDraft: (...args) =>
    mockClearCompletedOnboardingDraft(...args),
  getOnboardingDraftValue: (...args) => mockGetOnboardingDraftValue(...args),
  setOnboardingDraftValue: (...args) => mockSetOnboardingDraftValue(...args),
}));

jest.mock('../src/redux/actions/auth', () => ({
  profile: (...args) => mockProfile(...args),
}));

jest.mock('../src/screens/completeProfile/components', () => {
  const MockReact = require('react');

  return {
    Name: props => MockReact.createElement('mock-name', props),
    Gender: props => MockReact.createElement('mock-gender', props),
    Welcome: props => MockReact.createElement('mock-welcome', props),
    Weight: props => MockReact.createElement('mock-weight', props),
    DateOfBirth: props => MockReact.createElement('mock-date-of-birth', props),
    Height: props => MockReact.createElement('mock-height', props),
  };
});

const renderCompleteProfile = async () => {
  let renderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<CompleteProfilePage />);
    await flushEffects();
  });

  return renderer;
};

const goToDateOfBirth = async renderer => {
  await ReactTestRenderer.act(async () => {
    await renderer.root.findByType('mock-name').props.currentScreen(
      strings.completeProfile.screen.DOB,
    );
    await flushEffects();
  });

  return renderer.root.findByType('mock-date-of-birth');
};

const confirmAdultDateOfBirth = async renderer => {
  await ReactTestRenderer.act(async () => {
    renderer.root
      .findByType('mock-date-of-birth')
      .props.onConfirmDate(new Date(1990, 0, 1));
    await flushEffects();
  });
};

const goToHeight = async renderer => {
  await ReactTestRenderer.act(async () => {
    await renderer.root.findByType('mock-date-of-birth').props.currentScreen(
      strings.completeProfile.screen.Height,
    );
    await flushEffects();
  });

  return renderer.root.findByType('mock-height');
};

const confirmHeight = async renderer => {
  await ReactTestRenderer.act(async () => {
    renderer.root.findByType('mock-height').props.onConfirmHeight();
    await flushEffects();
  });
};

const goToWeight = async renderer => {
  await ReactTestRenderer.act(async () => {
    await renderer.root.findByType('mock-height').props.currentScreen(
      strings.completeProfile.screen.Weight,
    );
    await flushEffects();
  });

  return renderer.root.findByType('mock-weight');
};

const goToGender = async renderer => {
  await ReactTestRenderer.act(async () => {
    await renderer.root.findByType('mock-weight').props.currentScreen(
      strings.completeProfile.screen.Gender,
    );
    await flushEffects();
  });

  return renderer.root.findByType('mock-gender');
};

describe('Complete profile flow boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.keys(draftValues).forEach(key => {
      delete draftValues[key];
    });

    mockDispatch.mockResolvedValue(true);
    mockClearCompletedOnboardingDraft.mockResolvedValue(undefined);
    mockGetOnboardingDraftValue.mockImplementation(async key =>
      Object.prototype.hasOwnProperty.call(draftValues, key)
        ? draftValues[key]
        : null,
    );
  });

  test('hydrates saved onboarding drafts without changing the initial step', async () => {
    draftValues.name = 'Taylor';
    draftValues.dob = '1/1/1990';
    draftValues.height = '5.6';
    draftValues.weight = '135';
    draftValues.gender = 'female';

    const renderer = await renderCompleteProfile();
    const nameStep = renderer.root.findByType('mock-name');

    expect(nameStep.props.text).toBe('Taylor');

    const dobStep = await goToDateOfBirth(renderer);
    expect(dobStep.props.isDateSelected).toBe(true);
    expect(dobStep.props.date).toBe(1);
    expect(dobStep.props.month).toBe(1);
    expect(dobStep.props.year).toBe(1990);

    const heightStep = await goToHeight(renderer);
    expect(heightStep.props.isHeightSelected).toBe(true);
    expect(heightStep.props.feet).toBe(5);
    expect(heightStep.props.inches).toBe(6);

    const weightStep = await goToWeight(renderer);
    expect(weightStep.props.text).toBe('135');

    const genderStep = await goToGender(renderer);
    expect(genderStep.props.value).toBe('female');
  });

  test('keeps date of birth unconfirmed and unwritten until picker confirm', async () => {
    const renderer = await renderCompleteProfile();
    const dobStep = await goToDateOfBirth(renderer);

    expect(dobStep.props.isDateSelected).toBe(false);
    expect(getDraftWriteCalls('dob')).toHaveLength(0);

    await ReactTestRenderer.act(async () => {
      await dobStep.props.currentScreen(strings.completeProfile.screen.Height);
      await flushEffects();
    });

    expect(renderer.root.findByType('mock-date-of-birth').props.errorText).toBe(
      strings.completeProfile.errors.dobRequired,
    );
    expect(getDraftWriteCalls('dob')).toHaveLength(0);
  });

  test('allows saved date of birth drafts to advance without re-confirmation', async () => {
    draftValues.dob = '1/1/1990';

    const renderer = await renderCompleteProfile();
    const dobStep = await goToDateOfBirth(renderer);

    expect(dobStep.props.isDateSelected).toBe(true);
    expect(dobStep.props.date).toBe(1);
    expect(dobStep.props.month).toBe(1);
    expect(dobStep.props.year).toBe(1990);

    await goToHeight(renderer);
    expect(renderer.root.findByType('mock-height')).toBeTruthy();
  });

  test('blocks underage date of birth with inline feedback', async () => {
    const renderer = await renderCompleteProfile();
    await goToDateOfBirth(renderer);

    await ReactTestRenderer.act(async () => {
      renderer.root
        .findByType('mock-date-of-birth')
        .props.onConfirmDate(new Date('2012-01-01T00:00:00.000Z'));
      await flushEffects();
    });

    await ReactTestRenderer.act(async () => {
      await renderer.root.findByType('mock-date-of-birth').props.currentScreen(
        strings.completeProfile.screen.Height,
      );
      await flushEffects();
    });

    expect(renderer.root.findByType('mock-date-of-birth').props.errorText).toBe(
      strings.completeProfile.errors.dobInvalid,
    );
  });

  test('keeps height unconfirmed and unwritten until picker confirm', async () => {
    const renderer = await renderCompleteProfile();
    await goToDateOfBirth(renderer);
    await confirmAdultDateOfBirth(renderer);

    const heightStep = await goToHeight(renderer);

    expect(heightStep.props.isHeightSelected).toBe(false);
    expect(getDraftWriteCalls('height')).toHaveLength(0);

    await ReactTestRenderer.act(async () => {
      await heightStep.props.currentScreen(strings.completeProfile.screen.Weight);
      await flushEffects();
    });

    expect(renderer.root.findByType('mock-height').props.errorText).toBe(
      strings.completeProfile.errors.heightRequired,
    );
    expect(getDraftWriteCalls('height')).toHaveLength(0);
  });

  test('allows saved height drafts to advance without re-confirmation', async () => {
    draftValues.dob = '1/1/1990';
    draftValues.height = '5.6';

    const renderer = await renderCompleteProfile();
    await goToDateOfBirth(renderer);

    const heightStep = await goToHeight(renderer);

    expect(heightStep.props.isHeightSelected).toBe(true);
    expect(heightStep.props.feet).toBe(5);
    expect(heightStep.props.inches).toBe(6);

    await goToWeight(renderer);
    expect(renderer.root.findByType('mock-weight')).toBeTruthy();
  });

  test('validates weight as a required whole-number field before advancing', async () => {
    const renderer = await renderCompleteProfile();
    await goToDateOfBirth(renderer);
    await confirmAdultDateOfBirth(renderer);
    await goToHeight(renderer);
    await confirmHeight(renderer);

    const weightStep = await goToWeight(renderer);

    await ReactTestRenderer.act(async () => {
      await weightStep.props.currentScreen(strings.completeProfile.screen.Gender);
      await flushEffects();
    });

    expect(renderer.root.findByType('mock-weight').props.errorText).toBe(
      strings.completeProfile.errors.weightRequired,
    );

    await ReactTestRenderer.act(async () => {
      renderer.root.findByType('mock-weight').props.onChangeText('12.5');
      await flushEffects();
    });

    await ReactTestRenderer.act(async () => {
      await renderer.root.findByType('mock-weight').props.currentScreen(
        strings.completeProfile.screen.Gender,
      );
      await flushEffects();
    });

    expect(renderer.root.findByType('mock-weight').props.errorText).toBe(
      strings.completeProfile.errors.weightInvalid,
    );

    await ReactTestRenderer.act(async () => {
      renderer.root.findByType('mock-weight').props.onChangeText('135');
      await flushEffects();
    });

    await goToGender(renderer);
    expect(renderer.root.findByType('mock-gender')).toBeTruthy();
  });

  test('completes the local profile flow and hands off to Home dashboard', async () => {
    const renderer = await renderCompleteProfile();

    await ReactTestRenderer.act(async () => {
      renderer.root.findByType('mock-name').props.onChangeText('Taylor');
      await flushEffects();
    });

    await goToDateOfBirth(renderer);
    await confirmAdultDateOfBirth(renderer);
    const heightStep = await goToHeight(renderer);

    await ReactTestRenderer.act(async () => {
      heightStep.props.setFeet(5);
      heightStep.props.setInches(6);
      await flushEffects();
    });

    await confirmHeight(renderer);
    await goToWeight(renderer);

    await ReactTestRenderer.act(async () => {
      renderer.root.findByType('mock-weight').props.onChangeText('135');
      await flushEffects();
    });

    const genderStep = await goToGender(renderer);

    await ReactTestRenderer.act(async () => {
      genderStep.props.onChange('female');
      await flushEffects();
    });

    await ReactTestRenderer.act(async () => {
      await renderer.root.findByType('mock-gender').props.currentScreen(
        strings.completeProfile.screen.Welcome,
      );
      await flushEffects();
    });

    const expectedProfileAction = {
      type: 'PROFILE',
      payload: {
        name: 'Taylor',
        dob: '1/1/1990',
        height: '5.6',
        weight: '135',
        gender: 'female',
        targetCalories: [
          {id: 1, name: 'fat', value: '133'},
          {id: 2, name: 'prt', value: '150'},
          {id: 3, name: 'cho', value: '50'},
          {id: 4, name: 'cal', value: '2000'},
        ],
      },
    };

    expect(mockProfile).toHaveBeenCalledTimes(1);
    expect(mockProfile).toHaveBeenCalledWith(expectedProfileAction.payload);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(expectedProfileAction);
    expect(mockClearCompletedOnboardingDraft).toHaveBeenCalledTimes(1);
    expect(renderer.root.findByType('mock-welcome')).toBeTruthy();

    await ReactTestRenderer.act(async () => {
      await renderer.root
        .findByType('mock-welcome')
        .props.currentScreen(ROOT_ROUTES.HOME);
      await flushEffects();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledTimes(1);
    expect(mockNavigation.navigate).toHaveBeenCalledWith(ROOT_ROUTES.HOME, {
      screen: AUTH_TAB_ROUTES.DASHBOARD,
    });
  });

  test('locks final submit until profile creation finishes and then advances', async () => {
    const deferredSubmit = createDeferred();
    mockDispatch.mockImplementationOnce(() => deferredSubmit.promise);

    const renderer = await renderCompleteProfile();
    await goToDateOfBirth(renderer);
    await confirmAdultDateOfBirth(renderer);
    await goToHeight(renderer);
    await confirmHeight(renderer);
    await goToWeight(renderer);

    await ReactTestRenderer.act(async () => {
      renderer.root.findByType('mock-weight').props.onChangeText('135');
      await flushEffects();
    });

    const genderStep = await goToGender(renderer);

    await ReactTestRenderer.act(async () => {
      genderStep.props.currentScreen(strings.completeProfile.screen.Welcome);
      await flushEffects();
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockClearCompletedOnboardingDraft).not.toHaveBeenCalled();
    expect(renderer.root.findByType('mock-gender').props.loader).toBe(true);
    expect(renderer.root.findByType('mock-gender').props.disabled).toBe(true);

    await ReactTestRenderer.act(async () => {
      renderer.root.findByType('mock-gender').props.currentScreen(
        strings.completeProfile.screen.Welcome,
      );
      await flushEffects();
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);

    await ReactTestRenderer.act(async () => {
      deferredSubmit.resolve(true);
      await flushEffects();
    });

    expect(mockClearCompletedOnboardingDraft).toHaveBeenCalledTimes(1);
    expect(renderer.root.findByType('mock-welcome')).toBeTruthy();
  });

  test('shows visible submit failure feedback and keeps onboarding drafts intact', async () => {
    mockDispatch.mockRejectedValueOnce(new Error('Save failed'));

    const renderer = await renderCompleteProfile();
    await goToDateOfBirth(renderer);
    await confirmAdultDateOfBirth(renderer);
    await goToHeight(renderer);
    await confirmHeight(renderer);
    await goToWeight(renderer);

    await ReactTestRenderer.act(async () => {
      renderer.root.findByType('mock-weight').props.onChangeText('135');
      await flushEffects();
    });

    await goToGender(renderer);

    await ReactTestRenderer.act(async () => {
      await renderer.root.findByType('mock-gender').props.currentScreen(
        strings.completeProfile.screen.Welcome,
      );
      await flushEffects();
    });

    expect(mockClearCompletedOnboardingDraft).not.toHaveBeenCalled();
    expect(renderer.root.findByType('mock-gender').props.loader).toBe(false);
    expect(renderer.root.findByType('mock-gender').props.errorText).toBe(
      'Save failed',
    );
  });
});
