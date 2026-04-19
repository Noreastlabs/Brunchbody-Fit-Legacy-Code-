import AsyncStorage from '@react-native-async-storage/async-storage';
import { readStoredThemes } from '../src/redux/actions/calendarThemeStorage';

describe('calendar theme storage boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('readStoredThemes returns an empty array when storage is empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await expect(readStoredThemes()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('themes');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('readStoredThemes parses and returns the stored themes payload unchanged', async () => {
    const storedThemes = [{id: 'theme-1', name: 'Morning', color: '#fff'}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedThemes));

    await expect(readStoredThemes()).resolves.toEqual(storedThemes);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('themes');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('readStoredThemes removes malformed JSON and falls back to an empty array', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('not-json');

    await expect(readStoredThemes()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('themes');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('themes');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('readStoredThemes removes non-array payloads and falls back to an empty array', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({id: 'theme-1', name: 'Morning', color: '#fff'}),
    );

    await expect(readStoredThemes()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('themes');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('themes');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
});
