import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ADD_TODO_TASK,
  DELETE_TODO_TASK,
  EDIT_TODO_TASK,
  GET_TODO_TASKS,
} from '../src/redux/constants';
import {
  addCalendarTodoTask,
  deleteCalendarTodoTask,
  editCalendarTodoTask,
  getCalendarTodoTasks,
} from '../src/redux/actions/calendar';

describe('calendar-owned todo action boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calendar todo aliases preserve the legacy todo action contract', async () => {
    const dispatch = jest.fn();
    const savedTasks = [
      {id: 'task-1', name: 'Stretch', notes: '', day: 'Someday'},
    ];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(savedTasks));

    await expect(getCalendarTodoTasks()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('todos');
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: GET_TODO_TASKS,
      payload: savedTasks,
    });

    await expect(
      addCalendarTodoTask({name: 'Hydrate', notes: '', day: 'Someday'})(dispatch),
    ).resolves.toBe(true);
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: ADD_TODO_TASK,
      payload: {name: 'Hydrate', notes: '', day: 'Someday'},
    });

    await expect(
      editCalendarTodoTask('task-1', {notes: '8 cups'})(dispatch),
    ).resolves.toBe(true);
    expect(dispatch).toHaveBeenNthCalledWith(3, {
      type: EDIT_TODO_TASK,
      payload: {id: 'task-1', data: {notes: '8 cups'}},
    });

    await expect(deleteCalendarTodoTask('task-1')(dispatch)).resolves.toBe(
      true,
    );
    expect(dispatch).toHaveBeenNthCalledWith(4, {
      type: DELETE_TODO_TASK,
      payload: {id: 'task-1'},
    });
  });
});
