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

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

export default function NutritionNavigation() {
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName="Nutrition"
    >
      <Stack.Screen name="Nutrition" component={NutritionWrapper} />
      <Stack.Screen name="Supplement" component={SupplementWrapper} />
      <Stack.Screen name="Meal" component={MealWrapper} />
      <Stack.Screen name="MealsList" component={MealsListWrapper} />
      <Stack.Screen name="MealDirectory" component={MealDirectoryWrapper} />
      <Stack.Screen name="MealDetail" component={MealDetailWrapper} />
    </Stack.Navigator>
  );
}
