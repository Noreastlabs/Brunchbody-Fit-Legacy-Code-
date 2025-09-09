import moment from 'moment';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { AppState } from 'react-native';

const DateContext = createContext({
  today: '',
  date: 0,
  month: 0,
  year: 0,
  todoListDate: '',
  setDate: () => {},
  setMonth: () => {},
  setYear: () => {},
  setTodoListDate: () => {},
  resetToToday: () => {},
});

export const DateProvider = ({ children }) => {
  const now = () => moment();
  const appState = useRef(AppState.currentState);
  const hasUserModified = useRef(false);

  const [today, setTodayKey] = useState(() => now().format('YYYY-MM-DD'));
  const [date, setDateState] = useState(() => now().date());
  const [month, setMonthState] = useState(() => now().month() + 1);
  const [year, setYearState] = useState(() => now().year());
  const [todoListDate, setTodoListDate] = useState(() =>
    now().format('YYYY-MM-DD'),
  );

  const setDate = d => {
    hasUserModified.current = true;
    setDateState(d);
  };

  const setMonth = m => {
    hasUserModified.current = true;
    setMonthState(m);
  };

  const setYear = y => {
    hasUserModified.current = true;
    setYearState(y);
  };

  const resetToToday = useCallback(() => {
    const current = now();
    const formatted = current.format('YYYY-MM-DD');

    setTodayKey(formatted);
    setTodoListDate(formatted);
    setDateState(current.date());
    setMonthState(current.month() + 1);
    setYearState(current.year());
    hasUserModified.current = false;
  }, []);

  const updateIfNeeded = useCallback(() => {
    const current = now();
    const newKey = current.format('YYYY-MM-DD');
    if (today !== newKey) {
      setTodayKey(newKey);

      if (!hasUserModified.current) {
        console.log(
          '[DateProvider] Resetting to today (user has not modified)',
        );
        setDateState(current.date());
        setMonthState(current.month() + 1);
        setYearState(current.year());
        setTodoListDate(newKey);
      } else {
        console.log(
          '[DateProvider] Skipping reset — user has manually modified date',
        );
      }
    }
  }, [today]);

  useEffect(() => {
    updateIfNeeded();

    const handleAppStateChange = nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('[DateProvider] App came to foreground. Checking date...');
        updateIfNeeded();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [updateIfNeeded]);

  return (
    <DateContext.Provider
      value={{
        today,
        date,
        month,
        year,
        todoListDate,
        setDate,
        setMonth,
        setYear,
        setTodoListDate,
        resetToToday,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useTodayKey = () => useContext(DateContext);
