import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from '../reducer/auth';
import journalReducer from '../reducer/journal';
import nutritionReducer from '../reducer/nutrition';
import recreationReducer from '../reducer/recreation';
import calendarReducer from '../reducer/calendar';
import exerciseReducer from '../reducer/exercise';
import todoReducer from '../reducer/todo';

const rootReducer = combineReducers({
  auth: authReducer,
  recreation: recreationReducer,
  journal: journalReducer,
  nutrition: nutritionReducer,
  calendar: calendarReducer,
  exercise: exerciseReducer,
  todo: todoReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'auth',
    'recreation',
    'journal',
    'nutrition',
    'calendar',
    'exercise',
    'todo',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

const persistor = persistStore(store);

export { store, persistor };
