const Joi = require('joi');

module.exports = function validate(req) {
  const schema = Joi.object({
    fullname: Joi.string().min(5).label('First Name').required(),
    email: Joi.string().email().min(3).max(300).required(),
    password: Joi.string().alphanum().min(5).max(255).required(),
    gender: Joi.any().valid('F', 'M').required(),
    age: Joi.number().min(1).required(),
    education: Joi.object().keys({
      grade: Joi.any().optional(),
    }),
    experience: Joi.object().keys({
      position: Joi.any().optional(),
      company: Joi.any().optional(),
      location: Joi.any().optional(),
    }),
  });
  return schema.validate(req);
};
