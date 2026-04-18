import AsyncStorage from '@react-native-async-storage/async-storage';
import { getExercises } from '../src/redux/actions/exercise';
import { readStoredExercises } from '../src/redux/actions/exerciseStorage';
import { GET_EXERCISES } from '../src/redux/constants';

describe('exercise storage boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('readStoredExercises returns an empty array when storage is empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await expect(readStoredExercises()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercises');
  });

  test('readStoredExercises parses and returns the stored exercises unchanged', async () => {
    const storedExercises = [{id: 'exercise-1', name: 'Rows', type: 'Back'}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedExercises));

    await expect(readStoredExercises()).resolves.toEqual(storedExercises);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercises');
  });

  test('readStoredExercises reads the exercises storage key', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await readStoredExercises();

    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercises');
  });

  test('getExercises preserves its dispatch contract and return value', async () => {
    const dispatch = jest.fn();
    const storedExercises = [{id: 'exercise-1', name: 'Rows', type: 'Back'}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedExercises));

    await expect(getExercises()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercises');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_EXERCISES,
      payload: storedExercises,
    });
  });
});
