const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const UserExistsError = require('../errors/UserExistsError')

const getUserById = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user with matching id found');
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
        throw new UserExistsError('User already exists');
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
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(200).send({ token, user });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        throw new NotFoundError('Incorrect email or password');
      }
      next(err);
    })
    .catch(next);
};

module.exports = { createUser, getUserById, login };
