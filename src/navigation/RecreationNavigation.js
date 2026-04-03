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

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

export default function RecreationNavigation() {
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName="Recreation"
    >
      <Stack.Screen name="Recreation" component={RecreationWrapper} />
      <Stack.Screen name="RoutineManager" component={RoutineManagerWrapper} />
      <Stack.Screen name="ProgramManager" component={ProgramManagerWrapper} />
      <Stack.Screen name="EditProgram" component={EditProgramWrapper} />
      <Stack.Screen name="EditRoutine" component={EditRoutineWrapper} />
      <Stack.Screen name="MyExercises" component={MyExercisesWrapper} />
    </Stack.Navigator>
  );
}
