/* eslint-disable no-nested-ternary */
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

const initialState = {
  theme: {},
  themes: [],
  currentTheme: {},
  themesWithFrequency: {},
  repeatedTheme: {},
  userRepeatedThemes: [],
  clearedThemeDays: {},
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
      const newTheme = {
        ...action.payload,
        id: Math.random().toString(36).slice(2),
      };

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
      const temp = Array.from(state.themes);
      const index = temp.findIndex(i => i.id === action.payload.id);
      if (index !== -1) temp[index] = {...temp[index], ...action.payload.data};

      const repThemeTemp = Array.from(state.userRepeatedThemes);
      const ind = repThemeTemp.findIndex(i => i.id === action.payload.id);
      if (ind !== -1)
        repThemeTemp[ind] = {...repThemeTemp[ind], ...action.payload.data};

      return {
        ...state,
        themes: temp,
        userRepeatedThemes: repThemeTemp,
        theme: {...state.theme, ...action.payload.data},
        currentTheme:
          state.currentTheme?.id === action.payload.id
            ? {...state.currentTheme, ...action.payload.data}
            : state.currentTheme,
      };
    }
    case DELETE_THEME: {
      const temp = Array.from(state.themes);
      const index = temp.findIndex(i => i.id === action.payload.id);
      temp.splice(index, 1);

      return {
        ...state,
        themes: temp,
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
      const temp = Array.from(state.userRepeatedThemes);
      const index = temp.findIndex(i => i.id === action.payload.id);
      temp[index] = {...temp[index], ...action.payload.data};

      return {
        ...state,
        userRepeatedThemes: temp,
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
      const repeatedThemes = (
        action.payload
          ? [...action.payload]
          : state.userRepeatedThemes.length > 0
          ? [...state.userRepeatedThemes]
          : []
      ).sort((a, b) => a.createdOn - b.createdOn);

      for (let i = 0; i < repeatedThemes.length; i += 1) {
        const item = repeatedThemes[i];
        const itemDateDay = new Date(item.themeDay).getDate();

        const date = new Date(item.themeDay);
        const dtMonth = date.getMonth() + 1;
        const dtYear = date.getFullYear();
        let daysInMonth = new Date(dtYear, dtMonth, 0).getDate();
        const endDate = date.setDate(
          date.getDate() + (parseInt(item.daysToFollow, 10) - 1),
        );

        if (action.daysInCurrentMonth) {
          daysInMonth += action.daysInCurrentMonth;
        }

        if (item.frequency === 'Daily') {
          for (let j = 0; j <= daysInMonth - itemDateDay; j += 1) {
            const d = new Date(item.themeDay);
            d.setDate(d.getDate() + j);
            let check = -1;

            if (
              moment(d).format('YYYY-MM-DD') <=
              moment(endDate).format('YYYY-MM-DD')
            ) {
              if (item.deletedThemes?.length > 0) {
                check = item.deletedThemes.findIndex(
                  a =>
                    moment(a).format('YYYY-MM-DD') ===
                    moment(d).format('YYYY-MM-DD'),
                );
              }

              if (check === -1) {
                calendarDates[moment(d).format('YYYY-MM-DD')] = {
                  selected: true,
                  customStyles: {
                    container: {
                      borderWidth: 2,
                      borderColor: item.color,
                      backgroundColor:
                        moment(d).format('YYYY-MM-DD') ===
                        moment().format('YYYY-MM-DD')
                          ? item.color
                          : colors.transparent,
                    },
                  },
                  theme: repeatedThemes[i],
                };

                if (
                  moment(d).format('YYYY-MM-DD') ===
                  moment().format('YYYY-MM-DD')
                ) {
                  curThemeTemp = item;
                }
              }
            }
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
            let check = -1;

            if (
              moment(d).format('YYYY-MM-DD') <=
              moment(endDate).format('YYYY-MM-DD')
            ) {
              if (item.deletedThemes?.length > 0) {
                check = item.deletedThemes.findIndex(
                  a =>
                    moment(a).format('YYYY-MM-DD') ===
                    moment(d).format('YYYY-MM-DD'),
                );
              }

              if (check === -1) {
                calendarDates[moment(d).format('YYYY-MM-DD')] = {
                  selected: true,
                  customStyles: {
                    container: {
                      borderWidth: 2,
                      borderColor: item.color,
                      backgroundColor:
                        moment(d).format('YYYY-MM-DD') ===
                        moment().format('YYYY-MM-DD')
                          ? item.color
                          : colors.transparent,
                    },
                  },
                  theme: repeatedThemes[i],
                };

                if (
                  moment(d).format('YYYY-MM-DD') ===
                  moment().format('YYYY-MM-DD')
                ) {
                  curThemeTemp = item;
                }
              }
            }
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
            let check = -1;

            if (
              moment(d).format('YYYY-MM-DD') <=
              moment(endDate).format('YYYY-MM-DD')
            ) {
              if (item.deletedThemes?.length > 0) {
                check = item.deletedThemes.findIndex(
                  a =>
                    moment(a).format('YYYY-MM-DD') ===
                    moment(d).format('YYYY-MM-DD'),
                );
              }

              if (check === -1) {
                calendarDates[moment(d).format('YYYY-MM-DD')] = {
                  selected: true,
                  customStyles: {
                    container: {
                      borderWidth: 2,
                      borderColor: item.color,
                      backgroundColor:
                        moment(d).format('YYYY-MM-DD') ===
                        moment().format('YYYY-MM-DD')
                          ? item.color
                          : colors.transparent,
                    },
                  },
                  theme: repeatedThemes[i],
                };

                if (
                  moment(d).format('YYYY-MM-DD') ===
                  moment().format('YYYY-MM-DD')
                ) {
                  curThemeTemp = item;
                }
              }
            }
          }
        }

        if (item.frequency === 'Monthly') {
          const d = new Date(item.themeDay);
          d.setDate(d.getDate() + (action.daysInCurrentMonth || 0));
          let check = -1;

          if (
            moment(d).format('YYYY-MM-DD') <=
            moment(endDate).format('YYYY-MM-DD')
          ) {
            if (item.deletedThemes?.length > 0) {
              check = item.deletedThemes.findIndex(
                a =>
                  moment(a).format('YYYY-MM-DD') ===
                  moment(d).format('YYYY-MM-DD'),
              );
            }

            if (check === -1) {
              calendarDates[moment(d).format('YYYY-MM-DD')] = {
                selected: true,
                customStyles: {
                  container: {
                    borderWidth: 2,
                    borderColor: item.color,
                    backgroundColor:
                      moment(d).format('YYYY-MM-DD') ===
                      moment().format('YYYY-MM-DD')
                        ? item.color
                        : colors.transparent,
                  },
                },
                theme: repeatedThemes[i],
              };

              if (
                moment(d).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
              ) {
                curThemeTemp = item;
              }
            }
          }
        }

        if (item.frequency === 'Never') {
          const d = new Date(item.themeDay);
          let check = -1;

          if (
            moment(d).format('YYYY-MM-DD') <=
            moment(endDate).format('YYYY-MM-DD')
          ) {
            if (item.deletedThemes?.length > 0) {
              check = item.deletedThemes.findIndex(
                a =>
                  moment(a).format('YYYY-MM-DD') ===
                  moment(d).format('YYYY-MM-DD'),
              );
            }

            if (check === -1) {
              calendarDates[moment(d).format('YYYY-MM-DD')] = {
                selected: true,
                customStyles: {
                  container: {
                    borderWidth: 2,
                    borderColor: item.color,
                    backgroundColor:
                      moment(d).format('YYYY-MM-DD') ===
                      moment().format('YYYY-MM-DD')
                        ? item.color
                        : colors.transparent,
                  },
                },
                theme: repeatedThemes[i],
              };

              if (
                moment(d).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
              ) {
                curThemeTemp = item;
              }
            }
          }
        }
      }

      if (!calendarDates[moment().format('YYYY-MM-DD')]) {
        calendarDates[moment().format('YYYY-MM-DD')] = {
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
