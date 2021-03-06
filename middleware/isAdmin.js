/* eslint consistent-return: "off" */

module.exports = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send({ message: 'Invalid Admin Token' });
  }
};
