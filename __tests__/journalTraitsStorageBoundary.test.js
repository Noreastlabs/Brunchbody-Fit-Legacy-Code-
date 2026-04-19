import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTraits } from '../src/redux/actions/journal';
import { readStoredTraits } from '../src/redux/actions/journalTraitsStorage';
import { GET_TRAITS } from '../src/redux/constants';

describe('journal traits storage boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('readStoredTraits returns an empty array when storage is empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await expect(readStoredTraits()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('traits');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('readStoredTraits parses and returns the stored traits unchanged', async () => {
    const storedTraits = [{id: 'trait-1', name: 'Calm'}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedTraits));

    await expect(readStoredTraits()).resolves.toEqual(storedTraits);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('traits');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('readStoredTraits reads the traits storage key', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await readStoredTraits();

    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('traits');
  });

  test('readStoredTraits removes malformed JSON and falls back to an empty array', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('not-json');

    await expect(readStoredTraits()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('traits');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('traits');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('readStoredTraits removes non-array payloads and falls back to an empty array', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({id: 'trait-1', name: 'Calm'}),
    );

    await expect(readStoredTraits()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('traits');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('traits');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('getTraits preserves its dispatch contract and return value', async () => {
    const dispatch = jest.fn();
    const storedTraits = [{id: 'trait-1', name: 'Calm'}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedTraits));

    await expect(getTraits()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('traits');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_TRAITS,
      payload: storedTraits,
    });
  });
});
