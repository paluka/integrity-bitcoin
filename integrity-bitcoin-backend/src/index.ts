import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import http from 'http';

import userRouter from './routes/users/users.routes';

dotenv.config();

const port = process.env.SERVER_PORT || 3000;
const app = express();

app.set('port', port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', userRouter);

const server = http.createServer(app);

server.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
