const Joi = require('joi');

module.exports = function validate(input) {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().min(3).max(70).required(),
  });
  return schema.validate(input);
};
