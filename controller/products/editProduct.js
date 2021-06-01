/* eslint-disable camelcase */

const Product = require('../../Model/Products');
const cloudinary = require('../../utilis/cloudinary');

const putproductValidation = require('../../validation/putprodutValidation');

module.exports = async (req, res) => {
  const { value, error } = putproductValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });
  const product = await Product.findById(req.params.id);
  if (req.file) {
    await cloudinary.uploader.destroy(product.cloudinary_id);
    const { secure_url: image, public_id: cloudinary_id } =
      await cloudinary.uploader.upload(req.file.path);
    await Product.updateOne(
      { _id: req.params.id },
      {
        $set: {
          image,
          cloudinary_id,
        },
      }
    );
  }

  const { name, price, quantity } = value;
  await Product.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name,
        price,
        quantity,
      },
    }
  );

  const data = await Product.find({ _id: req.params.id });
  return res.status(200).json({ message: 'Product updated', data });
};
