module.exports = function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      res.status(ex.status || 500).send({ message: ex.message });
      next(ex);
    }
  };
};
