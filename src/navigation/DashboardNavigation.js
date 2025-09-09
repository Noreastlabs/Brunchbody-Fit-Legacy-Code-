import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {DashboardWrapper} from '../screens/dashboard';
import {colors} from '../resources';
import style from '../screens/dashboard/components/style';

const DashboardStack = createStackNavigator();

const screenOptions = {
  headerShown: true,
};

export default function DashboardNavigation() {
  return (
    <DashboardStack.Navigator screenOptions={screenOptions}>
      <DashboardStack.Screen
        name="DashboardTabs"
        component={DashboardWrapper}
        options={{
          title: 'Dashboard',
          headerTitleAlign: 'center',
          headerStyle: style.headerStyle,
          headerTintColor: colors.mainFont,
          headerTitleStyle: style.headerTitleStyle,
        }}
      />
    </DashboardStack.Navigator>
  );
}
