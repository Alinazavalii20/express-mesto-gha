const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnAuthtorizeError = require('../errors/UnAuthtorizeError');

const DUPLICATE_MONGOOSE_ERROR = 11000;

module.exports.getUsers = async (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError({ message: 'Пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError({ message: 'Невалидный id пользователя' }));
        return;
      }
      next(err);
    });
};

module.exports.creatUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(200).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.name === DUPLICATE_MONGOOSE_ERROR) {
        throw new ConflictError({ message: 'Данный email уже зарегестрирован.' });
      } else if (err.name === 'ValidationError') {
        throw new BadRequestError({ message: 'Передан неверный логин или пароль.' });
      }
      next();
    })
    .catch(next);
};

module.exports.patchUser = async (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(BadRequestError({ message: 'Переданы некорректные данные' }));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError({ message: 'Передан некорретный Id' }));
      }
      next(err);
    });
};

module.exports.patchUsersAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError({ message: 'Введены некорретные данные' }));
      }

      if (err.name === 'CastError') {
        return next(new BadRequestError({ message: 'Передан некорретный Id' }));
      }

      next(err);
    });
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'super-secret-key',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      next(new UnAuthtorizeError({ message: err.message }));
    });
};
