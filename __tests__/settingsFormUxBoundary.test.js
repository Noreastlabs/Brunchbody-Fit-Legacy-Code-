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

const expectNoDurableDerivedProfileFields = payload => {
  expect(payload).not.toHaveProperty('bmi');
  expect(payload).not.toHaveProperty('bmr');
};
const FORBIDDEN_BODY_UNIT_UX_COPY = [
  'Account',
  'Login',
  'Logout',
  'Password',
  'Delete account',
  'Reset password',
];

const getMyProfileListData = async user => {
  const renderer = await renderInAct(
    <MyProfilePage
      navigation={{ navigate: jest.fn() }}
      user={user}
    />,
  );

  return renderer.root.findByType('mock-setting-my-profile').props.listData;
};

const getCurrentWeightDisplayValue = async user => {
  const listData = await getMyProfileListData(user);
  const weightItem = listData.find(item => item.title === 'Current Weight');

  return weightItem.options[0].displayValue;
};

const getBodyUnitPreferenceOption = async user => {
  const listData = await getMyProfileListData(user);
  const bodyUnitPreferenceItem = listData.find(
    item => item.title === 'Body measurement units',
  );

  return bodyUnitPreferenceItem.options[0];
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
      height: '5.06',
      heightCentimeters: expect.any(Number),
      bodyUnitPreference: 'standard',
      gender: 'female',
    });
    expect(updateUserProfile.mock.calls[0][0].heightCentimeters).toBeCloseTo(
      167.64,
    );
    expectNoDurableDerivedProfileFields(updateUserProfile.mock.calls[0][0]);
    expect(getUserData).toHaveBeenCalledTimes(1);
    expect(getProps().isPermissionModal).toBe(true);
    expect(getProps().formErrorText).toBe('');
  });

  test('MyVitalsPage saves metric height edits without adding weight editing', async () => {
    const updateUserProfile = jest.fn().mockResolvedValue(true);
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
          bodyUnitPreference: 'metric',
          heightCentimeters: 168,
        }}
        updateUserProfile={updateUserProfile}
        getUserData={getUserData}
      />,
    );
    const getProps = () => renderer.root.findByType('mock-setting-my-vitals').props;

    expect(getProps().bodyUnitPreference).toBe('metric');
    expect(getProps().draftHeightText).toBe('168 cm');
    expect(getProps().draftMetricHeightText).toBe('168');

    ReactTestRenderer.act(() => {
      getProps().onChangeMetricHeightText('170');
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onUpdateHandler();
    });

    expect(updateUserProfile).toHaveBeenCalledWith({
      name: 'Lane',
      dob: '1/1/1990',
      height: '5.7',
      heightCentimeters: 170,
      bodyUnitPreference: 'metric',
      gender: 'female',
    });
    expect(updateUserProfile.mock.calls[0][0]).not.toHaveProperty('weight');
    expect(updateUserProfile.mock.calls[0][0]).not.toHaveProperty(
      'weightKilograms',
    );
    expectNoDurableDerivedProfileFields(updateUserProfile.mock.calls[0][0]);
  });

  test('MyVitalsPage saves body unit preference through the profile path only', async () => {
    const updateUserProfile = jest.fn().mockResolvedValue(true);
    const getUserData = jest.fn().mockResolvedValue(true);
    const renderer = await renderInAct(
      <MyVitalsPage
        navigation={{ navigate: jest.fn() }}
        user={{
          name: 'Lane',
          dob: '01/01/1990',
          gender: 'female',
          height: '5.06',
          heightCentimeters: 167.64,
          weight: '135',
          weightKilograms: 61.2,
          bodyUnitPreference: 'standard',
          targetCalories: [
            { id: 1, name: 'fat', value: '133' },
            { id: 2, name: 'prt', value: '150' },
            { id: 3, name: 'cho', value: '50' },
            { id: 4, name: 'cal', value: '2000' },
          ],
        }}
        updateUserProfile={updateUserProfile}
        getUserData={getUserData}
      />,
    );
    const getProps = () => renderer.root.findByType('mock-setting-my-vitals').props;

    ReactTestRenderer.act(() => {
      getProps().onSelectBodyUnitPreference('metric');
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onUpdateHandler();
    });

    expect(updateUserProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Lane',
        dob: '1/1/1990',
        height: '5.06',
        bodyUnitPreference: 'metric',
        gender: 'female',
      }),
    );
    expect(updateUserProfile.mock.calls[0][0].heightCentimeters).toBeCloseTo(
      167.64,
    );
    expect(updateUserProfile.mock.calls[0][0]).not.toHaveProperty('weight');
    expect(updateUserProfile.mock.calls[0][0]).not.toHaveProperty(
      'weightKilograms',
    );
    expect(updateUserProfile.mock.calls[0][0]).not.toHaveProperty(
      'targetCalories',
    );
    expectNoDurableDerivedProfileFields(updateUserProfile.mock.calls[0][0]);
  });

  test('MyVitalsPage does not hide invalid metric height by switching preferences', async () => {
    const updateUserProfile = jest.fn().mockResolvedValue(true);
    const renderer = await renderInAct(
      <MyVitalsPage
        navigation={{ navigate: jest.fn() }}
        user={{
          name: 'Lane',
          dob: '01/01/1990',
          gender: 'female',
          height: '5.06',
          heightCentimeters: 167.64,
          bodyUnitPreference: 'metric',
        }}
        updateUserProfile={updateUserProfile}
        getUserData={jest.fn().mockResolvedValue(true)}
      />,
    );
    const getProps = () => renderer.root.findByType('mock-setting-my-vitals').props;

    ReactTestRenderer.act(() => {
      getProps().onChangeMetricHeightText('bad');
    });

    ReactTestRenderer.act(() => {
      getProps().onSelectBodyUnitPreference('standard');
    });

    expect(getProps().bodyUnitPreference).toBe('metric');
    expect(getProps().draftMetricHeightText).toBe('bad');
    expect(getProps().heightErrorText).toBe('Use a positive number for height.');

    await ReactTestRenderer.act(async () => {
      await getProps().onUpdateHandler();
    });

    expect(updateUserProfile).not.toHaveBeenCalled();
  });

  test('MyVitalsPage reports invalid metric height inline', async () => {
    const updateUserProfile = jest.fn().mockResolvedValue(true);
    const renderer = await renderInAct(
      <MyVitalsPage
        navigation={{ navigate: jest.fn() }}
        user={{
          name: 'Lane',
          dob: '01/01/1990',
          gender: 'female',
          height: '5.06',
          bodyUnitPreference: 'metric',
        }}
        updateUserProfile={updateUserProfile}
        getUserData={jest.fn().mockResolvedValue(true)}
      />,
    );
    const getProps = () => renderer.root.findByType('mock-setting-my-vitals').props;

    ReactTestRenderer.act(() => {
      getProps().onChangeMetricHeightText('bad');
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onUpdateHandler();
    });

    expect(getProps().heightErrorText).toBe('Use a positive number for height.');
    expect(getProps().formErrorText).toBe(
      'Check the highlighted profile fields before saving.',
    );
    expect(updateUserProfile).not.toHaveBeenCalled();
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
    expect(getProps().bodyUnitPreference).toBe('standard');
    expect(getProps().draftDobText).toBe('4/3/1988');
    expect(getProps().draftHeightText).toBe('6 ft 1 in');
    expect(getProps().datePickerModal).toBe(false);
    expect(getProps().heightPickerModal).toBe(false);
  });

  test('MyVitalsPage hydrates height from canonical centimeters and defaults unsupported preference to standard', async () => {
    const renderer = await renderInAct(
      <MyVitalsPage
        navigation={{ navigate: jest.fn() }}
        user={{
          name: 'Lane',
          dob: '01/01/1990',
          gender: 'female',
          height: '5.06',
          heightCentimeters: 182.88,
          bodyUnitPreference: 'unsupported',
        }}
        updateUserProfile={jest.fn().mockResolvedValue(true)}
        getUserData={jest.fn().mockResolvedValue(true)}
      />,
    );
    const props = renderer.root.findByType('mock-setting-my-vitals').props;

    expect(props.bodyUnitPreference).toBe('standard');
    expect(props.draftHeightText).toBe('6 ft 0 in');
    expect(props.draftMetricHeightText).toBe('182.9');
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
          name: 'Edit profile details',
          displayValue: 'No nickname set',
        }),
      ]),
    );
    expect(profileItem.options[0].name).not.toBe('Edit nickname and vitals');
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

  test.each([
    ['standard', { bodyUnitPreference: 'standard' }],
    ['missing', {}],
    ['unsupported', { bodyUnitPreference: 'unsupported' }],
  ])(
    'MyProfilePage shows Standard body measurement preference for %s preference',
    async (_label, user) => {
      await expect(
        getBodyUnitPreferenceOption({
          ...user,
          targetCalories: [],
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          displayValue: 'Standard',
          screen: SETTINGS_ROUTES.MY_VITALS,
        }),
      );
    },
  );

  test('MyProfilePage shows Metric body measurement preference', async () => {
    await expect(
      getBodyUnitPreferenceOption({
        bodyUnitPreference: 'metric',
        targetCalories: [],
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        displayValue: 'Metric',
        screen: SETTINGS_ROUTES.MY_VITALS,
      }),
    );
  });

  test('MyProfilePage keeps body measurement summary terminology narrow', async () => {
    const standardListData = await getMyProfileListData({
      bodyUnitPreference: 'standard',
      targetCalories: [],
    });
    const metricListData = await getMyProfileListData({
      bodyUnitPreference: 'metric',
      targetCalories: [],
    });
    const summaryText = JSON.stringify([...standardListData, ...metricListData]);

    expect(summaryText).toContain('Profile');
    expect(summaryText).toContain('Edit profile details');
    expect(summaryText).toContain('Body measurement units');
    expect(summaryText).toContain('Standard');
    expect(summaryText).toContain('Metric');
    expect(summaryText).not.toContain('Edit nickname and vitals');
    FORBIDDEN_BODY_UNIT_UX_COPY.forEach(copy => {
      expect(summaryText).not.toContain(copy);
    });
  });

  test('MyProfilePage formats standard current weight in pounds', async () => {
    await expect(
      getCurrentWeightDisplayValue({
        weight: '135',
        bodyUnitPreference: 'standard',
        targetCalories: [],
      }),
    ).resolves.toBe('135.0 lb');
  });

  test('MyProfilePage formats current weight from the profile preference without changing calculations', async () => {
    const renderer = await renderInAct(
      <MyProfilePage
        navigation={{ navigate: jest.fn() }}
        user={{
          weight: '135',
          bodyUnitPreference: 'metric',
          bmi: '21.79',
          bmr: '1406.75',
          targetCalories: [],
        }}
      />,
    );
    const listData = renderer.root.findByType('mock-setting-my-profile').props.listData;
    const weightItem = listData.find(item => item.title === 'Current Weight');
    const bmiItem = listData.find(item => item.title === 'BMI');
    const bmrItem = listData.find(item => item.title === 'BMR');

    expect(weightItem.options[0].displayValue).toBe('61.2 kg');
    expect(bmiItem.options[0].displayValue).toBe('21.79');
    expect(bmrItem.options[0].displayValue).toBe('1406.75 CALORIES');
  });

  test.each([
    ['missing', undefined],
    ['unsupported', 'unsupported'],
  ])(
    'MyProfilePage defaults %s current weight preference to pounds',
    async (_label, bodyUnitPreference) => {
      await expect(
        getCurrentWeightDisplayValue({
          weight: '135',
          bodyUnitPreference,
          targetCalories: [],
        }),
      ).resolves.toBe('135.0 lb');
    },
  );

  test('MyProfilePage prefers canonical current weight over conflicting legacy weight', async () => {
    const renderer = await renderInAct(
      <MyProfilePage
        navigation={{ navigate: jest.fn() }}
        user={{
          weight: '999',
          weightKilograms: 61.2,
          bodyUnitPreference: 'metric',
          targetCalories: [],
        }}
      />,
    );
    const listData =
      renderer.root.findByType('mock-setting-my-profile').props.listData;
    const weightItem = listData.find(item => item.title === 'Current Weight');

    expect(weightItem.options[0].displayValue).toBe('61.2 kg');
  });

  test('MyProfilePage falls back to valid legacy weight when canonical weight is invalid', async () => {
    await expect(
      getCurrentWeightDisplayValue({
        weight: '135',
        weightKilograms: 'bad-input',
        bodyUnitPreference: 'metric',
        targetCalories: [],
      }),
    ).resolves.toBe('61.2 kg');
  });

  test.each([
    ['invalid legacy text', { weight: 'bad-input' }],
    [
      'invalid canonical and invalid legacy',
      { weight: 'bad-input', weightKilograms: 0 },
    ],
    ['missing values', {}],
  ])('MyProfilePage shows Not set for %s current weight', async (_label, user) => {
    await expect(
      getCurrentWeightDisplayValue({
        ...user,
        bodyUnitPreference: 'metric',
        targetCalories: [],
      }),
    ).resolves.toBe('Not set');
  });
});
