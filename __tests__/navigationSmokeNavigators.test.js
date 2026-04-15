import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

const mockDateProvider = ({ children }) =>
  React.createElement('mock-date-provider', null, children);
const mockCompleteProfileWrapper = () => null;
const mockTutorialsWrapper = () => null;
const mockDashboardWrapper = () => null;
const mockCalendarWrapper = () => null;
const mockWritingWrapper = () => null;
const mockEditWritingWrapper = () => null;
const mockNewDayWrapper = () => null;
const mockJournalWrapper = () => null;
const mockWeightLogWrapper = () => null;
const mockQuarterlyEntryWrapper = () => null;
const mockDailyEntryWrapper = () => null;
const mockWeeklyEntryWrapper = () => null;
const mockSupplementLogWrapper = () => null;
const mockCaloriesWrapper = () => null;
const mockTraitDirectoryWrapper = () => null;
const mockNutritionWrapper = () => null;
const mockSupplementWrapper = () => null;
const mockMealWrapper = () => null;
const mockMealsListWrapper = () => null;
const mockMealDirectoryWrapper = () => null;
const mockMealDetailWrapper = () => null;
const mockRecreationWrapper = () => null;
const mockRoutineManagerWrapper = () => null;
const mockProgramManagerWrapper = () => null;
const mockEditProgramWrapper = () => null;
const mockEditRoutineWrapper = () => null;
const mockMyExercisesWrapper = () => null;
const mockSettingWrapper = () => null;
const mockMyProfileWrapper = () => null;
const mockMyVitalsWrapper = () => null;
const mockMyAccountWrapper = () => null;
const mockMyEmailWrapper = () => null;
const mockMyPasswordWrapper = () => null;
const mockDeleteAccountWrapper = () => null;
const mockExportToCSVWrapper = () => null;
const mockTermsOfUseWrapper = () => null;
const mockPrivacyPolicyWrapper = () => null;
const mockAbbrevationsWrapper = () => null;
const mockBottomTabNavigation = () => null;

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => {
    const ReactLocal = require('react');

    return ReactLocal.createElement(
      'mock-navigation-container',
      null,
      children,
    );
  },
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children, ...props }) => {
      const ReactLocal = require('react');

      return ReactLocal.createElement('mock-stack-navigator', props, children);
    },
    Screen: props => {
      const ReactLocal = require('react');

      return ReactLocal.createElement('mock-stack-screen', props);
    },
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children, ...props }) => {
      const ReactLocal = require('react');

      return ReactLocal.createElement('mock-tab-navigator', props, children);
    },
    Screen: props => {
      const ReactLocal = require('react');

      return ReactLocal.createElement('mock-tab-screen', props);
    },
  }),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'MaterialCommunityIcons',
);

jest.mock('../src/context/DateProvider', () => ({
  DateProvider: mockDateProvider,
}));

jest.mock('../src/resources', () => ({
  __esModule: true,
  colors: {
    lightGreen: '#00ff99',
    background: '#001122',
  },
}));

jest.mock(
  '../src/screens/completeProfile/pages/completeProfile/CompleteProfile',
  () => ({
    CompleteProfileWrapper: mockCompleteProfileWrapper,
  }),
);

jest.mock('../src/navigation/BottomTabNavigation', () => ({
  __esModule: true,
  default: mockBottomTabNavigation,
}));

jest.mock('../src/screens/dashboard', () => ({
  __esModule: true,
  DashboardWrapper: mockDashboardWrapper,
}));

jest.mock('../src/screens/calendar', () => ({
  __esModule: true,
  CalendarWrapper: mockCalendarWrapper,
  WritingWrapper: mockWritingWrapper,
  EditWritingWrapper: mockEditWritingWrapper,
  NewDayWrapper: mockNewDayWrapper,
}));

jest.mock('../src/screens/journal', () => ({
  __esModule: true,
  JournalWrapper: mockJournalWrapper,
  WeightLogWrapper: mockWeightLogWrapper,
  QuarterlyEntryWrapper: mockQuarterlyEntryWrapper,
  DailyEntryWrapper: mockDailyEntryWrapper,
  WeeklyEntryWrapper: mockWeeklyEntryWrapper,
  SupplementLogWrapper: mockSupplementLogWrapper,
  CaloriesWrapper: mockCaloriesWrapper,
  TraitDirectoryWrapper: mockTraitDirectoryWrapper,
}));

jest.mock('../src/screens/nutrition', () => ({
  __esModule: true,
  NutritionWrapper: mockNutritionWrapper,
  SupplementWrapper: mockSupplementWrapper,
  MealWrapper: mockMealWrapper,
  MealsListWrapper: mockMealsListWrapper,
  MealDirectoryWrapper: mockMealDirectoryWrapper,
  MealDetailWrapper: mockMealDetailWrapper,
}));

jest.mock('../src/screens/recreation', () => ({
  __esModule: true,
  RecreationWrapper: mockRecreationWrapper,
  RoutineManagerWrapper: mockRoutineManagerWrapper,
  ProgramManagerWrapper: mockProgramManagerWrapper,
  EditProgramWrapper: mockEditProgramWrapper,
  EditRoutineWrapper: mockEditRoutineWrapper,
  MyExercisesWrapper: mockMyExercisesWrapper,
}));

jest.mock('../src/screens/setting', () => ({
  __esModule: true,
  SettingWrapper: mockSettingWrapper,
  MyProfileWrapper: mockMyProfileWrapper,
  MyVitalsWrapper: mockMyVitalsWrapper,
  MyAccountWrapper: mockMyAccountWrapper,
  MyEmailWrapper: mockMyEmailWrapper,
  MyPasswordWrapper: mockMyPasswordWrapper,
  DeleteAccountWrapper: mockDeleteAccountWrapper,
  ExportToCSVWrapper: mockExportToCSVWrapper,
  TermsOfUseWrapper: mockTermsOfUseWrapper,
  PrivacyPolicyWrapper: mockPrivacyPolicyWrapper,
  AbbrevationsWrapper: mockAbbrevationsWrapper,
  TutorialsWrapper: mockTutorialsWrapper,
}));

const RootNavigation = require('../src/navigation/RootNavigation').default;
const BottomTabNavigation =
  jest.requireActual('../src/navigation/BottomTabNavigation').default;
const CalendarNavigation = require('../src/navigation/CalendarNavigation').default;
const JournalNavigation = require('../src/navigation/JournalNavigation').default;
const NutritionNavigation =
  require('../src/navigation/NutritionNavigation').default;
const RecreationNavigation =
  require('../src/navigation/RecreationNavigation').default;
const SettingsNavigation = require('../src/navigation/SettingsNavigation').default;

const renderTree = element => {
  let renderer;

  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(element);
  });

  return renderer;
};

const getScreenNames = (renderer, type) =>
  renderer.root.findAllByType(type).map(screen => screen.props.name);

describe('Navigation smoke navigator contracts', () => {
  beforeAll(() => {
    if (typeof window !== 'undefined' && !window.dispatchEvent) {
      window.dispatchEvent = jest.fn();
    }
  });

  test('RootNavigation returns null until the initial route is resolved', () => {
    const renderer = renderTree(<RootNavigation />);

    expect(renderer.toJSON()).toBeNull();
  });

  test('RootNavigation keeps Home as the authenticated shell entry', () => {
    const renderer = renderTree(<RootNavigation initialRouteName="Home" />);
    const stackNavigator = renderer.root.findByType('mock-stack-navigator');
    const stackScreens = renderer.root.findAllByType('mock-stack-screen');
    const homeScreen = stackScreens.find(screen => screen.props.name === 'Home');
    const routeToComponent = Object.fromEntries(
      stackScreens.map(screen => [screen.props.name, screen.props.component]),
    );

    expect(stackNavigator.props.initialRouteName).toBe('Home');
    expect(getScreenNames(renderer, 'mock-stack-screen')).toEqual([
      'CompleteProfile',
      'Home',
      'Tutorials',
    ]);
    expect(homeScreen.props.component).toBe(mockBottomTabNavigation);
    expect(routeToComponent.Tutorials).toBe(mockTutorialsWrapper);
  });

  test('BottomTabNavigation keeps the six authenticated tab destinations', () => {
    const renderer = renderTree(<BottomTabNavigation />);
    const tabNavigator = renderer.root.findByType('mock-tab-navigator');
    const tabScreens = renderer.root.findAllByType('mock-tab-screen');
    const dashboardScreen = tabScreens.find(
      screen => screen.props.name === 'Dashboard',
    );
    const routeToComponent = Object.fromEntries(
      tabScreens.map(screen => [screen.props.name, screen.props.component]),
    );

    expect(tabNavigator.props.initialRouteName).toBe('Calendar');
    expect(getScreenNames(renderer, 'mock-tab-screen')).toEqual([
      'Dashboard',
      'Journal',
      'Calendar',
      'Nutrition',
      'Recreation',
      'Settings',
    ]);
    expect(dashboardScreen.props.options.tabBarLabel).toBe('Home');
    expect(routeToComponent).toMatchObject({
      Journal: JournalNavigation,
      Calendar: CalendarNavigation,
      Nutrition: NutritionNavigation,
      Recreation: RecreationNavigation,
      Settings: SettingsNavigation,
    });
  });

  test('CalendarNavigation keeps CalendarMain and the NewDay route under the Calendar tab', () => {
    const renderer = renderTree(<CalendarNavigation />);
    const stackNavigator = renderer.root.findByType('mock-stack-navigator');
    const stackScreens = renderer.root.findAllByType('mock-stack-screen');
    const routeToComponent = Object.fromEntries(
      stackScreens.map(screen => [screen.props.name, screen.props.component]),
    );

    expect(stackNavigator.props.initialRouteName).toBe('CalendarMain');
    expect(getScreenNames(renderer, 'mock-stack-screen')).toEqual([
      'CalendarMain',
      'Writing',
      'Edit Writing',
      'NewDay',
    ]);
    expect(routeToComponent).toMatchObject({
      CalendarMain: mockCalendarWrapper,
      Writing: mockWritingWrapper,
      'Edit Writing': mockEditWritingWrapper,
      NewDay: mockNewDayWrapper,
    });
  });

  test('JournalNavigation keeps the current journal stack route set', () => {
    const renderer = renderTree(<JournalNavigation />);
    const stackNavigator = renderer.root.findByType('mock-stack-navigator');

    expect(stackNavigator.props.initialRouteName).toBe('Journal');
    expect(getScreenNames(renderer, 'mock-stack-screen')).toEqual([
      'Journal',
      'WeightLog',
      'QuarterlyEntry',
      'DailyEntry',
      'WeeklyEntry',
      'SupplementLog',
      'Calories',
      'TraitDirectory',
    ]);
  });

  test('NutritionNavigation keeps the current nutrition stack route set', () => {
    const renderer = renderTree(<NutritionNavigation />);
    const stackNavigator = renderer.root.findByType('mock-stack-navigator');

    expect(stackNavigator.props.initialRouteName).toBe('Nutrition');
    expect(getScreenNames(renderer, 'mock-stack-screen')).toEqual([
      'Nutrition',
      'Supplement',
      'Meal',
      'MealsList',
      'MealDirectory',
      'MealDetail',
    ]);
  });

  test('RecreationNavigation keeps the current recreation stack route set', () => {
    const renderer = renderTree(<RecreationNavigation />);
    const stackNavigator = renderer.root.findByType('mock-stack-navigator');

    expect(stackNavigator.props.initialRouteName).toBe('Recreation');
    expect(getScreenNames(renderer, 'mock-stack-screen')).toEqual([
      'Recreation',
      'RoutineManager',
      'ProgramManager',
      'EditProgram',
      'EditRoutine',
      'MyExercises',
    ]);
  });

  test('SettingsNavigation keeps the current settings stack route set', () => {
    const renderer = renderTree(<SettingsNavigation />);
    const stackNavigator = renderer.root.findByType('mock-stack-navigator');

    expect(stackNavigator.props.initialRouteName).toBe('Settings');
    expect(getScreenNames(renderer, 'mock-stack-screen')).toEqual([
      'Settings',
      'MyProfile',
      'MyVitals',
      'MyAccount',
      'MyEmail',
      'MyPassword',
      'DeleteAccount',
      'ExportToCSV',
      'TermsOfUse',
      'PrivacyPolicy',
      'Abbrevations',
    ]);
  });
});
