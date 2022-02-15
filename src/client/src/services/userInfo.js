import axios from 'axios';
import credentials from './auth';

const baseUrlDriveAPI = 'https://www.googleapis.com/drive/v3';

export function getAbout(requestedFields) {

  return axios.get(baseUrlDriveAPI + '/about', {
    headers: { Authorization: `Bearer ${credentials.access_token}`},
    params: {
      fields: requestedFields.join(' '),
    }
  })
  .then(res => res.data);
}