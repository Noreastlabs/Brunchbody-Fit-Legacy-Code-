import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CalendarWrapper } from '../screens/calendar';
import {
  WritingWrapper,
  EditWritingWrapper,
  NewDayWrapper,
} from '../screens/writing';

const CalendarStack = createStackNavigator();
const CALENDAR_STACK_INITIAL_ROUTE = 'CalendarMain';
const CALENDAR_STACK_SCREENS = [
  {
    name: CALENDAR_STACK_INITIAL_ROUTE,
    component: CalendarWrapper,
  },
  {
    name: 'Writing',
    component: WritingWrapper,
  },
  {
    name: 'Edit Writing',
    component: EditWritingWrapper,
  },
  {
    name: 'NewDay',
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
