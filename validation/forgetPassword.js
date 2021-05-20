const Joi = require('joi');

module.exports = function validate(req) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).max(300).required(),
  });
  return schema.validate(req);
};
