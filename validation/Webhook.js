const Joi = require('joi');

module.exports = function validate(req) {
  const schema = Joi.object({
    status: Joi.string().min(3).max(300).required(),
    message: Joi.string().min(3).max(300).required(),

    data: Joi.object().keys({
      id: Joi.number(),
      amount: Joi.number(),
      currency: Joi.string(),
      created_at: Joi.date(),

      customer: Joi.object().keys({
        id: Joi.number(),
        name: Joi.string().min(5).label('First Name').required(),
        email: Joi.string().email().min(3).max(300).required(),
      }),
    }),
  });
  return schema.validate(req);
};
