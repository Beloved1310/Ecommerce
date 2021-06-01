const Joi = require('joi');

module.exports = function validate(input) {
  const schema = Joi.object({
    image: Joi.string().optional(),
    cloudinary_id: Joi.string().optional(),
    name: Joi.string().optional(),
    quantity: Joi.number().positive().optional(),
    price: Joi.string().positive().optional(),
  });
  return schema.validate(input);
};
