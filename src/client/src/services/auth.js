import axios from 'axios';

// All token information will be encrypted over HTTPS

let refreshTimeout = null;    // TODO: Clear on logout using clearTimeout() and set to null

let credentials = {
  expiry_date: new Date(parseInt(localStorage.getItem('expiry_date')))
}

// no use of getAuthInfo for now
export function getAuthInfo() {
  return axios
    .get('https://oauth2.googleapis.com/tokeninfo', {
      params: {
        access_token: credentials.access_token
      }
    })
    .then(res => res.data);
}

export function refreshToken(user) {
  if (!(user && user.refreshToken))
    return new Promise((resolve, reject) => { reject("Undefined refresh token") });

  return axios.get('/authenticate/google/refreshtoken', {
      params: {
        refresh_token: user.refreshToken    // Send a refresh token or access token
      }
    })
    .then(res => res.data)
}

// TODO: Fix issue when token expires on FileList loading.
// In case of network error, keep refreshing token? or ask user to refresh

export default credentials;
