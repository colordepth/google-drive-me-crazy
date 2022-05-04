const refreshTokenRouter = require('express').Router();
const axios = require('axios');

const CREDENTIALS = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
}

refreshTokenRouter.get('/', (req, res) => {
  if (!req.query.refresh_token)
    return res.status(400).end();

  const refresh_token = req.query.refresh_token;
  axios
    .post('https://oauth2.googleapis.com/token', {
      ...CREDENTIALS,
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
      res.status(error.response? error.response.status : 500).json(error);
    })
})

module.exports = refreshTokenRouter;
