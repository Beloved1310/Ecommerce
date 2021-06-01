const Joi = require('joi');

module.exports = function validate(input) {
  const schema = Joi.object({
    token: Joi.string().max(900).required(),
  });
  return schema.validate(input);
};
