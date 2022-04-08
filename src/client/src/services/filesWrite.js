import axios from 'axios';
import { humanFileSize } from '../services/filesMiscellaneous';

const baseUrlDriveAPI = 'https://www.googleapis.com/drive/v3';

export function uploadSelectedFile(file, targetFolderID, user) {
  const uploadURI = `https://www.googleapis.com/upload/drive/v3/files`;

  console.log("Uploading", file);

  axios.post(uploadURI, {
    name: file.name,
    parents: [targetFolderID]
  }, {
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Length': file.size
    },
    params: {
      uploadType: 'resumable'
    }
  })
    .then(async res => {
      const location = res.headers.location;

      if (!location) return;

      var current = 0;

      const baseChunkSize = 256*1024;   // 256 kB required by Google
      const minSizePerRequest = 2*1024*1024;  // 2 megabytes
      const maxSizePerRequest = 100*1024*1024;  // 100 megabytes

      const percentPerRequest = 0.15;    // desired %age of file to upload per request
      const chunkSizeMultiplier = Math.round(percentPerRequest*file.size/baseChunkSize);

      const desiredSizeByPercentage = Math.min(Math.max(minSizePerRequest, chunkSizeMultiplier*baseChunkSize), maxSizePerRequest);
      const desiredSizePerRequest = 20*1024*1024;    // desired size of file to upload per request


      // Pick minimum of 20 megabytes and 15%
      const bytesPerRequest = Math.min(desiredSizePerRequest, desiredSizeByPercentage);

      do {
        console.log(`currently at ${humanFileSize(current)}. ${Math.round(1000*(current+1)/file.size)/10}%`);

        try {
          const res = await axios.put(location, file.slice(current, current + bytesPerRequest), {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
              'Content-Range': `bytes ${current}-${Math.min(current + bytesPerRequest, file.size)-1}/${file.size}`
            }
          })

          console.log('File uploaded!', res.data);
        }
        catch (error) {
          if (!error.response) {
            console.error("Network error");
            console.error(error);
          }
          else if (Math.floor(error.response.status/100) === 5) {
            console.error("Upload interrupted!");
            console.error(error);
          }
          else {
            // console.log(error.response.status);  // 308 means upload next chunk
          }
        }
        finally {
          current += bytesPerRequest;
        }
      }
      while (current < file.size);

    })
    .catch(error => {
      console.error(error);
      console.error(error.response);
    })
}

export function createFolder(name, parentFolderID, user) {
  const mimeType = 'application/vnd.google-apps.folder';
  const createURI = baseUrlDriveAPI + '/files';

  axios.post(createURI, {
    name,
    mimeType,
    parents: [parentFolderID]
  }, {
    headers: { Authorization: `Bearer ${user.accessToken}`},
  })
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.error(error);
      console.error(error.response);
    })
}
