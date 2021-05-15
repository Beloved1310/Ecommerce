const Joi = require('joi');

module.exports = function validate(req) {
  const schema = Joi.object({
    status: Joi.string().min(3).max(300).required(),
    message: Joi.string().min(3).max(300).required(),

    data: Joi.object().keys({
      id: Joi.alternatives().try(Joi.number()),
      amount: Joi.alternatives().try(Joi.number()),
      currency: Joi.alternatives().try(Joi.string()),
      created_at: Joi.alternatives().try(Joi.string()),

      customer: Joi.object().keys({
        id: Joi.alternatives().try(Joi.number()),
        name: Joi.alternatives().try(Joi.string()),
        email: Joi.alternatives().try(Joi.string()),
      }),
    }),
  });
  return schema.validate(req);
};
