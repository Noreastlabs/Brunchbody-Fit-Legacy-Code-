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
import { JOURNAL_ROUTES } from './routeNames';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

const JOURNAL_STACK_SCREENS = [
  {
    name: JOURNAL_ROUTES.JOURNAL,
    component: JournalWrapper,
  },
  {
    name: JOURNAL_ROUTES.WEIGHT_LOG,
    component: WeightLogWrapper,
  },
  {
    name: JOURNAL_ROUTES.QUARTERLY_ENTRY,
    component: QuarterlyEntryWrapper,
  },
  {
    name: JOURNAL_ROUTES.DAILY_ENTRY,
    component: DailyEntryWrapper,
  },
  {
    name: JOURNAL_ROUTES.WEEKLY_ENTRY,
    component: WeeklyEntryWrapper,
  },
  {
    name: JOURNAL_ROUTES.SUPPLEMENT_LOG,
    component: SupplementLogWrapper,
  },
  {
    name: JOURNAL_ROUTES.CALORIES,
    component: CaloriesWrapper,
  },
  {
    name: JOURNAL_ROUTES.TRAIT_DIRECTORY,
    component: TraitDirectoryWrapper,
  },
];

export default function JournalNavigation() {
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName={JOURNAL_ROUTES.JOURNAL}
    >
      {JOURNAL_STACK_SCREENS.map(({ name, component }) => (
        <Stack.Screen key={name} name={name} component={component} />
      ))}
    </Stack.Navigator>
  );
}
