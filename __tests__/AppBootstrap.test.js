import AsyncStorage from '@react-native-async-storage/async-storage';
import { resolveInitialRouteName } from '../src/bootstrap/AppBootstrap';

describe('App bootstrap route resolution', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns Home when a saved local profile exists', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('{"weight":"135"}');

    await expect(resolveInitialRouteName()).resolves.toBe('Home');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_profile');
  });

  test('returns CompleteProfile when no saved local profile exists', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await expect(resolveInitialRouteName()).resolves.toBe('CompleteProfile');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_profile');
  });
});
