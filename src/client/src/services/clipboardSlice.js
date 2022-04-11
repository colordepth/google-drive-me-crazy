import { createSlice } from "@reduxjs/toolkit";

export const clipboardSlice = createSlice({
  name: 'clipboard',
  initialState: {
    entities: [],
    mode: null  // 'copy' or 'cut'
  },
  reducers: {
    clearClipboard: state => {
      state.entities.length = 0;
      state.mode = null;
      console.log("Cleared!");
    },
    setClipboard: (state, action) => {
      const { mode, entities } = action.payload;

      state.mode = mode;
      state.entities = entities;
    }
  }
});

export const { clearClipboard, setClipboard } = clipboardSlice.actions;

export const selectClipboard = state => state.clipboard;

export default clipboardSlice.reducer;
