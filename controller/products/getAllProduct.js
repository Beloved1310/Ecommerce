const Product = require('../../Model/Products');

module.exports = async (req, res) => {
  const data = await Product.find();
  return res.send({ message: 'Products', data });
};
