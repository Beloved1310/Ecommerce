/* eslint-disable camelcase */
const Joi = require('joi');

module.exports = function validate(input) {
  const {
    data: { id, tx_ref, amount, status, currency, created_at, customer } = {},
  } = input;
  const schema = Joi.object({
    data: Joi.object().keys({
      id: Joi.number().required(),
      tx_ref: Joi.string().required(),
      amount: Joi.number().required(),
      currency: Joi.string().required(),
      status: Joi.string().required(),
      created_at: Joi.date().required(),

      customer: Joi.object().keys({
        id: Joi.number().required(),
        fullname: Joi.string().required(),
        email: Joi.string().email().min(3).max(300).lowercase().required(),
      }),
    }),
  });
  return schema.validate({
    data: { id, tx_ref, amount, status, currency, created_at, customer },
  });
};
