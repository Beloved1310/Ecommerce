const Joi = require('joi');

module.exports = function validate(input) {
  const schema = Joi.object({
    resetPassword: Joi.string()
      .pattern(
        new RegExp(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        )
      )
      .required(),
    link: Joi.string().min(3).max(900).required(),
  });
  return schema.validate(input);
};
