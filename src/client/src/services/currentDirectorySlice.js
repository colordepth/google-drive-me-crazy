import { createSlice } from '@reduxjs/toolkit';

export const currentDirectorySlice = createSlice({
  name: "currentDirectory",
  initialState: {
    filesList: null,
    selectedFilesID: []
  },
  reducers: {
    setFilesList: (state, action) => {
      state.filesList = action.payload;
    },
    addToSelection: (state, action) => {
      const fileID = action.payload;
      state.selectedFiles.push(fileID);
    },
    removeFromSelection: (state, action) => {
      const fileID = action.payload;
      state.selectedFiles = state.selectedFiles.filter(file => file.id !== fileID);
    },
    clearFilesList: (state) => {
      state.filesList = null;
    }
  }
});

export const { setFilesList, addToSelection, removeFromSelection, clearFilesList } = currentDirectorySlice.actions;
export const selectFilesList = (state) => state.currentDirectory.filesList;
export const selectedFilesID = (state) => state.currentDirectory.selectedFilesID;

export default currentDirectorySlice.reducer;