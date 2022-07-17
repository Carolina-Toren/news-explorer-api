const SERVER_ERROR_MESSAGE = require('../utils/constants');

// eslint-disable-next-line no-unused-vars
module.exports.errorHandler = (err, req, res, next) => {
  res.status(err.statusCode).send({
    message:
      err.statusCode === 500 ? SERVER_ERROR_MESSAGE : err.message,
  });
  next();
};
