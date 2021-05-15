const Joi = require('joi');

module.exports = function validate(req) {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    quantity: Joi.string().max(300).required(),
    price: Joi.number().required(),
  });
  return schema.validate(req);
};
