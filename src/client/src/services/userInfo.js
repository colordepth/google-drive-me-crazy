import axios from 'axios';
import credentials from './auth';

const baseUrlDriveAPIv2 = 'https://www.googleapis.com/drive/v2';
const baseUrlDriveAPIv3 = 'https://www.googleapis.com/drive/v3';

export function getAbout(requestedFields) {

  return axios.get(baseUrlDriveAPIv3 + '/about', {
    headers: { Authorization: `Bearer ${credentials.access_token}`},
    params: {
      fields: requestedFields.join(' '),
    }
  })
  .then(res => res.data);
}

export function getQuotaDetails() {

  return axios.get(baseUrlDriveAPIv2 + '/about', {
    headers: { Authorization: `Bearer ${credentials.access_token}`},
    params: {
      fields: 'quotaBytesUsed,quotaBytesUsed,quotaBytesUsedAggregate,quotaBytesUsedInTrash,quotaType,quotaBytesByService'
    }
  })
  .then(res => res.data);
}
