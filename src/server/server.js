const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../../.env')});
const express = require('express');
const app = express();

const googleAuthRouter = require('./controllers/googleauth');
const refreshTokenRouter = require('./controllers/refreshtoken');
const revokeTokenRouter = require('./controllers/revoketoken');
const unknownEndpoint = require('./unknownendpoint');


app.use(express.static(path.join(__dirname, "../../static")));
app.use('/app', express.static(path.join(__dirname, "../../client-build/app")));
app.use('/app/*', express.static(path.join(__dirname, "../../client-build/app")));
app.use(process.env.OAUTH_REDIRECT, googleAuthRouter);
app.use('/authenticate/google/refreshtoken', refreshTokenRouter);
app.use('/authenticate/google/revoketoken', revokeTokenRouter);
app.use(unknownEndpoint);

module.exports = app;