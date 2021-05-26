const Joi = require('joi');

module.exports = function validate(req) {
  const schema = Joi.object({
    image: Joi.string().optional(),
    cloudinary_id: Joi.string().optional(),
    name: Joi.string().optional(),
    quantity: Joi.string().optional(),
    price: Joi.string().optional(),
  });
  return schema.validate(req);
};
