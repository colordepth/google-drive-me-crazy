import { configureStore } from '@reduxjs/toolkit';
import pathReducer from './pathSlice';
import directoryTreeSlice from './directoryTreeSlice';
import currentDirectorySlice from './currentDirectorySlice';

export default configureStore({
	reducer: {
    path: pathReducer,
    directoryTree: directoryTreeSlice,
    currentDirectory: currentDirectorySlice
  }
});