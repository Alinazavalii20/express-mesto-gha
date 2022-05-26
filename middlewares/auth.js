const jwt = require('jsonwebtoken');
const { UnAuthtorizeError } = require('../errors/UnAuthtorizeError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'super-secret-key');
  } catch (err) {
    next(new UnAuthtorizeError('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};
