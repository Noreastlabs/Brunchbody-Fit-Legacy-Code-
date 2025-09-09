import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  EDIT_JOURNAL_ENTRY,
  GET_ALL_JOURNAL_ENTRIES,
  GET_JOURNAL_ENTRIES,
  GET_TRAITS,
  SET_JOURNAL_ENTRY,
} from '../constants';
import { serverUrl } from '../../config';

export const getAllJournalEntries = () => async dispatch => {
  await dispatch({ type: GET_ALL_JOURNAL_ENTRIES });
  return true;
};

export const getJournalEntries = date => async dispatch => {
  console.log('Getting journal entries for date:', date);
  await dispatch({ type: GET_JOURNAL_ENTRIES, payload: { date } });
  await dispatch({ type: GET_ALL_JOURNAL_ENTRIES });
};

export const addJournalEntry = (date, data) => async dispatch => {
  console.log('Adding journal entry:', { date, data });
  await dispatch({ type: SET_JOURNAL_ENTRY, payload: { date, data } });
  return true;
};

export const editJournalEntry = (id, data) => async dispatch => {
  console.log('Editing journal entry:', { id, data });
  await dispatch({ type: EDIT_JOURNAL_ENTRY, payload: { id, data } });
  return true;
};

export const getTraits = () => async dispatch => {
  const idToken = await AsyncStorage.getItem('auth_token');
  const refreshToken = await AsyncStorage.getItem('refresh_token');

  const request = await axios({
    method: 'GET',
    baseURL: serverUrl,
    url: `api/user/getTraits`,
    headers: {
      auth_token: idToken,
      refresh_token: refreshToken,
    },
  })
    .then(res => res.data)
    .catch(err => err.response.data);

  if (request.success) {
    dispatch({ type: GET_TRAITS, payload: request.result });
    return true;
  }

  return request.result ? request.result : 'Something went wrong.';
};
