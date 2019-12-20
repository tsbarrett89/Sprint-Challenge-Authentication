const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const session = require('express-session')

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

server.use(helmet());
server.use(cors(corsOptions));
server.use(express.json());

server.use(
  session({
    name: 'sid', 
    secret: 'bugs',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, 
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
  })
);

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

module.exports = server;