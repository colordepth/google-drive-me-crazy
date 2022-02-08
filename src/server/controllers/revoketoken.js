const axios = require('axios');
const revokeTokenRouter = require('express').Router();

revokeTokenRouter.get('/', (req, res) => {
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

module.exports = revokeTokenRouter;