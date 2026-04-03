import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  MealDetailWrapper,
  MealDirectoryWrapper,
  MealWrapper,
  MealsListWrapper,
  NutritionWrapper,
  SupplementWrapper,
} from '../screens/nutrition';
import { NUTRITION_ROUTES } from './routeNames';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

const NUTRITION_STACK_SCREENS = [
  {
    name: NUTRITION_ROUTES.NUTRITION,
    component: NutritionWrapper,
  },
  {
    name: NUTRITION_ROUTES.SUPPLEMENT,
    component: SupplementWrapper,
  },
  {
    name: NUTRITION_ROUTES.MEAL,
    component: MealWrapper,
  },
  {
    name: NUTRITION_ROUTES.MEALS_LIST,
    component: MealsListWrapper,
  },
  {
    name: NUTRITION_ROUTES.MEAL_DIRECTORY,
    component: MealDirectoryWrapper,
  },
  {
    name: NUTRITION_ROUTES.MEAL_DETAIL,
    component: MealDetailWrapper,
  },
];

export default function NutritionNavigation() {
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName={NUTRITION_ROUTES.NUTRITION}
    >
      {NUTRITION_STACK_SCREENS.map(({ name, component }) => (
        <Stack.Screen key={name} name={name} component={component} />
      ))}
    </Stack.Navigator>
  );
}
