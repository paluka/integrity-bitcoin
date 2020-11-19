import express from 'express';
import dotenv from 'dotenv';
import httpRequestLogger from 'morgan';
import cookieParser from 'cookie-parser';
import http from 'http';
import path from 'path';
import expressSession from 'express-session';
import passport from 'passport';
import Auth0Strategy from 'passport-auth0';

import { logger } from './services/logger';
import userRouter from './routes/user/user.routes';

dotenv.config();

const port = process.env.SERVER_PORT || 3000;
const app = express();

app.set('port', port);

const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {} as any, // { path: '/', httpOnly: true, secure: false, maxAge: null }
  resave: false,
  saveUninitialized: false,
};

if (app.get('env') === 'production') {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL,
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    /**
     * Access tokens are used to authorize users to an API
     * (resource server)
     * accessToken is the token to call the Auth0 API
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    return done(null, profile);
  },
);

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(httpRequestLogger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/user', userRouter);

const server = http.createServer(app);

server.listen(port, () => {
  logger.info(`server started at http://localhost:${port}`);
});
