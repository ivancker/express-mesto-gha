const bcrypt = require('bcryptjs');

const usersModel = require('../models/user');
const { signToken } = require('../utils/jwtAuth');

const MONGO_DUPLICATE_KEY_ERROR = 11000;
const SALT_ROUNDS = 10;

const NotFoundError = require('../errors/notFoundError'); // 404
const BadRequestError = require('../errors/badRequestError'); // 400
const ConflictError = require('../errors/conflictError'); // 409
const UnauthorizedError = require('../errors/unauthorizedError'); // 401

const getUsers = (req, res, next) => {
  usersModel
    .find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены');
      }
      res.send(users);
    })
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  usersModel
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный Id'));
      } else next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS).then((hash) => {
    usersModel
      .create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
      .then(() => {
        res.status(201).send({
          name,
          about,
          avatar,
          email,
        });
      })
      .catch((err) => {
        if (err.code === MONGO_DUPLICATE_KEY_ERROR) next(new ConflictError('Пользователь уже существует'));
        else next(err);
      });
  });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  usersModel
    .findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new UnauthorizedError('UnautorizedError');
    })
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, isEqual]) => {
      if (!isEqual) {
        throw new UnauthorizedError('Пользователь или пароль неверный');
      }

      const token = signToken({ _id: user._id });

      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === 'UnautorizedError') {
        next(new UnauthorizedError('Пользователь или пароль неверный'));
      } next(err);
    });
};

const updateProfile = (req, res, next) => {
  const newProfileData = req.body;
  usersModel
    .findByIdAndUpdate(req.user._id, newProfileData, {
      new: true,
      runValidators: true,
      upsert: false,
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const newUserAvatar = req.body;
  usersModel
    .findByIdAndUpdate(req.user._id, newUserAvatar, {
      new: true,
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      } else next(err);
    });
};

const getUserInfo = (req, res, next) => {
  usersModel
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => next(err));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  loginUser,
  updateProfile,
  updateAvatar,
  getUserInfo,
};
