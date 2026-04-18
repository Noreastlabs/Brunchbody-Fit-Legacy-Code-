import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../src/root-container/RootContainer', () => {
  const ReactLocal = require('react');

  return {
    RootContainer: props =>
      ReactLocal.createElement('mock-root-container', props),
  };
});

jest.mock('../src/storage/mmkv/hydration', () => ({
  hydrateWorkoutPlans: jest.fn(),
}));

import AppBootstrap, {
  resolveInitialRouteName,
} from '../src/bootstrap/AppBootstrap';
import { ROOT_ROUTES } from '../src/navigation/routeNames';
import { hydrateWorkoutPlans } from '../src/storage/mmkv/hydration';

const flushBootstrap = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const renderBootstrap = async () => {
  let renderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<AppBootstrap />);
    await flushBootstrap();
  });

  return renderer;
};

describe('App bootstrap route resolution', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns Home when a saved local profile exists', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('{"weight":"135"}');

    await expect(resolveInitialRouteName()).resolves.toBe(ROOT_ROUTES.HOME);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_profile');
  });

  test('returns CompleteProfile when no saved local profile exists', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await expect(resolveInitialRouteName()).resolves.toBe(
      ROOT_ROUTES.COMPLETE_PROFILE,
    );
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_profile');
  });

  test('returns CompleteProfile and repairs malformed stored local profile data', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('not-json');

    await expect(resolveInitialRouteName()).resolves.toBe(
      ROOT_ROUTES.COMPLETE_PROFILE,
    );
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_profile');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user_profile');
  });

  test('renders the resolved startup route when bootstrap succeeds', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('{"weight":"135"}');
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const renderer = await renderBootstrap();
    const rootContainer = renderer.root.findByType('mock-root-container');

    expect(hydrateWorkoutPlans).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_profile');
    expect(rootContainer.props.initialRouteName).toBe(ROOT_ROUTES.HOME);
    expect(renderer.toJSON()).not.toBeNull();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  test('falls back to CompleteProfile when bootstrap hydration throws', async () => {
    const bootstrapError = new Error('MMKV unavailable');
    hydrateWorkoutPlans.mockImplementationOnce(() => {
      throw bootstrapError;
    });
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const renderer = await renderBootstrap();
    const rootContainer = renderer.root.findByType('mock-root-container');

    expect(hydrateWorkoutPlans).toHaveBeenCalledTimes(1);
    expect(rootContainer.props.initialRouteName).toBe(
      ROOT_ROUTES.COMPLETE_PROFILE,
    );
    expect(renderer.toJSON()).not.toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[AppBootstrap] Startup failed. Falling back to CompleteProfile.',
      bootstrapError,
    );
  });
});
