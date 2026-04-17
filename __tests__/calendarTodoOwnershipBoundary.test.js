import {readFileSync} from 'fs';
import path from 'path';
import {parse} from '@babel/parser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ADD_TODO_TASK,
  DELETE_TODO_TASK,
  EDIT_TODO_TASK,
  GET_TODO_TASKS,
} from '../src/redux/constants';
import * as actionsBarrel from '../src/redux/actions';
import * as calendarActions from '../src/redux/actions/calendar';
import * as todoActions from '../src/redux/actions/todo';
import todoReducer from '../src/redux/reducer/todo';

const readSource = relativePath =>
  readFileSync(path.join(__dirname, '..', relativePath), 'utf8');

const getCalendarSelectorsImport = source => {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['jsx', 'optionalChaining'],
  });

  return ast.program.body.find(
    node =>
      node.type === 'ImportDeclaration' &&
      node.source.value === '../../../../redux/selectors',
  );
};

const getMapStateToPropsProperties = source => {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['jsx', 'optionalChaining'],
  });
  const mapStateToProps = ast.program.body
    .filter(node => node.type === 'VariableDeclaration')
    .flatMap(node => node.declarations)
    .find(
      declaration =>
        declaration.id.type === 'Identifier' &&
        declaration.id.name === 'mapStateToProps',
    );

  return mapStateToProps.init.body.properties;
};

describe('calendar-owned todo action boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calendar todo aliases are the todo implementations behind calendar-owned names', () => {
    expect(calendarActions.addCalendarTodoTask).toBe(todoActions.addTodo);
    expect(calendarActions.editCalendarTodoTask).toBe(todoActions.editTodo);
    expect(calendarActions.deleteCalendarTodoTask).toBe(todoActions.deleteTodo);
    expect(calendarActions.getCalendarTodoTasks).toBe(todoActions.getTodo);
  });

  test('redux actions barrel continues exposing the calendar-owned todo alias names', () => {
    expect(actionsBarrel.addCalendarTodoTask).toBe(
      calendarActions.addCalendarTodoTask,
    );
    expect(actionsBarrel.editCalendarTodoTask).toBe(
      calendarActions.editCalendarTodoTask,
    );
    expect(actionsBarrel.deleteCalendarTodoTask).toBe(
      calendarActions.deleteCalendarTodoTask,
    );
    expect(actionsBarrel.getCalendarTodoTasks).toBe(
      calendarActions.getCalendarTodoTasks,
    );
  });

  test('getTodo reads the legacy todos storage key and dispatches the loaded tasks', async () => {
    const dispatch = jest.fn();
    const savedTasks = [
      {id: 'task-1', name: 'Stretch', notes: '', day: 'Someday'},
    ];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(savedTasks));

    await expect(todoActions.getTodo()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('todos');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_TODO_TASKS,
      payload: savedTasks,
    });
  });

  test('getTodo falls back to an empty array when storage is empty', async () => {
    const dispatch = jest.fn();

    AsyncStorage.getItem.mockResolvedValueOnce(null);

    await expect(todoActions.getTodo()(dispatch)).resolves.toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('todos');
    expect(dispatch).toHaveBeenCalledWith({
      type: GET_TODO_TASKS,
      payload: [],
    });
  });

  test('todo thunks keep returning true while dispatching the legacy action types', async () => {
    const dispatch = jest.fn();
    const taskData = {name: 'Hydrate', notes: '', day: 'Someday'};

    await expect(
      todoActions.addTodo(taskData)(dispatch),
    ).resolves.toBe(true);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: ADD_TODO_TASK,
      payload: taskData,
    });

    await expect(
      todoActions.editTodo('task-1', {notes: '8 cups'})(dispatch),
    ).resolves.toBe(true);
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: EDIT_TODO_TASK,
      payload: {id: 'task-1', data: {notes: '8 cups'}},
    });

    await expect(todoActions.deleteTodo('task-1')(dispatch)).resolves.toBe(true);
    expect(dispatch).toHaveBeenNthCalledWith(3, {
      type: DELETE_TODO_TASK,
      payload: {id: 'task-1'},
    });
  });

  test('todo reducer preserves the legacy top-level slice shape', () => {
    expect(todoReducer(undefined, {type: '@@INIT'})).toEqual({todoTasks: []});
  });

  test('todo reducer GET replaces tasks and valid CRUD operations keep working', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

    try {
      const loadedTasks = [
        {id: 'task-1', name: 'Stretch', notes: '', day: 'Someday'},
      ];
      const loadedState = todoReducer(undefined, {
        type: GET_TODO_TASKS,
        payload: loadedTasks,
      });

      expect(loadedState).toEqual({todoTasks: loadedTasks});

      const addedState = todoReducer(undefined, {
        type: ADD_TODO_TASK,
        payload: {name: 'Hydrate', notes: '', day: 'Someday'},
      });
      expect(addedState.todoTasks).toHaveLength(1);
      expect(addedState.todoTasks[0]).toEqual({
        id: '4fzzzxjylrx',
        name: 'Hydrate',
        notes: '',
        day: 'Someday',
      });

      const editedState = todoReducer(loadedState, {
        type: EDIT_TODO_TASK,
        payload: {id: 'task-1', data: {notes: 'Done', complete: true}},
      });
      expect(editedState.todoTasks).toEqual([
        {
          id: 'task-1',
          name: 'Stretch',
          notes: 'Done',
          day: 'Someday',
          complete: true,
        },
      ]);

      const deletedState = todoReducer(loadedState, {
        type: DELETE_TODO_TASK,
        payload: {id: 'task-1'},
      });
      expect(deletedState.todoTasks).toEqual([]);
    } finally {
      randomSpy.mockRestore();
    }
  });

  test('store and calendar screen sources keep the seam on todo state with calendar-owned UI names', () => {
    const storeSource = readSource('src/redux/store/store.js');
    const calendarScreenSource = readSource(
      'src/screens/calendar/pages/calendar/Calendar.js',
    );
    const selectorsImport = getCalendarSelectorsImport(calendarScreenSource);
    const mapStateToPropsProperties = getMapStateToPropsProperties(
      calendarScreenSource,
    );
    const mapStateToPropsSource = calendarScreenSource.match(
      /const mapStateToProps = state => \(\{[\s\S]*?\}\);/,
    )[0];
    const propertySelectorMap = Object.fromEntries(
      mapStateToPropsProperties.map(property => [
        property.key.name,
        {
          selector: property.value.callee.name,
          arg: property.value.arguments[0]?.name,
        },
      ]),
    );

    expect(storeSource).toMatch(/todo:\s*calendarTodoReducer,/);
    expect(storeSource).toMatch(/whitelist:\s*\[[\s\S]*'todo'/);

    expect(selectorsImport).toBeDefined();
    expect(selectorsImport.specifiers.map(specifier => specifier.local.name)).toEqual(
      expect.arrayContaining([
        'selectCalendarUser',
        'selectCalendarTodoTasks',
        'selectCalendarMyThemes',
        'selectCalendarCurrentTheme',
        'selectCalendarRepeatedTheme',
        'selectCalendarThemesWithFrequency',
        'selectCalendarClearedThemeDays',
      ]),
    );
    expect(propertySelectorMap).toEqual({
      user: {selector: 'selectCalendarUser', arg: 'state'},
      calendarTodoTasks: {
        selector: 'selectCalendarTodoTasks',
        arg: 'state',
      },
      myThemes: {selector: 'selectCalendarMyThemes', arg: 'state'},
      currentTheme: {
        selector: 'selectCalendarCurrentTheme',
        arg: 'state',
      },
      repeatedTheme: {
        selector: 'selectCalendarRepeatedTheme',
        arg: 'state',
      },
      themesWithFrequency: {
        selector: 'selectCalendarThemesWithFrequency',
        arg: 'state',
      },
      clearedThemeDays: {
        selector: 'selectCalendarClearedThemeDays',
        arg: 'state',
      },
    });
    expect(mapStateToPropsSource).not.toMatch(/state\.auth\?\.user/);
    expect(mapStateToPropsSource).not.toMatch(/state\.todo\?\.todoTasks/);
    expect(mapStateToPropsSource).not.toMatch(/state\.calendar\?\./);
    expect(calendarScreenSource).toMatch(
      /onAddCalendarTodoTask:\s*data => dispatch\(addCalendarTodoTask\(data\)\)/,
    );
    expect(calendarScreenSource).toMatch(
      /onEditCalendarTodoTask:\s*\(id,\s*data\)\s*=>\s*dispatch\(editCalendarTodoTask\(id,\s*data\)\)/,
    );
    expect(calendarScreenSource).toMatch(
      /onDeleteCalendarTodoTask:\s*id => dispatch\(deleteCalendarTodoTask\(id\)\)/,
    );
  });
});
