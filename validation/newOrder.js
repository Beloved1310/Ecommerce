const Joi = require('joi');

module.exports = function validate(req) {
  const schema = Joi.object({
    shippingAddress: Joi.object().keys({
      address: Joi.string().alphanum().min(3).max(30).required(),
      city: Joi.alternatives().try(Joi.string()),
      postalCode: Joi.alternatives().try(Joi.string()),
      country: Joi.alternatives().try(Joi.string()),
    }),
    paymentMethod: Joi.string().required(),
    itemsPrice: Joi.number().required(),
    shippingPrice: Joi.string().required(),
    taxPrice: Joi.string().required(),
    totalPrice: Joi.number().required(),
  });
  return schema.validate(req);
};
