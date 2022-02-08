import { configureStore } from '@reduxjs/toolkit';
import pathReducer from './pathSlice';
import directoryTreeSlice from './directoryTreeSlice';

export default configureStore({
	reducer: {
    path: pathReducer,
    directoryTree: directoryTreeSlice
  }
});