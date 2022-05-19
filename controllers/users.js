const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  BadRequestError,
  UnAuthtorizeError,
  NotFoundError,
  ServerError,
} = require('../utils/utils');

module.exports.getUsers = async (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ServerError).send({ message: 'ошибка' }));
};

module.exports.getUser = async (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NotFoundError).send({ message: 'Пользователь не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequestError).send({ message: 'Невалидный id пользователя' });
      } else {
        res.status(ServerError).send({ message: 'ошибка' });
      }
    });
};

module.exports.creatUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequestError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(UnAuthtorizeError).send({ message: 'Передан неверный логин или пароль.' });
      }
    });
};

module.exports.patchUser = async (req, res) => {
  const { name, about } = req.body;
  if (!name || !about) {
    return res.status(BadRequestError).send({ message: 'Поля должны быть заполнены' });
  }
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(NotFoundError).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequestError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ServerError).send({ message: 'ошибка' });
      }
    });
};

module.exports.patchUsersAvatar = async (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(BadRequestError).send({ message: 'Поле должно быть заполнено' });
  }
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(NotFoundError).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequestError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ServerError).send({ message: 'ошибка' });
      }
    });
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(BadRequestError).send({ message: 'Переданы некорректные данные' });
      }
      return bcrypt.compare(password, user.password);
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'super-secret-key',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      res.status(UnAuthtorizeError).send({ message: err.message });
    });
};
