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
      activePathIndex: 0,
      highlightedEntities: {}
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
      });

      targetTab.highlightedEntities = {};

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
    },
    toggleHighlight: (state, action) => {
      const { tabID, targetFile } = action.payload;
      const tab = state.tabs.find(tab => tab.id === tabID);
      const existingFile = Object.keys(tab.highlightedEntities).find(entityID => entityID === targetFile.id);
      console.log("Toggle", existingFile);

      if (!existingFile) tab.highlightedEntities[targetFile.id] = targetFile;
      else delete tab.highlightedEntities[targetFile.id];
    },
    clearHighlights: (state, action) => {
      const tabID = action.payload;
      const tab = state.tabs.find(tab => tab.id === tabID);
      
      tab.highlightedEntities = {};
    }
  }
});

export const {
  switchActiveTab,
  addTab,
  deleteTab,
  openPath,
  pathHistoryBack,
  pathHistoryForward,
  toggleHighlight,
  clearHighlights
} = tabSlice.actions;

export const createTab = (tabInfo={}) => dispatch => {
  const pathObject = tabInfo.pathObject || {
    name: 'Dashboard',
    path: 'dashboard',
    userID: null
  };

  const newTab = {
    id: uuidv4(),
    pathHistory: [pathObject],
    activePathIndex: 0,
    highlightedEntities: {}
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
export const selectHighlightedStatus = (tabID, fileID) => state => selectTab(tabID)(state).highlightedEntities[fileID];

export default tabSlice.reducer;
