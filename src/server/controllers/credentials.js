const CREDENTIALS = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: process.env.BASE_URL + process.env.OAUTH_REDIRECT
}

module.exports = CREDENTIALS;