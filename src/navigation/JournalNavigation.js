import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  CaloriesWrapper,
  DailyEntryWrapper,
  JournalWrapper,
  QuarterlyEntryWrapper,
  SupplementLogWrapper,
  TraitDirectoryWrapper,
  WeeklyEntryWrapper,
  WeightLogWrapper,
} from '../screens/journal';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

export default function JournalNavigation() {
  return (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName="Journal">
      <Stack.Screen name="Journal" component={JournalWrapper} />
      <Stack.Screen name="WeightLog" component={WeightLogWrapper} />
      <Stack.Screen
        name="QuarterlyEntry"
        component={QuarterlyEntryWrapper}
      />
      <Stack.Screen name="DailyEntry" component={DailyEntryWrapper} />
      <Stack.Screen name="WeeklyEntry" component={WeeklyEntryWrapper} />
      <Stack.Screen name="SupplementLog" component={SupplementLogWrapper} />
      <Stack.Screen name="Calories" component={CaloriesWrapper} />
      <Stack.Screen name="TraitDirectory" component={TraitDirectoryWrapper} />
    </Stack.Navigator>
  );
}
