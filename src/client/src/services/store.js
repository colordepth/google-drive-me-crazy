import { configureStore, combineReducers } from '@reduxjs/toolkit';
import localStorage from 'redux-persist/lib/storage';
import sessionStorage from 'redux-persist/lib/storage/session';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import directoryTreeReducer from './directoryTreeSlice';
import currentDirectoryReducer from './currentDirectorySlice';
import userReducer from './userSlice';
import pathReducer from './pathSlice';
import tabReducer from './tabSlice';

const userPersistConfig = {
  key: 'user',
  storage: localStorage
}

const tabPersistConfig = {
  key: 'tab',
  storage: sessionStorage
}

const directoryPersistConfig = {
  key: 'directory',
  storage: 'indexeddbssssssss'
}

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const reducers = combineReducers({
  path: pathReducer,
  directoryTree: directoryTreeReducer,
  currentDirectory: currentDirectoryReducer,
  tabs: tabReducer,
  users: persistedUserReducer
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
