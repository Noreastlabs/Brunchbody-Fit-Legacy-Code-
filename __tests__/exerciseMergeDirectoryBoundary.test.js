import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  deleteExercise,
  getExerciseDirectory,
  getExercises,
  mergeExercises,
} from '../src/redux/actions/exercise';
import {
  ADD_EXERCISE,
  DELETE_EXERCISE,
  EDIT_EXERCISE,
  GET_EXERCISES,
  GET_EXERCISE_DIRECTORY,
  MERGE_EXERCISES,
} from '../src/redux/constants';
import exerciseReducer from '../src/redux/reducer/exercise';
import {exercisesDirectory} from '../src/resources';

describe('exercise merge and directory boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getExercises reads exercises and dispatches the legacy Redux contract', async () => {
    const dispatch = jest.fn();
    const savedExercises = [{id: 'exercise-1', name: 'Rows', type: 'Back'}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(savedExercises));

    await expect(getExercises()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercises');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_EXERCISES,
      payload: savedExercises,
    });
  });

  test('getExerciseDirectory reads exercise_directory and dispatches the legacy Redux contract', async () => {
    const dispatch = jest.fn();
    const savedDirectory = [{id: 'dir-1', name: 'Pull-Up', type: 'Back'}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(savedDirectory));

    await expect(getExerciseDirectory()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercise_directory');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_EXERCISE_DIRECTORY,
      payload: savedDirectory,
    });
  });

  test('storage readers fall back to empty arrays when exercise keys are missing', async () => {
    const dispatch = jest.fn();

    AsyncStorage.getItem.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    await expect(getExercises()(dispatch)).resolves.toBe(true);
    await expect(getExerciseDirectory()(dispatch)).resolves.toBe(true);

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: GET_EXERCISES,
      payload: [],
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: GET_EXERCISE_DIRECTORY,
      payload: [],
    });
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });

  test('getExercises discards malformed exercises storage and preserves its dispatch contract', async () => {
    const dispatch = jest.fn();

    AsyncStorage.getItem.mockResolvedValueOnce('not-json');

    await expect(getExercises()(dispatch)).resolves.toBe(true);

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercises');
    expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('exercises');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalledWith(
      'exercise_directory',
    );
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_EXERCISES,
      payload: [],
    });
  });

  test('getExercises discards non-array exercises storage and preserves its dispatch contract', async () => {
    const dispatch = jest.fn();

    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({id: 'exercise-1', name: 'Rows', type: 'Back'}),
    );

    await expect(getExercises()(dispatch)).resolves.toBe(true);

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercises');
    expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('exercises');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalledWith(
      'exercise_directory',
    );
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_EXERCISES,
      payload: [],
    });
  });

  test('getExerciseDirectory discards malformed exercise_directory storage and preserves its dispatch contract', async () => {
    const dispatch = jest.fn();

    AsyncStorage.getItem.mockResolvedValueOnce('not-json');

    await expect(getExerciseDirectory()(dispatch)).resolves.toBe(true);

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercise_directory');
    expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('exercise_directory');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalledWith('exercises');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_EXERCISE_DIRECTORY,
      payload: [],
    });
  });

  test('getExerciseDirectory discards non-array exercise_directory storage and preserves its dispatch contract', async () => {
    const dispatch = jest.fn();

    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({id: 'dir-1', name: 'Pull-Up', type: 'Back'}),
    );

    await expect(getExerciseDirectory()(dispatch)).resolves.toBe(true);

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('exercise_directory');
    expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('exercise_directory');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalledWith('exercises');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_EXERCISE_DIRECTORY,
      payload: [],
    });
  });

  test('GET_EXERCISE_DIRECTORY filters brunch body items after lowercasing type', () => {
    const nextState = exerciseReducer(undefined, {
      type: GET_EXERCISE_DIRECTORY,
      payload: [
        {id: 'dir-1', name: 'Hip Bridge', type: 'Brunch Body'},
        {id: 'dir-2', name: 'Band Side Bends', type: 'brunch body'},
        {id: 'dir-3', name: 'Pull-Up', type: 'Back'},
      ],
    });

    expect(nextState.exerciseDirectory).toEqual([
      {id: 'dir-3', name: 'Pull-Up', type: 'Back'},
    ]);
  });

  test('MERGE_EXERCISES rebuilds allExercises and wholeExercises from their legacy sources', () => {
    const customExercises = [{id: 'custom-1', name: 'Rows', type: 'Back'}];
    const state = {
      ...exerciseReducer(undefined, {type: '@@INIT'}),
      exercises: customExercises,
      exerciseDirectory: [{id: 'dir-1', name: 'Pull-Up', type: 'Back'}],
    };

    const nextState = exerciseReducer(state, {type: MERGE_EXERCISES});

    expect(nextState.allExercises).toEqual([
      {
        id: 'custom-1',
        name: 'Rows',
        type: 'Back',
        wheelPickerId: 1,
      },
      {
        id: 'dir-1',
        name: 'Pull-Up',
        type: 'Back',
        wheelPickerId: 2,
      },
    ]);
    expect(nextState.wholeExercises).toEqual([
      ...customExercises,
      ...exercisesDirectory.exercises,
    ]);
  });

  test('deleteExercise dispatches delete then merge and returns true', async () => {
    const dispatch = jest.fn();

    await expect(deleteExercise('custom-1')(dispatch)).resolves.toBe(true);

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: DELETE_EXERCISE,
      payload: {id: 'custom-1'},
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: MERGE_EXERCISES,
    });
  });

  test('mergeExercises preserves its dispatch-only return contract', async () => {
    const dispatch = jest.fn();

    await expect(mergeExercises()(dispatch)).resolves.toBeUndefined();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({type: MERGE_EXERCISES});
  });

  test('exercise reducer preserves add, edit, and delete custom contracts', () => {
    let state = exerciseReducer(undefined, {type: '@@INIT'});
    state = exerciseReducer(state, {type: MERGE_EXERCISES});

    const previousWheelPickerId =
      state.allExercises[state.allExercises.length - 1].wheelPickerId;
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

    try {
      state = exerciseReducer(state, {
        type: ADD_EXERCISE,
        payload: {name: 'My Custom Row', type: 'Back'},
      });

      expect(state.exercises).toEqual([
        {id: '4fzzzxjylrx', name: 'My Custom Row', type: 'Back'},
      ]);
      expect(state.allExercises[state.allExercises.length - 1]).toEqual({
        id: '4fzzzxjylrx',
        name: 'My Custom Row',
        type: 'Back',
        wheelPickerId: previousWheelPickerId + 1,
      });

      state = exerciseReducer(state, {
        type: EDIT_EXERCISE,
        payload: {
          id: '4fzzzxjylrx',
          data: {name: 'My Custom Row v2'},
        },
      });

      expect(state.exercises[0].name).toBe('My Custom Row v2');
      expect(
        state.allExercises.find(exercise => exercise.id === '4fzzzxjylrx').name,
      ).toBe('My Custom Row v2');

      state = exerciseReducer(state, {
        type: DELETE_EXERCISE,
        payload: {id: '4fzzzxjylrx'},
      });

      expect(state.exercises).toEqual([]);
      expect(
        state.allExercises.find(exercise => exercise.id === '4fzzzxjylrx'),
      ).toBeUndefined();
    } finally {
      randomSpy.mockRestore();
    }
  });
});
