import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export const tabSlice = createSlice({
  name: 'tabs',
  initialState: {
    tabHistory: ['default'],
    tabs: [
    {
      id: 'default',
      pathHistory: [{
        path: 'dashboard',
        name: 'Dashboard',
        userID: null
      }],
      activePathIndex: 0
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
    openPath: (state, action) => {
      const targetID = action.payload.id;
      const targetTab = state.tabs.find(tab => tab.id === targetID);
      const pathObject = action.payload.path;

      // Clear path history after activePathIndex
      targetTab.pathHistory = targetTab.pathHistory.slice(0, targetTab.activePathIndex+1);

      targetTab.pathHistory.push({
        path: pathObject.path,
        name: pathObject.name,
        userID: pathObject.userID || null
      })

      targetTab.activePathIndex += 1;
    },
    pathHistoryBack: (state, action) => {
      const targetID = action.payload;
      const targetTab = state.tabs.find(tab => tab.id === targetID);

      targetTab.activePathIndex -= 1;
      if (targetTab.activePathIndex < 0) targetTab.activePathIndex = 0;
    },
    pathHistoryForward: (state, action) => {
      const targetID = action.payload;
      const targetTab = state.tabs.find(tab => tab.id === targetID);
      const noOfPaths = targetTab.pathHistory.length;

      targetTab.activePathIndex += 1;
      if (targetTab.activePathIndex >= noOfPaths){
        targetTab.activePathIndex = noOfPaths - 1;
      }
    }
  }
});

export const { switchActiveTab, addTab, deleteTab, openPath, pathHistoryBack, pathHistoryForward } = tabSlice.actions;

export const createTab = (tabInfo={}) => dispatch => {
  const pathObject = tabInfo.pathObject || {
    name: 'Dashboard',
    path: 'dashboard',
    userID: null
  };

  const newTab = {
    id: uuidv4(),
    pathHistory: [pathObject],
    activePathIndex: 0
  }
  dispatch(addTab(newTab));

  return newTab.id;
}

export const selectActiveTab = state => selectTabs(state).find(tab => tab.id === selectActiveTabID(state));
export const selectActiveTabID = state => selectTabHistory(state).at(-1);
export const selectTabHistory = state => state.tabs.tabHistory;
export const selectTabs = state => state.tabs.tabs;
export const selectTab = tabID => state => selectTabs(state).find(tab => tab.id === tabID);
export const selectActivePath = tabID => state => {
  const tab = selectTab(tabID)(state);
  return tab.pathHistory.at(tab.activePathIndex);
}

export default tabSlice.reducer;
