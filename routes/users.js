const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  creatUser,
  patchUser,
  patchUsersAvatar,
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/', getUsers);

userRouter.get('/:userId', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), getUser);

userRouter.post('/', creatUser);

userRouter.patch('/me', patchUser);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(http(s)?:\/\/)?(www\.)?[A-Za-zА-Яа-я0-9-]*\.[A-Za-zА-Яа-я0-9-]{2,8}(\/?[\wа-яА-Я#!:.?+=&%@!_~[\]$'*+,;=()-]*)*/),
  }),
}), patchUsersAvatar);

module.exports = userRouter;
