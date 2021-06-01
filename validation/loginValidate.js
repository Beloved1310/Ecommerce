const Joi = require('joi');

module.exports = function validate(input) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).max(70).lowercase().required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        )
      )
      .required(),
  });
  return schema.validate(input);
};
