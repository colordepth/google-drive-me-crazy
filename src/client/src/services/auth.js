import axios from 'axios';

// All token information will be encrypted over HTTPS

let refreshTimeout = null;    // TODO: Clear on logout using clearTimeout() and set to null

let credentials = {
  access_token: localStorage.getItem('access_token'),
  refresh_token: localStorage.getItem('refresh_token'),
  expiry_date: new Date(parseInt(localStorage.getItem('expiry_date')))
}

// no use of getAuthInfo for now
export function getAuthInfo() {
  return axios
    .get('https://oauth2.googleapis.com/tokeninfo', {
      params: {
        refresh_token: credentials.refresh_token
      }
    })
    .then(res => res.data);
}

export function refreshToken() {
  if (!credentials.refresh_token)
    return new Promise((resolve, reject) => { reject("Undefined token") });

  return axios.get('/authenticate/google/refreshtoken', {
      params: {
        refresh_token: credentials.refresh_token    // Send a refresh token or access token
      }
    })
    .then(res => res.data)
    .then(async data => {
      credentials = data;

        // Store in browser
      Object.keys(credentials).forEach(key => {
        localStorage.setItem(key, data[key]);
      });
    });
}

// TODO: Fix issue when token expires on FileList loading.
// In case of network error, keep refreshing token? or ask user to refresh
export function setTokenRefreshTimeout() {
  if (refreshTimeout)
    clearTimeout(refreshTimeout);

  refreshTimeout = setTimeout(() => {
    refreshToken()
      .then(setTokenRefreshTimeout)
      .catch(error => {
        console.error(JSON.stringify(error));
        console.error(error.toJSON());
      })
    },
    (credentials.expiry_date - new Date()) - 10000     // 10 seconds before token expiry date
  );
}

export default credentials;
