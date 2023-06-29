const mongoose = require('mongoose');
const { checkToken } = require('../utils/jwtAuth');

const UnauthorizedError = require('../errors/unauthorizedError'); // 401

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    throw new UnauthorizedError('Вы не авторизованы');
  }

  const token = req.headers.authorization.replace('Bearer ', '');

  try {
    const payload = checkToken(token);

    req.user = {
      _id: new mongoose.Types.ObjectId(payload._id),
    };
    next();
  } catch (err) {
    next(new UnauthorizedError('Вы не авторизованы'));
  }
};

module.exports = auth;
