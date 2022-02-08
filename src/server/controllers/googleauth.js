const googleAuthRouter = require('express').Router();
const {google} = require('googleapis');
const CREDENTIALS = require('./credentials');

const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

const oAuth2Client = new google.auth.OAuth2(
  CREDENTIALS.client_id,
  CREDENTIALS.client_secret,
  CREDENTIALS.redirect_uri
);

const googleLoginUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES
});

googleAuthRouter.get('/', (req, res) => {
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

module.exports = googleAuthRouter;