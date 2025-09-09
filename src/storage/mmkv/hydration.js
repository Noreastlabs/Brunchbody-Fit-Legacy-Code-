import { STORAGE_KEYS } from './keys';

import { storage } from './index';
import { setJSON } from '../../utils/storageUtils';
import { brunchBodyPlans } from '../../data/brunchBodyPlans';

export const hydrateWorkoutPlans = () => {
  const isInitialized = storage.getBoolean(STORAGE_KEYS.IS_INITIALIZED);

  if (!isInitialized) {
    console.log('Hydrating MMKV with workout plans...');
    setJSON(STORAGE_KEYS.PLANS.BRUNCH_BODY, brunchBodyPlans);
    storage.set(STORAGE_KEYS.IS_INITIALIZED, true);
    console.log('Workout plans saved to MMKV.');
  }
};
