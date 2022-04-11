import axios from 'axios';
var Buffer = require('buffer').Buffer;

const baseUrlDriveAPIv2 = 'https://www.googleapis.com/drive/v2';
const baseUrlDriveAPIv3 = 'https://www.googleapis.com/drive/v3';

export function getAbout(credentials, requestedFields) {

  return axios.get(baseUrlDriveAPIv3 + '/about', {
    headers: { Authorization: `Bearer ${credentials.accessToken}`},
    params: {
      fields: requestedFields.join(' '),
    }
  })
  .then(res => res.data)
  .then(data => {
    return {
      ...data.user,
      minifiedID: Buffer.from((parseInt(data.user.permissionId)).toString(16), 'hex').toString('base64'),
    }
  });
}

export function getQuotaDetails(credentials) {

  return axios.get(baseUrlDriveAPIv2 + '/about', {
    headers: { Authorization: `Bearer ${credentials.accessToken}`},
    params: {
      fields: 'quotaBytesUsed,quotaBytesUsedAggregate,quotaBytesUsedInTrash,quotaType,quotaBytesByService,quotaBytesTotal'
    }
  })
  .then(res => res.data);
}
