const Product = require('../../Model/Products');

module.exports = async (req, res) => {
  const data = await Product.findById(req.params.id);

  return res.send({ message: 'Product', data });
};
