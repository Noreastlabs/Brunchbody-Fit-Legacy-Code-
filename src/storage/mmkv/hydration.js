import { STORAGE_KEYS } from './keys';

import { storage } from './index';
import { setJSON } from '../../utils/storageUtils';
import { brunchBodyPlans } from '../../data/brunchBodyPlans';

const isUsableBundledPlan = plan =>
  !!plan &&
  typeof plan === 'object' &&
  !Array.isArray(plan) &&
  typeof plan.name === 'string' &&
  Array.isArray(plan.weeksData);

const hasUsableStoredBundledPlans = () => {
  const rawPlans = storage.getString(STORAGE_KEYS.PLANS.BRUNCH_BODY);

  if (!rawPlans) {
    return false;
  }

  try {
    const parsedPlans = JSON.parse(rawPlans);

    return (
      Array.isArray(parsedPlans) &&
      parsedPlans.length > 0 &&
      parsedPlans.every(isUsableBundledPlan)
    );
  } catch {
    return false;
  }
};

const seedBundledPlans = () => {
  console.log('Hydrating MMKV with workout plans...');
  setJSON(STORAGE_KEYS.PLANS.BRUNCH_BODY, brunchBodyPlans);
  storage.set(STORAGE_KEYS.IS_INITIALIZED, true);
  console.log('Workout plans saved to MMKV.');
};

export const hydrateWorkoutPlans = () => {
  const isInitialized = storage.getBoolean(STORAGE_KEYS.IS_INITIALIZED);
  const hasUsablePlansPayload =
    isInitialized && hasUsableStoredBundledPlans();

  if (!isInitialized || !hasUsablePlansPayload) {
    seedBundledPlans();
  }
};
