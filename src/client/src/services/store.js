import { configureStore, combineReducers } from '@reduxjs/toolkit';
import sessionStorage from 'redux-persist/lib/storage';
import sessionStorage from 'redux-persist/lib/storage/session';
import {
  persistReducer,
  // FLUSH,
  // REHYDRATE,
  // PAUSE,
  // PERSIST,
  // PURGE,
  // REGISTER,
} from 'redux-persist';

import directoryTreeReducer from './directoryTreeSlice';
import userReducer from './userSlice';
import tabReducer from './tabSlice';
import clipboardReducer from './clipboardSlice';

const userPersistConfig = {
  key: 'user',
  storage: sessionStorage
}

const tabPersistConfig = {
  key: 'tab',
  storage: sessionStorage
}

const directoryPersistConfig = {
  key: 'directory',
  storage: 'indexeddb'
}

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const reducers = combineReducers({
  directoryTree: directoryTreeReducer,
  tabs: tabReducer,
  users: persistedUserReducer,
  clipboard: clipboardReducer
});

export default configureStore({
	reducer: reducers,
  devTools: process.env.NODE_ENV !== 'production',
  // *Following is recommended to be enabled for redux-persist
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }),
  // *Following is enabled for better performance in development environment.
  // *Enable these checks during development sometime (just comment out following and uncomment above)
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  })
});
