import axios from 'axios';
import credentials from './auth';

const baseUrlDriveAPI = 'https://www.googleapis.com/drive/v3';

export function getAllFilesInFolder (folderID, requestedFields) {
  return getAllFiles(requestedFields, `'${folderID}' in parents`)
}

export function getAllFolders(requestedFields) {
  return new Promise(async (resolve, reject) => {
    const folders = await getAllFiles(requestedFields, "mimeType = 'application/vnd.google-apps.folder'");
    const rootFolder = await getFileByID('root', requestedFields);
    resolve([...folders, rootFolder]);
  });
}

export function getFileByID(ID, requestedFields) {

  return axios.get(baseUrlDriveAPI + '/files/' + ID, {
    headers: { Authorization: `Bearer ${credentials.access_token}`},
    params: {
      fields: `${requestedFields.join(',')}`,
    }
  })
  .then(res => res.data);
}

export function getFiles(requestedFields, pageToken=null, q) {

  return axios.get(baseUrlDriveAPI + '/files', {
    headers: { Authorization: `Bearer ${credentials.access_token}`},
    params: {
      orderBy: "folder,quotaBytesUsed desc",
      q,
      pageSize: 1000,
      fields: `nextPageToken, files(${requestedFields.join(',')})`,
      trashed: 'false',
      pageToken
    }
  })
  .then(res => res.data);
}

export function getAllFiles(requestedFields, query) {
  return new Promise(async (resolve, reject) => {
    let result = [];
    let pageToken = null;
    try {
      do {
        let data = await getFiles(requestedFields, pageToken, query);
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
