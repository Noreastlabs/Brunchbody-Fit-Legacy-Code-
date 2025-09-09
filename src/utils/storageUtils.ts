import { storage } from '../storage/mmkv/index';

export const setJSON = (key: string, value: any) => {
  storage.set(key, JSON.stringify(value));
};

export const getJSON = <T>(key: string): T | null => {
  const jsonString = storage.getString(key);
  return jsonString ? JSON.parse(jsonString) : null;
};
