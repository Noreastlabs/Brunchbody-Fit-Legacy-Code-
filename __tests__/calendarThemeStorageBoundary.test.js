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
  });

  test('readStoredThemes parses and returns the stored themes payload unchanged', async () => {
    const storedThemes = [{id: 'theme-1', name: 'Morning', color: '#fff'}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedThemes));

    await expect(readStoredThemes()).resolves.toEqual(storedThemes);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('themes');
  });
});
