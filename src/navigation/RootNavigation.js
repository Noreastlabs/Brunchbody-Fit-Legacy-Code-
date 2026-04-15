import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { CompleteProfileWrapper } from '../screens/completeProfile/pages/completeProfile/CompleteProfile';
import { TutorialsWrapper } from '../screens/setting';
import { DateProvider } from '../context/DateProvider';
import BottomTabNavigation from './BottomTabNavigation';
import { ROOT_ROUTES } from './routeNames';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

const ROOT_STACK_SCREENS = [
  {
    name: ROOT_ROUTES.COMPLETE_PROFILE,
    component: CompleteProfileWrapper,
  },
  {
    name: ROOT_ROUTES.HOME,
    component: BottomTabNavigation,
  },
  {
    name: ROOT_ROUTES.TUTORIALS,
    component: TutorialsWrapper,
  },
];

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
          {ROOT_STACK_SCREENS.map(({ name, component }) => (
            <Stack.Screen key={name} name={name} component={component} />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </DateProvider>
  );
}
