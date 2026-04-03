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
    name: 'Dashboard',
    component: DashboardWrapper,
    options: {
      tabBarLabel: 'Home',
      tabBarIcon: renderMaterialTabIcon('home'),
    },
  },
  {
    name: 'Journal',
    component: JournalNavigation,
    options: {
      tabBarLabel: 'Journal',
      tabBarIcon: renderMaterialTabIcon('notebook'),
    },
  },
  {
    name: 'Calendar',
    component: CalendarNavigation,
    options: {
      tabBarLabel: 'Calendar',
      tabBarIcon: renderMaterialTabIcon('calendar'),
    },
  },
  {
    name: 'Nutrition',
    component: NutritionNavigation,
    options: {
      tabBarLabel: 'Nutrition',
      tabBarIcon: renderIoniconTabIcon('restaurant'),
    },
  },
  {
    name: 'Recreation',
    component: RecreationNavigation,
    options: {
      tabBarLabel: 'Recreation',
      tabBarIcon: renderMaterialTabIcon('human-handsup'),
    },
  },
  {
    name: 'Settings',
    component: SettingsNavigation,
    options: {
      tabBarLabel: 'Settings',
      tabBarIcon: renderIoniconTabIcon('settings'),
    },
  },
];

export default function BottomTabNavigation() {
  return (
    <Tab.Navigator
      lazy={false}
      initialRouteName="Calendar"
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
