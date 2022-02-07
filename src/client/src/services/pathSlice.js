import { createSlice } from '@reduxjs/toolkit';
import { getFileByID } from './files';

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
export const calculatePathFromFile = file => dispatch => {
  new Promise(async (resolve, reject) => {
    let currentFile = file;
    let path = [];
    while (currentFile.parents) {
      path.unshift(currentFile);
      currentFile = await getFileByID(currentFile.parents[0], ['*']);
    }
    path.unshift(currentFile);
    dispatch(setPathTo(path));
  });
}

export const selectPath = state => state.path.folders;
export const selectBreadcrumbItems = state => state.path.breadcrumbItems;

export default pathSlice.reducer;