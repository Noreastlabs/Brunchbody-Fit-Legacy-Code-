import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  CalendarWrapper,
  WritingWrapper,
  EditWritingWrapper,
  NewDayWrapper,
} from '../screens/calendar';
import { CALENDAR_ROUTES } from './routeNames';

const CalendarStack = createStackNavigator();
const CALENDAR_STACK_INITIAL_ROUTE = CALENDAR_ROUTES.MAIN;
const CALENDAR_STACK_SCREENS = [
  {
    name: CALENDAR_STACK_INITIAL_ROUTE,
    component: CalendarWrapper,
  },
  {
    name: CALENDAR_ROUTES.WRITING,
    component: WritingWrapper,
  },
  {
    name: CALENDAR_ROUTES.EDIT_WRITING,
    component: EditWritingWrapper,
  },
  {
    name: CALENDAR_ROUTES.NEW_DAY,
    component: NewDayWrapper,
  },
];

const screenOptions = {
  headerShown: false,
};

export default function CalendarNavigation() {
  return (
    <CalendarStack.Navigator
      screenOptions={screenOptions}
      initialRouteName={CALENDAR_STACK_INITIAL_ROUTE}
    >
      {CALENDAR_STACK_SCREENS.map(screen => (
        <CalendarStack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </CalendarStack.Navigator>
  );
}
