const cardsModel = require('../models/card');

const BadRequestError = require('../errors/badRequestError'); // 400
const NotFoundError = require('../errors/notFoundError'); // 404
const ForbiddenError = require('../errors/forbiddenError'); // 403

const getCards = (req, res, next) => {
  cardsModel
    .find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточки не найдены');
      }
      res.status(200).send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  const likes = [];
  const createdAt = Date().now;
  cardsModel
    .create({
      name,
      link,
      owner,
      likes,
      createdAt,
    })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  cardsModel
    .findByIdAndRemove(req.params.cardId)
    .orFail(new NotFoundError('Карточки с таким Id не существует'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не владелец карточки');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Карточка с таким Id не найдена'));
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  cardsModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Картинка не найдена');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорретный Id'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  cardsModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Картинка не найдена');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорретный Id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
