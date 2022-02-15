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
      state.selectedFilesID.add(fileID);
    },
    removeFromSelection: (state, action) => {
      const targetFileID = action.payload;
      state.selectedFilesID = state.selectedFilesID.filter(id => id !== targetFileID);
    },
    switchSelection: (state, action) => {
      const  targetFileID = action.payload;
      if (state.selectedFilesID.find(id => id === targetFileID)) 
        state.selectedFilesID = state.selectedFilesID.filter(id => id !== targetFileID);
      else
        state.selectedFilesID.push(action.payload);
    },
    clearFilesList: (state) => {
      state.filesList = null;
      state.selectedFilesID.length = 0;
    }
  }
});

export const { setFilesList, addToSelection, removeFromSelection, switchSelection, clearFilesList } = currentDirectorySlice.actions;
export const selectFilesList = (state) => state.currentDirectory.filesList;
export const selectSelectedFilesID = (state) => state.currentDirectory.selectedFilesID;

export default currentDirectorySlice.reducer;