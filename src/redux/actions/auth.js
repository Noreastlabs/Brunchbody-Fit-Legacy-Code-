import AsyncStorage from '@react-native-async-storage/async-storage';
import { SET_USER } from '../constants';

export const loggedIn = () => async dispatch => {
  const userJson = await AsyncStorage.getItem('user');
  if (userJson) {
    const user = JSON.parse(userJson);
    dispatch({ type: SET_USER, payload: user });
    if (user.weight && user.height) {
      return true;
    }
    return 'goToCompleteProfile';
  }
  return false;
};

export const login = data => async dispatch => {
  const userJson = await AsyncStorage.getItem('user');
  const storedPassword = await AsyncStorage.getItem('password');
  const user = userJson ? JSON.parse(userJson) : {};

  if (user.email === data.email && storedPassword === data.password) {
    dispatch({ type: SET_USER, payload: user });
    return true;
  }

  return false;
};

export const profile = data => async dispatch => {
  const userJson = await AsyncStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : {};
  const updatedUser = { ...user, ...data };
  await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  dispatch({ type: SET_USER, payload: updatedUser });
  return true;
};

export const changeEmail = data => async dispatch => {
  const userJson = await AsyncStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : {};
  const updatedUser = { ...user, email: data.email };
  await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  dispatch({ type: SET_USER, payload: updatedUser });
  return true;
};

export const changePassword = data => async () => {
  const current = await AsyncStorage.getItem('password');
  if (current && current === data.password) {
    await AsyncStorage.setItem('password', data.newPassword);
    return true;
  }
  return 'Invalid current password';
};

export const resetPassword = data => async () => {
  const userJson = await AsyncStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  if (user && user.email === data.email) {
    await AsyncStorage.setItem('password', data.password || '');
    return true;
  }
  return 'Email not found';
};

export const deleteAccount = () => async dispatch => {
  await AsyncStorage.removeItem('user');
  await AsyncStorage.removeItem('password');
  dispatch({ type: SET_USER, payload: {} });
  return true;
};

export const logout = () => async dispatch => {
  await AsyncStorage.removeItem('user');
  await AsyncStorage.removeItem('password');
  dispatch({ type: SET_USER, payload: {} });
  return true;
};
