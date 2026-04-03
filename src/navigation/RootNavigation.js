import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { CompleteProfileWrapper } from '../screens/completeProfile/pages/completeProfile/CompleteProfile';
import { DateProvider } from '../context/DateProvider';
import { TutorialsWrapper } from '../screens/setting/pages/Tutorials';
import BottomTabNavigation from './BottomTabNavigation';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

export default function RootNavigation({ initialRouteName }) {
  if (!initialRouteName) {
    return null;
  }

  return (
    <DateProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={screenOptions}
          initialRouteName={initialRouteName}
        >
          <Stack.Screen
            name="CompleteProfile"
            component={CompleteProfileWrapper}
          />
          <Stack.Screen name="Home" component={BottomTabNavigation} />
          <Stack.Screen name="Tutorials" component={TutorialsWrapper} />
        </Stack.Navigator>
      </NavigationContainer>
    </DateProvider>
  );
}
