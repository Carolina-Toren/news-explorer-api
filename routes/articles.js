const express = require('express');

const router = express.Router();
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../helpers/validator');

const { getAllArticles, createArticle, deleteArticle } = require('../controllers/articles');

router.get('/', getAllArticles);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required().min(2).max(30),
      text: Joi.string().required().min(2).max(30),
      title: Joi.string().required().min(2).max(30),
      date: Joi.string().required().min(6).max(10),
      source: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(validateURL),
      image: Joi.string().required().custom(validateURL),

    }),
  }),
  createArticle,
);

router.delete(
  '/:articlesId',
  celebrate({
    params: Joi.object()
      .keys({
        articlesId: Joi.string().hex().length(24),
      })
      .unknown(true),
  }),
  deleteArticle,
);

module.exports = router;
