import { createSlice } from '@reduxjs/toolkit';

export const tabSlice = createSlice({
  name: 'tabs',
  initialState: {
    activeTabID: 'default',
    tabHistory: [],
    tabs: [{
      id: 'default',
      path: 'root'
    }]
  },
  reducers: {
    switchActiveTab: (state, action) => {
      state.tabHistory.push(state.activeTabID);
      state.activeTabID = action.payload;
    },
    createTab: state => {
      const newTabID = 'alallaa';

      state.tabs.push({
        id: newTabID,
        path: 'root'
      });

      state.tabHistory.push(state.activeTabID);
      state.activeTabID = newTabID;
    },
    deleteTab: (state, action) => {
      state.tabs = state.tabs.filter(tab => tab.id !== action.payload);
      state.tabHistory = state.tabHistory.filter(tabID => tabID !== action.payload);
    }
  }
});

export const { switchActiveTab, createTab, deleteTab } = tabSlice.actions;

export const selectActiveTabID = state => state.tabs.activeTabID;
export const selectTabHistory = state => state.tabs.tabHistory;
export const selectTabs = state => state.tabs.tabs;

export default tabSlice.reducer;
