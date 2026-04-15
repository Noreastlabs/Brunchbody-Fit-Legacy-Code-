import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  EDIT_JOURNAL_ENTRY,
  GET_ALL_JOURNAL_ENTRIES,
  GET_JOURNAL_ENTRIES,
  GET_TRAITS,
  SET_JOURNAL_ENTRY,
} from '../constants';

export const getAllJournalEntries = () => async dispatch => {
  await dispatch({ type: GET_ALL_JOURNAL_ENTRIES });
  return true;
};

export const getJournalEntries = date => async dispatch => {
  await dispatch({ type: GET_JOURNAL_ENTRIES, payload: { date } });
};

export const addJournalEntry = (date, data) => async dispatch => {
  await dispatch({ type: SET_JOURNAL_ENTRY, payload: { date, data } });
  return true;
};

export const editJournalEntry = (id, data) => async dispatch => {
  await dispatch({ type: EDIT_JOURNAL_ENTRY, payload: { id, data } });
  return true;
};

export const getTraits = () => async dispatch => {
  const traitsString = await AsyncStorage.getItem('traits');
  const traits = traitsString ? JSON.parse(traitsString) : [];
  dispatch({ type: GET_TRAITS, payload: traits });
  return true;
};
