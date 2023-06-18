const usersModel = require('../models/user');

const getUsers = (req, res) => {
  usersModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const getUserById = (req, res) => {
  usersModel
    .findById(req.params.userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createUser = (req, res) => {
  usersModel
    .create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const updateProfile = (req, res) => {
  const newProfileData = req.body;
  usersModel
    .findByIdAndUpdate(req.user._id, newProfileData, {
      new: true,
      runValidators: true,
      upsert: false,
    })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const updateAvatar = (req, res) => {
  const newUserAvatar = req.body;
  usersModel
    .findByIdAndUpdate(req.user._id, newUserAvatar, {
      new: true,
    })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
