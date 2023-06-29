const routerUser = require('express').Router();
const usersController = require('../controllers/users');
const { validateGetUserById, validateUpdateProfile, validateUpdateAvatar } = require('../middlewares/validate');

routerUser.get('/', usersController.getUsers);
routerUser.get('/:userId', validateGetUserById, usersController.getUserById);
routerUser.post('/', usersController.createUser);

routerUser.patch('/me', validateUpdateProfile, usersController.updateProfile);
routerUser.patch('/me/avatar', validateUpdateAvatar, usersController.updateAvatar);

module.exports = routerUser;
