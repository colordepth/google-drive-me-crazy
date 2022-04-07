import axios from 'axios';
var Buffer = require('buffer').Buffer;

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

export function getAllFilesInFolder(credentials, folderID, requestedFields, additionalQuery) {
  return getAllFiles(credentials, requestedFields, `'${folderID}' in parents`, additionalQuery)
}

export function fetchFileThumbnail(file, credentials) {

  if (!file) return new Promise((res, rej) => rej('file'));
  if (!file.thumbnailLink) new Promise((res, rej) => rej('thumbnailLink'));

  return fetch(file.thumbnailLink, {
    
    referrerPolicy: 'no-referrer'
  })
  .then(response => response.blob());

  
}

export function fetchGoogleFileThumbnail(file, credentials) {
  // Require access_token appended to end of url

  if (!file) return new Promise((res, rej) => rej('file'));
  if (!file.thumbnailLink) new Promise((res, rej) => rej('thumbnailLink'));

  
  // let headers = new Headers();

  // headers.append('Content-Type', 'image/jpeg');
  // headers.append('Accept', 'image/jpeg');
  // headers.append('Authorization', `Bearer ${credentials.accessToken}`);
  // headers.append('Origin','http://localhost:3000');
  // headers.append('Content-Type', 'application/x-www-form-urlencoded');

  return fetch(file.thumbnailLink + `&access_token=${credentials.accessToken}`, {
    // mode: 'no-cors',
    // credentials: 'include',
    // method: 'GET',
    // headers: headers,
    // secure: 'false',
    referrerPolicy: 'no-referrer'
  })
  .then(response => response.blob());

  return axios.get(file.thumbnailLink, {
    withCredentials: true,
    secure: 'false',
    headers: {
      // Authorization: `Bearer ${credentials.accessToken}`,
      // 'referrer-policy': 'no-referrer',
      // 'Referrer-Policy': 'no-referrer',
      // 'access-control-allow-origin': '*',
      // "Access-Control-Allow-Origin": "*",
      // 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
  .then(res => res.data);
}

export function humanFileSize(size) {
  var i = !size ? 0 : Math.floor( Math.log(size) / Math.log(1024) );
  return ( size / Math.pow(1024, i) ).toFixed(1) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};
