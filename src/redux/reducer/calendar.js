import moment from 'moment';
import {colors} from '../../resources';
import {
  ADD_REPEATED_THEME,
  ADD_THEME,
  CLEAR_CURRENT_THEME,
  CLEAR_THEME_DAYS,
  DELETE_THEME,
  EDIT_REPEATED_THEME,
  EDIT_THEME,
  GET_THEMES,
  SET_REPEATED_THEME,
  SET_THEME,
  SET_THEME_WITH_FREQUENCY,
} from '../constants';

const DATE_FORMAT = 'YYYY-MM-DD';

const initialState = {
  theme: {},
  themes: [],
  currentTheme: {},
  themesWithFrequency: {},
  repeatedTheme: {},
  userRepeatedThemes: [],
  clearedThemeDays: {},
};

const createTheme = data => ({
  ...data,
  id: Math.random().toString(36).slice(2),
});

const updateItemsById = (items, id, data) => {
  const nextItems = Array.from(items);
  const index = nextItems.findIndex(item => item.id === id);

  if (index !== -1) {
    nextItems[index] = {...nextItems[index], ...data};
  }

  return nextItems;
};

const removeItemById = (items, id) => {
  const nextItems = Array.from(items);
  const index = nextItems.findIndex(item => item.id === id);

  if (index !== -1) {
    nextItems.splice(index, 1);
  }

  return nextItems;
};

const mergeCurrentThemeIfMatching = (currentTheme, id, data) =>
  currentTheme?.id === id ? {...currentTheme, ...data} : currentTheme;

const formatCalendarDate = value => moment(value).format(DATE_FORMAT);

const getTodayKey = () => moment().format(DATE_FORMAT);

const isToday = value => formatCalendarDate(value) === getTodayKey();

const isDeletedThemeDate = (item, value) => {
  let check = -1;

  if (item.deletedThemes?.length > 0) {
    check = item.deletedThemes.findIndex(
      deletedTheme =>
        formatCalendarDate(deletedTheme) === formatCalendarDate(value),
    );
  }

  return check !== -1;
};

const isWithinThemeRange = (value, endDate) =>
  formatCalendarDate(value) <= formatCalendarDate(endDate);

const createCalendarDateEntry = (item, value) => ({
  selected: true,
  customStyles: {
    container: {
      borderWidth: 2,
      borderColor: item.color,
      backgroundColor: isToday(value) ? item.color : colors.transparent,
    },
  },
  theme: item,
});

const applyThemeToCalendarDate = (
  calendarDates,
  item,
  value,
  endDate,
  currentTheme,
) => {
  if (!isWithinThemeRange(value, endDate) || isDeletedThemeDate(item, value)) {
    return currentTheme;
  }

  calendarDates[formatCalendarDate(value)] = createCalendarDateEntry(item, value);

  return isToday(value) ? item : currentTheme;
};

const getRepeatedThemesForFrequency = (payload, userRepeatedThemes) =>
  (
    payload
      ? [...payload]
      : userRepeatedThemes.length > 0
      ? [...userRepeatedThemes]
      : []
  ).sort((a, b) => a.createdOn - b.createdOn);

const getThemeDaysInMonth = (themeDay, daysInCurrentMonth) => {
  const date = new Date(themeDay);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  let daysInMonth = new Date(year, month, 0).getDate();

  if (daysInCurrentMonth) {
    daysInMonth += daysInCurrentMonth;
  }

  return daysInMonth;
};

const getThemeEndDate = item => {
  const date = new Date(item.themeDay);

  return date.setDate(date.getDate() + (parseInt(item.daysToFollow, 10) - 1));
};

const ensureTodayFallback = calendarDates => {
  const todayKey = getTodayKey();

  if (!calendarDates[todayKey]) {
    calendarDates[todayKey] = {
      selected: true,
      customStyles: {
        container: {
          borderWidth: 2,
          borderColor: colors.secondary,
          backgroundColor: colors.secondary,
        },
      },
    };
  }
};

const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_THEMES: {
      return {
        ...state,
        themes: action.payload,
      };
    }
    case ADD_THEME: {
      const newTheme = createTheme(action.payload);

      return {
        ...state,
        theme: newTheme,
        themes: [...state.themes, newTheme],
      };
    }
    case SET_THEME: {
      return {
        ...state,
        theme: {...state.theme, ...action.payload},
        currentTheme:
          state.currentTheme?.id === action.payload.id
            ? {...state.currentTheme, ...action.payload}
            : state.currentTheme,
      };
    }
    case EDIT_THEME: {
      const temp = updateItemsById(
        state.themes,
        action.payload.id,
        action.payload.data,
      );

      const repThemeTemp = updateItemsById(
        state.userRepeatedThemes,
        action.payload.id,
        action.payload.data,
      );

      return {
        ...state,
        themes: temp,
        userRepeatedThemes: repThemeTemp,
        theme: {...state.theme, ...action.payload.data},
        currentTheme: mergeCurrentThemeIfMatching(
          state.currentTheme,
          action.payload.id,
          action.payload.data,
        ),
      };
    }
    case DELETE_THEME: {
      return {
        ...state,
        themes: removeItemById(state.themes, action.payload.id),
      };
    }
    case SET_REPEATED_THEME: {
      return {
        ...state,
        repeatedTheme: action.payload,
      };
    }
    case ADD_REPEATED_THEME: {
      return {
        ...state,
        userRepeatedThemes: [
          ...state.userRepeatedThemes,
          {
            ...action.payload,
            // id: Math.random().toString(36).slice(2),
          },
        ],
      };
    }
    case EDIT_REPEATED_THEME: {
      return {
        ...state,
        userRepeatedThemes: updateItemsById(
          state.userRepeatedThemes,
          action.payload.id,
          action.payload.data,
        ),
      };
    }
    case CLEAR_CURRENT_THEME: {
      return {
        ...state,
        currentTheme: {},
        repeatedTheme: {},
      };
    }
    case CLEAR_THEME_DAYS: {
      return {
        ...state,
        clearedThemeDays: action.payload,
      };
    }
    case SET_THEME_WITH_FREQUENCY: {
      let curThemeTemp = {};
      const calendarDates = {};
      const repeatedThemes = getRepeatedThemesForFrequency(
        action.payload,
        state.userRepeatedThemes,
      );

      for (let i = 0; i < repeatedThemes.length; i += 1) {
        const item = repeatedThemes[i];
        const itemDateDay = new Date(item.themeDay).getDate();
        const daysInMonth = getThemeDaysInMonth(
          item.themeDay,
          action.daysInCurrentMonth,
        );
        const endDate = getThemeEndDate(item);

        if (item.frequency === 'Daily') {
          for (let j = 0; j <= daysInMonth - itemDateDay; j += 1) {
            const d = new Date(item.themeDay);
            d.setDate(d.getDate() + j);

            curThemeTemp = applyThemeToCalendarDate(
              calendarDates,
              item,
              d,
              endDate,
              curThemeTemp,
            );
          }
        }

        if (item.frequency === 'Weekly') {
          for (
            let j = 0;
            j <= Math.floor((daysInMonth - itemDateDay) / 7);
            j += 1
          ) {
            const d = new Date(item.themeDay);
            d.setDate(d.getDate() + j * 7);

            curThemeTemp = applyThemeToCalendarDate(
              calendarDates,
              item,
              d,
              endDate,
              curThemeTemp,
            );
          }
        }

        if (item.frequency === 'BiWeekly') {
          for (
            let j = 0;
            j <= Math.floor((daysInMonth - itemDateDay) / 7) / 2;
            j += 1
          ) {
            const d = new Date(item.themeDay);
            d.setDate(d.getDate() + j * 14);

            curThemeTemp = applyThemeToCalendarDate(
              calendarDates,
              item,
              d,
              endDate,
              curThemeTemp,
            );
          }
        }

        if (item.frequency === 'Monthly') {
          const d = new Date(item.themeDay);
          d.setDate(d.getDate() + (action.daysInCurrentMonth || 0));

          curThemeTemp = applyThemeToCalendarDate(
            calendarDates,
            item,
            d,
            endDate,
            curThemeTemp,
          );
        }

        if (item.frequency === 'Never') {
          const d = new Date(item.themeDay);

          curThemeTemp = applyThemeToCalendarDate(
            calendarDates,
            item,
            d,
            endDate,
            curThemeTemp,
          );
        }
      }

      ensureTodayFallback(calendarDates);

      return {
        ...state,
        currentTheme: curThemeTemp,
        repeatedTheme: curThemeTemp,
        userRepeatedThemes: repeatedThemes,
        themesWithFrequency: {...calendarDates},
      };
    }
    default:
      return state;
  }
};

export default calendarReducer;
