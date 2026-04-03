import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { RootContainer } from '../root-container/RootContainer';
import { ROOT_ROUTES } from '../navigation/routeNames';
import { hydrateWorkoutPlans } from '../storage/mmkv/hydration';

export const resolveInitialRouteName = async () => {
  const profileData = await AsyncStorage.getItem('user_profile');
  return profileData ? ROOT_ROUTES.HOME : ROOT_ROUTES.COMPLETE_PROFILE;
};

export default function AppBootstrap() {
  const [initialRouteName, setInitialRouteName] = useState(null);
  const { RNAlarmNotification } = NativeModules;

  useEffect(() => {
    let isMounted = true;

    hydrateWorkoutPlans();

    const bootstrapApp = async () => {
      const resolvedInitialRouteName = await resolveInitialRouteName();

      if (isMounted) {
        setInitialRouteName(resolvedInitialRouteName);
      }
    };

    bootstrapApp();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let subscription;

    if (Platform.OS === 'android' && RNAlarmNotification) {
      const RNAlarmEmitter = new NativeEventEmitter(RNAlarmNotification);
      subscription = RNAlarmEmitter.addListener(
        'OnNotificationDismissed',
        data => console.log(data),
      );
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [RNAlarmNotification]);

  if (!initialRouteName) {
    return null;
  }

  return <RootContainer initialRouteName={initialRouteName} />;
}
