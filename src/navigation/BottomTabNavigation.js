import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../resources';
import { DashboardWrapper } from '../screens/dashboard';
import CalendarNavigation from './CalendarNavigation';
import JournalNavigation from './JournalNavigation';
import NutritionNavigation from './NutritionNavigation';
import RecreationNavigation from './RecreationNavigation';
import { AUTH_TAB_ROUTES, ROOT_ROUTES } from './routeNames';
import SettingsNavigation from './SettingsNavigation';

const Tab = createBottomTabNavigator();
const TAB_LABEL_SIZE = RFValue(8);
const TAB_ICON_SIZE = RFValue(25);

const tabBarScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.lightGreen,
  tabBarStyle: {
    borderTopWidth: 1,
    backgroundColor: colors.background,
  },
  tabBarLabelStyle: {
    fontSize: TAB_LABEL_SIZE,
    marginTop: 3,
  },
};

const renderMaterialTabIcon = name => ({ color }) => (
  <MaterialCommunityIcons name={name} color={color} size={TAB_ICON_SIZE} />
);

const renderIoniconTabIcon = name => ({ color }) => (
  <Icon name={name} color={color} size={TAB_ICON_SIZE} />
);

const tabScreens = [
  {
    name: AUTH_TAB_ROUTES.DASHBOARD,
    component: DashboardWrapper,
    options: {
      tabBarLabel: ROOT_ROUTES.HOME,
      tabBarIcon: renderMaterialTabIcon('home'),
    },
  },
  {
    name: AUTH_TAB_ROUTES.JOURNAL,
    component: JournalNavigation,
    options: {
      tabBarLabel: AUTH_TAB_ROUTES.JOURNAL,
      tabBarIcon: renderMaterialTabIcon('notebook'),
    },
  },
  {
    name: AUTH_TAB_ROUTES.CALENDAR,
    component: CalendarNavigation,
    options: {
      tabBarLabel: AUTH_TAB_ROUTES.CALENDAR,
      tabBarIcon: renderMaterialTabIcon('calendar'),
    },
  },
  {
    name: AUTH_TAB_ROUTES.NUTRITION,
    component: NutritionNavigation,
    options: {
      tabBarLabel: AUTH_TAB_ROUTES.NUTRITION,
      tabBarIcon: renderIoniconTabIcon('restaurant'),
    },
  },
  {
    name: AUTH_TAB_ROUTES.RECREATION,
    component: RecreationNavigation,
    options: {
      tabBarLabel: AUTH_TAB_ROUTES.RECREATION,
      tabBarIcon: renderMaterialTabIcon('human-handsup'),
    },
  },
  {
    name: AUTH_TAB_ROUTES.SETTINGS,
    component: SettingsNavigation,
    options: {
      tabBarLabel: AUTH_TAB_ROUTES.SETTINGS,
      tabBarIcon: renderIoniconTabIcon('settings'),
    },
  },
];

export default function BottomTabNavigation() {
  return (
    <Tab.Navigator
      lazy={false}
      initialRouteName={AUTH_TAB_ROUTES.CALENDAR}
      screenOptions={tabBarScreenOptions}
    >
      {tabScreens.map(({ name, component, options }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={options}
        />
      ))}
    </Tab.Navigator>
  );
}
