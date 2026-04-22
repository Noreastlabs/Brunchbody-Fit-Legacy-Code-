import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SETTINGS_ROUTES } from '../src/navigation/routeNames';

let focusEffectCallback = null;

jest.mock('react-redux', () => ({
  connect: () => Component => Component,
}));

jest.mock('@react-navigation/core', () => {
  const ReactLocal = require('react');

  return {
    useFocusEffect: callback => {
      focusEffectCallback = callback;

      ReactLocal.useEffect(() => {
        const cleanup = callback();
        return cleanup;
      }, [callback]);
    },
  };
});

jest.mock('../src/redux/actions', () => ({
  loggedIn: jest.fn(() => ({ type: 'LOGGED_IN' })),
  profile: jest.fn(() => ({ type: 'PROFILE' })),
}));

jest.mock('../src/screens/setting/components', () => {
  const ReactLocal = require('react');

  return {
    MyProfile: props =>
      ReactLocal.createElement('mock-setting-my-profile', props),
    MyVitals: props =>
      ReactLocal.createElement('mock-setting-my-vitals', props),
  };
});

import MyProfilePage from '../src/screens/setting/pages/MyProfile/MyProfile';
import MyVitalsPage from '../src/screens/setting/pages/MyProfile/MyVitals';

const createDeferred = () => {
  let resolve;
  const promise = new Promise(res => {
    resolve = res;
  });

  return { promise, resolve };
};

const renderInAct = async element => {
  let renderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(element);
  });

  return renderer;
};

describe('settings form UX boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    focusEffectCallback = null;
  });

  test('MyVitalsPage keeps missing required vitals validation inline and off the modal surface', async () => {
    const renderer = await renderInAct(
      <MyVitalsPage
        navigation={{ navigate: jest.fn() }}
        user={{ name: '', gender: 'male' }}
        updateUserProfile={jest.fn().mockResolvedValue(true)}
        getUserData={jest.fn().mockResolvedValue(true)}
      />,
    );
    const getProps = () => renderer.root.findByType('mock-setting-my-vitals').props;

    await ReactTestRenderer.act(async () => {
      await getProps().onUpdateHandler();
    });

    expect(getProps().draftDobText).toBe('Not set');
    expect(getProps().draftHeightText).toBe('Not set');
    expect(getProps().dobErrorText).toBe(
      'Select and confirm your date of birth to continue.',
    );
    expect(getProps().heightErrorText).toBe(
      'Select and confirm your height to continue.',
    );
    expect(getProps().formErrorText).toBe(
      'Check the highlighted profile fields before saving.',
    );
    expect(getProps().isPermissionModal).toBe(false);
  });

  test('MyVitalsPage keeps invalid age validation inline', async () => {
    const renderer = await renderInAct(
      <MyVitalsPage
        navigation={{ navigate: jest.fn() }}
        user={{
          name: 'Lane',
          dob: '01/01/2012',
          gender: 'female',
          height: '5.06',
        }}
        updateUserProfile={jest.fn().mockResolvedValue(true)}
        getUserData={jest.fn().mockResolvedValue(true)}
      />,
    );
    const getProps = () => renderer.root.findByType('mock-setting-my-vitals').props;

    await ReactTestRenderer.act(async () => {
      await getProps().onUpdateHandler();
    });

    expect(getProps().dobErrorText).toBe(
      'You must be at least 18 years old to continue.',
    );
    expect(getProps().heightErrorText).toBe('');
    expect(getProps().formErrorText).toBe(
      'Check the highlighted profile fields before saving.',
    );
    expect(getProps().isPermissionModal).toBe(false);
  });

  test('MyVitalsPage blocks duplicate save dispatches while pending', async () => {
    const saveDeferred = createDeferred();
    const updateUserProfile = jest
      .fn()
      .mockImplementation(() => saveDeferred.promise);
    const getUserData = jest.fn().mockResolvedValue(true);
    const renderer = await renderInAct(
      <MyVitalsPage
        navigation={{ navigate: jest.fn() }}
        user={{
          name: 'Lane',
          dob: '01/01/1990',
          gender: 'female',
          height: '5.06',
          weight: '135',
        }}
        updateUserProfile={updateUserProfile}
        getUserData={getUserData}
      />,
    );
    const getProps = () => renderer.root.findByType('mock-setting-my-vitals').props;

    await ReactTestRenderer.act(async () => {
      const first = getProps().onUpdateHandler();
      const second = getProps().onUpdateHandler();

      expect(updateUserProfile).toHaveBeenCalledTimes(1);
      saveDeferred.resolve(true);
      await first;
      await second;
    });

    expect(updateUserProfile).toHaveBeenCalledWith({
      name: 'Lane',
      dob: '1/1/1990',
      height: '5.6',
      gender: 'female',
    });
    expect(getUserData).toHaveBeenCalledTimes(1);
    expect(getProps().isPermissionModal).toBe(true);
    expect(getProps().formErrorText).toBe('');
  });

  test('MyVitalsPage discards canceled picker edits and rehydrates from the latest user on refocus', async () => {
    const navigation = { navigate: jest.fn() };
    const updateUserProfile = jest.fn().mockResolvedValue(true);
    const getUserData = jest.fn().mockResolvedValue(true);
    const renderer = await renderInAct(
      <MyVitalsPage
        navigation={navigation}
        user={{
          name: 'Alpha',
          dob: '01/01/1990',
          gender: 'male',
          height: '5.06',
          weight: '200',
        }}
        updateUserProfile={updateUserProfile}
        getUserData={getUserData}
      />,
    );
    const getProps = () => renderer.root.findByType('mock-setting-my-vitals').props;

    ReactTestRenderer.act(() => {
      getProps().setDraftName('Unsaved Nickname');
      getProps().onOpenDatePicker();
      getProps().setTempDate(9);
      getProps().setTempMonth(2);
      getProps().setTempYear(1994);
      getProps().onCancelDatePicker();
      getProps().onOpenHeightPicker();
      getProps().setTempFeet(6);
      getProps().setTempInches(2);
      getProps().onCancelHeightPicker();
    });

    expect(getProps().draftName).toBe('Unsaved Nickname');
    expect(getProps().draftDobText).toBe('1/1/1990');
    expect(getProps().draftHeightText).toBe('5 ft 6 in');

    await ReactTestRenderer.act(async () => {
      renderer.update(
        <MyVitalsPage
          navigation={navigation}
          user={{
            name: 'Beta',
            dob: '03/04/1988',
            gender: 'female',
            height: '6.01',
            weight: '180',
          }}
          updateUserProfile={updateUserProfile}
          getUserData={getUserData}
        />,
      );
    });

    expect(getProps().draftName).toBe('Unsaved Nickname');

    ReactTestRenderer.act(() => {
      focusEffectCallback();
    });

    expect(getProps().draftName).toBe('Beta');
    expect(getProps().draftGender).toBe('female');
    expect(getProps().draftDobText).toBe('4/3/1988');
    expect(getProps().draftHeightText).toBe('6 ft 1 in');
    expect(getProps().datePickerModal).toBe(false);
    expect(getProps().heightPickerModal).toBe(false);
  });

  test('MyProfilePage passes truthful summary fallbacks while keeping the live vitals route', async () => {
    const renderer = await renderInAct(
      <MyProfilePage
        navigation={{ navigate: jest.fn() }}
        user={{ targetCalories: [] }}
      />,
    );
    const listData = renderer.root.findByType('mock-setting-my-profile').props.listData;
    const profileItem = listData.find(item => item.title === 'Profile');
    const weightItem = listData.find(item => item.title === 'Current Weight');
    const bmiItem = listData.find(item => item.title === 'BMI');
    const bmrItem = listData.find(item => item.title === 'BMR');
    const targetTotalsItem = listData.find(
      item => item.title === 'Current Target Totals',
    );

    expect(profileItem.options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          screen: SETTINGS_ROUTES.MY_VITALS,
          displayValue: 'No nickname set',
        }),
      ]),
    );
    expect(weightItem.options[0].displayValue).toBe('Not set');
    expect(bmiItem.options[0].displayValue).toBe('--');
    expect(bmiItem.options[0].badgeText).toBe('');
    expect(bmrItem.options[0].displayValue).toBe('Not set');
    expect(targetTotalsItem.options[0].list).toEqual([
      { id: 1, name: 'FAT', value: '--' },
      { id: 2, name: 'PRT', value: '--' },
      { id: 3, name: 'CHO', value: '--' },
      { id: 4, name: 'CAL', value: '--' },
    ]);
  });
});
