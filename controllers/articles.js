const Article = require('../models/article');
const BadRequestError = require('../errors/badRequestError');
const ForbiddentError = require('../errors/ForbiddentError');
const NotFoundError = require('../errors/NotFoundError');
const {
  FORBIDDEN_MESSAGE,
  BAD_REQUEST_MESSAGE,
  ARTICLE_NOT_FOUND_MESSAGE,
  NO_ARTICLES_ERROR_MESSAGE,
} = require('../utils/constants');

const getAllArticles = (req, res, next) => {
  const { _id } = req.user;
  Article.find({ }).select('+owner')
    .then((articlesData) => {
      if (articlesData.length === 0) {
        throw new NotFoundError(NO_ARTICLES_ERROR_MESSAGE);
      } else {
        const userArticles = articlesData.filter((article) => article.owner.toHexString() === _id);
        res.status(200).send(userArticles);
      }
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title,
    text, date,
    source,
    link,
    image,
    owner = req.user._id,
  } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })

    .then((newArticle) => {
      if (!newArticle) {
        throw new BadRequestError(BAD_REQUEST_MESSAGE);
      }
      res.status(200).send(newArticle);
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const { articlesId } = req.params;
  Article.findById({ _id: articlesId }).select('+owner')
    .then((article) => {
      if (article.owner._id.toString() !== req.user._id) {
        throw new ForbiddentError(FORBIDDEN_MESSAGE);
      }
      Article.deleteOne({ _id: articlesId }).then(() => {
        res.status(200).json('article has been deleted successfully');
      });
    })
    .catch(() => {
      throw new NotFoundError(ARTICLE_NOT_FOUND_MESSAGE);
    })
    .catch(next);
};

module.exports = { getAllArticles, createArticle, deleteArticle };
