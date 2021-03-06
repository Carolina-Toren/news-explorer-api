const express = require('express');

const bodyParser = require('body-parser');

const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
require('dotenv').config();
const mongoose = require('mongoose');
const { errorHandler } = require('./middlewares/errorHandler');
const { PORT, NODE_ENV, MONGO_ADRESS } = require('./utils/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const { limiter } = require('./helpers/limiter');

const app = express();
const router = require('./routes/index');

mongoose.connect(MONGO_ADRESS);

app.use(bodyParser.json());
app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(cors());
app.options('*', cors());
app.use('/', router);

app.use(errorLogger);
app.use(errors());

app.get('*', () => {
  throw new NotFoundError('OOPS! page not found');
});

app.use(errorHandler);

if (NODE_ENV !== 'production') {
  app.listen(PORT, () => {
  // eslint-disable-next-line no-console
    console.log(`App listening at port ${PORT}`);
  });
}
