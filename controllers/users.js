const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const UserExistsError = require('../errors/UserExistsError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  USER_NOT_FOUND_MESSAGE,
  USER_EXISTS_ERROR_MESSAGE,
  INCOREC_CREDENTIALS_MESSAGE,
  NODE_ENV,
  JWT_SECRET,
  SECRET_KEY_DEV_MODE,
} = require('../utils/constants');

const getUserById = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
      }
      res.status(200).send({ email: user.email, name: user.name });
    })

    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .then((emailExists) => {
      if (emailExists) {
        throw new UserExistsError(USER_EXISTS_ERROR_MESSAGE);
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({ name, email, password: hash }))
          .then((user) => {
            res.status(201).send({
              _id: user._id,
              email: user.email,
              name: user.name,
            });
          });
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password, { new: true, runValidators: true })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY_DEV_MODE, { expiresIn: '7d' });
      res.status(200).send({ token, user });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        throw new UnauthorizedError(INCOREC_CREDENTIALS_MESSAGE);
      }
      next(err);
    })
    .catch(next);
};

module.exports = { createUser, getUserById, login };
