import { createSlice } from '@reduxjs/toolkit';
import { getAllFolders } from './files.js';

/*
 * Files and folders are different for optimization's sake
 * Folders' list will be separately fetched, and its' tree data structure built.
 * This will generate a directory tree quicker and will allow for faster navigation 
 * and generating file paths instead of recursively calling Google for parent folder information
*/

export const directoryTreeSlice = createSlice({
  name: 'directoryTree',
  initialState: {
    folders: [],
    files: []
  },
  reducers: {
    setFoldersTo: (state, action) => {
      state.folders = action.payload;
    }
  }
});

export const fetchAllFolders = (requestedFields=['id', 'name', 'parents']) => dispatch  => {
  getAllFolders(requestedFields)
    .then(folders => {
      dispatch(setFoldersTo(folders));
    })
}

// Actions
export const { setFoldersTo } = directoryTreeSlice.actions;

// Selectors
export const selectFolders = state => state.directoryTree.folders;
export const selectFiles = state => state.directoryTree.files;
export const selectTree = state => [...state.directoryTree.folders, ...state.directoryTree.files];

// Reducer
export default directoryTreeSlice.reducer;