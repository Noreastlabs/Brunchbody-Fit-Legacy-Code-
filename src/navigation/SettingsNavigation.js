import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  AbbrevationsWrapper,
  DeleteAccountWrapper,
  ExportToCSVWrapper,
  MyAccountWrapper,
  MyEmailWrapper,
  MyPasswordWrapper,
  MyProfileWrapper,
  MyVitalsWrapper,
  PrivacyPolicyWrapper,
  SettingWrapper,
  TermsOfUseWrapper,
} from '../screens/setting';
import { SETTINGS_ROUTES } from './routeNames';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

const SETTINGS_STACK_SCREENS = [
  {
    name: SETTINGS_ROUTES.SETTINGS,
    component: SettingWrapper,
  },
  {
    name: SETTINGS_ROUTES.MY_PROFILE,
    component: MyProfileWrapper,
  },
  {
    name: SETTINGS_ROUTES.MY_VITALS,
    component: MyVitalsWrapper,
  },
  {
    name: SETTINGS_ROUTES.MY_ACCOUNT,
    component: MyAccountWrapper,
  },
  {
    name: SETTINGS_ROUTES.MY_EMAIL,
    component: MyEmailWrapper,
  },
  {
    name: SETTINGS_ROUTES.MY_PASSWORD,
    component: MyPasswordWrapper,
  },
  {
    name: SETTINGS_ROUTES.DELETE_ACCOUNT,
    component: DeleteAccountWrapper,
  },
  {
    name: SETTINGS_ROUTES.EXPORT_TO_CSV,
    component: ExportToCSVWrapper,
  },
  {
    name: SETTINGS_ROUTES.TERMS_OF_USE,
    component: TermsOfUseWrapper,
  },
  {
    name: SETTINGS_ROUTES.PRIVACY_POLICY,
    component: PrivacyPolicyWrapper,
  },
  {
    name: SETTINGS_ROUTES.ABBREVIATIONS,
    component: AbbrevationsWrapper,
  },
];

export default function SettingsNavigation() {
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName={SETTINGS_ROUTES.SETTINGS}
    >
      {SETTINGS_STACK_SCREENS.map(({ name, component }) => (
        <Stack.Screen key={name} name={name} component={component} />
      ))}
    </Stack.Navigator>
  );
}
