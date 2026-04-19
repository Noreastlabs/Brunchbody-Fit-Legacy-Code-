import AsyncStorage from '@react-native-async-storage/async-storage';
import { getExercises } from '../src/redux/actions/exercise';
import {
  readStoredExerciseDirectory,
  readStoredExercises,
} from '../src/redux/actions/exerciseStorage';
import { GET_EXERCISES } from '../src/redux/constants';

describe('exercise storage boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('readStoredExercises returns an empty array when storage is empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await expect(readStoredExercises()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercises');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('readStoredExercises parses and returns the stored exercises unchanged', async () => {
    const storedExercises = [{id: 'exercise-1', name: 'Rows', type: 'Back'}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedExercises));

    await expect(readStoredExercises()).resolves.toEqual(storedExercises);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercises');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('readStoredExercises reads the exercises storage key', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await readStoredExercises();

    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercises');
  });

  test('readStoredExercises removes malformed JSON and falls back to an empty array', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('not-json');

    await expect(readStoredExercises()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercises');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('exercises');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('readStoredExercises removes non-array payloads and falls back to an empty array', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({id: 'exercise-1', name: 'Rows', type: 'Back'}),
    );

    await expect(readStoredExercises()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercises');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('exercises');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('readStoredExerciseDirectory returns an empty array when storage is empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await expect(readStoredExerciseDirectory()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercise_directory');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('readStoredExerciseDirectory parses and returns the stored directory unchanged', async () => {
    const storedDirectory = [{id: 'dir-1', name: 'Pull-Up', type: 'Back'}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedDirectory));

    await expect(readStoredExerciseDirectory()).resolves.toEqual(
      storedDirectory,
    );
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercise_directory');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('readStoredExerciseDirectory removes malformed JSON and falls back to an empty array', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('not-json');

    await expect(readStoredExerciseDirectory()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercise_directory');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('exercise_directory');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('readStoredExerciseDirectory removes non-array payloads and falls back to an empty array', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({id: 'dir-1', name: 'Pull-Up', type: 'Back'}),
    );

    await expect(readStoredExerciseDirectory()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercise_directory');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('exercise_directory');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
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
