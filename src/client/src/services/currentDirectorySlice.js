import { createSlice } from '@reduxjs/toolkit';

export const currentDirectorySlice = createSlice({
  name: "currentDirectory",
  initialState: {
    files: null,
    selectedFilesID: []
  },
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    addToSelection: (state, action) => {
      const fileID = action.payload;
      state.selectedFiles.push(fileID);
    },
    removeFromSelection: (state, action) => {
      const fileID = action.payload;
      state.selectedFiles = state.selectedFiles.filter(file => file.id !== fileID);
    }
  }
});

export const { setFiles, addToSelection, removeFromSelection } = currentDirectorySlice.actions;
export const selectFiles = (state) => state.currentDirectory.files;
export const selectedFilesID = (state) => state.currentDirectory.selectedFilesID;

export default currentDirectorySlice.reducer;