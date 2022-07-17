require('dotenv').config();

const {
  NODE_ENV, JWT_SECRET, PORT = 3000,
} = process.env;

const FORBIDDEN_MESSAGE = 'Access to the requested resource is forbidden';

const USER_NOT_FOUND_MESSAGE = 'No user with matching id found';

const INCOREC_CREDENTIALS_MESSAGE = 'Incorrect email or password';

const BAD_REQUEST_MESSAGE = 'Bad request';

const ARTICLE_NOT_FOUND_MESSAGE = 'Article not found';

const AUTH_ERROR_MESSAGE = 'Authorization required';

const SERVER_ERROR_MESSAGE = 'An error ocurred on the server';

const NO_ARTICLES_ERROR_MESSAGE = 'No articles to display';

const USER_EXISTS_ERROR_MESSAGE = 'User already exists';

const SECRET_KEY_DEV_MODE = 'dev-secret';

const MONGO_ADRESS = 'mongodb://localhost:27017/newsexplorerdb';

module.exports = {
  NODE_ENV,
  JWT_SECRET,
  PORT,
  MONGO_ADRESS,
  FORBIDDEN_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  INCOREC_CREDENTIALS_MESSAGE,
  BAD_REQUEST_MESSAGE,
  ARTICLE_NOT_FOUND_MESSAGE,
  AUTH_ERROR_MESSAGE,
  SERVER_ERROR_MESSAGE,
  NO_ARTICLES_ERROR_MESSAGE,
  USER_EXISTS_ERROR_MESSAGE,
  SECRET_KEY_DEV_MODE,
};
