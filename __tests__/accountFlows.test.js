import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScopedStorage from 'react-native-scoped-storage';
import RNFS from 'react-native-fs';
import {
  changeEmail,
  changePassword,
  deleteAccount,
  loggedIn,
  logout,
  resetPassword,
} from '../src/redux/actions/auth';
import { SETTINGS_ROUTES } from '../src/navigation/routeNames';
import { CLEAR_USER, RESET_APP, SET_USER } from '../src/redux/constants';
import { ONBOARDING_DRAFT_KEYS } from '../src/redux/actions/onboardingStorage';
import authReducer from '../src/redux/reducer/auth';
import SettingPage from '../src/screens/setting/pages/Setting/Setting';
import DeleteAccountPage from '../src/screens/setting/pages/MyProfile/DeleteAccount';
import DeleteAccountSurface from '../src/screens/setting/components/My Profile/DeleteAccount';
import { hydrateWorkoutPlans } from '../src/storage/mmkv/hydration';
import { storage } from '../src/storage/mmkv';

const DELETE_LOCAL_DATA_CONFIRMATION_ERROR =
  'Please confirm that Delete local data clears Brunch Body app-managed local data on this device.';
const DELETE_LOCAL_DATA_SUCCESS_MESSAGE =
  'Brunch Body app-managed local data on this device was cleared.\n\nFiles you exported, copied, shared, moved, backed up, uploaded, placed in OS backups or cloud folders, or otherwise kept outside Brunch Body app-managed storage were not deleted.\n\nThis action was limited to Brunch Body app-managed local data on this device.\n\nStarter content included with Brunch Body may appear again after deletion.';

jest.mock('../src/storage/mmkv', () => ({
  storage: {
    clearAll: jest.fn(),
  },
}));

jest.mock('../src/storage/mmkv/hydration', () => ({
  hydrateWorkoutPlans: jest.fn(),
}));

jest.mock('react-native-scoped-storage', () => ({
  createDocumentFile: jest.fn(),
  deleteFile: jest.fn(),
}));

jest.mock('react-native-fs', () => ({
  unlink: jest.fn(),
}));

jest.mock('../src/components', () => {
  const MockReact = require('react');

  return {
    CustomHeader: props => MockReact.createElement('mock-custom-header', props),
    Button: props => MockReact.createElement('mock-button', props),
    CustomModal: props =>
      MockReact.createElement('mock-custom-modal', props, props.content),
    PermissionModal: props =>
      MockReact.createElement('mock-permission-modal', props),
    SafeAreaWrapper: props =>
      MockReact.createElement('mock-safe-area-wrapper', props, props.children),
  };
});

jest.mock('../src/screens/setting/components', () => {
  const MockReact = require('react');

  return {
    Setting: props => MockReact.createElement('mock-setting', props),
    DeleteAccount: props => MockReact.createElement('mock-delete-account', props),
  };
});

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

describe('Local data actions', () => {
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

  test('logout clears only scoped local auth profile onboarding password state', async () => {
    const dispatch = jest.fn();
    const scopedLogoutKeys = [
      'user_profile',
      'local_password',
      'local_password_reset_requested_at',
      ...ONBOARDING_DRAFT_KEYS,
    ];

    const result = await logout()(dispatch);

    expect(result).toBe(true);
    expect(AsyncStorage.multiRemove).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(scopedLogoutKeys);
    expect(AsyncStorage.clear).not.toHaveBeenCalled();
    expect(storage.clearAll).not.toHaveBeenCalled();
    expect(hydrateWorkoutPlans).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({ type: CLEAR_USER });
  });

  test('CLEAR_USER resets the auth reducer without storage clearing', () => {
    const populatedAuthState = authReducer(undefined, {
      type: SET_USER,
      payload: {
        dob: '01/01/1995',
        email: 'saved@example.com',
        gender: 'female',
        height: '5.06',
        weight: '135',
      },
    });

    const resetAuthState = authReducer(populatedAuthState, { type: CLEAR_USER });

    expect(populatedAuthState.user).toEqual(
      expect.objectContaining({ email: 'saved@example.com' }),
    );
    expect(resetAuthState).toEqual({ user: {} });
    expect(AsyncStorage.clear).not.toHaveBeenCalled();
    expect(storage.clearAll).not.toHaveBeenCalled();
    expect(hydrateWorkoutPlans).not.toHaveBeenCalled();
  });

  test('RESET_APP resets reducer state without performing storage clear by itself', () => {
    let resetState;

    jest.isolateModules(() => {
      jest.doMock('redux-persist', () => ({
        persistReducer: (persistConfig, reducer) => {
          expect(persistConfig.key).toBe('root');
          return reducer;
        },
        persistStore: jest.fn(() => ({
          flush: jest.fn(),
          pause: jest.fn(),
          persist: jest.fn(),
          purge: jest.fn(),
        })),
      }));

      const { store } = require('../src/redux/store/store');

      store.dispatch({
        type: SET_USER,
        payload: {
          dob: '01/01/1995',
          email: 'reset@example.com',
          gender: 'female',
          height: '5.06',
          weight: '135',
        },
      });

      expect(store.getState().auth.user).toEqual(
        expect.objectContaining({ email: 'reset@example.com' }),
      );

      store.dispatch({ type: RESET_APP });
      resetState = store.getState();
    });

    jest.dontMock('redux-persist');

    expect(resetState.auth).toEqual({ user: {} });
    expect(resetState.journal.allJournalEntriesList).toEqual([]);
    expect(AsyncStorage.clear).not.toHaveBeenCalled();
    expect(storage.clearAll).not.toHaveBeenCalled();
    expect(hydrateWorkoutPlans).not.toHaveBeenCalled();
    expect(RNFS.unlink).not.toHaveBeenCalled();
    expect(ScopedStorage.deleteFile).not.toHaveBeenCalled();
  });

  test('Delete local data clears app managed local stores then rehydrates bundled plans', async () => {
    const dispatch = jest.fn();

    // deleteAccount is the current internal action behind Delete local data.
    const result = await deleteAccount()(dispatch);

    expect(result).toBe(true);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: RESET_APP });
    expect(AsyncStorage.multiRemove).not.toHaveBeenCalled();
    expect(AsyncStorage.getItem).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    expect(AsyncStorage.clear).toHaveBeenCalledTimes(1);
    expect(storage.clearAll).toHaveBeenCalledTimes(1);
    expect(hydrateWorkoutPlans).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.invocationCallOrder[0]).toBeLessThan(
      AsyncStorage.clear.mock.invocationCallOrder[0],
    );
    expect(AsyncStorage.clear.mock.invocationCallOrder[0]).toBeLessThan(
      storage.clearAll.mock.invocationCallOrder[0],
    );
    expect(storage.clearAll.mock.invocationCallOrder[0]).toBeLessThan(
      hydrateWorkoutPlans.mock.invocationCallOrder[0],
    );
    expect(RNFS.unlink).not.toHaveBeenCalled();
    expect(ScopedStorage.deleteFile).not.toHaveBeenCalled();
  });

  test('Delete local data does not delete user managed exported copies', async () => {
    const dispatch = jest.fn();

    // deleteAccount is the current internal action behind Delete local data.
    const result = await deleteAccount()(dispatch);

    expect(result).toBe(true);
    expect(AsyncStorage.clear).toHaveBeenCalledTimes(1);
    expect(storage.clearAll).toHaveBeenCalledTimes(1);
    expect(hydrateWorkoutPlans).toHaveBeenCalledTimes(1);
    expect(RNFS.unlink).not.toHaveBeenCalled();
    expect(ScopedStorage.deleteFile).not.toHaveBeenCalled();
  });
});

describe('Delete local data screen copy', () => {
  test('renders approved local deletion transparency copy', async () => {
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <DeleteAccountSurface
          isConfirmed={false}
          toggleSwitch={jest.fn()}
          loader={false}
          onDeleteAccount={jest.fn()}
          isPermissionModal={false}
          setIsPermissionModal={jest.fn()}
          alertHeading=""
          alertText=""
          onDonePermissionModal={jest.fn()}
        />,
      );
    });

    const renderedText = collectRenderedText(renderer.toJSON()).replace(
      /\s+/g,
      ' ',
    );

    expect(renderedText).toContain('Delete local data');
    expect(renderedText).toContain(
      'This clears Brunch Body app-managed local data on this device.',
    );
    expect(renderedText).toContain(
      'saved profile details, journal entries, workouts, nutrition, themes, todos, and other Brunch Body app-managed local data.',
    );
    expect(renderedText).toContain(
      'files you exported, copied, shared, moved, backed up, uploaded, placed in OS backups or cloud folders, or otherwise kept outside Brunch Body app-managed storage.',
    );
    expect(renderedText).toContain(
      'This action is limited to Brunch Body app-managed local data on this device.',
    );
    expect(renderedText).toContain(
      'Starter content included with Brunch Body.',
    );
    expect(renderer.root.findByType('mock-button').props.title).toBe(
      'Delete local data',
    );
    expect(renderedText).not.toContain('Delete account');
    expect(renderedText).not.toContain('Reset app');
    expect(renderedText).not.toContain('Delete all data');
    expect(renderedText).not.toContain('Erase everything');
    expect(renderedText).not.toMatch(/\barchive\b/i);
  });
});

describe('Settings navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('settings no longer expose a logout entry in the Phase 1 surface', async () => {
    const navigation = {
      getParent: jest.fn(),
      reset: jest.fn(),
    };
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<SettingPage navigation={navigation} />);
    });

    expect(
      renderer.root
        .findByType('mock-setting')
        .props.listData.find(item => item.title === 'Logout'),
    ).toBeUndefined();
  });

  test('settings expose export and delete-local-data entries in the Phase 1 surface', async () => {
    const navigation = {
      getParent: jest.fn(),
      reset: jest.fn(),
    };
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<SettingPage navigation={navigation} />);
    });

    const settingsList = renderer.root.findByType('mock-setting').props.listData;
    const exportSection = settingsList.find(item => item.title === 'Export data');
    const deleteSection = settingsList.find(
      item => item.title === 'Delete local data',
    );
    const aboutSection = settingsList.find(item => item.title === 'About');

    expect(exportSection.options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ screen: 'ExportToCSV' }),
      ]),
    );
    expect(deleteSection.options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ screen: 'DeleteAccount' }),
      ]),
    );
    expect(aboutSection.options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Privacy & Data',
          screen: SETTINGS_ROUTES.PRIVACY_AND_DATA,
        }),
        expect.objectContaining({
          name: 'Help & Support',
          screen: SETTINGS_ROUTES.HELP_AND_SUPPORT,
        }),
      ]),
    );
  });

  test('settings keep reset-password and account routes out of the visible Phase 1 surface', async () => {
    const navigation = {
      getParent: jest.fn(),
      reset: jest.fn(),
    };
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<SettingPage navigation={navigation} />);
    });

    const settingsList = renderer.root.findByType('mock-setting').props.listData;
    const visibleText = settingsList
      .flatMap(section => [
        section.title,
        ...section.options.map(option => option.name),
      ])
      .filter(Boolean)
      .join(' ');
    const visibleRoutes = settingsList
      .flatMap(section => section.options.map(option => option.screen))
      .filter(Boolean);
    const deleteLocalDataSections = settingsList.filter(
      section => section.title === 'Delete local data',
    );

    expect(deleteLocalDataSections).toHaveLength(1);
    expect(deleteLocalDataSections[0].options).toEqual([
      expect.objectContaining({
        name: 'Delete local data',
        screen: SETTINGS_ROUTES.DELETE_ACCOUNT,
      }),
    ]);
    expect(visibleText).toContain('Delete local data');
    [
      'Account',
      'Login',
      'Log in',
      'Logout',
      'Log out',
      'Password',
      'Reset app',
      'Reset password',
      'Forgot Password',
      'My Password',
      'My Account',
      'Delete account',
    ].forEach(label => {
      expect(visibleText).not.toContain(label);
    });
    expect(visibleRoutes).not.toContain(SETTINGS_ROUTES.MY_PASSWORD);
    expect(visibleRoutes).not.toContain(SETTINGS_ROUTES.MY_ACCOUNT);
    expect(visibleRoutes).not.toContain(SETTINGS_ROUTES.MY_EMAIL);
  });

  test('delete local data requires confirmation before deletion runs', async () => {
    const navigation = {
      getParent: jest.fn(),
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
      await renderer.root.findByType('mock-delete-account').props.onDeleteAccount();
    });

    const deleteLocalDataProps =
      renderer.root.findByType('mock-delete-account').props;

    expect(deleteUserAccount).not.toHaveBeenCalled();
    expect(deleteLocalDataProps.alertHeading).toBe('Error!');
    expect(deleteLocalDataProps.alertText).toBe(
      DELETE_LOCAL_DATA_CONFIRMATION_ERROR,
    );
    expect(deleteLocalDataProps.isPermissionModal).toBe(true);
    expect(navigation.reset).not.toHaveBeenCalled();
  });

  test('delete local data returns the user to CompleteProfile after success confirmation', async () => {
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
      props.toggleSwitch();
    });

    await ReactTestRenderer.act(async () => {
      await renderer.root.findByType('mock-delete-account').props.onDeleteAccount();
    });

    const successProps = renderer.root.findByType('mock-delete-account').props;

    expect(successProps.alertHeading).toBe('Success!');
    expect(successProps.alertText).toBe(DELETE_LOCAL_DATA_SUCCESS_MESSAGE);
    expect(successProps.isPermissionModal).toBe(true);

    await ReactTestRenderer.act(async () => {
      renderer.root.findByType('mock-delete-account').props.onDonePermissionModal();
    });

    expect(deleteUserAccount).toHaveBeenCalledWith();
    expect(rootNavigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'CompleteProfile' }],
    });
    expect(settingsNavigation.reset).not.toHaveBeenCalled();
    expect(tabNavigation.reset).not.toHaveBeenCalled();
  });
});

// retention_clear_paths_tests_added
