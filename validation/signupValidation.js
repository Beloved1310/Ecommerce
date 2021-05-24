const Joi = require('joi');

module.exports = function validate(req) {
  const schema = Joi.object({
    fullname: Joi.string().min(5).label('fullname').required(),
    email: Joi.string().email().min(3).max(300).required(),
    password: Joi.string().alphanum().min(5).max(255).required(),
    gender: Joi.string().valid('F', 'M').required(),
  });
  return schema.validate(req);
};
