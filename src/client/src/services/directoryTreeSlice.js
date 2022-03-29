import { createSlice } from '@reduxjs/toolkit';
import { getAllFolders, getAllFiles } from './files.js';

/*
 * Files and folders are different for optimization's sake
 * Folders' list will be separately fetched, and its' tree data structure built.
 * This will generate a directory tree quicker and will allow for faster navigation 
 * and generating file paths instead of recursively calling Google for parent folder information
*/

export const directoryTreeSlice = createSlice({
  name: 'directoryTree',
  initialState: {
    folders: null,
    files: null,
    directoryTree: {}
  },
  reducers: {
    setFoldersTo: (state, action) => {
      state.folders = action.payload;
    },
    setFilesTo: (state, action) => {
      state.files = action.payload;
    },
    setDirectoryTreeTo: (state, action) => {
      state.directoryTree = action.payload;
    }
  }
});

export const fetchAllFolders = (requestedFields=['id', 'name', 'parents', 'mimeType', 'quotaBytesUsed']) => dispatch  => {
  return getAllFolders(requestedFields)
    .then(folders => {
      dispatch(setFoldersTo(folders));
      return folders;
    })
}

export const fetchAllFiles = (requestedFields=['id', 'name', 'parents', 'mimeType', 'quotaBytesUsed']) => dispatch  => {
  return getAllFiles(requestedFields, "mimeType != 'application/vnd.google-apps.folder'")
    .then(files => {
      dispatch(setFilesTo(files));
      return files;
    })
}

function buildDirectoryStructure(folders, files) {
  let allFiles = [...folders, ...files];
  let directoryTree = {};

  allFiles.forEach(file => {
    directoryTree[file.id] = {...file};
    if (file.isRoot)
      directoryTree['root'] = directoryTree[file.id];     // Check if modifying file.id file also modifies root file
  });

  allFiles.forEach(file => {
    if (file.parents) {
      const parentID = file.parents[0];
      if (!directoryTree[parentID])
        return console.log("Missing ID. Probably Shared Folder", parentID);
      if (!directoryTree[parentID].childrenIDs)
        directoryTree[parentID].childrenIDs = [];
      directoryTree[parentID].childrenIDs.push(file.id);
    }
  });

  function calculateSizeRecursively(file) {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      file.quotaBytesUsed = 0;
      if (file.childrenIDs)
        file.childrenIDs.forEach(id => {
          file.quotaBytesUsed += calculateSizeRecursively(directoryTree[id]);
        })
    }
    if (isNaN(parseInt(file.quotaBytesUsed)))
      return 0;
    return parseInt(file.quotaBytesUsed);
  }

  calculateSizeRecursively(directoryTree['root']);

  return directoryTree;
}

export const fetchDirectoryStructure = (requestedFields=['id', 'name', 'parents', 'mimeType', 'quotaBytesUsed']) => dispatch => {
  Promise.all([fetchAllFolders(requestedFields)(dispatch), fetchAllFiles(requestedFields)(dispatch)])
    .then(([folders, files]) => {
      dispatch(setDirectoryTreeTo(buildDirectoryStructure(folders, files)));
    });
}

// Actions
export const { setFoldersTo, setFilesTo, setDirectoryTreeTo } = directoryTreeSlice.actions;

// Selectors
export const selectFolders = state => state.directoryTree.folders;
export const selectFiles = state => state.directoryTree.files;
export const selectDirectoryTree = state => state.directoryTree.directoryTree;

// Reducer
export default directoryTreeSlice.reducer;
