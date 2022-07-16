const express = require('express');
const { celebrate, Joi } = require('celebrate');

const userRouter = require('./users');
const articleRouter = require('./articles');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

const router = express.Router();

router.use('/users', auth, userRouter);
router.use('/articles', auth, articleRouter);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

module.exports = router;
