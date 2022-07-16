require('dotenv').config();

const {
  NODE_ENV, PORT = 3000,
} = process.env;

const MONGO_ADRESS = 'mongodb://localhost:27017/newsexplorerdb';

module.exports = { NODE_ENV, PORT, MONGO_ADRESS };
