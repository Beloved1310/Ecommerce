const Joi = require('joi');

module.exports = function validate(req) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    quantity: Joi.number().required(),
    price: Joi.number().required(),
    delivery: Joi.object()
      .keys({
        address: Joi.string().min(3).max(30).required(),
        city: Joi.any(),
        postalCode: Joi.any(),
        country: Joi.any(),
      })
      .and('address'),

    shippingPrice: Joi.number().required,
  });
  return schema.validate(req);
};
