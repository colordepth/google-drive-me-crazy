require('dotenv').config({path: path.join(__dirname, '../../.env')});
const express = require('express');
const path = require('path');
const {google} = require('googleapis');
const axios = require('axios');
const app = express();

const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

const CREDENTIALS = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: process.env.BASE_URL + process.env.OAUTH_REDIRECT
}

app.use(express.static(path.join(__dirname, "../../static")));

const oAuth2Client = new google.auth.OAuth2(
  CREDENTIALS.client_id,
  CREDENTIALS.client_secret,
  CREDENTIALS.redirect_uri
);

const googleLoginUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES
});

app.get(process.env.OAUTH_REDIRECT, (req, res) => {
  // if success, supply token and redirect to home
  // if error, explain why we need permission
  // if no code, redirect to google auth

  if ('code' in req.query)
    supplyAccessToken(res, req.query.code);
  else if ('error' in req.query)
    authError(res, req.query.error);
  else
    res.redirect(googleLoginUrl);
});

const supplyAccessToken = (res, code) => {;
  oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return res.status(401).end();   // TODO: Handle error

      res.end(`
        <script>
          const response = ${JSON.stringify(token)}
            Object.keys(response).forEach(key => {
              localStorage.setItem(key, response[key]);
            })
          window.location.replace('/app')
        </script>
      `)
  })
}

// TODO
const authError = (res, error) => {
  // page with status 401 ?
  console.log('in error');
  res.redirect('/');
}

app.get('/authenticate/google/refreshtoken', (req, res) => {
  if (!req.query.refresh_token)
    return res.status(400).end();

  const refresh_token = req.query.refresh_token;
  axios
    .post('https://oauth2.googleapis.com/token', {
      client_id: CREDENTIALS.client_id,
      client_secret: CREDENTIALS.client_secret,
      grant_type: 'refresh_token',
      refresh_token
    })
    .then(res => res.data)
    .then(data => {
      data.expiry_date= (new Date().valueOf() + parseInt(data.expires_in)*1000);
      res.send(JSON.stringify(data));
    })
    .catch(error => {
      console.error(error);
      res.status(error.response.status).send(JSON.stringify(error));
    })
})

app.get('/authenticate/google/revoketoken', (req, res) => {
  if (!req.query.token)   // Can be refresh token or access token
    return res.status(400).end();

  const token = req.query.token;    

  axios
    .post('https://oauth2.googleapis.com/revoke', { token })
    .then(revokeResponse => {
      res.status(200).send(JSON.stringify(revokeResponse.data));
    })
    .catch(error => {
      res.status(error.response.status).send(error.toJSON());
    })
})

module.exports = app;
