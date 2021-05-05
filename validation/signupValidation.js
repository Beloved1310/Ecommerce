const Joi = require("joi");

module.exports = function validate(req) {
  const schema = Joi.object({
    fullname: Joi.string().min(5).required(),
    email: Joi.string().email().min(3).max(300).required(),
    password: Joi.string().min(5).max(255).required(),
    gender: Joi.string().min(1).required(),
    age: Joi.number().min(1).required(),
    education: Joi.object().keys({
      grade: Joi.alternatives().try(Joi.string()),
    }),
    experience: Joi.object().keys({
      position: Joi.alternatives().try(Joi.string()),
      company: Joi.alternatives().try(Joi.string()),
      location: Joi.alternatives().try(Joi.string()),
    }),
  });
  return schema.validate(req);
};
