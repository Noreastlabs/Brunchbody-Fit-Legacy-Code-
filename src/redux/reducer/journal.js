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

const journalReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TRAITS: {
      return {
        ...state,
        allTraits: action.payload,
      };
    }
    case GET_JOURNAL_ENTRIES: {
      const targetDate = action.payload.date;
      const normalizedTargetDate = new Date(targetDate);
      normalizedTargetDate.setHours(0, 0, 0, 0);

      const foundEntry = state.allJournalEntriesList.find(entry => {
        const entryDate = new Date(entry.createdOn);
        entryDate.setHours(0, 0, 0, 0);

        return entryDate.getTime() === normalizedTargetDate.getTime();
      });

      return {
        ...state,
        allEntries: foundEntry || null,
      };
    }
    case SET_JOURNAL_ENTRY: {
      const entryData = action.payload.data;
      const temp = {
        ...entryData,
        createdOn: action.payload.date,
        id: Math.random().toString(36).slice(2),
      };

      return {
        ...state,
        allJournalEntriesList: [...state.allJournalEntriesList, temp],
      };
    }
    case EDIT_JOURNAL_ENTRY: {
      const temp = Array.from(state.allJournalEntriesList);
      const index = temp.findIndex(i => i.id === action.payload.id);

      if (index < 0) {
        return state;
      }

      const entryData = action.payload.data;
      temp[index] = { ...temp[index], ...entryData };

      return {
        ...state,
        allJournalEntriesList: temp,
      };
    }
    default:
      return state;
  }
};

export default journalReducer;
