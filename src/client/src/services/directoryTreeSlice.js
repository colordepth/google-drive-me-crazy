import { createSlice } from '@reduxjs/toolkit';
import { fetchAllFolders, fetchThousandEntities } from './filesFetch.js';
import { selectUsers } from './userSlice.js';
import store from './store';

/*
 * Files and folders are different for optimization's sake
 * Folders list will be separately fetched, and its' tree data structure built.
 * This will generate a directory tree quicker and will allow for faster navigation 
 * and generating file paths instead of recursively calling Google for parent folder information
*/

export const directoryTreeSlice = createSlice({
  name: 'directoryTree',
  initialState: {},
  reducers: {
    clearFetchStatus: (state, action) => {
      const userID = action.payload;

      if (!userID) return;

      if (!state[userID]) {
        state[userID] = { status: { activeMajorFetches: 0 }, folders: null, files: null, directoryTree: null, userID };
      }

      state[userID].status.activeMajorFetches = 0;
    },
    incrementMajorActiveFetch: (state, action) => {
      const userID = action.payload;
      
      if (!state[userID]) {
        state[userID] = { status: { activeMajorFetches: 0 }, folders: null, files: null, directoryTree: null, userID };
      }

      state[userID].status.activeMajorFetches += 1;
    },
    decrementMajorActiveFetch: (state, action) => {
      const userID = action.payload;
      
      if (!state[userID]) {
        state[userID] = { status: { activeMajorFetches: 0 }, folders: null, files: null, directoryTree: null, userID };
      }

      state[userID].status.activeMajorFetches -= 1;
    },
    setFoldersTo: (state, action) => {
      // sets and removes folders. if folder already exists, append the attributes.
      const userID = action.payload.userID;

      if (!state[userID]) {
        state[userID] = { status: { activeMajorFetches: 0 }, folders: null, files: null, directoryTree: null, userID };
      }

      if (!state[userID].folders) {
        state[userID].folders = action.payload.folders;
        return;
      }

      // For folders that are both in payload and existing state,
      // update the values and add new keys in the state
      // For folders that are in existing state but not in the payload,
      // remove them from the state
      // Also dont copy 'quotaBytesUsed' for folders
      // O(N) average
      
      let newFolders = action.payload.folders;

      let originalStateFolderMap = {};
      state[userID].folders.forEach(folder => originalStateFolderMap[folder.id] = folder);

      newFolders
        .map(folder => {
          return {...originalStateFolderMap[folder.id], ...folder, };
        });
      
      state[userID].folders = newFolders;
    },
    setFilesTo: (state, action) => {
      // sets and removes files. if file already exists, append the attributes.

      const userID = action.payload.userID;

      if (!state[userID]) {
        state[userID] = { status: { activeMajorFetches: 0 }, folders: null, files: null, directoryTree: null, userID };
      }

      if (!state[userID].files) {
        state[userID].files = action.payload.files;
        return;
      }

      let newFiles = action.payload.files;
      let originalStateFileMap = {};

      state[userID].files.forEach(file => originalStateFileMap[file.id] = file);

      newFiles
        .map(file => {
          return {...originalStateFileMap[file.id], ...file};
        });
      
      state[userID].files = newFiles;
    },
    updateFiles: (state, action) => {
      // Add files and update files provided. Does not remove files.

      const userID = action.payload.userID;
      const newFiles = action.payload.files;

      if (!state[userID]) {
        state[userID] = { status: { activeMajorFetches: 0 }, folders: null, files: null, directoryTree: null, userID };
      }

      if (!state[userID].files) {
        state[userID].files = action.payload.files;
        return;
      }

      let originalStateFileMap = {};
      state[userID].files.forEach(file => originalStateFileMap[file.id] = file);

      newFiles
        .forEach(file => {
          if (!originalStateFileMap[file.id]) {
            originalStateFileMap[file.id] = file;
            state[userID].files.push(file);
          }
          Object.keys(file).forEach(key => {
            originalStateFileMap[file.id][key] = file[key];
          })
        });

    },
    updateFolders: (state, action) => {
      // Add folders and update folders provided. Does not remove folders.

      const userID = action.payload.userID;

      if (!state[userID]) {
        state[userID] = { status: { activeMajorFetches: 0 }, folders: null, files: null, directoryTree: null, userID };
      }

      if (!state[userID].folders) {
        state[userID].folders = action.payload.folders;
        return;
      }
      
      let newFolders = action.payload.folders;

      let originalStateFolderMap = {};
      state[userID].folders.forEach(folder => originalStateFolderMap[folder.id] = folder);

      newFolders
      .forEach(folder => {
        if (!originalStateFolderMap[folder.id]) {
          originalStateFolderMap[folder.id] = folder;
          state[userID].folders.push(folder);
        }
        Object.keys(folder).forEach(key => {
          originalStateFolderMap[folder.id][key] = folder[key];
        })
      });
    },
    setDirectoryTreeTo: (state, action) => {
      // Absolute setter

      const userID = action.payload.userID;

      if (!state[userID]) {
        state[userID] = { status: { activeMajorFetches: 0 }, folders: null, files: null, directoryTree: null, userID };
      }

      if (!state[userID].directoryTree) {
        state[userID].directoryTree = action.payload.directoryTree;
      }
      else {
        let newTree = action.payload.directoryTree;

        Object.keys(newTree).forEach(key => {
          newTree[key] = {...state[userID].directoryTree[key], ...newTree[key]};
        });

        state[userID].directoryTree = newTree;
      }
    },
    recalculateDirectoryTree: (state, action) => {
      // uses state[id].folders and state[id].files to rebuild a fresh directory tree.
      // also calculates folder size.

      const userID = action.payload;

      if (!state[userID]) return;

      const files = state[userID].files;
      const folders = state[userID].folders;
      const directoryTree = buildDirectoryStructure(folders, files);

      if (directoryTree) state[userID].directoryTree = directoryTree;
    }
  }
});

export const getAllFolders = (userID, requestedFields=['id', 'name', 'parents', 'mimeType', 'quotaBytesUsed'], additionalQuery) => dispatch  => {
  const allUsers = selectUsers(store.getState());
  const user = allUsers.find(user => user.minifiedID === userID);

  if (!user) return;

  dispatch(incrementMajorActiveFetch(user.minifiedID));

  return fetchAllFolders(user, requestedFields, additionalQuery)
    .then(folders => {
      dispatch(updateFolders({userID: user.minifiedID, folders}));
      dispatch(decrementMajorActiveFetch(user.minifiedID));
      return folders;
    });
}

export const getAllFiles = (userID, requestedFields=['id', 'name', 'parents', 'mimeType', 'quotaBytesUsed'], additionalQuery) => dispatch  => {
  const allUsers = selectUsers(store.getState());
  const user = allUsers.find(user => user.minifiedID === userID);

  if (!user) return;

  dispatch(incrementMajorActiveFetch(user.minifiedID));

  return new Promise(async (resolve, reject) => {
    let pageToken = null;

    try {
      do {
        let data = await fetchThousandEntities(user, requestedFields, pageToken, "mimeType != 'application/vnd.google-apps.folder'", additionalQuery);
        dispatch(updateFiles({userID: user.minifiedID, files: data.files}));
        pageToken = data.nextPageToken;
      }
      while (!!pageToken);
    }
    catch (error) {
      reject(error);
    }

    dispatch(decrementMajorActiveFetch(user.minifiedID));
    resolve();
  });
}

function buildDirectoryStructure(folders, files) {
  if (!folders) {
    return;
  }

  let allFiles = [...folders, ...files];
  let directoryTree = {};

  folders.forEach(folder => {
    // Clear childrenIDs

    if (!folder.childrenIDs)
      folder.childrenIDs = [];

    folder.childrenIDs.length = 0;
  })

  allFiles.forEach(file => {
    directoryTree[file.id] = file;
    if (file.isRoot)
      directoryTree['root'] = directoryTree[file.id];
  });

  var noParent = 0;

  allFiles.forEach(file => {
    if (file.parents) {
      const parentID = file.parents[0];
      if (!directoryTree[parentID])
        return console.log("Missing parent object. What's this?", parentID);
      directoryTree[parentID].childrenIDs.push(file.id);
    }
    else {
      noParent += 1;
    }
  });

  console.log("noparent", noParent);

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

export const fetchDirectoryStructure = (userID) => dispatch => {
  // Fetches all files and folders.
  // Builds tree, calculates foldersize and sets directoryTree to it.

  const fieldsForDirectoryTree = ['id', 'parents', 'mimeType', 'quotaBytesUsed'];
  const fieldsForStorageAnalyzer = ['id', 'mimeType', 'quotaBytesUsed'];
  
  const remainingFieldsForFolderList = ['id', 'name', 'iconLink', 'modifiedTime', 'viewedByMeTime'];
  const remainingFieldsForFileList = remainingFieldsForFolderList.concat('webViewLink');

  const miscFields = ['id', 'owners', 'version', 'trashed', 'explicitlyTrashed', 'thumbnailLink',
    'createdTime', 'sharingUser', 'lastModifyingUser', 'md5Checksum', 'exportLinks',
    'capabilities', 'hasThumbnail', 'trashingUser', 'trashedTime', 'permissionIds', 'starred'
  ];
  // Note: thumbnail link expires after a few hours. it must be refreshed forcibly, cant be cached

  Promise.all([
      getAllFiles(userID, fieldsForStorageAnalyzer, "'me' in owners")(dispatch),

      getAllFiles(userID, remainingFieldsForFileList, "'me' in owners")(dispatch),
      getAllFolders(userID, remainingFieldsForFolderList, "'me' in owners")(dispatch),

      getAllFiles(userID, fieldsForDirectoryTree, "'me' in owners")(dispatch),
      getAllFolders(userID, fieldsForDirectoryTree, "'me' in owners")(dispatch),

      getAllFiles(userID, fieldsForDirectoryTree, "not ('me' in owners)")(dispatch),
      getAllFolders(userID, fieldsForDirectoryTree, "not ('me' in owners)")(dispatch),

      getAllFiles(userID, remainingFieldsForFileList, "not ('me' in owners)")(dispatch),
      getAllFolders(userID, remainingFieldsForFolderList, "not ('me' in owners)")(dispatch),
    ])
    .then(() => {
      dispatch(recalculateDirectoryTree(userID));
    })
  
  Promise.all([
      getAllFiles(userID, miscFields, "'me' in owners")(dispatch),
      getAllFolders(userID, miscFields, "'me' in owners")(dispatch),
      getAllFiles(userID, miscFields, "not ('me' in owners)")(dispatch),
      getAllFolders(userID, miscFields, "not ('me' in owners)")(dispatch)
    ])
}

export const updateFilesAndFolders = (userID, filesFoldersList) => dispatch => {
  const files = filesFoldersList.filter(file => file.mimeType !== "application/vnd.google-apps.folder");
  const folders = filesFoldersList.filter(file => file.mimeType === "application/vnd.google-apps.folder");

  dispatch(updateFiles({ userID, files }));
  dispatch(updateFolders({ userID, folders }));
}

// Actions
export const {
  clearFetchStatus,
  incrementMajorActiveFetch,
  decrementMajorActiveFetch,
  setFoldersTo,
  setFilesTo,
  setStatus,
  setDirectoryTreeTo,
  updateFiles,
  updateFolders,
  recalculateDirectoryTree
} = directoryTreeSlice.actions;

// Selectors
// usage: const folders = useSelector(selectFoldersForUserID(user_id));

export const selectFoldersForUser = userID =>
  state => state.directoryTree[userID] && state.directoryTree[userID].folders;

export const selectFilesForUser = userID =>
  state => state.directoryTree[userID] && state.directoryTree[userID].files;

export const selectDirectoryTreeForUser = userID =>
  state => state.directoryTree[userID] && state.directoryTree[userID].directoryTree;

export const selectStoreStatusForUser = userID =>
  state => state.directoryTree[userID] && state.directoryTree[userID].status;

export const selectActiveMajorFetchCount = userID =>
  state => state.directoryTree[userID] && state.directoryTree[userID].status.activeMajorFetches;

// Reducer
export default directoryTreeSlice.reducer;
