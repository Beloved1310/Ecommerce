const Joi = require('joi');

module.exports = function validate(req) {
  const schema = Joi.object({
    newPass: Joi.string().min(5).max(255).required(),
    Link: Joi.string().min(3).max(900).required(),
  });
  return schema.validate(req);
};
