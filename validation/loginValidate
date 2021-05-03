const Joi = require('joi');

module.exports = function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(3).max(300).required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}