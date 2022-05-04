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
import * as filesUpdate from './filesUpdate';
import * as directoryTreeSlice from './directoryTreeSlice';

export const { createFolder, uploadSelectedFile } = filesWrite;
export const { fetchFileThumbnail, fetchGoogleFileThumbnail } = filesFetch;
export const { fetchDirectoryStructure, selectFilesForUser, selectActiveMajorFetchCount, selectDirectoryTreeForUser } = directoryTreeSlice;

function checkAncestor(entityAncestorID, entityDescendantID, credentials) {
  return calculatePathFromEntityID(entityDescendantID, credentials)
    .then(entityList => {
      console.log("Ancestor", entityList);
      return !!entityList.find(entity => entity.id === entityAncestorID);
    })
}

export function renameEntity(entityID, newName, credentials) {

  return filesUpdate.renameEntity(entityID, newName, credentials)
    .then(result => {
      store.dispatch(directoryTreeSlice.updateFilesAndFolders(credentials.minifiedID, [result]));
      store.dispatch(directoryTreeSlice.recalculateDirectoryTree(credentials.minifiedID));
      return result;
    })
}

export function addFileToTag(entityID, [key, value], credentials) {
  return filesUpdate.updateProperty(entityID, [key.replace(' ', '&'), value], credentials)
    .then(result => {
      store.dispatch(directoryTreeSlice.updateFilesAndFolders(credentials.minifiedID, [result]));
      store.dispatch(directoryTreeSlice.recalculateDirectoryTree(credentials.minifiedID));
      return result;
    })
}

export function moveEntitiesToFolder(entities, targetFolderID, credentials) {

  return new Promise(async (resolve, reject) => {
    for (const entity of entities) {
      // Cannot an entity into its descendant
      const validMove = await checkAncestor(entity.id, targetFolderID, credentials);
  
      console.log(validMove);

      if (validMove) {
        return reject('Cannot move entity into its descendant folders');
      }
    }

    let promises = [];

    entities.forEach(entity => {
      promises.push(filesUpdate.changeParentFolder(entity, targetFolderID, credentials));
    });

    Promise.all(promises)
      .then(results => {
        store.dispatch(directoryTreeSlice.updateFilesAndFolders(credentials.minifiedID, results));
        // TODO: NOTE: Do not recalculate directory tree like this directly.
        // After initial directory tree has be calculated, check Google Drive for changes and only then recalculate tree
        if (directoryTreeSlice.selectDirectoryTreeForUser(credentials.minifiedID)(store.getState()))
          store.dispatch(directoryTreeSlice.recalculateDirectoryTree(credentials.minifiedID));
        resolve(results);
      })
      .catch(error => reject(error))
  })
}

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

export function selectEntitiesInsideFolder(folderID, user, requestedFields, additionalQuery) {

  const startTime = new Date();
  // console.log(store.getState().directoryTree['qvuQXkR7SAA='].directoryTree['171e19sj7XgVNlBiN9og-RijRkoUvdYxt']);
  return new Promise((resolve) => {
    const state = store.getState();
    const directoryTree = directoryTreeSlice.selectDirectoryTreeForUser(user.minifiedID)(state);
    const cachedFolder = directoryTree && directoryTree[folderID];

    if (cachedFolder) {
      // console.log("selectEntitiesInsideFolder resolved cache", (new Date() - startTime).valueOf());
      if (!cachedFolder.childrenIDs) console.log(cachedFolder);
      return resolve(cachedFolder.childrenIDs.map(id => directoryTree[id]));
    }

    filesFetch.fetchAllEntitiesInFolder(user, folderID, requestedFields, additionalQuery)
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

export function selectEntitiesInsideTag(tagName, user) {

  const startTime = new Date();
  return new Promise((resolve) => {
    const state = store.getState();
    const directoryTree = directoryTreeSlice.selectDirectoryTreeForUser(user.minifiedID)(state);

    if (directoryTree) {
      return resolve(Object.keys(directoryTree)
        .filter(id => directoryTree[id].appProperties && directoryTree[id].appProperties[tagName.replace(' ', '&')])
        .map(id => directoryTree[id])
      )
    }
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
