import AsyncStorage from '@react-native-async-storage/async-storage';
import { GET_TODO_TASKS } from '../src/redux/constants';
import { getTodo } from '../src/redux/actions/todo';
import { readStoredTodos } from '../src/redux/actions/todoStorage';

describe('todo storage boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('readStoredTodos returns an empty array when storage is empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await expect(readStoredTodos()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('todos');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });

  test('readStoredTodos parses and returns the stored todo payload unchanged', async () => {
    const storedTodos = [{id: 'task-1', name: 'Stretch', notes: ''}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedTodos));

    await expect(readStoredTodos()).resolves.toEqual(storedTodos);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('todos');
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });

  test('readStoredTodos removes malformed JSON and falls back to an empty array', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('not-json');

    await expect(readStoredTodos()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('todos');
    expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('todos');
  });

  test('readStoredTodos removes non-array payloads and falls back to an empty array', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({id: 'task-1', name: 'Stretch', notes: ''}),
    );

    await expect(readStoredTodos()).resolves.toEqual([]);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('todos');
    expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('todos');
  });

  test('getTodo preserves its dispatch contract and return value', async () => {
    const dispatch = jest.fn();
    const storedTodos = [{id: 'task-1', name: 'Stretch', notes: ''}];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(storedTodos));

    await expect(getTodo()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('todos');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_TODO_TASKS,
      payload: storedTodos,
    });
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });

  test('getTodo removes malformed JSON, dispatches an empty array, and still returns true', async () => {
    const dispatch = jest.fn();

    AsyncStorage.getItem.mockResolvedValueOnce('not-json');

    await expect(getTodo()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('todos');
    expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('todos');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_TODO_TASKS,
      payload: [],
    });
  });

  test('getTodo removes non-array payloads, dispatches an empty array, and still returns true', async () => {
    const dispatch = jest.fn();

    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({id: 'task-1', name: 'Stretch', notes: ''}),
    );

    await expect(getTodo()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('todos');
    expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('todos');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_TODO_TASKS,
      payload: [],
    });
  });
});
