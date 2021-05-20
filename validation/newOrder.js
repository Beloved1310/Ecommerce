const Joi = require('joi');

module.exports = function validate(req) {
  const schema = Joi.object({
    productId: Joi.string().required(),
    tx_ref: Joi.string().required(),
    currency: Joi.string().required(),
    amount: Joi.number().valid(Joi.in('totalPrice')),
    redirect_url: Joi.string().required(),
    payment_options: Joi.string().required(),
    customer: Joi.object()
      .keys({
        email: Joi.string(),
        phonenumber: Joi.number(),
        name: Joi.string(),
      })
      .and('email'),
    shippingAddress: Joi.object()
      .keys({
        address: Joi.string().min(3).max(30).required(),
        city: Joi.any(),
        postalCode: Joi.any(),
        country: Joi.any(),
      })
      .and('address'),
    paymentMethod: Joi.string().required(),
    itemsPrice: Joi.number().required(),
    shippingPrice: Joi.number().required(),
    taxPrice: Joi.number().required(),
    totalPrice: Joi.number().required(),
  });
  return schema.validate(req);
};
