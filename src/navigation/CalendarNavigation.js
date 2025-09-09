import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {CalendarWrapper} from '../screens/calendar';
import {
  WritingWrapper,
  EditWritingWrapper,
  NewDayWrapper,
} from '../screens/writing';

const CalendarStack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

export default function CalendarNavigation() {
  return (
    <CalendarStack.Navigator
      screenOptions={screenOptions}
      initialRouteName="CalendarMain">
      <CalendarStack.Screen name="CalendarMain" component={CalendarWrapper} />
      <CalendarStack.Screen
        name="Writing"
        component={WritingWrapper}
        options={{
          headerShown: false,
        }}
      />
      <CalendarStack.Screen
        name="Edit Writing"
        component={EditWritingWrapper}
        options={{
          headerShown: false,
        }}
      />
      <CalendarStack.Screen
        name="NewDay"
        component={NewDayWrapper}
        options={{
          headerShown: false,
        }}
      />
    </CalendarStack.Navigator>
  );
}
