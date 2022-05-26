const jwt = require('jsonwebtoken');
const { UnAuthtorizeError } = require('../errors/UnAuthtorizeError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization) {
    next(new UnAuthtorizeError('Необходима авторизация'));
  } else {
    let payload;
    const token = authorization;
    try {
      payload = jwt.verify(token, 'super-secret-key');
    } catch (err) {
      return next(new UnAuthtorizeError('Необходима авторизация'));
    }
    req.user = payload;
    next();
  }
};
