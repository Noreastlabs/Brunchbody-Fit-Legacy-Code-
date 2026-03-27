import {LOCAL_ONLY} from './mode';

export const APP_MODES = Object.freeze({
  LOCAL_ONLY: 'LOCAL_ONLY',
  REMOTE_SYNC: 'REMOTE_SYNC',
});

/**
 * Runtime mode is currently controlled by one documented feature flag.
 * Keep APP_MODE exported so existing imports remain backwards compatible.
 */
export const APP_MODE = LOCAL_ONLY ? APP_MODES.LOCAL_ONLY : APP_MODES.REMOTE_SYNC;

export const isLocalOnlyMode = () => APP_MODE === APP_MODES.LOCAL_ONLY;

export const assertLocalOnlyMode = featureName => {
  if (!isLocalOnlyMode()) {
    throw new Error(
      `[appMode] ${featureName} only supports LOCAL_ONLY mode. Received: ${APP_MODE}.`,
    );
  }
};
