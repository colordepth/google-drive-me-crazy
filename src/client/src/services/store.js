import { configureStore } from '@reduxjs/toolkit';
import pathReducer from './pathSlice';

export default configureStore({
	reducer: {
    path: pathReducer
  }
});