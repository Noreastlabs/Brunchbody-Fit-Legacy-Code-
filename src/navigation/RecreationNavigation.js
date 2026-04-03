import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  EditProgramWrapper,
  EditRoutineWrapper,
  MyExercisesWrapper,
  ProgramManagerWrapper,
  RecreationWrapper,
  RoutineManagerWrapper,
} from '../screens/recreation';
import { RECREATION_ROUTES } from './routeNames';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

const RECREATION_STACK_SCREENS = [
  {
    name: RECREATION_ROUTES.RECREATION,
    component: RecreationWrapper,
  },
  {
    name: RECREATION_ROUTES.ROUTINE_MANAGER,
    component: RoutineManagerWrapper,
  },
  {
    name: RECREATION_ROUTES.PROGRAM_MANAGER,
    component: ProgramManagerWrapper,
  },
  {
    name: RECREATION_ROUTES.EDIT_PROGRAM,
    component: EditProgramWrapper,
  },
  {
    name: RECREATION_ROUTES.EDIT_ROUTINE,
    component: EditRoutineWrapper,
  },
  {
    name: RECREATION_ROUTES.MY_EXERCISES,
    component: MyExercisesWrapper,
  },
];

export default function RecreationNavigation() {
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName={RECREATION_ROUTES.RECREATION}
    >
      {RECREATION_STACK_SCREENS.map(({ name, component }) => (
        <Stack.Screen key={name} name={name} component={component} />
      ))}
    </Stack.Navigator>
  );
}
