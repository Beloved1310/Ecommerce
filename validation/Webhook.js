const Joi = require('joi');

module.exports = function validate(req) {
  const schema = Joi.object({
    status: Joi.string().min(3).max(300).required(),
    message: Joi.string().min(3).max(300).required(),

    data: Joi.object().keys({
      id: Joi.number(),
      amount: Joi.mumber(),
      currency: Joi.number,
      created_at: Joi.date(),

      customer: Joi.object().keys({
        id: Joi.alternatives().try(Joi.number()),
        name: Joi.string().min(5).label('First Name').required(),
        email: Joi.email().min(3).max(300).required(),
      }),
    }),
  });
  return schema.validate(req);
};
