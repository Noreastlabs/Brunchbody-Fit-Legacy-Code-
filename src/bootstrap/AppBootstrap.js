import React, { useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { RootContainer } from '../root-container/RootContainer';
import { ROOT_ROUTES } from '../navigation/routeNames';
import { hydrateWorkoutPlans } from '../storage/mmkv/hydration';
import { hasStoredProfile } from '../redux/actions/authStorage';

const BOOTSTRAP_FALLBACK_ROUTE = ROOT_ROUTES.COMPLETE_PROFILE;
const BOOTSTRAP_ERROR_MESSAGE =
  '[AppBootstrap] Startup failed. Falling back to CompleteProfile.';

export const resolveInitialRouteName = async () => {
  const profileExists = await hasStoredProfile();
  return profileExists ? ROOT_ROUTES.HOME : ROOT_ROUTES.COMPLETE_PROFILE;
};

const runBootstrap = async () => {
  try {
    hydrateWorkoutPlans();
    return await resolveInitialRouteName();
  } catch (error) {
    console.error(BOOTSTRAP_ERROR_MESSAGE, error);
    return BOOTSTRAP_FALLBACK_ROUTE;
  }
};

export default function AppBootstrap() {
  const [initialRouteName, setInitialRouteName] = useState(null);
  const { RNAlarmNotification } = NativeModules;

  useEffect(() => {
    let isMounted = true;

    const bootstrapApp = async () => {
      const resolvedInitialRouteName = await runBootstrap();

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
