/* eslint no-useless-escape: "off" */

const Joi = require('joi');

module.exports = function validate(input) {
  const schema = Joi.object({
    fullname: Joi.string().min(5).trim().required(),
    email: Joi.string().email().min(3).max(50).lowercase().required().trim(),
    password: Joi.string()
      .pattern(
        new RegExp(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        )
      )
      .required()
      .label(
        'Password must contain atleat one Capital letter, small letter, special symbol and must not be less than 8 characters'
      ),
    gender: Joi.string().valid('F', 'M').required(),
  });
  return schema.validate(input);
};
