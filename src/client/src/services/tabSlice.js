import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export const tabSlice = createSlice({
  name: 'tabs',
  initialState: {
    tabHistory: ['default'],
    tabs: [{
      id: 'default',
      name: 'College',
      path: 'root',
      userID: 'qvuQXkR7SAA='
    },
    {
      id: uuidv4(),
      name: 'Storage Analyzer',
      path: 'storage-analyzer',
      userID: 'qvuQXkR7SAA='
    },
    {
      id: uuidv4(),
      name: 'Dashboard',
      path: 'dashboard',
      userID: null
    }]
  },
  reducers: {
    switchActiveTab: (state, action) => {
      const tabID = action.payload;
      if (!state.tabs.find(tab => tab.id === tabID)) return;
      state.tabHistory.push(tabID);
    },
    addTab: (state, action) => {
      const tabInfo = action.payload;
      state.tabs.push(tabInfo);
    },
    deleteTab: (state, action) => {
      // Do not delete tab if its the last tab
      if (state.tabs.length === 1) return;

      state.tabs = state.tabs.filter(tab => tab.id !== action.payload);
      state.tabHistory = state.tabHistory.filter(tabID => tabID !== action.payload);
      
      // If tab history is null, push first tab into it
      if (state.tabHistory.length === 0) {
        state.tabHistory.push(state.tabs[0].id);
      }
    },
    updateTabInfo: (state, action) => {
      const targetID = action.payload.id;
      const targetTab = state.tabs.find(tab => tab.id === targetID);

      Object.keys(action.payload).forEach(key => {
        targetTab[key] = action.payload[key];
      });
    }
  }
});

export const { switchActiveTab, addTab, deleteTab, updateTabInfo } = tabSlice.actions;

export const createTab = (tabInfo={}) => dispatch => {
  const path = tabInfo.path || 'dashboard';

  const newTab = {
    id: uuidv4(),
    name: tabInfo.name || (path === 'dashboard' ? 'Dashboard' : 'New Tab'),
    path,
    userID: tabInfo.userID || null
  }
  dispatch(addTab(newTab));

  return newTab.id;
}

export const selectActiveTab = state => selectTabs(state).find(tab => tab.id === selectActiveTabID(state));
export const selectActiveTabID = state => selectTabHistory(state).at(-1);
export const selectTabHistory = state => state.tabs.tabHistory;
export const selectTabs = state => state.tabs.tabs;
export const selectTab = tabID => state => selectTabs(state).find(tab => tab.id === tabID);

export default tabSlice.reducer;
