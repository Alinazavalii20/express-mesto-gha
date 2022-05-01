const express = require('express');

const {
  getUsers,
  getUser,
  creatUser,
  patchUser,
  patchUsersAvatar
} = require('../controllers/users');

const userRouter = express.Router()

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUser);
userRouter.post('/', creatUser);
userRouter.patch('/me', patchUser);
userRouter.patch('/me/avatar', patchUsersAvatar);

module.exports = userRouter;