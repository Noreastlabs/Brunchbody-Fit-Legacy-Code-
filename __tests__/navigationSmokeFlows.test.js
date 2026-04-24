import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import {
  AUTH_TAB_ROUTES,
  CALENDAR_ROUTES,
  JOURNAL_ROUTES,
  NUTRITION_ROUTES,
  RECREATION_ROUTES,
  ROOT_ROUTES,
  SETTINGS_ROUTES,
} from '../src/navigation/routeNames';

const mockDispatch = jest.fn();
const mockUseNavigation = jest.fn();
const mockTodayKey = {
  today: '2024/01/01',
  date: 1,
  month: 1,
  year: 2024,
  todoListDate: '2024/01/01',
  setDate: jest.fn(),
  setMonth: jest.fn(),
  setYear: jest.fn(),
  setTodoListDate: jest.fn(),
  resetToToday: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockUseNavigation(),
}));

jest.mock('react-redux', () => ({
  connect: () => Component => Component,
  useDispatch: () => mockDispatch,
}));

jest.mock('react-native-vector-icons/AntDesign', () => 'AntDesign');
jest.mock('react-native-vector-icons/Feather', () => 'Feather');
jest.mock('react-native-vector-icons/FontAwesome5', () => 'FontAwesome5');
jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'MaterialCommunityIcons',
);
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('react-native-paper', () => {
  const ReactLocal = require('react');

  return {
    Headline: props =>
      ReactLocal.createElement('mock-paper-headline', props, props.children),
    IconButton: props =>
      ReactLocal.createElement('mock-paper-icon-button', props),
  };
});

jest.mock('../src/context/DateProvider', () => ({
  useTodayKey: () => mockTodayKey,
}));

jest.mock('../src/redux/actions', () => ({
  addRepeatedTheme: jest.fn(() => ({ type: 'ADD_REPEATED_THEME' })),
  addTheme: jest.fn(() => ({ type: 'ADD_THEME' })),
  addCalendarTodoTask: jest.fn(() => ({ type: 'ADD_CALENDAR_TODO_TASK' })),
  addTodo: jest.fn(() => ({ type: 'ADD_TODO' })),
  addJournalEntry: jest.fn(() => ({ type: 'ADD_JOURNAL_ENTRY' })),
  addMealItems: jest.fn(() => ({ type: 'ADD_MEAL_ITEMS' })),
  changeRepeatedTheme: jest.fn(() => ({ type: 'CHANGE_REPEATED_THEME' })),
  clearCurrentTheme: jest.fn(() => ({ type: 'CLEAR_CURRENT_THEME' })),
  clearThemeDays: jest.fn(() => ({ type: 'CLEAR_THEME_DAYS' })),
  deleteCalendarTodoTask: jest.fn(() => ({
    type: 'DELETE_CALENDAR_TODO_TASK',
  })),
  deleteTheme: jest.fn(() => ({ type: 'DELETE_THEME' })),
  deleteTodo: jest.fn(() => ({ type: 'DELETE_TODO' })),
  deleteMealItem: jest.fn(() => ({ type: 'DELETE_MEAL_ITEM' })),
  editCalendarTodoTask: jest.fn(() => ({ type: 'EDIT_CALENDAR_TODO_TASK' })),
  editRepeatedTheme: jest.fn(() => ({ type: 'EDIT_REPEATED_THEME' })),
  editTodo: jest.fn(() => ({ type: 'EDIT_TODO' })),
  editJournalEntry: jest.fn(() => ({ type: 'EDIT_JOURNAL_ENTRY' })),
  editMealItem: jest.fn(() => ({ type: 'EDIT_MEAL_ITEM' })),
  getCalendarTodoTasks: jest.fn(() => ({ type: 'GET_CALENDAR_TODO_TASKS' })),
  getRepeatedThemes: jest.fn(() => ({ type: 'GET_REPEATED_THEMES' })),
  getThemes: jest.fn(() => ({ type: 'GET_THEMES' })),
  getTodo: jest.fn(() => ({ type: 'GET_TODO' })),
  getJournalEntries: jest.fn(() => ({ type: 'GET_JOURNAL_ENTRIES' })),
  getRoutineTasks: jest.fn(() => ({ type: 'GET_ROUTINE_TASKS' })),
  profile: jest.fn(() => ({ type: 'PROFILE' })),
  setTheme: jest.fn(data => ({ type: 'SET_THEME', payload: data })),
  updateThemesWithFrequency: jest.fn(() => ({
    type: 'UPDATE_THEMES_WITH_FREQUENCY',
  })),
}));

jest.mock('../src/resources', () => ({
  __esModule: true,
  colors: {
    white: 'white',
    grey: 'grey',
    background: 'background',
    nonEditableOverlays: 'nonEditableOverlays',
    secondary: 'secondary',
    tertiary: 'tertiary',
    darkBlue2: 'darkBlue2',
    red: 'red',
    blue: 'blue',
    yellow: 'yellow',
    greenish: 'greenish',
    black: 'black',
  },
  images: {
    arrow: 'arrow-image',
    tutorialImages: ['tutorial-1', 'tutorial-2'],
  },
  strings: {
    calendar: {
      defaultColor: '#004672',
      theme: 'Theme',
      create: 'Create',
      manage: 'Manage',
      addRemove: 'Add / Remove',
      someday: 'Someday',
      pickday: 'Pick Day',
      todo: 'To Do',
    },
    dailyEntry: {
      content1: 'Feeling rate',
      content2: 'Task',
      content3: 'Traits',
      content4: 'Thoughts',
    },
    todo: {
      today: 'Today',
      someday: 'Someday',
    },
    writingText: {
      today: 'Today',
      day: 'Day',
    },
  },
  timeBlock: {
    data: [],
  },
  wheelPickerItems: {
    frequency: [],
    calendarDays: [],
    weeks: [
      { id: 1, value: '1' },
      { id: 2, value: '2' },
      { id: 3, value: '3' },
    ],
  },
}));
jest.mock('../src/resources/index', () => ({
  __esModule: true,
  colors: {
    white: 'white',
    grey: 'grey',
    background: 'background',
    nonEditableOverlays: 'nonEditableOverlays',
    secondary: 'secondary',
    tertiary: 'tertiary',
    darkBlue2: 'darkBlue2',
    red: 'red',
    blue: 'blue',
    yellow: 'yellow',
    greenish: 'greenish',
    black: 'black',
  },
  images: {
    arrow: 'arrow-image',
    tutorialImages: ['tutorial-1', 'tutorial-2'],
  },
  strings: {
    calendar: {
      defaultColor: '#004672',
      theme: 'Theme',
      create: 'Create',
      manage: 'Manage',
      addRemove: 'Add / Remove',
      someday: 'Someday',
      pickday: 'Pick Day',
      todo: 'To Do',
    },
    dailyEntry: {
      content1: 'Feeling rate',
      content2: 'Task',
      content3: 'Traits',
      content4: 'Thoughts',
    },
    todo: {
      today: 'Today',
      someday: 'Someday',
    },
    writingText: {
      today: 'Today',
      day: 'Day',
    },
  },
  timeBlock: {
    data: [],
  },
  wheelPickerItems: {
    frequency: [],
    calendarDays: [],
    weeks: [
      { id: 1, value: '1' },
      { id: 2, value: '2' },
      { id: 3, value: '3' },
    ],
  },
}));
jest.mock('../src/resources/colors', () => ({
  __esModule: true,
  colors: {
    white: 'white',
    grey: 'grey',
    background: 'background',
    nonEditableOverlays: 'nonEditableOverlays',
    secondary: 'secondary',
    tertiary: 'tertiary',
    darkBlue2: 'darkBlue2',
    red: 'red',
    blue: 'blue',
    yellow: 'yellow',
    greenish: 'greenish',
    black: 'black',
  },
}));
jest.mock('../src/resources/images', () => ({
  __esModule: true,
  images: {
    arrow: 'arrow-image',
    tutorialImages: ['tutorial-1', 'tutorial-2'],
  },
}));
jest.mock('../src/resources/strings', () => ({
  __esModule: true,
  strings: {
    calendar: {
      defaultColor: '#004672',
      theme: 'Theme',
      create: 'Create',
      manage: 'Manage',
      addRemove: 'Add / Remove',
      someday: 'Someday',
      pickday: 'Pick Day',
      todo: 'To Do',
    },
    dailyEntry: {
      content1: 'Feeling rate',
      content2: 'Task',
      content3: 'Traits',
      content4: 'Thoughts',
    },
    todo: {
      today: 'Today',
      someday: 'Someday',
    },
    writingText: {
      today: 'Today',
      day: 'Day',
    },
  },
}));
jest.mock('../src/resources/TimeBlockData', () => ({
  __esModule: true,
  timeBlock: {
    data: [],
  },
}));
jest.mock('../src/resources/WheelPickerItems', () => ({
  __esModule: true,
  wheelPickerItems: {
    frequency: [],
    calendarDays: [],
    weeks: [
      { id: 1, value: '1' },
      { id: 2, value: '2' },
      { id: 3, value: '3' },
    ],
  },
}));

jest.mock('../src/components', () => {
  const ReactLocal = require('react');

  return {
    AddButton: props => ReactLocal.createElement('mock-add-button', props),
    AddRemoveTheme: props =>
      ReactLocal.createElement('mock-add-remove-theme', props),
    Button: props => ReactLocal.createElement('mock-button', props),
    ColorPickerContent: props =>
      ReactLocal.createElement('mock-color-picker-content', props),
    CreateItemContent: props =>
      ReactLocal.createElement('mock-create-item-content', props),
    CreateTraitModal: props =>
      ReactLocal.createElement('mock-create-trait-modal', props),
    CustomHeader: props =>
      ReactLocal.createElement('mock-custom-header', props),
    CustomModal: props =>
      ReactLocal.createElement('mock-custom-modal', props, props.content),
    CustomOptions: props =>
      ReactLocal.createElement('mock-custom-options', props),
    CustomTextArea: props =>
      ReactLocal.createElement('mock-custom-text-area', props),
    Dashed: props => ReactLocal.createElement('mock-dashed', props),
    DatePickerModal: props =>
      ReactLocal.createElement('mock-date-picker-modal', props),
    ModalContent: props => ReactLocal.createElement('mock-modal-content', props),
    PermissionModal: props =>
      ReactLocal.createElement('mock-permission-modal', props),
    SafeAreaWrapper: props =>
      ReactLocal.createElement('mock-safe-area-wrapper', props, props.children),
    SearchBar: props => ReactLocal.createElement('mock-search-bar', props),
    SelectModalContent: props =>
      ReactLocal.createElement('mock-select-modal-content', props),
    TextButton: props => ReactLocal.createElement('mock-text-button', props),
    TimePickerModal: props =>
      ReactLocal.createElement('mock-time-picker-modal', props),
    TopTabs: props => ReactLocal.createElement('mock-top-tabs', props),
    WheelPickerContent: props =>
      ReactLocal.createElement('mock-wheel-picker-content', props),
    NutritionItems: props =>
      ReactLocal.createElement('mock-nutrition-items', props),
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

jest.mock('../src/screens/setting/components', () => {
  const ReactLocal = require('react');

  return {
    MyProfile: props =>
      ReactLocal.createElement('mock-setting-my-profile', props),
    Tutorials: props => ReactLocal.createElement('mock-setting-tutorials', props),
  };
});

jest.mock('../src/screens/nutrition/components', () => {
  const ReactLocal = require('react');

  return {
    Meal: props => ReactLocal.createElement('mock-nutrition-meal', props),
    MealDetail: props =>
      ReactLocal.createElement('mock-nutrition-meal-detail', props),
  };
});

jest.mock('../src/screens/nutrition/components/modals', () => {
  const ReactLocal = require('react');

  return {
    CalculationContent: props =>
      ReactLocal.createElement('mock-calculation-content', props),
  };
});

jest.mock('../src/screens/journal/components', () => {
  const ReactLocal = require('react');

  return {
    DailyEntry: props =>
      ReactLocal.createElement('mock-journal-daily-entry', props),
  };
});

jest.mock('../src/screens/recreation/components', () => {
  const ReactLocal = require('react');

  return {
    Recreation: props =>
      ReactLocal.createElement('mock-recreation-screen', props),
    ProgramManager: props =>
      ReactLocal.createElement('mock-program-manager-screen', props),
    EditRoutine: props =>
      ReactLocal.createElement('mock-edit-routine-screen', props),
    MyExercises: props =>
      ReactLocal.createElement('mock-my-exercises-screen', props),
    EditProgram: props =>
      ReactLocal.createElement('mock-edit-program-screen', props),
  };
});

jest.mock('../src/screens/writing/components/EditEvent', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-edit-event', props);
});

jest.mock('../src/screens/writing/components/Itinerary', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-itinerary', props);
});

jest.mock('../src/screens/writing/components/TimeBlock', () => {
  const ReactLocal = require('react');

  return props => ReactLocal.createElement('mock-time-block', props);
});

jest.mock('../src/screens/calendar/components/style', () => ({}));
jest.mock('../src/screens/writing/components/style', () => ({}));
jest.mock('../src/screens/nutrition/components/style', () => ({}));
jest.mock('../src/screens/recreation/components/style', () => ({}));
jest.mock('../src/screens/setting/components/My Profile/style', () => ({}));

import TutorialsPage from '../src/screens/setting/pages/Tutorials/Tutorials';
import DailyEntryPage from '../src/screens/journal/pages/DailyEntry/DailyEntry';
import MealPage from '../src/screens/nutrition/pages/Meal/Meal';
import MyProfilePage from '../src/screens/setting/pages/MyProfile/MyProfile';
import MealDirectory from '../src/screens/nutrition/components/MealDirectory';
import MealDetailPage from '../src/screens/nutrition/pages/MealDetail/MealDetail';
import MealsList from '../src/screens/nutrition/components/MealsList';
import RecreationPage from '../src/screens/recreation/pages/Recreation/Recreation';
import ProgramManagerPage from '../src/screens/recreation/pages/ProgramManager/ProgramManager';
import RoutineManager from '../src/screens/recreation/components/RoutineManager';
import EditRoutine from '../src/screens/recreation/components/EditRoutine';
import NewDay from '../src/screens/writing/components/NewDay';

const ActualCalendarWriting =
  jest.requireActual('../src/screens/calendar/components/Writing').default;
const ActualJournal =
  jest.requireActual('../src/screens/journal/components/Journal').default;
const ActualNutrition =
  jest.requireActual('../src/screens/nutrition/components/Nutrition').default;

const renderTree = element => {
  let renderer;

  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(element);
  });

  return renderer;
};

const createNutritionSurfaceProps = props => ({
  tab: 2,
  onChangeHandler: jest.fn(),
  myMeals: [{ id: 7, name: 'Lunch', items: [] }],
  supplements: [{ id: 8, name: 'Morning Stack', items: [] }],
  onNavigate: jest.fn(),
  mealModalVisible: false,
  openMealModal: jest.fn(),
  closeMealModal: jest.fn(),
  meal: { id: 7, name: 'Lunch' },
  toggleCalModal: jest.fn(),
  calculationModalVisible: false,
  openSupplementModal: jest.fn(),
  closeSupplementModal: jest.fn(),
  supplementModal: false,
  supplement: { id: 8, name: 'Morning Stack' },
  supplementItems: [],
  permissionModal: false,
  createItemModal: false,
  modalHeading: '',
  createItemFields: [],
  onAddBtnPress: jest.fn(),
  colorPickerModal: false,
  color: 'darkBlue2',
  onCreateItem: jest.fn(),
  createItemPending: false,
  createItemErrorText: '',
  alertHeading: '',
  alertText: '',
  onDonePermissionModal: jest.fn(),
  closePermissionModal: jest.fn(),
  loader: false,
  mealItems: [],
  onChangeTitle: jest.fn(),
  deleteLoader: false,
  closeCreateItemModal: jest.fn(),
  onCreateTargetCalories: jest.fn(),
  ...props,
});

const createRecreationPageProps = props => ({
  navigation: mockUseNavigation(),
  myCustomPlans: [],
  myWorkouts: [],
  myRoutines: [],
  brunchBodyPlans: [],
  myWeekPlan: {},
  user: { completedWorkouts: {}, deletedWorkouts: {} },
  allExercises: [],
  completedWorkouts: [],
  onAddRoutine: jest.fn().mockResolvedValue(true),
  getUserRoutines: jest.fn().mockResolvedValue(true),
  onDeleteRoutine: jest.fn().mockResolvedValue(true),
  getUserCustomPlans: jest.fn().mockResolvedValue(true),
  onAddCustomPlan: jest.fn().mockResolvedValue(true),
  onDeleteCustomPlan: jest.fn().mockResolvedValue(true),
  onGetExercises: jest.fn().mockResolvedValue(true),
  onGetBrunchBodyPlans: jest.fn().mockResolvedValue(true),
  onAddMyWorkout: jest.fn().mockResolvedValue(true),
  onGetMyWorkouts: jest.fn().mockResolvedValue(true),
  onDeleteWorkout: jest.fn().mockResolvedValue(true),
  onEditMyWorkout: jest.fn().mockResolvedValue(true),
  onGetWeekPlan: jest.fn().mockResolvedValue(true),
  getAllExerciseDirectory: jest.fn().mockResolvedValue(true),
  onMergeExercises: jest.fn().mockResolvedValue(true),
  onGetBrunchBodyWeekPlan: jest.fn().mockResolvedValue({}),
  updateUserProfile: jest.fn().mockResolvedValue(true),
  onCompleteWorkout: jest.fn().mockResolvedValue(true),
  ...props,
});

describe('Navigation smoke representative flows', () => {
  let mockNavigation;
  let consoleLogSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
      pop: jest.fn(),
    };
    mockUseNavigation.mockReturnValue(mockNavigation);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    consoleLogSpy.mockRestore();
  });

  beforeAll(() => {
    if (typeof window !== 'undefined' && !window.dispatchEvent) {
      window.dispatchEvent = jest.fn();
    }
  });

  test('Tutorials exits back into Home and Dashboard when the last image is advanced', async () => {
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<TutorialsPage />);
    });

    await ReactTestRenderer.act(async () => {
      renderer.root.findByType('mock-setting-tutorials').props.onNextPress();
    });

    await ReactTestRenderer.act(async () => {
      renderer.root.findByType('mock-setting-tutorials').props.onNextPress();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith(ROOT_ROUTES.HOME, {
      screen: AUTH_TAB_ROUTES.DASHBOARD,
    });
  });

  test('Tutorials backs out of the root-owned exception when already on the first image', async () => {
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<TutorialsPage />);
    });

    await ReactTestRenderer.act(async () => {
      renderer.root.findByType('mock-setting-tutorials').props.onBackPress();
    });

    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  test('NewDay still relies on the default header back behavior', () => {
    const renderer = renderTree(
      <NewDay
        timeData={[]}
        newColor="#004672"
        setnewColor={jest.fn()}
        modalHeading=""
        btnTitle=""
        visibilityEditEvent={false}
        setvisibilityEditEvent={jest.fn()}
        visibleColorPicker={false}
        setvisibleColorPicker={jest.fn()}
        setIsTimePickerModal={jest.fn()}
        theme={{ name: 'Theme A', itinerary: [] }}
        onAddThemeItinerary={jest.fn()}
        onEditThemeItinerary={jest.fn()}
        onDonePermissionModal={jest.fn()}
        fromTimePickerModal={false}
        setFromTimePickerModal={jest.fn()}
        toTimePickerModal={false}
        setToTimePickerModal={jest.fn()}
        permissionModal={false}
        setPermissionModal={jest.fn()}
        alertText=""
        alertHeading=""
        btnLoader={false}
        deleteLoader={false}
        isDeleteBtn={false}
        toHours="1"
        toMinutes="00"
        setToHours={jest.fn()}
        setToMinutes={jest.fn()}
        toTimeFormat="AM"
        setToTimeFormat={jest.fn()}
        fromHours="1"
        fromMinutes="00"
        setFromHours={jest.fn()}
        setFromMinutes={jest.fn()}
        fromTimeFormat="AM"
        setFromTimeFormat={jest.fn()}
        note=""
        setNote={jest.fn()}
        task=""
        setTask={jest.fn()}
        setCheck={jest.fn()}
        setEditTask={jest.fn()}
        onCancelPermissionModal={jest.fn()}
      />,
    );

    expect(renderer.root.findByType('mock-custom-header').props.onPress).toBe(
      undefined,
    );
  });

  test('Calendar writing chip still opens the current writing route', () => {
    const renderer = renderTree(
      <ActualCalendarWriting
        navigation={mockNavigation}
        currentTheme={{ name: 'Theme A', color: '#004672' }}
        showCalendarMenu={jest.fn()}
      />,
    );

    renderer.root
      .findAll(
        node =>
          typeof node.props.onPress === 'function' &&
          node.props.activeOpacity === 0.4,
      )[0]
      .props.onPress();

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      CALENDAR_ROUTES.WRITING,
    );
  });

  test('Journal Daily Entry selection still hands off to the DailyEntry route', () => {
    const dailyEntryItem = {
      id: 1,
      title: 'DailyEntry',
      heading: 'Daily Entry',
      screen: JOURNAL_ROUTES.DAILY_ENTRY,
      isEmpty: true,
    };
    const setPageDetail = jest.fn();
    const pageDetail = { ...dailyEntryItem, date: '2024/1/1' };
    const baseProps = {
      navigation: mockNavigation,
      loader: false,
      listData: [dailyEntryItem],
      isVisible: false,
      setIsVisible: jest.fn(),
      pageDetail: {},
      setPageDetail,
      permissionModal: false,
      setPermissionModal: jest.fn(),
      datePickerModal: false,
      setDatePickerModal: jest.fn(),
      date: 1,
      month: 1,
      year: 2024,
      isDateSelected: true,
      incrementDate: jest.fn(),
      decrementDate: jest.fn(),
      journalEntries: {},
      onDeleteJournalEntry: jest.fn(),
      onConfirmDatePicker: jest.fn(),
      onCancelDatePicker: jest.fn(),
      entryId: 'entry-1',
    };

    const renderer = renderTree(<ActualJournal {...baseProps} />);

    renderer.root
      .findAll(
        node =>
          typeof node.props.onPress === 'function' &&
          node.props.activeOpacity === 0.5,
      )
      .find(
        node =>
          node.findAll(child => child.props.children === '--EMPTY--').length > 0,
      )
      .props.onPress();

    expect(setPageDetail).toHaveBeenCalledWith(pageDetail);

    ReactTestRenderer.act(() => {
      renderer.update(
        <ActualJournal
          {...baseProps}
          isVisible
          pageDetail={pageDetail}
        />,
      );
    });

    renderer.root.findByType('mock-modal-content').props.onBtnPress();

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      JOURNAL_ROUTES.DAILY_ENTRY,
      {
        entryData: pageDetail,
        entryId: 'entry-1',
      },
    );
  });

  test('DailyEntry still goes back after a successful save completes', async () => {
    const props = {
      navigation: mockNavigation,
      route: {
        params: {
          entryData: {
            date: '2024/01/01',
            traits: [{ id: 1, title: 'Alert' }],
            feelingRate: 1,
            task: '',
            thought: '',
          },
        },
      },
      onCreateEntry: jest.fn().mockResolvedValue(true),
      getAllJournalEntries: jest.fn().mockResolvedValue(undefined),
      onEditEntry: jest.fn().mockResolvedValue(true),
    };
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<DailyEntryPage {...props} />);
    });

    await ReactTestRenderer.act(async () => {
      await renderer.root.findByType('mock-journal-daily-entry').props.onSaveHandler();
    });

    await ReactTestRenderer.act(async () => {
      renderer.root
        .findByType('mock-journal-daily-entry')
        .props.onDonePermissionModal();
    });

    ReactTestRenderer.act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(props.onCreateEntry).toHaveBeenCalled();
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  test('Nutrition surface still hands an opened meal off to the Meal route', () => {
    const meal = { id: 7, name: 'Lunch', items: [] };
    const closeMealModal = jest.fn();
    const renderer = renderTree(
      <ActualNutrition
        {...createNutritionSurfaceProps({
          meal,
          mealModalVisible: true,
          closeMealModal,
          mealItems: meal.items,
        })}
      />,
    );

    renderer.root
      .findAllByType('mock-nutrition-items')
      .find(node => node.props.text === meal.name)
      .props.onBtnPress();

    expect(closeMealModal).toHaveBeenCalledTimes(1);
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      NUTRITION_ROUTES.MEAL,
      { meal },
    );
  });

  test('Nutrition surface still hands an opened supplement off to the Supplement route', () => {
    const supplement = { id: 8, name: 'Morning Stack', items: [] };
    const closeSupplementModal = jest.fn();
    const renderer = renderTree(
      <ActualNutrition
        {...createNutritionSurfaceProps({
          tab: 3,
          supplement,
          supplementModal: true,
          closeSupplementModal,
          supplementItems: supplement.items,
        })}
      />,
    );

    renderer.root
      .findAllByType('mock-nutrition-items')
      .find(node => node.props.text === supplement.name)
      .props.onBtnPress();

    expect(closeSupplementModal).toHaveBeenCalledTimes(1);
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      NUTRITION_ROUTES.SUPPLEMENT,
      { supplement },
    );
  });

  test('MealPage still forwards from Meal into MealsList when choosing the directory path', async () => {
    const props = {
      navigation: mockNavigation,
      route: {
        params: {
          meal: { id: 7, name: 'Lunch' },
        },
      },
      onAddMealItems: jest.fn().mockResolvedValue(undefined),
      onDeleteMealItem: jest.fn().mockResolvedValue(undefined),
      onEditMealItem: jest.fn().mockResolvedValue(undefined),
    };
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<MealPage {...props} />);
    });

    await ReactTestRenderer.act(async () => {
      renderer.root.findByType('mock-nutrition-meal').props.onChooseOption();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      NUTRITION_ROUTES.MEALS_LIST,
      {
        targetMealId: 7,
      },
    );
  });

  test('MealsList still forwards the target meal into MealDirectory', () => {
    const renderer = renderTree(
      <MealsList
        route={{ params: { targetMealId: 7 } }}
        search=""
        setSearch={jest.fn()}
        mealCategories={[{ id: 1, category: 'Protein' }]}
      />,
    );

    renderer.root
      .findAll(
        node =>
          typeof node.props.onPress === 'function' &&
          node.props.activeOpacity === 0.5,
      )[0]
      .props.onPress();

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      NUTRITION_ROUTES.MEAL_DIRECTORY,
      {
        type: 'Protein',
        targetMealId: 7,
      },
    );
  });

  test('MealsList still relies on the default header back behavior', () => {
    const renderer = renderTree(
      <MealsList
        route={{ params: { targetMealId: 7 } }}
        search=""
        setSearch={jest.fn()}
        mealCategories={[{ id: 1, category: 'Protein' }]}
      />,
    );

    expect(renderer.root.findByType('mock-custom-header').props.onPress).toBe(
      undefined,
    );
  });

  test('MealDirectory still forwards the target meal into MealDetail', () => {
    const directoryItem = {
      id: 1,
      name: 'Chicken Breast',
      type: 'Protein',
    };
    const renderer = renderTree(
      <MealDirectory
        route={{ params: { type: 'Protein', targetMealId: 7 } }}
        directoryList={[directoryItem]}
        search=""
        setSearch={jest.fn()}
      />,
    );

    renderer.root
      .findAll(
        node =>
          typeof node.props.onPress === 'function' &&
          node.props.activeOpacity === 0.5,
      )[0]
      .props.onPress();

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      NUTRITION_ROUTES.MEAL_DETAIL,
      {
        meal: directoryItem,
        targetMealId: 7,
      },
    );
  });

  test('MealDetailPage still adds to the target meal without AsyncStorage handoff', async () => {
    const props = {
      navigation: mockNavigation,
      route: {
        params: {
          meal: {
            name: 'Chicken Breast',
            fat: 1,
            prt: 2,
            cho: 3,
            cal: 21,
          },
          targetMealId: 'meal-7',
        },
      },
      onAddMealItems: jest.fn().mockResolvedValue(true),
    };
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<MealDetailPage {...props} />);
    });

    await ReactTestRenderer.act(async () => {
      await renderer.root
        .findByType('mock-nutrition-meal-detail')
        .props.onAddMeal();
    });

    expect(props.onAddMealItems).toHaveBeenCalledWith('meal-7', {
      name: 'Chicken Breast',
      fat: '1',
      prt: '2',
      cho: '3',
      cal: '21',
    });
  });

  test('RecreationPage still routes the default program menu handoff to MyExercises', async () => {
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <RecreationPage {...createRecreationPageProps()} />,
      );
    });

    await ReactTestRenderer.act(async () => {
      renderer.root
        .findByType('mock-recreation-screen')
        .props.onProgramMenuSelect();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      RECREATION_ROUTES.MY_EXERCISES,
    );
  });

  test('ProgramManagerPage still forwards custom program days into EditProgram', async () => {
    const selectedItem = {
      id: 'program-1',
      name: 'Strength Plan',
      numOfWeeks: 3,
    };
    const dayPlan = { day: 2, plan: [] };
    const props = {
      navigation: mockNavigation,
      route: {
        params: {
          selectedItem,
          program: 'Custom Program',
        },
      },
      myWeekPlan: {
        id: 'week-plan-1',
        weekDays: [dayPlan],
      },
      onGetWeekPlan: jest.fn().mockResolvedValue(true),
      onEditWeekPlan: jest.fn().mockResolvedValue(true),
      onGetBrunchBodyWeekPlan: jest.fn().mockResolvedValue(true),
    };
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<ProgramManagerPage {...props} />);
    });

    await ReactTestRenderer.act(async () => {
      renderer.root
        .findByType('mock-program-manager-screen')
        .props.onWeekDayPress(dayPlan);
    });

    await ReactTestRenderer.act(async () => {
      renderer.root
        .findByType('mock-program-manager-screen')
        .props.onModalBtnPress();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      RECREATION_ROUTES.EDIT_PROGRAM,
      {
        selectedProgram: selectedItem,
        selectedDay: {
          ...dayPlan,
          type: 'Create',
          week: '1',
        },
      },
    );
  });

  test('RoutineManager still forwards from RoutineManager into EditRoutine through the edit action', () => {
    const renderer = renderTree(
      <RoutineManager
        route={{ params: { selectedItem: { id: 11, name: 'Morning Routine' } } }}
        myRoutineTasks={[]}
        loader={false}
      />,
    );

    renderer.root.findByType('mock-custom-header').props.onEditPress();

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      RECREATION_ROUTES.EDIT_ROUTINE,
      {
        selectedItem: { id: 11, name: 'Morning Routine' },
      },
    );
  });

  test('EditRoutine still relies on the default header back behavior', () => {
    const renderer = renderTree(
      <EditRoutine
        route={{ params: { selectedItem: { id: 11, name: 'Morning Routine' } } }}
        myRoutineTasks={[]}
        isVisible={false}
        setIsVisible={jest.fn()}
        heading=""
        createItemModal={false}
        setCreateItemModal={jest.fn()}
        createTaskFields={[{ id: 1, value: '' }]}
        editTaskModal={false}
        setEditTaskModal={jest.fn()}
        permissionModal={false}
        setPermissionModal={jest.fn()}
        onRoutineTaskHandler={jest.fn()}
        itemName=""
        setItemName={jest.fn()}
        onCreateItem={jest.fn()}
        onDonePermissionModal={jest.fn()}
        alertHeading=""
        alertText=""
        setCheck={jest.fn()}
        onEditItem={jest.fn()}
      />,
    );

    expect(renderer.root.findByType('mock-custom-header').props.onPress).toBe(
      undefined,
    );
  });

  test('MyProfilePage now routes its primary profile action to MyVitals', async () => {
    let renderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <MyProfilePage
          navigation={mockNavigation}
          user={{ bmi: 20, bmr: 1800, targetCalories: [] }}
        />,
      );
    });

    const profileItem = renderer.root
      .findByType('mock-setting-my-profile')
      .props.listData.find(item => item.title === 'Profile');

    expect(profileItem.options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ screen: SETTINGS_ROUTES.MY_VITALS }),
      ]),
    );
  });
});
