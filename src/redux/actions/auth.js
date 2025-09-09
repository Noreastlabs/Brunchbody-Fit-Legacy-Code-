/* eslint-disable no-console */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serverUrl } from '../../config';
import { SET_USER } from '../constants';

export const loggedIn = () => async dispatch => {
  console.log('Inside loggedIn');

  const idToken = await AsyncStorage.getItem('auth_token');
  const refreshToken = await AsyncStorage.getItem('refresh_token');

  const request = await axios({
    method: 'GET',
    baseURL: serverUrl,
    url: `api/user/isLoggedIn`,
    headers: {
      auth_token: idToken,
      refresh_token: refreshToken,
    },
  })
    .then(res => res.data)
    .catch(() => false);

  if (request.success) {
    AsyncStorage.setItem('uid', request.result.uid);
    AsyncStorage.setItem('auth_token', request.result.authToken);
    AsyncStorage.setItem('refresh_token', request.result.refreshToken);
    AsyncStorage.setItem(
      'last_updated_time',
      request?.result?.user?.lastUpdatedTime?.toString() || '',
    );

    AsyncStorage.getItem('last_updated_time').then(value => {
      console.log('Inside loggedIn', value);
    });

    const { user } = request.result;

    if (user.weight && user.height) {
      dispatch({
        type: SET_USER,
        payload: request.result.user,
      });
      return true;
    }

    return 'goToCompleteProfile';
  }

  return false;
};

export const login = data => async dispatch => {
  const request = await axios({
    method: 'POST',
    baseURL: serverUrl,
    url: 'auth/user/login',
    data: { userData: data },
  })
    .then(res => res.data)
    .catch(err => console.log(err));

  if (request) {
    const { user } = request.result;
    AsyncStorage.setItem('uid', request.result.uid);
    AsyncStorage.setItem('auth_token', request.result.authToken);
    AsyncStorage.setItem('refresh_token', request.result.refreshToken);

    if (user.weight && user.height) {
      dispatch({
        type: SET_USER,
        payload: request.result.user,
      });
      return true;
    }

    return 'goToCompleteProfile';
  }

  return false;
};

export const socialLogin = data => async dispatch => {
  const request = await axios({
    method: 'POST',
    baseURL: serverUrl,
    url: 'auth/user/social/login',
    data: { ...data },
  })
    .then(res => res.data)
    .catch(() => false);

  if (request) {
    const { user } = request.result;
    AsyncStorage.setItem('uid', request.result.uid);
    AsyncStorage.setItem('auth_token', request.result.authToken);
    AsyncStorage.setItem('refresh_token', request.result.refreshToken);

    if (user.height && user.weight) {
      dispatch({
        type: SET_USER,
        payload: request.result.user,
      });
      return 'logging in';
    }

    return 'signing up';
  }

  return false;
};

export const createAccount = data => async () => {
  const request = await axios({
    method: 'POST',
    baseURL: serverUrl,
    url: 'auth/user/signup',
    data: { userData: data },
  })
    .then(res => res.data)
    .catch(err => err.response.data);

  if (request.success) {
    AsyncStorage.setItem('uid', request.result.uid);
    AsyncStorage.setItem('auth_token', request.result.authToken);
    AsyncStorage.setItem('refresh_token', request.result.refreshToken);
    return true;
  }

  return request.code === 400 ? request.result : 'Something went wrong!';
};

export const profile = data => async dispatch => {
  const uid = await AsyncStorage.getItem('uid');
  const idToken = await AsyncStorage.getItem('auth_token');

  const request = await axios({
    method: 'POST',
    baseURL: serverUrl,
    url: `api/user/profile/${uid}`,
    data,
  })
    .then(res => res.data)
    .catch(err => err.response.data);

  if (request.success) {
    if (idToken) dispatch(loggedIn());
    return true;
  }

  return request.result;
};

export const changeEmail = data => async dispatch => {
  const idToken = await AsyncStorage.getItem('auth_token');
  const refreshToken = await AsyncStorage.getItem('refresh_token');

  const request = await axios({
    method: 'POST',
    baseURL: serverUrl,
    url: `api/user/change/email`,
    headers: {
      auth_token: idToken,
      refresh_token: refreshToken,
    },
    data,
  })
    .then(res => res.data)
    .catch(err => err.response.data);

  if (request.success) {
    AsyncStorage.setItem('auth_token', request.result.authToken);
    AsyncStorage.setItem('refresh_token', request.result.refreshToken);
    dispatch({
      type: SET_USER,
      payload: request.result.user,
    });
    return true;
  }

  return false;
};

export const changePassword = data => async () => {
  const idToken = await AsyncStorage.getItem('auth_token');
  const refreshToken = await AsyncStorage.getItem('refresh_token');

  const request = await axios({
    method: 'POST',
    baseURL: serverUrl,
    url: `api/user/change/password`,
    headers: {
      auth_token: idToken,
      refresh_token: refreshToken,
    },
    data,
  })
    .then(res => res.data)
    .catch(err => err.response.data);

  if (request.success) {
    AsyncStorage.setItem('auth_token', request.result.authToken);
    AsyncStorage.setItem('refresh_token', request.result.refreshToken);
    return true;
  }

  return request.result;
};

export const resetPassword = data => async () => {
  const request = await axios({
    method: 'POST',
    baseURL: serverUrl,
    url: `api/user/reset/password`,
    data,
  })
    .then(res => res.data)
    .catch(err => err.response.data);

  if (request.success) {
    return true;
  }

  return request.message;
};

export const deleteAccount = data => async () => {
  const uid = await AsyncStorage.getItem('uid');

  const request = await axios({
    method: 'POST',
    baseURL: serverUrl,
    url: `api/user/delete/${uid}`,
    data,
  })
    .then(res => res.data)
    .catch(err => err.response.data);

  if (request.success) {
    AsyncStorage.removeItem('uid');
    AsyncStorage.removeItem('auth_token');
    AsyncStorage.removeItem('refresh_token');
    return true;
  }

  return request.result;
};

export const logout = () => async () => {
  const uid = await AsyncStorage.getItem('uid');

  const request = await axios({
    method: 'POST',
    baseURL: serverUrl,
    url: 'auth/user/logout',
    data: { uid },
  })
    .then(res => res.data)
    .catch(err => err.response.data);

  if (request.success) {
    return true;
  }

  return false;
};
