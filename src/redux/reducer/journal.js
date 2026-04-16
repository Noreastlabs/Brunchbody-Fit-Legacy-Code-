import {
  EDIT_JOURNAL_ENTRY,
  GET_JOURNAL_ENTRIES,
  GET_TRAITS,
  SET_JOURNAL_ENTRY,
} from '../constants';
import { traitsDirectory } from '../../resources';

const initialState = {
  allJournalEntriesList: [],
  journalEntries: {},
  allEntries: null,
  allTraits: traitsDirectory.traits,
};

const normalizeDateToMidnight = date => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  return normalizedDate.getTime();
};

const findEntryForDate = (entries, targetDate) =>
  entries.find(
    entry => normalizeDateToMidnight(entry.createdOn) === normalizeDateToMidnight(targetDate),
  );

const createJournalEntry = (date, data) => ({
  ...data,
  createdOn: date,
  id: Math.random().toString(36).slice(2),
});

const mergeEntryById = (entries, id, data) => {
  const nextEntries = Array.from(entries);
  const index = nextEntries.findIndex(entry => entry.id === id);

  if (index < 0) {
    return null;
  }

  nextEntries[index] = { ...nextEntries[index], ...data };

  return nextEntries;
};

const journalReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TRAITS: {
      return {
        ...state,
        allTraits: action.payload,
      };
    }
    case GET_JOURNAL_ENTRIES: {
      const foundEntry = findEntryForDate(state.allJournalEntriesList, action.payload.date);

      return {
        ...state,
        allEntries: foundEntry || null,
      };
    }
    case SET_JOURNAL_ENTRY: {
      return {
        ...state,
        allJournalEntriesList: [
          ...state.allJournalEntriesList,
          createJournalEntry(action.payload.date, action.payload.data),
        ],
      };
    }
    case EDIT_JOURNAL_ENTRY: {
      const nextEntries = mergeEntryById(
        state.allJournalEntriesList,
        action.payload.id,
        action.payload.data,
      );

      if (!nextEntries) {
        return state;
      }

      return {
        ...state,
        allJournalEntriesList: nextEntries,
      };
    }
    default:
      return state;
  }
};

export default journalReducer;
