import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-redux', () => ({
  connect: () => Component => Component,
}));

jest.mock('../src/redux/actions', () => ({
  editTheme: jest.fn(() => ({ type: 'EDIT_THEME' })),
}));

jest.mock('../src/resources', () => ({
  __esModule: true,
  colors: {
    background: 'background',
    white: 'white',
    secondary: 'secondary',
    tertiary: 'tertiary',
    grey: 'grey',
    black: 'black',
    mainFont: 'mainFont',
    nonEditableOverlays: 'nonEditableOverlays',
    textGrey: 'textGrey',
    qccentError: 'qccentError',
    red: 'red',
    mediumGreen: 'mediumGreen',
  },
  strings: {
    calendar: {
      defaultColor: '#004672',
    },
  },
  timeBlock: {
    data: [],
  },
  wheelPickerItems: {
    hours: [],
    minutesWithDiff15: [],
  },
}));

jest.mock('../src/screens/writing/components/EditWriting', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-edit-writing-screen', props);
});

jest.mock('../src/screens/writing/components/EditEvent', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-edit-event-modal', props);
});

jest.mock('../src/screens/writing/components', () => {
  const ReactLocal = require('react');

  return {
    NewDay: props => ReactLocal.createElement('mock-new-day-screen', props),
  };
});

jest.mock('../src/screens/calendar/components/ColorPicker', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-color-picker', props);
});

jest.mock('../src/components', () => {
  const ReactLocal = require('react');

  return {
    CustomModal: props =>
      ReactLocal.createElement('mock-custom-modal', props, props.content),
    PermissionModal: props =>
      ReactLocal.createElement('mock-permission-modal', props),
    TimePickerModal: props =>
      ReactLocal.createElement('mock-time-picker-modal', props),
  };
});

import EditWritingPage from '../src/screens/writing/pages/editWriting/EditWriting';
import NewDayPage from '../src/screens/writing/pages/newDay/NewDay';

const createDeferred = () => {
  let resolve;
  const promise = new Promise(res => {
    resolve = res;
  });

  return { promise, resolve };
};

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

describe('writing form UX boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('EditWritingPage keeps create/save validation inline and clears stale modal state on reopen', async () => {
    const currentTheme = {
      id: 'theme-1',
      name: 'Writing',
      itinerary: [
        {
          taskName: 'Morning Pages',
          notes: 'Free write',
          taskColor: '#123456',
          fromTime: '1:00 am',
          toTime: '2:00 am',
        },
      ],
    };
    const renderer = await renderInAct(
      <EditWritingPage
        currentTheme={currentTheme}
        onUpdateTheme={jest.fn().mockResolvedValue(true)}
      />,
    );
    const getScreenProps = () =>
      renderer.root.findByType('mock-edit-writing-screen').props;
    const getEventProps = () =>
      renderer.root.findByType('mock-edit-event-modal').props;

    ReactTestRenderer.act(() => {
      getScreenProps().onAddIconPress();
      getScreenProps().showEditEvent();
    });

    await ReactTestRenderer.act(async () => {
      await getEventProps().onAddThemeItinerary();
    });

    expect(getEventProps().taskErrorText).toBe('Enter a task name.');
    expect(getEventProps().formErrorText).toBe('');
    expect(getPermissionModalVisibility(renderer)).toBe(false);

    ReactTestRenderer.act(() => {
      getScreenProps().onItineraryPress(currentTheme.itinerary[0], 0);
      getScreenProps().showEditEvent();
      getEventProps().setTask('   ');
    });

    await ReactTestRenderer.act(async () => {
      await getEventProps().onEditThemeItinerary();
    });

    expect(getEventProps().taskErrorText).toBe('Enter a task name.');
    expect(getEventProps().formErrorText).toBe('');
    expect(getPermissionModalVisibility(renderer)).toBe(false);

    ReactTestRenderer.act(() => {
      getEventProps().hideEditEvent();
      getScreenProps().onAddIconPress();
      getScreenProps().showEditEvent();
    });

    expect(getEventProps().task).toBe('');
    expect(getEventProps().note).toBe('');
    expect(getEventProps().taskErrorText).toBe('');
    expect(getEventProps().formErrorText).toBe('');
  });

  test('EditWritingPage blocks duplicate add dispatches while pending', async () => {
    const saveDeferred = createDeferred();
    const onUpdateTheme = jest.fn().mockImplementation(() => saveDeferred.promise);
    const renderer = await renderInAct(
      <EditWritingPage
        currentTheme={{ id: 'theme-1', name: 'Writing', itinerary: [] }}
        onUpdateTheme={onUpdateTheme}
      />,
    );
    const getScreenProps = () =>
      renderer.root.findByType('mock-edit-writing-screen').props;
    const getEventProps = () =>
      renderer.root.findByType('mock-edit-event-modal').props;

    ReactTestRenderer.act(() => {
      getScreenProps().onAddIconPress();
      getScreenProps().showEditEvent();
      getEventProps().setTask('Draft itinerary');
    });

    await ReactTestRenderer.act(async () => {
      const first = getEventProps().onAddThemeItinerary();
      const second = getEventProps().onAddThemeItinerary();

      expect(onUpdateTheme).toHaveBeenCalledTimes(1);
      saveDeferred.resolve(true);
      await first;
      await second;
    });

    expect(onUpdateTheme).toHaveBeenCalledWith('theme-1', {
      itinerary: [
        {
          taskName: 'Draft itinerary',
          notes: '',
          taskColor: '#004672',
          toTime: expect.any(String),
          fromTime: expect.any(String),
        },
      ],
    });
  });

  test('NewDayPage keeps validation inline and resets stale modal state on reopen', async () => {
    const theme = {
      id: 'theme-1',
      name: 'Writing',
      itinerary: [
        {
          taskName: 'Outline',
          notes: 'Keep it light',
          taskColor: '#654321',
          fromTime: '3:00 am',
          toTime: '4:00 am',
        },
      ],
    };
    const renderer = await renderInAct(
      <NewDayPage theme={theme} onUpdateTheme={jest.fn().mockResolvedValue(true)} />,
    );
    const getProps = () => renderer.root.findByType('mock-new-day-screen').props;

    ReactTestRenderer.act(() => {
      getProps().onAddIconPress();
      getProps().setvisibilityEditEvent(true);
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onAddThemeItinerary();
    });

    expect(getProps().taskErrorText).toBe('Enter a task name.');
    expect(getProps().formErrorText).toBe('');
    expect(getProps().permissionModal).toBe(false);

    ReactTestRenderer.act(() => {
      getProps().onItineraryPress(theme.itinerary[0], 0);
      getProps().setvisibilityEditEvent(true);
      getProps().setTask('   ');
    });

    await ReactTestRenderer.act(async () => {
      await getProps().onEditThemeItinerary();
    });

    expect(getProps().taskErrorText).toBe('Enter a task name.');
    expect(getProps().formErrorText).toBe('');
    expect(getProps().permissionModal).toBe(false);

    ReactTestRenderer.act(() => {
      getProps().onCloseEditEvent();
      getProps().onAddIconPress();
      getProps().setvisibilityEditEvent(true);
    });

    expect(getProps().task).toBe('');
    expect(getProps().note).toBe('');
    expect(getProps().taskErrorText).toBe('');
    expect(getProps().formErrorText).toBe('');
  });

  test('NewDayPage blocks duplicate delete confirmations while pending', async () => {
    const deleteDeferred = createDeferred();
    const onUpdateTheme = jest.fn().mockImplementation(() => deleteDeferred.promise);
    const theme = {
      id: 'theme-1',
      name: 'Writing',
      itinerary: [
        {
          taskName: 'Outline',
          notes: 'Keep it light',
          taskColor: '#654321',
          fromTime: '3:00 am',
          toTime: '4:00 am',
        },
      ],
    };
    const renderer = await renderInAct(
      <NewDayPage theme={theme} onUpdateTheme={onUpdateTheme} />,
    );
    const getProps = () => renderer.root.findByType('mock-new-day-screen').props;

    ReactTestRenderer.act(() => {
      getProps().onItineraryPress(theme.itinerary[0], 0);
      getProps().setvisibilityEditEvent(true);
    });

    ReactTestRenderer.act(() => {
      getProps().onDeletePress();
    });

    expect(getProps().permissionModal).toBe(true);

    await ReactTestRenderer.act(async () => {
      const first = getProps().onDonePermissionModal();
      const second = getProps().onDonePermissionModal();

      expect(onUpdateTheme).toHaveBeenCalledTimes(1);
      deleteDeferred.resolve(true);
      await first;
      await second;
    });

    expect(onUpdateTheme).toHaveBeenCalledWith('theme-1', {
      itinerary: [],
    });
  });
});
