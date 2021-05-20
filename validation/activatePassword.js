const Joi = require('joi');

module.exports = function validate(req) {
  const schema = Joi.object({
    token: Joi.string().number().max(900).required(),
  });
  return schema.validate(req);
};
