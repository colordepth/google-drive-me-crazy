import { createSlice } from '@reduxjs/toolkit';
import { getFileByID } from './files';
import { selectFolders } from './directoryTreeSlice';
import store from './store';

function generateBreadCrumbItems(folderList) {
  let result = [];

  folderList.forEach(file => result.push({ icon: "folder-open", intent: "primary", text: file.name }));
  result[0] = { icon: "cloud", text: "My Drive" };
  return result;
}

export const pathSlice = createSlice({
  name: 'path',
  initialState: {
    folders: [],
    breadcrumbItems: []
  },
  reducers: {     // Redux Toolkit's createSlice API uses Immer to allow "mutating" immutable updates
    popFromPath: state => {
      state.folders.pop();
      state.breadcrumbItems.pop();
      state.breadcrumbItems = generateBreadCrumbItems(state.folders);
    },
    addToPath: (state, action) => {
      const file = action.payload;
      state.folders.push(file);
      state.breadcrumbItems = generateBreadCrumbItems(state.folders);
    },
    setPathTo: (state, action) => {
      state.folders = action.payload;
      state.breadcrumbItems = generateBreadCrumbItems(state.folders);
    }
  }
});

// maybe setPathTo doesnt need to be exported
export const { popFromPath, addToPath, setPathTo } = pathSlice.actions;

// TODO: handle network/auth error. It should get caught in the promise of useEffect in App.jsx
// TODO2:  Refactor repetitive code
export const calculatePathFromFile = file => dispatch => {
  const cachedFolders = selectFolders(store.getState());
  
  if (cachedFolders && cachedFolders.length) {
    return new Promise((resolve, reject) => {
      let currentFile = file;
      let path = [];

      while (currentFile.parents) {
        const parentID = currentFile.parents[0];
        path.unshift(currentFile);
        currentFile = selectFolders(store.getState()).find(folder => folder.id === parentID);
      }
      path.unshift(currentFile);
      dispatch(setPathTo(path));
    });
  }

  new Promise(async (resolve, reject) => {
    let currentFile = file;
    let path = [];
    while (currentFile.parents) {
      path.unshift(currentFile);
      currentFile = await getFileByID(currentFile.parents[0], ['name', 'id', 'parents']);
    }
    path.unshift(currentFile);
    dispatch(setPathTo(path));
  });
}

export const calculatePathFromFileID = fileID => dispatch => {
  const cachedFolders = selectFolders(store.getState());
  
  if (cachedFolders && cachedFolders.length) {
    return new Promise((resolve, reject) => {
      let currentFile = cachedFolders.find(file => file.id === fileID);
      let path = [];

      while (currentFile && currentFile.parents) {
        const parentID = currentFile.parents[0];
        path.unshift(currentFile);
        currentFile = selectFolders(store.getState()).find(folder => folder.id === parentID);
      }
      path.unshift(currentFile);
      dispatch(setPathTo(path));
    });
  }

  new Promise(async (resolve, reject) => {
    let currentFile = await getFileByID(fileID, ['name', 'id', 'parents']);
    let path = [];
    while (currentFile.parents) {
      path.unshift(currentFile);
      currentFile = await getFileByID(currentFile.parents[0], ['name', 'id', 'parents']);
    }
    path.unshift(currentFile);
    dispatch(setPathTo(path));
  });
}

export const selectPath = state => state.path.folders;
export const selectBreadcrumbItems = state => state.path.breadcrumbItems;

export default pathSlice.reducer;
