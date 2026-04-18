import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  changeEmail,
  changePassword,
  deleteAccount,
  loggedIn,
  logout,
  resetPassword,
} from '../src/redux/actions/auth';
import { CLEAR_USER, RESET_APP, SET_USER } from '../src/redux/constants';
import { ONBOARDING_DRAFT_KEYS } from '../src/redux/actions/onboardingStorage';
import SettingPage from '../src/screens/setting/pages/Setting/Setting';
import DeleteAccountPage from '../src/screens/setting/pages/MyProfile/DeleteAccount';
import { hydrateWorkoutPlans } from '../src/storage/mmkv/hydration';
import { storage } from '../src/storage/mmkv';

jest.mock('../src/storage/mmkv', () => ({
  storage: {
    clearAll: jest.fn(),
  },
}));

jest.mock('../src/storage/mmkv/hydration', () => ({
  hydrateWorkoutPlans: jest.fn(),
}));

jest.mock('../src/screens/setting/components', () => {
  const MockReact = require('react');

  return {
    Setting: props => MockReact.createElement('mock-setting', props),
    DeleteAccount: props => MockReact.createElement('mock-delete-account', props),
  };
});

describe('Local account actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loggedIn restores the stored local profile into auth state', async () => {
    const storedProfile = {
      dob: '01/01/1995',
      email: 'saved@example.com',
      gender: 'female',
      height: '5.06',
      weight: '135',
    };
    const dispatch = jest.fn();

    await AsyncStorage.setItem('user_profile', JSON.stringify(storedProfile));

    const result = await loggedIn()(dispatch);

    expect(result).toBe(true);
    expect(dispatch).toHaveBeenCalledWith({
      type: SET_USER,
      payload: storedProfile,
    });
  });

  test('loggedIn treats malformed stored local profile data as absent', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('not-json');
    const dispatch = jest.fn();

    const result = await loggedIn()(dispatch);

    expect(result).toBe('goToCompleteProfile');
    expect(dispatch).not.toHaveBeenCalled();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user_profile');
  });

  test('loggedIn repairs stale derived profile fields before restoring auth state', async () => {
    const canonicalProfile = {
      dob: '01/01/1995',
      email: 'saved@example.com',
      gender: 'female',
      height: '5.06',
      weight: '135',
    };
    const dispatch = jest.fn();

    await AsyncStorage.setItem(
      'user_profile',
      JSON.stringify({
        ...canonicalProfile,
        bmi: '999.99',
        bmr: '9999.99',
      }),
    );
    jest.clearAllMocks();

    const result = await loggedIn()(dispatch);

    expect(result).toBe(true);
    expect(dispatch).toHaveBeenCalledWith({
      type: SET_USER,
      payload: canonicalProfile,
    });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'user_profile',
      JSON.stringify(canonicalProfile),
    );
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });

  test('changeEmail persists the device-local email across relaunch', async () => {
    const dispatch = jest.fn();
    await AsyncStorage.setItem(
      'user_profile',
      JSON.stringify({
        dob: '01/01/1995',
        gender: 'female',
        height: '5.06',
        weight: '135',
        email: 'old@example.com',
      }),
    );

    const result = await changeEmail({ email: 'new@example.com' })(dispatch);
    const relaunchDispatch = jest.fn();
    const loginResult = await loggedIn()(relaunchDispatch);

    expect(result).toBe(true);
    expect(loginResult).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SET_USER,
        payload: expect.objectContaining({ email: 'new@example.com' }),
      }),
    );
    expect(relaunchDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SET_USER,
        payload: expect.objectContaining({ email: 'new@example.com' }),
      }),
    );
  });

  test('changePassword updates the device-local password when the current password matches', async () => {
    AsyncStorage.getItem
      .mockResolvedValueOnce(
        JSON.stringify({
          email: 'saved@example.com',
        }),
      )
      .mockResolvedValueOnce('old-pass');

    const result = await changePassword({
      email: 'saved@example.com',
      password: 'old-pass',
      newPassword: 'new-pass',
    })();

    expect(result).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'local_password',
      'new-pass',
    );
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
      'local_password_reset_requested_at',
    );
  });

  test('resetPassword clears the stored local password after email verification', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({
        email: 'saved@example.com',
      }),
    );

    const result = await resetPassword({
      email: 'saved@example.com',
    })();

    expect(result).toBe(true);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('local_password');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'local_password_reset_requested_at',
      expect.any(String),
    );
  });

  test('logout clears local profile credentials and auth state', async () => {
    const dispatch = jest.fn();

    const result = await logout()(dispatch);

    expect(result).toBe(true);
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
      expect.arrayContaining([
        'user_profile',
        'local_password',
        'local_password_reset_requested_at',
        ...ONBOARDING_DRAFT_KEYS,
      ]),
    );
    expect(AsyncStorage.clear).not.toHaveBeenCalled();
    expect(storage.clearAll).not.toHaveBeenCalled();
    expect(hydrateWorkoutPlans).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({ type: CLEAR_USER });
  });

  test('deleteAccount resets persisted app state and rehydrates bundled plans', async () => {
    AsyncStorage.getItem
      .mockResolvedValueOnce(
        JSON.stringify({
          email: 'saved@example.com',
        }),
      )
      .mockResolvedValueOnce('local-pass');
    const dispatch = jest.fn();

    const result = await deleteAccount({
      email: 'saved@example.com',
      password: 'local-pass',
    })(dispatch);

    expect(result).toBe(true);
    expect(dispatch).toHaveBeenCalledWith({ type: RESET_APP });
    expect(AsyncStorage.multiRemove).not.toHaveBeenCalled();
    expect(AsyncStorage.clear).toHaveBeenCalled();
    expect(storage.clearAll).toHaveBeenCalled();
    expect(hydrateWorkoutPlans).toHaveBeenCalled();
  });
});

describe('Settings/account navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('logout resets the root navigator to CompleteProfile', async () => {
    const rootNavigation = {
      getParent: jest.fn(() => undefined),
      reset: jest.fn(),
    };
    const tabNavigation = {
      getParent: jest.fn(() => rootNavigation),
      reset: jest.fn(),
    };
    const settingsNavigation = {
      getParent: jest.fn(() => tabNavigation),
      reset: jest.fn(),
    };
    const navigation = {
      getParent: jest.fn(() => settingsNavigation),
      reset: jest.fn(),
    };
    const logoutUser = jest.fn().mockResolvedValue(true);
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SettingPage navigation={navigation} logoutUser={logoutUser} />,
      );
    });

    await ReactTestRenderer.act(async () => {
      await renderer.root.findByType('mock-setting').props.onLogoutHandler();
    });

    expect(rootNavigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'CompleteProfile' }],
    });
    expect(settingsNavigation.reset).not.toHaveBeenCalled();
    expect(tabNavigation.reset).not.toHaveBeenCalled();
  });

  test('settings still expose the Export to CSV entry in the RC2 build', async () => {
    const navigation = {
      getParent: jest.fn(),
      reset: jest.fn(),
    };
    const logoutUser = jest.fn();
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SettingPage navigation={navigation} logoutUser={logoutUser} />,
      );
    });

    const exportSection = renderer.root
      .findByType('mock-setting')
      .props.listData.find(item => item.title === 'Export to CSV');

    expect(exportSection.options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ screen: 'ExportToCSV' }),
      ]),
    );
  });

  test('delete account returns the user to CompleteProfile after success confirmation', async () => {
    const rootNavigation = {
      getParent: jest.fn(() => undefined),
      reset: jest.fn(),
    };
    const tabNavigation = {
      getParent: jest.fn(() => rootNavigation),
      reset: jest.fn(),
    };
    const settingsNavigation = {
      getParent: jest.fn(() => tabNavigation),
      reset: jest.fn(),
    };
    const navigation = {
      getParent: jest.fn(() => settingsNavigation),
      reset: jest.fn(),
    };
    const deleteUserAccount = jest.fn().mockResolvedValue(true);
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <DeleteAccountPage
          navigation={navigation}
          deleteUserAccount={deleteUserAccount}
        />,
      );
    });

    await ReactTestRenderer.act(async () => {
      const props = renderer.root.findByType('mock-delete-account').props;
      props.setEmail('saved@example.com');
      props.setPassword('local-pass');
    });

    await ReactTestRenderer.act(async () => {
      await renderer.root.findByType('mock-delete-account').props.onDeleteAccount();
    });

    await ReactTestRenderer.act(async () => {
      renderer.root.findByType('mock-delete-account').props.onDonePermissionModal();
    });

    expect(deleteUserAccount).toHaveBeenCalledWith({
      email: 'saved@example.com',
      password: 'local-pass',
    });
    expect(rootNavigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'CompleteProfile' }],
    });
    expect(settingsNavigation.reset).not.toHaveBeenCalled();
    expect(tabNavigation.reset).not.toHaveBeenCalled();
  });
});
