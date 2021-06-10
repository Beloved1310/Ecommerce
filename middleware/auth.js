/* eslint consistent-return: "off" */

const jwt = require('jsonwebtoken');
const { JWT } = require('../config');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res
      .status(401)
      .send({ message: 'Access denied. No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({ message: 'Invalid token.' });
  }
};
