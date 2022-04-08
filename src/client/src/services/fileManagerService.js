// Gateway for all file management operations requested from React Components
// This service can:
// - trigger directoryTree population
// - get file from drive API or directory tree **depending on availability**
// - trigger file changes update to directoryTree
// - copy paste move upload files
// - calculate file path

import store from './store';
import * as filesFetch from './filesFetch';
import * as filesWrite from './filesWrite';
import * as directoryTreeSlice from './directoryTreeSlice';

export const { createFolder, uploadSelectedFile } = filesWrite;
export const { fetchFileThumbnail, fetchGoogleFileThumbnail } = filesFetch;
export const { fetchDirectoryStructure, selectFilesForUser, selectActiveMajorFetchCount } = directoryTreeSlice;

export function selectEntity(entityID, user) {

  const startTime = new Date();

  return new Promise((resolve) => {
    const state = store.getState();

    const cachedFileCollection = directoryTreeSlice.selectFilesForUser(user.minifiedID)(state);
    const cachedFile = cachedFileCollection && cachedFileCollection.find(file => file.id === entityID);

    const cachedFolderCollection = directoryTreeSlice.selectFoldersForUser(user.minifiedID)(state);
    const cachedFolder = cachedFolderCollection && cachedFolderCollection.find(folder => folder.id === entityID || (folder.isRoot && entityID==='root'));

    if (cachedFile) {
      // console.log("selectEntity resolved cachedFile", (new Date() - startTime).valueOf());
      return resolve(cachedFile);
    }
    if (cachedFolder) {
      // console.log("selectEntity resolved cachedFolder", (new Date() - startTime).valueOf());
      return resolve(cachedFolder);
    }

    filesFetch.fetchEntityByID(user, entityID, ['*'])
      .then(fetchedFile => {
        store.dispatch(directoryTreeSlice.updateFilesAndFolders(user.minifiedID, [fetchedFile]));
        // console.log("selectEntity resolved fetch", (new Date() - startTime).valueOf());
        resolve(fetchedFile);
      })
      .catch(error => console.error("fileManagerService selectEntity", error))
  })
}

export function selectEntitiesInsideFolder(folderID, user, requestedFields) {

  const startTime = new Date();

  return new Promise((resolve) => {
    const state = store.getState();
    const directoryTree = directoryTreeSlice.selectDirectoryTreeForUser(user.minifiedID)(state);
    const cachedFolder = directoryTree && directoryTree[folderID];

    if (cachedFolder) {
      // console.log("selectEntitiesInsideFolder resolved cache", (new Date() - startTime).valueOf());
      if (!cachedFolder.childrenIDs) console.log(cachedFolder);
      return resolve(cachedFolder.childrenIDs.map(id => directoryTree[id]));
    }

    filesFetch.fetchAllEntitiesInFolder(user, folderID, requestedFields)
      .then(files => {
        store.dispatch(directoryTreeSlice.updateFilesAndFolders(user.minifiedID, files));
        // console.log("selectEntitiesInsideFolder resolved fetch", (new Date() - startTime).valueOf());
        resolve(files);
      })
      .catch(error => {
        console.error("fileManagerService selectEntitiesInsideFolder",
          error.message,
          error.response ? error.response.data.error.message : null
        );
      });
  })
}

export function calculatePathFromEntityID(entityID, user) {
  const startTime = new Date();

  return new Promise(async (resolve) => {

    let path = [];
    let currentEntity = await selectEntity(entityID, user);

    do {
      path.unshift(currentEntity);
      const parentID = currentEntity.parents && currentEntity.parents[0];
      currentEntity = parentID && await selectEntity(parentID, user);
    }
    while (currentEntity);

    console.log("calculate path resolved", (new Date() - startTime).valueOf());
    return resolve(path);
  });
}
