const Article = require('../models/article');
const BadRequestError = require('../errors/badRequestError');
const ForbiddentError = require('../errors/ForbiddentError');
const NotFoundError = require('../errors/NotFoundError');

const getAllArticles = (req, res, next) => {
  const { _id } = req.user;
  Article.find({ }).select('+owner')
    .then((articlesData) => {
      if (articlesData.length === 0) {
        throw new NotFoundError('No articles to display');
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
        throw new BadRequestError('Bad request');
      }
      res.status(200).send(newArticle);
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const { articlesId } = req.params;
  Article.findById({ _id: articlesId }).select('+owner')
    .then((article) => {
      /* eslint eqeqeq: 0 */
      if (article.owner._id != req.user._id) {
        throw new ForbiddentError('Access to the requested resource is forbidden');
      }
      Article.deleteOne({ _id: articlesId }).then(() => {
        res.status(200).json('article has been deleted successfully');
      });
    })
    .catch(() => {
      throw new NotFoundError('No article matching id found');
    })
    .catch(next);
};

module.exports = { getAllArticles, createArticle, deleteArticle };
