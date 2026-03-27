export const APP_MODES = Object.freeze({
  LOCAL_ONLY: 'LOCAL_ONLY',
  REMOTE_SYNC: 'REMOTE_SYNC',
});

const requestedMode = process.env.APP_MODE;

export const APP_MODE =
  requestedMode && Object.values(APP_MODES).includes(requestedMode)
    ? requestedMode
    : APP_MODES.LOCAL_ONLY;

export const isLocalOnlyMode = () => APP_MODE === APP_MODES.LOCAL_ONLY;

export const assertLocalOnlyMode = featureName => {
  if (!isLocalOnlyMode()) {
    throw new Error(
      `[appMode] ${featureName} only supports LOCAL_ONLY mode. Received: ${APP_MODE}.`,
    );
  }
};
