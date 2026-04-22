import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import moment from 'moment';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  connect: () => Component => Component,
  useDispatch: () => mockDispatch,
}));

jest.mock('../src/redux/actions', () => ({
  addRepeatedTheme: jest.fn(() => ({type: 'ADD_REPEATED_THEME'})),
  addTheme: jest.fn(() => ({type: 'ADD_THEME'})),
  addCalendarTodoTask: jest.fn(() => ({type: 'ADD_CALENDAR_TODO_TASK'})),
  changeRepeatedTheme: jest.fn(() => ({type: 'CHANGE_REPEATED_THEME'})),
  clearCurrentTheme: jest.fn(() => ({type: 'CLEAR_CURRENT_THEME'})),
  clearThemeDays: jest.fn(() => ({type: 'CLEAR_THEME_DAYS'})),
  deleteTheme: jest.fn(() => ({type: 'DELETE_THEME'})),
  deleteCalendarTodoTask: jest.fn(() => ({type: 'DELETE_CALENDAR_TODO_TASK'})),
  editRepeatedTheme: jest.fn(() => ({type: 'EDIT_REPEATED_THEME'})),
  editCalendarTodoTask: jest.fn(() => ({type: 'EDIT_CALENDAR_TODO_TASK'})),
  getRepeatedThemes: jest.fn(() => ({type: 'GET_REPEATED_THEMES'})),
  setTheme: jest.fn(data => ({type: 'SET_THEME', payload: data})),
  updateThemesWithFrequency: jest.fn(() => ({
    type: 'UPDATE_THEMES_WITH_FREQUENCY',
  })),
}));

jest.mock('../src/redux/selectors', () => ({
  selectCalendarClearedThemeDays: jest.fn(() => ({})),
  selectCalendarCurrentTheme: jest.fn(() => ({})),
  selectCalendarMyThemes: jest.fn(() => []),
  selectCalendarRepeatedTheme: jest.fn(() => ({})),
  selectCalendarThemesWithFrequency: jest.fn(() => ({})),
  selectCalendarTodoTasks: jest.fn(() => []),
  selectCalendarUser: jest.fn(() => ({})),
}));

jest.mock('../src/resources', () => ({
  __esModule: true,
  colors: {
    background: 'background',
    secondary: 'secondary',
    tertiary: 'tertiary',
    white: 'white',
    black: 'black',
    grey: 'grey',
    mainFont: 'mainFont',
    nonEditableOverlays: 'nonEditableOverlays',
    textGrey: 'textGrey',
    qccentError: 'qccentError',
    mediumGreen: 'mediumGreen',
    red: 'red',
    defaultColor: '#004672',
  },
  strings: {
    calendar: {
      defaultColor: '#004672',
      theme: 'Theme',
      create: 'create',
      manage: 'manage',
      addRemove: 'add/remove',
      someday: 'Someday',
      pickday: 'Pick a day',
      todo: 'Todo',
    },
    editTodo: {
      enterTask: 'Enter Task',
      selectTime: 'Select Time',
      someday: 'SOMEDAY',
      pickDay: 'PICK A DAY',
      notes: 'Notes',
    },
    editTask: {
      title: 'To Do',
      note: 'Note:',
      noTasks: 'No Tasks Yet',
    },
    todo: {
      today: 'Today',
      someday: 'Someday',
    },
    button: {
      save: 'Save',
      edit: 'Edit',
    },
  },
  wheelPickerItems: {
    frequency: [],
    calendarDays: [],
  },
}));

jest.mock('../src/components', () => {
  const ReactLocal = require('react');

  return {
    CustomModal: props =>
      ReactLocal.createElement('mock-custom-modal', props, props.content),
    DatePickerModal: props =>
      ReactLocal.createElement('mock-date-picker-modal', props),
    PermissionModal: props =>
      ReactLocal.createElement('mock-permission-modal', props),
    SafeAreaWrapper: props =>
      ReactLocal.createElement('mock-safe-area-wrapper', props, props.children),
    WheelPickerContent: props =>
      ReactLocal.createElement('mock-wheel-picker-content', props),
  };
});

jest.mock('../src/screens/calendar/pages/calendar/modals', () => {
  const ReactLocal = require('react');

  return {
    AddRemoveTheme: props =>
      ReactLocal.createElement('mock-add-remove-theme', props),
    ClearTheme: props => ReactLocal.createElement('mock-clear-theme', props),
  };
});

jest.mock('../src/screens/calendar/components', () => {
  const ReactLocal = require('react');

  return {
    __esModule: true,
    default: props => ReactLocal.createElement('mock-calendar-ui', props),
  };
});

jest.mock('../src/screens/calendar/components/CalendarMenu', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-calendar-menu', props);
});

jest.mock('../src/screens/calendar/components/ColorPicker', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-calendar-color-picker', props);
});

jest.mock('../src/screens/calendar/components/CreateTheme', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-create-theme', props);
});

jest.mock('../src/screens/calendar/components/EditTask', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-edit-task', props);
});

jest.mock('../src/screens/calendar/components/EditTodo', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-edit-todo', props);
});

jest.mock('../src/screens/calendar/components/ManageTheme', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-manage-theme', props);
});

jest.mock('../src/screens/calendar/components/MyThemes', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-my-themes', props);
});

jest.mock('../src/screens/calendar/components/Todo', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-calendar-todo', props);
});

jest.mock('../src/screens/calendar/components/Writing', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-calendar-writing', props);
});

import CalendarPage from '../src/screens/calendar/pages/calendar/Calendar';

const createDeferred = () => {
  let resolve;
  const promise = new Promise(res => {
    resolve = res;
  });

  return {promise, resolve};
};

const createProps = overrides => ({
  navigation: {navigate: jest.fn()},
  onAddTheme: jest.fn().mockResolvedValue(true),
  myThemes: [],
  onDeleteTheme: jest.fn().mockResolvedValue(true),
  onAddCalendarTodoTask: jest.fn().mockResolvedValue(true),
  onEditCalendarTodoTask: jest.fn().mockResolvedValue(true),
  onDeleteCalendarTodoTask: jest.fn().mockResolvedValue(true),
  calendarTodoTasks: [],
  onAddRepeatedTheme: jest.fn().mockResolvedValue(true),
  currentTheme: {},
  themesWithFrequency: {
    [moment().format('YYYY-MM-DD')]: {
      selected: true,
      customStyles: {
        container: {
          borderWidth: 2,
        },
      },
    },
  },
  onEditRepeatedTheme: jest.fn().mockResolvedValue(true),
  repeatedTheme: {},
  setRepeatedTheme: jest.fn(),
  onClearCurrentTheme: jest.fn(),
  user: {},
  onUpdateThemesWithFrequency: jest.fn(),
  onGetRepeatedTheme: jest.fn().mockResolvedValue(true),
  onRemoveThemeDays: jest.fn().mockResolvedValue(true),
  clearedThemeDays: {},
  ...overrides,
});

const renderInAct = async element => {
  let renderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(element);
  });

  return renderer;
};

const getPermissionModalVisibility = renderer => {
  const modals = renderer.root.findAllByType('mock-custom-modal');

  return modals[modals.length - 1].props.isVisible;
};

describe('calendar todo form UX boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('keeps add validation inline, stays placeholder-first for Pick Day, and clears stale add state on reopen', async () => {
    const renderer = await renderInAct(<CalendarPage {...createProps()} />);
    const getMenuProps = () => renderer.root.findByType('mock-calendar-menu').props;
    const getEditTodoProps = () => renderer.root.findByType('mock-edit-todo').props;

    ReactTestRenderer.act(() => {
      getMenuProps().openEditModal();
    });

    await ReactTestRenderer.act(async () => {
      await getEditTodoProps().onSaveEditModal();
    });

    expect(getEditTodoProps().taskErrorText).toBe('Enter a task name.');
    expect(getEditTodoProps().dayErrorText).toBe(
      'Choose Someday or confirm a day.',
    );
    expect(getEditTodoProps().formErrorText).toBe(
      'Check the highlighted todo fields before saving.',
    );
    expect(getPermissionModalVisibility(renderer)).toBe(false);

    ReactTestRenderer.act(() => {
      getEditTodoProps().onTaskNameChange('Hydrate');
      getEditTodoProps().onTaskNotesChange('8 cups');
      getEditTodoProps().checkSecond();
    });

    expect(getEditTodoProps().taskName).toBe('Hydrate');
    expect(getEditTodoProps().taskNotes).toBe('8 cups');
    expect(getEditTodoProps().checked).toBe('Pick a day');
    expect(getEditTodoProps().taskDayLabel).toBe('');
    expect(getEditTodoProps().formErrorText).toBe('');

    ReactTestRenderer.act(() => {
      getEditTodoProps().onConfirmDatePicker(new Date(2026, 3, 15));
    });

    expect(getEditTodoProps().taskDayLabel).toBe('4/15/2026');

    ReactTestRenderer.act(() => {
      getEditTodoProps().hideEditModal();
      getMenuProps().openEditModal();
    });

    expect(getEditTodoProps().taskName).toBe('');
    expect(getEditTodoProps().taskNotes).toBe('');
    expect(getEditTodoProps().checked).toBe('');
    expect(getEditTodoProps().taskDayLabel).toBe('');
    expect(getEditTodoProps().taskErrorText).toBe('');
    expect(getEditTodoProps().dayErrorText).toBe('');
    expect(getEditTodoProps().formErrorText).toBe('');
  });

  test('rehydrates dated edit sessions from the selected todo identity on reopen', async () => {
    const renderer = await renderInAct(<CalendarPage {...createProps()} />);
    const getTodoProps = () => renderer.root.findByType('mock-calendar-todo').props;
    const getEditTaskProps = () => renderer.root.findByType('mock-edit-task').props;
    const getEditTodoProps = () => renderer.root.findByType('mock-edit-todo').props;
    const task = {
      id: 'task-1',
      name: 'Stretch',
      notes: 'After work',
      day: '2026-04-15T12:00:00.000Z',
    };

    ReactTestRenderer.act(() => {
      getTodoProps().showModal(task);
    });

    ReactTestRenderer.act(() => {
      getEditTaskProps().openEditModal();
    });

    expect(getEditTodoProps().editTask).toBe(true);
    expect(getEditTodoProps().taskName).toBe('Stretch');
    expect(getEditTodoProps().taskNotes).toBe('After work');
    expect(getEditTodoProps().checked).toBe('Pick a day');
    expect(getEditTodoProps().taskDayLabel).toBe('4/15/2026');

    ReactTestRenderer.act(() => {
      getEditTodoProps().onTaskNameChange('Changed draft');
      getEditTodoProps().onTaskNotesChange('Stale notes');
      getEditTodoProps().hideEditModal();
      getTodoProps().showModal(task);
    });

    ReactTestRenderer.act(() => {
      getEditTaskProps().openEditModal();
    });

    expect(getEditTodoProps().taskName).toBe('Stretch');
    expect(getEditTodoProps().taskNotes).toBe('After work');
    expect(getEditTodoProps().taskDayLabel).toBe('4/15/2026');
  });

  test('guards duplicate add and edit submits while pending', async () => {
    const addDeferred = createDeferred();
    const editDeferred = createDeferred();
    const props = createProps({
      onAddCalendarTodoTask: jest.fn().mockImplementation(() => addDeferred.promise),
      onEditCalendarTodoTask: jest
        .fn()
        .mockImplementation(() => editDeferred.promise),
    });
    const renderer = await renderInAct(<CalendarPage {...props} />);
    const getMenuProps = () => renderer.root.findByType('mock-calendar-menu').props;
    const getTodoProps = () => renderer.root.findByType('mock-calendar-todo').props;
    const getEditTaskProps = () => renderer.root.findByType('mock-edit-task').props;
    const getEditTodoProps = () => renderer.root.findByType('mock-edit-todo').props;
    const task = {
      id: 'task-2',
      name: 'Read',
      notes: '',
      day: 'Someday',
    };

    ReactTestRenderer.act(() => {
      getMenuProps().openEditModal();
      getEditTodoProps().onTaskNameChange('Hydrate');
      getEditTodoProps().checkFirst();
    });

    let firstAddRequest;

    await ReactTestRenderer.act(async () => {
      firstAddRequest = getEditTodoProps().onSaveEditModal();
    });

    expect(props.onAddCalendarTodoTask).toHaveBeenCalledTimes(1);
    expect(getEditTodoProps().saveDisabled).toBe(true);

    await ReactTestRenderer.act(async () => {
      const secondAddRequest = getEditTodoProps().onSaveEditModal();

      addDeferred.resolve(true);
      await firstAddRequest;
      await secondAddRequest;
    });

    expect(props.onAddCalendarTodoTask).toHaveBeenCalledWith({
      name: 'Hydrate',
      notes: '',
      day: 'Someday',
    });

    ReactTestRenderer.act(() => {
      getTodoProps().showModal(task);
    });

    ReactTestRenderer.act(() => {
      getEditTaskProps().openEditModal();
      getEditTodoProps().onTaskNameChange('Read more');
    });

    let firstEditRequest;

    await ReactTestRenderer.act(async () => {
      firstEditRequest = getEditTodoProps().onUpdateTodo();
    });

    expect(props.onEditCalendarTodoTask).toHaveBeenCalledTimes(1);
    expect(getEditTodoProps().clearTaskDisabled).toBe(true);

    await ReactTestRenderer.act(async () => {
      const secondEditRequest = getEditTodoProps().onUpdateTodo();

      editDeferred.resolve(true);
      await firstEditRequest;
      await secondEditRequest;
    });

    expect(props.onEditCalendarTodoTask).toHaveBeenCalledWith('task-2', {
      name: 'Read more',
      notes: '',
      day: 'Someday',
    });
  });

  test('guards duplicate delete confirms while pending', async () => {
    const deleteDeferred = createDeferred();
    const props = createProps({
      onDeleteCalendarTodoTask: jest
        .fn()
        .mockImplementation(() => deleteDeferred.promise),
    });
    const renderer = await renderInAct(<CalendarPage {...props} />);
    const getTodoProps = () => renderer.root.findByType('mock-calendar-todo').props;
    const getEditTaskProps = () => renderer.root.findByType('mock-edit-task').props;
    const getEditTodoProps = () => renderer.root.findByType('mock-edit-todo').props;
    const task = {
      id: 'task-3',
      name: 'Stretch',
      notes: '',
      day: 'Someday',
    };

    ReactTestRenderer.act(() => {
      getTodoProps().showModal(task);
    });

    ReactTestRenderer.act(() => {
      getEditTaskProps().openEditModal();
      getEditTodoProps().onShowDeleteDialog();
    });

    expect(getEditTodoProps().visibleDialog).toBe(true);

    let firstDeleteRequest;

    await ReactTestRenderer.act(async () => {
      firstDeleteRequest = getEditTodoProps().onDeleteTodo();
    });

    expect(props.onDeleteCalendarTodoTask).toHaveBeenCalledTimes(1);
    expect(getEditTodoProps().saveDisabled).toBe(true);

    await ReactTestRenderer.act(async () => {
      const secondDeleteRequest = getEditTodoProps().onDeleteTodo();

      deleteDeferred.resolve(true);
      await firstDeleteRequest;
      await secondDeleteRequest;
    });
  });

  test('blocks stale edit and delete attempts without a selected todo identity', async () => {
    const props = createProps({
      onEditCalendarTodoTask: jest.fn().mockResolvedValue(true),
      onDeleteCalendarTodoTask: jest.fn().mockResolvedValue(true),
    });
    const renderer = await renderInAct(<CalendarPage {...props} />);
    const getTodoProps = () => renderer.root.findByType('mock-calendar-todo').props;
    const getEditTaskProps = () => renderer.root.findByType('mock-edit-task').props;
    const getEditTodoProps = () => renderer.root.findByType('mock-edit-todo').props;

    ReactTestRenderer.act(() => {
      getTodoProps().showModal({
        name: 'Ghost todo',
        notes: '',
        day: 'Someday',
      });
    });

    ReactTestRenderer.act(() => {
      getEditTaskProps().openEditModal();
    });

    await ReactTestRenderer.act(async () => {
      await getEditTodoProps().onUpdateTodo();
      await getEditTodoProps().onDeleteTodo();
    });

    expect(props.onEditCalendarTodoTask).not.toHaveBeenCalled();
    expect(props.onDeleteCalendarTodoTask).not.toHaveBeenCalled();
    expect(getEditTodoProps().formErrorText).toBe(
      'This todo is no longer available. Please reopen it and try again.',
    );
    expect(getEditTodoProps().canDeleteTodo).toBe(false);
  });
});
