/* eslint-disable array-callback-return */
import moment from 'moment';
import {
  EDIT_JOURNAL_ENTRY,
  GET_ALL_JOURNAL_ENTRIES,
  GET_JOURNAL_ENTRIES,
  GET_TRAITS,
  SET_JOURNAL_ENTRY,
} from '../constants';
import {traitsDirectory} from '../../resources';

const initialState = {
  allJournalEntriesList: [],
  journalEntries: {},
  allEntries: null,
  dailyWeightList: [],
  dailyOutlookList: [],
  dailyCaloriesDiffList: [],
  weeklyWeightList: [],
  weeklyOutlookList: [],
  weeklyCaloriesDiffList: [],
  monthlyWeightList: [],
  monthlyOutlookList: [],
  monthlyCaloriesDiffList: [],
  yearlyWeightList: [],
  yearlyOutlookList: [],
  yearlyCaloriesDiffList: [],
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
    // To get journal entries for the current selected day.
    case GET_JOURNAL_ENTRIES: {
      const targetDate = action.payload.date;
      // Normalize the target date to start of day for comparison
      const normalizedTargetDate = new Date(targetDate);
      normalizedTargetDate.setHours(0, 0, 0, 0);
      
      console.log('GET_JOURNAL_ENTRIES - Looking for date:', targetDate);
      console.log('Normalized target date:', normalizedTargetDate.getTime());
      console.log('Current allJournalEntriesList length:', state.allJournalEntriesList.length);
      console.log('Available entries:', state.allJournalEntriesList.map(e => ({ 
        createdOn: e.createdOn, 
        normalized: new Date(e.createdOn).setHours(0, 0, 0, 0),
        type: Object.keys(e).find(key => key !== 'createdOn' && key !== 'id')
      })));
      
      const foundEntry = state.allJournalEntriesList.find(entry => {
        // Normalize the entry's createdOn date for comparison
        const entryDate = new Date(entry.createdOn);
        entryDate.setHours(0, 0, 0, 0);
        
        return entryDate.getTime() === normalizedTargetDate.getTime();
      });
      
      console.log('Found entry:', foundEntry);
      
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
      
      console.log('SET_JOURNAL_ENTRY - Adding entry:', temp);
      console.log('Current allJournalEntriesList length:', state.allJournalEntriesList.length);

      return {
        ...state,
        allJournalEntriesList: [...state.allJournalEntriesList, temp],
      };
    }
    case EDIT_JOURNAL_ENTRY: {
      const temp = Array.from(state.allJournalEntriesList);
      const index = temp.findIndex(i => i.id === action.payload.id);
      const entryData = action.payload.data;
      temp[index] = {...temp[index], ...entryData};

      return {
        ...state,
        // journalEntries: action.payload,
        allJournalEntriesList: temp,
      };
    }
    // To get whole record of journal entries of the logged in user and to create dashboard charts data by using record.
    case GET_ALL_JOURNAL_ENTRIES: {
      const date = new Date();
      const dtMonth = date.getMonth() + 1;
      const dtYear = date.getFullYear();
      let week = moment().format('w');
      let month = moment(date).format('MMM');
      let year = moment(date).format('YYYY');
      const daysInMonth = new Date(dtYear, dtMonth, 0).getDate();

      let count = 0;

      let weeklyWeightSum = 0;
      let weeklyOutlookSum = 0;
      let weeklyCalDiffSum = 0;
      let monthlyWeightSum = 0;
      let monthlyOutlookSum = 0;
      let monthlyCalDiffSum = 0;
      let yearlyWeightSum = 0;
      let yearlyOutlookSum = 0;
      let yearlyCalDiffSum = 0;

      const weights = [];
      const outlooks = [];
      const calDiff = [];
      const weeklyWeights = [];
      const weeklyOutlooks = [];
      const weeklyCalDiff = [];
      const monthlyWeights = [];
      const monthlyOutlooks = [];
      const monthlyCalDiff = [];
      const yearlyWeights = [];
      const yearlyOutlooks = [];
      const yearlyCalDiff = [];

      // For daily weight, outlook and calories differential data.
      // console.log('All JOurnal Entries', state.allJournalEntriesList);
      [...state.allJournalEntriesList]
        .sort((a, b) => b.createdOn - a.createdOn) // sorted in decreasing order
        .splice(0, 7)
        .map(item => {
          weights.push(item.WeightLog?.weight || '0');
          outlooks.push(item.DailyEntry?.feelingRate || '0');
          calDiff.push(item.CaloriesEntry?.caloriesDifferential || '0');
        });

      if (state.allJournalEntriesList.length < 7) {
        Array(7 - state.allJournalEntriesList.length)
          .fill()
          .map(() => {
            weights.push(0);
            outlooks.push(0);
            calDiff.push(0);
          });
      }

      // For weekly weight data.
      [...state.allJournalEntriesList]
        .splice(0, 7)
        .sort((a, b) => b.createdOn - a.createdOn)
        .filter(a => a.WeightLog)
        .map((item, index, self) => {
          if (week !== moment(item.createdOn, 'x').format('w')) {
            count += 1;
            weeklyWeights.push(Math.round((weeklyWeightSum / 7) * 100) / 100);
            weeklyWeightSum = 0;
            weeklyWeightSum += parseFloat(item.WeightLog.weight, 10);
            week = moment(item.createdOn, 'x').format('w');
          } else if (self.length - 1 === index) {
            count += 1;
            weeklyWeightSum += parseFloat(item.WeightLog.weight, 10);
            weeklyWeights.push(Math.round((weeklyWeightSum / 7) * 100) / 100);
            weeklyWeightSum = 0;
          } else {
            weeklyWeightSum += parseFloat(item.WeightLog.weight, 10);
          }
        });

      Array(7 - count)
        .fill()
        .map(() => {
          weeklyWeights.push(0);
        });

      count = 0;
      week = moment().format('w');

      // For weekly outlook data.
      [...state.allJournalEntriesList]
        .splice(0, 7)
        .sort((a, b) => b.createdOn - a.createdOn)
        .filter(a => a.DailyEntry)
        .map((item, index, self) => {
          if (week !== moment(item.createdOn, 'x').format('w')) {
            count += 1;
            weeklyOutlooks.push(Math.round((weeklyOutlookSum / 7) * 100) / 100);
            weeklyOutlookSum = 0;
            weeklyOutlookSum += parseInt(item.DailyEntry.feelingRate, 10);
            week = moment(item.createdOn, 'x').format('w');
          } else if (self.length - 1 === index) {
            count += 1;
            weeklyOutlookSum += parseInt(item.DailyEntry.feelingRate, 10);
            weeklyOutlooks.push(Math.round((weeklyOutlookSum / 7) * 100) / 100);

            weeklyOutlookSum = 0;
          } else {
            weeklyOutlookSum += parseInt(item.DailyEntry.feelingRate, 10);
          }
        });

      Array(7 - count)
        .fill()
        .map(() => {
          weeklyOutlooks.push(0);
        });

      count = 0;
      week = moment().format('w');

      // For weekly calories differential data.
      [...state.allJournalEntriesList]
        .splice(0, 7)
        .sort((a, b) => b.createdOn - a.createdOn)
        .filter(a => a.CaloriesEntry)
        .map((item, index, self) => {
          if (week !== moment(item.createdOn, 'x').format('w')) {
            count += 1;
            weeklyCalDiff.push(Math.round((weeklyCalDiffSum / 7) * 100) / 100);
            weeklyCalDiffSum = 0;
            weeklyCalDiffSum += item.CaloriesEntry.caloriesDifferential
              ? parseFloat(item.CaloriesEntry.caloriesDifferential, 10)
              : 0;
            week = moment(item.createdOn, 'x').format('w');
          } else if (self.length - 1 === index) {
            count += 1;
            weeklyCalDiffSum += item.CaloriesEntry.caloriesDifferential
              ? parseFloat(item.CaloriesEntry.caloriesDifferential, 10)
              : 0;
            weeklyCalDiff.push(Math.round((weeklyCalDiffSum / 7) * 100) / 100);
            weeklyCalDiffSum = 0;
          } else {
            weeklyCalDiffSum += item.CaloriesEntry.caloriesDifferential
              ? parseFloat(item.CaloriesEntry.caloriesDifferential, 10)
              : 0;
          }
        });

      Array(7 - count)
        .fill()
        .map(() => {
          weeklyCalDiff.push(0);
        });

      count = 0;

      // For monthly weight data.
      [...state.allJournalEntriesList]
        .splice(0, 7)
        .sort((a, b) => b.createdOn - a.createdOn)
        .filter(a => a.WeightLog)
        .map((item, index, self) => {
          if (month !== moment(item.createdOn, 'x').format('MMM')) {
            count += 1;
            monthlyWeights.push(
              Math.round((monthlyWeightSum / daysInMonth) * 100) / 100,
            );
            monthlyWeightSum = 0;
            monthlyWeightSum += parseFloat(item.WeightLog.weight, 10);
            month = moment(item.createdOn, 'x').format('MMM');
          } else if (self.length - 1 === index) {
            count += 1;
            monthlyWeightSum += parseFloat(item.WeightLog.weight, 10);
            monthlyWeights.push(
              Math.round((monthlyWeightSum / daysInMonth) * 100) / 100,
            );
            monthlyWeightSum = 0;
          } else {
            monthlyWeightSum += parseFloat(item.WeightLog.weight, 10);
          }
        });

      Array(7 - count)
        .fill()
        .map(() => {
          monthlyWeights.push(0);
        });

      count = 0;
      month = moment(date).format('MMM');

      // For monthly outlook data.
      [...state.allJournalEntriesList]
        .splice(0, 7)
        .sort((a, b) => b.createdOn - a.createdOn)
        .filter(a => a.DailyEntry)
        .map((item, index, self) => {
          if (month !== moment(item.createdOn, 'x').format('MMM')) {
            count += 1;
            monthlyOutlooks.push(
              Math.round((monthlyOutlookSum / daysInMonth) * 100) / 100,
            );
            monthlyOutlookSum = 0;
            monthlyOutlookSum += parseInt(item.DailyEntry.feelingRate, 10);
            month = moment(item.createdOn, 'x').format('MMM');
          } else if (self.length - 1 === index) {
            count += 1;
            monthlyOutlookSum += parseInt(item.DailyEntry.feelingRate, 10);
            monthlyOutlooks.push(
              Math.round((monthlyOutlookSum / daysInMonth) * 100) / 100,
            );

            monthlyOutlookSum = 0;
          } else {
            monthlyOutlookSum += parseInt(item.DailyEntry.feelingRate, 10);
          }
        });

      Array(7 - count)
        .fill()
        .map(() => {
          monthlyOutlooks.push(0);
        });

      count = 0;
      month = moment(date).format('MMM');

      // For monthly calories differential data.
      [...state.allJournalEntriesList]
        .splice(0, 7)
        .sort((a, b) => b.createdOn - a.createdOn)
        .filter(a => a.CaloriesEntry)
        .map((item, index, self) => {
          if (month !== moment(item.createdOn, 'x').format('MMM')) {
            count += 1;
            monthlyCalDiff.push(
              Math.round((monthlyCalDiffSum / daysInMonth) * 100) / 100,
            );
            monthlyCalDiffSum = 0;
            monthlyCalDiffSum += item.CaloriesEntry.caloriesDifferential
              ? parseFloat(item.CaloriesEntry.caloriesDifferential, 10)
              : 0;
            month = moment(item.createdOn, 'x').format('MMM');
          } else if (self.length - 1 === index) {
            count += 1;
            monthlyCalDiffSum += item.CaloriesEntry.caloriesDifferential
              ? parseFloat(item.CaloriesEntry.caloriesDifferential, 10)
              : 0;
            monthlyCalDiff.push(
              Math.round((monthlyCalDiffSum / daysInMonth) * 100) / 100,
            );
            monthlyCalDiffSum = 0;
          } else {
            monthlyCalDiffSum += item.CaloriesEntry.caloriesDifferential
              ? parseFloat(item.CaloriesEntry.caloriesDifferential, 10)
              : 0;
          }
        });

      Array(7 - count)
        .fill()
        .map(() => {
          monthlyCalDiff.push(0);
        });

      count = 0;
      month = moment(date).format('MMM');

      // For yearly weight data.
      [...state.allJournalEntriesList]
        .splice(0, 7)
        .sort((a, b) => b.createdOn - a.createdOn)
        .filter(a => a.WeightLog)
        .map((item, index, self) => {
          if (year !== moment(item.createdOn, 'x').format('YYYY')) {
            count += 1;
            yearlyWeights.push(
              Math.round((yearlyWeightSum / 365.24) * 100) / 100,
            );
            yearlyWeightSum = 0;
            yearlyWeightSum += parseFloat(item.WeightLog.weight, 10);
            year = moment(item.createdOn, 'x').format('YYYY');
          } else if (self.length - 1 === index) {
            count += 1;
            yearlyWeightSum += parseFloat(item.WeightLog.weight, 10);
            yearlyWeights.push(
              Math.round((yearlyWeightSum / 365.24) * 100) / 100,
            );
            yearlyWeightSum = 0;
          } else {
            yearlyWeightSum += parseFloat(item.WeightLog.weight, 10);
          }
        });

      Array(7 - count)
        .fill()
        .map(() => {
          yearlyWeights.push(0);
        });

      count = 0;
      year = moment(date).format('YYYY');

      // For yearly outlook data.
      [...state.allJournalEntriesList]
        .splice(0, 7)
        .sort((a, b) => b.createdOn - a.createdOn)
        .filter(a => a.DailyEntry)
        .map((item, index, self) => {
          if (year !== moment(item.createdOn, 'x').format('YYYY')) {
            count += 1;
            yearlyOutlooks.push(
              Math.round((yearlyOutlookSum / 365.24) * 100) / 100,
            );
            yearlyOutlookSum = 0;
            yearlyOutlookSum += parseInt(item.DailyEntry.feelingRate, 10);
            year = moment(item.createdOn, 'x').format('YYYY');
          } else if (self.length - 1 === index) {
            count += 1;
            yearlyOutlookSum += parseInt(item.DailyEntry.feelingRate, 10);
            yearlyOutlooks.push(
              Math.round((yearlyOutlookSum / 365.24) * 100) / 100,
            );

            yearlyOutlookSum = 0;
          } else {
            yearlyOutlookSum += parseInt(item.DailyEntry.feelingRate, 10);
          }
        });

      Array(7 - count)
        .fill()
        .map(() => {
          yearlyOutlooks.push(0);
        });

      count = 0;
      year = moment(date).format('YYYY');

      // For yearly calories differential data.
      [...state.allJournalEntriesList]
        .splice(0, 7)
        .sort((a, b) => b.createdOn - a.createdOn)
        .filter(a => a.CaloriesEntry)
        .map((item, index, self) => {
          if (year !== moment(item.createdOn, 'x').format('YYYY')) {
            count += 1;
            yearlyCalDiff.push(
              Math.round((yearlyCalDiffSum / 365.24) * 100) / 100,
            );
            yearlyCalDiffSum = 0;
            yearlyCalDiffSum += item.CaloriesEntry.caloriesDifferential
              ? parseFloat(item.CaloriesEntry.caloriesDifferential, 10)
              : 0;
            year = moment(item.createdOn, 'x').format('YYYY');
          } else if (self.length - 1 === index) {
            count += 1;
            yearlyCalDiffSum += item.CaloriesEntry.caloriesDifferential
              ? parseFloat(item.CaloriesEntry.caloriesDifferential, 10)
              : 0;
            yearlyCalDiff.push(
              Math.round((yearlyCalDiffSum / 365.24) * 100) / 100,
            );
            yearlyCalDiffSum = 0;
          } else {
            yearlyCalDiffSum += item.CaloriesEntry.caloriesDifferential
              ? parseFloat(item.CaloriesEntry.caloriesDifferential, 10)
              : 0;
          }
        });

      Array(7 - count)
        .fill()
        .map(() => {
          yearlyCalDiff.push(0);
        });
      return {
        ...state,
        allJournalEntriesList: state.allJournalEntriesList,
        dailyWeightList: weights,
        dailyOutlookList: outlooks,
        dailyCaloriesDiffList: calDiff,
        weeklyWeightList: weeklyWeights.splice(0, 7),
        weeklyOutlookList: weeklyOutlooks.splice(0, 7),
        weeklyCaloriesDiffList: weeklyCalDiff.splice(0, 7),
        monthlyWeightList: monthlyWeights.splice(0, 7),
        monthlyOutlookList: monthlyOutlooks.splice(0, 7),
        monthlyCaloriesDiffList: monthlyCalDiff.splice(0, 7),
        yearlyWeightList: yearlyWeights.splice(0, 7),
        yearlyOutlookList: yearlyOutlooks.splice(0, 7),
        yearlyCaloriesDiffList: yearlyCalDiff.splice(0, 7),
      };
    }
    default:
      return state;
  }
};

export default journalReducer;
