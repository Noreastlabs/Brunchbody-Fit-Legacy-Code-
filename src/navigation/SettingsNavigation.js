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

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

export default function SettingsNavigation() {
  return (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName="Settings">
      <Stack.Screen name="Settings" component={SettingWrapper} />
      <Stack.Screen name="MyProfile" component={MyProfileWrapper} />
      <Stack.Screen name="MyVitals" component={MyVitalsWrapper} />
      <Stack.Screen name="MyAccount" component={MyAccountWrapper} />
      <Stack.Screen name="MyEmail" component={MyEmailWrapper} />
      <Stack.Screen name="MyPassword" component={MyPasswordWrapper} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountWrapper} />
      <Stack.Screen name="ExportToCSV" component={ExportToCSVWrapper} />
      <Stack.Screen name="TermsOfUse" component={TermsOfUseWrapper} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyWrapper} />
      <Stack.Screen name="Abbrevations" component={AbbrevationsWrapper} />
    </Stack.Navigator>
  );
}
