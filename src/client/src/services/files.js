import axios from 'axios';

const baseUrlDriveAPI = 'https://www.googleapis.com/drive/v3';

export function getFileByID(credentials, fileID, requestedFields) {

  return axios.get(baseUrlDriveAPI + '/files/' + fileID, {
    headers: { Authorization: `Bearer ${credentials.accessToken}`},
    params: {
      fields: `${requestedFields.join(',')}`,
    }
  })
  .then(res => res.data);
}

export function getFiles(credentials, requestedFields, pageToken=null, q, additionalQuery) {

  const query = !additionalQuery ? q : q.concat(' and ' + additionalQuery);
  // console.log(query);

  return axios.get(baseUrlDriveAPI + '/files', {
    headers: { Authorization: `Bearer ${credentials.accessToken}`},
    params: {
      orderBy: "folder,name",
      q: query,
      // q: q ? "'drive' in spaces and " + q : "'drive' in spaces",
      pageSize: 1000,
      fields: `nextPageToken, files(${requestedFields.join(',')})`,
      trashed: 'false',
      pageToken
    }
  })
  .then(res => res.data);
}

export function getAllFiles(credentials, requestedFields, query, additionalQuery) {
  return new Promise(async (resolve, reject) => {
    let result = [];
    let pageToken = null;
    try {
      do {
        let data = await getFiles(credentials, requestedFields, pageToken, query, additionalQuery);
        pageToken = data.nextPageToken;
        result.push(...data.files); 
      }
      while (!!pageToken);
    }
    catch (error) {
      reject(error);
    }
    resolve(result);
  });
}

export function getAllFolders(credentials, requestedFields, additionalQuery) {
  return new Promise(async (resolve, reject) => {
    try {
      const folders = await getAllFiles(credentials, requestedFields, "mimeType = 'application/vnd.google-apps.folder'");
      const rootFolder = await getFileByID(credentials, 'root', requestedFields);
      rootFolder.isRoot = true;
      resolve([...folders, rootFolder]);
    }
    catch (error) { reject(error); }
  });
}

export function getAllFilesInFolder (credentials, folderID, requestedFields, additionalQuery) {
  return getAllFiles(credentials, requestedFields, `'${folderID}' in parents`, additionalQuery)
}
