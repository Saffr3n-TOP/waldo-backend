const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const logger = require('morgan');
const createError = require('http-errors');
const router = require('./routes/index');

const app = express();

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.DB_URI, { dbName: process.env.DB_NAME })
  .catch((err) => console.error(err));

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    store: new MongoStore({
      client: mongoose.connection.getClient(),
      dbName: process.env.DB_NAME
    })
  })
);

app.use('/', router);

app.use((req, res, next) => next(createError(404, 'Not Found')));
app.use(
  /**
   * @param {import('http-errors').HttpError} err
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  (err, req, res, next) => {
    const isDevEnv = process.env.NODE_ENV === 'development';

    const status =
      err.status < 500 || isDevEnv
        ? err.status || 500
        : 500;

    const message =
      status < 500 || isDevEnv
        ? err.message || 'Unknown Error'
        : 'Server Error';

    const error = { status, message };
    isDevEnv && (error.stack = err.stack);

    res.status(status).json({ error });
  }
);

const port = +process.env.PORT || 3000;
app.listen(port, () => console.log(`App is available on port ${port}`));
