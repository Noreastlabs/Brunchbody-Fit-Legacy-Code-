import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../../storage/mmkv/keys';
import {getJSON} from '../../utils/storageUtils';

const ROUTINES_STORAGE_KEY = 'routines';
const WORKOUTS_STORAGE_KEY = 'workouts';

export const readStoredRoutines = async () => {
  const routinesString = await AsyncStorage.getItem(ROUTINES_STORAGE_KEY);
  return routinesString ? JSON.parse(routinesString) : [];
};

export const readStoredWorkouts = async () => {
  const workoutsString = await AsyncStorage.getItem(WORKOUTS_STORAGE_KEY);
  return workoutsString ? JSON.parse(workoutsString) : [];
};

export const readStoredBrunchBodyPlans = () =>
  getJSON(STORAGE_KEYS.PLANS.BRUNCH_BODY) || [];
